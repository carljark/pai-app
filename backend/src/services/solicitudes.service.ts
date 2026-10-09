import { Notification } from '../models/Notification';
import { ESTADOS_CICLO, ESTADOS_SOLICITUD, Solicitud } from '../models/Solicitud';
import type { EstadoCiclo, EstadoSolicitud, ISolicitud } from '../models/Solicitud';
import { OFERTA_FP_IB, findCicloOferta, tipoNivelDeCodigo } from '../data/oferta-fp-ib';

/** Máximo de solicitudes abiertas (pendientes o en curso) por docente. */
export const MAX_SOLICITUDES_ABIERTAS = 5;
const MAX_CICLOS = 30;
const MAX_OTROS = 10;

export class SolicitudError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Oferta de FP con el nivel del catálogo que ya incorpora cada ciclo (`disponible`). */
export const ofertaConDisponibilidad = () =>
  OFERTA_FP_IB.map((c) => ({ ...c, disponible: tipoNivelDeCodigo(c.codigo) }));

const texto = (valor: unknown, max: number): string =>
  typeof valor === 'string' ? valor.trim().slice(0, max) : '';

const listaDeTextos = (valor: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(valor)
    ? [...new Set(valor.map((v) => texto(v, maxLen)).filter(Boolean))].slice(0, maxItems)
    : [];

/** Convierte los códigos de la oferta y los ciclos escritos a mano en ciclos de la solicitud. */
function ciclosPedidos(body: any) {
  const codigos = listaDeTextos(body?.ciclos, MAX_CICLOS, 10)
    .filter((codigo) => findCicloOferta(codigo));
  const otros = listaDeTextos(body?.otros, MAX_OTROS, 120);
  return [
    ...codigos.map((codigo) => ({
      codigo,
      estado: (tipoNivelDeCodigo(codigo) ? 'disponible' : 'pendiente') as EstadoCiclo,
    })),
    ...otros.map((nombre) => ({ nombre, estado: 'pendiente' as EstadoCiclo })),
  ];
}

async function comprobarLimite(userId: string) {
  const abiertas = await Solicitud.countDocuments({ userId, status: { $in: ['pendiente', 'en_curso'] } });
  if (abiertas >= MAX_SOLICITUDES_ABIERTAS) {
    throw new SolicitudError(409, `Ya tienes ${MAX_SOLICITUDES_ABIERTAS} solicitudes abiertas`);
  }
}

export async function crearSolicitud(user: any, body: any) {
  const nombre = texto(body?.centro?.nombre, 120);
  if (!nombre) throw new SolicitudError(400, 'El nombre del centro es obligatorio');
  const ciclos = ciclosPedidos(body);
  if (ciclos.length === 0) throw new SolicitudError(400, 'Elige al menos un ciclo');
  await comprobarLimite(user._id);
  const solicitud = await Solicitud.create({
    userId: user._id,
    userName: user.name || 'Usuario',
    userEmail: user.email || '',
    idioma: body?.idioma === 'ca' ? 'ca' : 'es',
    centro: { nombre, municipio: texto(body?.centro?.municipio, 80), web: texto(body?.centro?.web, 200) },
    ciclos,
    comentario: texto(body?.comentario, 1000),
  });
  return conDetalle(solicitud);
}

/** Ciclo con sus nombres de la oferta y el estado recalculado con el catálogo actual. */
function cicloConDetalle(ciclo: any) {
  const oferta = findCicloOferta(ciclo.codigo);
  const tipoNivel = tipoNivelDeCodigo(ciclo.codigo);
  const estado = ciclo.estado === 'pendiente' && tipoNivel ? 'disponible' : ciclo.estado;
  return {
    _id: ciclo._id, codigo: ciclo.codigo, nombre: ciclo.nombre, tarea: ciclo.tarea, estado, tipoNivel,
    etapa: oferta?.etapa, nombre_es: oferta?.nombre_es ?? ciclo.nombre, nombre_ca: oferta?.nombre_ca ?? ciclo.nombre,
  };
}

export function conDetalle(solicitud: ISolicitud) {
  const plain = solicitud.toObject();
  return { ...plain, ciclos: plain.ciclos.map(cicloConDetalle) as CicloDetalle[] };
}

export async function listarDeUsuario(userId: string) {
  const solicitudes = await Solicitud.find({ userId }).sort({ createdAt: -1 });
  return solicitudes.map(conDetalle);
}

export async function listarTodas() {
  const solicitudes = await Solicitud.find().sort({ createdAt: -1 });
  return solicitudes.map(conDetalle);
}

type CicloDetalle = ReturnType<typeof cicloConDetalle>;
type CicloPendiente = Omit<CicloDetalle, '_id' | 'estado' | 'tarea' | 'tipoNivel'> & { solicitudes: string[] };

const resumenCiclo = ({ codigo, nombre, etapa, nombre_es, nombre_ca }: CicloDetalle, id: string): CicloPendiente =>
  ({ codigo, nombre, etapa, nombre_es, nombre_ca, solicitudes: [id] });

/**
 * Ciclos que faltan por incorporar en las solicitudes abiertas, sin duplicados entre
 * solicitudes. Lo usa la skill `procesar-solicitudes` (solo lectura).
 */
export async function resumenPendientes() {
  const abiertas = (await Solicitud.find({ status: { $in: ['pendiente', 'en_curso'] } }).sort({ createdAt: 1 }))
    .map(conDetalle);
  const ciclos = new Map<string, CicloPendiente>();
  for (const solicitud of abiertas) {
    for (const ciclo of solicitud.ciclos.filter((c: CicloDetalle) => c.estado === 'pendiente')) {
      const clave = ciclo.codigo || `otro:${ciclo.nombre?.toLowerCase()}`;
      const previo = ciclos.get(clave);
      if (previo) previo.solicitudes.push(String(solicitud._id));
      else ciclos.set(clave, resumenCiclo(ciclo, String(solicitud._id)));
    }
  }
  const resumenSolicitudes = abiertas.map(({ _id, centro, userName, status, createdAt, comentario }) =>
    ({ _id, centro, userName, status, createdAt, comentario }));
  return { solicitudes: resumenSolicitudes, ciclosPendientes: [...ciclos.values()] };
}

function aplicarCambiosCiclos(solicitud: ISolicitud, cambios: unknown) {
  if (!Array.isArray(cambios)) return;
  for (const cambio of cambios) {
    const ciclo = solicitud.ciclos.id(cambio?._id);
    if (!ciclo) throw new SolicitudError(400, 'Ciclo no encontrado en la solicitud');
    if (cambio.estado !== undefined && !ESTADOS_CICLO.includes(cambio.estado)) {
      throw new SolicitudError(400, 'Estado de ciclo no válido');
    }
    if (cambio.estado !== undefined) ciclo.estado = cambio.estado;
    if (cambio.tarea !== undefined) ciclo.tarea = texto(cambio.tarea, 10);
  }
}

/** Cambios del administrador: estado, notas y estado o tarea de cada ciclo. */
export async function actualizarSolicitud(id: string, body: any) {
  const solicitud = await Solicitud.findById(id).catch(() => null);
  if (!solicitud) throw new SolicitudError(404, 'Solicitud no encontrada');
  if (body?.status !== undefined && !ESTADOS_SOLICITUD.includes(body.status)) {
    throw new SolicitudError(400, 'Estado no válido');
  }
  const statusAnterior = solicitud.status;
  aplicarCambiosCiclos(solicitud, body?.ciclos);
  if (body?.status !== undefined) solicitud.status = body.status;
  if (body?.adminNotes !== undefined) solicitud.adminNotes = texto(body.adminNotes, 2000);
  await solicitud.save();
  if (solicitud.status !== statusAnterior) await avisarDocente(solicitud);
  return conDetalle(solicitud);
}

const AVISOS: Record<'es' | 'ca', { title: string; estados: Partial<Record<EstadoSolicitud, string>> }> = {
  es: {
    title: 'Solicitud de centro',
    estados: { en_curso: 'está en curso', completada: 'se ha completado', descartada: 'se ha descartado' },
  },
  ca: {
    title: 'Sol·licitud de centre',
    estados: { en_curso: 'està en curs', completada: "s'ha completat", descartada: "s'ha descartat" },
  },
};

/** Avisa al docente del nuevo estado de su solicitud, en el idioma en que la envió. */
async function avisarDocente(solicitud: ISolicitud) {
  const aviso = AVISOS[solicitud.idioma];
  const estado = aviso.estados[solicitud.status];
  if (!estado) return;
  const prefijo = solicitud.idioma === 'ca' ? 'La sol·licitud del centre' : 'La solicitud del centro';
  await Notification.create({
    recipientId: solicitud.userId,
    type: 'INFO',
    title: aviso.title,
    message: `${prefijo} «${solicitud.centro.nombre}» ${estado}.`,
    status: solicitud.status,
  });
}

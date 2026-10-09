export type EtapaFp = 'FPB' | 'CFGM' | 'CFGS';
export type EstadoCiclo = 'disponible' | 'pendiente' | 'incorporado' | 'descartado';
export type EstadoSolicitud = 'pendiente' | 'en_curso' | 'completada' | 'descartada';

export const ESTADOS_CICLO: readonly EstadoCiclo[] = [
  'disponible',
  'pendiente',
  'incorporado',
  'descartado',
];
export const ESTADOS_SOLICITUD: readonly EstadoSolicitud[] = [
  'pendiente',
  'en_curso',
  'completada',
  'descartada',
];

/** Ciclo de la oferta de FP de las Illes Balears (`GET /api/solicitudes/oferta`). */
export interface CicloOferta {
  codigo: string;
  etapa: EtapaFp;
  familia_es: string;
  familia_ca: string;
  nombre_es: string;
  nombre_ca: string;
  /** Nivel del catálogo que ya incorpora el ciclo, o `null` si falta. */
  disponible: string | null;
}

export interface CicloSolicitado {
  _id: string;
  codigo?: string;
  nombre?: string;
  etapa?: EtapaFp;
  nombre_es?: string;
  nombre_ca?: string;
  estado: EstadoCiclo;
  tarea?: string;
  tipoNivel?: string | null;
}

export interface Solicitud {
  _id: string;
  userName: string;
  userEmail: string;
  idioma: 'es' | 'ca';
  centro: { nombre: string; municipio: string; web: string };
  ciclos: CicloSolicitado[];
  comentario: string;
  status: EstadoSolicitud;
  adminNotes: string;
  createdAt: string;
}

export interface CrearSolicitudDto {
  centro: { nombre: string; municipio: string; web: string };
  ciclos: string[];
  otros: string[];
  comentario: string;
  idioma: 'es' | 'ca';
}

export interface ActualizarSolicitudDto {
  status?: EstadoSolicitud;
  adminNotes?: string;
  ciclos?: { _id: string; estado?: EstadoCiclo; tarea?: string }[];
}

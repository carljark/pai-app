import mongoose, { Document } from 'mongoose';

export type EstadoCiclo = 'disponible' | 'pendiente' | 'incorporado' | 'descartado';
export type EstadoSolicitud = 'pendiente' | 'en_curso' | 'completada' | 'descartada';

export const ESTADOS_CICLO: readonly EstadoCiclo[] = ['disponible', 'pendiente', 'incorporado', 'descartado'];
export const ESTADOS_SOLICITUD: readonly EstadoSolicitud[] = ['pendiente', 'en_curso', 'completada', 'descartada'];

/** Ciclo pedido: de la oferta (`codigo`) o escrito a mano por el docente (`nombre`). */
export interface ICicloSolicitado {
  _id: mongoose.Types.ObjectId;
  codigo?: string;
  nombre?: string;
  estado: EstadoCiclo;
  /** Número de la tarea (`tareas/NNN_*.md`) que incorporó el ciclo. */
  tarea?: string;
}

export interface ISolicitud extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  /** Idioma de la interfaz del docente al enviarla; se usa para avisarle. */
  idioma: 'es' | 'ca';
  centro: { nombre: string; municipio: string; web: string };
  ciclos: mongoose.Types.DocumentArray<ICicloSolicitado & mongoose.Types.Subdocument>;
  comentario: string;
  status: EstadoSolicitud;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const CicloSchema = new mongoose.Schema({
  codigo: { type: String },
  nombre: { type: String, trim: true },
  estado: { type: String, enum: ESTADOS_CICLO, default: 'pendiente' },
  tarea: { type: String, default: '' },
});

const SolicitudSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  idioma: { type: String, enum: ['es', 'ca'], default: 'es' },
  centro: {
    nombre: { type: String, required: true, trim: true },
    municipio: { type: String, default: '', trim: true },
    web: { type: String, default: '', trim: true },
  },
  ciclos: { type: [CicloSchema], default: [] },
  comentario: { type: String, default: '', trim: true },
  status: { type: String, enum: ESTADOS_SOLICITUD, default: 'pendiente', index: true },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

export const Solicitud = mongoose.model<ISolicitud>('Solicitud', SolicitudSchema, 'solicitudes');

import type { EditLock } from '../../projects/models/collaboration.model';

/** Usuario poblado por Mongoose o solo su id. */
export type UserRef = string | { _id?: string; name?: string; email?: string };

/** Subconjunto del proyecto que el backend adjunta a los eventos SSE. */
export interface RawEventProject {
  userId?: UserRef;
  createdAt?: string | Date;
  generationTimeMs?: number;
  generationStartedAt?: string | Date;
  errorDetail?: string;
  modules?: string[];
  ras?: string[];
  phase?: string;
  status?: string;
}

/** Notificación tal como la persiste el backend (colección `notifications`). */
export interface DbNotification {
  _id?: string;
  id?: string;
  type?: string;
  title?: string;
  message?: string;
  error?: string;
  errorDetail?: string;
  status?: string;
  phase?: string;
  projectId?: string;
  userId?: UserRef;
  userName?: string;
  userEmail?: string;
  modules?: string[];
  rasCount?: number;
  readBy?: string[];
  generationTimeMs?: number;
  generationStartedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/** Elemento de la actividad reciente: una notificación o un proyecto del historial. */
export interface ActivityItem {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  status?: string;
  phase?: string;
  error?: string;
  errorDetail?: string;
  modules?: string[];
  ras?: string[];
  rasCount?: number;
  userId?: UserRef;
  userName?: string;
  userEmail?: string;
  generationTimeMs?: number;
  generationStartedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  timestamp?: string | Date;
}

export interface RawNotificationEvent {
  type: string;
  projectId?: string;
  project?: RawEventProject;
  error?: string;
  errorDetail?: string;
  status?: string;
  phase?: string;
  rasCount?: number;
  message?: string;
  title?: string;
  userName?: string;
  userEmail?: string;
  modules?: string[];
  generationTimeMs?: number;
  generationStartedAt?: Date | string;
  notification?: DbNotification;
  /** Turno de edición (eventos `PROJECT_EDIT_LOCK`). */
  lock?: EditLock | null;
}

export interface AppNotification {
  id: string;
  /** `INVITATION`: invitación personal a colaborar en un proyecto. */
  type: 'COMPLETED' | 'ERROR' | 'STATUS' | 'INFO' | 'INVITATION';
  title: string;
  message: string;
  error?: string;
  errorDetail?: string;
  projectId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  modules?: string[];
  rasCount?: number;
  phase?: string;
  status?: string;
  generationTimeMs?: number;
  generationStartedAt?: Date | string;
  timestamp: Date;
  updatedAt?: Date;
  read: boolean;
}

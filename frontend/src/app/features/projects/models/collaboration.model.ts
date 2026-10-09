/** Turno de edición vigente de un proyecto (`GET/POST /api/projects/:id/edit-lock`). */
export interface EditLock {
  userId: string;
  userName: string;
  expiresAt: string | Date;
  /** Milisegundos restantes según el reloj del servidor. */
  remainingMs: number;
}

export interface EditLockResponse {
  lock: EditLock | null;
}

/** Evento SSE que avisa a autor y colaboradores de que el turno cambió. */
export interface EditLockEvent {
  projectId: string;
  lock: EditLock | null;
}

/** Entrada del registro de cambios (`GET /api/projects/:id/changes`). */
export interface ProjectChange {
  id: string;
  action: string;
  userId?: string;
  userName: string;
  userEmail: string;
  details: { instruction?: string; filename?: string; target?: string; status?: string };
  createdAt: string | Date;
}

/** Mismo plazo que el backend (`EDIT_LOCK_TTL_MS`): sin actividad, el turno caduca. */
export const EDIT_LOCK_TTL_MS = 2 * 60 * 1000;
/** Mientras se escribe, el turno se renueva como mucho cada 30 s. */
export const EDIT_LOCK_RENEW_MS = 30 * 1000;

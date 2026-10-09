import { Project } from '../models/Project';
import { sendToUser } from './sse.service';
import { participantIdsOf } from './project-access.service';

/** El turno caduca si quien lo tiene no lo renueva (actividad) en este tiempo. */
export const EDIT_LOCK_TTL_MS = 2 * 60 * 1000;

export interface EditLockView {
  userId: string;
  userName: string;
  expiresAt: Date;
  /** Milisegundos restantes según el reloj del servidor (evita desfases con el del cliente). */
  remainingMs: number;
}

/** Turno vigente del proyecto, o `null` si no hay o ya caducó. */
export const activeLockOf = (project: any, now = Date.now()): EditLockView | null => {
  const lock = project?.editLock;
  const expiresAt = lock?.expiresAt ? new Date(lock.expiresAt) : undefined;
  if (!lock?.userId || !expiresAt || expiresAt.getTime() <= now) return null;
  return {
    userId: lock.userId.toString(),
    userName: lock.userName || '',
    expiresAt,
    remainingMs: expiresAt.getTime() - now
  };
};

const notifyLockChange = (project: any, lock: EditLockView | null) => {
  const event = { type: 'PROJECT_EDIT_LOCK', projectId: project._id.toString(), lock };
  participantIdsOf(project).forEach(id => sendToUser(id, event));
};

/**
 * Toma o renueva el turno de `user` con una sola operación condicional (atómica frente a
 * peticiones simultáneas). Si otro usuario lo tiene vigente devuelve `acquired: false`.
 */
export const acquireEditLock = async (projectId: any, user: any) => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + EDIT_LOCK_TTL_MS);
  const updated = await Project.findOneAndUpdate(
    {
      _id: projectId,
      $or: [{ 'editLock.expiresAt': { $not: { $gt: now } } }, { 'editLock.userId': user._id }]
    },
    { $set: { editLock: { userId: user._id, userName: user.name || '', expiresAt } } },
    { returnDocument: 'after' }
  );
  if (updated) {
    const lock = activeLockOf(updated, now.getTime());
    notifyLockChange(updated, lock);
    return { acquired: true, lock };
  }
  const current = await Project.findById(projectId);
  return { acquired: false, lock: activeLockOf(current, now.getTime()) };
};

/** Libera el turno si lo tiene `userId`; devuelve si lo había. */
export const releaseEditLock = async (projectId: any, userId: any): Promise<boolean> => {
  const released = await Project.findOneAndUpdate(
    { _id: projectId, 'editLock.userId': userId },
    { $unset: { editLock: 1 } },
    { returnDocument: 'after' }
  );
  if (released) notifyLockChange(released, null);
  return !!released;
};

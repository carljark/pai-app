import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';
import { canManageCollaborators, ownerIdOf } from '../services/project-access.service';
import { activeLockOf, releaseEditLock } from '../services/edit-lock.service';
import { deleteInvitation, notifyInvitations } from '../services/notification.service';

const loadPopulatedProject = (id: any) =>
  Project.findById(id).populate(PROJECT_POPULATE);

const logAction = (req: any, project: any, action: string, details: Record<string, unknown> = {}) =>
  new ActivityLog({ userId: req.user?._id, action, projectId: project._id, details: { title: project.title, ...details } }).save();

/** Valida la petición de añadir colaborador; devuelve el error o el id del invitado. */
const validateNewCollaborator = (project: any, req: any): { status: number; error: string } | string => {
  if (!project) return { status: 404, error: 'Proyecto no encontrado' };
  if (!canManageCollaborators(project, req.user)) {
    return { status: 403, error: 'Solo el autor puede gestionar colaboradores' };
  }
  const collaboratorId = String(req.body?.userId || req.params.userId || '');
  if (!mongoose.isValidObjectId(collaboratorId)) return { status: 400, error: 'Usuario inválido' };
  if (ownerIdOf(project) === collaboratorId) return { status: 400, error: 'El autor ya participa en el proyecto' };
  return collaboratorId;
};

export const addCollaborator = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    const result = validateNewCollaborator(project, req);
    if (typeof result !== 'string') return res.status(result.status).json({ error: result.error });
    const exists = (project!.collaborators || []).some((c: any) => c.userId?.toString() === result);
    if (!exists) {
      project!.collaborators = [...(project!.collaborators || []), { userId: result, addedAt: new Date() }] as any;
      await project!.save();
      await logAction(req, project, 'ADD_COLLABORATOR', { collaboratorId: result });
      await notifyInvitations(project, req.user, [result]);
    }
    res.json(await loadPopulatedProject(project!._id));
  } catch {
    res.status(500).json({ error: 'Error al añadir colaborador' });
  }
};

export const removeCollaborator = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    if (!canManageCollaborators(project, req.user)) {
      return res.status(403).json({ error: 'Solo el autor puede gestionar colaboradores' });
    }
    const collaboratorId = String(req.params.userId);
    project.collaborators = (project.collaborators || []).filter(
      (c: any) => c.userId?.toString() !== collaboratorId
    ) as any;
    await project.save();
    await logAction(req, project, 'REMOVE_COLLABORATOR', { collaboratorId });
    await deleteInvitation(project._id, collaboratorId);
    res.json(await loadPopulatedProject(project._id));
  } catch {
    res.status(500).json({ error: 'Error al quitar colaborador' });
  }
};

/** GET /api/projects/:id/edit-lock — turno vigente o `null`. */
export const getEditLock = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ lock: activeLockOf(project) });
  } catch {
    res.status(500).json({ error: 'Error al consultar el turno de edición' });
  }
};

/** POST /api/projects/:id/edit-lock — los middlewares ya tomaron o renovaron el turno. */
export const takeEditLock = async (req: any, res: Response) => {
  const project = await Project.findById(req.project._id);
  res.json({ lock: activeLockOf(project) });
};

/** DELETE /api/projects/:id/edit-lock — libera el turno de quien lo pide. */
export const leaveEditLock = async (req: any, res: Response) => {
  try {
    const released = await releaseEditLock(req.params.id, req.user?._id);
    res.json({ released });
  } catch {
    res.status(500).json({ error: 'Error al liberar el turno de edición' });
  }
};

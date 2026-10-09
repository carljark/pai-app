import type { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import type { AuthRequest } from './auth.middleware';
import { canEditProject } from '../services/project-access.service';
import { acquireEditLock } from '../services/edit-lock.service';

export interface ProjectRequest extends AuthRequest {
  project?: any;
}

/** El proyecto llega en la ruta (`/:id/...`) o, en la reescritura con IA, en el cuerpo. */
const projectIdOf = (req: ProjectRequest): string =>
  String(req.params?.id || req.body?.projectId || '');

/**
 * Solo el autor, los colaboradores y los administradores pueden modificar el proyecto:
 * el resto recibe 403 (para ellos es de solo lectura). Deja el proyecto en `req.project`.
 */
export const requireProjectEditor = async (req: ProjectRequest, res: Response, next: NextFunction) => {
  try {
    const id = projectIdOf(req);
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Falta el proyecto o no es válido' });
      return;
    }
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }
    if (!canEditProject(project, req.user)) {
      res.status(403).json({ error: 'Solo el autor y los colaboradores pueden modificar este proyecto' });
      return;
    }
    req.project = project;
    next();
  } catch {
    res.status(500).json({ error: 'Error al comprobar los permisos del proyecto' });
  }
};

/**
 * Toma (o renueva) el turno de edición para quien modifica el proyecto. Si otra persona
 * lo tiene vigente responde 409 con su nombre y el proyecto no cambia.
 */
export const requireEditLock = async (req: ProjectRequest, res: Response, next: NextFunction) => {
  try {
    const { acquired, lock } = await acquireEditLock(req.project._id, req.user);
    if (!acquired) {
      res.status(409).json({ error: `${lock?.userName || 'Otra persona'} está editando el proyecto`, lock });
      return;
    }
    next();
  } catch {
    res.status(500).json({ error: 'Error al tomar el turno de edición' });
  }
};

/** Cadena habitual de las rutas que modifican un proyecto. */
export const projectEditGuards = [requireProjectEditor, requireEditLock];

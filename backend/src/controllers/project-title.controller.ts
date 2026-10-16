import type { Response } from 'express';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';

/** Longitud máxima del nombre de un proyecto. */
export const MAX_TITLE_LENGTH = 150;

/** Normaliza el nombre recibido: sin espacios sobrantes; `null` si está vacío o es demasiado largo. */
export const normalizeTitle = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const title = value.replace(/\s+/g, ' ').trim();
  return title && title.length <= MAX_TITLE_LENGTH ? title : null;
};

/**
 * PATCH /api/projects/:id/title. Cambia el nombre del proyecto. Pueden hacerlo el autor,
 * los colaboradores y los administradores (`requireProjectEditor`); no exige el turno de
 * edición porque el nombre no forma parte del contenido.
 */
export const renameProject = async (req: any, res: Response) => {
  const title = normalizeTitle(req.body?.title);
  if (!title) {
    return res.status(400).json({ error: `El nombre no puede estar vacío ni superar ${MAX_TITLE_LENGTH} caracteres` });
  }
  try {
    const previousTitle = req.project.title;
    const updated = await Project.findByIdAndUpdate(
      req.project._id,
      { $set: { title } },
      { returnDocument: 'after' }
    ).populate(PROJECT_POPULATE);
    await new ActivityLog({
      userId: req.user?._id,
      action: 'RENAME_PROJECT',
      projectId: req.project._id,
      details: { title, previousTitle }
    }).save();
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Error al renombrar el proyecto' });
  }
};

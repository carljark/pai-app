import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';
import {
  CLONABLE_STATUSES, copyProjectFiles, createClone, toContentLanguage,
} from '../services/project-clone.service';

/** Copia los adjuntos sin anular la copia si fallan: el proyecto ya está creado. */
const copyFilesSafely = async (fromId: string, toId: string) => {
  try {
    await copyProjectFiles(fromId, toId);
  } catch (error) {
    console.error(`No se pudieron copiar los archivos del proyecto ${fromId} a ${toId}:`, error);
  }
};

/** POST /api/projects/:id/clone — crea una copia del proyecto a nombre de quien la pide. */
export const cloneProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Id de proyecto no válido' });
    const original = await Project.findById(id).lean();
    if (!original) return res.status(404).json({ error: 'Proyecto no encontrado' });
    if (!CLONABLE_STATUSES.includes(original.status as string)) {
      return res.status(409).json({ error: 'Solo se pueden copiar proyectos terminados' });
    }
    const clone = await createClone(original, req.user._id, toContentLanguage(req.body?.language));
    await copyFilesSafely(String(original._id), String(clone._id));
    await new ActivityLog({
      userId: req.user._id,
      action: 'CLONE_PROJECT',
      projectId: clone._id,
      details: { title: clone.title, clonedFrom: String(original._id) }
    }).save();
    res.status(201).json(await Project.findById(clone._id).populate(PROJECT_POPULATE));
  } catch (error) {
    res.status(500).json({ error: 'Error al copiar el proyecto' });
  }
};

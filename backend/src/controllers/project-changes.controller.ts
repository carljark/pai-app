import type { Response } from 'express';
import mongoose from 'mongoose';
import { ActivityLog } from '../models/ActivityLog';

/** Acciones de `ActivityLog` que cambian el proyecto (se excluyen exportaciones y telemetría). */
export const CHANGE_ACTIONS = [
  'GENERATE_PROJECT', 'UPDATE_PROJECT', 'AI_REWRITE', 'IMPORT_DOCX', 'TRANSLATE_PROJECT',
  'UPLOAD_FILE', 'DELETE_FILE', 'ADD_COLLABORATOR', 'REMOVE_COLLABORATOR'
];
const CHANGE_FILTER = { $or: [{ action: { $in: CHANGE_ACTIONS } }, { action: /^UPDATE_STATUS_/ }] };
export const MAX_CHANGES = 100;

const toChange = (log: any) => {
  const user = log.userId as any;
  return {
    id: log._id.toString(),
    action: log.action,
    userId: user?._id?.toString() || user?.toString(),
    userName: user?.name || '',
    userEmail: user?.email || '',
    details: log.details || {},
    createdAt: log.createdAt
  };
};

/** GET /api/projects/:id/changes — quién cambió el proyecto y cuándo, del más reciente al más antiguo. */
export const listProjectChanges = async (req: any, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Proyecto no válido' });
    const logs = await ActivityLog.find({ projectId: req.params.id, ...CHANGE_FILTER })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(MAX_CHANGES)
      .lean();
    res.json(logs.map(toChange));
  } catch {
    res.status(500).json({ error: 'Error al obtener el registro de cambios' });
  }
};

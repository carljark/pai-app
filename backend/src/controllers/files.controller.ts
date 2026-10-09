import type { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ActivityLog } from '../models/ActivityLog';

/**
 * Deja constancia en el registro de cambios del proyecto (`req.project` lo carga el middleware).
 * Si falla el registro, la operación con el archivo ya está hecha y no se revierte.
 */
const logFileChange = async (req: any, action: string, filename: string) => {
  try {
    await new ActivityLog({
      userId: req.user?._id,
      action,
      projectId: req.project?._id,
      details: { title: req.project?.title, filename }
    }).save();
  } catch (error) {
    console.error(`[Files] No se pudo registrar ${action}:`, error);
  }
};

export const uploadFile = async (req: any, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se proporcionó archivo" });
  await logFileChange(req, 'UPLOAD_FILE', req.file.originalname);
  res.json({ message: "Archivo subido", filename: req.file.originalname });
};

export const getFiles = (req: any, res: Response) => {
  const dir = path.join(process.cwd(), 'uploads', req.params.id);
  if (!fs.existsSync(dir)) return res.json([]);
  try {
    const files = fs.readdirSync(dir).map(filename => {
      const stats = fs.statSync(path.join(dir, filename));
      return { name: filename, size: stats.size, createdAt: stats.birthtime };
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Error al leer archivos" });
  }
};

export const downloadFile = (req: any, res: Response) => {
  const { id, filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', id, filename);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ error: "Archivo no encontrado" });
};

export const deleteFile = async (req: any, res: Response) => {
  const { id, filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', id, filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "No encontrado" });
  try {
    fs.unlinkSync(filePath);
    await logFileChange(req, 'DELETE_FILE', filename);
    res.json({ message: "Archivo eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};

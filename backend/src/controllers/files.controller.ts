import { Response } from 'express';
import fs from 'fs';
import path from 'path';

export const uploadFile = (req: any, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No se proporcionó archivo" });
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

export const deleteFile = (req: any, res: Response) => {
  const { id, filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', id, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      res.json({ message: "Archivo eliminado" });
    } catch (e) {
      res.status(500).json({ error: "Error al eliminar" });
    }
  } else {
    res.status(404).json({ error: "No encontrado" });
  }
};

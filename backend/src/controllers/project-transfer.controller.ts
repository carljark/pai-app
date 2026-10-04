import type { Response } from 'express';
import { ActivityLog } from '../models/ActivityLog';
import { buildProjectsExport, importProjects as importProjectList, validateTransferPayload } from '../services/project-transfer.service';

const exportFileName = () => `plappin-proyectos-${new Date().toISOString().slice(0, 10)}.json`;

/** GET /api/admin/projects/export[?ids=a,b]: descarga los proyectos en formato de intercambio. */
export const exportProjects = async (req: any, res: Response) => {
  try {
    const ids = typeof req.query.ids === 'string' && req.query.ids ? req.query.ids.split(',') : [];
    const payload = await buildProjectsExport(ids);
    await new ActivityLog({ userId: req.user?._id, action: 'EXPORT_PROJECTS', details: { count: payload.count } }).save();
    res.setHeader('Content-Disposition', `attachment; filename="${exportFileName()}"`);
    res.json(payload);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al exportar los proyectos: ' + error.message });
  }
};

/**
 * POST /api/admin/projects/import: recibe un fichero de exportación (o un trozo, con el mismo
 * formato) y crea los proyectos que no existan.
 */
export const importProjects = async (req: any, res: Response) => {
  const invalid = validateTransferPayload(req.body);
  if (invalid) return res.status(400).json({ error: invalid });
  try {
    const summary = await importProjectList(req.body.projects, req.user?._id);
    await new ActivityLog({
      userId: req.user?._id,
      action: 'IMPORT_PROJECTS',
      details: { imported: summary.imported, skipped: summary.skipped, errors: summary.errors.length }
    }).save();
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al importar los proyectos: ' + error.message });
  }
};

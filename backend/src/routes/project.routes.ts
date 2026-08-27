import { Router } from 'express';
import { generateProject, listProjects, getProject, updateProject, deleteProject, streamUpdates } from '../controllers/project.controller';
import { exportDocx, importDocx } from '../controllers/docx.controller';
import filesRoutes from './files.routes';
import { requireApproved, requireAiAccess } from '../middlewares/auth.middleware';
import { uploadMemory } from '../middlewares/upload.middleware';

const router = Router();

// Sub-rutas (files)
router.use('/:id/files', filesRoutes);

// Rutas de DOCX (van antes de /:id genérico)
router.get('/:id/export-docx', requireApproved, exportDocx);
router.post('/:id/import-docx', requireApproved, uploadMemory.single('file'), importDocx);

// Rutas de Proyectos
router.get('/stream', streamUpdates);
router.post('/generate', requireApproved, requireAiAccess, generateProject);
router.get('/', listProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;

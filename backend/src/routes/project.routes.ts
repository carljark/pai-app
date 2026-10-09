import { Router } from 'express';
import { generateProject, listProjects, getProject, updateProject, deleteProject, streamUpdates, rewriteSection, retryProject } from '../controllers/project.controller';
import { addCollaborator, removeCollaborator, getEditLock, takeEditLock, leaveEditLock } from '../controllers/collaboration.controller';
import { listProjectChanges } from '../controllers/project-changes.controller';
import { exportDocx, importDocx } from '../controllers/docx.controller';
import { translateProject } from '../controllers/translation.controller';
import filesRoutes from './files.routes';
import { requireApproved, requireAiAccess } from '../middlewares/auth.middleware';
import { projectEditGuards } from '../middlewares/project-access.middleware';
import { uploadMemory } from '../middlewares/upload.middleware';

const router = Router();

// Sub-rutas (files)
router.use('/:id/files', filesRoutes);

// Rutas de DOCX (van antes de /:id genérico)
router.get('/:id/export-docx', requireApproved, exportDocx);
router.post('/:id/import-docx', requireApproved, ...projectEditGuards, uploadMemory.single('file'), importDocx);

// Trabajo colaborativo: turno de edición y registro de cambios
router.get('/:id/edit-lock', getEditLock);
router.post('/:id/edit-lock', requireApproved, ...projectEditGuards, takeEditLock);
router.delete('/:id/edit-lock', leaveEditLock);
router.get('/:id/changes', listProjectChanges);

// Rutas de Proyectos
router.get('/stream', streamUpdates);
router.post('/generate', requireApproved, requireAiAccess, generateProject);
router.post('/rewrite', requireApproved, requireAiAccess, ...projectEditGuards, rewriteSection);
router.post('/:id/retry', requireApproved, requireAiAccess, retryProject);
router.post('/:id/translate', requireApproved, requireAiAccess, ...projectEditGuards, translateProject);
router.post('/:id/collaborators', requireApproved, addCollaborator);
router.delete('/:id/collaborators/:userId', requireApproved, removeCollaborator);
router.get('/', listProjects);
router.get('/:id', getProject);
router.put('/:id', ...projectEditGuards, updateProject);
router.delete('/:id', deleteProject);

export default router;

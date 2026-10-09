import { Router } from 'express';
import { uploadFile, getFiles, downloadFile, deleteFile } from '../controllers/files.controller';
import { uploadDisk } from '../middlewares/upload.middleware';
import { projectEditGuards } from '../middlewares/project-access.middleware';

const router = Router({ mergeParams: true });

// Los permisos se comprueban antes de que multer escriba el archivo en disco
router.post('/', ...projectEditGuards, uploadDisk.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:filename', downloadFile);
router.delete('/:filename', ...projectEditGuards, deleteFile);

export default router;

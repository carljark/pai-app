import { Router } from 'express';
import { uploadFile, getFiles, downloadFile, deleteFile } from '../controllers/files.controller';
import { uploadDisk } from '../middlewares/upload.middleware';

const router = Router({ mergeParams: true });

router.post('/', uploadDisk.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:filename', downloadFile);
router.delete('/:filename', deleteFile);

export default router;

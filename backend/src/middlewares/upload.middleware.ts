import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const uploadMemory = multer({ storage: multer.memoryStorage() });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.id;
    const dir = path.join(process.cwd(), 'uploads', projectId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, file.originalname);
  }
});

export const uploadDisk = multer({ storage: diskStorage });

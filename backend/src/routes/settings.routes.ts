import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', getSettings);
router.put('/', requireAdmin, updateSettings);

export default router;

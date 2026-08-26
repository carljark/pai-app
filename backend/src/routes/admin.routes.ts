import { Router } from 'express';
import { getUsers, updateUserPermissions, getLogs } from '../controllers/admin.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/logs', getLogs);
router.put('/users/:id/permissions', updateUserPermissions);

export default router;

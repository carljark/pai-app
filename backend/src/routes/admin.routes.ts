import { Router } from 'express';
import { getUsers, updateUserPermissions, getLogs, deleteUser, getAnalytics } from '../controllers/admin.controller';
import { requireAdmin } from '../middlewares/auth.middleware';
import { exportProjects, importProjects } from '../controllers/project-transfer.controller';

const router = Router();
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/logs', getLogs);
router.get('/analytics', getAnalytics);
router.put('/users/:id/permissions', updateUserPermissions);
router.put('/users/:id/role', updateUserPermissions);
router.put('/users/:id/ai', updateUserPermissions);
router.delete('/users/:id', deleteUser);
router.get('/projects/export', exportProjects);
router.post('/projects/import', importProjects);

export default router;

import { Router } from 'express';
import { getUsers, updateUserRole } from '../controllers/admin.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.use(requireAdmin);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

export default router;

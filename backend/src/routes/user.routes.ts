import { Router } from 'express';
import { getUserDirectory } from '../controllers/user.controller';

const router = Router();

router.get('/directory', getUserDirectory);

export default router;

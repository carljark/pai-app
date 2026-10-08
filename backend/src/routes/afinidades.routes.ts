import { Router } from 'express';
import { getAfinidadesEso } from '../controllers/afinidades.controller';

const router = Router();

router.get('/', getAfinidadesEso);

export default router;

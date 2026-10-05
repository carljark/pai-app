import { Router } from 'express';
import { getRas, getCes, getNiveles } from '../controllers/curriculum.controller';

const router = Router();
router.get('/ras', getRas);
router.get('/ces', getCes);
router.get('/niveles', getNiveles);

export default router;

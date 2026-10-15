import { Router } from 'express';
import { getRas, getCes, getNiveles } from '../controllers/curriculum.controller';
import { getFilterIndex } from '../controllers/curriculum-index.controller';

const router = Router();
router.get('/ras', getRas);
router.get('/ces', getCes);
router.get('/niveles', getNiveles);
router.get('/curriculum/filter-index', getFilterIndex);

export default router;

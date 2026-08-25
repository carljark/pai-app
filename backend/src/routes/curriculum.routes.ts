import { Router } from 'express';
import { getRas, getCes } from '../controllers/curriculum.controller';

const router = Router();
router.get('/ras', getRas);
router.get('/ces', getCes);

export default router;

import { Router } from 'express';
import { getMapaModules } from '../controllers/mapa.controller';

const router = Router();

router.get('/', getMapaModules);

export default router;

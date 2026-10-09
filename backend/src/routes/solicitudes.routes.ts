import { Router } from 'express';
import { createSolicitud, getOferta, listMisSolicitudes } from '../controllers/solicitudes.controller';
import { requireApproved } from '../middlewares/auth.middleware';

const router = Router();
router.use(requireApproved);

router.get('/oferta', getOferta);
router.get('/mias', listMisSolicitudes);
router.post('/', createSolicitud);

export default router;

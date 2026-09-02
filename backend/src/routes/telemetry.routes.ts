import { Router } from 'express';
import { heartbeat, logEvent } from '../controllers/telemetry.controller';

const router = Router();

router.post('/heartbeat', heartbeat);
router.post('/event', logEvent);

export default router;
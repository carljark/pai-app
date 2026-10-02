import { Router } from 'express';
import { getAiModels } from '../controllers/ai.controller';

const router = Router();

router.get('/models', getAiModels);

export default router;

import { Router } from 'express';
import { getUserDirectory } from '../controllers/user.controller';
import { getOnboarding, updateOnboarding } from '../controllers/onboarding.controller';
import { getMyTokens, createMyToken, revokeMyToken } from '../controllers/api-token.controller';
import { requireApproved } from '../middlewares/auth.middleware';

const router = Router();

router.get('/directory', getUserDirectory);
router.get('/me/onboarding', getOnboarding);
router.patch('/me/onboarding', updateOnboarding);
// Tokens de conexión con asistentes de IA (servidor MCP)
router.get('/me/tokens', getMyTokens);
router.post('/me/tokens', requireApproved, createMyToken);
router.delete('/me/tokens/:id', revokeMyToken);

export default router;

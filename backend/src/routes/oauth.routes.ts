import { Router } from 'express';
import { requireApproved } from '../middlewares/auth.middleware';
import {
  answerAuthorizationRequest,
  getAuthorizationRequest,
  listGrants,
  revokeGrant
} from '../mcp/oauth/oauth-consent.controller';

/** Consentimiento OAuth y aplicaciones conectadas (requieren la sesión web del docente). */
const router = Router();

router.get('/requests/:id', getAuthorizationRequest);
router.post('/requests/:id', requireApproved, answerAuthorizationRequest);
router.get('/grants', listGrants);
router.delete('/grants/:id', revokeGrant);

export default router;

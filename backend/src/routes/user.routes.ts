import { Router } from 'express';
import { getUserDirectory } from '../controllers/user.controller';
import { getOnboarding, updateOnboarding } from '../controllers/onboarding.controller';

const router = Router();

router.get('/directory', getUserDirectory);
router.get('/me/onboarding', getOnboarding);
router.patch('/me/onboarding', updateOnboarding);

export default router;

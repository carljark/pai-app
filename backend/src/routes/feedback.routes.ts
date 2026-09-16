import { Router } from 'express';
import { createFeedback, listFeedback, updateFeedbackStatus, deleteFeedback } from '../controllers/feedback.controller';

const router = Router();

router.post('/', createFeedback);
router.get('/', listFeedback);
router.patch('/:id', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;

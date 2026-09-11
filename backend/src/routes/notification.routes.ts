import { Router } from 'express';
import { getNotifications, markAllNotificationsAsRead } from '../controllers/notification.controller';

const router = Router();

router.get('/', getNotifications);
router.post('/read-all', markAllNotificationsAsRead);

export default router;

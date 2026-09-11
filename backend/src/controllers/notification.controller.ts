import type { Response } from 'express';
import { Notification } from '../models/Notification';
import { Project } from '../models/Project';

function getNotifType(status: string): string {
  if (status === 'borrador' || status === 'publicado') return 'PROJECT_COMPLETED';
  if (status === 'error') return 'PROJECT_ERROR';
  return 'PROJECT_STATUS';
}

async function backfillNotificationsIfEmpty() {
  const count = await Notification.countDocuments();
  if (count > 0) return;

  const existingProjects = await Project.find().populate('userId', 'name').limit(50);
  for (const p of existingProjects) {
    await Notification.create({
      projectId: p._id,
      userId: p.userId?._id || p.userId,
      userName: (p.userId as any)?.name || 'Profesor',
      modules: p.modules || [],
      status: p.status,
      type: getNotifType(p.status),
      title: p.title || 'Proyecto Educativo',
      message: p.title || 'Proyecto Educativo',
      generationTimeMs: p.generationTimeMs,
      generationStartedAt: p.generationStartedAt,
      createdAt: p.createdAt,
      updatedAt: (p as any).updatedAt || p.createdAt
    });
  }
}

export const getNotifications = async (req: any, res: Response) => {
  try {
    await backfillNotificationsIfEmpty();
    const notifications = await Notification.find().sort({ updatedAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

export const markAllNotificationsAsRead = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id;
    await Notification.updateMany({ readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al marcar notificaciones como leídas' });
  }
};

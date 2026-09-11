import { Notification } from '../models/Notification';
import { broadcast } from './sse.service';

interface NotificationExtra {
  type?: string;
  title?: string;
  message?: string;
  userName?: string;
  phase?: string;
  rasCount?: number;
}

function buildUpdateData(project: any, extra?: NotificationExtra) {
  const rasCount = extra?.rasCount ?? (project.ras ? project.ras.length : 0);
  return {
    projectId: project._id,
    userId: project.userId?._id || project.userId,
    userName: extra?.userName || (project.userId as any)?.name || 'Profesor',
    modules: project.modules || [],
    rasCount,
    phase: extra?.phase ?? project.phase,
    status: project.status,
    generationTimeMs: project.generationTimeMs,
    generationStartedAt: project.generationStartedAt,
    updatedAt: new Date(),
    ...(extra?.type ? { type: extra.type } : {}),
    ...(extra?.title ? { title: extra.title } : {}),
    ...(extra?.message ? { message: extra.message } : {})
  };
}

export async function syncProjectNotification(project: any, extra?: NotificationExtra) {
  try {
    const projectId = project._id;
    const updateData = buildUpdateData(project, extra);

    const notif = await Notification.findOneAndUpdate(
      { projectId },
      { $set: updateData, $setOnInsert: { createdAt: new Date(), readBy: [] } },
      { upsert: true, returnDocument: 'after' }
    );

    broadcast({
      type: extra?.type || 'PROJECT_STATUS',
      projectId,
      status: project.status,
      phase: updateData.phase,
      rasCount: updateData.rasCount,
      project,
      notification: notif,
      generationTimeMs: project.generationTimeMs,
      generationStartedAt: project.generationStartedAt,
      message: extra?.message
    });

    return notif;
  } catch (err) {
    console.error('[NotificationService] Error syncing notification:', err);
    return null;
  }
}

export async function deleteProjectNotification(projectId: any) {
  try {
    await Notification.deleteMany({ projectId });
  } catch (err) {
    console.error('[NotificationService] Error deleting notification:', err);
  }
}

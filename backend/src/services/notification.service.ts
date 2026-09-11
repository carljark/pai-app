import { Notification } from '../models/Notification';
import { broadcast } from './sse.service';
import mongoose from 'mongoose';

interface NotificationExtra {
  type?: string;
  title?: string;
  message?: string;
  userName?: string;
  phase?: string;
  rasCount?: number;
}

function isValidObjectId(value: any): boolean {
  // mongoose.isValidObjectId is available in Mongoose 5.0+
  // It returns true for ObjectId instances and valid 24-character hex strings
  return typeof mongoose.isValidObjectId === 'function'
    ? mongoose.isValidObjectId(value)
    : // Fallback for older versions
      (value instanceof mongoose.Types.ObjectId ||
        (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)));
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

    // Skip notification sync if projectId is not a valid ObjectId
    if (!isValidObjectId(projectId)) {
      console.warn(`[NotificationService] Skipping sync: invalid projectId "${projectId}"`);
      return null;
    }

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
    // Skip deletion if projectId is not a valid ObjectId
    if (!isValidObjectId(projectId)) {
      console.warn(`[NotificationService] Skipping delete: invalid projectId "${projectId}"`);
      return;
    }

    await Notification.deleteMany({ projectId });
  } catch (err) {
    console.error('[NotificationService] Error deleting notification:', err);
  }
}

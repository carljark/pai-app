import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { broadcast } from './sse.service';
import mongoose from 'mongoose';

interface NotificationExtra {
  type?: string;
  title?: string;
  message?: string;
  userName?: string;
  userEmail?: string;
  phase?: string;
  rasCount?: number;
  errorDetail?: string;
}

function isValidObjectId(value: any): boolean {
  return mongoose.isValidObjectId(value);
}

async function resolveUserDetails(project: any, extra?: NotificationExtra) {
  let userEmail = extra?.userEmail;
  let userName = extra?.userName;

  if (project.userId) {
    if (typeof project.userId === 'object' && (project.userId.email || project.userId.name)) {
      userEmail = userEmail || project.userId.email;
      userName = userName || project.userId.name;
    } else if (isValidObjectId(project.userId)) {
      try {
        const u = await User.findById(project.userId).select('name email').lean();
        if (u) {
          userEmail = userEmail || u.email;
          userName = userName || u.name;
        }
      } catch {
        // ignore lookup error
      }
    }
  }

  return {
    userName: userName || 'Profesor',
    userEmail
  };
}

function buildUpdateData(project: any, extra: NotificationExtra | undefined, resolvedUser: { userName: string; userEmail?: string }) {
  const rasCount = extra?.rasCount ?? (project.ras ? project.ras.length : 0);
  const rawUserId = project.userId?._id || project.userId;
  const userId = isValidObjectId(rawUserId) ? rawUserId : undefined;

  return {
    projectId: project._id,
    ...(userId ? { userId } : {}),
    userName: resolvedUser.userName,
    modules: project.modules || [],
    rasCount,
    phase: extra?.phase ?? project.phase,
    status: project.status,
    generationTimeMs: project.generationTimeMs,
    generationStartedAt: project.generationStartedAt,
    errorDetail: project.errorDetail || extra?.errorDetail,
    updatedAt: new Date(),
    ...(resolvedUser.userEmail ? { userEmail: resolvedUser.userEmail } : {}),
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

    const resolvedUser = await resolveUserDetails(project, extra);
    const updateData = buildUpdateData(project, extra, resolvedUser);

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
      message: extra?.message,
      error: updateData.errorDetail,
      errorDetail: updateData.errorDetail,
      userName: updateData.userName,
      userEmail: updateData.userEmail
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

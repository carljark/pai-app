import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { broadcast, sendToUser } from './sse.service';
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

/** Resumen ligero del proyecto para SSE: evita enviar generatedContent/prompts. */
export function toProjectSummary(project: any) {
  const raw = typeof project?.toObject === 'function' ? project.toObject() : project;
  if (!raw) return raw;
  const { generatedContent, aiPrompt, aiInstruction, ...summary } = raw;
  return summary;
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

    // Solo la notificación general del proyecto: las invitaciones personales no se tocan
    const notif = await Notification.findOneAndUpdate(
      { projectId, recipientId: null },
      { $set: updateData, $setOnInsert: { createdAt: new Date(), readBy: [] } },
      { upsert: true, returnDocument: 'after' }
    );

    broadcast({
      type: extra?.type || 'PROJECT_STATUS',
      projectId,
      status: project.status,
      phase: updateData.phase,
      rasCount: updateData.rasCount,
      project: toProjectSummary(project),
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

const buildInvitation = (project: any, inviter: any, recipientId: string) => ({
  projectId: project._id,
  recipientId,
  userId: inviter?._id,
  userName: inviter?.name || 'Profesor',
  ...(inviter?.email ? { userEmail: inviter.email } : {}),
  type: 'PROJECT_INVITATION',
  title: project.title || 'Proyecto Educativo',
  message: `${inviter?.name || 'Un profesor'} te ha invitado a colaborar en «${project.title || 'Proyecto Educativo'}»`,
  modules: project.modules || [],
  status: project.status || 'borrador'
});

/**
 * Avisa a cada colaborador invitado (salvo a quien invita) con una notificación personal
 * que solo ve él, y en tiempo real por SSE si está conectado.
 */
export async function notifyInvitations(project: any, inviter: any, collaboratorIds: string[]) {
  const inviterId = inviter?._id?.toString();
  const recipients = Array.from(new Set(collaboratorIds.map(String))).filter(id => id !== inviterId);
  for (const recipientId of recipients) {
    try {
      const notification = await Notification.create(buildInvitation(project, inviter, recipientId));
      sendToUser(recipientId, { type: 'PROJECT_INVITATION', projectId: project._id, notification });
    } catch (err) {
      console.error('[NotificationService] Error creating invitation:', err);
    }
  }
}

/** Retira las invitaciones pendientes de un colaborador al quitarlo del proyecto. */
export async function deleteInvitation(projectId: any, recipientId: string) {
  if (!isValidObjectId(recipientId)) return;
  await Notification.deleteMany({ projectId, recipientId, type: 'PROJECT_INVITATION' });
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

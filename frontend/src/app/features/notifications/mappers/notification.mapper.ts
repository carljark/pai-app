import { RawNotificationEvent, AppNotification } from '../models/notification.model';

function buildCompletedMessage(raw: RawNotificationEvent): string {
  const timeMs = raw.generationTimeMs || raw.project?.generationTimeMs;
  const timeNote = timeMs ? ` (tiempo IA: ${(timeMs / 1000).toFixed(1)}s)` : '';
  if (raw.project?.createdAt) {
    const timeString = new Date(raw.project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `El proyecto iniciado a las ${timeString} se ha generado satisfactoriamente${timeNote}.`;
  }
  return `El proyecto se ha generado satisfactoriamente${timeNote}.`;
}

function resolveNotificationMeta(raw: RawNotificationEvent): { type: AppNotification['type']; title: string; message: string } {
  if (raw.type === 'PROJECT_COMPLETED') {
    return { type: 'COMPLETED', title: 'Proyecto Generado', message: buildCompletedMessage(raw) };
  }
  if (raw.type === 'PROJECT_ERROR') {
    return { type: 'ERROR', title: 'Error de Generación', message: `Hubo un error al generar tu proyecto:\n${raw.error}` };
  }
  if (raw.type === 'PROJECT_STATUS') {
    return { type: 'STATUS', title: 'Actualización de estado', message: `El proyecto ha cambiado a estado: ${raw.status}` };
  }
  if (raw.type === 'CONNECTED') {
    return { type: 'INFO', title: 'Conectado', message: 'Conexión en tiempo real establecida.' };
  }
  return { type: 'INFO', title: 'Notificación', message: raw.message || '' };
}

export class NotificationMapper {
  static fromDbEntity(db: any, currentUserId?: string): AppNotification {
    const typeMap: Record<string, AppNotification['type']> = {
      PROJECT_COMPLETED: 'COMPLETED',
      PROJECT_ERROR: 'ERROR',
      PROJECT_STATUS: 'STATUS',
      INFO: 'INFO'
    };
    const isRead = Boolean(currentUserId && Array.isArray(db.readBy) &&
      db.readBy.some((id: any) => id.toString() === currentUserId.toString()));

    return {
      id: db._id?.toString() || db.id || Date.now().toString(),
      type: typeMap[db.type] || 'INFO',
      title: db.title || 'Proyecto Educativo',
      message: db.message || '',
      projectId: db.projectId?.toString(),
      userId: db.userId?.toString(),
      userName: db.userName || 'Profesor',
      modules: db.modules || [],
      status: db.status,
      generationTimeMs: db.generationTimeMs,
      generationStartedAt: db.generationStartedAt,
      timestamp: new Date(db.createdAt || Date.now()),
      updatedAt: db.updatedAt ? new Date(db.updatedAt) : undefined,
      read: isRead
    };
  }

  static fromRawEvent(raw: RawNotificationEvent, currentUserId?: string): AppNotification {
    if (raw.notification) {
      return this.fromDbEntity(raw.notification, currentUserId);
    }
    const meta = resolveNotificationMeta(raw);
    return {
      id: raw.projectId || (Date.now().toString() + Math.random().toString(36).substring(7)),
      type: meta.type,
      title: meta.title,
      message: meta.message,
      projectId: raw.projectId,
      userName: raw.userName || raw.project?.userId?.name || 'Profesor',
      modules: raw.modules || raw.project?.modules || [],
      status: raw.status || raw.project?.status,
      generationTimeMs: raw.generationTimeMs || raw.project?.generationTimeMs,
      generationStartedAt: raw.generationStartedAt || raw.project?.generationStartedAt,
      timestamp: new Date(),
      updatedAt: new Date(),
      read: false
    };
  }
}


import {
  RawNotificationEvent,
  AppNotification,
  DbNotification,
  UserRef,
} from '../models/notification.model';

type NotificationMeta = Pick<AppNotification, 'type' | 'title' | 'message'>;
type ProgressFields = Pick<
  AppNotification,
  'modules' | 'rasCount' | 'phase' | 'status' | 'generationTimeMs' | 'generationStartedAt'
>;

const DB_TYPE_MAP: Record<string, AppNotification['type']> = {
  PROJECT_COMPLETED: 'COMPLETED',
  PROJECT_ERROR: 'ERROR',
  PROJECT_STATUS: 'STATUS',
  INFO: 'INFO',
};

function buildCompletedMessage(raw: RawNotificationEvent): string {
  const timeMs = raw.generationTimeMs || raw.project?.generationTimeMs;
  const timeNote = timeMs ? ` (tiempo IA: ${(timeMs / 1000).toFixed(1)}s)` : '';
  if (raw.project?.createdAt) {
    const timeString = new Date(raw.project.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `El proyecto iniciado a las ${timeString} se ha generado satisfactoriamente${timeNote}.`;
  }
  return `El proyecto se ha generado satisfactoriamente${timeNote}.`;
}

function resolveNotificationMeta(raw: RawNotificationEvent): NotificationMeta {
  switch (raw.type) {
    case 'PROJECT_COMPLETED':
      return { type: 'COMPLETED', title: 'Proyecto Generado', message: buildCompletedMessage(raw) };
    case 'PROJECT_ERROR':
      return {
        type: 'ERROR',
        title: 'Error de Generación',
        message: `Hubo un error al generar tu proyecto:\n${raw.error}`,
      };
    case 'PROJECT_STATUS':
      return {
        type: 'STATUS',
        title: 'Actualización de estado',
        message: `El proyecto ha cambiado a estado: ${raw.status}`,
      };
    case 'CONNECTED':
      return { type: 'INFO', title: 'Conectado', message: 'Conexión en tiempo real establecida.' };
    default:
      return { type: 'INFO', title: 'Notificación', message: raw.message || '' };
  }
}

/** Devuelve el usuario si viene poblado (objeto) o `null` si solo es un id. */
function populatedUser(userId?: UserRef) {
  return userId && typeof userId === 'object' ? userId : null;
}

function isReadBy(db: DbNotification, currentUserId?: string): boolean {
  return Boolean(
    currentUserId &&
    Array.isArray(db.readBy) &&
    db.readBy.some((id) => id.toString() === currentUserId.toString()),
  );
}

function dbErrorDetail(db: DbNotification): string | undefined {
  return db.errorDetail || db.error || (db.status === 'error' ? db.message : undefined);
}

function rawErrorDetail(raw: RawNotificationEvent): string | undefined {
  return (
    raw.errorDetail ||
    raw.error ||
    raw.project?.errorDetail ||
    (raw.status === 'error' ? raw.message : undefined)
  );
}

function dbProgressFields(db: DbNotification): ProgressFields {
  return {
    modules: db.modules || [],
    rasCount: db.rasCount || 0,
    phase: db.phase,
    status: db.status,
    generationTimeMs: db.generationTimeMs,
    generationStartedAt: db.generationStartedAt,
  };
}

function rawProgressFields(raw: RawNotificationEvent): ProgressFields {
  const project = raw.project;
  return {
    modules: raw.modules || project?.modules || [],
    rasCount: raw.rasCount ?? project?.ras?.length ?? 0,
    phase: raw.phase || project?.phase,
    status: raw.status || project?.status,
    generationTimeMs: raw.generationTimeMs || project?.generationTimeMs,
    generationStartedAt: raw.generationStartedAt || project?.generationStartedAt,
  };
}

export class NotificationMapper {
  static fromDbEntity(db: DbNotification, currentUserId?: string): AppNotification {
    const user = populatedUser(db.userId);
    const errorDetail = dbErrorDetail(db);
    return {
      id: db._id?.toString() || db.id || Date.now().toString(),
      type: DB_TYPE_MAP[db.type ?? ''] || 'INFO',
      title: db.title || 'Proyecto Educativo',
      message: db.message || '',
      error: errorDetail,
      errorDetail,
      projectId: db.projectId?.toString(),
      userId: user?._id?.toString() || db.userId?.toString(),
      userName: db.userName || user?.name || 'Profesor',
      userEmail: db.userEmail || user?.email,
      ...dbProgressFields(db),
      timestamp: new Date(db.createdAt || Date.now()),
      updatedAt: db.updatedAt ? new Date(db.updatedAt) : undefined,
      read: isReadBy(db, currentUserId),
    };
  }

  static fromRawEvent(raw: RawNotificationEvent, currentUserId?: string): AppNotification {
    if (raw.notification) {
      return this.fromDbEntity(raw.notification, currentUserId);
    }
    const user = populatedUser(raw.project?.userId);
    const errorDetail = rawErrorDetail(raw);
    const projectUserId = raw.project?.userId;
    return {
      id: raw.projectId || Date.now().toString() + Math.random().toString(36).substring(7),
      ...resolveNotificationMeta(raw),
      error: errorDetail,
      errorDetail,
      projectId: raw.projectId,
      userId:
        user?._id?.toString() || (typeof projectUserId === 'string' ? projectUserId : undefined),
      userName: raw.userName || user?.name || 'Profesor',
      userEmail: raw.userEmail || user?.email,
      ...rawProgressFields(raw),
      timestamp: new Date(),
      updatedAt: new Date(),
      read: false,
    };
  }
}

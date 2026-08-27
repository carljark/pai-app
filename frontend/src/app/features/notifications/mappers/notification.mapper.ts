import { RawNotificationEvent, AppNotification } from '../models/notification.model';

export class NotificationMapper {
  static fromRawEvent(raw: RawNotificationEvent): AppNotification {
    let type: AppNotification['type'] = 'INFO';
    let title = 'Notificación';
    let message = raw.message || '';

    if (raw.type === 'PROJECT_COMPLETED') {
      type = 'COMPLETED';
      title = 'Proyecto Generado';
      if (raw.project && raw.project.createdAt) {
        const date = new Date(raw.project.createdAt);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        message = `El proyecto iniciado a las ${timeString} se ha generado satisfactoriamente.`;
      } else {
        message = 'El proyecto se ha generado satisfactoriamente.';
      }
    } else if (raw.type === 'PROJECT_ERROR') {
      type = 'ERROR';
      title = 'Error de Generación';
      message = `Hubo un error al generar tu proyecto:\n${raw.error}`;
    } else if (raw.type === 'PROJECT_STATUS') {
      type = 'STATUS';
      title = 'Actualización de estado';
      message = `El proyecto ha cambiado a estado: ${raw.status}`;
    } else if (raw.type === 'CONNECTED') {
      type = 'INFO';
      title = 'Conectado';
      message = 'Conexión en tiempo real establecida.';
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      type,
      title,
      message,
      projectId: raw.projectId,
      timestamp: new Date(),
      read: false
    };
  }
}

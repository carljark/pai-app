import { NotificationMapper } from './notification.mapper';
import { RawNotificationEvent } from '../models/notification.model';

describe('NotificationMapper', () => {
  it('should map PROJECT_COMPLETED correctly with date', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_COMPLETED',
      projectId: '1',
      project: { createdAt: '2023-01-01T10:00:00Z' }
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.type).toBe('COMPLETED');
    expect(notif.title).toBe('Proyecto Generado');
    expect(notif.message).toContain('El proyecto iniciado a las');
    expect(notif.projectId).toBe('1');
    expect(notif.read).toBeFalsy();
    expect(notif.id).toBeTruthy();
    expect(notif.timestamp).toBeInstanceOf(Date);
  });

  it('should map PROJECT_COMPLETED correctly without date', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_COMPLETED',
      projectId: '1'
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.message).toBe('El proyecto se ha generado satisfactoriamente.');
  });

  it('should map PROJECT_ERROR correctly', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_ERROR',
      projectId: '1',
      error: 'Some error'
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.type).toBe('ERROR');
    expect(notif.title).toBe('Error de Generación');
    expect(notif.message).toBe('Hubo un error al generar tu proyecto:\nSome error');
  });

  it('should map PROJECT_STATUS correctly', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_STATUS',
      projectId: '1',
      status: 'generando'
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.type).toBe('STATUS');
    expect(notif.title).toBe('Actualización de estado');
    expect(notif.message).toBe('El proyecto ha cambiado a estado: generando');
  });

  it('should map CONNECTED correctly', () => {
    const raw: RawNotificationEvent = {
      type: 'CONNECTED'
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.type).toBe('INFO');
    expect(notif.title).toBe('Conectado');
    expect(notif.message).toBe('Conexión en tiempo real establecida.');
  });

  it('should map UNKNOWN correctly to INFO', () => {
    const raw: RawNotificationEvent = {
      type: 'UNKNOWN' as any,
      message: 'Unknown event'
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.type).toBe('INFO');
    expect(notif.title).toBe('Notificación');
    expect(notif.message).toBe('Unknown event');
  });
});

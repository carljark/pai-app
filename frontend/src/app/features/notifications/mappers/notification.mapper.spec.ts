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

  it('should map PROJECT_COMPLETED with generationTimeMs correctly', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_COMPLETED',
      projectId: '1',
      generationTimeMs: 14500,
      project: { createdAt: '2023-01-01T10:00:00Z', generationTimeMs: 14500 }
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.message).toContain('(tiempo IA: 14.5s)');
    expect(notif.generationTimeMs).toBe(14500);
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

  it('fromDbEntity should map entity correctly and check readBy status', () => {
    const dbEntity = {
      _id: 'db_1',
      projectId: 'proj_1',
      userId: 'u_1',
      userName: 'Carlos',
      modules: ['3060'],
      status: 'borrador',
      type: 'PROJECT_COMPLETED',
      title: 'Proyecto 1',
      message: 'Creado ok',
      generationTimeMs: 15000,
      createdAt: '2026-09-11T12:00:00Z',
      updatedAt: '2026-09-11T12:05:00Z',
      readBy: ['u_1', 'u_2']
    };

    const notifRead = NotificationMapper.fromDbEntity(dbEntity, 'u_1');
    expect(notifRead.id).toBe('db_1');
    expect(notifRead.type).toBe('COMPLETED');
    expect(notifRead.userName).toBe('Carlos');
    expect(notifRead.read).toBe(true);
    expect(notifRead.updatedAt).toBeDefined();

    const notifUnread = NotificationMapper.fromDbEntity(dbEntity, 'u_other');
    expect(notifUnread.read).toBe(false);

    const emptyEntity = { type: 'OTHER' };
    const notifFallback = NotificationMapper.fromDbEntity(emptyEntity);
    expect(notifFallback.userName).toBe('Profesor');
    expect(notifFallback.type).toBe('INFO');
    expect(notifFallback.read).toBe(false);
  });

  it('fromRawEvent should use raw.notification if present', () => {
    const raw: RawNotificationEvent = {
      type: 'PROJECT_STATUS',
      notification: {
        _id: 'embedded_1',
        title: 'Embedded Notif',
        status: 'generando',
        type: 'PROJECT_STATUS'
      }
    };
    const notif = NotificationMapper.fromRawEvent(raw);
    expect(notif.id).toBe('embedded_1');
    expect(notif.title).toBe('Embedded Notif');
  });
});


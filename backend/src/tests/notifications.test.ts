import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Notification } from '../models/Notification';
import { Project } from '../models/Project';
import * as sseService from '../services/sse.service';
import { syncProjectNotification, deleteProjectNotification } from '../services/notification.service';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => {
  await clearDB();
  vi.spyOn(sseService, 'broadcast').mockImplementation(() => {});
});

describe('Notifications API and Service', () => {
  it('GET /api/notifications should backfill from projects if empty and return list', async () => {
    const { token, user } = await createTestUser('teacher', 'notif_user1@test.com');
    await Project.create([
      { title: 'Proyecto Backfill', modules: ['3060'], status: 'borrador', userId: user._id, generationTimeMs: 12000 },
      { status: 'error' },
      { title: 'Publicado Test', status: 'publicado', userId: user._id },
      { title: 'Generando Test', status: 'generando', userId: user._id }
    ]);

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(4);
    const titles = res.body.map((n: any) => n.title);
    expect(titles).toContain('Proyecto Backfill');
    expect(titles).toContain('Proyecto Educativo');
  });


  it('GET /api/notifications should return list directly when not empty', async () => {
    const { token, user } = await createTestUser('teacher', 'notif_user2@test.com');
    await new Notification({
      type: 'PROJECT_STATUS',
      title: 'Notif Existente',
      message: 'Detalle',
      status: 'generando',
      userId: user._id
    }).save();

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe('Notif Existente');
  });

  it('GET /api/notifications should handle errors gracefully', async () => {
    const { token } = await createTestUser('teacher', 'notif_err@test.com');
    const spy = vi.spyOn(Notification, 'find').mockImplementationOnce(() => {
      throw new Error('DB Error');
    });

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error al obtener notificaciones');
    spy.mockRestore();
  });

  it('POST /api/notifications/read-all should update readBy for current user', async () => {
    const { token, user } = await createTestUser('teacher', 'notif_read@test.com');
    const notif = await new Notification({
      type: 'PROJECT_COMPLETED',
      title: 'Notif No Leida',
      message: 'Completado',
      status: 'borrador',
      readBy: []
    }).save();

    const res = await request(app)
      .post('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await Notification.findById(notif._id);
    expect(updated?.readBy?.map(id => id.toString())).toContain(user._id.toString());
  });

  it('POST /api/notifications/read-all should handle errors', async () => {
    const { token } = await createTestUser('teacher', 'notif_read_err@test.com');
    const spy = vi.spyOn(Notification, 'updateMany').mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .post('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Error al marcar notificaciones como leídas');
    spy.mockRestore();
  });

  it('syncProjectNotification should upsert and broadcast', async () => {
    const { user } = await createTestUser('teacher', 'notif_sync@test.com');
    const project = await new Project({
      title: 'Sync Proj',
      userId: user._id,
      status: 'generando'
    }).save();

    const result = await syncProjectNotification(project, {
      type: 'PROJECT_STATUS',
      title: 'Generando Test',
      message: 'Test Msg'
    });

    expect(result).toBeTruthy();
    expect(result?.title).toBe('Generando Test');
    expect(sseService.broadcast).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PROJECT_STATUS',
      projectId: project._id
    }));

    const result2 = await syncProjectNotification(project);
    expect(result2).toBeTruthy();
    expect(result2?.type).toBe('PROJECT_STATUS');
  });


  it('syncProjectNotification should handle errors gracefully and return null', async () => {
    const spy = vi.spyOn(Notification, 'findOneAndUpdate').mockRejectedValueOnce(new Error('DB Failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await syncProjectNotification({ _id: new mongoose.Types.ObjectId() });
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    spy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('deleteProjectNotification should delete by projectId and catch errors', async () => {
    const notif = await new Notification({
      projectId: new mongoose.Types.ObjectId(),
      type: 'INFO',
      title: 'A borrar',
      message: 'Msg',
      status: 'borrador'
    }).save();

    await deleteProjectNotification(notif.projectId);
    const count = await Notification.countDocuments({ projectId: notif.projectId });
    expect(count).toBe(0);

    // Invalid string projectId should log warning and skip deletion
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await deleteProjectNotification('dummy');
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Valid string projectId should proceed to deletion and log error on failure
    const spy = vi.spyOn(Notification, 'deleteMany').mockRejectedValueOnce(new Error('Delete error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const validId = new mongoose.Types.ObjectId().toString();
    await deleteProjectNotification(validId);
    expect(consoleErrorSpy).toHaveBeenCalled();
    spy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

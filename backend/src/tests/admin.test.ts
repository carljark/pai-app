import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import mongoose from 'mongoose';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Admin Endpoints', () => {
  it('Debería obtener la lista de usuarios si es admin', async () => {
    const { token } = await createTestUser('admin', 'admin_test@plappin.org');
    await createTestUser('teacher', 'teacher@test.com');

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('No debería obtener la lista de usuarios si no es admin', async () => {
    const { token } = await createTestUser('teacher', 'teacher2@test.com');

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Requiere permisos de administrador');
  });

  it('Debería poder cambiar el rol de un usuario', async () => {
    const { token } = await createTestUser('admin', 'admin2@plappin.org');
    
    // Crear usuario pending
    const User = mongoose.model('User');
    const targetUser = new User({ name: 'Pending', email: 'pend@test.com', password: '123', role: 'pending' });
    await targetUser.save();

    const res = await request(app)
      .put(`/api/admin/users/${targetUser._id}/permissions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'teacher' });
    
    expect(res.status).toBe(200);
    
    const updatedUser = await User.findById(targetUser._id);
    expect(updatedUser?.role).toBe('teacher');
  });

  it('Errores 404 y 500 en endpoints de admin', async () => {
    const { token } = await createTestUser('admin', 'admin3@plappin.org');
    const User = mongoose.model('User');

    // 404
    const fakeId = new mongoose.Types.ObjectId();
    const res404 = await request(app).put(`/api/admin/users/${fakeId}/permissions`).set('Authorization', `Bearer ${token}`).send({ role: 'admin' });
    expect(res404.status).toBe(404);

    // 500 en getUsers
    const spyFind = vi.spyOn(User, 'find').mockRejectedValueOnce(new Error('DB'));
    const res500get = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    expect(res500get.status).toBe(500);
    spyFind.mockRestore();

    // 500 en updateUserPermissions
    const spyUpdate = vi.spyOn(User, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('DB'));
    const res500put = await request(app).put(`/api/admin/users/${fakeId}/permissions`).set('Authorization', `Bearer ${token}`).send({ role: 'teacher' });
    expect(res500put.status).toBe(500);
    spyUpdate.mockRestore();
  });

  it('GET /api/admin/logs - Debería obtener logs y manejar errores', async () => {
    const { token } = await createTestUser('admin', 'admin4@plappin.org');
    const ActivityLog = mongoose.model('ActivityLog');
    
    // Test éxito
    await new ActivityLog({ userId: new mongoose.Types.ObjectId(), action: 'TEST' }).save();
    const res = await request(app).get('/api/admin/logs').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);

    // Test error 500
    const spyFind = vi.spyOn(ActivityLog, 'find').mockImplementationOnce(() => {
      throw new Error('DB Error logs');
    });
    const resErr = await request(app).get('/api/admin/logs').set('Authorization', `Bearer ${token}`);
    expect(resErr.status).toBe(500);
    spyFind.mockRestore();
  });
});

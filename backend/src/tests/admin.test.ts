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
});

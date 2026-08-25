import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Settings Endpoints', () => {
  it('GET /api/settings - Debería crear settings por defecto si no existen', async () => {
    const { token } = await createTestUser('teacher', 'teacher2@test.com');
    const res = await request(app).get('/api/settings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.schoolName).toBe('');
    expect(res.body.isSingleton).toBe(true);
  });

  it('PUT /api/settings - Debería denegar acceso a profesores', async () => {
    const { token } = await createTestUser('teacher', 'teacher@test.com');
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ schoolName: 'IES Falso' });
    
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Requiere permisos de administrador');
  });

  it('PUT /api/settings - Debería permitir acceso a administradores y actualizar', async () => {
    const { token } = await createTestUser('admin', 'admin@test.com');
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ schoolName: 'IES Real', schoolCity: 'Madrid' });
    
    expect(res.status).toBe(200);
    expect(res.body.schoolName).toBe('IES Real');

    // Verificar con GET que se guardó
    const getRes = await request(app).get('/api/settings').set('Authorization', `Bearer ${token}`);
    expect(getRes.body.schoolName).toBe('IES Real');
    expect(getRes.body.schoolCity).toBe('Madrid');
  });
});

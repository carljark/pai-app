import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Auth Endpoints', () => {
  it('Debería registrar un nuevo usuario con éxito', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuario registrado correctamente');
  });

  it('Debería permitir login aunque el usuario sea pending, pero las rutas protegidas deben fallar', async () => {
    // 1. Registramos al usuario
    await request(app).post('/api/auth/register').send({
      email: 'pending@test.com',
      password: 'password123',
      name: 'Pending User'
    });

    // 2. Intentamos login (debe dar 200 y devolver token)
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'pending@test.com',
      password: 'password123'
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    // 3. Intentar acceder a una ruta protegida con requireApproved
    const protectedRes = await request(app)
      .post('/api/projects/generate')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({ title: 'Test' });

    expect(protectedRes.status).toBe(403);
    expect(protectedRes.body.error).toBe('Tu cuenta está pendiente de aprobación por un administrador.');
  });

  it('Debería fallar el login si la contraseña es incorrecta', async () => {
    // 1. Registramos
    await request(app).post('/api/auth/register').send({
      email: 'wrong@test.com',
      password: 'password123',
      name: 'Wrong User'
    });

    // 2. Intentamos login con mala clave
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@test.com',
      password: 'badpassword'
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Credenciales inválidas');
  });
});

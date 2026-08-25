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

  it('Errores adicionales en Auth (duplicado, no encontrado, 500)', async () => {
    // Registro duplicado
    await request(app).post('/api/auth/register').send({ email: 'dup@test.com', password: '123', name: 'A' });
    const resDup = await request(app).post('/api/auth/register').send({ email: 'dup@test.com', password: '123', name: 'A' });
    expect(resDup.status).toBe(400);

    // Login usuario no existe
    const resNo = await request(app).post('/api/auth/login').send({ email: 'noexiste@test.com', password: '123' });
    expect(resNo.status).toBe(400);

    // 500 Register
    const mongoose = (await import('mongoose')).default;
    const User = mongoose.model('User');
    const spy = (await import('vitest')).vi.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB'));
    const res500reg = await request(app).post('/api/auth/register').send({ email: 'err@test.com', password: '123', name: 'A' });
    expect(res500reg.status).toBe(500);
    spy.mockRestore();

    // 500 Login
    const spy2 = (await import('vitest')).vi.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB'));
    const res500log = await request(app).post('/api/auth/login').send({ email: 'err@test.com', password: '123' });
    expect(res500log.status).toBe(500);
    spy2.mockRestore();
  });

  it('Cobertura de Middlewares: Token faltante, inválido y sin permisos IA', async () => {
    // Falta token (ej. GET /api/projects/)
    const resNoToken = await request(app).get('/api/projects');
    expect(resNoToken.status).toBe(401);

    // Token inválido
    const resInvalid = await request(app).get('/api/projects').set('Authorization', 'Bearer invalidtoken123');
    expect(resInvalid.status).toBe(400);

    // No permisos IA (requiere token de un usuario validado pero sin canUseAi)
    const mongoose = (await import('mongoose')).default;
    const User = mongoose.model('User');
    const u = new User({ name: 'NoAI', email: 'noai@test.com', password: '123', role: 'teacher', canUseAi: false });
    await u.save();
    const token = (await import('jsonwebtoken')).default.sign({ _id: u._id, role: u.role, canUseAi: false }, process.env.JWT_SECRET || 'pai_super_secret_key_2026');
    
    const resNoAi = await request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`).send({ title: 'A' });
    expect(resNoAi.status).toBe(403);
    expect(resNoAi.body.error).toContain('No tienes permisos');
  });
});

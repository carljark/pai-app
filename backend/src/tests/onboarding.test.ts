import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { User } from '../models/User';
import { isTourId } from '../data/tours';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
const URL = '/api/users/me/onboarding';

describe('GET /api/users/me/onboarding', () => {
  it('un usuario nuevo no ha cerrado la bienvenida ni completado visitas', async () => {
    const { token } = await createTestUser('teacher', 'nuevo@test.com');
    const res = await request(app).get(URL).set(auth(token));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ welcomeDismissed: false, completedTours: [] });
  });

  it('un usuario anterior al cambio (sin el campo en Mongo) también ve la bienvenida', async () => {
    const { token, user } = await createTestUser('teacher', 'antiguo@test.com');
    await User.collection.updateOne({ _id: user._id }, { $unset: { onboarding: '' } });
    const res = await request(app).get(URL).set(auth(token));
    expect(res.body).toEqual({ welcomeDismissed: false, completedTours: [] });
  });

  it('responde 404 si el usuario del token ya no existe', async () => {
    const { token, user } = await createTestUser('teacher', 'borrado@test.com');
    await User.deleteOne({ _id: user._id });
    expect((await request(app).get(URL).set(auth(token))).status).toBe(404);
  });

  it('responde 500 si falla la base de datos', async () => {
    const { token } = await createTestUser('teacher', 'error@test.com');
    const spy = vi.spyOn(User, 'findById').mockImplementationOnce(() => { throw new Error('db'); });
    expect((await request(app).get(URL).set(auth(token))).status).toBe(500);
    spy.mockRestore();
  });

  it('exige sesión', async () => {
    expect((await request(app).get(URL)).status).toBe(401);
  });
});

describe('PATCH /api/users/me/onboarding', () => {
  it('«No volver a mostrar» guarda la bienvenida como cerrada', async () => {
    const { token, user } = await createTestUser('pending', 'cerrar@test.com');
    const res = await request(app).patch(URL).set(auth(token)).send({ welcomeDismissed: true });
    expect(res.status).toBe(200);
    expect(res.body.welcomeDismissed).toBe(true);
    expect((await User.findById(user._id))?.onboarding?.welcomeDismissed).toBe(true);
  });

  it('completar una visita la añade una sola vez', async () => {
    const { token } = await createTestUser('teacher', 'visitas@test.com');
    await request(app).patch(URL).set(auth(token)).send({ completedTour: 'intro' });
    await request(app).patch(URL).set(auth(token)).send({ completedTour: 'taller' });
    const res = await request(app).patch(URL).set(auth(token)).send({ completedTour: 'intro' });
    expect(res.body.completedTours).toEqual(['intro', 'taller']);
  });

  it('acepta los dos cambios a la vez', async () => {
    const { token } = await createTestUser('teacher', 'ambos@test.com');
    const res = await request(app).patch(URL).set(auth(token)).send({ welcomeDismissed: true, completedTour: 'intro' });
    expect(res.body).toEqual({ welcomeDismissed: true, completedTours: ['intro'] });
  });

  it('rechaza visitas desconocidas y cuerpos sin cambios válidos', async () => {
    const { token } = await createTestUser('teacher', 'malo@test.com');
    expect((await request(app).patch(URL).set(auth(token)).send({ completedTour: 'hackeo' })).status).toBe(400);
    expect((await request(app).patch(URL).set(auth(token)).send({ welcomeDismissed: 'sí' })).status).toBe(400);
    expect((await request(app).patch(URL).set(auth(token)).send()).status).toBe(400);
  });

  it('responde 404 si el usuario ya no existe y 500 si falla la base de datos', async () => {
    const { token, user } = await createTestUser('teacher', 'fallos@test.com');
    const spy = vi.spyOn(User, 'findByIdAndUpdate').mockImplementationOnce(() => { throw new Error('db'); });
    expect((await request(app).patch(URL).set(auth(token)).send({ welcomeDismissed: true })).status).toBe(500);
    spy.mockRestore();
    await User.deleteOne({ _id: user._id });
    expect((await request(app).patch(URL).set(auth(token)).send({ welcomeDismissed: true })).status).toBe(404);
  });
});

describe('isTourId', () => {
  it('solo admite las visitas del frontend', () => {
    expect(['intro', 'generator', 'taller', 'mapa'].every(isTourId)).toBe(true);
    expect(isTourId('admin')).toBe(false);
    expect(isTourId(undefined)).toBe(false);
  });
});

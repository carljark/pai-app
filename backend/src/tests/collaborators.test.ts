import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import mongoose from 'mongoose';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Collaborators and user directory', () => {
  it('GET /api/users/directory devuelve otros usuarios', async () => {
    const { token } = await createTestUser('teacher', 'owner@test.com');
    await createTestUser('teacher', 'mate@test.com');

    const res = await request(app)
      .get('/api/users/directory')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some((u: any) => u.email === 'mate@test.com')).toBe(true);
  });

  it('POST/DELETE collaborators gestiona la colaboración del proyecto', async () => {
    const owner = await createTestUser('teacher', 'owner2@test.com');
    const mate = await createTestUser('teacher', 'mate2@test.com');
    const project = await new Project({ title: 'P', userId: owner.user._id }).save();

    const add = await request(app)
      .post(`/api/projects/${project._id}/collaborators`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ userId: mate.user._id.toString() });

    expect(add.status).toBe(200);
    expect(add.body.collaborators.length).toBe(1);
    expect(add.body.collaborators[0].userId.email).toBe('mate2@test.com');

    // Idempotente
    const again = await request(app)
      .post(`/api/projects/${project._id}/collaborators`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ userId: mate.user._id.toString() });
    expect(again.body.collaborators.length).toBe(1);

    const remove = await request(app)
      .delete(`/api/projects/${project._id}/collaborators/${mate.user._id}`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(remove.status).toBe(200);
    expect(remove.body.collaborators.length).toBe(0);
  });

  it('rechaza colaboradores inválidos, al propio autor y a terceros', async () => {
    const owner = await createTestUser('teacher', 'owner3@test.com');
    const mate = await createTestUser('teacher', 'mate3@test.com');
    const other = await createTestUser('teacher', 'other3@test.com');
    const project = await new Project({ title: 'P', userId: owner.user._id }).save();

    const invalid = await request(app)
      .post(`/api/projects/${project._id}/collaborators`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ userId: 'no-valido' });
    expect(invalid.status).toBe(400);

    const self = await request(app)
      .post(`/api/projects/${project._id}/collaborators`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ userId: owner.user._id.toString() });
    expect(self.status).toBe(400);

    const forbidden = await request(app)
      .post(`/api/projects/${project._id}/collaborators`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ userId: mate.user._id.toString() });
    expect(forbidden.status).toBe(403);

    const missing = await request(app)
      .post(`/api/projects/${new mongoose.Types.ObjectId()}/collaborators`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ userId: mate.user._id.toString() });
    expect(missing.status).toBe(404);
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { acquireEditLock } from '../services/edit-lock.service';
import { MAX_TITLE_LENGTH, normalizeTitle } from '../controllers/project-title.controller';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Autor, colaborador, ajeno y administrador, con un proyecto del autor compartido con el colaborador. */
const setup = async () => {
  const owner = await createTestUser('teacher', 'autor@test.com');
  const mate = await createTestUser('teacher', 'colaborador@test.com');
  const other = await createTestUser('teacher', 'ajeno@test.com');
  const admin = await createTestUser('admin', 'admin@test.com');
  const project = await new Project({
    title: 'Proyecto Generado',
    userId: owner.user._id,
    status: 'borrador',
    generatedContent: { rawText: '# Original' },
    contentVersion: 3,
    collaborators: [{ userId: mate.user._id }]
  }).save();
  return { owner, mate, other, admin, project, id: project._id.toString() };
};

const rename = (id: string, token: string, title: unknown) =>
  request(app).patch(`/api/projects/${id}/title`).set(auth(token)).send({ title });

describe('PATCH /api/projects/:id/title', () => {
  it('el autor cambia el nombre sin tocar el contenido y queda en el registro de cambios', async () => {
    const { owner, id } = await setup();

    const res = await rename(id, owner.token, '  Huerto   escolar ');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Huerto escolar');
    expect(res.body.userId.email).toBe('autor@test.com');

    const saved = await Project.findById(id);
    expect(saved?.title).toBe('Huerto escolar');
    expect(saved?.generatedContent?.rawText).toBe('# Original');
    expect(saved?.contentVersion).toBe(3);

    const log = await ActivityLog.findOne({ projectId: id, action: 'RENAME_PROJECT' });
    expect(log?.details).toMatchObject({ title: 'Huerto escolar', previousTitle: 'Proyecto Generado' });

    const changes = await request(app).get(`/api/projects/${id}/changes`).set(auth(owner.token));
    expect(changes.body.map((c: any) => c.action)).toContain('RENAME_PROJECT');
  });

  it('el colaborador y el administrador también pueden, aunque otro tenga el turno de edición', async () => {
    const { owner, mate, admin, id } = await setup();
    await acquireEditLock(id, owner.user);

    expect((await rename(id, mate.token, 'Por el colaborador')).status).toBe(200);
    expect((await rename(id, admin.token, 'Por el administrador')).body.title).toBe('Por el administrador');
  });

  it('rechaza a quien no participa en el proyecto', async () => {
    const { other, id } = await setup();
    expect((await rename(id, other.token, 'Intruso')).status).toBe(403);
    expect((await Project.findById(id))?.title).toBe('Proyecto Generado');
  });

  it('rechaza nombres vacíos, demasiado largos o que no son texto', async () => {
    const { owner, id } = await setup();
    for (const title of ['   ', '', 42, undefined, 'x'.repeat(MAX_TITLE_LENGTH + 1)]) {
      expect((await rename(id, owner.token, title)).status).toBe(400);
    }
    expect((await rename(id, owner.token, 'x'.repeat(MAX_TITLE_LENGTH))).status).toBe(200);
  });

  it('responde 404 si el proyecto no existe y 500 si falla la base de datos', async () => {
    const { owner, id } = await setup();
    expect((await rename('64b7f0c2a1b2c3d4e5f60718', owner.token, 'Nada')).status).toBe(404);

    const spy = vi.spyOn(Project, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('fallo');
    });
    expect((await rename(id, owner.token, 'Nada')).status).toBe(500);
    spy.mockRestore();
  });

  it('normalizeTitle compacta los espacios y valida la longitud', () => {
    expect(normalizeTitle(' a \n b ')).toBe('a b');
    expect(normalizeTitle(null)).toBeNull();
    expect(normalizeTitle('x'.repeat(MAX_TITLE_LENGTH + 1))).toBeNull();
  });
});

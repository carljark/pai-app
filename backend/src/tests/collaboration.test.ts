import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';
import { ActivityLog } from '../models/ActivityLog';
import * as sse from '../services/sse.service';
import { syncProjectNotification, notifyInvitations, deleteInvitation } from '../services/notification.service';
import { acquireEditLock, activeLockOf, releaseEditLock, EDIT_LOCK_TTL_MS } from '../services/edit-lock.service';
import { canEditProject, participantIdsOf } from '../services/project-access.service';
import { MAX_CHANGES } from '../controllers/project-changes.controller';

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create: vi.fn().mockResolvedValue({ output_text: '# Reescrito' }) };
  }
}));
vi.mock('mammoth', () => ({
  default: { convertToHtml: vi.fn().mockResolvedValue({ value: '<p>Importado</p>' }) }
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Autor A, colaborador B, ajeno C y administrador, con un proyecto de A compartido con B. */
const setup = async () => {
  const owner = await createTestUser('teacher', 'autor@test.com');
  const mate = await createTestUser('teacher', 'colaborador@test.com');
  const other = await createTestUser('teacher', 'ajeno@test.com');
  const admin = await createTestUser('admin', 'admin@test.com');
  const project = await new Project({
    title: 'Proyecto compartido',
    userId: owner.user._id,
    status: 'borrador',
    generatedContent: { rawText: '# Original' },
    collaborators: [{ userId: mate.user._id }]
  }).save();
  return { owner, mate, other, admin, project, id: project._id.toString() };
};

const expire = (id: string) =>
  Project.updateOne({ _id: id }, { $set: { 'editLock.expiresAt': new Date(Date.now() - 1000) } });

describe('Permisos de edición', () => {
  it('quien no es autor ni colaborador solo puede leer el proyecto', async () => {
    const { other, id } = await setup();
    const h = auth(other.token);

    expect((await request(app).get(`/api/projects/${id}`).set(h)).status).toBe(200);
    expect((await request(app).put(`/api/projects/${id}`).set(h).send({ rawText: 'X' })).status).toBe(403);
    expect((await request(app).post('/api/projects/rewrite').set(h)
      .send({ projectId: id, context: '# A', instruction: 'B' })).status).toBe(403);
    expect((await request(app).post(`/api/projects/${id}/translate`).set(h).send({ target: 'catalan' })).status).toBe(403);
    expect((await request(app).post(`/api/projects/${id}/import-docx`).set(h)
      .attach('file', Buffer.from('x'), 'a.docx')).status).toBe(403);
    expect((await request(app).post(`/api/projects/${id}/files`).set(h)
      .attach('file', Buffer.from('x'), 'a.pdf')).status).toBe(403);
    expect((await request(app).delete(`/api/projects/${id}/files/a.pdf`).set(h)).status).toBe(403);
    expect((await request(app).post(`/api/projects/${id}/edit-lock`).set(h)).status).toBe(403);
    expect(fs.existsSync(path.join(process.cwd(), 'uploads', id, 'a.pdf'))).toBe(false);

    const unchanged = await Project.findById(id);
    expect(unchanged?.generatedContent?.rawText).toBe('# Original');
  });

  it('el colaborador y el administrador pueden editar', async () => {
    const { mate, admin, id } = await setup();

    const byMate = await request(app).put(`/api/projects/${id}`).set(auth(mate.token)).send({ rawText: '# Colaborador' });
    expect(byMate.status).toBe(200);
    expect(byMate.body.generatedContent.rawText).toBe('# Colaborador');

    await request(app).delete(`/api/projects/${id}/edit-lock`).set(auth(mate.token));
    const byAdmin = await request(app).put(`/api/projects/${id}`).set(auth(admin.token)).send({ status: 'publicado' });
    expect(byAdmin.status).toBe(200);
  });

  it('responde 404 si el proyecto no existe y 400 si falta o no es válido', async () => {
    const { owner } = await setup();
    const h = auth(owner.token);
    const missing = new mongoose.Types.ObjectId();

    expect((await request(app).put(`/api/projects/${missing}`).set(h).send({ rawText: 'X' })).status).toBe(404);
    expect((await request(app).post('/api/projects/rewrite').set(h).send({ context: '# A', instruction: 'B' })).status).toBe(400);
    expect((await request(app).put('/api/projects/no-valido').set(h).send({ rawText: 'X' })).status).toBe(400);
  });

  it('canEditProject y participantIdsOf contemplan autor, colaboradores y administradores', async () => {
    const { owner, mate, other, admin, project } = await setup();
    expect(canEditProject(project, owner.user)).toBe(true);
    expect(canEditProject(project, mate.user)).toBe(true);
    expect(canEditProject(project, admin.user)).toBe(true);
    expect(canEditProject(project, other.user)).toBe(false);
    expect(canEditProject(null, owner.user)).toBe(false);
    expect(canEditProject(project, undefined)).toBe(false);
    expect(participantIdsOf(project)).toEqual([owner.user._id.toString(), mate.user._id.toString()]);
    expect(participantIdsOf({ collaborators: [{}] })).toEqual([]);
  });
});

describe('Turno de edición', () => {
  it('tomar el turno libre lo asigna y avisa a autor y colaboradores', async () => {
    const { owner, mate, id } = await setup();
    const spy = vi.spyOn(sse, 'sendToUser');

    const res = await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(owner.token));

    expect(res.status).toBe(200);
    expect(res.body.lock.userId).toBe(owner.user._id.toString());
    expect(res.body.lock.userName).toBe('Test User');
    expect(res.body.lock.remainingMs).toBeGreaterThan(EDIT_LOCK_TTL_MS - 5000);
    const notified = spy.mock.calls.map(([userId]) => userId);
    expect(notified).toEqual(expect.arrayContaining([owner.user._id.toString(), mate.user._id.toString()]));
    expect(spy.mock.calls[0]?.[1]).toMatchObject({ type: 'PROJECT_EDIT_LOCK', projectId: id });
    spy.mockRestore();
  });

  it('el turno ocupado bloquea a los demás con 409 y el proyecto no cambia', async () => {
    const { owner, mate, id } = await setup();
    await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(owner.token));
    const h = auth(mate.token);

    const lock = await request(app).post(`/api/projects/${id}/edit-lock`).set(h);
    expect(lock.status).toBe(409);
    expect(lock.body.error).toContain('Test User');
    expect(lock.body.lock.userId).toBe(owner.user._id.toString());
    expect((await request(app).put(`/api/projects/${id}`).set(h).send({ rawText: '# B' })).status).toBe(409);
    expect((await request(app).post('/api/projects/rewrite').set(h)
      .send({ projectId: id, context: '# A', instruction: 'B' })).status).toBe(409);
    expect((await request(app).post(`/api/projects/${id}/translate`).set(h).send({ target: 'catalan' })).status).toBe(409);
    expect((await request(app).post(`/api/projects/${id}/import-docx`).set(h)
      .attach('file', Buffer.from('x'), 'a.docx')).status).toBe(409);

    expect((await Project.findById(id))?.generatedContent?.rawText).toBe('# Original');
  });

  it('quien tiene el turno lo renueva al seguir editando', async () => {
    const { owner, id } = await setup();
    await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(owner.token));
    await Project.updateOne({ _id: id }, { $set: { 'editLock.expiresAt': new Date(Date.now() + 1000) } });

    const res = await request(app).put(`/api/projects/${id}`).set(auth(owner.token)).send({ rawText: '# A2' });

    expect(res.status).toBe(200);
    expect(activeLockOf(await Project.findById(id))!.remainingMs).toBeGreaterThan(EDIT_LOCK_TTL_MS - 5000);
  });

  it('el turno caduca por inactividad y otro puede tomarlo', async () => {
    const { owner, mate, id } = await setup();
    await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(owner.token));
    await expire(id);

    expect((await request(app).get(`/api/projects/${id}/edit-lock`).set(auth(mate.token))).body.lock).toBeNull();
    const res = await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(mate.token));
    expect(res.status).toBe(200);
    expect(res.body.lock.userId).toBe(mate.user._id.toString());
  });

  it('liberar el turno lo deja libre; solo puede liberarlo quien lo tiene', async () => {
    const { owner, mate, id } = await setup();
    await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(owner.token));

    const notHolder = await request(app).delete(`/api/projects/${id}/edit-lock`).set(auth(mate.token));
    expect(notHolder.body.released).toBe(false);
    const holder = await request(app).delete(`/api/projects/${id}/edit-lock`).set(auth(owner.token));
    expect(holder.body.released).toBe(true);

    const state = await request(app).get(`/api/projects/${id}/edit-lock`).set(auth(mate.token));
    expect(state.body.lock).toBeNull();
    expect((await request(app).post(`/api/projects/${id}/edit-lock`).set(auth(mate.token))).status).toBe(200);
  });

  it('con dos peticiones simultáneas solo una obtiene el turno', async () => {
    const { owner, mate, id } = await setup();
    const results = await Promise.all([
      acquireEditLock(id, owner.user),
      acquireEditLock(id, mate.user)
    ]);
    expect(results.filter(r => r.acquired)).toHaveLength(1);
  });

  it('GET edit-lock responde 404 si el proyecto no existe', async () => {
    const { owner } = await setup();
    const res = await request(app).get(`/api/projects/${new mongoose.Types.ObjectId()}/edit-lock`).set(auth(owner.token));
    expect(res.status).toBe(404);
  });

  it('activeLockOf ignora turnos incompletos y releaseEditLock sin turno no avisa', async () => {
    const { id } = await setup();
    expect(activeLockOf(null)).toBeNull();
    expect(activeLockOf({ editLock: { userId: 'x' } })).toBeNull();
    expect(activeLockOf({ editLock: { userId: 'x', expiresAt: new Date(Date.now() + 5000) } })!.userName).toBe('');
    expect(await releaseEditLock(id, new mongoose.Types.ObjectId())).toBe(false);
  });
});

describe('Invitaciones a colaborar', () => {
  it('el colaborador invitado al generar recibe una notificación personal', async () => {
    const owner = await createTestUser('teacher', 'gen-autor@test.com');
    const mate = await createTestUser('teacher', 'gen-mate@test.com');
    const other = await createTestUser('teacher', 'gen-otro@test.com');
    const spy = vi.spyOn(sse, 'sendToUser');

    const gen = await request(app).post('/api/projects/generate').set(auth(owner.token)).send({
      title: 'Compartido', modules: ['M1'], selectedRas: ['RA1'], methodology: 'ABP', tipoNivel: 'FP_BASICA',
      collaboratorIds: [mate.user._id.toString()]
    });
    expect(gen.status).toBe(202);

    const mine = (await request(app).get('/api/notifications').set(auth(mate.token))).body;
    const invitation = mine.find((n: any) => n.type === 'PROJECT_INVITATION');
    expect(invitation.title).toBe('Compartido');
    expect(invitation.userName).toBe('Test User');
    expect(invitation.message).toContain('te ha invitado a colaborar');
    expect(spy.mock.calls.some(([id, data]) => id === mate.user._id.toString() && data.type === 'PROJECT_INVITATION')).toBe(true);
    spy.mockRestore();

    const others = (await request(app).get('/api/notifications').set(auth(other.token))).body;
    expect(others.some((n: any) => n.type === 'PROJECT_INVITATION')).toBe(false);
    expect(others.some((n: any) => n.title === 'Proyecto en Cola')).toBe(true);
  });

  it('añadir un colaborador después lo notifica una sola vez y quitarlo retira la invitación', async () => {
    const { owner, other, id } = await setup();
    const h = auth(owner.token);
    const body = { userId: other.user._id.toString() };

    await request(app).post(`/api/projects/${id}/collaborators`).set(h).send(body);
    await request(app).post(`/api/projects/${id}/collaborators`).set(h).send(body);
    expect(await Notification.countDocuments({ recipientId: other.user._id, type: 'PROJECT_INVITATION' })).toBe(1);

    await request(app).delete(`/api/projects/${id}/collaborators/${other.user._id}`).set(h);
    expect(await Notification.countDocuments({ recipientId: other.user._id })).toBe(0);
    expect(await ActivityLog.countDocuments({ projectId: id, action: 'REMOVE_COLLABORATOR' })).toBe(1);
  });

  it('las notificaciones de estado no sobrescriben la invitación', async () => {
    const { owner, mate, project } = await setup();
    await notifyInvitations(project, owner.user, [mate.user._id.toString(), owner.user._id.toString()]);

    await syncProjectNotification(project, { type: 'PROJECT_COMPLETED', title: 'Hecho', message: 'Hecho' });

    expect(await Notification.countDocuments({ projectId: project._id })).toBe(2);
    expect(await Notification.countDocuments({ recipientId: owner.user._id })).toBe(0);
    const invitation = await Notification.findOne({ recipientId: mate.user._id });
    expect(invitation?.type).toBe('PROJECT_INVITATION');
  });

  it('notifyInvitations usa valores por defecto y tolera errores; deleteInvitation ignora ids inválidos', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const project = { _id: new mongoose.Types.ObjectId() };
    const recipient = new mongoose.Types.ObjectId().toString();

    await notifyInvitations(project, undefined, [recipient]);
    const created = await Notification.findOne({ recipientId: recipient });
    expect(created?.userName).toBe('Profesor');
    expect(created?.message).toContain('Un profesor');

    const createSpy = vi.spyOn(Notification, 'create').mockRejectedValueOnce(new Error('fallo'));
    await notifyInvitations(project, undefined, [new mongoose.Types.ObjectId().toString()]);
    expect(errSpy).toHaveBeenCalled();
    createSpy.mockRestore();
    errSpy.mockRestore();

    await deleteInvitation(project._id, 'no-valido');
    expect(await Notification.countDocuments({ recipientId: recipient })).toBe(1);
  });
});

describe('Registro de cambios', () => {
  it('registra quién cambió el proyecto y cuándo, del más reciente al más antiguo', async () => {
    const { owner, mate, id } = await setup();
    await request(app).put(`/api/projects/${id}`).set(auth(owner.token)).send({ rawText: '# A' });
    await request(app).post('/api/projects/rewrite').set(auth(owner.token))
      .send({ projectId: id, context: '# A', instruction: 'Añade evaluación' });
    await request(app).delete(`/api/projects/${id}/edit-lock`).set(auth(owner.token));
    await request(app).post(`/api/projects/${id}/import-docx`).set(auth(mate.token)).attach('file', Buffer.from('x'), 'b.docx');
    await request(app).post(`/api/projects/${id}/files`).set(auth(mate.token)).attach('file', Buffer.from('x'), 'r.pdf');
    await request(app).delete(`/api/projects/${id}/files/r.pdf`).set(auth(mate.token));
    await request(app).get(`/api/projects/${id}/export-docx`).set(auth(owner.token));

    const res = await request(app).get(`/api/projects/${id}/changes`).set(auth(owner.token));

    expect(res.status).toBe(200);
    expect(res.body.map((c: any) => c.action)).toEqual(['DELETE_FILE', 'UPLOAD_FILE', 'IMPORT_DOCX', 'AI_REWRITE', 'UPDATE_PROJECT']);
    expect(res.body[0].userEmail).toBe('colaborador@test.com');
    expect(res.body[3].userEmail).toBe('autor@test.com');
    expect(res.body[3].details.instruction).toBe('Añade evaluación');
    expect(new Date(res.body[0].createdAt).getTime()).toBeGreaterThanOrEqual(new Date(res.body[4].createdAt).getTime());
    expect((await Project.findById(id))?.generatedContent?.rawText).toBe('Importado');
    fs.rmSync(path.join(process.cwd(), 'uploads', id), { recursive: true, force: true });
  });

  it('limita el registro y valida el id', async () => {
    const { owner, id } = await setup();
    const logs = Array.from({ length: MAX_CHANGES + 5 }, () => ({ userId: owner.user._id, action: 'UPDATE_STATUS_BORRADOR', projectId: id }));
    await ActivityLog.insertMany(logs);
    await ActivityLog.create({ userId: new mongoose.Types.ObjectId(), action: 'UPDATE_PROJECT', projectId: id });

    const res = await request(app).get(`/api/projects/${id}/changes`).set(auth(owner.token));
    expect(res.body).toHaveLength(MAX_CHANGES);
    expect((await request(app).get('/api/projects/no-valido/changes').set(auth(owner.token))).status).toBe(400);
  });
});

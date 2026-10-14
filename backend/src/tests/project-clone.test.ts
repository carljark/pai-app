import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { cloneTitle } from '../services/project-clone.service';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const uploadsDir = (id: unknown) => path.join(process.cwd(), 'uploads', String(id));
const createdDirs: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(createdDirs.splice(0).map(d => fsp.rm(d, { recursive: true, force: true })));
});

const createOriginal = async (overrides: Record<string, unknown> = {}) => {
  const { user: owner } = await createTestUser('teacher', `owner${Date.now()}@test.com`);
  const { user: collaborator } = await createTestUser('teacher', `colab${Date.now()}@test.com`);
  return Project.create({
    title: 'Huerto escolar',
    modules: ['Biología', 'Química'],
    ras: ['RA1', 'RA2'],
    criteriosSeleccionados: [{ ce: 'CE1', ids: ['1.1'] }],
    tipoNivel: 'FP_BASICA',
    courseLevel: '1º',
    status: 'publicado',
    language: 'castellano',
    contentVersion: 3,
    generatedContent: { rawText: '# Huerto', jsonStructure: { a: 1 } },
    translations: {
      catalan: { rawText: '# Hort', sourceVersion: 3, status: 'completada' },
      castellano: { status: 'traduciendo' }
    },
    userId: owner._id,
    collaborators: [{ userId: collaborator._id }],
    editLock: { userId: owner._id, userName: 'Owner', expiresAt: new Date(Date.now() + 60000) },
    ...overrides
  });
};

const clone = (id: unknown, token: string, body: object = { language: 'castellano' }) =>
  request(app).post(`/api/projects/${id}/clone`).set('Authorization', `Bearer ${token}`).send(body);

describe('POST /api/projects/:id/clone', () => {
  it('crea una copia en borrador a nombre de quien la pide, sin tocar el original', async () => {
    const original = await createOriginal();
    const { token, user } = await createTestUser('teacher', 'cloner@test.com');

    const res = await clone(original._id, token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Copia de Huerto escolar');
    expect(res.body.userId._id).toBe(String(user._id));
    expect(res.body.status).toBe('borrador');
    expect(res.body.collaborators).toEqual([]);
    expect(res.body.editLock).toBeUndefined();
    expect(res.body.clonedFrom).toBe(String(original._id));
    expect(res.body.modules).toEqual(['Biología', 'Química']);
    expect(res.body.ras).toEqual(['RA1', 'RA2']);
    expect(res.body.criteriosSeleccionados).toEqual([{ ce: 'CE1', ids: ['1.1'] }]);
    expect(res.body.tipoNivel).toBe('FP_BASICA');
    expect(res.body.courseLevel).toBe('1º');
    expect(res.body.contentVersion).toBe(3);
    expect(res.body.generatedContent).toEqual({ rawText: '# Huerto', jsonStructure: { a: 1 } });
    expect(res.body.translations.catalan).toMatchObject({ rawText: '# Hort', sourceVersion: 3, status: 'completada' });
    expect(res.body.translations.castellano).toBeUndefined();

    const unchanged = await Project.findById(original._id).lean();
    expect(unchanged?.title).toBe('Huerto escolar');
    expect(unchanged?.status).toBe('publicado');
    expect(unchanged?.collaborators).toHaveLength(1);
    expect(await Project.countDocuments()).toBe(2);

    const log = await ActivityLog.findOne({ action: 'CLONE_PROJECT' }).lean();
    expect(String(log?.projectId)).toBe(res.body._id);
    expect(log?.details).toMatchObject({ clonedFrom: String(original._id) });
  });

  it('titula la copia en catalán y usa los módulos si el título es genérico', async () => {
    const original = await createOriginal({ title: 'Proyecto Integrador' });
    const { token } = await createTestUser('teacher', 'ca@test.com');

    const res = await clone(original._id, token, { language: 'catalan' });
    expect(res.body.title).toBe('Còpia de Biología + Química');
  });

  it('usa un nombre por defecto sin título ni módulos', () => {
    expect(cloneTitle({ title: '', modules: [] }, 'castellano')).toBe('Copia de proyecto');
    expect(cloneTitle({}, 'catalan')).toBe('Còpia de projecte');
  });

  it('titula en castellano si el idioma no es válido', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('teacher', 'nolang@test.com');
    const res = await clone(original._id, token, { language: 'inglés' });
    expect(res.body.title).toBe('Copia de Huerto escolar');
  });

  it('copia los archivos adjuntos del original', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('teacher', 'files@test.com');
    createdDirs.push(uploadsDir(original._id));
    await fsp.mkdir(uploadsDir(original._id), { recursive: true });
    await fsp.writeFile(path.join(uploadsDir(original._id), 'rubrica.pdf'), 'pdf');

    const res = await clone(original._id, token);
    createdDirs.push(uploadsDir(res.body._id));

    expect(res.status).toBe(201);
    expect(fs.readFileSync(path.join(uploadsDir(res.body._id), 'rubrica.pdf'), 'utf8')).toBe('pdf');
    expect(fs.existsSync(path.join(uploadsDir(original._id), 'rubrica.pdf'))).toBe(true);
  });

  it('no crea carpeta de adjuntos si el original no tiene', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('teacher', 'nofiles@test.com');
    const res = await clone(original._id, token);
    expect(fs.existsSync(uploadsDir(res.body._id))).toBe(false);
  });

  it('mantiene la copia aunque falle la copia de archivos', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('teacher', 'fail@test.com');
    createdDirs.push(uploadsDir(original._id));
    await fsp.mkdir(uploadsDir(original._id), { recursive: true });
    vi.spyOn(fsp, 'cp').mockRejectedValueOnce(new Error('disco lleno'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await clone(original._id, token);

    expect(res.status).toBe(201);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it.each(['en_cola', 'generando', 'error'])('rechaza con 409 un proyecto en estado %s', async status => {
    const original = await createOriginal({ status });
    const { token } = await createTestUser('teacher', `s-${status}@test.com`);
    const res = await clone(original._id, token);
    expect(res.status).toBe(409);
    expect(await Project.countDocuments()).toBe(1);
  });

  it('devuelve 400 con un id no válido y 404 si no existe', async () => {
    const { token } = await createTestUser('teacher', 'ids@test.com');
    expect((await clone('no-es-un-id', token)).status).toBe(400);
    expect((await clone(new mongoose.Types.ObjectId(), token)).status).toBe(404);
  });

  it('devuelve 403 a un usuario pendiente de aprobación', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('pending', 'pending@test.com');
    expect((await clone(original._id, token)).status).toBe(403);
  });

  it('devuelve 500 si falla la base de datos', async () => {
    const original = await createOriginal();
    const { token } = await createTestUser('teacher', 'db@test.com');
    vi.spyOn(Project, 'findById').mockImplementationOnce(() => {
      throw new Error('DB');
    });
    expect((await clone(original._id, token)).status).toBe(500);
  });
});

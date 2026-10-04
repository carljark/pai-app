import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import * as transfer from '../services/project-transfer.service';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const baseProject = (userId: any, extra: object = {}) => ({
  title: 'Proyecto de peluquería',
  modules: ['Lavado y cambios de forma del cabello'],
  ras: ['Observa el estado del cuero cabelludo'],
  tipoNivel: 'FP_BASICA',
  status: 'borrador',
  language: 'castellano',
  generatedContent: { rawText: '# Proyecto\n\nContenido' },
  aiPrompt: 'prompt interno',
  userId,
  ...extra
});

const exportAll = async (token: string, query = '') =>
  request(app).get(`/api/admin/projects/export${query}`).set('Authorization', `Bearer ${token}`);

const importPayload = async (token: string, body: object) =>
  request(app).post('/api/admin/projects/import').set('Authorization', `Bearer ${token}`).send(body);

describe('Exportación e importación de proyectos', () => {
  it('debería exigir rol de administrador', async () => {
    const { token } = await createTestUser('teacher', 'docente@test.com');
    expect((await exportAll(token)).status).toBe(403);
    expect((await importPayload(token, {})).status).toBe(403);
    expect((await request(app).get('/api/admin/projects/exportable').set('Authorization', `Bearer ${token}`)).status).toBe(403);
  });

  it('debería listar los proyectos exportables de cualquier usuario', async () => {
    const { token, user: admin } = await createTestUser('admin', 'admin@test.com');
    const { user: teacher } = await createTestUser('teacher', 'autora@test.com');
    await Project.create([
      baseProject(teacher._id, { title: undefined, modules: ['Maquillaje'], createdAt: new Date('2026-01-01') }),
      baseProject(admin._id, { title: 'Del admin', status: 'publicado', createdAt: new Date('2026-02-01') }),
      baseProject(teacher._id, { title: 'En cola', status: 'en_cola' })
    ]);

    const res = await request(app).get('/api/admin/projects/exportable').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.map((p: any) => p.title)).toEqual(['Del admin', 'Maquillaje']);
    expect(res.body[1]).toMatchObject({ tipoNivel: 'FP_BASICA', status: 'borrador', owner: { email: 'autora@test.com' } });
    expect(res.body[1]._id).toEqual(expect.any(String));
    expect(res.body[1]).not.toHaveProperty('generatedContent');
  });

  it('debería exportar los proyectos terminados con autor y colaboradores por email', async () => {
    const { token, user: admin } = await createTestUser('admin', 'admin@test.com');
    const { user: teacher } = await createTestUser('teacher', 'autora@test.com');
    await Project.create([
      baseProject(teacher._id, {
        collaborators: [{ userId: admin._id }],
        translations: {
          catalan: { rawText: '# Projecte', sourceVersion: 0, status: 'completada' },
          castellano: { status: 'traduciendo' }
        }
      }),
      baseProject(teacher._id, { title: 'En cola', status: 'en_cola', generatedContent: {} })
    ]);

    const res = await exportAll(token);

    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="plappin-proyectos-\d{4}-\d{2}-\d{2}\.json"/);
    expect(res.body).toMatchObject({ format: 'plappin-projects', version: 1, count: 1 });
    const [p] = res.body.projects;
    expect(p).toMatchObject({
      title: 'Proyecto de peluquería', owner: { email: 'autora@test.com' }, collaborators: [{ email: 'admin@test.com' }]
    });
    expect(p.translations.catalan).toMatchObject({ rawText: '# Projecte', status: 'completada' });
    expect(p.translations.castellano).toBeUndefined();
    expect(p).not.toHaveProperty('aiPrompt');
    expect(p).not.toHaveProperty('userId');
    expect(await ActivityLog.countDocuments({ action: 'EXPORT_PROJECTS' })).toBe(1);
  });

  it('debería exportar solo los proyectos indicados en ids e ignorar ids no válidos', async () => {
    const { token, user } = await createTestUser('admin', 'admin@test.com');
    const [a, , queued] = await Project.create([
      baseProject(user._id, { title: 'A' }),
      baseProject(user._id, { title: 'B' }),
      baseProject(user._id, { title: 'En cola', status: 'en_cola' })
    ]);
    const res = await exportAll(token, `?ids=${a!._id},${queued!._id},no-es-un-id`);
    expect(res.body.projects.map((p: any) => p.title)).toEqual(['A']);
  });

  it('debería importar a nombre del usuario activo, sin colaboradores, y omitir los que ya tiene', async () => {
    const { token, user: admin } = await createTestUser('admin', 'admin@test.com');
    const { user: teacher } = await createTestUser('teacher', 'autora@test.com');
    await Project.create(baseProject(teacher._id, { collaborators: [{ userId: admin._id }] }));
    const exported = (await exportAll(token)).body;
    await Project.deleteMany({});

    const first = await importPayload(token, exported);
    expect(first.body).toEqual({ imported: 1, skipped: 0, errors: [] });
    const imported = await Project.findOne().lean();
    expect(String(imported!.userId)).toBe(String(admin._id));
    expect(imported!.collaborators).toHaveLength(0);
    expect(imported!.importSourceId).toBe(exported.projects[0].sourceId);
    expect(imported!.importedAt).toBeInstanceOf(Date);

    const second = await importPayload(token, exported);
    expect(second.body).toMatchObject({ imported: 0, skipped: 1 });
    expect(await ActivityLog.countDocuments({ action: 'IMPORT_PROJECTS' })).toBe(2);
  });

  it('debería omitir un proyecto propio de la misma base de datos', async () => {
    const { token, user } = await createTestUser('admin', 'admin@test.com');
    await Project.create(baseProject(user._id));
    const res = await importPayload(token, (await exportAll(token)).body);
    expect(res.body).toMatchObject({ imported: 0, skipped: 1 });
  });

  it('debería copiar a la cuenta propia un proyecto de otro usuario de la misma base de datos', async () => {
    const { token, user: admin } = await createTestUser('admin', 'admin@test.com');
    const { user: teacher } = await createTestUser('teacher', 'autora@test.com');
    await Project.create(baseProject(teacher._id));
    const exported = (await exportAll(token)).body;

    expect((await importPayload(token, exported)).body).toMatchObject({ imported: 1, skipped: 0 });
    expect((await importPayload(token, exported)).body).toMatchObject({ imported: 0, skipped: 1 });
    expect(await Project.countDocuments({ userId: teacher._id })).toBe(1);
    expect(await Project.countDocuments({ userId: admin._id })).toBe(1);
  });

  it('debería conservar el origen al reexportar un proyecto importado (ida y vuelta)', async () => {
    const { token, user } = await createTestUser('admin', 'admin@test.com');
    await Project.create(baseProject(user._id, { importSourceId: 'id-de-produccion' }));
    const res = await exportAll(token);
    expect(res.body.projects[0].sourceId).toBe('id-de-produccion');
  });

  it('debería normalizar el estado y el idioma no válidos de un proyecto de otra instalación', async () => {
    const { token, user: admin } = await createTestUser('admin', 'admin@test.com');
    const payload = {
      format: 'plappin-projects', version: 1,
      projects: [{
        sourceId: 'externo-1', title: 'De otra instalación', tipoNivel: 'CFGM_ESTETICA', status: 'generando', language: 'aleman',
        generatedContent: { rawText: 'Texto' }, owner: { email: 'nadie@otro.com' }, collaborators: [{ email: 'ADMIN@test.com' }]
      }]
    };
    const res = await importPayload(token, payload);
    expect(res.body).toMatchObject({ imported: 1 });
    const p = await Project.findOne().lean();
    expect(String(p!.userId)).toBe(String(admin._id));
    expect(p!.collaborators).toHaveLength(0);
    expect(p!.status).toBe('borrador');
    expect(p!.language).toBe('castellano');
  });

  it('debería aceptar proyectos antiguos sin título ni nivel y rechazar los que no tienen contenido', async () => {
    const { token } = await createTestUser('admin', 'admin@test.com');
    const res = await importPayload(token, {
      format: 'plappin-projects', version: 1,
      projects: [
        { sourceId: 'antiguo', modules: ['Maquillaje', 'Atención al cliente'], generatedContent: { rawText: 'Texto' } },
        { sourceId: 'sin-modulos', generatedContent: { rawText: 'Texto' } },
        { title: 'Vacío', generatedContent: { rawText: '  ' } },
        { title: 'Nivel raro', tipoNivel: 'BACHILLERATO', generatedContent: { rawText: 'Texto' } },
        null
      ]
    });
    expect(res.body.imported).toBe(2);
    expect(res.body.errors).toEqual([
      { title: 'Vacío', error: 'No tiene contenido.' },
      { title: 'Nivel raro', error: 'Nivel no reconocido (BACHILLERATO).' },
      { title: 'Proyecto importado', error: 'No tiene contenido.' }
    ]);
    const titles = (await Project.find().lean()).map(p => [p.title, p.tipoNivel]);
    expect(titles).toEqual(expect.arrayContaining([['Maquillaje + Atención al cliente', 'FP_BASICA'], ['Proyecto importado', 'FP_BASICA']]));
  });

  it('debería rechazar ficheros que no son exportaciones válidas', async () => {
    const { token } = await createTestUser('admin', 'admin@test.com');
    expect((await importPayload(token, { format: 'otro' })).body.error).toContain('no es una exportación');
    expect((await importPayload(token, { format: 'plappin-projects', version: 2, projects: [] })).body.error).toContain('Versión');
    const res = await importPayload(token, { format: 'plappin-projects', version: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('lista de proyectos');
  });

  it('debería registrar como error un proyecto que falla al guardarse sin detener el resto', async () => {
    const { token } = await createTestUser('admin', 'admin@test.com');
    vi.spyOn(Project, 'create').mockRejectedValueOnce(new Error('fallo de escritura'));
    const res = await importPayload(token, {
      format: 'plappin-projects', version: 1,
      projects: [
        { sourceId: 'a', title: 'Falla', generatedContent: { rawText: 'x' } },
        { sourceId: 'b', title: 'Entra', generatedContent: { rawText: 'x' } }
      ]
    });
    expect(res.body).toMatchObject({ imported: 1, errors: [{ title: 'Falla', error: 'fallo de escritura' }] });
    vi.restoreAllMocks();
  });

  it('debería responder 500 si falla la exportación o la importación', async () => {
    const { token } = await createTestUser('admin', 'admin@test.com');
    vi.spyOn(transfer, 'buildProjectsExport').mockRejectedValueOnce(new Error('sin base'));
    vi.spyOn(transfer, 'importProjects').mockRejectedValueOnce(new Error('sin base'));
    vi.spyOn(transfer, 'listExportableProjects').mockRejectedValueOnce(new Error('sin base'));
    expect((await request(app).get('/api/admin/projects/exportable').set('Authorization', `Bearer ${token}`)).status).toBe(500);
    expect((await exportAll(token)).status).toBe(500);
    expect((await importPayload(token, { format: 'plappin-projects', version: 1, projects: [] })).status).toBe(500);
    vi.restoreAllMocks();
  });
});

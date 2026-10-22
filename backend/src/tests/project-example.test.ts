import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { up as exampleUp, buildExampleDoc, EXAMPLE_CONTENT_VERSION } from '../migrations/50_proyecto_ejemplo';
import { canEditProject } from '../services/project-access.service';
import { buildApprovedProjectsContext } from '../controllers/project.controller';
import { buildProjectsExport, listExportableProjects } from '../services/project-transfer.service';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
const headings = (text: string) => text.split('\n').filter(l => /^#{1,4} /.test(l)).map(l => l.match(/^#+/)![0]);
const tableRows = (text: string) => text.split('\n').filter(l => l.startsWith('|')).map(l => l.split('|').length);

/** Proyecto de ejemplo y un proyecto normal publicado del mismo nivel. */
const setup = async () => {
  await exampleUp();
  const example = (await Project.findOne({ isExample: true }))!;
  const teacher = await createTestUser('teacher', 'docente@test.com');
  const own = await new Project({
    title: 'Mi proyecto', userId: teacher.user._id, status: 'publicado',
    tipoNivel: 'CFGS_EDUCACION_INFANTIL', courseLevel: '1º', generatedContent: { rawText: '# Mío' }
  }).save();
  return { example, exampleId: example._id.toString(), teacher, own };
};

describe('Migración 50: proyecto de ejemplo', () => {
  it('crea un único proyecto publicado, en castellano y con la traducción al catalán terminada', async () => {
    await exampleUp();
    await exampleUp();
    const examples = await Project.find({ isExample: true });
    expect(examples).toHaveLength(1);
    const [example] = examples;
    expect(example!.status).toBe('publicado');
    expect(example!.tipoNivel).toBe('CFGS_EDUCACION_INFANTIL');
    expect(example!.userId).toBeUndefined();
    expect(example!.translations?.catalan?.status).toBe('completada');
    expect(example!.translations?.catalan?.sourceVersion).toBe(EXAMPLE_CONTENT_VERSION);
  });

  it('las versiones castellana y catalana tienen la misma estructura', () => {
    const doc = buildExampleDoc();
    const es = doc.generatedContent.rawText;
    const ca = doc.translations.catalan.rawText;
    expect(headings(ca)).toEqual(headings(es));
    expect(tableRows(ca)).toEqual(tableRows(es));
    expect(ca).not.toEqual(es);
    expect(ca).toContain('infants');
  });
});

describe('Proyecto de ejemplo en la API', () => {
  it('GET /api/projects/example lo devuelve a cualquier docente', async () => {
    const { teacher, exampleId } = await setup();
    const res = await request(app).get('/api/projects/example').set(auth(teacher.token));
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(exampleId);
    expect(res.body.isExample).toBe(true);
  });

  it('GET /api/projects/example responde 404 si no existe y 500 si falla la base de datos', async () => {
    const { token } = await createTestUser('teacher', 'solo@test.com');
    expect((await request(app).get('/api/projects/example').set(auth(token))).status).toBe(404);
    const spy = vi.spyOn(Project, 'findOne').mockImplementationOnce(() => { throw new Error('db'); });
    expect((await request(app).get('/api/projects/example').set(auth(token))).status).toBe(500);
    spy.mockRestore();
  });

  it('no aparece en el historial ni en el área personal', async () => {
    const { teacher, exampleId } = await setup();
    const all = await request(app).get('/api/projects').set(auth(teacher.token));
    const mine = await request(app).get('/api/projects?mine=true').set(auth(teacher.token));
    expect(all.body.map((p: any) => p._id)).not.toContain(exampleId);
    expect(all.body).toHaveLength(1);
    expect(mine.body).toHaveLength(1);
  });

  it('no se usa como referencia para la IA ni entra en la exportación de proyectos', async () => {
    await setup();
    const context = await buildApprovedProjectsContext({ tipoNivel: 'CFGS_EDUCACION_INFANTIL', courseLevel: '1º' });
    expect(context).toContain('Mi proyecto');
    expect(context).not.toContain('Rincones que cuidan');
    expect((await buildProjectsExport()).count).toBe(1);
    expect((await listExportableProjects()).map(p => p.title)).not.toContain(expect.stringContaining('Rincones'));
  });

  it('no genera avisos al rellenar las notificaciones', async () => {
    const { teacher } = await setup();
    const res = await request(app).get('/api/notifications').set(auth(teacher.token));
    expect(res.body.map((n: any) => n.title)).not.toContain(expect.stringContaining('Rincones'));
  });

  it('un docente no lo puede modificar, renombrar, traducir ni borrar', async () => {
    const { teacher, exampleId } = await setup();
    const put = await request(app).put(`/api/projects/${exampleId}`).set(auth(teacher.token)).send({ rawText: 'x' });
    const title = await request(app).patch(`/api/projects/${exampleId}/title`).set(auth(teacher.token)).send({ title: 'x' });
    const del = await request(app).delete(`/api/projects/${exampleId}`).set(auth(teacher.token));
    expect([put.status, title.status, del.status]).toEqual([403, 403, 403]);
    expect((await Project.findById(exampleId))?.title).toMatch(/^Rincones/);
  });

  it('solo un administrador lo puede editar', async () => {
    const { example, teacher } = await setup();
    const admin = await createTestUser('admin', 'admin@test.com');
    expect(canEditProject(example, teacher.user)).toBe(false);
    expect(canEditProject({ ...example.toObject(), userId: teacher.user._id }, teacher.user)).toBe(false);
    expect(canEditProject(example, admin.user)).toBe(true);
  });

  it('cualquier docente lo puede exportar a Word, pero no los proyectos ajenos', async () => {
    const { teacher, exampleId, own } = await setup();
    const other = await createTestUser('teacher', 'otro@test.com');
    const res = await request(app).get(`/api/projects/${exampleId}/export-docx`).set(auth(teacher.token));
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('wordprocessingml');
    const foreign = await request(app).get(`/api/projects/${own._id}/export-docx`).set(auth(other.token));
    expect(foreign.status).toBe(404);
  });

  it('la copia es del docente, editable y ya no es un ejemplo', async () => {
    const { teacher, exampleId } = await setup();
    const res = await request(app).post(`/api/projects/${exampleId}/clone`).set(auth(teacher.token)).send({ language: 'catalan' });
    expect(res.status).toBe(201);
    const copy = (await Project.findById(res.body._id))!;
    expect(copy.isExample).toBe(false);
    expect(copy.userId?.toString()).toBe(teacher.user._id.toString());
    expect(copy.title).toMatch(/^Còpia de Rincones/);
    expect(canEditProject(copy, teacher.user)).toBe(true);
  });
});

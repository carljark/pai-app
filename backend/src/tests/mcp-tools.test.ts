import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import express from 'express';
import jwt from 'jsonwebtoken';
import { connectDB, closeDB, clearDB } from './testSetup';
import { ActivityLog } from '../models/ActivityLog';
import { JWT_SECRET } from '../middlewares/auth.middleware';
import { createInternalApi, setInternalApiBaseUrl, type ApiResponse } from '../mcp/internal-api.client';
import { registerTools, type McpContext, type ToolDefinition } from '../mcp/tool-helpers';
import { toolsFor, buildMcpServer } from '../mcp/server';
import { curriculumTools } from '../mcp/tools/curriculum.tools';
import { projectReadTools, extractSection, projectText } from '../mcp/tools/project.tools';
import { projectEditTools } from '../mcp/tools/project-edit.tools';
import { userTools } from '../mcp/tools/user.tools';
import { adminTools } from '../mcp/tools/admin.tools';

const ALL_TOOLS = [...curriculumTools, ...projectReadTools, ...projectEditTools, ...userTools, ...adminTools];
const tool = (name: string) => ALL_TOOLS.find((t) => t.name === name)!;

type Responder = (method: string, path: string, options: any) => ApiResponse;
const ok = (data: unknown): ApiResponse => ({ ok: true, status: 200, data });
const fail = (status: number, error: string): ApiResponse => ({ ok: false, status, data: { error }, error });

/** Contexto con una API simulada que registra las llamadas. */
const fakeContext = (responder: Responder = () => ok({})) => {
  const request = vi.fn(async (method: string, path: string, options: any = {}) => responder(method, path, options));
  const ctx: McpContext = {
    api: { request },
    user: { _id: 'u1', name: 'Ana', email: 'ana@test.com', role: 'teacher', canUseAi: true },
    tokenName: 'Pruebas'
  };
  return { ctx, request };
};

const run = async (name: string, args: Record<string, unknown>, responder?: Responder) => {
  const { ctx, request } = fakeContext(responder);
  const result: any = await tool(name).run(args, ctx);
  const text = result.content[0].text;
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    // Texto plano
  }
  return { result, data, request };
};

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe('Herramientas de currículo', () => {
  it('list_levels resume el catálogo', async () => {
    const { data } = await run('list_levels', {}, () => ok([{ id: 'FP_BASICA', etapa: 'FPB', nombre_es: 'A', mapas: [], palabrasClave: 'x' }]));
    expect(data).toEqual([{ id: 'FP_BASICA', etapa: 'FPB', nombre_es: 'A' }]);
  });

  it('list_learning_outcomes filtra por nivel y módulo', async () => {
    const ras = [
      { id: '1', tipoNivel: 'FP_BASICA', moduleCode: '3060' },
      { id: '2', tipoNivel: 'FP_BASICA', moduleCode: '3061' },
      { id: '3', tipoNivel: 'CFGM_ESTETICA', moduleCode: '0633' }
    ];
    const all = await run('list_learning_outcomes', { tipoNivel: 'FP_BASICA', language: 'catalan' }, () => ok(ras));
    expect(all.data.map((r: any) => r.id)).toEqual(['1', '2']);
    expect(all.request).toHaveBeenCalledWith('GET', '/api/ras', { query: { lang: 'catalan' } });
    const one = await run('list_learning_outcomes', { tipoNivel: 'FP_BASICA', moduleCode: '3061' }, () => ok(ras));
    expect(one.data.map((r: any) => r.id)).toEqual(['2']);
  });

  it('list_eso_competences pide las de la ESO ordinaria del curso', async () => {
    const { request } = await run('list_eso_competences', { curso: '2º' }, () => ok([]));
    expect(request).toHaveBeenCalledWith('GET', '/api/ces', { query: { tipoNivel: 'ESO_ORDINARIA', curso: '2º', lang: undefined } });
  });

  it('get_intermodular_map resume los módulos o devuelve uno entero', async () => {
    const modules = [
      { code: 'A', name_es: 'a', name_ca: 'a', type: 'especifico', learningOutcomes: [{}, {}] },
      { code: 'B', name_es: 'b', name_ca: 'b', type: 'comun' }
    ];
    const summary = await run('get_intermodular_map', { tab: 'FPB' }, () => ok(modules));
    expect(summary.data).toEqual([
      { code: 'A', name_es: 'a', name_ca: 'a', type: 'especifico', ras: 2 },
      { code: 'B', name_es: 'b', name_ca: 'b', type: 'comun', ras: 0 }
    ]);
    const detail = await run('get_intermodular_map', { tab: 'FPB', moduleCode: 'B' }, () => ok(modules));
    expect(detail.data).toEqual([modules[1]]);
  });

  it('get_eso_affinities devuelve las materias o las fichas de una materia', async () => {
    const data = { curso: '1º', materias: [{ code: 'mat' }], afinidades: [{ id: 'a1', materias: ['mat', 'fis'] }, { id: 'a2', materias: ['fis'] }] };
    expect((await run('get_eso_affinities', { tab: 'ESO_1' }, () => ok(data))).data).toEqual({ curso: '1º', materias: [{ code: 'mat' }] });
    const filtered = await run('get_eso_affinities', { tab: 'ESO_1', subjectCode: 'mat' }, () => ok(data));
    expect(filtered.data.afinidades.map((a: any) => a.id)).toEqual(['a1']);
  });

  it('list_ai_models y get_fp_offer (con y sin búsqueda)', async () => {
    expect((await run('list_ai_models', {}, () => ok({ models: [] }))).data).toEqual({ models: [] });
    const offer = [{ codigo: 'IMP21', nombre_es: 'Estética' }, { codigo: 'SSC31', nombre_es: 'Infantil' }];
    expect((await run('get_fp_offer', {}, () => ok(offer))).data).toHaveLength(2);
    expect((await run('get_fp_offer', { search: 'estét' }, () => ok(offer))).data).toEqual([offer[0]]);
  });
});

describe('Herramientas de proyectos', () => {
  it('extractSection y projectText', () => {
    expect(extractSection('# A\nx\n## B\ny', 'b')).toBe('## B\ny');
    expect(extractSection('texto', 'b')).toBeNull();
    expect(projectText({ language: 'catalan', generatedContent: { rawText: 'CA' } }, 'castellano')).toEqual({ language: 'catalan', text: 'CA' });
    expect(projectText({})).toEqual({ language: 'castellano', text: '' });
  });

  it('list_projects tolera proyectos sin módulos ni colaboradores con nombre', async () => {
    const list = [{ _id: 'p', title: 'T', userId: 'u1', collaborators: [{ userId: 'u2' }] }];
    const { data } = await run('list_projects', { search: 't' }, () => ok(list));
    expect(data[0]).toMatchObject({ collaborators: ['u2'], translations: [] });
    expect(data[0].owner).toBeUndefined();
  });

  it('list_project_changes, get_project_review y errores de la API', async () => {
    const changes = await run('list_project_changes', { projectId: 'p1' }, () => ok([{ action: 'EDIT' }]));
    expect(changes.request).toHaveBeenCalledWith('GET', '/api/projects/p1/changes');
    const review = await run('get_project_review', { projectId: 'p1' }, () => ok({ review: null, stale: false }));
    expect(review.data).toEqual({ review: null, stale: false });
    const error = await run('get_project_status', { projectId: 'p1' }, () => fail(404, 'Proyecto no encontrado'));
    expect(error.result.isError).toBe(true);
    expect(error.data).toBe('Error 404: Proyecto no encontrado');
  });

  it('generate_project y retry_project resumen el proyecto encolado', async () => {
    const queued = { message: 'En cola', project: { _id: 'p1', title: 'T', status: 'en_cola' } };
    const generated = await run('generate_project', { tipoNivel: 'FP_BASICA', courseLevel: '1º', modules: ['M'], selectedRas: ['RA'] }, () => ok(queued));
    expect(generated.data).toMatchObject({ message: 'En cola', project: { _id: 'p1', status: 'en_cola' } });
    expect(generated.request.mock.calls[0]![2].body.selectedRas).toEqual(['RA']);
    const retried = await run('retry_project', { projectId: 'p1', aiProvider: 'gemini' }, () => ok(queued));
    expect(retried.request).toHaveBeenCalledWith('POST', '/api/projects/p1/retry', { body: { aiProvider: 'gemini' } });
  });

  it('update_project_content no escribe si el proyecto no existe y libera el turno', async () => {
    const { request, result } = await run('update_project_content', { projectId: 'p1', rawText: '# X' }, (method, path) =>
      method === 'GET' && path === '/api/projects/p1' ? fail(404, 'Proyecto no encontrado') : fail(500, 'x'));
    expect(result.isError).toBe(true);
    expect(request.mock.calls.map((c) => c[0])).toEqual(['GET', 'GET', 'DELETE']);
  });

  it('translate_project toma y libera el turno; review_project devuelve el estado de la revisión', async () => {
    const translated = await run('translate_project', { projectId: 'p1', target: 'catalan' }, (method, path) =>
      path.endsWith('/edit-lock') ? ok({ lock: null }) : ok({ _id: 'p1', title: 'T' }));
    expect(translated.request.mock.calls.map((c) => `${c[0]} ${c[1]}`)).toEqual([
      'GET /api/projects/p1/edit-lock', 'POST /api/projects/p1/translate', 'DELETE /api/projects/p1/edit-lock'
    ]);
    const reviewed = await run('review_project', { projectId: 'p1' }, () => ok({ _id: 'p1', review: { status: 'revisando' } }));
    expect(reviewed.data.review).toBe('revisando');
  });

  it('clone, colaboradores y borrado llaman a sus rutas', async () => {
    expect((await run('clone_project', { projectId: 'p1', language: 'catalan' })).request)
      .toHaveBeenCalledWith('POST', '/api/projects/p1/clone', { body: { language: 'catalan' } });
    expect((await run('add_collaborator', { projectId: 'p1', userId: 'u2' })).request)
      .toHaveBeenCalledWith('POST', '/api/projects/p1/collaborators', { body: { userId: 'u2' } });
    expect((await run('remove_collaborator', { projectId: 'p1', userId: 'u2' })).request)
      .toHaveBeenCalledWith('DELETE', '/api/projects/p1/collaborators/u2');
  });
});

describe('Herramientas de usuario y administración', () => {
  it('find_users busca por nombre o correo', async () => {
    const users = [{ name: 'Ana', email: 'ana@x' }, { name: 'Luis', email: 'luis@x' }];
    expect((await run('find_users', { search: 'LUIS' }, () => ok(users))).data).toEqual([users[1]]);
    expect((await run('find_users', {}, () => ok(users))).data).toHaveLength(2);
  });

  it('solicitudes, sugerencias y contexto del centro', async () => {
    expect((await run('get_school_settings', {})).request).toHaveBeenCalledWith('GET', '/api/settings');
    expect((await run('list_my_center_requests', {})).request).toHaveBeenCalledWith('GET', '/api/solicitudes/mias');
    const body = { centro: { nombre: 'IES' }, ciclos: ['IMP21'] };
    expect((await run('request_center', body)).request).toHaveBeenCalledWith('POST', '/api/solicitudes', { body });
    const feedback = { type: 'error', title: 'T', description: 'D' };
    expect((await run('send_feedback', feedback)).request).toHaveBeenCalledWith('POST', '/api/feedback', { body: feedback });
  });

  it('las herramientas de administración llaman a la API de administración', async () => {
    const calls: Array<[string, Record<string, unknown>, string]> = [
      ['admin_update_user', { userId: 'u2', role: 'teacher' }, 'PUT /api/admin/users/u2/permissions'],
      ['admin_delete_user', { userId: 'u2' }, 'DELETE /api/admin/users/u2'],
      ['admin_get_activity_logs', {}, 'GET /api/admin/logs'],
      ['admin_get_analytics', {}, 'GET /api/admin/analytics'],
      ['admin_list_center_requests', {}, 'GET /api/admin/solicitudes'],
      ['admin_update_center_request', { requestId: 's1', status: 'en_curso' }, 'PATCH /api/admin/solicitudes/s1'],
      ['admin_list_feedback', { type: 'error' }, 'GET /api/feedback'],
      ['admin_update_feedback', { feedbackId: 'f1', status: 'resuelto' }, 'PATCH /api/feedback/f1'],
      ['admin_delete_feedback', { feedbackId: 'f1' }, 'DELETE /api/feedback/f1']
    ];
    for (const [name, args, expected] of calls) {
      const { request } = await run(name, args);
      expect(`${request.mock.calls[0]![0]} ${request.mock.calls[0]![1]}`).toBe(expected);
    }
  });

  it('admin_update_school_settings conserva los campos omitidos', async () => {
    const current = { schoolName: 'IES', schoolCity: 'Palma', schoolContext: 'Rural' };
    const { request } = await run('admin_update_school_settings', { schoolCity: 'Inca' }, (method) => ok(method === 'GET' ? current : {}));
    expect(request).toHaveBeenLastCalledWith('PUT', '/api/settings', { body: { ...current, schoolCity: 'Inca' } });
    const failed = await run('admin_update_school_settings', {}, () => fail(403, 'No'));
    expect(failed.result.isError).toBe(true);
    expect((await run('admin_update_school_settings', {}, (method) => ok(method === 'GET' ? null : {}))).request)
      .toHaveBeenLastCalledWith('PUT', '/api/settings', { body: { schoolName: undefined, schoolCity: undefined, schoolContext: undefined } });
  });
});

describe('Servidor MCP: registro y cliente interno', () => {
  it('toolsFor añade las de administración solo a administradores', () => {
    expect(toolsFor('teacher').some((t) => t.name.startsWith('admin_'))).toBe(false);
    expect(toolsFor('admin').filter((t) => t.name.startsWith('admin_'))).toHaveLength(adminTools.length);
    const names = toolsFor('admin').map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    expect(buildMcpServer(fakeContext().ctx)).toBeTruthy();
  });

  it('registerTools registra el uso de las que escriben y no falla si no se puede registrar', async () => {
    const handlers: Record<string, (args: any) => Promise<any>> = {};
    const server: any = { registerTool: (name: string, _config: unknown, handler: any) => { handlers[name] = handler; } };
    const defs: ToolDefinition[] = [
      { name: 'leer', title: 'L', description: 'd', kind: 'read', run: async () => ({ content: [] }) },
      { name: 'escribir', title: 'E', description: 'd', kind: 'write', run: async () => ({ content: [] }) },
      { name: 'fallar', title: 'F', description: 'd', kind: 'write', run: async () => ({ content: [], isError: true }) }
    ];
    const { ctx } = fakeContext();
    ctx.user._id = '000000000000000000000001';
    registerTools(server, defs, ctx);
    await handlers.leer!(undefined);
    await handlers.escribir!({});
    await handlers.fallar!({});
    expect(await ActivityLog.countDocuments({ action: 'MCP_TOOL' })).toBe(1);

    vi.spyOn(ActivityLog.prototype, 'save').mockRejectedValueOnce(new Error('caída'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(handlers.escribir!({})).resolves.toEqual({ content: [] });
    vi.restoreAllMocks();
  });

  it('createInternalApi llama con un JWT del usuario y traduce las respuestas', async () => {
    const fake = express();
    fake.use(express.json());
    fake.get('/json', (req, res) => {
      const token = String(req.headers.authorization).split(' ')[1] ?? '';
      res.json({ auth: jwt.verify(token, JWT_SECRET), query: req.query });
    });
    fake.post('/texto', (_req, res) => { res.status(200).send('hola'); });
    fake.delete('/vacio', (_req, res) => { res.status(204).end(); });
    fake.get('/error', (_req, res) => { res.status(409).json({ error: 'Ocupado' }); });
    fake.get('/error-texto', (_req, res) => { res.status(502).send('Bad gateway'); });
    const server: Server = await new Promise((resolve) => { const s = fake.listen(0, () => resolve(s)); });
    setInternalApiBaseUrl(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    const api = createInternalApi({ _id: 'u1', name: 'Ana', email: 'a@x', role: 'admin', canUseAi: true });

    const json = await api.request('GET', '/json', { query: { a: 1, vacio: '', nada: undefined } });
    expect(json.data.auth).toMatchObject({ _id: 'u1', role: 'admin', canUseAi: true });
    expect(json.data.query).toEqual({ a: '1' });
    expect((await api.request('POST', '/texto', { body: { x: 1 } })).data).toBe('hola');
    expect((await api.request('DELETE', '/vacio')).data).toBeNull();
    expect(await api.request('GET', '/error')).toMatchObject({ ok: false, status: 409, error: 'Ocupado' });
    expect(await api.request('GET', '/error-texto')).toMatchObject({ ok: false, error: 'Error 502' });

    setInternalApiBaseUrl(null);
    await new Promise((resolve) => server.close(resolve));
  });
});

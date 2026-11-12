import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import request from 'supertest';
import mongoose from 'mongoose';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { ApiToken } from '../models/ApiToken';
import { setInternalApiBaseUrl } from '../mcp/internal-api.client';
import {
  createApiToken,
  hashToken,
  resolveApiToken,
  MAX_TOKENS_PER_USER,
  LAST_USED_REFRESH_MS
} from '../services/api-token.service';

let server: Server;
let baseUrl: string;
const clients: Client[] = [];

beforeAll(async () => {
  await connectDB();
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  setInternalApiBaseUrl(baseUrl);
});
afterAll(async () => {
  setInternalApiBaseUrl(null);
  await new Promise((resolve) => server.close(resolve));
  await closeDB();
});
beforeEach(async () => {
  await Promise.all(clients.splice(0).map((c) => c.close()));
  await clearDB();
});

const connect = async (token: string) => {
  const client = new Client({ name: 'test', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/api/mcp`), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } }
  });
  await client.connect(transport);
  clients.push(client);
  return client;
};

/** Usuario de pruebas con un token de conexión. */
const userWithToken = async (role: 'teacher' | 'admin', email: string) => {
  const { token: jwt, user } = await createTestUser(role, email);
  const { token } = await createApiToken(user._id, 'Pruebas');
  return { jwt, user, token };
};

const call = async (client: Client, name: string, args: Record<string, unknown> = {}) => {
  const result: any = await client.callTool({ name, arguments: args });
  const text = result.content?.[0]?.text ?? '';
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    // Mensajes de error en texto plano
  }
  return { isError: Boolean(result.isError), data, text };
};

const toolNames = async (client: Client) => (await client.listTools()).tools.map((t) => t.name);

describe('Tokens de conexión (API)', () => {
  it('crea, lista y revoca tokens sin exponer el hash', async () => {
    const { token: jwt, user } = await createTestUser('teacher', 'tok@test.com');
    const auth = { Authorization: `Bearer ${jwt}` };

    const created = await request(app).post('/api/users/me/tokens').set(auth).send({ name: '  Claude Code  ' });
    expect(created.status).toBe(201);
    expect(created.body.token).toMatch(/^plp_/);
    expect(created.body.name).toBe('Claude Code');
    expect(created.body.token.startsWith(created.body.prefix)).toBe(true);
    const stored: any = await ApiToken.findOne({ userId: user._id }).lean();
    expect(stored.tokenHash).toBe(hashToken(created.body.token));
    expect(JSON.stringify(stored)).not.toContain(created.body.token);

    const list = await request(app).get('/api/users/me/tokens').set(auth);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).not.toHaveProperty('token');
    expect(list.body[0]).not.toHaveProperty('tokenHash');
    expect(list.body[0].lastUsedAt).toBeNull();

    expect((await request(app).delete(`/api/users/me/tokens/${created.body._id}`).set(auth)).status).toBe(200);
    expect((await request(app).delete(`/api/users/me/tokens/${created.body._id}`).set(auth)).status).toBe(404);
    expect((await request(app).delete('/api/users/me/tokens/no-valido').set(auth)).status).toBe(404);
  });

  it('valida el nombre, limita los tokens por usuario y exige cuenta aprobada', async () => {
    const { token: jwt } = await createTestUser('teacher', 'tok-lim@test.com');
    const auth = { Authorization: `Bearer ${jwt}` };
    expect((await request(app).post('/api/users/me/tokens').set(auth).send({ name: ' ' })).status).toBe(400);
    expect((await request(app).post('/api/users/me/tokens').set(auth).send({})).status).toBe(400);
    for (let i = 0; i < MAX_TOKENS_PER_USER; i++) {
      expect((await request(app).post('/api/users/me/tokens').set(auth).send({ name: `T${i}` })).status).toBe(201);
    }
    expect((await request(app).post('/api/users/me/tokens').set(auth).send({ name: 'Otro' })).status).toBe(409);

    const pending = await createTestUser('pending', 'tok-pending@test.com');
    expect((await request(app).post('/api/users/me/tokens').set('Authorization', `Bearer ${pending.token}`).send({ name: 'X' })).status).toBe(403);
  });

  it('no deja revocar tokens de otra persona y responde 500 si falla la base de datos', async () => {
    const owner = await userWithToken('teacher', 'tok-owner@test.com');
    const other = await createTestUser('teacher', 'tok-other@test.com');
    const doc: any = await ApiToken.findOne({ userId: owner.user._id });
    expect((await request(app).delete(`/api/users/me/tokens/${doc._id}`).set('Authorization', `Bearer ${other.token}`)).status).toBe(404);

    const auth = { Authorization: `Bearer ${owner.jwt}` };
    vi.spyOn(ApiToken, 'find').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).get('/api/users/me/tokens').set(auth)).status).toBe(500);
    vi.spyOn(ApiToken, 'countDocuments').mockRejectedValueOnce(new Error('caída'));
    expect((await request(app).post('/api/users/me/tokens').set(auth).send({ name: 'X' })).status).toBe(500);
    vi.spyOn(ApiToken, 'deleteOne').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).delete(`/api/users/me/tokens/${doc._id}`).set(auth)).status).toBe(500);
    vi.restoreAllMocks();
  });

  it('al borrar un usuario se borran sus tokens', async () => {
    const admin = await createTestUser('admin', 'tok-admin@test.com');
    const teacher = await userWithToken('teacher', 'tok-del@test.com');
    await request(app).delete(`/api/admin/users/${teacher.user._id}`).set('Authorization', `Bearer ${admin.token}`);
    expect(await ApiToken.countDocuments({ userId: teacher.user._id })).toBe(0);
  });

  it('resolveApiToken rechaza tokens ajenos, de usuarios borrados y actualiza el último uso como mucho una vez por minuto', async () => {
    const { user, token } = await userWithToken('teacher', 'tok-res@test.com');
    expect(await resolveApiToken('otro_formato')).toBeNull();
    expect(await resolveApiToken('plp_inexistente')).toBeNull();

    const first = await resolveApiToken(token);
    expect(first?.user.role).toBe('teacher');
    expect(first?.tokenName).toBe('Pruebas');
    const usedAt = (await ApiToken.findOne({ userId: user._id }).lean())!.lastUsedAt!;
    await resolveApiToken(token);
    expect((await ApiToken.findOne({ userId: user._id }).lean())!.lastUsedAt!.getTime()).toBe(usedAt.getTime());

    await ApiToken.updateOne({ userId: user._id }, { lastUsedAt: new Date(Date.now() - LAST_USED_REFRESH_MS - 1000) });
    await resolveApiToken(token);
    expect((await ApiToken.findOne({ userId: user._id }).lean())!.lastUsedAt!.getTime()).toBeGreaterThan(usedAt.getTime() - 1);

    await mongoose.model('User').deleteOne({ _id: user._id });
    expect(await resolveApiToken(token)).toBeNull();
  });
});

describe('Servidor MCP: autenticación y transporte', () => {
  it('responde 401 sin token o con un token no válido, y 403 a cuentas pendientes', async () => {
    const body = { jsonrpc: '2.0', id: 1, method: 'tools/list' };
    const missing = await request(app).post('/api/mcp').send(body);
    expect(missing.status).toBe(401);
    expect(missing.headers['www-authenticate']).toContain('Bearer');
    expect((await request(app).post('/api/mcp').set('Authorization', 'Basic abc').send(body)).status).toBe(401);
    expect((await request(app).post('/api/mcp').set('Authorization', 'Bearer plp_falso').send(body)).status).toBe(401);

    const { user } = await createTestUser('pending', 'mcp-pending@test.com');
    const { token } = await createApiToken(user._id, 'Pendiente');
    expect((await request(app).post('/api/mcp').set('Authorization', `Bearer ${token}`).send(body)).status).toBe(403);
  });

  it('responde 500 si falla la comprobación del token', async () => {
    vi.spyOn(ApiToken, 'findOne').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).post('/api/mcp').set('Authorization', 'Bearer plp_x').send({})).status).toBe(500);
    vi.restoreAllMocks();
  });

  it('GET y DELETE responden 405', async () => {
    expect((await request(app).get('/api/mcp')).status).toBe(405);
    expect((await request(app).delete('/api/mcp')).status).toBe(405);
  });

  it('responde 500 si el transporte falla', async () => {
    const { token } = await userWithToken('teacher', 'mcp-500@test.com');
    const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
    vi.spyOn(StreamableHTTPServerTransport.prototype, 'handleRequest').mockRejectedValueOnce(new Error('roto'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).post('/api/mcp').set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json, text/event-stream').send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(res.status).toBe(500);
    vi.restoreAllMocks();
  });
});

describe('Servidor MCP: herramientas según el rol', () => {
  it('un docente ve sus herramientas y ninguna de administración', async () => {
    const { token } = await userWithToken('teacher', 'mcp-teacher@test.com');
    const client = await connect(token);
    const names = await toolNames(client);
    expect(names).toContain('whoami');
    expect(names).toContain('generate_project');
    expect(names.some((n) => n.startsWith('admin_'))).toBe(false);

    const tools = (await client.listTools()).tools;
    expect(tools.find((t) => t.name === 'delete_project')?.annotations?.destructiveHint).toBe(true);
    expect(tools.find((t) => t.name === 'get_project')?.annotations?.readOnlyHint).toBe(true);

    const me = await call(client, 'whoami');
    expect(me.data).toMatchObject({ email: 'mcp-teacher@test.com', role: 'teacher', tokenName: 'Pruebas' });
  });

  it('un administrador ve las herramientas de administración y las pierde al dejar de serlo', async () => {
    const { user, token } = await userWithToken('admin', 'mcp-admin@test.com');
    const client = await connect(token);
    expect(await toolNames(client)).toContain('admin_list_users');
    const users = await call(client, 'admin_list_users');
    expect(users.isError).toBe(false);
    expect(users.data.some((u: any) => u.email === 'mcp-admin@test.com')).toBe(true);

    await mongoose.model('User').updateOne({ _id: user._id }, { role: 'teacher' });
    expect((await toolNames(client)).some((n) => n.startsWith('admin_'))).toBe(false);
    const denied: any = await client.callTool({ name: 'admin_list_users', arguments: {} });
    expect(denied.isError).toBe(true);
  });

  it('aplica los mismos permisos que la web: sin permiso de IA no se genera', async () => {
    const { user, token } = await userWithToken('teacher', 'mcp-noai@test.com');
    await mongoose.model('User').updateOne({ _id: user._id }, { canUseAi: false });
    const client = await connect(token);
    const result = await call(client, 'generate_project', {
      tipoNivel: 'FP_BASICA', courseLevel: '1º', modules: ['M'], selectedRas: ['RA']
    });
    expect(result.isError).toBe(true);
    expect(result.text).toContain('Error 403');
    expect(await ActivityLog.countDocuments({ action: 'MCP_TOOL' })).toBe(0);
  });
});

describe('Servidor MCP: proyectos', () => {
  const content = '# Proyecto\n\nIntro\n\n## Evaluación\n\nRúbricas\n\n### Rúbrica global\n\nTabla\n\n## Recursos\n\nLibros';

  it('lista, lee por apartados y en el idioma pedido', async () => {
    const { user, token } = await userWithToken('teacher', 'mcp-read@test.com');
    const project = await Project.create({
      title: 'Huerto escolar', status: 'borrador', language: 'castellano', modules: ['Ciencias'], userId: user._id,
      generatedContent: { rawText: content }, translations: { catalan: { rawText: '# Projecte' } },
      review: { status: 'completada', overall: 4 }
    });
    await Project.create({ title: 'Otro', status: 'borrador', userId: new mongoose.Types.ObjectId() });
    const client = await connect(token);

    const mine = await call(client, 'list_projects');
    expect(mine.data).toHaveLength(1);
    expect(mine.data[0]).toMatchObject({ title: 'Huerto escolar', translations: ['catalan'], reviewOverall: 4 });
    expect((await call(client, 'list_projects', { mine: false })).data).toHaveLength(2);
    expect((await call(client, 'list_projects', { mine: false, search: 'ciencias' })).data).toHaveLength(1);

    const section = await call(client, 'get_project', { projectId: String(project._id), section: 'evaluación' });
    expect(section.data.content).toBe('## Evaluación\n\nRúbricas\n\n### Rúbrica global\n\nTabla\n');
    const missing = await call(client, 'get_project', { projectId: String(project._id), section: 'Anexos' });
    expect(missing.isError).toBe(true);
    expect(missing.text).toContain('## Evaluación');
    const catalan = await call(client, 'get_project', { projectId: String(project._id), language: 'catalan' });
    expect(catalan.data).toMatchObject({ contentLanguage: 'catalan', content: '# Projecte' });
    const notFound = await call(client, 'get_project', { projectId: '000000000000000000000000' });
    expect(notFound.isError).toBe(true);
  });

  it('guarda el contenido con el turno de edición, lo libera y registra el uso', async () => {
    const { user, token } = await userWithToken('teacher', 'mcp-edit@test.com');
    const project = await Project.create({ title: 'P', status: 'publicado', language: 'castellano', userId: user._id, generatedContent: { rawText: content } });
    const client = await connect(token);

    const saved = await call(client, 'update_project_content', { projectId: String(project._id), rawText: '# Nuevo' });
    expect(saved.isError).toBe(false);
    const doc: any = await Project.findById(project._id).lean();
    expect(doc.generatedContent.rawText).toBe('# Nuevo');
    expect(doc.status).toBe('publicado');
    expect(doc.contentVersion).toBe(1);
    expect(doc.editLock?.userId).toBeUndefined();
    const log: any = await ActivityLog.findOne({ action: 'MCP_TOOL' }).lean();
    expect(log.details).toEqual({ tool: 'update_project_content', tokenName: 'Pruebas' });
  });

  it('no escribe si otra persona tiene el turno y conserva el turno propio de la web', async () => {
    const { user, token } = await userWithToken('teacher', 'mcp-lock@test.com');
    const other = await createTestUser('teacher', 'mcp-lock-other@test.com');
    const expiresAt = new Date(Date.now() + 60_000);
    const project = await Project.create({
      title: 'P', status: 'borrador', userId: user._id, collaborators: [{ userId: other.user._id }],
      generatedContent: { rawText: content }, editLock: { userId: other.user._id, userName: 'Otra', expiresAt }
    });
    const client = await connect(token);
    const blocked = await call(client, 'update_project_content', { projectId: String(project._id), rawText: '# X' });
    expect(blocked.isError).toBe(true);
    expect(blocked.text).toContain('Error 409');
    expect(((await Project.findById(project._id).lean()) as any).generatedContent.rawText).toBe(content);

    await Project.updateOne({ _id: project._id }, { editLock: { userId: user._id, userName: 'Yo', expiresAt } });
    expect((await call(client, 'update_project_content', { projectId: String(project._id), rawText: '# Y' })).isError).toBe(false);
    expect(String(((await Project.findById(project._id).lean()) as any).editLock.userId)).toBe(String(user._id));
  });

  it('informa del estado, renombra y borra', async () => {
    const { user, token } = await userWithToken('teacher', 'mcp-misc@test.com');
    const project = await Project.create({
      title: 'P', status: 'error', errorDetail: 'Sin cuota', userId: user._id,
      translations: { catalan: { status: 'traduciendo' } }, review: { status: 'error' }
    });
    const client = await connect(token);
    const status = await call(client, 'get_project_status', { projectId: String(project._id) });
    expect(status.data).toMatchObject({ status: 'error', error: 'Sin cuota', translations: { catalan: 'traduciendo' }, review: 'error' });
    expect((await call(client, 'rename_project', { projectId: String(project._id), title: 'Nuevo' })).data.title).toBe('Nuevo');
    expect((await call(client, 'delete_project', { projectId: String(project._id) })).isError).toBe(false);
    expect(await Project.countDocuments()).toBe(0);
  });
});

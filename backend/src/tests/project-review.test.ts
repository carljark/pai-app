import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { JWT_SECRET } from '../middlewares/auth.middleware';
import {
  REVIEW_DIMENSIONS,
  buildReviewPrompt,
  buildReviewSystem,
  parseReview,
  overallScore,
  requestProjectReview
} from '../services/project-review.service';
import { runProjectReview, failInterruptedReviews, REVIEW_LOCK_MS } from '../controllers/project-review.controller';

const { aiMock } = vi.hoisted(() => ({ aiMock: vi.fn() }));

vi.mock('../services/ai.service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/ai.service')>()),
  generateAiContentWithFallback: aiMock
}));

const reviewJson = (score = 4, overrides: Record<string, unknown> = {}) => ({
  summary: 'Proyecto sólido con margen de mejora en la evaluación.',
  dimensions: REVIEW_DIMENSIONS.map(id => ({
    id,
    score,
    justification: `Justificación de ${id}`,
    suggestions: [`Mejora de ${id}`],
    section: 'Evaluación'
  })),
  ...overrides
});

const aiResponse = (text: string, extra: Record<string, unknown> = {}) => ({
  text,
  provider: 'gemini',
  model: 'gemini-3.6-flash',
  fallbackUsed: false,
  ...extra
});

const createProject = (overrides: Record<string, unknown> = {}) =>
  Project.create({
    title: 'Proyecto revisable',
    status: 'borrador',
    language: 'castellano',
    tipoNivel: 'CFGM_ESTETICA',
    courseLevel: '1',
    modules: ['Módulo A', 'Módulo B'],
    ras: ['RA1 del módulo A'],
    generatedContent: { rawText: '# Proyecto\n\nContenido del proyecto.' },
    ...overrides
  });

const waitForReviewStatus = (id: unknown, status: string) =>
  vi.waitFor(async () => {
    const doc: any = await Project.findById(id).lean();
    expect(doc?.review?.status).toBe(status);
    return doc;
  }, { timeout: 3000, interval: 20 });

const postReview = (id: unknown, token: string, body: Record<string, unknown> = {}) =>
  request(app).post(`/api/projects/${id}/review`).set('Authorization', `Bearer ${token}`).send(body);

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => {
  await clearDB();
  aiMock.mockReset();
  aiMock.mockResolvedValue(aiResponse('```json\n' + JSON.stringify(reviewJson()) + '\n```'));
});

describe('project-review.service', () => {
  it('construye el prompt con el contexto curricular, los aspectos y el proyecto', () => {
    const prompt = buildReviewPrompt({ title: 'T', tipoNivel: 'FP_BASICA', courseLevel: '2º', modules: ['Mat'], ras: ['CE 1.1'], generatedContent: { rawText: 'TEXTO' } });
    expect(prompt).toContain('Nivel educativo: CFGB Peluquería y Estética, curso 2º');
    expect(buildReviewPrompt({ tipoNivel: 'NIVEL_FUTURO' })).toContain('Nivel educativo: NIVEL_FUTURO');
    expect(prompt).toContain('- Mat');
    expect(prompt).toContain('- CE 1.1');
    REVIEW_DIMENSIONS.forEach(id => expect(prompt).toContain(`"${id}"`));
    expect(prompt.endsWith('TEXTO')).toBe(true);
  });

  it('el prompt tolera proyectos sin datos curriculares ni contenido', () => {
    const prompt = buildReviewPrompt({});
    expect(prompt).toContain('Título: (sin título)');
    expect(prompt).toContain('Nivel educativo: (no indicado)');
    expect(prompt).toContain('- (no indicado)');
  });

  it('pide responder en el idioma del proyecto', () => {
    expect(buildReviewSystem('catalan')).toContain('catalán');
    expect(buildReviewSystem('castellano')).toContain('castellano');
  });

  it('valida la revisión y calcula la nota global con un decimal', () => {
    const json = reviewJson(4);
    json.dimensions[0]!.score = 2;
    const review = parseReview('Aquí va: ' + JSON.stringify(json) + ' fin');
    expect(review?.dimensions).toHaveLength(REVIEW_DIMENSIONS.length);
    expect(review?.overall).toBe(3.8);
    expect(review?.dimensions[0]?.section).toBe('Evaluación');
    expect(overallScore([{ id: 'coherence', score: 5, justification: 'j', suggestions: ['s'] }])).toBe(5);
  });

  it('recorta las sugerencias y omite la sección vacía', () => {
    const json = reviewJson(3);
    json.dimensions[0] = { ...json.dimensions[0]!, suggestions: ['a', ' ', 'b', 'c', 'd', 'e'], section: '' };
    const review = parseReview(JSON.stringify(json));
    expect(review?.dimensions[0]?.suggestions).toEqual(['a', 'b', 'c', 'd']);
    expect(review?.dimensions[0]).not.toHaveProperty('section');
  });

  it.each([
    ['texto sin JSON', 'sin llaves'],
    ['JSON mal formado', '{ "summary": '],
    ['sin resumen', JSON.stringify(reviewJson(4, { summary: '' }))],
    ['nota fuera de rango', JSON.stringify({ ...reviewJson(), dimensions: reviewJson().dimensions.map((d, i) => (i === 0 ? { ...d, score: 6 } : d)) })],
    ['nota decimal', JSON.stringify({ ...reviewJson(), dimensions: reviewJson().dimensions.map((d, i) => (i === 0 ? { ...d, score: 3.5 } : d)) })],
    ['sin sugerencias', JSON.stringify({ ...reviewJson(), dimensions: reviewJson().dimensions.map((d, i) => (i === 0 ? { ...d, suggestions: 'no' } : d)) })],
    ['falta un aspecto', JSON.stringify({ ...reviewJson(), dimensions: reviewJson().dimensions.slice(1) })]
  ])('rechaza respuestas no válidas: %s', (_name, text) => {
    expect(parseReview(text)).toBeNull();
  });

  it('parseReview admite respuestas vacías', () => {
    expect(parseReview(undefined)).toBeNull();
  });

  it('repite una vez con el modelo que respondió si la respuesta no es válida', async () => {
    aiMock
      .mockResolvedValueOnce(aiResponse('no es JSON', { provider: 'openrouter', requestedModel: 'openai/gpt-6-luna' }))
      .mockResolvedValueOnce(aiResponse(JSON.stringify(reviewJson()), { model: 'gpt-6-luna-exacto' }));
    const result = await requestProjectReview({ generatedContent: { rawText: 'x' } }, 'castellano', { provider: 'gemini', model: 'gemini-3.6-flash' });
    expect(result.usedModel).toBe('gpt-6-luna-exacto');
    expect(aiMock).toHaveBeenNthCalledWith(1, expect.any(String), expect.any(String), 'gemini', undefined, 'gemini-3.6-flash', { reasoning: false });
    expect(aiMock).toHaveBeenNthCalledWith(2, expect.any(String), expect.any(String), 'openrouter', undefined, 'openai/gpt-6-luna', { reasoning: false });
  });

  it('falla tras dos respuestas no válidas', async () => {
    aiMock.mockResolvedValue(aiResponse('nada'));
    await expect(requestProjectReview({}, 'castellano', { provider: 'gemini' })).rejects.toThrow('no devolvió una revisión válida');
    expect(aiMock).toHaveBeenCalledTimes(2);
    expect(aiMock).toHaveBeenLastCalledWith(expect.any(String), expect.any(String), 'gemini', undefined, undefined, { reasoning: false });
  });
});

describe('POST /api/projects/:id/review', () => {
  it('responde 202 en estado revisando y guarda la revisión en segundo plano', async () => {
    const { token, user } = await createTestUser('teacher', 'rev@test.com');
    const project = await createProject({ contentVersion: 2, userId: user._id });

    const res = await postReview(project._id, token, { aiProvider: 'openrouter', aiModel: 'openai/gpt-6-luna' });

    expect(res.status).toBe(202);
    expect(res.body.review.status).toBe('revisando');
    const doc = await waitForReviewStatus(project._id, 'completada');
    expect(doc.review.dimensions).toHaveLength(REVIEW_DIMENSIONS.length);
    expect(doc.review.overall).toBe(4);
    expect(doc.review.contentVersion).toBe(2);
    expect(doc.review.language).toBe('castellano');
    expect(doc.review.usedModel).toBe('gemini-3.6-flash');
    expect(doc.review.startedAt).toBeTruthy();
    expect(doc.generatedContent.rawText).toBe('# Proyecto\n\nContenido del proyecto.');
    expect(aiMock).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'openrouter', undefined, 'openai/gpt-6-luna', { reasoning: false });
    await vi.waitFor(async () => expect(await ActivityLog.countDocuments({ action: 'REVIEW_PROJECT' })).toBe(1));
  });

  it('revisa en el idioma del proyecto con el proveedor del proyecto si no se indica otro', async () => {
    const { token, user } = await createTestUser('teacher', 'rev-ca@test.com');
    const project = await createProject({ language: 'catalan', aiProvider: 'gemini', userId: user._id });
    await postReview(project._id, token);
    const doc = await waitForReviewStatus(project._id, 'completada');
    expect(doc.review.language).toBe('catalan');
    expect(aiMock.mock.calls[0]?.[1]).toContain('catalán');
    expect(aiMock.mock.calls[0]?.[2]).toBe('gemini');
  });

  it('responde 409 si ya hay una revisión en curso y permite repetir si el bloqueo caducó', async () => {
    const { token, user } = await createTestUser('teacher', 'rev-lock@test.com');
    const project = await createProject({ userId: user._id, review: { status: 'revisando', startedAt: new Date() } });
    expect((await postReview(project._id, token)).status).toBe(409);

    await Project.updateOne({ _id: project._id }, { 'review.startedAt': new Date(Date.now() - REVIEW_LOCK_MS - 1000) });
    expect((await postReview(project._id, token)).status).toBe(202);
    await waitForReviewStatus(project._id, 'completada');
  });

  it('responde 400 si el proyecto no tiene contenido', async () => {
    const { token, user } = await createTestUser('teacher', 'rev-empty@test.com');
    const project = await createProject({ userId: user._id, generatedContent: {}, status: 'en_cola' });
    expect((await postReview(project._id, token)).status).toBe(400);
  });

  it('exige cuenta aprobada, permiso de IA y ser editor del proyecto', async () => {
    const owner = await createTestUser('teacher', 'rev-owner@test.com');
    const other = await createTestUser('teacher', 'rev-other@test.com');
    const pending = await createTestUser('pending', 'rev-pending@test.com');
    const noAiToken = jwt.sign({ _id: owner.user._id, role: 'teacher', canUseAi: false }, JWT_SECRET);
    const project = await createProject({ userId: owner.user._id });

    expect((await postReview(project._id, pending.token)).status).toBe(403);
    expect((await postReview(project._id, noAiToken)).status).toBe(403);
    expect((await postReview(project._id, other.token)).status).toBe(403);
    expect((await postReview('000000000000000000000000', owner.token)).status).toBe(404);
    expect(aiMock).not.toHaveBeenCalled();
  });

  it('guarda el error si falla la IA y conserva la revisión anterior', async () => {
    const { token, user } = await createTestUser('teacher', 'rev-fail@test.com');
    const previous = { status: 'completada', overall: 3, summary: 'Anterior', dimensions: [] };
    const project = await createProject({ userId: user._id, review: previous });
    aiMock.mockRejectedValue(new Error('IA caída'));

    expect((await postReview(project._id, token)).status).toBe(202);
    const doc = await waitForReviewStatus(project._id, 'error');
    expect(doc.review.error).toBe('IA caída');
    expect(doc.review.summary).toBe('Anterior');
  });

  it('devuelve 500 si falla el inicio de la revisión', async () => {
    const { token, user } = await createTestUser('teacher', 'rev-500@test.com');
    const project = await createProject({ userId: user._id });
    const spy = vi.spyOn(Project, 'updateOne').mockRejectedValueOnce(new Error('Mongo caído'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await postReview(project._id, token);
    expect(res.status).toBe(500);
    spy.mockRestore();
    vi.mocked(console.error).mockRestore();
  });
});

describe('Revisión en segundo plano y consulta', () => {
  it('runProjectReview ignora proyectos borrados y registra errores sin mensaje', async () => {
    await runProjectReview('000000000000000000000000', { provider: 'gemini' }, undefined);
    expect(aiMock).not.toHaveBeenCalled();

    const project = await createProject();
    aiMock.mockRejectedValue('fallo sin mensaje');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await runProjectReview(project._id, { provider: 'gemini' }, undefined);
    vi.mocked(console.error).mockRestore();
    const doc: any = await Project.findById(project._id).lean();
    expect(doc.review.status).toBe('error');
    expect(doc.review.error).toBe('fallo sin mensaje');
  });

  it('al arrancar marca como fallidas las revisiones interrumpidas', async () => {
    const running = await createProject({ review: { status: 'revisando', startedAt: new Date() } });
    const done = await createProject({ review: { status: 'completada' } });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(await failInterruptedReviews()).toBe(1);
    expect(await failInterruptedReviews()).toBe(0);
    vi.mocked(console.log).mockRestore();
    expect((await Project.findById(running._id).lean() as any).review.status).toBe('error');
    expect((await Project.findById(done._id).lean() as any).review.status).toBe('completada');
  });

  it('GET devuelve la revisión e indica si está desactualizada', async () => {
    const { token } = await createTestUser('teacher', 'rev-get@test.com');
    const project = await createProject({ contentVersion: 3, review: { status: 'completada', contentVersion: 2, overall: 4 } });
    const get = (id: unknown) => request(app).get(`/api/projects/${id}/review`).set('Authorization', `Bearer ${token}`);

    const res = await get(project._id);
    expect(res.status).toBe(200);
    expect(res.body.review.overall).toBe(4);
    expect(res.body.stale).toBe(true);

    await Project.updateOne({ _id: project._id }, { 'review.contentVersion': 3 });
    expect((await get(project._id)).body.stale).toBe(false);

    const empty = await createProject();
    expect((await get(empty._id)).body).toEqual({ review: null, stale: false });
    expect((await get('000000000000000000000000')).status).toBe(404);
    expect((await get('no-valido')).status).toBe(400);

    const spy = vi.spyOn(Project, 'findById').mockImplementationOnce(() => { throw new Error('Mongo caído'); });
    expect((await get(project._id)).status).toBe(500);
    spy.mockRestore();
  });
});

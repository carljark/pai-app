import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { JWT_SECRET } from '../middlewares/auth.middleware';
import { findSection, normalizeHeading, replaceSection, extractSection } from '../services/markdown-sections';
import { buildApplyInstruction, selectSuggestions, validSection, ApplyError } from '../services/review-apply.service';
import { REVIEW_LOCK_MS } from '../controllers/project-review.controller';

const { aiMock } = vi.hoisted(() => ({ aiMock: vi.fn() }));

vi.mock('../services/ai.service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/ai.service')>()),
  generateAiContentWithFallback: aiMock
}));

const DOC = [
  '# Proyecto huerto',
  '',
  'Introducción.',
  '',
  '## 5. Evaluación y rúbricas',
  '',
  'Rúbrica global.',
  '',
  '### Rúbrica del módulo 0633',
  '',
  'Tabla.',
  '',
  '## 6. Recursos',
  '',
  'Libros.'
].join('\n');

const review = (overrides: Record<string, unknown> = {}) => ({
  status: 'completada',
  overall: 3,
  summary: 'Resumen',
  contentVersion: 0,
  dimensions: [
    { id: 'assessment', score: 2, justification: 'Faltan instrumentos', suggestions: ['Añadir autoevaluación', 'Añadir coevaluación'], section: 'Evaluación' },
    { id: 'clarity', score: 4, justification: 'Correcta', suggestions: ['Unificar tablas'] },
    { id: 'timing', score: 3, justification: 'Ajustada', suggestions: ['Más sesiones'], section: 'Calendario' }
  ],
  ...overrides
});

const aiText = (text: string) => ({ text, provider: 'gemini', model: 'gemini-3.6-flash', fallbackUsed: false });

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => {
  await clearDB();
  aiMock.mockReset();
});

describe('markdown-sections', () => {
  it('normaliza encabezados sin tildes, mayúsculas, numeración ni formato', () => {
    expect(normalizeHeading('5.1. **Evaluación**  y rúbricas')).toBe('evaluacion y rubricas');
    expect(normalizeHeading('  ')).toBe('');
  });

  it('elige la coincidencia más exacta y, a igualdad, la más específica', () => {
    expect(findSection(DOC, 'evaluacion')).toMatchObject({ start: 4, end: 12, level: 2, heading: '5. Evaluación y rúbricas' });
    expect(findSection(DOC, 'Rúbrica')).toMatchObject({ start: 8, level: 3 });
    expect(findSection(DOC, 'Recursos del proyecto')).toMatchObject({ start: 12, end: DOC.split('\n').length });
    expect(findSection(DOC, 'Anexos')).toBeNull();
    expect(findSection(DOC, '')).toBeNull();
    expect(findSection('```\n# no es encabezado\n```\n# Sí', 'no es encabezado')).toBeNull();
  });

  it('sustituye un apartado dejando una línea en blanco antes del siguiente', () => {
    const range = findSection(DOC, 'Evaluación')!;
    const result = replaceSection(DOC, range, '## 5. Evaluación\n\nNueva.\n\n');
    expect(result).toContain('## 5. Evaluación\n\nNueva.\n\n## 6. Recursos');
    expect(result.startsWith('# Proyecto huerto')).toBe(true);
    const last = replaceSection(DOC, findSection(DOC, 'Recursos')!, '## 6. Recursos\n\nWeb.');
    expect(last.endsWith('## 6. Recursos\n\nWeb.')).toBe(true);
    expect(extractSection(DOC, 'nada')).toBeNull();
  });
});

describe('review-apply.service', () => {
  it('selecciona una sugerencia o las pendientes del aspecto', () => {
    expect(selectSuggestions(review(), 'assessment', 1).suggestions).toEqual([{ index: 1, text: 'Añadir coevaluación' }]);
    const pending = selectSuggestions(review({ applied: ['assessment:0'] }), 'assessment');
    expect(pending.suggestions).toEqual([{ index: 1, text: 'Añadir coevaluación' }]);
  });

  it.each([
    [{ status: 'revisando' }, 'assessment', undefined, 'no tiene una revisión completada'],
    [review(), 'inventado', undefined, 'no está en la revisión'],
    [review(), 'assessment', 7, 'Esa sugerencia no está'],
    [review({ applied: ['clarity:0'] }), 'clarity', undefined, 'No quedan sugerencias'],
    [review({ dimensions: [{ id: 'clarity' }] }), 'clarity', undefined, 'No quedan sugerencias'],
    [null, 'clarity', undefined, 'no tiene una revisión completada']
  ])('rechaza selecciones no válidas (%#)', (rev, dimension, index, message) => {
    expect(() => selectSuggestions(rev, dimension as string, index as number | undefined)).toThrow(message as string);
    try {
      selectSuggestions(rev, dimension as string, index as number | undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(ApplyError);
      expect((error as ApplyError).status).toBe(400);
    }
  });

  it('compone la instrucción con el criterio y las sugerencias', () => {
    const instruction = buildApplyInstruction(selectSuggestions(review(), 'assessment'));
    expect(instruction).toContain('Evaluación: instrumentos');
    expect(instruction).toContain('- Añadir autoevaluación\n- Añadir coevaluación');
    expect(instruction).toContain('Faltan instrumentos');
    expect(buildApplyInstruction({ dimension: { id: 'raro' }, suggestions: [] })).toContain('(raro)');
  });

  it('valida que el apartado empiece por un encabezado del mismo nivel y tenga contenido', () => {
    expect(validSection('## A\n\ntexto', 2)).toBe(true);
    expect(validSection('### A\n\ntexto', 2)).toBe(false);
    expect(validSection('## A\n\n', 2)).toBe(false);
    expect(validSection('texto', 2)).toBe(false);
    expect(validSection('', 2)).toBe(false);
  });
});

describe('POST /api/projects/:id/review/apply', () => {
  const setup = async (overrides: Record<string, unknown> = {}) => {
    const { token, user } = await createTestUser('teacher', `apply${Math.random()}@test.com`);
    const project: any = await Project.create({
      title: 'Huerto', status: 'publicado', userId: user._id, generatedContent: { rawText: DOC }, review: review(), ...overrides
    } as any);
    const apply = (body: Record<string, unknown>, auth = token) =>
      request(app).post(`/api/projects/${project._id}/review/apply`).set('Authorization', `Bearer ${auth}`).send(body);
    return { token, user, project, apply };
  };

  it('reescribe solo el apartado de la sugerencia, la marca y no guarda el texto', async () => {
    const { project, apply } = await setup();
    aiMock.mockResolvedValue(aiText('```markdown\n## 5. Evaluación y rúbricas\n\nRúbrica global con autoevaluación.\n```'));

    const res = await apply({ context: DOC, dimension: 'assessment', index: 0, aiProvider: 'openrouter', aiModel: 'openai/gpt-6-luna' });

    expect(res.status).toBe(200);
    expect(res.body.section).toBe('5. Evaluación y rúbricas');
    expect(res.body.applied).toEqual(['assessment:0']);
    expect(res.body.newText).toContain('Rúbrica global con autoevaluación.\n\n## 6. Recursos');
    expect(res.body.newText).not.toContain('Rúbrica del módulo 0633');
    expect(res.body.newText.startsWith('# Proyecto huerto\n\nIntroducción.')).toBe(true);
    const prompt = aiMock.mock.calls[0]![0] as string;
    expect(prompt).toContain('Añadir autoevaluación');
    expect(prompt).not.toContain('Libros.');
    expect(aiMock.mock.calls[0]!.slice(2)).toEqual(['openrouter', undefined, 'openai/gpt-6-luna', { reasoning: false }]);

    const doc: any = await Project.findById(project._id).lean();
    expect(doc.review.applied).toEqual(['assessment:0']);
    expect(doc.generatedContent.rawText).toBe(DOC);
    expect(await ActivityLog.countDocuments({ action: 'APPLY_REVIEW_SUGGESTION' })).toBe(1);
  });

  it('«Aplicar todas» aplica las pendientes del aspecto en una sola petición', async () => {
    const { project, apply } = await setup({ review: review({ applied: ['assessment:0'] }) });
    aiMock.mockResolvedValue(aiText('## 5. Evaluación\n\nCon coevaluación.'));
    const res = await apply({ context: DOC, dimension: 'assessment' });
    expect(res.body.applied).toEqual(['assessment:1']);
    expect(aiMock).toHaveBeenCalledTimes(1);
    expect(((await Project.findById(project._id).lean()) as any).review.applied).toEqual(['assessment:0', 'assessment:1']);
  });

  it('sin apartado reescribe el documento completo y detecta respuestas cortadas', async () => {
    const { apply } = await setup();
    const full = DOC.replace('Libros.', 'Libros y tablas unificadas.');
    aiMock.mockResolvedValueOnce(aiText(full));
    const res = await apply({ context: DOC, dimension: 'clarity', index: 0 });
    expect(res.body).toMatchObject({ newText: full, section: null });
    expect(aiMock.mock.calls[0]![0]).toContain('Reescribe y actualiza el documento completo');

    aiMock.mockResolvedValueOnce(aiText('# Proyecto'));
    const cut = await apply({ context: DOC, dimension: 'timing', index: 0 });
    expect(cut.status).toBe(502);
    expect(cut.body.error).toContain('incompleta');
  });

  it('no toca el texto si el apartado devuelto no es válido', async () => {
    const { project, apply } = await setup();
    aiMock.mockResolvedValue(aiText('Aquí tienes el apartado mejorado.'));
    const res = await apply({ context: DOC, dimension: 'assessment', index: 0 });
    expect(res.status).toBe(502);
    expect(((await Project.findById(project._id).lean()) as any).review.applied).toBeUndefined();
  });

  it('valida la petición y exige permiso de IA, ser editor y el turno de edición', async () => {
    const { user, project, apply } = await setup();
    expect((await apply({ dimension: 'assessment' })).status).toBe(400);
    expect((await apply({ context: DOC })).status).toBe(400);
    expect((await apply({ context: DOC, dimension: 'assessment', index: -1 })).status).toBe(400);
    expect((await apply({ context: DOC, dimension: 'assessment', index: 'a' })).status).toBe(400);
    expect((await apply({ context: DOC, dimension: 'inventado' })).status).toBe(400);

    const noAi = jwt.sign({ _id: user._id, role: 'teacher', canUseAi: false }, JWT_SECRET);
    expect((await apply({ context: DOC, dimension: 'assessment', index: 0 }, noAi)).status).toBe(403);
    const other = await createTestUser('teacher', 'apply-other@test.com');
    expect((await apply({ context: DOC, dimension: 'assessment', index: 0 }, other.token)).status).toBe(403);

    await Project.updateOne({ _id: project._id }, { editLock: { userId: other.user._id, userName: 'Otra', expiresAt: new Date(Date.now() + 60_000) } });
    expect((await apply({ context: DOC, dimension: 'assessment', index: 0 })).status).toBe(409);
    expect(aiMock).not.toHaveBeenCalled();
  });

  it('responde 500 si falla la IA', async () => {
    const { apply } = await setup();
    aiMock.mockRejectedValue(new Error('IA caída'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await apply({ context: DOC, dimension: 'assessment', index: 0 })).status).toBe(500);
    vi.mocked(console.error).mockRestore();
  });

  it('una revisión nueva empieza sin sugerencias aplicadas', async () => {
    const { token, project } = await setup({ review: review({ applied: ['assessment:0'], startedAt: new Date(Date.now() - REVIEW_LOCK_MS - 1) }) });
    aiMock.mockResolvedValue(aiText(JSON.stringify({
      summary: 'Nuevo',
      dimensions: ['curricularAlignment', 'coherence', 'drivingQuestion', 'activities', 'assessment', 'integration', 'inclusion', 'timing', 'clarity']
        .map((id) => ({ id, score: 4, justification: 'J', suggestions: ['S'] }))
    })));
    await request(app).post(`/api/projects/${project._id}/review`).set('Authorization', `Bearer ${token}`).send({});
    const doc: any = await vi.waitFor(async () => {
      const d: any = await Project.findById(project._id).lean();
      expect(d.review.summary).toBe('Nuevo');
      return d;
    }, { timeout: 3000, interval: 20 });
    expect(doc.review.applied).toBeUndefined();
  });
});

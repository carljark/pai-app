import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { Project } from '../models/Project';
import { RA } from '../models/RA';
import { CE } from '../models/CE';
import {
  isContentLanguage,
  projectLanguage,
  detectContentLanguage,
  splitMarkdownSections,
  buildCurriculumGlossary,
  buildTranslationPrompt,
  translateMarkdown
} from '../services/translation.service';
import { pickProjectText, buildContentUpdate } from '../services/projectContent.service';
import { up as addProjectLanguage } from '../migrations/12_add_project_language';

const { aiMock } = vi.hoisted(() => ({ aiMock: vi.fn() }));

vi.mock('../services/ai.service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/ai.service')>()),
  generateAiContentWithFallback: aiMock
}));

const ORIGINAL_ES = '# Proyecto\n\nLos alumnos preparan el puesto de trabajo con las herramientas.';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => {
  await clearDB();
  aiMock.mockReset();
  aiMock.mockImplementation(async (prompt: string) => ({
    text: '```markdown\nTRADUCIDO ' + prompt.split('--- FRAGMENTO ---\n')[1] + '\n```',
    provider: 'gemini',
    model: 'gemini-3.6-flash',
    fallbackUsed: false
  }));
});

const createProject = (overrides: Record<string, unknown> = {}) =>
  Project.create({
    title: 'Proyecto',
    status: 'borrador',
    language: 'castellano',
    generatedContent: { rawText: ORIGINAL_ES },
    ras: ['RA oficial ES'],
    ...overrides
  });

describe('translation.service - utilidades', () => {
  it('valida y resuelve idiomas de contenido', () => {
    expect(isContentLanguage('catalan')).toBe(true);
    expect(isContentLanguage('ingles')).toBe(false);
    expect(isContentLanguage(undefined)).toBe(false);
    expect(projectLanguage({ language: 'catalan' })).toBe('catalan');
    expect(projectLanguage({})).toBe('castellano');
  });

  it('detecta el idioma por palabras frecuentes', () => {
    expect(detectContentLanguage('Els alumnes treballen amb les eines per a la pràctica i també l\'alumnat')).toBe('catalan');
    expect(detectContentLanguage('Los alumnos trabajan con las herramientas para la práctica')).toBe('castellano');
    expect(detectContentLanguage(undefined)).toBe('castellano');
  });

  it('trocea el Markdown por encabezados y párrafos respetando el máximo', () => {
    const text = '# A\nuno\n## B\ndos\n## C\n' + 'p'.repeat(30) + '\n\n' + 'q'.repeat(30);
    const sections = splitMarkdownSections(text, 40);
    expect(sections.every(s => s.length <= 40)).toBe(true);
    expect(sections.join('\n')).toContain('# A');
    expect(sections.length).toBeGreaterThan(2);
    expect(splitMarkdownSections('# Solo\ntexto', 1000)).toEqual(['# Solo\ntexto']);
    expect(splitMarkdownSections('   ')).toEqual([]);
  });

  it('construye el prompt con y sin glosario', () => {
    const withGlossary = buildTranslationPrompt('Texto', 'castellano', 'catalan', '- "a" → "b"');
    expect(withGlossary.prompt).toContain('denominaciones oficiales');
    expect(withGlossary.prompt).toContain('al catalán');
    const without = buildTranslationPrompt('Text', 'catalan', 'castellano', '');
    expect(without.prompt).not.toContain('denominaciones oficiales');
    expect(without.system).toContain('traductor');
  });

  it('genera el glosario con los textos oficiales de RAs y CEs', async () => {
    await RA.create({ description_es: 'RA oficial ES', description_ca: 'RA oficial CA', module_es: 'Mód ES', module_ca: 'Mòd CA' });
    await CE.create({ description_es: 'CE oficial ES', description_ca: 'CE oficial CA' });
    await RA.create({ description_es: 'Igual', description_ca: 'Igual' });

    const glossary = await buildCurriculumGlossary(['RA oficial ES', 'CE oficial ES', 'Igual'], 'castellano', 'catalan');
    expect(glossary).toContain('"RA oficial ES" → "RA oficial CA"');
    expect(glossary).toContain('"Mód ES" → "Mòd CA"');
    expect(glossary).toContain('"CE oficial ES" → "CE oficial CA"');
    expect(glossary).not.toContain('Igual');
    expect(await buildCurriculumGlossary([], 'castellano', 'catalan')).toBe('');
  });

  it('traduce sección a sección y elimina los bloques de código', async () => {
    const result = await translateMarkdown('# A\nuno\n## B\ndos', {
      source: 'castellano', target: 'catalan', glossary: '', provider: 'gemini'
    });
    expect(result).toBe('TRADUCIDO # A\nuno\n## B\ndos');
    expect(aiMock).toHaveBeenCalledTimes(1);
  });
});

describe('projectContent.service', () => {
  const project = {
    language: 'castellano',
    generatedContent: { rawText: 'original' },
    translations: { catalan: { rawText: 'traduït' } }
  };

  it('elige la traducción solo si existe y el idioma difiere del original', () => {
    expect(pickProjectText(project, 'catalan')).toBe('traduït');
    expect(pickProjectText(project, 'castellano')).toBe('original');
    expect(pickProjectText(project, undefined)).toBe('original');
    expect(pickProjectText({ ...project, translations: {} }, 'catalan')).toBe('original');
  });

  it('guarda la edición en la versión del idioma o en el original', () => {
    const translated: any = buildContentUpdate(project, 'nou', 'publicado', 'catalan');
    expect(translated.$set['translations.catalan.rawText']).toBe('nou');
    expect(translated.$set.status).toBe('publicado');
    expect(translated.$inc).toBeUndefined();

    const original: any = buildContentUpdate(project, 'nuevo', undefined, 'castellano');
    expect(original.$set['generatedContent.rawText']).toBe('nuevo');
    expect(original.$set.status).toBe('borrador');
    expect(original.$inc).toEqual({ contentVersion: 1 });

    const unchanged: any = buildContentUpdate(project, 'original', 'borrador');
    expect(unchanged.$inc).toBeUndefined();
  });
});

describe('POST /api/projects/:id/translate', () => {
  it('traduce el proyecto y guarda la versión con su sourceVersion', async () => {
    const { token } = await createTestUser('teacher', 'trad@test.com');
    const project = await createProject({ contentVersion: 3 });

    const res = await request(app)
      .post(`/api/projects/${project._id}/translate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ target: 'catalan', aiProvider: 'openrouter', aiModel: 'openai/gpt-6-luna' });

    expect(res.status).toBe(200);
    expect(res.body.translations.catalan.rawText).toContain('TRADUCIDO');
    expect(res.body.translations.catalan.sourceVersion).toBe(3);
    expect(res.body.generatedContent.rawText).toBe(ORIGINAL_ES);
    expect(aiMock).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'openrouter', undefined, 'openai/gpt-6-luna');
  });

  it('usa el proveedor del proyecto si no se indica otro', async () => {
    const { token } = await createTestUser('teacher', 'trad2@test.com');
    const project = await createProject({ aiProvider: 'gemini' });
    await request(app)
      .post(`/api/projects/${project._id}/translate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ target: 'catalan' });
    expect(aiMock).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'gemini', undefined, undefined);
  });

  it('rechaza idiomas inválidos, proyectos inexistentes, sin contenido o ya en ese idioma', async () => {
    const { token } = await createTestUser('teacher', 'trad3@test.com');
    const project = await createProject();
    const empty = await createProject({ generatedContent: { rawText: '' } });
    const post = (id: unknown, target: unknown) =>
      request(app).post(`/api/projects/${id}/translate`).set('Authorization', `Bearer ${token}`).send({ target });

    expect((await post(project._id, 'ingles')).status).toBe(400);
    expect((await post('64b7f0000000000000000000', 'catalan')).status).toBe(404);
    expect((await post(empty._id, 'catalan')).status).toBe(400);
    expect((await post(project._id, 'castellano')).status).toBe(400);
  });

  it('devuelve 500 si falla la IA', async () => {
    const { token } = await createTestUser('teacher', 'trad4@test.com');
    const project = await createProject();
    aiMock.mockRejectedValueOnce(new Error('sin cuota'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app)
      .post(`/api/projects/${project._id}/translate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ target: 'catalan' });
    expect(res.status).toBe(500);
    errorSpy.mockRestore();
  });
});

describe('Edición y exportación por idioma', () => {
  it('PUT guarda la traducción sin tocar el original ni contentVersion', async () => {
    const { token } = await createTestUser('teacher', 'edit@test.com');
    const project = await createProject({ translations: { catalan: { rawText: 'abans', sourceVersion: 0 } } });

    const res = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rawText: 'després', status: 'borrador', language: 'catalan' });

    expect(res.status).toBe(200);
    expect(res.body.translations.catalan.rawText).toBe('després');
    expect(res.body.generatedContent.rawText).toBe(ORIGINAL_ES);
    expect(res.body.contentVersion).toBe(0);
  });

  it('PUT del original incrementa contentVersion y devuelve null si no existe', async () => {
    const { token } = await createTestUser('teacher', 'edit2@test.com');
    const project = await createProject();
    const res = await request(app)
      .put(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rawText: 'nuevo texto', status: 'publicado' });
    expect(res.body.contentVersion).toBe(1);

    const missing = await request(app)
      .put('/api/projects/64b7f0000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ rawText: 'x' });
    expect(missing.body).toBeNull();
  });

  it('exporta a DOCX la versión del idioma pedido', async () => {
    const { token, user } = await createTestUser('teacher', 'export@test.com');
    const project = await createProject({
      userId: user._id,
      translations: { catalan: { rawText: '# Projecte' } }
    });
    const res = await request(app)
      .get(`/api/projects/${project._id}/export-docx?lang=catalan`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('wordprocessingml');
  });

  it('guarda el idioma de generación del proyecto', async () => {
    const { token } = await createTestUser('teacher', 'gen@test.com');
    const res = await request(app)
      .post('/api/projects/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'P', modules: ['M1'], selectedRas: ['RA1'], methodology: 'ABP', tipoNivel: 'FP_BASICA', language: 'catalan' });
    expect(res.status).toBe(202);
    expect(res.body.project.language).toBe('catalan');
  });
});

describe('Migración 12 - idioma de los proyectos', () => {
  it('asigna el idioma detectado solo a los proyectos sin idioma', async () => {
    await Project.collection.insertMany([
      { title: 'ca', generatedContent: { rawText: 'Els alumnes treballen amb les eines per a la pràctica' } },
      { title: 'es', generatedContent: { rawText: 'Los alumnos trabajan con las herramientas' }, contentVersion: 2 },
      { title: 'ya', language: 'castellano', generatedContent: { rawText: 'Els alumnes amb les eines' } }
    ]);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await addProjectLanguage();
    await addProjectLanguage();

    const docs = await Project.collection.find({}).toArray();
    const byTitle = Object.fromEntries(docs.map(d => [d.title, d]));
    expect(byTitle.ca?.language).toBe('catalan');
    expect(byTitle.ca?.contentVersion).toBe(0);
    expect(byTitle.es?.language).toBe('castellano');
    expect(byTitle.es?.contentVersion).toBe(2);
    expect(byTitle.ya?.language).toBe('castellano');
    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { CE } from '../models/CE';
import { up as backfillPdcUp } from '../migrations/22_ce_tipo_nivel_pdc';
import { up as ingestEsoUp } from '../migrations/23_ingest_ces_eso_ordinaria';
import { NIVELES, NIVEL_IDS, defaultCurso, edadDeCurso, findNivel } from '../data/niveles';
import {
  buildEsoInstruction,
  criteriosDelCurso,
  esoSelection,
  findEsoCe,
  parseEsoSelection
} from '../services/eso-curriculum.service';
import { buildCurriculumGlossary } from '../services/translation.service';
import { describeTargetCourse } from '../controllers/project.controller';

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create: vi.fn().mockResolvedValue({ output_text: '# Mock' }) };
  }
}));

const DATA_DIR = path.resolve(__dirname, '../data/curriculo-eso');
const materias = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

const getCes = async (curso: string, lang = 'castellano') => {
  const { token } = await createTestUser('teacher', `ces_${curso}_${lang}@test.com`.replace('º', ''));
  return request(app).get(`/api/ces?tipoNivel=ESO_ORDINARIA&curso=${encodeURIComponent(curso)}&lang=${lang}`)
    .set('Authorization', `Bearer ${token}`);
};

const generate = async (body: Record<string, unknown>) => {
  const { token } = await createTestUser('teacher', `gen_${Date.now()}_${Math.random()}@test.com`);
  return request(app).post('/api/projects/generate').set('Authorization', `Bearer ${token}`)
    .send({ methodology: 'ABP', tipoNivel: 'ESO_ORDINARIA', ...body });
};

describe('Catálogo de niveles', () => {
  it('define la ESO ordinaria con cuatro cursos y la edad de cada uno', () => {
    const eso = findNivel('ESO_ORDINARIA');
    expect(eso?.nombre_es).toBe('ESO');
    expect(eso?.unidad).toBe('CE');
    expect(eso?.cursos.map(c => c.curso)).toEqual(['1º', '2º', '3º', '4º']);
    expect(edadDeCurso('ESO_ORDINARIA', '1º')).toBe('12-13 años');
    expect(edadDeCurso('ESO_ORDINARIA', '4º')).toBe('15-16 años');
    expect(edadDeCurso('CFGM_ESTETICA', '1º')).toBeUndefined();
  });

  it('da el curso por defecto de cada nivel', () => {
    expect(defaultCurso('ESO_ORDINARIA')).toBe('1º');
    expect(defaultCurso('DIVERSIFICACION_CURRICULAR')).toBe('3º');
    expect(defaultCurso(undefined)).toBe('1º');
    expect(NIVEL_IDS).toContain('CFGS_EDUCACION_INFANTIL');
  });

  it('GET /api/niveles devuelve el catálogo', async () => {
    const { token } = await createTestUser('teacher', 'niveles@test.com');
    const res = await request(app).get('/api/niveles').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(NIVELES.length);
    expect(res.body.find((n: any) => n.id === 'ESO_ORDINARIA').cursos).toHaveLength(4);
  });

  it('describe el curso destino de la ESO y de los ciclos con el nombre del catálogo', () => {
    expect(describeTargetCourse('ESO_ORDINARIA', '2º')).toBe('2º de ESO (Educación Secundaria Obligatoria)');
    expect(describeTargetCourse('CFGM_PELUQUERIA', '2º', 'catalan')).toBe('2º de CFGM Perruqueria i Cosmètica Capil·lar');
  });
});

describe('Datos curriculares de la ESO (Decreto 42/2025)', () => {
  it('tiene paridad ES/CA en materias, CE y criterios', () => {
    expect(materias).toHaveLength(31);
    for (const materia of materias) {
      expect(materia.name_es && materia.name_ca).toBeTruthy();
      for (const ce of materia.competencias) {
        expect(ce.description_es.length).toBeGreaterThan(20);
        expect(ce.description_ca.length).toBeGreaterThan(20);
        expect(ce.criterios.length).toBeGreaterThan(0);
        for (const c of ce.criterios) {
          expect(c.id.startsWith(`${ce.ce_num}.`)).toBe(true);
          expect(c.text_es && c.text_ca).toBeTruthy();
          expect(c.aclaraciones_es).toHaveLength(c.aclaraciones_ca.length);
          expect(c.cursos.every((curso: string) => curso in materia.cursos)).toBe(true);
        }
      }
    }
  });

  it('marca cada materia como común, de opción u optativa en cada curso', () => {
    const tipos = new Set(materias.flatMap(m => Object.values(m.cursos)));
    expect([...tipos].sort()).toEqual(['comun', 'opcion', 'optativa']);
    const byCode = Object.fromEntries(materias.map(m => [m.code, m.cursos]));
    expect(byCode.fisica_quimica).toEqual({ '2º': 'comun', '3º': 'comun', '4º': 'opcion' });
    expect(byCode.igualdad_genero).toEqual({ '1º': 'optativa', '2º': 'optativa' });
    expect(byCode.valores_civicos_eticos).toEqual({ '4º': 'comun' });
  });
});

describe('Migraciones de CE', () => {
  it('marca las CE existentes como PDC y no toca las que ya tienen nivel', async () => {
    await CE.create({ subject: 'Matemàtiques', ce_id: 'CE.1', description_es: 'PDC' });
    await CE.create({ tipoNivel: 'ESO_ORDINARIA', ce_id: 'CE1', description_es: 'ESO' });
    await backfillPdcUp();
    await backfillPdcUp();
    expect(await CE.countDocuments({ tipoNivel: 'DIVERSIFICACION_CURRICULAR' })).toBe(1);
    expect(await CE.countDocuments({ tipoNivel: 'ESO_ORDINARIA' })).toBe(1);
  });

  it('carga las CE de la ESO de forma idempotente sin tocar las del PDC', async () => {
    await CE.create({ tipoNivel: 'DIVERSIFICACION_CURRICULAR', ce_id: 'CE.1', description_es: 'PDC' });
    await ingestEsoUp();
    await ingestEsoUp();
    const total = materias.reduce((n, m) => n + m.competencias.length, 0);
    expect(await CE.countDocuments({ tipoNivel: 'ESO_ORDINARIA' })).toBe(total);
    expect(await CE.countDocuments({ tipoNivel: 'DIVERSIFICACION_CURRICULAR' })).toBe(1);
  });
});

describe('GET /api/ces de la ESO', () => {
  beforeEach(async () => await ingestEsoUp());

  it('muestra en 2.º Física y Química pero no Biología y Geología', async () => {
    const res = await getCes('2º');
    const subjects = new Set(res.body.map((c: any) => c.subject));
    expect(subjects.has('Física y Química')).toBe(true);
    expect(subjects.has('Biología y Geología')).toBe(false);
    expect(subjects.has('Cultura Clásica I') && subjects.has('Cultura Clásica II')).toBe(true);
  });

  it('ordena primero las materias comunes y marca las optativas y de opción', async () => {
    const res = await getCes('4º');
    const tipos = res.body.map((c: any) => c.tipo);
    expect(tipos[0]).toBe('comun');
    expect(tipos.indexOf('opcion')).toBeGreaterThan(tipos.lastIndexOf('comun'));
    const matA = res.body.find((c: any) => c.subject === 'Matemáticas A');
    expect(matA.tipo).toBe('opcion');
    expect(matA.value).toBe(`Matemáticas A · CE1. ${matA.description}`);
  });

  it('devuelve solo los criterios del curso pedido', async () => {
    const tercero = (await getCes('3º')).body.find((c: any) => c.subject === 'Biología y Geología' && c.ce_num === 1);
    const res4 = await getCes('4º');
    const cuarto = res4.body.find((c: any) => c.subject === 'Biología y Geología' && c.ce_num === 1);
    expect(tercero.criterios).toHaveLength(3);
    expect(cuarto.criterios[0]).toMatch(/^1\.1: /);
    expect(cuarto.criterios).not.toEqual(tercero.criterios);
  });

  it('devuelve materias, CE y criterios en catalán', async () => {
    const res = await getCes('1º', 'catalan');
    const ce = res.body.find((c: any) => c.subject === 'Biologia i Geologia' && c.ce_num === 1);
    expect(ce.description).toMatch(/^Interpretar i transmetre/);
    expect(ce.criterios[0]).toMatch(/^1\.1: Analitzar/);
  });

  it('sin tipoNivel sigue devolviendo solo las CE del PDC', async () => {
    await CE.create({ tipoNivel: 'DIVERSIFICACION_CURRICULAR', area: 'Àmbit', subject: 'Matemàtiques', ce_id: 'CE.1', description_es: 'PDC' });
    const { token } = await createTestUser('teacher', 'pdc_ces@test.com');
    const res = await request(app).get('/api/ces?lang=castellano').set('Authorization', `Bearer ${token}`);
    expect(res.body).toHaveLength(1);
  });
});

describe('Selección de CE de la ESO', () => {
  it('compone y descompone el valor de selección', () => {
    const value = esoSelection('Matemáticas B', 3, 'Formular conjeturas. Y más.');
    expect(value).toBe('Matemáticas B · CE3. Formular conjeturas. Y más.');
    expect(parseEsoSelection(value)).toEqual({ subject: 'Matemáticas B', ceNum: 3 });
    expect(parseEsoSelection('Texto sin formato')).toBeNull();
  });

  it('distingue CE con el mismo texto en materias distintas', () => {
    const ces = [
      { tipoNivel: 'ESO_ORDINARIA', subject_es: 'Matemáticas A', subject_ca: 'Matemàtiques A', ce_num: 1 },
      { tipoNivel: 'ESO_ORDINARIA', subject_es: 'Matemáticas B', subject_ca: 'Matemàtiques B', ce_num: 1 }
    ];
    expect(findEsoCe(ces, 'Matemàtiques B · CE1. Igual')).toBe(ces[1]);
    expect(findEsoCe(ces, 'Sin formato')).toBeUndefined();
  });

  it('filtra criterios por curso aunque falten datos', () => {
    expect(criteriosDelCurso({}, '1º')).toEqual([]);
    expect(criteriosDelCurso({ criteriosPorCurso: [{ id: '1.1' }] }, '1º')).toEqual([]);
  });
});

describe('Generación de proyectos de ESO', () => {
  beforeEach(async () => await ingestEsoUp());

  it('incluye la edad, la terminología LOMLOE y solo los criterios del curso', async () => {
    const ce = (await getCes('1º')).body.find((c: any) => c.subject === 'Biología y Geología' && c.ce_num === 1);
    const res = await generate({ selectedRas: [ce.value], modules: ['Biología y Geología'], courseLevel: '1º' });
    expect(res.status).toBe(202);
    const { aiPrompt, aiInstruction, tipoNivel, courseLevel } = res.body.project;
    expect(tipoNivel).toBe('ESO_ORDINARIA');
    expect(courseLevel).toBe('1º');
    expect(aiPrompt).toContain('1º de ESO (Educación Secundaria Obligatoria)');
    expect(aiPrompt).toContain('- Materia: Biología y Geología');
    expect(aiPrompt).toContain('CRITERIOS DE EVALUACIÓN OFICIALES DE 1º');
    expect(aiPrompt).toContain('Descriptores del perfil de salida: ');
    expect(aiInstruction).toContain('de 12-13 años');
    expect(aiInstruction).toContain('"Situación de aprendizaje"');
  });

  it('usa el curso por defecto (1.º) y las CE en catalán', async () => {
    const ce = (await getCes('1º', 'catalan')).body.find((c: any) => c.subject === 'Música' && c.ce_num === 1);
    const res = await generate({ selectedRas: [ce.value], language: 'catalan' });
    expect(res.body.project.courseLevel).toBe('1º');
    expect(res.body.project.aiPrompt).toContain('- Materia: Música');
    expect(res.body.project.aiPrompt).toContain(ce.description);
  });

  it('no aplica las reglas de la ESO a un proyecto del PDC con el mismo texto de CE', async () => {
    const eso = await CE.findOne({ tipoNivel: 'ESO_ORDINARIA', subjectCode: 'biologia_geologia', ce_num: 1 });
    await CE.create({
      tipoNivel: 'DIVERSIFICACION_CURRICULAR', subject: 'Biologia i Geologia', ce_id: 'CE.1',
      description_es: eso!.description_es, criterios_es: [{ criterio_id: '3º ESO - 1.1', description: 'Criterio PDC' }]
    });
    const res = await generate({ tipoNivel: 'DIVERSIFICACION_CURRICULAR', selectedRas: [eso!.description_es], courseLevel: '3º' });
    expect(res.body.project.aiPrompt).toContain('1.1: Criterio PDC');
    expect(res.body.project.aiInstruction).not.toContain('REGLAS OBLIGATORIAS PARA LA ESO');
  });

  it('mantiene la regla de edad aunque el curso no tenga edad definida', () => {
    expect(buildEsoInstruction('5º')).toContain('alumnado de 5º de ESO. Adapta');
  });

  it('añade al glosario de traducción la materia y la CE oficiales', async () => {
    const ce = (await getCes('1º')).body.find((c: any) => c.subject === 'Música' && c.ce_num === 1);
    const glossary = await buildCurriculumGlossary([ce.value, 'Otro texto'], 'castellano', 'catalan');
    expect(glossary).toContain(`"${ce.description}" → "`);
    expect(await buildCurriculumGlossary(['Nada'], 'castellano', 'catalan')).toBe('');
  });
});

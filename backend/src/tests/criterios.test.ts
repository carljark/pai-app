import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { CE } from '../models/CE';
import { Project } from '../models/Project';
import { up as ingestEsoUp } from '../migrations/23_ingest_ces_eso_ordinaria';
import { criteriosDeCe, criteriosParaPrompt, parseSeleccion, validarSeleccion } from '../services/criterios.service';

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = { create: vi.fn().mockResolvedValue({ output_text: '# Mock' }) };
  }
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

let counter = 0;
const auth = async () => (await createTestUser('teacher', `crit_${++counter}_${Date.now()}@test.com`)).token;

const getCes = async (curso: string, lang = 'castellano', tipoNivel = 'ESO_ORDINARIA') => {
  const token = await auth();
  return request(app).get(`/api/ces?tipoNivel=${tipoNivel}&curso=${encodeURIComponent(curso)}&lang=${lang}`)
    .set('Authorization', `Bearer ${token}`);
};

const generate = async (body: Record<string, unknown>) =>
  request(app).post('/api/projects/generate').set('Authorization', `Bearer ${await auth()}`)
    .send({ methodology: 'ABP', tipoNivel: 'ESO_ORDINARIA', ...body });

const musicaCe = async (curso = '1º', lang = 'castellano') =>
  (await getCes(curso, lang)).body.find((c: any) => c.subject === 'Música' && c.ce_num === 1);

const crearCePdc = () => CE.create({
  tipoNivel: 'DIVERSIFICACION_CURRICULAR', area: 'Ámbito Científico y Tecnológico', subject: 'Matemàtiques', ce_id: 'CE.1',
  description_es: 'CE PDC es', description_ca: 'CE PDC ca',
  criterios_es: [
    { criterio_id: '3º ESO - 1.1', description: 'Criterio 3 es' }, { criterio_id: '3º ESO - 1.2', description: 'Criterio 3b es' },
    { criterio_id: '4º ESO - 1.1', description: 'Criterio 4 es' }
  ],
  criterios_ca: [
    { criterio_id: '3º ESO - 1.1', description: 'Criteri 3 ca' }, { criterio_id: '3º ESO - 1.2', description: 'Criteri 3b ca' },
    { criterio_id: '4º ESO - 1.1', description: 'Criteri 4 ca' }
  ]
});

describe('Criterios de la ESO ordinaria en la API', () => {
  beforeEach(async () => await ingestEsoUp());

  it('devuelve los criterios del curso con su numeración oficial', async () => {
    const ce = await musicaCe();
    expect(ce.criteriosDetalle.length).toBeGreaterThan(0);
    expect(ce.criteriosDetalle[0]).toMatchObject({ id: expect.stringMatching(/^1\.\d+$/), text: expect.any(String) });
  });

  it('mantiene los mismos ids y el mismo orden en castellano y catalán para todas las materias y cursos', async () => {
    for (const curso of ['1º', '2º', '3º', '4º']) {
      const es = (await getCes(curso, 'castellano')).body;
      const ca = (await getCes(curso, 'catalan')).body;
      expect(ca.map((c: any) => c.value ? c.ce_num : 0)).toEqual(es.map((c: any) => c.ce_num));
      es.forEach((ce: any, i: number) => {
        expect(ca[i].criteriosDetalle.map((c: any) => c.id)).toEqual(ce.criteriosDetalle.map((c: any) => c.id));
        expect(ce.criteriosDetalle.every((c: any) => c.text.trim() && c.id)).toBe(true);
        expect(ca[i].criteriosDetalle.every((c: any) => c.text.trim())).toBe(true);
      });
    }
  });
});

describe('Criterios del PDC en la API', () => {
  it('devuelve solo los criterios del curso pedido', async () => {
    await crearCePdc();
    const tres = (await getCes('3º', 'castellano', 'DIVERSIFICACION_CURRICULAR')).body[0];
    expect(tres.criteriosDetalle).toEqual([{ id: '1.1', text: 'Criterio 3 es' }, { id: '1.2', text: 'Criterio 3b es' }]);
    const cuatro = (await getCes('4º', 'catalan', 'DIVERSIFICACION_CURRICULAR')).body[0];
    expect(cuatro.criteriosDetalle).toEqual([{ id: '1.1', text: 'Criteri 4 ca' }]);
  });
});

describe('Normalización de criterios heredados', () => {
  it('reconoce los formatos de identificador del PDC y los textos sueltos', () => {
    const doc = {
      criterios_es: [
        { criterio_id: '1.2 (4º ESO)', description: 'a' }, { criterio_id: 'CA 2.1', description: 'b' },
        { criterio_id: '', description: 'c' }, 'd', { desc: 'e' }
      ]
    };
    expect(criteriosDeCe(doc, '4º', 'es').map(c => c.id)).toEqual(['1.2', '2.1', '3', '4', '5']);
    expect(criteriosDeCe(doc, '3º', 'es').map(c => c.id)).toEqual(['2.1', '3', '4', '5']);
    expect(criteriosDeCe({ criterios: ['x'] }, '3º', 'ca')).toEqual([{ id: '1', text: 'x' }]);
    expect(criteriosDeCe({}, '3º', 'es')).toEqual([]);
  });

  it('criteriosParaPrompt filtra por ids o devuelve todos', () => {
    const list = [{ id: '1.1', text: 'a' }, { id: '1.2', text: 'b' }];
    expect(criteriosParaPrompt(list, ['1.2'])).toEqual([list[1]]);
    expect(criteriosParaPrompt(list)).toEqual(list);
  });

  it('parseSeleccion acepta listas válidas, deduplica ids y rechaza el resto', () => {
    expect(parseSeleccion(undefined)).toEqual([]);
    expect(parseSeleccion([{ ce: 'a', ids: ['1.1', '1.1'] }])).toEqual([{ ce: 'a', ids: ['1.1'] }]);
    expect(() => parseSeleccion('x')).toThrow();
    expect(() => parseSeleccion([{ ce: 1, ids: [] }])).toThrow();
    expect(() => parseSeleccion([{ ce: 'a', ids: [1] }])).toThrow();
  });

  it('validarSeleccion rechaza CE no seleccionadas, vacías o con criterios inexistentes', () => {
    const doc = { tipoNivel: 'DIVERSIFICACION_CURRICULAR', description_es: 'CE', criterios_es: ['x'] };
    expect(validarSeleccion([{ ce: 'CE', ids: ['1'] }], ['CE'], [doc], 'DIVERSIFICACION_CURRICULAR', '3º').get('CE')).toEqual(['1']);
    expect(() => validarSeleccion([{ ce: 'CE', ids: ['1'] }], [], [doc], 'DIVERSIFICACION_CURRICULAR', '3º')).toThrow(/no está/);
    expect(() => validarSeleccion([{ ce: 'CE', ids: [] }], ['CE'], [doc], 'DIVERSIFICACION_CURRICULAR', '3º')).toThrow(/al menos/);
    expect(() => validarSeleccion([{ ce: 'CE', ids: ['9.9'] }], ['CE'], [doc], 'DIVERSIFICACION_CURRICULAR', '3º')).toThrow(/9\.9/);
  });
});

describe('Generación a partir de los criterios seleccionados', () => {
  beforeEach(async () => await ingestEsoUp());

  it('lista en el prompt solo los criterios elegidos y exige cubrirlos todos', async () => {
    const ce = await musicaCe();
    const [primero, ...resto] = ce.criteriosDetalle;
    expect(resto.length).toBeGreaterThan(0);
    const res = await generate({ selectedRas: [ce.value], courseLevel: '1º', criteriosSeleccionados: [{ ce: ce.value, ids: [primero.id] }] });
    expect(res.status).toBe(202);
    const { aiPrompt, criteriosSeleccionados } = res.body.project;
    expect(aiPrompt).toContain('CRITERIOS DE EVALUACIÓN SELECCIONADOS DE 1º');
    expect(aiPrompt).toContain(`${primero.id}: ${primero.text}`);
    resto.forEach((c: any) => expect(aiPrompt).not.toContain(`${c.id}: ${c.text}`));
    expect(aiPrompt).toContain('TODOS deben quedar cubiertos');
    expect(criteriosSeleccionados).toEqual([{ ce: ce.value, ids: [primero.id] }]);
  });

  it('usa todos los criterios del curso cuando no hay selección', async () => {
    const ce = await musicaCe();
    const res = await generate({ selectedRas: [ce.value], courseLevel: '1º' });
    expect(res.status).toBe(202);
    expect(res.body.project.aiPrompt).toContain('CRITERIOS DE EVALUACIÓN OFICIALES DE 1º');
    expect(res.body.project.aiPrompt).not.toContain('SELECCIONADOS POR EL DOCENTE');
    ce.criteriosDetalle.forEach((c: any) => expect(res.body.project.aiPrompt).toContain(`${c.id}: ${c.text}`));
  });

  it('aplica la selección en el PDC con los criterios del curso', async () => {
    await crearCePdc();
    const res = await generate({
      tipoNivel: 'DIVERSIFICACION_CURRICULAR', courseLevel: '3º', selectedRas: ['CE PDC es'],
      criteriosSeleccionados: [{ ce: 'CE PDC es', ids: ['1.2'] }]
    });
    expect(res.status).toBe(202);
    expect(res.body.project.aiPrompt).toContain('CRITERIOS DE EVALUACIÓN SELECCIONADOS:\n    1.2: Criterio 3b es');
    expect(res.body.project.aiPrompt).not.toContain('Criterio 3 es');
    expect(res.body.project.aiPrompt).not.toContain('Criterio 4 es');
  });

  it('conserva los criterios en el reintento (el prompt guardado no cambia)', async () => {
    const ce = await musicaCe();
    const id = ce.criteriosDetalle[0].id;
    const res = await generate({ selectedRas: [ce.value], courseLevel: '1º', criteriosSeleccionados: [{ ce: ce.value, ids: [id] }] });
    const guardado: any = await Project.findById(res.body.project._id).lean();
    expect(guardado.aiPrompt).toContain('SELECCIONADOS');
    expect(guardado.criteriosSeleccionados[0].ids).toEqual([id]);
  });

  it('rechaza con 400 un criterio inexistente, una CE sin criterios y una CE no seleccionada', async () => {
    const ce = await musicaCe();
    const base = { selectedRas: [ce.value], courseLevel: '1º' };
    const inexistente = await generate({ ...base, criteriosSeleccionados: [{ ce: ce.value, ids: ['99.9'] }] });
    expect(inexistente.status).toBe(400);
    expect(inexistente.body.error).toContain('99.9');
    expect((await generate({ ...base, criteriosSeleccionados: [{ ce: ce.value, ids: [] }] })).status).toBe(400);
    expect((await generate({ ...base, criteriosSeleccionados: [{ ce: 'otra', ids: ['1.1'] }] })).status).toBe(400);
    expect((await generate({ ...base, criteriosSeleccionados: 'mal' })).status).toBe(400);
    expect(await Project.countDocuments()).toBe(0);
  });

  it('rechaza un criterio que no pertenece al curso', async () => {
    const ce = (await getCes('2º')).body[0];
    const ids = new Set(ce.criteriosDetalle.map((c: any) => c.id));
    const ajeno = ['9.9', '8.8'].find(id => !ids.has(id))!;
    const res = await generate({ selectedRas: [ce.value], courseLevel: '2º', criteriosSeleccionados: [{ ce: ce.value, ids: [ajeno] }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain(ajeno);
  });
});

describe('Datos del PDC en el fichero de origen', () => {
  it('tiene los mismos identificadores de criterio en castellano y catalán', () => {
    const file = path.resolve(__dirname, '../../ces_eso_bilingual.json');
    const ces = JSON.parse(fs.readFileSync(file, 'utf-8'));
    for (const ce of ces) {
      expect(ce.criterios_ca.map((c: any) => c.criterio_id)).toEqual(ce.criterios_es.map((c: any) => c.criterio_id));
      for (const curso of ['3º', '4º']) {
        const es = criteriosDeCe(ce, curso, 'es');
        expect(es.length, `${ce.subject} ${ce.ce_id} ${curso}`).toBeGreaterThan(0);
        expect(criteriosDeCe(ce, curso, 'ca').map(c => c.id)).toEqual(es.map(c => c.id));
        expect(new Set(es.map(c => c.id)).size).toBe(es.length);
      }
    }
  });
});

import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { createTestUser } from './testUtils';
import { RA } from '../models/RA';
import { CE } from '../models/CE';
import { Project } from '../models/Project';
import { connectDB, closeDB, clearDB } from './testSetup';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

const get = (token: string) =>
  request(app).get('/api/curriculum/filter-index').set('Authorization', `Bearer ${token}`);

describe('GET /api/curriculum/filter-index', () => {
  let token: string;

  beforeEach(async () => {
    await clearDB();
    token = (await createTestUser('teacher', 'filterindex@example.com')).token;
  });

  it('agrupa el mismo módulo y RA guardados en castellano y en catalán', async () => {
    await RA.create([
      { id: 'RA2', module: 'Context', module_es: 'Contexto', module_ca: 'Context', moduleCode: '0337',
        tipoNivel: 'CFGS_INTEGRACION_SOCIAL', description: 'Descr ca', description_es: 'Descr es', description_ca: 'Descr ca' },
      { id: 'RA1', module: 'Altre', module_es: 'Otro', module_ca: 'Altre', moduleCode: '0338',
        tipoNivel: 'CFGS_INTEGRACION_SOCIAL', description_es: 'Sin usar', description_ca: 'Sense ús' },
    ]);
    await Project.create([
      { title: 'A', modules: ['Contexto'], ras: ['Descr es'], tipoNivel: 'CFGS_INTEGRACION_SOCIAL' },
      { title: 'B', modules: ['Context'], ras: ['Descr ca'], tipoNivel: 'CFGS_INTEGRACION_SOCIAL' },
    ]);

    const res = await get(token);

    expect(res.status).toBe(200);
    expect(res.body.modules).toEqual([
      { key: 'CFGS_INTEGRACION_SOCIAL|0337', tipoNivel: 'CFGS_INTEGRACION_SOCIAL', es: 'Contexto', ca: 'Context', aliases: ['Contexto', 'Context'] },
    ]);
    expect(res.body.items).toEqual([
      { key: 'CFGS_INTEGRACION_SOCIAL|0337|RA2', tipoNivel: 'CFGS_INTEGRACION_SOCIAL', moduleKey: 'CFGS_INTEGRACION_SOCIAL|0337',
        order: 2, es: 'RA2. Descr es', ca: 'RA2. Descr ca', aliases: ['Descr es', 'Descr ca'] },
    ]);
  });

  it('incluye las CE de la ESO ordinaria y del PDC que usan los proyectos', async () => {
    await CE.create([
      { tipoNivel: 'ESO_ORDINARIA', subjectCode: 'MAT', subject_es: 'Matemáticas', subject_ca: 'Matemàtiques',
        ce_num: 3, description_es: 'Resolver', description_ca: 'Resoldre' },
      { subject: 'Matemàtiques', area: 'Àmbit Científic i Tecnològic', ce_id: 'CE1',
        description_es: 'Pdc es', description_ca: 'Pdc ca' },
    ]);
    await Project.create([
      { title: 'E', modules: ['Matemàtiques'], ras: ['Matemàtiques · CE3. Resoldre'], tipoNivel: 'ESO_ORDINARIA' },
      { title: 'P', modules: ['Matemáticas'], ras: ['Pdc es'], tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);

    const res = await get(token);

    expect(res.body.items.map((i: any) => [i.key, i.es, i.ca, i.order])).toEqual([
      ['ESO_ORDINARIA|MAT|CE3', 'CE3. Resolver', 'CE3. Resoldre', 3],
      ['DIVERSIFICACION_CURRICULAR|Matemáticas|CE1', 'CE1. Pdc es', 'CE1. Pdc ca', 1],
    ]);
    expect(res.body.modules.map((m: any) => [m.key, m.es, m.ca])).toEqual([
      ['ESO_ORDINARIA|MAT', 'Matemáticas', 'Matemàtiques'],
      ['DIVERSIFICACION_CURRICULAR|Matemáticas', 'Matemáticas', 'Matemàtiques'],
    ]);
  });

  it('usa el nivel por defecto y la descripción de los RA antiguos sin código', async () => {
    await RA.create({ id: 'RA4', module: 'Maquillatge', description: 'Antic' });
    await Project.create({ title: 'F', modules: ['Maquillaje'], ras: ['Antic'] });

    const res = await get(token);

    expect(res.body.modules[0]).toMatchObject({ key: 'FP_BASICA|Maquillaje', es: 'Maquillaje', ca: 'Maquillatge' });
    expect(res.body.items[0]).toMatchObject({ es: 'RA4. Antic', ca: 'RA4. Antic', order: 4 });
  });

  it('devuelve 500 si falla la consulta', async () => {
    const original = RA.find;
    RA.find = (() => { throw new Error('boom'); }) as any;
    const res = await get(token);
    RA.find = original;
    expect(res.status).toBe(500);
  });
});

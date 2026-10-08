import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { AfinidadEso } from '../models/AfinidadEso';
import { CE } from '../models/CE';
import { up as ingestEsoUp } from '../migrations/23_ingest_ces_eso_ordinaria';
import { up as ingestAfinidadesUp, loadAfinidades, afinidadDocs } from '../migrations/25_ingest_afinidades_eso';

const CURRICULO_DIR = path.resolve(__dirname, '../data/curriculo-eso');
const materiasJson = fs.readdirSync(CURRICULO_DIR).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CURRICULO_DIR, f), 'utf-8')));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());
afterEach(() => vi.restoreAllMocks());

const cargar = async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  await ingestEsoUp();
  await ingestAfinidadesUp();
};

/** Texto oficial de un criterio en un curso según el JSON del currículo. */
const textoOficial = (materia: string, id: string, curso: string) => {
  const m = materiasJson.find(x => x.code === materia);
  const crit = m.competencias.flatMap((c: any) => c.criterios).find((c: any) => c.id === id && c.cursos.includes(curso));
  return { es: crit.text_es, ca: crit.text_ca };
};

describe('GET /api/afinidades-eso', () => {
  it('devuelve 400 sin tab, con tab desconocido o con una pestaña de módulos', async () => {
    for (const url of ['/api/afinidades-eso', '/api/afinidades-eso?tab=NOPE', '/api/afinidades-eso?tab=FPB']) {
      const res = await request(app).get(url);
      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Parámetro 'tab' inválido o ausente");
      expect(res.body.error).toContain('ESO_1');
    }
  });

  it('devuelve 500 si falla la consulta', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(AfinidadEso, 'find').mockImplementation(() => { throw new Error('boom'); });
    const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('afinidades');
  });

  it('sin datos devuelve listas vacías de fichas y materias', async () => {
    const res = await request(app).get('/api/afinidades-eso?tab=ESO_2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ curso: '2º', materias: [], afinidades: [] });
  });

  describe('con las migraciones 23 y 25', () => {
    beforeEach(async () => await cargar());

    it('devuelve las fichas del curso en orden, con id y sin campos internos', async () => {
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      expect(res.status).toBe(200);
      expect(res.body.curso).toBe('1º');
      const esperadas = loadAfinidades().filter(f => f.curso === '1º');
      expect(res.body.afinidades.map((a: any) => a.id)).toEqual(esperadas.map(f => f.id));
      for (const a of res.body.afinidades) {
        expect(a.code).toBeUndefined();
        for (const k of ['_id', 'tab', 'order', '__v', 'createdAt']) expect(a[k]).toBeUndefined();
        expect(a.curso).toBe('1º');
      }
    });

    it('resuelve criteriosTexto en ES y CA con el texto del curso', async () => {
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      for (const a of res.body.afinidades) {
        for (const v of a.vinculos) {
          for (const [materia, ids] of Object.entries<string[]>(v.criterios)) {
            expect(v.criteriosTexto[materia].map((c: any) => c.id)).toEqual(ids);
            for (const c of v.criteriosTexto[materia]) {
              expect(c.text_es.length).toBeGreaterThan(0);
              expect(c.text_ca.length).toBeGreaterThan(0);
            }
          }
        }
      }
      const v = res.body.afinidades[0].vinculos[0];
      const [materia, [id]] = Object.entries<string[]>(v.criterios)[0] as [string, string[]];
      const oficial = textoOficial(materia, id, '1º');
      expect(v.criteriosTexto[materia][0]).toEqual({ id, text_es: oficial.es, text_ca: oficial.ca });
    });

    it('distingue el texto de un mismo id entre el bloque 1.º-3.º y 4.º', async () => {
      const dup = materiasJson.flatMap(m => m.competencias.flatMap((c: any) => c.criterios
        .filter((k: any) => !k.cursos.includes('1º') && k.cursos.includes('4º'))
        .map((k: any) => ({ m, k, c }))))
        .find(({ m, k, c }: any) => c.criterios.some((o: any) => o.id === k.id && o !== k && o.cursos.includes('1º')));
      expect(dup).toBeDefined();
      const { m, k } = dup;
      await AfinidadEso.create({
        tab: 'ESO_1', order: 99, code: 'ESO1-TEST', curso: '1º', materias: [m.code, 'x'],
        ambito_es: 'a', ambito_ca: 'a', origen: 'ampliacion',
        vinculos: [{ criterios: { [m.code]: [k.id] }, resumen_es: {}, resumen_ca: {}, relacion_es: '', relacion_ca: '' }]
      });
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      const ficha = res.body.afinidades.find((a: any) => a.id === 'ESO1-TEST');
      const texto = ficha.vinculos[0].criteriosTexto[m.code][0];
      expect(texto.text_es).toBe(textoOficial(m.code, k.id, '1º').es);
      expect(texto.text_es).not.toBe(k.text_es);
    });

    it('un criterio inexistente devuelve textos vacíos', async () => {
      await AfinidadEso.create({
        tab: 'ESO_1', order: 99, code: 'ESO1-TEST', curso: '1º', materias: ['biologia_geologia', 'nada'],
        ambito_es: 'a', ambito_ca: 'a', origen: 'ampliacion',
        vinculos: [{ criterios: { biologia_geologia: ['99.9'], nada: ['1.1'] }, resumen_es: {}, resumen_ca: {}, relacion_es: '', relacion_ca: '' }]
      });
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      const t = res.body.afinidades.find((a: any) => a.id === 'ESO1-TEST').vinculos[0].criteriosTexto;
      expect(t.biologia_geologia).toEqual([{ id: '99.9', text_es: '', text_ca: '' }]);
      expect(t.nada).toEqual([{ id: '1.1', text_es: '', text_ca: '' }]);
    });

    it('lista las materias del curso ordenadas por name_ca con su total', async () => {
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      const esperadas = materiasJson.filter(m => m.cursos['1º']);
      const { materias, afinidades } = res.body;
      expect(materias.map((m: any) => m.code).sort()).toEqual(esperadas.map(m => m.code).sort());
      const nombres = materias.map((m: any) => m.name_ca);
      expect(nombres).toEqual([...nombres].sort((a, b) => a.localeCompare(b, 'ca')));
      for (const m of materias) {
        const json = esperadas.find(e => e.code === m.code);
        expect(m).toEqual({
          code: m.code, name_es: json.name_es, name_ca: json.name_ca, tipo: json.cursos['1º'],
          total: afinidades.filter((a: any) => a.materias.includes(m.code)).length
        });
      }
      const usadas = new Set(afinidades.flatMap((a: any) => a.materias));
      const sinFichas = materias.filter((m: any) => !usadas.has(m.code));
      for (const m of sinFichas) expect(m.total).toBe(0);
    });

    it('incluye materias sin fichas con total 0', async () => {
      await AfinidadEso.deleteMany({});
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_1');
      expect(res.body.materias.length).toBeGreaterThan(0);
      expect(res.body.materias.every((m: any) => m.total === 0)).toBe(true);
    });

    it('no mezcla materias ni fichas de otros cursos', async () => {
      const res = await request(app).get('/api/afinidades-eso?tab=ESO_3');
      expect(res.body.curso).toBe('3º');
      expect(res.body.afinidades.every((a: any) => a.curso === '3º')).toBe(true);
      const ces = await CE.distinct('subjectCode', { tipoNivel: 'ESO_ORDINARIA', [`subjectTipos.3º`]: { $exists: true } });
      expect(res.body.materias).toHaveLength(ces.length);
    });
  });
});

describe('Migración 25: afinidades de la ESO', () => {
  beforeEach(() => { vi.spyOn(console, 'log').mockImplementation(() => {}); });

  it('es idempotente', async () => {
    await ingestAfinidadesUp();
    const primera = await AfinidadEso.countDocuments();
    expect(primera).toBe(loadAfinidades().length);
    await ingestAfinidadesUp();
    expect(await AfinidadEso.countDocuments()).toBe(primera);
  });

  it('asigna la pestaña por curso y el orden dentro del conjunto', async () => {
    await ingestAfinidadesUp();
    const tabs: Record<string, string> = { '1º': 'ESO_1', '2º': 'ESO_2', '3º': 'ESO_3', '4º': 'ESO_4' };
    const docs = await AfinidadEso.find().lean();
    expect(docs.length).toBeGreaterThan(0);
    for (const d of docs) expect(d.tab).toBe(tabs[d.curso]);
  });

  it('afinidadDocs convierte id en code y falla con un curso sin pestaña', () => {
    const [ficha] = loadAfinidades();
    const [doc] = afinidadDocs([ficha!]);
    expect(doc).toMatchObject({ code: ficha!.id, order: 0 });
    expect((doc as any).id).toBeUndefined();
    expect(() => afinidadDocs([{ ...ficha!, curso: '9º' }])).toThrow(/No hay pestaña/);
  });

  it('el modelo rechaza una pestaña que no es de afinidades', async () => {
    const [ficha] = afinidadDocs([loadAfinidades()[0]!]);
    await expect(new AfinidadEso({ ...ficha, tab: 'FPB' }).validate()).rejects.toThrow(/tab/);
  });
});

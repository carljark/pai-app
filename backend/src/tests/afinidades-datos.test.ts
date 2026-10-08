import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { loadAfinidades } from '../migrations/25_ingest_afinidades_eso';

const CURRICULO_DIR = path.resolve(__dirname, '../data/curriculo-eso');
const materiasJson: any[] = fs.readdirSync(CURRICULO_DIR).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CURRICULO_DIR, f), 'utf-8')));
const materia = (code: string) => materiasJson.find(m => m.code === code);
const fichas = loadAfinidades();

const CATALAN = /(?<![\p{L}])(els|amb|dels|perquè|aquesta?|també)(?![\p{L}])|l’|d’|·l/iu;
// «del» es válido en catalán; «-los» es un clítico catalán y \b de JS no entiende acentos: se usan lookarounds Unicode.
const CASTELLANO = /(?<![-\p{L}])(los|las|con|y|para|también)(?![\p{L}])|ñ/iu;

/** Todos los pares [ficha, vínculo] con una etiqueta legible. */
const vinculos = fichas.flatMap(f => f.vinculos.map((v, i) => ({ f, v, etiqueta: `${f.id}#${i}` })));

describe('Datos de afinidades de la ESO: estructura', () => {
  it('hay fichas', () => expect(fichas.length).toBeGreaterThan(0));

  it('ids únicos con formato ESO<n>-NN coherente con el curso', () => {
    expect(new Set(fichas.map(f => f.id)).size).toBe(fichas.length);
    for (const f of fichas) {
      expect(f.id).toMatch(/^ESO[1-4]-\d{2}$/);
      expect(f.id.charAt(3)).toBe(f.curso.charAt(0));
    }
  });

  it('origen válido y 2-3 materias distintas', () => {
    for (const f of fichas) {
      expect(['documento', 'ampliacion']).toContain(f.origen);
      expect(f.materias.length).toBeGreaterThanOrEqual(2);
      expect(f.materias.length).toBeLessThanOrEqual(3);
      expect(new Set(f.materias).size).toBe(f.materias.length);
    }
  });

  it('cada materia existe en el currículo y se imparte en el curso de la ficha', () => {
    for (const f of fichas) {
      for (const m of f.materias) {
        expect(materia(m), `${f.id}: materia ${m}`).toBeDefined();
        expect(Object.keys(materia(m).cursos), `${f.id}: ${m} en ${f.curso}`).toContain(f.curso);
      }
    }
  });

  it('cada criterio citado existe en su materia y curso, y cada vínculo cita todas las materias', () => {
    for (const { f, v, etiqueta } of vinculos) {
      expect(Object.keys(v.criterios).sort(), etiqueta).toEqual([...f.materias].sort());
      for (const [m, ids] of Object.entries(v.criterios)) {
        expect(ids.length, `${etiqueta} ${m}`).toBeGreaterThan(0);
        const criterios = materia(m).competencias.flatMap((c: any) => c.criterios);
        for (const id of ids) {
          const existe = criterios.some((c: any) => c.id === id && c.cursos.includes(f.curso));
          expect(existe, `${etiqueta}: ${m} ${id} en ${f.curso}`).toBe(true);
        }
      }
    }
  });
});

describe('Datos de afinidades de la ESO: paridad ES/CA', () => {
  const textos = (valor: unknown, ruta: string, salida: [string, string][] = []): [string, string][] => {
    if (typeof valor === 'string') salida.push([ruta, valor]);
    else if (Array.isArray(valor)) valor.forEach((x, i) => textos(x, `${ruta}[${i}]`, salida));
    else if (valor && typeof valor === 'object') {
      for (const [k, x] of Object.entries(valor)) textos(x, `${ruta}.${k}`, salida);
    }
    return salida;
  };
  const todos = fichas.flatMap(f => textos(f, f.id));

  it('ningún texto está vacío', () => {
    for (const [ruta, t] of todos.filter(([r]) => /_(es|ca)\b|\.(es|ca)\[/.test(r))) {
      expect(t.trim().length, ruta).toBeGreaterThan(0);
    }
  });

  it('resumen_es y resumen_ca tienen como claves las materias del vínculo', () => {
    for (const { v, etiqueta } of vinculos) {
      const materias = Object.keys(v.criterios).sort();
      expect(Object.keys(v.resumen_es).sort(), etiqueta).toEqual(materias);
      expect(Object.keys(v.resumen_ca).sort(), etiqueta).toEqual(materias);
      expect(v.relacion_es.trim().length).toBeGreaterThan(0);
      expect(v.relacion_ca.trim().length).toBeGreaterThan(0);
    }
  });

  it('saberes: una entrada por materia con listas ES/CA de igual longitud', () => {
    for (const f of fichas) {
      expect(Object.keys(f.saberes).sort(), f.id).toEqual([...f.materias].sort());
      for (const [m, s] of Object.entries(f.saberes)) {
        expect(s.es.length, `${f.id} ${m}`).toBeGreaterThan(0);
        expect(s.ca.length, `${f.id} ${m}`).toBe(s.es.length);
      }
    }
  });

  it('conceptos ES/CA de igual longitud', () => {
    for (const f of fichas) expect(f.conceptos_ca.length, f.id).toBe(f.conceptos_es.length);
  });

  it('fuentes no vacías y la primera con el mismo ámbito que la ficha', () => {
    for (const f of fichas) {
      expect(f.fuentes.length, f.id).toBeGreaterThan(0);
      for (const s of f.fuentes) {
        expect(s.ambito_es.trim()).not.toBe('');
        expect(s.ambito_ca.trim()).not.toBe('');
      }
      expect(f.fuentes[0]!.ambito_es).toBe(f.ambito_es);
      expect(f.fuentes[0]!.ambito_ca).toBe(f.ambito_ca);
    }
  });

  it('los textos _es no contienen catalán y los _ca no contienen castellano', () => {
    const es = todos.filter(([r]) => /_es\b|\.es\[/.test(r));
    const ca = todos.filter(([r]) => /_ca\b|\.ca\[/.test(r));
    expect(es.length).toBeGreaterThan(0);
    expect(ca.length).toBeGreaterThan(0);
    expect(es.filter(([, t]) => CATALAN.test(t)).map(([r, t]) => `${r}: ${t}`)).toEqual([]);
    expect(ca.filter(([, t]) => CASTELLANO.test(t)).map(([r, t]) => `${r}: ${t}`)).toEqual([]);
  });
});

describe('Datos de afinidades de la ESO: cobertura mínima', () => {
  for (const curso of ['1º', '2º', '3º', '4º']) {
    it(`cada materia de ${curso} aparece en al menos 3 fichas del curso`, () => {
      const delCurso = fichas.filter(f => f.curso === curso);
      const insuficientes = materiasJson
        .filter(m => Object.keys(m.cursos).includes(curso))
        .map(m => ({ code: m.code, fichas: delCurso.filter(f => f.materias.includes(m.code)).length }))
        .filter(x => x.fichas < 3);
      expect(insuficientes).toEqual([]);
    });
  }
});

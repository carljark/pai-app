import { describe, it, expect } from 'vitest';
import { CFGM_CUIDADOS_AUXILIARES_ENFERMERIA_RAS_DATA as DATA } from '../data/ras_cfgm_cuidados_auxiliares_enfermeria.data';
import { findNivel } from '../data/niveles';
import { describeTargetCourse } from '../controllers/project.controller';

const LETRAS = 'abcdefghijklmnopqrstuvwxyz';
const sinLetra = (c: string) => c.replace(/^[a-z]\) /, '');
// Palabras que delatan el otro idioma (sin la letra inicial del criterio). Los límites excluyen
// letras, guiones y apóstrofos para no confundir pronombres enclíticos («adaptant-los»).
const palabras = (lista: string) => new RegExp(`(?<![\\p{L}'-])(${lista})(?![\\p{L}'-])`, 'u');
const CASTELLANO = palabras('y|los|las|con|para|mediante|según');
const CATALAN = palabras('i|amb|dels|els|mitjançant|segons');

const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);

describe('Datos del CFGM Cuidados Auxiliares de Enfermería', () => {
  it('carga los 7 módulos del RD 546/1995 con 30 capacidades terminales y 173 criterios', () => {
    expect(modulos).toEqual(['CAE1', 'CAE2', 'CAE3', 'CAE4', 'CAE5', 'CAE6', 'CAE7']);
    expect(DATA).toHaveLength(30);
    expect(DATA.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(173);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGM_CUIDADOS_AUXILIARES_ENFERMERIA');
  });

  it('numera las capacidades de cada módulo de forma consecutiva', () => {
    for (const code of modulos) {
      const ids = DATA.filter((ra) => ra.moduleCode === code).map((ra) => ra.id);
      expect(ids).toEqual(ids.map((_, i) => `RA${i + 1}`));
    }
  });

  it('tiene los mismos criterios en castellano y en catalán, con letras consecutivas', () => {
    for (const ra of DATA) {
      expect(ra.criterios_ca).toHaveLength(ra.criterios_es.length);
      ra.criterios_es.forEach((c, i) => {
        expect(c).toMatch(new RegExp(`^${LETRAS[i]}\\) \\S`));
        expect(ra.criterios_ca[i]).toMatch(new RegExp(`^${LETRAS[i]}\\) \\S`));
      });
    }
  });

  it('no repite el castellano en los campos catalanes', () => {
    for (const ra of DATA) {
      expect(ra.module_ca).not.toBe(ra.module_es);
      expect(ra.module).toBe(ra.module_ca);
      expect(ra.description).toBe(ra.description_ca);
      expect(ra.description_ca).not.toBe(ra.description_es);
      ra.criterios_es.forEach((c, i) => expect(ra.criterios_ca[i]).not.toBe(c));
    }
  });

  it('no mezcla los idiomas', () => {
    expect(textosCa.filter((t) => CASTELLANO.test(t))).toEqual([]);
    expect(textosEs.filter((t) => CATALAN.test(t))).toEqual([]);
  });

  it('tiene un único curso con todos los módulos y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGM_CUIDADOS_AUXILIARES_ENFERMERIA');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.curso)).toEqual(['1º']);
    expect(describeTargetCourse('CFGM_CUIDADOS_AUXILIARES_ENFERMERIA', '1º')).toBe(
      '1º de CFGM Cuidados Auxiliares de Enfermería'
    );
    expect(describeTargetCourse('CFGM_CUIDADOS_AUXILIARES_ENFERMERIA', '1º', 'catalan')).toBe(
      "1º de CFGM Cures auxiliars d'infermeria"
    );
  });
});

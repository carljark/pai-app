import { describe, it, expect } from 'vitest';
import { CFGM_GUIA_MEDIO_NATURAL_RAS_DATA as DATA } from '../data/ras_cfgm_guia_medio_natural.data';
import { CFGM_ATENCION_DEPENDENCIA_RAS_DATA } from '../data/ras_cfgm_atencion_dependencia.data';
import type { CfgmRaData } from '../data/ras_cfgm_peluqueria.data';
import { findNivel } from '../data/niveles';
import { describeTargetCourse } from '../controllers/project.controller';

const LETRAS = 'abcdefghijklmnopqrstuvwxyz';
const sinLetra = (c: string) => c.replace(/^[a-z]\) /, '');
// Palabras que delatan el otro idioma (sin la letra inicial del criterio). Los límites excluyen
// letras, guiones y apóstrofos para no confundir pronombres enclíticos («adaptant-los»).
const palabras = (lista: string) => new RegExp(`(?<![\\p{L}'-])(${lista})(?![\\p{L}'-])`, 'u');
const CASTELLANO = palabras('y|los|las|con|para|mediante|según|persona usuaria');
const CATALAN = palabras('i|amb|dels|els|mitjançant|segons|persona usuària');

const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);

describe('Datos del CFGM Guía en el Medio Natural y de Tiempo Libre', () => {
  it('carga los 17 módulos del ciclo con 97 RA y 651 criterios', () => {
    expect(modulos).toHaveLength(17);
    expect(DATA).toHaveLength(97);
    expect(DATA.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(651);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGM_GUIA_MEDIO_NATURAL');
  });

  it('numera los RA de cada módulo de forma consecutiva', () => {
    for (const code of modulos) {
      const ids = DATA.filter((ra) => ra.moduleCode === code).map((ra) => ra.id);
      expect(ids).toEqual(ids.map((_, i) => `RA${i + 1}`));
    }
  });

  it('tiene los mismos criterios en castellano y en catalán, con letras consecutivas', () => {
    for (const ra of DATA) {
      expect(ra.criterios_ca).toHaveLength(ra.criterios_es.length);
      ra.criterios_es.forEach((c, i) => {
        // Técnicas de natación (1336) RA5 d) es el único criterio que no empieza por «Se ha».
        expect(c).toMatch(new RegExp(`^${LETRAS[i]}\\) Se (ha|ejecutan)`));
        expect(ra.criterios_ca[i]).toMatch(new RegExp(`^${LETRAS[i]}\\) S'(ha|executen)`));
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

  it('comparte con los demás ciclos el texto de los módulos transversales (tarea 210)', () => {
    const textos = (ras: CfgmRaData[], codes: string[]) => ras
      .filter((ra) => codes.includes(ra.moduleCode))
      .map(({ moduleCode, id, description_es, description_ca, criterios_es, criterios_ca }) =>
        ({ moduleCode, id, description_es, description_ca, criterios_es, criterios_ca }));
    const sorted = (ras: CfgmRaData[]) => [...ras].sort((a, b) => a.moduleCode.localeCompare(b.moduleCode));
    const transversales = ['1664', '1709', '0156', '1708', '1710', '1713'];
    expect(textos(sorted(DATA), transversales))
      .toEqual(textos(sorted(CFGM_ATENCION_DEPENDENCIA_RAS_DATA), transversales));
  });

  it('separa por curso los módulos de FP Illes Balears y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGM_GUIA_MEDIO_NATURAL');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.modulos?.length)).toEqual([9, 8]);
    expect(describeTargetCourse('CFGM_GUIA_MEDIO_NATURAL', '2º')).toBe(
      '2º de CFGM Guía en el Medio Natural y de Tiempo Libre'
    );
    expect(describeTargetCourse('CFGM_GUIA_MEDIO_NATURAL', '1º', 'catalan')).toBe(
      '1º de CFGM Guia en el medi natural i de temps lliure'
    );
  });
});

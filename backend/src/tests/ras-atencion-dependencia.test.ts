import { describe, it, expect } from 'vitest';
import { CFGM_ATENCION_DEPENDENCIA_RAS_DATA as DATA } from '../data/ras_cfgm_atencion_dependencia.data';
import { CFGM_PELUQUERIA_RAS_DATA, type CfgmRaData } from '../data/ras_cfgm_peluqueria.data';
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

describe('Datos del CFGM Atención a Personas en Situación de Dependencia', () => {
  it('carga los 16 módulos del ciclo con 78 RA y 590 criterios', () => {
    expect(modulos).toHaveLength(16);
    expect(DATA).toHaveLength(78);
    expect(DATA.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(590);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGM_ATENCION_DEPENDENCIA');
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
        expect(c).toMatch(new RegExp(`^${LETRAS[i]}\\) Se ha`));
        expect(ra.criterios_ca[i]).toMatch(new RegExp(`^${LETRAS[i]}\\) S'ha`));
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

  it('comparte con Peluquería el texto de los módulos transversales (tarea 209)', () => {
    const textos = (ras: CfgmRaData[]) => ras
      .filter((ra) => ['1664', '1709', '0156', '1708', '1710', '1713'].includes(ra.moduleCode))
      .map(({ moduleCode, id, description_es, description_ca, criterios_es, criterios_ca }) =>
        ({ moduleCode, id, description_es, description_ca, criterios_es, criterios_ca }));
    expect(textos(CFGM_PELUQUERIA_RAS_DATA)).toEqual(textos(DATA));
  });

  it('usa los nombres oficiales del ciclo en el prompt', () => {
    expect(findNivel('CFGM_ATENCION_DEPENDENCIA')?.mapas).toBeUndefined();
    expect(describeTargetCourse('CFGM_ATENCION_DEPENDENCIA', '2º')).toBe(
      '2º de CFGM Atención a Personas en Situación de Dependencia'
    );
    expect(describeTargetCourse('CFGM_ATENCION_DEPENDENCIA', '1º', 'catalan')).toBe(
      '1º de CFGM Atenció a persones en situació de dependència'
    );
  });
});

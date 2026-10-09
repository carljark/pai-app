import { describe, it, expect } from 'vitest';
import { CFGS_INTEGRACION_SOCIAL_RAS_DATA as DATA } from '../data/ras_cfgs_integracion_social.data';
import { CFGS_ANIMACION_SOCIODEPORTIVA_RAS_DATA } from '../data/ras_cfgs_animacion_sociodeportiva.data';
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

// Módulos transversales con el mismo texto que los demás CFGS (RD 659/2023 y RD 500/2024).
const TRANSVERSALES = ['1665', '1709', '0179', '1708', '1710'];
const propios = DATA.filter((ra) => !TRANSVERSALES.includes(ra.moduleCode));
const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);
const buscar = (code: string, id: string) => DATA.find((ra) => ra.moduleCode === code && ra.id === id);

describe('Datos del CFGS Integración Social', () => {
  it('carga los 16 módulos del ciclo con 81 RA, 54 de ellos de los módulos propios con 449 criterios', () => {
    expect(modulos).toHaveLength(16);
    expect(DATA).toHaveLength(81);
    expect(propios).toHaveLength(54);
    expect(propios.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(449);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGS_INTEGRACION_SOCIAL');
  });

  it('numera los RA de cada módulo de forma consecutiva', () => {
    for (const code of modulos) {
      const ids = DATA.filter((ra) => ra.moduleCode === code).map((ra) => ra.id);
      expect(ids).toEqual(ids.map((_, i) => `RA${i + 1}`));
    }
  });

  it('tiene los mismos criterios en castellano y en catalán, con letras consecutivas', () => {
    for (const ra of propios) {
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

  it('comparte con el CFGS Enseñanza y Animación Sociodeportiva el texto de los transversales', () => {
    const textos = (ras: CfgmRaData[]) => ras
      .filter((ra) => TRANSVERSALES.includes(ra.moduleCode))
      .map(({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }) =>
        ({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }))
      .sort((a, b) => `${a.moduleCode}${a.id}`.localeCompare(`${b.moduleCode}${b.id}`));
    expect(textos(DATA)).toEqual(textos(CFGS_ANIMACION_SOCIODEPORTIVA_RAS_DATA));
  });

  it('usa el texto del RD 289/2023, el nombre del proyecto del RD 500/2024 y conserva la errata de 0340 RA2 e)', () => {
    expect(buscar('0337', 'RA2')?.criterios_es[4])
      .toBe('e) Se han descrito las principales necesidades y demandas sociales según los distintos colectivos.');
    expect(buscar('0345', 'RA1')?.module_es).toBe('Proyecto intermodular de integración social');
    expect(buscar('0340', 'RA2')?.criterios_es[4]).toMatch(/^e\) Se ha planificado actividades/);
  });

  it('separa por curso los módulos de FP Illes Balears y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGS_INTEGRACION_SOCIAL');
    expect(nivel?.etapa).toBe('CFGS');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.modulos?.length)).toEqual([7, 9]);
    expect(describeTargetCourse('CFGS_INTEGRACION_SOCIAL', '2º'))
      .toBe('2º de CFGS Integración Social');
    expect(describeTargetCourse('CFGS_INTEGRACION_SOCIAL', '1º', 'catalan'))
      .toBe('1º de CFGS Integració social');
  });
});

import { describe, it, expect } from 'vitest';
import { CFGS_ANIMACION_SOCIODEPORTIVA_RAS_DATA as DATA } from '../data/ras_cfgs_animacion_sociodeportiva.data';
import { CFGS_ACONDICIONAMIENTO_FISICO_RAS_DATA } from '../data/ras_cfgs_acondicionamiento_fisico.data';
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

// Módulos con el mismo texto que el CFGS Acondicionamiento Físico: 1136 y los transversales.
const COMPARTIDOS = ['1136', '1665', '1709', '0179', '1708', '1710'];
const TRANSVERSALES = COMPARTIDOS.slice(1);
const propios = DATA.filter((ra) => !TRANSVERSALES.includes(ra.moduleCode));
const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);

describe('Datos del CFGS Enseñanza y Animación Sociodeportiva', () => {
  it('carga los 16 módulos del ciclo con 90 RA, 63 de ellos de los módulos propios con 438 criterios', () => {
    expect(modulos).toHaveLength(16);
    expect(DATA).toHaveLength(90);
    expect(propios).toHaveLength(63);
    expect(propios.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(438);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGS_ANIMACION_SOCIODEPORTIVA');
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

  it('comparte con el CFGS Acondicionamiento Físico el texto del 1136 y de los transversales', () => {
    const textos = (ras: CfgmRaData[]) => ras
      .filter((ra) => COMPARTIDOS.includes(ra.moduleCode))
      .map(({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }) =>
        ({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }))
      .sort((a, b) => `${a.moduleCode}${a.id}`.localeCompare(`${b.moduleCode}${b.id}`));
    expect(textos(DATA)).toEqual(textos(CFGS_ACONDICIONAMIENTO_FISICO_RAS_DATA));
  });

  it('usa el nombre del proyecto del RD 500/2024 y corrige el punto final de 1137 RA4 b)', () => {
    const proyecto = DATA.find((ra) => ra.moduleCode === '1144');
    expect(proyecto?.module_es).toBe('Proyecto intermodular de enseñanza y animación sociodeportiva');
    const planificacion = DATA.find((ra) => ra.moduleCode === '1137' && ra.id === 'RA4');
    expect(planificacion?.criterios_es[1]).toMatch(/difusión\.$/);
  });

  it('separa por curso los módulos de FP Illes Balears y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGS_ANIMACION_SOCIODEPORTIVA');
    expect(nivel?.etapa).toBe('CFGS');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.modulos?.length)).toEqual([8, 8]);
    expect(describeTargetCourse('CFGS_ANIMACION_SOCIODEPORTIVA', '2º'))
      .toBe('2º de CFGS Enseñanza y Animación Sociodeportiva');
    expect(describeTargetCourse('CFGS_ANIMACION_SOCIODEPORTIVA', '1º', 'catalan'))
      .toBe('1º de CFGS Ensenyament i animació socioesportiva');
  });
});

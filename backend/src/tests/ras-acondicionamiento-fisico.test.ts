import { describe, it, expect } from 'vitest';
import { CFGS_ACONDICIONAMIENTO_FISICO_RAS_DATA as DATA } from '../data/ras_cfgs_acondicionamiento_fisico.data';
import { CFGS_EDUCACION_INFANTIL_RAS_DATA } from '../data/ras_cfgs_educacion_infantil.data';
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

const TRANSVERSALES = ['1665', '1709', '0179', '1708', '1710'];
const propios = DATA.filter((ra) => !TRANSVERSALES.includes(ra.moduleCode));
const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);

describe('Datos del CFGS Acondicionamiento Físico', () => {
  it('carga los 14 módulos del ciclo con 78 RA, 51 de ellos de los módulos propios con 373 criterios', () => {
    expect(modulos).toHaveLength(14);
    expect(DATA).toHaveLength(78);
    expect(propios).toHaveLength(51);
    expect(propios.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(373);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGS_ACONDICIONAMIENTO_FISICO');
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

  it('comparte con el CFGS Educación Infantil el texto de los módulos transversales (tarea 210)', () => {
    const textos = (ras: CfgmRaData[]) => ras
      .filter((ra) => TRANSVERSALES.includes(ra.moduleCode))
      .map(({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }) =>
        ({ moduleCode, id, module_es, module_ca, description_es, description_ca, criterios_es, criterios_ca }))
      .sort((a, b) => `${a.moduleCode}${a.id}`.localeCompare(`${b.moduleCode}${b.id}`));
    expect(textos(DATA)).toEqual(textos(CFGS_EDUCACION_INFANTIL_RAS_DATA));
  });

  it('usa el nombre del proyecto del RD 500/2024 y corrige la coma final de 1136 RA4 e)', () => {
    const proyecto = DATA.find((ra) => ra.moduleCode === '1154');
    expect(proyecto?.module_es).toBe('Proyecto intermodular de acondicionamiento físico');
    const valoracion = DATA.find((ra) => ra.moduleCode === '1136' && ra.id === 'RA4');
    expect(valoracion?.criterios_es[4]).toMatch(/cardiofuncional\.$/);
  });

  it('separa por curso los módulos de FP Illes Balears y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGS_ACONDICIONAMIENTO_FISICO');
    expect(nivel?.etapa).toBe('CFGS');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.modulos?.length)).toEqual([7, 7]);
    expect(describeTargetCourse('CFGS_ACONDICIONAMIENTO_FISICO', '2º')).toBe('2º de CFGS Acondicionamiento Físico');
    expect(describeTargetCourse('CFGS_ACONDICIONAMIENTO_FISICO', '1º', 'catalan')).toBe('1º de CFGS Condicionament físic');
  });
});

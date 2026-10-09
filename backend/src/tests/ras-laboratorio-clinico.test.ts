import { describe, it, expect } from 'vitest';
import { CFGS_LABORATORIO_CLINICO_RAS_DATA as DATA } from '../data/ras_cfgs_laboratorio_clinico.data';
import { CFGS_ANIMACION_SOCIODEPORTIVA_RAS_DATA } from '../data/ras_cfgs_animacion_sociodeportiva.data';
import type { CfgmRaData } from '../data/ras_cfgm_peluqueria.data';
import { findNivel } from '../data/niveles';
import { describeTargetCourse } from '../controllers/project.controller';

const LETRAS = 'abcdefghijklmnopqrstuvwxyz';
const sinLetra = (c: string) => c.replace(/^[a-z]\) /, '');
// Palabras que delatan el otro idioma (sin la letra inicial del criterio). Los límites excluyen
// letras, guiones y apóstrofos para no confundir pronombres enclíticos («adaptant-los»).
const palabras = (lista: string) => new RegExp(`(?<![\\p{L}'-])(${lista})(?![\\p{L}'-])`, 'u');
const CASTELLANO = palabras('y|los|las|con|para|mediante|según|muestra|muestras');
const CATALAN = palabras('i|amb|dels|els|mitjançant|segons|mostra|mostres');

// Módulos transversales con el mismo texto que los demás CFGS (RD 659/2023 y RD 500/2024).
const TRANSVERSALES = ['1665', '1709', '0179', '1708', '1710'];
const propios = DATA.filter((ra) => !TRANSVERSALES.includes(ra.moduleCode));
const modulos = [...new Set(DATA.map((ra) => ra.moduleCode))];
const textosEs = DATA.flatMap((ra) => [ra.description_es, ...ra.criterios_es.map(sinLetra)]);
const textosCa = DATA.flatMap((ra) => [ra.description_ca, ...ra.criterios_ca.map(sinLetra)]);
const buscar = (code: string, id: string) => DATA.find((ra) => ra.moduleCode === code && ra.id === id);

describe('Datos del CFGS Laboratorio Clínico y Biomédico', () => {
  it('carga los 14 módulos del ciclo con 89 RA, 62 de ellos de los módulos propios con 499 criterios', () => {
    expect(modulos).toHaveLength(14);
    expect(DATA).toHaveLength(89);
    expect(propios).toHaveLength(62);
    expect(propios.reduce((n, ra) => n + ra.criterios_es.length, 0)).toBe(499);
    for (const ra of DATA) expect(ra.tipoNivel).toBe('CFGS_LABORATORIO_CLINICO');
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

  it('usa el nombre del proyecto del RD 500/2024 y corrige la puntuación final de 1371 RA1 j) y RA7 g)', () => {
    expect(buscar('1375', 'RA1')?.module_es).toBe('Proyecto intermodular de laboratorio clínico y biomédico');
    expect(buscar('1371', 'RA1')?.criterios_es[9]).toBe('j) Se ha definido el uso eficiente de los recursos.');
    expect(buscar('1371', 'RA7')?.criterios_es[6]).toMatch(/cabecera del paciente\.$/);
  });

  it('separa por curso los módulos de FP Illes Balears y usa los nombres oficiales en el prompt', () => {
    const nivel = findNivel('CFGS_LABORATORIO_CLINICO');
    expect(nivel?.etapa).toBe('CFGS');
    expect(nivel?.codigoCaib).toBe('SAN36');
    expect(nivel?.mapas).toBeUndefined();
    expect(nivel?.cursos.map((c) => c.modulos?.length)).toEqual([7, 7]);
    expect(describeTargetCourse('CFGS_LABORATORIO_CLINICO', '2º'))
      .toBe('2º de CFGS Laboratorio Clínico y Biomédico');
    expect(describeTargetCourse('CFGS_LABORATORIO_CLINICO', '1º', 'catalan'))
      .toBe('1º de CFGS Laboratori clínic i biomèdic');
  });
});

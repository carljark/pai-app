import { describe, it, expect } from 'vitest';
import {
  collectModuleOptions,
  collectRaOptions,
  matchesKeywords,
  matchesProjectFilters,
  matchesTab,
  parseKeywords,
  projectModules,
  projectRas,
} from './history-filter';

const base: any = {
  _id: '1',
  title: 'Barbería y tendencias',
  tipoNivel: 'FP_BASICA',
  courseLevel: '1º',
  modules: ['Módulo A', 'Módulo B'],
  ras: ['RA1', 'RA2'],
  userId: 'u1',
  generatedContent: { rawText: 'contenido de corte' },
};

describe('history-filter', () => {
  it('resolves modules and ras with fallbacks', () => {
    expect(projectModules(base)).toEqual(['Módulo A', 'Módulo B']);
    expect(
      projectModules({
        ...base,
        modules: [],
        generatedContent: { rawText: '', modules: ['X'] },
      } as any),
    ).toEqual(['X']);
    expect(projectRas(base)).toEqual(['RA1', 'RA2']);
    expect(projectRas({ ...base, ras: undefined } as any)).toEqual([]);
  });

  it('matches tabs', () => {
    expect(matchesTab(base, 'FPB')).toBe(true);
    expect(matchesTab({ ...base, tipoNivel: 'CFGM_ESTETICA' } as any, 'CFGM')).toBe(true);
    expect(matchesTab({ ...base, tipoNivel: 'CFGM_PELUQUERIA' } as any, 'CFGM_PELUQUERIA')).toBe(
      true,
    );
    expect(matchesTab({ ...base, tipoNivel: 'ESO' } as any, 'ESO')).toBe(true);
  });

  it('parses and matches keywords ignoring accents and order', () => {
    expect(parseKeywords('  Barbería   corte ')).toEqual(['barberia', 'corte']);
    expect(matchesKeywords(base, ['barberia', 'corte'])).toBe(true);
    expect(matchesKeywords(base, ['barberia', 'ausente'])).toBe(false);
    expect(matchesKeywords(base, [])).toBe(true);
  });

  it('matches module, ra and owner filters', () => {
    const filters = {
      tab: 'FPB' as const,
      onlyMine: true,
      ownerId: 'u1',
      keywords: [],
      module: 'Módulo A',
      ra: 'RA1',
    };
    expect(matchesProjectFilters(base, filters)).toBe(true);

    expect(matchesProjectFilters(base, { ...filters, ownerId: 'other' })).toBe(false);
    expect(matchesProjectFilters(base, { ...filters, module: 'Módulo Z' })).toBe(false);
    expect(matchesProjectFilters(base, { ...filters, ra: 'RA9' })).toBe(false);
  });

  it('collects module and ra options', () => {
    const list = [base, { ...base, _id: '2', modules: ['Módulo C'], ras: ['RA3'] }];
    expect(collectModuleOptions(list as any)).toEqual(['Módulo A', 'Módulo B', 'Módulo C']);
    expect(collectRaOptions(list as any, 'Módulo C')).toEqual(['RA3']);
    expect(collectRaOptions(list as any, null)).toEqual(['RA1', 'RA2', 'RA3']);
  });
});

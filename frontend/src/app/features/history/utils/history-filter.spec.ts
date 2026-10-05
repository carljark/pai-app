import { describe, it, expect } from 'vitest';
import {
  collectModuleOptions,
  collectRaOptions,
  keywordRank,
  matchesKeywords,
  matchesProjectFilters,
  matchesTab,
  parseKeywords,
  projectModules,
  projectRas,
  sortByRelevance,
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
    const eso = { ...base, tipoNivel: 'ESO_ORDINARIA' } as any;
    expect(matchesTab(eso, 'ESO_ORDINARIA')).toBe(true);
    expect(matchesTab(eso, 'ESO')).toBe(false);
    expect(
      matchesTab({ ...base, tipoNivel: 'DIVERSIFICACION_CURRICULAR' } as any, 'ESO_ORDINARIA'),
    ).toBe(false);
    const infantil = { ...base, tipoNivel: 'CFGS_EDUCACION_INFANTIL' } as any;
    expect(matchesTab(infantil, 'CFGS_EDUCACION_INFANTIL')).toBe(true);
    expect(matchesTab(infantil, 'FPB')).toBe(false);
  });

  it('parses and matches keywords ignoring accents and order', () => {
    expect(parseKeywords('  Barbería   corte ')).toEqual(['barberia', 'corte']);
    expect(matchesKeywords(base, ['barberia', 'corte'])).toBe(true);
    expect(matchesKeywords(base, ['barberia', 'ausente'])).toBe(false);
    expect(matchesKeywords(base, [])).toBe(true);
  });

  it('ranks metadata matches above content matches and searches translations', () => {
    const inTitle = {
      ...base,
      title: 'Taller de barbería',
      generatedContent: { rawText: '' },
    } as any;
    const inContent = {
      ...base,
      title: 'Otro',
      modules: [],
      ras: [],
      generatedContent: { rawText: 'curso de barbería' },
    } as any;
    const inTranslation = {
      ...base,
      title: 'Otro',
      modules: [],
      ras: [],
      generatedContent: { rawText: 'texto' },
      translations: { catalan: { rawText: 'imatge corporal' }, castellano: undefined },
    } as any;

    expect(keywordRank(inTitle, ['barberia'])).toBe(2);
    expect(keywordRank(inContent, ['barberia'])).toBe(1);
    expect(keywordRank(inContent, ['ausente'])).toBe(0);
    expect(keywordRank(inTranslation, ['imatge'])).toBe(1);

    expect(sortByRelevance([inContent, inTitle], ['barberia'])).toEqual([inTitle, inContent]);
    expect(sortByRelevance([inContent, inTitle], [])).toEqual([inContent, inTitle]);
  });

  it('searches every tab when there are keywords', () => {
    const eso = { ...base, tipoNivel: 'ESO' } as any;
    const filters = { tab: 'FPB' as const, onlyMine: false, keywords: [], module: null, ra: null };
    expect(matchesProjectFilters(eso, filters)).toBe(false);
    expect(matchesProjectFilters(eso, { ...filters, keywords: ['barberia'] })).toBe(true);
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

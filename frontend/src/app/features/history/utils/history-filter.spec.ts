import { describe, it, expect } from 'vitest';
import { CurriculumResolver } from './curriculum-resolver';
import {
  keywordRank,
  matchesKeywords,
  matchesProjectFilters,
  matchesTab,
  parseKeywords,
  projectCurso,
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

  it('matches tabs by normalized level', () => {
    expect(matchesTab(base, 'FP_BASICA')).toBe(true);
    expect(matchesTab({ ...base, tipoNivel: undefined } as any, 'FP_BASICA')).toBe(true);
    expect(matchesTab({ ...base, tipoNivel: 'CFGM_ESTETICA' } as any, 'CFGM_ESTETICA')).toBe(true);
    expect(matchesTab({ ...base, tipoNivel: 'ESO' } as any, 'DIVERSIFICACION_CURRICULAR')).toBe(
      true,
    );
    const eso = { ...base, tipoNivel: 'ESO_ORDINARIA' } as any;
    expect(matchesTab(eso, 'ESO_ORDINARIA')).toBe(true);
    expect(matchesTab(eso, 'DIVERSIFICACION_CURRICULAR')).toBe(false);
    const infantil = { ...base, tipoNivel: 'CFGS_EDUCACION_INFANTIL' } as any;
    expect(matchesTab(infantil, 'CFGS_EDUCACION_INFANTIL')).toBe(true);
    expect(matchesTab(infantil, 'FP_BASICA')).toBe(false);
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

  const resolver = new CurriculumResolver({ modules: [], items: [] });
  const moduleKey = (text: string) => resolver.modulesOf({ ...base, modules: [text] })[0]!.key;
  const raKey = (text: string) => resolver.itemsOf({ ...base, ras: [text] })[0]!.key;
  const filters = {
    tab: 'FP_BASICA',
    curso: null,
    onlyMine: false,
    keywords: [] as string[],
    module: null as string | null,
    ra: null as string | null,
  };

  it('searches every tab and course when there are keywords', () => {
    const eso = { ...base, tipoNivel: 'ESO' } as any;
    expect(matchesProjectFilters(eso, filters, resolver)).toBe(false);
    expect(matchesProjectFilters(eso, { ...filters, keywords: ['barberia'] }, resolver)).toBe(true);
    const segundo = { ...filters, curso: '2º' };
    expect(matchesProjectFilters(base, segundo, resolver)).toBe(false);
    expect(matchesProjectFilters(base, { ...segundo, keywords: ['barberia'] }, resolver)).toBe(
      true,
    );
  });

  it('matches course, module, ra and owner filters', () => {
    const all = {
      ...filters,
      curso: '1º',
      onlyMine: true,
      ownerId: 'u1',
      module: moduleKey('módulo a'),
      ra: raKey('RA1'),
    };
    expect(matchesProjectFilters(base, all, resolver)).toBe(true);

    expect(matchesProjectFilters(base, { ...all, ownerId: 'other' }, resolver)).toBe(false);
    expect(matchesProjectFilters(base, { ...all, curso: '2º' }, resolver)).toBe(false);
    expect(matchesProjectFilters(base, { ...all, module: moduleKey('Módulo Z') }, resolver)).toBe(
      false,
    );
    expect(matchesProjectFilters(base, { ...all, ra: raKey('RA9') }, resolver)).toBe(false);
  });

  it('reads the course from the project or its generated content', () => {
    expect(projectCurso(base)).toBe('1º');
    const legacy = {
      ...base,
      courseLevel: '',
      generatedContent: { rawText: '', courseLevel: '2º' },
    };
    expect(projectCurso(legacy)).toBe('2º');
    expect(projectCurso({ ...base, courseLevel: '', generatedContent: undefined })).toBe('');
  });
});

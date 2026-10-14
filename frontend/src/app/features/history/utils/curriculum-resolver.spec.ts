import { describe, it, expect } from 'vitest';
import { CurriculumResolver } from './curriculum-resolver';
import {
  collectOptions,
  itemsOfModule,
  sortItems,
  sortModules,
  toSelectOptions,
} from './filter-options';

import { FILTER_INDEX, ANALISIS, LEVEL, PEINADOS } from '../../../testing/filter-index.mock';

const project = (overrides: any = {}): any => ({
  _id: '1',
  tipoNivel: LEVEL,
  modules: ['Peinados'],
  ras: ['Peina'],
  ...overrides,
});

describe('CurriculumResolver', () => {
  const resolver = new CurriculumResolver(FILTER_INDEX);

  it('joins the same module and RA saved in Spanish and in Catalan', () => {
    const es = project();
    const ca = project({ _id: '2', modules: ['Pentinats'], ras: ['Pentina'] });
    expect(resolver.modulesOf(es)).toEqual(resolver.modulesOf(ca));
    expect(resolver.itemsOf(ca)).toEqual([
      {
        key: `${PEINADOS}|RA1`,
        es: 'RA1. Peina',
        ca: 'RA1. Pentina',
        moduleKey: PEINADOS,
        order: 1,
      },
    ]);
    expect(collectOptions([es, ca], (p) => resolver.modulesOf(p))).toHaveLength(1);
  });

  it('keeps texts outside the index as their own option, ignoring case and accents', () => {
    const p = project({ modules: ['Módulo libre', 'modulo  LIBRE', ''], ras: undefined });
    const options = resolver.modulesOf(p);
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ es: 'Módulo libre', ca: 'Módulo libre' });
    expect(options[0]!.moduleKey).toBeUndefined();
    expect(resolver.itemsOf(p)).toEqual([]);
  });

  it('recognises old RA saved with numbering and other punctuation, and the labels themselves', () => {
    const legacy = project({
      modules: ['PEINADOS'],
      ras: ['1. Peina.', 'RA2. Recoge', 'RA1) Analiza'],
    });
    expect(resolver.modulesOf(legacy)[0]!.key).toBe(PEINADOS);
    expect(resolver.itemsOf(legacy).map((i) => i.key)).toEqual([
      `${PEINADOS}|RA1`,
      `${PEINADOS}|RA2`,
      `${ANALISIS}|RA1`,
    ]);
  });

  it('does not mix texts of another level', () => {
    const other = project({ tipoNivel: 'FP_BASICA' });
    expect(resolver.modulesOf(other)[0]!.key).toMatch(/^txt\|/);
  });

  it('keeps the first entry when two aliases only differ in accents', () => {
    const module = {
      key: 'M',
      tipoNivel: LEVEL,
      es: 'Módulo',
      ca: 'Modul',
      aliases: ['Módulo', 'Modulo'],
    };
    const dup = new CurriculumResolver({ modules: [module], items: [] });
    expect(dup.modulesOf(project({ modules: ['modulo'] }))[0]!.key).toBe('M');
  });

  it('caches the options of each project', () => {
    const p = project();
    expect(resolver.modulesOf(p)).toBe(resolver.modulesOf(p));
  });
});

describe('filter-options', () => {
  const resolver = new CurriculumResolver(FILTER_INDEX);
  const projects = [
    project({ modules: ['Peinados', 'Análisis'], ras: ['Recull', 'Peina', 'Analiza', 'Libre'] }),
    project({ _id: '2', modules: ['Zeta'], ras: ['Otro'] }),
  ];

  it('sorts modules by the official order and then alphabetically', () => {
    const modules = collectOptions(projects, (p) => resolver.modulesOf(p));
    const sorted = sortModules(modules, ['0640', '0845'], true);
    expect(toSelectOptions(sorted, true).map((o) => o.label)).toEqual([
      'Anàlisi',
      'Pentinats',
      'Zeta',
    ]);
    const alphabetical = sortModules(modules, [], false).map((m) => m.es);
    expect(alphabetical).toEqual(['Análisis', 'Peinados', 'Zeta']);
  });

  it('lists the RA of the chosen module in order, with the texts outside the index', () => {
    const items = sortItems(itemsOfModule(projects, resolver, PEINADOS), false);
    expect(items.map((i) => i.es)).toEqual(['RA1. Peina', 'RA2. Recoge', 'Libre']);
    const ca = sortItems(itemsOfModule(projects, resolver, ANALISIS), true);
    expect(toSelectOptions(ca, true).map((o) => o.label)).toEqual(['RA1. Analitza', 'Libre']);
  });

  it('sorts RA with the same order by label', () => {
    const items = [
      { key: 'b', es: 'B', ca: 'B', order: 1 },
      { key: 'a', es: 'A', ca: 'A', order: 1 },
    ];
    expect(sortItems(items, false).map((i) => i.key)).toEqual(['a', 'b']);
  });
});

import { describe, it, expect } from 'vitest';
import {
  GroupedCurriculumItem,
  filterRasForNivel,
  groupRasByModule,
  sortGroupsByModuleOrder,
} from './curriculum-grouping';
import { LearningOutcome } from '../models/curriculum.model';

const group = (category: string, moduleCode?: string): GroupedCurriculumItem => ({
  category,
  items: [],
  totalItems: 0,
  moduleCode,
});

describe('curriculum-grouping', () => {
  describe('sortGroupsByModuleOrder', () => {
    it('keeps the order when the course does not fix its modules', () => {
      const groups = [group('B', '2'), group('A', '1')];
      expect(sortGroupsByModuleOrder(groups, null).map((g) => g.category)).toEqual(['B', 'A']);
    });

    it('sorts by the official order and alphabetically the modules outside it', () => {
      const official = [group('Segundo', '0002'), group('Primero', '0001')];
      expect(sortGroupsByModuleOrder(official, ['0001', '0002']).map((g) => g.category)).toEqual([
        'Primero',
        'Segundo',
      ]);
      expect(
        sortGroupsByModuleOrder([group('Alfa', '9999'), group('Zeta')], ['0001']).map(
          (g) => g.category,
        ),
      ).toEqual(['Alfa', 'Zeta']);
      const outside = [group('Zeta'), group('Alfa', '9999')];
      expect(sortGroupsByModuleOrder(outside, ['0001']).map((g) => g.category)).toEqual([
        'Alfa',
        'Zeta',
      ]);
    });
  });

  describe('filterRasForNivel', () => {
    const ras: LearningOutcome[] = [
      { description: 'Antiguo sin nivel', module: 'Mod' },
      { description: 'Infantil', moduleCode: '0011', tipoNivel: 'CFGS_EDUCACION_INFANTIL' },
      { description: 'Otro', moduleCode: '0013', tipoNivel: 'CFGS_EDUCACION_INFANTIL' },
      { description: 'Sin módulo', tipoNivel: 'CFGS_EDUCACION_INFANTIL' },
    ];

    it('treats legacy RAs without level as FP Básica', () => {
      const list = filterRasForNivel(ras, 'FP_BASICA', null, false);
      expect(list.map((r) => r.description)).toEqual(['Antiguo sin nivel']);
    });

    it('keeps only the modules of the course when the catalog fixes them', () => {
      expect(filterRasForNivel(ras, 'CFGS_EDUCACION_INFANTIL', null, false)).toHaveLength(3);
      const list = filterRasForNivel(ras, 'CFGS_EDUCACION_INFANTIL', ['0011'], false);
      expect(list.map((r) => r.description)).toEqual(['Infantil']);
    });
  });

  it('falls back to the base fields when a Catalan translation is missing', () => {
    const [ra] = filterRasForNivel(
      [{ description: 'Desc', module: 'Mòdul', criterios: ['a'] }],
      'FP_BASICA',
      null,
      true,
    );
    expect(ra.module).toBe('Mòdul');
    expect(ra.subject).toBe('Mòdul');
    expect(ra.description).toBe('Desc');
    const [bare] = filterRasForNivel([{ description: 'Sola' }], 'FP_BASICA', null, true);
    expect(bare.subject).toBeUndefined();
    expect(groupRasByModule([bare])[0].category).toBe('');
  });
});

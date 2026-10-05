import { describe, it, expect } from 'vitest';
import { groupEsoCes } from './eso-grouping';
import { EvaluativeCriteria } from '../models/curriculum.model';

const ce = (p: Partial<EvaluativeCriteria>) => ({ _id: 'x', description: 'Desc', ...p });

describe('groupEsoCes', () => {
  it('marks optional subjects in Catalan and keeps common ones unmarked', () => {
    const groups = groupEsoCes(
      [
        ce({ subject: 'Música', tipo: 'optativa', ce_num: 2, value: 'Música · CE2. Desc' }),
        ce({ subject: 'Educació Física', tipo: 'comun', ce_num: 1, value: 'EF · CE1. Desc' }),
      ],
      true,
    );
    expect(groups.map((g) => g.category)).toEqual(['Música · Optativa', 'Educació Física']);
    expect(groups[0]!.items[0]!.index).toBe(2);
  });

  it('numbers CE without official number by position and tolerates missing data', () => {
    const groups = groupEsoCes([ce({ tipo: 'opcion' }), ce({ tipo: 'opcion' })], false);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.category).toBe(' · De opción');
    expect(groups[0]!.items.map((i) => i.index)).toEqual([1, 2]);
    expect(groups[0]!.totalItems).toBe(2);
  });
});

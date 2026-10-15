import { describe, it, expect } from 'vitest';
import { materiasEnOrden, seleccionDeAfinidad } from './afinidad-seleccion';
import { FICHA_DOS, FICHA_TRES } from '../../../testing/afinidades.mock';
import { EvaluativeCriteria } from '../../curriculum/models/curriculum.model';

const crit = (...ids: string[]) => ids.map((id) => ({ id, text: 'T ' + id }));
const ce = (subjectCode: string, ce_num: number, ids: string[], value?: string) =>
  ({
    _id: subjectCode + ce_num,
    description: 'CE',
    subjectCode,
    ce_num,
    value: value ?? `${subjectCode} · CE${ce_num}. CE`,
    criteriosDetalle: crit(...ids),
  }) as EvaluativeCriteria;

describe('afinidad-seleccion', () => {
  it('pone la materia consultada en primer lugar', () => {
    expect(materiasEnOrden(FICHA_TRES, 'TEC')).toEqual(['TEC', 'BYG', 'MAT']);
    expect(materiasEnOrden(FICHA_TRES, 'EF')).toEqual(['BYG', 'MAT', 'TEC']);
  });

  it('agrupa los criterios por CE y omite los que no existen en el curso', () => {
    const ces = [ce('BYG', 1, ['1.1', '1.2']), ce('MAT', 2, ['2.1', '2.2', '2.3'])];
    expect(seleccionDeAfinidad(FICHA_DOS, 'MAT', ces)).toEqual([
      { key: 'MAT · CE2. CE', ids: ['2.1', '2.2'], todos: crit('2.1', '2.2', '2.3') },
      { key: 'BYG · CE1. CE', ids: ['1.1'], todos: crit('1.1', '1.2') },
    ]);
  });

  it('descarta CE ausentes, sin valor o sin criterios coincidentes', () => {
    const ces = [ce('BYG', 1, ['1.9']), { ...ce('MAT', 2, ['2.1']), value: undefined }];
    expect(seleccionDeAfinidad(FICHA_TRES, 'BYG', ces)).toEqual([]);
  });

  it('no repite criterios citados en varios vínculos', () => {
    const ficha = { ...FICHA_DOS, vinculos: [FICHA_DOS.vinculos[0], FICHA_DOS.vinculos[0]] };
    const sel = seleccionDeAfinidad(ficha, 'BYG', [ce('BYG', 1, ['1.1'])]);
    expect(sel).toEqual([{ key: 'BYG · CE1. CE', ids: ['1.1'], todos: crit('1.1') }]);
  });
});

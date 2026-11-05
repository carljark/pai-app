import { describe, expect, it } from 'vitest';
import { CESTA_VACIA, type CestaEstado } from '../models/cesta.model';
import {
  agrupar,
  anadirClaves,
  anadirUnidad,
  contieneClaves,
  quitarClave,
  quitarUnidad,
  sinRepetir,
  todasLasUnidades,
} from './cesta';

const estado = (parcial: Partial<CestaEstado>): CestaEstado => ({ ...CESTA_VACIA, ...parcial });

describe('cesta (funciones puras)', () => {
  it('une listas sin repetir y conservando el orden', () => {
    expect(sinRepetir(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('una unidad arrastrada entra una sola vez y recupera las claves quitadas', () => {
    const e = estado({ excluidas: { MAT: ['1.1'] } });
    const una = anadirUnidad(e, 'MAT');
    expect(una.unidades).toEqual(['MAT']);
    expect(una.excluidas).toEqual({});
    expect(anadirUnidad(una, 'MAT')).toBe(una);
  });

  it('añadir dos fichas que comparten materia une los criterios sin repetir', () => {
    const a = anadirClaves(CESTA_VACIA, { MAT: ['1.1', '2.3'] });
    const b = anadirClaves(a, { MAT: ['2.3', '4.1'], TEC: ['3.2'] });
    expect(b.extras).toEqual({ MAT: ['1.1', '2.3', '4.1'], TEC: ['3.2'] });
    expect(CESTA_VACIA.extras).toEqual({});
  });

  it('volver a añadir una clave quitada la recupera', () => {
    const e = quitarClave(anadirClaves(CESTA_VACIA, { MAT: ['1.1', '2.1'] }), 'MAT', '1.1');
    expect(agrupar(e, {})[0]!.claves).toEqual(['2.1']);
    expect(agrupar(anadirClaves(e, { MAT: ['1.1'] }), {})[0]!.claves).toEqual(['1.1', '2.1']);
  });

  it('quitar una unidad borra sus claves añadidas, en común y quitadas', () => {
    const e = estado({
      unidades: ['MAT', 'TEC'],
      extras: { MAT: ['1.1'], BYG: ['2.1'] },
      excluidas: { MAT: ['3.1'] },
    });
    expect(quitarUnidad(e, 'MAT')).toEqual({
      unidades: ['TEC'],
      extras: { BYG: ['2.1'] },
      excluidas: {},
    });
  });

  it('agrupa unidades arrastradas y añadidas, ordena y descuenta las quitadas', () => {
    const e = estado({
      unidades: ['MAT'],
      extras: { BYG: ['1.10', '1.2'] },
      excluidas: { MAT: ['2.2'] },
    });
    expect(todasLasUnidades(e)).toEqual(['MAT', 'BYG']);
    expect(agrupar(e, { MAT: ['2.2', '2.1'], BYG: ['1.1'] })).toEqual([
      { unidad: 'MAT', claves: ['2.1'], arrastrada: true },
      { unidad: 'BYG', claves: ['1.1', '1.2', '1.10'], arrastrada: false },
    ]);
  });

  it('sabe si unas claves ya están todas en la cesta', () => {
    const grupos = agrupar(estado({ extras: { MAT: ['1.1', '2.1'] } }), {});
    expect(contieneClaves(grupos, { MAT: ['1.1'] })).toBe(true);
    expect(contieneClaves(grupos, { MAT: ['1.1', '3.1'] })).toBe(false);
    expect(contieneClaves(grupos, { TEC: ['1.1'] })).toBe(false);
    expect(contieneClaves(grupos, {})).toBe(false);
  });
});

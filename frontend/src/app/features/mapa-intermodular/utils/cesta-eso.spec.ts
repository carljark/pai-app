import { describe, expect, it } from 'vitest';
import { AFINIDADES_1, FICHA_DOS, FICHA_TRES } from '../../../testing/afinidades.mock';
import { comunesEso, criteriosDeFicha } from './cesta-eso';

const FICHAS = AFINIDADES_1.afinidades;

describe('cesta-eso', () => {
  it('reúne los criterios de cada materia de una ficha', () => {
    expect(criteriosDeFicha(FICHA_DOS)).toEqual({ BYG: ['1.1'], MAT: ['2.1', '2.2'] });
    expect(criteriosDeFicha(FICHA_TRES, ['TEC'])).toEqual({ TEC: ['3.1'] });
  });

  it('una sola materia arrastrada no aporta criterios todavía', () => {
    expect(comunesEso(FICHAS, ['MAT'], ['MAT'])).toEqual({});
  });

  it('dos materias arrastradas aportan los criterios de todas sus fichas comunes', () => {
    expect(comunesEso(FICHAS, ['BYG', 'MAT'], ['BYG', 'MAT'])).toEqual({
      BYG: ['1.1'],
      MAT: ['2.1', '2.2'],
    });
  });

  it('de una ficha de tres materias solo cuentan las que están en la cesta', () => {
    expect(comunesEso(FICHAS, ['MAT', 'TEC'], ['MAT', 'TEC'])).toEqual({
      MAT: ['2.1'],
      TEC: ['3.1'],
    });
  });

  it('dos materias sin ficha común no aportan nada', () => {
    expect(comunesEso(FICHAS, ['TEC', 'EF'], ['TEC', 'EF'])).toEqual({});
  });

  it('las materias añadidas solo con botón no suman fichas por sí solas', () => {
    expect(comunesEso(FICHAS, ['BYG', 'MAT'], [])).toEqual({});
    expect(comunesEso(FICHAS, ['BYG', 'MAT', 'TEC'], ['TEC'])).toEqual({
      BYG: ['1.1'],
      MAT: ['2.1'],
      TEC: ['3.1'],
    });
  });
});

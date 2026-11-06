import { describe, expect, it } from 'vitest';
import type { IntermodularConnection } from '../models/mapa-intermodular.model';
import { conexionDeCriterio, criterioClave } from './criterio-clave';

const conexion = (c: object) => c as IntermodularConnection;

describe('criterio-clave', () => {
  it('extrae la letra de los criterios de los RA', () => {
    expect(criterioClave('a) Se ha relacionado la imagen personal.')).toBe('a');
    expect(criterioClave('3060-1c. Se ha adaptado la imagen.')).toBe('c');
    expect(criterioClave('  B) Mayúsculas  ')).toBe('b');
  });

  it('extrae el número de los criterios de las competencias específicas', () => {
    expect(criterioClave('1.1 Explicar los fenómenos naturales más relevantes.')).toBe('1.1');
    expect(criterioClave('7.4 Utilizar, de forma guiada, estrategias.')).toBe('7.4');
  });

  it('devuelve el texto si no encuentra ninguna clave', () => {
    expect(criterioClave('123')).toBe('123');
  });

  it('reconoce la conexión por sus claves o por su criterio de origen', () => {
    const ce = conexion({ criteriaKeys: ['1.1', '3163-1.1'], sourceCriteria: '3163-1.1' });
    expect(conexionDeCriterio(ce, '1.1 Explicar los fenómenos.')).toBe(true);
    expect(conexionDeCriterio(ce, '1.2 Justificar la contribución.')).toBe(false);

    const ra = conexion({ criteriaKeys: ['a', '1a', '3060-1a'], sourceCriteria: '3060-1a' });
    expect(conexionDeCriterio(ra, 'a) Se ha relacionado.')).toBe(true);
    expect(conexionDeCriterio(ra, 'b) Se ha identificado.')).toBe(false);

    expect(conexionDeCriterio(conexion({ sourceCriteria: '3060-1a, 3060-1b' }), 'b) Otro.')).toBe(
      true,
    );
    expect(conexionDeCriterio(conexion({}), 'a) Sin claves.')).toBe(false);
  });
});

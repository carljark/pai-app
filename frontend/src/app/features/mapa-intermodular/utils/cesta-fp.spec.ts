import { describe, expect, it } from 'vitest';
import { mindmapModules, mockConnection } from '../../../testing/mindmap.mock';
import { comunesFp, rasDeConexion, referenciasDeGrupos } from './cesta-fp';

const MODULOS = mindmapModules();

describe('cesta-fp', () => {
  it('toma los dos extremos de una conexión, sin repetir si son del mismo módulo', () => {
    expect(rasDeConexion('0001', 'RA1', mockConnection('0002', 'RA2', 'tecnica'))).toEqual({
      '0001': ['RA1'],
      '0002': ['RA2'],
    });
    expect(rasDeConexion('0001', 'RA1', mockConnection('0001', 'RA1', 'tecnica'))).toEqual({
      '0001': ['RA1'],
    });
  });

  it('dos módulos arrastrados aportan los RA de las conexiones entre ellos', () => {
    expect(comunesFp(MODULOS, ['0001', '0002'], ['0001', '0002'])).toEqual({
      '0001': ['RA1', 'RA2'],
      '0002': ['RA1', 'RA2'],
    });
  });

  it('un solo módulo, o módulos sin arrastrar, no aportan nada', () => {
    expect(comunesFp(MODULOS, ['0001'], ['0001'])).toEqual({});
    expect(comunesFp(MODULOS, ['0001', '0002'], [])).toEqual({});
  });

  it('cuenta la conexión si basta con que uno de los dos módulos se haya arrastrado', () => {
    expect(comunesFp(MODULOS, ['0001', '0002'], ['0002'])['0001']).toEqual(['RA1', 'RA2']);
  });

  it('traduce los grupos a referencias con el texto de cada RA y omite los desconocidos', () => {
    const refs = referenciasDeGrupos(
      [
        { unidad: '0001', claves: ['RA2', 'RA9'], arrastrada: true },
        { unidad: '0009', claves: ['RA4'], arrastrada: false },
      ],
      MODULOS,
    );
    expect(refs).toEqual([
      {
        moduleCode: '0001',
        moduleName: 'Análisis clínico',
        raCode: 'RA2',
        textEs: 'Resultado RA2 de 0001',
        textCa: 'Resultat RA2 de 0001',
      },
    ]);
  });
});

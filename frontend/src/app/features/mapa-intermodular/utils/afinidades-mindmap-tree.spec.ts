import { describe, expect, it } from 'vitest';
import { AFINIDADES_1 } from '../../../testing/afinidades.mock';
import type { MindmapPath } from '../models/mindmap.model';
import { buildAfinidadesTree, findSelectedFicha, materiaSigla } from './afinidades-mindmap-tree';
import { EMPTY_PATH, NEUTRAL_COLOR } from './mindmap-tree';

function tree(path: Partial<MindmapPath> = {}, isCa = false) {
  return buildAfinidadesTree({
    data: AFINIDADES_1,
    path: { ...EMPTY_PATH, ...path },
    isCa,
    rootBadge: 'ESO',
    rootLabel: 'ESO 1º',
  });
}

describe('materiaSigla', () => {
  it('usa las iniciales de las palabras con contenido', () => {
    expect(materiaSigla('Biología y Geología')).toBe('BG');
    expect(materiaSigla('Cultura Clásica II')).toBe('CCI');
    expect(materiaSigla('Lengua Castellana y Literatura')).toBe('LCL');
    expect(materiaSigla('Matemáticas')).toBe('MAT');
  });
});

describe('buildAfinidadesTree', () => {
  it('arranca con el centro y una materia por nodo, con su número de fichas', () => {
    const root = tree();
    expect(root).toMatchObject({ id: 'root', badge: 'ESO', label: 'ESO 1º', color: NEUTRAL_COLOR });
    expect(root.children.map((m) => [m.id, m.badge, m.count, m.expandable])).toEqual([
      ['m:BYG', 'BG', 2, true],
      ['m:MAT', 'MAT', 2, true],
      ['m:TEC', 'TEC', 1, true],
      ['m:EF', 'EF', 0, false],
    ]);
    expect(new Set(root.children.map((m) => m.color)).size).toBe(4);
  });

  it('una materia abierta muestra sus materias afines con las fichas compartidas', () => {
    const byg = tree({ moduleCode: 'BYG' }).children[0]!;
    expect(byg.expanded).toBe(true);
    expect(byg.children.map((g) => [g.id, g.label, g.count])).toEqual([
      ['g:BYG:MAT', 'Matemáticas', 2],
      ['g:BYG:TEC', 'Tecnología', 1],
    ]);
  });

  it('una materia afín abierta muestra sus fichas con el ámbito desde la materia', () => {
    const group = tree({ moduleCode: 'BYG', groupCode: 'MAT', connectionIndex: 1 }).children[0]!
      .children[0]!;
    expect(group.children.map((f) => [f.id, f.badge, f.label, f.expanded])).toEqual([
      ['c:BYG:0', '1', 'Ámbito de BYG', false],
      ['c:BYG:1', '2', 'Ámbito de la ficha', true],
    ]);
  });

  it('se traduce al catalán', () => {
    const mat = tree({ moduleCode: 'MAT', groupCode: 'TEC' }, true).children[1]!;
    expect(mat.label).toBe('Matemàtiques');
    expect(mat.children.map((g) => g.label)).toEqual(['Biologia i Geologia', 'Tecnologia']);
    expect(mat.children[1]!.children[0]!.label).toBe('Àmbit des de MAT');
  });

  it('usa el código si la materia afín no está en la lista del curso', () => {
    const data = {
      ...AFINIDADES_1,
      afinidades: [{ ...AFINIDADES_1.afinidades[0]!, materias: ['BYG', 'XYZ'] }],
    };
    const byg = buildAfinidadesTree({
      data,
      path: { ...EMPTY_PATH, moduleCode: 'BYG' },
      isCa: false,
      rootBadge: '',
      rootLabel: '',
    }).children[0]!;
    expect(byg.children[0]).toMatchObject({ label: 'XYZ', badge: 'XYZ' });
  });
});

describe('findSelectedFicha', () => {
  it('devuelve la ficha elegida con la materia desde la que se consulta', () => {
    const path = { ...EMPTY_PATH, moduleCode: 'MAT', groupCode: 'BYG', connectionIndex: 1 };
    expect(findSelectedFicha(AFINIDADES_1, path)).toEqual({
      ficha: AFINIDADES_1.afinidades[1],
      materia: 'MAT',
    });
  });

  it('devuelve null sin datos, sin ficha elegida o si no existe', () => {
    expect(findSelectedFicha(null, { ...EMPTY_PATH, connectionIndex: 0 })).toBeNull();
    expect(findSelectedFicha(AFINIDADES_1, EMPTY_PATH)).toBeNull();
    expect(findSelectedFicha(AFINIDADES_1, { ...EMPTY_PATH, connectionIndex: 9 })).toBeNull();
  });
});

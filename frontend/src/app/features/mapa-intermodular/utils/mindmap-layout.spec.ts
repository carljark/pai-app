import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import {
  FIRST_RING,
  RING_GAP,
  connectionArc,
  fitTransform,
  focusTransform,
  layoutMindmap,
  polar,
  ringRadius,
  wrapLabel,
} from './mindmap-layout';
import { EMPTY_PATH, buildMindmapTree } from './mindmap-tree';

function tree(path = EMPTY_PATH) {
  return buildMindmapTree({
    modules: mindmapModules(),
    path,
    isCa: false,
    rootBadge: 'CFGS',
    rootLabel: 'Laboratorio',
  });
}

const OPEN_PATH = {
  moduleCode: '0001',
  raId: '0001_RA1',
  groupCode: '0002',
  connectionIndex: 0,
};

describe('ringRadius y polar', () => {
  it('coloca cada nivel en su anillo', () => {
    expect(ringRadius(0)).toBe(0);
    expect(ringRadius(1)).toBe(FIRST_RING);
    expect(ringRadius(3)).toBe(FIRST_RING + 2 * RING_GAP);
  });

  it('pone el ángulo 0 arriba y gira en sentido horario', () => {
    const [x0, y0] = polar(0, 10);
    expect(x0).toBeCloseTo(0);
    expect(y0).toBeCloseTo(-10);
    const [x1, y1] = polar(Math.PI / 2, 10);
    expect(x1).toBeCloseTo(10);
    expect(y1).toBeCloseTo(0);
  });
});

describe('layoutMindmap', () => {
  it('sitúa el centro en el origen y los módulos en el primer anillo', () => {
    const { nodes, links, radius } = layoutMindmap(tree());
    expect(nodes[0]).toMatchObject({ x: 0, y: 0, depth: 0 });
    for (const n of nodes.slice(1)) {
      expect(Math.hypot(n.x, n.y)).toBeCloseTo(FIRST_RING);
    }
    expect(links.map((l) => l.targetId)).toEqual(['m:0001', 'm:0002']);
    expect(links[0]!.path).toMatch(/^M/);
    expect(radius).toBe(FIRST_RING);
  });

  it('marca a la izquierda los nodos con x negativa', () => {
    const { nodes } = layoutMindmap(tree());
    for (const n of nodes) expect(n.isLeft).toBe(n.x < -1);
    expect(nodes.some((n) => n.isLeft)).toBe(true);
  });

  it('crece un anillo por cada nivel desplegado', () => {
    const { nodes, radius } = layoutMindmap(tree(OPEN_PATH));
    expect(radius).toBe(ringRadius(4));
    expect(nodes.filter((n) => n.depth === 4)).toHaveLength(2);
  });
});

describe('connectionArc', () => {
  it('une la conexión con su módulo de destino', () => {
    const { nodes } = layoutMindmap(tree(OPEN_PATH));
    expect(connectionArc(nodes, 'c:0001_RA1:0', '0002')).toMatch(/^M-?[\d.]+,-?[\d.]+Q/);
  });

  it('devuelve null si falta alguno de los extremos', () => {
    const { nodes } = layoutMindmap(tree(OPEN_PATH));
    expect(connectionArc(nodes, 'c:0001_RA1:0', '0009')).toBeNull();
    expect(connectionArc(nodes, 'c:nada', '0002')).toBeNull();
  });
});

describe('transformaciones', () => {
  it('encuadra el mapa centrado y limita la escala', () => {
    const fit = fitTransform(200, 1000, 800);
    expect(fit).toMatchObject({ x: 500, y: 400 });
    expect(fit.k).toBeCloseTo(800 / 740);
    expect(fitTransform(5000, 400, 300).k).toBe(0.25);
    expect(fitTransform(0, 4000, 4000).k).toBe(1.2);
  });

  it('lleva un punto al centro del lienzo', () => {
    expect(focusTransform(100, -50, 2, 800, 600)).toEqual({ x: 200, y: 400, k: 2 });
  });
});

describe('wrapLabel', () => {
  it('parte por palabras sin pasar del ancho', () => {
    expect(wrapLabel('Análisis de muestras biológicas', 12, 3)).toEqual([
      'Análisis de',
      'muestras',
      'biológicas',
    ]);
  });

  it('recorta con puntos suspensivos lo que no cabe', () => {
    expect(wrapLabel('uno dos tres cuatro cinco', 8, 2)).toEqual(['uno dos', 'tres…']);
    expect(wrapLabel('Supercalifragilístico', 8, 2)).toEqual(['Superca…']);
  });

  it('devuelve una lista vacía para un texto vacío', () => {
    expect(wrapLabel('  ', 10, 2)).toEqual([]);
  });
});

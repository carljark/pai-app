import { describe, expect, it } from 'vitest';
import type { MindmapNode, PositionedNode } from '../models/mindmap.model';
import { NODE_RADIUS, nodeClasses, nodeView } from './mindmap-node-view';

const IDLE = { dimmed: false, muted: false, match: false };

function positioned(partial: Partial<MindmapNode>, x = 100, depth = 1): PositionedNode {
  const node: MindmapNode = {
    id: 'm:1',
    kind: 'module',
    badge: '0001',
    label: 'Análisis',
    color: '',
    expandable: true,
    expanded: false,
    searchText: '',
    relationTypes: [],
    count: 3,
    children: [],
    ...partial,
  };
  return { node, x, y: -50, depth, isLeft: x < -1 };
}

describe('nodeClasses', () => {
  it('añade los modificadores BEM activos', () => {
    expect(nodeClasses(positioned({}), IDLE)).toBe(
      'mindmap-canvas__node mindmap-canvas__node--module mindmap-canvas__node--expandable',
    );
    expect(
      nodeClasses(positioned({ expandable: false, expanded: true }), {
        dimmed: true,
        muted: true,
        match: true,
      }),
    ).toBe(
      'mindmap-canvas__node mindmap-canvas__node--module mindmap-canvas__node--expanded ' +
        'mindmap-canvas__node--muted mindmap-canvas__node--dimmed mindmap-canvas__node--match',
    );
  });
});

describe('nodeView', () => {
  it('coloca la etiqueta a la derecha de los nodos de la derecha', () => {
    const view = nodeView(positioned({}), IDLE, 2);
    expect(view).toMatchObject({
      radius: NODE_RADIUS.module,
      transform: 'translate(100.0,-50.0)',
      labelX: NODE_RADIUS.module + 8,
      labelAnchor: 'start',
      labelFirstDy: '-0.25em',
      showCount: true,
      ariaLabel: '0001 Análisis',
    });
  });

  it('coloca la etiqueta a la izquierda de los nodos de la izquierda', () => {
    const view = nodeView(positioned({ expanded: true }, -100), IDLE, 1);
    expect(view.labelX).toBe(-(NODE_RADIUS.module + 8));
    expect(view.labelAnchor).toBe('end');
    expect(view.labelFirstDy).toBe('0.35em');
    expect(view.showCount).toBe(false);
  });

  it('pone la etiqueta del centro debajo del círculo', () => {
    const view = nodeView(positioned({ kind: 'root', badge: '', count: 0 }, 0, 0), IDLE, 2);
    expect(view).toMatchObject({
      labelX: 0,
      labelAnchor: 'middle',
      labelFirstDy: `${NODE_RADIUS.root + 20}`,
      showCount: false,
      ariaLabel: 'Análisis',
    });
  });
});

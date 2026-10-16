import type { MindmapNodeKind, NodeVisualState, PositionedNode } from '../models/mindmap.model';

/** Radio del círculo de cada nivel. */
export const NODE_RADIUS: Record<MindmapNodeKind, number> = {
  root: 42,
  module: 25,
  ra: 19,
  group: 18,
  connection: 14,
};

const BLOCK = 'mindmap-canvas__node';

/** Atributos SVG ya calculados para pintar un nodo en la plantilla del lienzo. */
export interface NodeView {
  classes: string;
  radius: number;
  transform: string;
  /** Posición y alineación de la etiqueta: debajo en el centro y hacia fuera en el resto. */
  labelX: number;
  labelAnchor: 'middle' | 'start' | 'end';
  /** Desplazamiento de la primera línea para centrar el bloque de texto en vertical. */
  labelFirstDy: string;
  /** Burbuja con el número de hijos en los nodos plegados que se pueden desplegar. */
  showCount: boolean;
  countTransform: string;
  ariaLabel: string;
}

export function nodeClasses(p: PositionedNode, state: NodeVisualState): string {
  const { node } = p;
  const modifiers: [boolean, string][] = [
    [true, node.kind],
    [node.expandable, 'expandable'],
    [node.expanded, 'expanded'],
    [state.muted, 'muted'],
    [state.dimmed, 'dimmed'],
    [state.match, 'match'],
  ];
  const active = modifiers.filter(([on]) => on).map(([, name]) => `${BLOCK}--${name}`);
  return [BLOCK, ...active].join(' ');
}

export function nodeView(p: PositionedNode, state: NodeVisualState, lineCount: number): NodeView {
  const radius = NODE_RADIUS[p.node.kind];
  const isRoot = p.depth === 0;
  const gap = radius + 8;
  const offset = radius * 0.75;
  return {
    classes: nodeClasses(p, state),
    radius,
    transform: `translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`,
    labelX: isRoot ? 0 : p.isLeft ? -gap : gap,
    labelAnchor: isRoot ? 'middle' : p.isLeft ? 'end' : 'start',
    labelFirstDy: isRoot ? `${radius + 20}` : `${0.35 - (lineCount - 1) * 0.6}em`,
    showCount: p.node.expandable && !p.node.expanded && !!p.node.count,
    countTransform: `translate(${offset},${-offset})`,
    ariaLabel: `${p.node.badge} ${p.node.label}`.trim(),
  };
}

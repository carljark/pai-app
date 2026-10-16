import type {
  MindmapLink,
  MindmapNodeKind,
  PositionedNode,
  RenderedLink,
  RenderedNode,
} from '../models/mindmap.model';
import { wrapLabel } from './mindmap-layout';
import { nodeVisualState, type VisualContext } from './mindmap-match';
import { nodeView } from './mindmap-node-view';

/** Caracteres por línea y número de líneas de la etiqueta de cada nivel. */
const LABEL_BOX: Record<MindmapNodeKind, [number, number]> = {
  root: [20, 3],
  module: [24, 2],
  ra: [32, 2],
  group: [26, 2],
  connection: [32, 2],
};

/** Añade a cada nodo posicionado su estado visual y su etiqueta en líneas. */
export function renderNodes(nodes: PositionedNode[], ctx: VisualContext): RenderedNode[] {
  return nodes.map((p) => {
    const [chars, maxLines] = LABEL_BOX[p.node.kind];
    const state = nodeVisualState(p.node, ctx);
    const lines = wrapLabel(p.node.label, chars, maxLines);
    return { ...p, state, lines, view: nodeView(p, state, lines.length) };
  });
}

/** Los trazos hacia nodos apagados o atenuados se pintan también atenuados. */
export function renderLinks(links: MindmapLink[], nodes: RenderedNode[]): RenderedLink[] {
  const faded = new Set(nodes.filter((n) => n.state.muted || n.state.dimmed).map((n) => n.node.id));
  return links.map((link) => ({ ...link, faded: faded.has(link.targetId) }));
}

/** Nodo en el que se centra la cámara: el más profundo de la rama abierta. */
export function focusNodeId(path: VisualContext['path']): string {
  if (path.groupCode) return `g:${path.raId}:${path.groupCode}`;
  if (path.raId) return `r:${path.raId}`;
  if (path.moduleCode) return `m:${path.moduleCode}`;
  return 'root';
}

import { hierarchy, tree, type HierarchyPointLink, type HierarchyPointNode } from 'd3-hierarchy';
import { linkRadial } from 'd3-shape';
import type { MindmapLink, MindmapNode, PositionedNode } from '../models/mindmap.model';

/** Radio del anillo de módulos y separación entre los anillos siguientes. */
export const FIRST_RING = 210;
export const RING_GAP = 190;
/** Margen alrededor del último anillo para que quepan las etiquetas al encuadrar. */
const LABEL_MARGIN = 170;

export interface MindmapLayout {
  nodes: PositionedNode[];
  links: MindmapLink[];
  radius: number;
}

export interface ViewTransform {
  x: number;
  y: number;
  k: number;
}

type PointNode = HierarchyPointNode<MindmapNode>;

/** Distancia al centro de los nodos de cada nivel. */
export function ringRadius(depth: number): number {
  return depth === 0 ? 0 : FIRST_RING + (depth - 1) * RING_GAP;
}

/** Coordenadas con el ángulo 0 arriba y en sentido horario (convención de d3). */
export function polar(angle: number, radius: number): [number, number] {
  return [radius * Math.sin(angle), -radius * Math.cos(angle)];
}

/** Árbol radial: posiciones de los nodos y trazos curvos entre padres e hijos. */
export function layoutMindmap(root: MindmapNode): MindmapLayout {
  const laid = tree<MindmapNode>()
    .size([2 * Math.PI, 1])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(a.depth, 1))(
    hierarchy(root, (n) => n.children),
  );
  return {
    nodes: laid.descendants().map(toPositioned),
    links: laid.links().map(toLink),
    radius: ringRadius(laid.height),
  };
}

function toPositioned(p: PointNode): PositionedNode {
  const [x, y] = polar(p.x, ringRadius(p.depth));
  return { node: p.data, x, y, depth: p.depth, isLeft: x < -1 };
}

const radialPath = linkRadial<HierarchyPointLink<MindmapNode>, PointNode>()
  .angle((d) => d.x)
  .radius((d) => ringRadius(d.depth));

function toLink(link: HierarchyPointLink<MindmapNode>): MindmapLink {
  return {
    id: link.target.data.id,
    path: radialPath(link) ?? '',
    color: link.target.data.color,
    targetId: link.target.data.id,
  };
}

/**
 * Arco de la conexión seleccionada hasta el módulo de destino, curvado hacia el centro.
 * Devuelve `null` si alguno de los dos extremos no está en el mapa.
 */
export function connectionArc(
  nodes: PositionedNode[],
  connectionId: string,
  targetModuleCode: string,
): string | null {
  const from = nodes.find((n) => n.node.id === connectionId);
  const to = nodes.find((n) => n.node.id === `m:${targetModuleCode}`);
  if (!from || !to) return null;
  const cx = ((from.x + to.x) / 2) * 0.35;
  const cy = ((from.y + to.y) / 2) * 0.35;
  return `M${round(from.x)},${round(from.y)}Q${round(cx)},${round(cy)} ${round(to.x)},${round(to.y)}`;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Transformación que muestra el mapa completo centrado en un lienzo de `width` × `height`. */
export function fitTransform(radius: number, width: number, height: number): ViewTransform {
  const k = Math.min(width, height) / (2 * (radius + LABEL_MARGIN));
  return { x: width / 2, y: height / 2, k: Math.min(Math.max(k, 0.25), 1.2) };
}

/** Transformación que lleva el punto (x, y) del mapa al centro del lienzo con la escala `k`. */
export function focusTransform(
  x: number,
  y: number,
  k: number,
  width: number,
  height: number,
): ViewTransform {
  return { x: width / 2 - k * x, y: height / 2 - k * y, k };
}

/** Parte un texto en líneas de hasta `maxChars` por palabras; la última se recorta con «…». */
export function wrapLabel(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return truncateLines(lines, maxChars, maxLines);
}

function truncateLines(lines: string[], maxChars: number, maxLines: number): string[] {
  if (lines.length <= maxLines && lines.every((l) => l.length <= maxChars)) return lines;
  const kept = lines.slice(0, maxLines);
  const last = kept[kept.length - 1]!;
  const cut = last.length > maxChars - 1 ? last.slice(0, maxChars - 1).trimEnd() : last;
  kept[kept.length - 1] = `${cut}…`;
  return kept;
}

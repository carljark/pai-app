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

/** Distancia mínima (en el arco del anillo) entre dos nodos vecinos del mismo nivel. */
const MIN_GAP = 84;
/** Un anillo apiñado crece como mucho hasta este múltiplo de su radio base. */
const MAX_SPREAD = 2.5;

/** Árbol radial: posiciones de los nodos y trazos curvos entre padres e hijos. */
export function layoutMindmap(root: MindmapNode): MindmapLayout {
  const laid = tree<MindmapNode>()
    .size([2 * Math.PI, 1])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(a.depth, 1))(
    hierarchy(root, (n) => n.children),
  );
  const radii = ringRadii(laid.descendants(), laid.height);
  const radius = (depth: number) => radii[depth]!;
  const path = linkRadial<HierarchyPointLink<MindmapNode>, PointNode>()
    .angle((d) => d.x)
    .radius((d) => radius(d.depth));
  return {
    nodes: laid.descendants().map((p) => toPositioned(p, radius(p.depth))),
    links: laid.links().map((link) => toLink(link, path(link) ?? '')),
    radius: radius(laid.height),
  };
}

/**
 * Radio de cada nivel: el base (`ringRadius`) o mayor si sus nodos quedan a menos de `MIN_GAP`,
 * siempre al menos `RING_GAP` más allá del nivel anterior.
 */
export function ringRadii(nodes: PointNode[], height: number): number[] {
  const angles = anglesByDepth(nodes);
  const radii = [0];
  for (let depth = 1; depth <= height; depth++) {
    const base = ringRadius(depth);
    const gap = minAngularGap(angles.get(depth) ?? []);
    const needed = gap > 0 ? Math.min(MIN_GAP / gap, base * MAX_SPREAD) : base;
    const previous = radii[depth - 1]!;
    radii.push(Math.max(base, needed, previous + (depth === 1 ? FIRST_RING : RING_GAP)));
  }
  return radii;
}

function anglesByDepth(nodes: PointNode[]): Map<number, number[]> {
  const byDepth = new Map<number, number[]>();
  for (const n of nodes.filter((p) => p.depth > 0)) {
    byDepth.set(n.depth, [...(byDepth.get(n.depth) ?? []), n.x]);
  }
  return byDepth;
}

/** Menor separación angular entre nodos consecutivos, contando la vuelta completa. */
function minAngularGap(angles: number[]): number {
  if (angles.length < 2) return 0;
  const sorted = [...angles].sort((a, b) => a - b);
  const gaps = sorted.slice(1).map((a, i) => a - sorted[i]!);
  gaps.push(2 * Math.PI - sorted[sorted.length - 1]! + sorted[0]!);
  return Math.min(...gaps);
}

function toPositioned(p: PointNode, radius: number): PositionedNode {
  const [x, y] = polar(p.x, radius);
  return { node: p.data, x, y, depth: p.depth, isLeft: x < -1 };
}

function toLink(link: HierarchyPointLink<MindmapNode>, path: string): MindmapLink {
  return {
    id: link.target.data.id,
    path,
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

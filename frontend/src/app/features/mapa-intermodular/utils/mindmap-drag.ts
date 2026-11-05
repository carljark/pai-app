import { drag, type D3DragEvent } from 'd3-drag';
import { select } from 'd3-selection';
import type { MindmapDropTarget, MindmapNode, RenderedNode } from '../models/mindmap.model';

/** Distancia mínima (px) para que un gesto sea arrastre y no clic. */
export const MIN_DRAG_PX = 5;

/** Atributo de cada nodo del lienzo con su id, para localizarlo desde el evento. */
export const NODE_ID_ATTR = 'data-node-id';

/** Bola que se puede arrastrar: la materia o el módulo que representa y su aspecto. */
export interface DragSubject {
  unit: string;
  color: string;
  badge: string;
}

export interface DragOptions {
  /** Bola bajo el evento, o `null` si no se puede arrastrar (el gesto mueve el mapa). */
  subject(target: EventTarget | null): DragSubject | null;
  target(): MindmapDropTarget | null;
  drop(unit: string): void;
}

type PointerLike = MouseEvent | TouchEvent;
type MindmapDragEvent = D3DragEvent<SVGSVGElement, unknown, DragSubject>;

/** Materia o módulo que representa un nodo: el del propio nodo o el del grupo de destino. */
export function dragUnit(node: MindmapNode): string | null {
  if (node.kind === 'module') return node.moduleCode ?? null;
  if (node.kind === 'group') return node.targetModuleCode ?? null;
  return null;
}

/** Bola arrastrable bajo el elemento del evento, o `null` si no la hay. */
export function subjectFor(nodes: RenderedNode[], target: EventTarget | null): DragSubject | null {
  const id = nodeIdOf(target);
  const node = id ? nodes.find((n) => n.node.id === id)?.node : undefined;
  const unit = node ? dragUnit(node) : null;
  return node && unit ? { unit, color: node.color, badge: node.badge } : null;
}

/** Id del nodo del lienzo que contiene el elemento del evento. */
export function nodeIdOf(target: EventTarget | null): string | null {
  const el = target instanceof Element ? target.closest(`[${NODE_ID_ATTR}]`) : null;
  return el?.getAttribute(NODE_ID_ATTR) ?? null;
}

/** Punto del evento en coordenadas de la ventana (ratón o primer dedo). */
export function clientPoint(event: PointerLike): [number, number] {
  if ('changedTouches' in event) {
    const touch = event.changedTouches[0];
    return touch ? [touch.clientX, touch.clientY] : [0, 0];
  }
  return [event.clientX, event.clientY];
}

/**
 * Enlaza `d3-drag` al `<svg>` del mapa mental: las bolas arrastrables se pueden llevar hasta el
 * destino (la cesta); el resto del lienzo sigue moviéndose con d3-zoom. Se debe enlazar antes que
 * el zoom, para que el arrastre de una bola no desplace también el mapa.
 */
export function attachDrag(svg: SVGSVGElement, options: DragOptions): () => void {
  let start: [number, number] = [0, 0];
  let moved = false;
  const behavior = drag<SVGSVGElement, unknown, DragSubject>()
    .clickDistance(MIN_DRAG_PX)
    // Sin sujeto (`null`), d3-drag no inicia el gesto y lo deja pasar al zoom.
    .subject(
      (event: MindmapDragEvent) =>
        options.subject(event.sourceEvent?.target ?? null) as DragSubject,
    )
    .on('start', (event: MindmapDragEvent) => {
      start = clientPoint(event.sourceEvent as PointerLike);
      moved = false;
    })
    .on('drag', (event: MindmapDragEvent) => {
      const [x, y] = clientPoint(event.sourceEvent as PointerLike);
      moved ||= Math.hypot(x - start[0], y - start[1]) >= MIN_DRAG_PX;
      if (moved)
        options.target()?.track({ x, y, color: event.subject.color, badge: event.subject.badge });
    })
    .on('end', (event: MindmapDragEvent) => finish(event, moved, options));
  select(svg).call(behavior);
  return () => void select(svg).on('.drag', null);
}

function finish(event: MindmapDragEvent, moved: boolean, options: DragOptions): void {
  const target = options.target();
  target?.track(null);
  if (!moved || !target) return;
  const [x, y] = clientPoint(event.sourceEvent as PointerLike);
  if (target.contains(x, y)) options.drop(event.subject.unit);
}

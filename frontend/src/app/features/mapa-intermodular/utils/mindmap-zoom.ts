import { select, type Selection } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type D3ZoomEvent } from 'd3-zoom';
import { attachDrag, type DragOptions } from './mindmap-drag';
import type { ViewTransform } from './mindmap-layout';

/** Duración de las animaciones de encuadre (ms). */
const ANIMATION_MS = 550;

/** Tamaño por defecto si el lienzo aún no tiene dimensiones (por ejemplo, en jsdom). */
const FALLBACK_SIZE = { width: 800, height: 600 };

export interface CanvasSize {
  width: number;
  height: number;
}

export interface ZoomController {
  /** Lleva el lienzo a la transformación indicada, con animación si se pide. */
  apply(transform: ViewTransform, animate: boolean): void;
  /** Escala actual del lienzo. */
  scale(): number;
  size(): CanvasSize;
  destroy(): void;
}

export function canvasSize(svg: SVGSVGElement): CanvasSize {
  const { clientWidth: width, clientHeight: height } = svg;
  return width && height ? { width, height } : FALLBACK_SIZE;
}

/** Elemento sobre el que empieza un gesto que no debe mover el mapa (una bola arrastrable). */
export type DraggablePredicate = (target: EventTarget | null) => boolean;

/** Filtro por defecto de d3-zoom, salvo los gestos que empiezan sobre una bola arrastrable. */
export function zoomFilter(isDraggable: DraggablePredicate) {
  return (event: MouseEvent | WheelEvent | TouchEvent): boolean => {
    const base = (!event.ctrlKey || event.type === 'wheel') && !(event as MouseEvent).button;
    return base && (event.type === 'wheel' || !isDraggable(event.target));
  };
}

function createBehavior(
  svg: SVGSVGElement,
  onZoom: (transform: ViewTransform) => void,
  isDraggable: DraggablePredicate,
) {
  return zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 3])
    .filter(zoomFilter(isDraggable))
    .extent((): [[number, number], [number, number]] => {
      const { width, height } = canvasSize(svg);
      return [
        [0, 0],
        [width, height],
      ];
    })
    .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
      const { x, y, k } = event.transform;
      onZoom({ x, y, k });
    });
}

type ZoomBehaviorOf = ReturnType<typeof createBehavior>;

function applyTransform(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  behavior: ZoomBehaviorOf,
  t: ViewTransform,
  animate: boolean,
): void {
  const target = zoomIdentity.translate(t.x, t.y).scale(t.k);
  if (animate) selection.transition().duration(ANIMATION_MS).call(behavior.transform, target);
  else behavior.transform(selection, target);
}

/**
 * Enlaza `d3-zoom` (rueda, arrastre y pellizco) al `<svg>`. d3 solo calcula la transformación:
 * la plantilla la aplica a través de `onChange`, que actualiza un signal. Con `drag`, las bolas
 * arrastrables se llevan a la cesta en vez de mover el mapa; el arrastre se enlaza antes que el
 * zoom para que d3-drag detenga el gesto antes de que lo vea d3-zoom.
 */
export function attachZoom(
  svg: SVGSVGElement,
  onChange: (transform: ViewTransform) => void,
  drag?: DragOptions,
): ZoomController {
  let current: ViewTransform = { x: 0, y: 0, k: 1 };
  const detachDrag = drag ? attachDrag(svg, drag) : null;
  const onZoom = (t: ViewTransform) => {
    current = t;
    onChange(t);
  };
  const behavior = createBehavior(svg, onZoom, (t) => !!drag?.subject(t));
  const selection = select(svg).call(behavior).on('dblclick.zoom', null);
  return {
    apply: (t, animate) => applyTransform(selection, behavior, t, animate),
    scale: () => current.k,
    size: () => canvasSize(svg),
    destroy: () => {
      detachDrag?.();
      selection.on('.zoom', null);
    },
  };
}

import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type D3ZoomEvent } from 'd3-zoom';
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

function createBehavior(svg: SVGSVGElement, onZoom: (transform: ViewTransform) => void) {
  return zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.2, 3])
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

/**
 * Enlaza `d3-zoom` (rueda, arrastre y pellizco) al `<svg>`. d3 solo calcula la transformación:
 * la plantilla la aplica a través de `onChange`, que actualiza un signal.
 */
export function attachZoom(
  svg: SVGSVGElement,
  onChange: (transform: ViewTransform) => void,
): ZoomController {
  let current: ViewTransform = { x: 0, y: 0, k: 1 };
  const behavior = createBehavior(svg, (t) => {
    current = t;
    onChange(t);
  });
  const selection = select(svg).call(behavior).on('dblclick.zoom', null);
  return {
    apply: (t, animate) => {
      const target = zoomIdentity.translate(t.x, t.y).scale(t.k);
      if (animate) selection.transition().duration(ANIMATION_MS).call(behavior.transform, target);
      else behavior.transform(selection, target);
    },
    scale: () => current.k,
    size: () => canvasSize(svg),
    destroy: () => void selection.on('.zoom', null),
  };
}

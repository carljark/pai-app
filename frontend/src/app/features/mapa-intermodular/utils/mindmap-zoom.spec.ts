import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachZoom, canvasSize } from './mindmap-zoom';

function makeSvg(width = 0, height = 0): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.defineProperty(svg, 'clientWidth', { value: width });
  Object.defineProperty(svg, 'clientHeight', { value: height });
  document.body.appendChild(svg);
  return svg;
}

describe('mindmap-zoom', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('usa el tamaño del lienzo o uno por defecto si aún no tiene', () => {
    expect(canvasSize(makeSvg(1000, 700))).toEqual({ width: 1000, height: 700 });
    expect(canvasSize(makeSvg())).toEqual({ width: 800, height: 600 });
  });

  it('aplica una transformación al instante y avisa del cambio', () => {
    const onChange = vi.fn();
    const zoom = attachZoom(makeSvg(1000, 700), onChange);
    zoom.apply({ x: 10, y: 20, k: 1.5 }, false);
    expect(onChange).toHaveBeenLastCalledWith({ x: 10, y: 20, k: 1.5 });
    expect(zoom.scale()).toBe(1.5);
    expect(zoom.size()).toEqual({ width: 1000, height: 700 });
    zoom.destroy();
  });

  it('anima la transformación hasta alcanzar el destino', async () => {
    const onChange = vi.fn();
    const zoom = attachZoom(makeSvg(), onChange);
    zoom.apply({ x: 100, y: 50, k: 2 }, true);
    await vi.waitFor(() => expect(zoom.scale()).toBeCloseTo(2), { timeout: 2000 });
    expect(onChange).toHaveBeenCalled();
  });
});

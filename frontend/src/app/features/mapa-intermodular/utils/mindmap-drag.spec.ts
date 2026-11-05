import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MindmapNode, RenderedNode } from '../models/mindmap.model';
import { attachDrag, clientPoint, dragUnit, nodeIdOf, subjectFor } from './mindmap-drag';

const SVG_NS = 'http://www.w3.org/2000/svg';

const node = (parcial: Partial<MindmapNode>): MindmapNode => ({
  id: 'x',
  kind: 'module',
  badge: 'MAT',
  label: 'Matemáticas',
  color: '#123456',
  expandable: true,
  expanded: false,
  searchText: '',
  relationTypes: [],
  children: [],
  ...parcial,
});
const rendered = (n: MindmapNode) => ({ node: n }) as RenderedNode;

function makeSvg(): { svg: SVGSVGElement; bola: SVGGElement; fondo: SVGRectElement } {
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  const bola = document.createElementNS(SVG_NS, 'g') as SVGGElement;
  bola.setAttribute('data-node-id', 'm:MAT');
  bola.appendChild(document.createElementNS(SVG_NS, 'circle'));
  const fondo = document.createElementNS(SVG_NS, 'rect') as SVGRectElement;
  svg.append(bola, fondo);
  document.body.appendChild(svg);
  return { svg, bola, fondo };
}

/** d3-drag escucha el movimiento en `event.view`; jsdom no deja pasarla en el constructor. */
function mouse(type: string, x: number, target: EventTarget = document.defaultView!): void {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: 0 });
  Object.defineProperty(event, 'view', { value: document.defaultView });
  target.dispatchEvent(event);
}

function setup(dentro: boolean) {
  const target = { contains: vi.fn(() => dentro), track: vi.fn() };
  const drop = vi.fn();
  const { svg, bola, fondo } = makeSvg();
  const detach = attachDrag(svg, {
    subject: (t) =>
      nodeIdOf(t) === 'm:MAT' ? { unit: 'MAT', color: '#123456', badge: 'MAT' } : null,
    target: () => target,
    drop,
  });
  return { target, drop, bola, fondo, detach };
}

describe('mindmap-drag', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('solo se arrastran materias y módulos (y los grupos de destino)', () => {
    expect(dragUnit(node({ kind: 'module', moduleCode: 'MAT' }))).toBe('MAT');
    expect(dragUnit(node({ kind: 'group', targetModuleCode: 'TEC' }))).toBe('TEC');
    expect(dragUnit(node({ kind: 'module' }))).toBeNull();
    expect(dragUnit(node({ kind: 'group' }))).toBeNull();
    expect(dragUnit(node({ kind: 'connection', moduleCode: 'MAT' }))).toBeNull();
    expect(dragUnit(node({ kind: 'root' }))).toBeNull();
  });

  it('localiza el nodo y la bola bajo el evento', () => {
    const { bola, fondo } = makeSvg();
    const nodos = [rendered(node({ id: 'm:MAT', moduleCode: 'MAT' }))];
    expect(nodeIdOf(bola.firstChild)).toBe('m:MAT');
    expect(nodeIdOf(fondo)).toBeNull();
    expect(nodeIdOf(null)).toBeNull();
    expect(subjectFor(nodos, bola.firstChild)).toEqual({
      unit: 'MAT',
      color: '#123456',
      badge: 'MAT',
    });
    expect(subjectFor(nodos, fondo)).toBeNull();
    expect(subjectFor([rendered(node({ id: 'm:MAT', kind: 'ra' }))], bola)).toBeNull();
  });

  it('lee el punto del ratón o del primer dedo', () => {
    expect(clientPoint(new MouseEvent('mousemove', { clientX: 3, clientY: 4 }))).toEqual([3, 4]);
    const touch = { changedTouches: [{ clientX: 7, clientY: 8 }] } as unknown as TouchEvent;
    expect(clientPoint(touch)).toEqual([7, 8]);
    expect(clientPoint({ changedTouches: [] } as unknown as TouchEvent)).toEqual([0, 0]);
  });

  it('arrastrar una bola y soltarla en la cesta la entrega', () => {
    const { target, drop, bola } = setup(true);
    mouse('mousedown', 10, bola.firstChild!);
    mouse('mousemove', 12);
    expect(target.track).not.toHaveBeenCalled();
    mouse('mousemove', 40);
    expect(target.track).toHaveBeenCalledWith({ x: 40, y: 0, color: '#123456', badge: 'MAT' });
    mouse('mouseup', 40);
    expect(target.track).toHaveBeenLastCalledWith(null);
    expect(drop).toHaveBeenCalledWith('MAT');
  });

  it('soltar fuera de la cesta no entrega nada', () => {
    const { drop, bola } = setup(false);
    mouse('mousedown', 10, bola);
    mouse('mousemove', 40);
    mouse('mouseup', 40);
    expect(drop).not.toHaveBeenCalled();
  });

  it('un clic sin moverse no entrega nada', () => {
    const { target, drop, bola } = setup(true);
    mouse('mousedown', 10, bola);
    mouse('mouseup', 11);
    expect(drop).not.toHaveBeenCalled();
    expect(target.track).toHaveBeenCalledWith(null);
  });

  it('el fondo no inicia arrastre y se puede desenganchar', () => {
    const { target, drop, fondo, bola, detach } = setup(true);
    mouse('mousedown', 10, fondo);
    mouse('mousemove', 40);
    mouse('mouseup', 40);
    expect(target.track).not.toHaveBeenCalled();
    detach();
    mouse('mousedown', 10, bola);
    mouse('mousemove', 40);
    mouse('mouseup', 40);
    expect(drop).not.toHaveBeenCalled();
  });
});

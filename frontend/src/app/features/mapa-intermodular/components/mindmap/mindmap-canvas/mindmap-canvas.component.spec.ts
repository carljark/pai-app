import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import type { MindmapPath } from '../../../models/mindmap.model';
import { layoutMindmap } from '../../../utils/mindmap-layout';
import { focusNodeId, renderLinks, renderNodes } from '../../../utils/mindmap-render';
import { EMPTY_PATH, buildMindmapTree } from '../../../utils/mindmap-tree';
import { MindmapCanvasComponent } from './mindmap-canvas.component';

const OPEN: MindmapPath = {
  moduleCode: '0001',
  raId: '0001_RA1',
  groupCode: '0002',
  connectionIndex: 0,
};

function setPath(fixture: ComponentFixture<MindmapCanvasComponent>, path: MindmapPath) {
  const tree = buildMindmapTree({
    modules: mindmapModules(),
    path,
    isCa: false,
    rootBadge: 'CFGS',
    rootLabel: 'Laboratorio',
  });
  const laid = layoutMindmap(tree);
  const nodes = renderNodes(laid.nodes, {
    query: 'muestras',
    moduleType: 'all',
    relationType: 'all',
    path,
  });
  fixture.componentRef.setInput('nodes', nodes);
  fixture.componentRef.setInput('links', renderLinks(laid.links, nodes));
  fixture.componentRef.setInput('radius', laid.radius);
  fixture.componentRef.setInput('focusId', focusNodeId(tree));
  fixture.componentRef.setInput('arcs', path.connectionIndex === null ? [] : ['M0,0Q1,1 2,2']);
}

describe('MindmapCanvasComponent', () => {
  let fixture: ComponentFixture<MindmapCanvasComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MindmapCanvasComponent] }).compileComponents();
    fixture = TestBed.createComponent(MindmapCanvasComponent);
    fixture.componentRef.setInput('isCa', false);
    setPath(fixture, EMPTY_PATH);
    fixture.detectChanges();
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  const nodeEl = (label: string) =>
    el.querySelector(`[aria-label^="${label}"]`) as SVGGElement | null;

  it('pinta el centro, los módulos y sus trazos', () => {
    expect(el.querySelectorAll('.mindmap-canvas__node')).toHaveLength(3);
    expect(el.querySelectorAll('.mindmap-canvas__link')).toHaveLength(2);
    expect(el.querySelector('.mindmap-canvas__node--root')?.textContent).toContain('CFGS');
    expect(nodeEl('0001')?.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('.mindmap-canvas__arc')).toBeNull();
  });

  it('muestra la burbuja con el número de hijos en los nodos plegados', () => {
    expect(nodeEl('0001')?.querySelector('.mindmap-canvas__count-text')?.textContent).toContain(
      '3',
    );
  });

  it('coloca las etiquetas hacia fuera del círculo', () => {
    const anchors = [...el.querySelectorAll('.mindmap-canvas__label')].map((t) =>
      t.getAttribute('text-anchor'),
    );
    expect(anchors[0]).toBe('middle');
    expect(anchors.slice(1).sort()).toEqual(['end', 'start']);
  });

  it('avisa al pulsar un nodo con el ratón o el teclado', () => {
    const activate = vi.fn();
    fixture.componentInstance.nodeActivate.subscribe(activate);
    const module = nodeEl('0001')!;
    module.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    module.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    module.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(activate).toHaveBeenCalledTimes(3);
    expect(activate.mock.calls[0]![0].id).toBe('m:0001');
  });

  it('pinta la rama abierta con estados, resaltado y arco', async () => {
    setPath(fixture, OPEN);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(nodeEl('0001')?.classList).toContain('mindmap-canvas__node--expanded');
    expect(nodeEl('0002')?.classList).toContain('mindmap-canvas__node--muted');
    expect(el.querySelector('.mindmap-canvas__node--match')).not.toBeNull();
    expect(el.querySelector('.mindmap-canvas__node--dimmed')).not.toBeNull();
    expect(el.querySelector('.mindmap-canvas__link--faded')).not.toBeNull();
    expect(el.querySelector('.mindmap-canvas__arc')?.getAttribute('d')).toBe('M0,0Q1,1 2,2');
    const connection = el.querySelector('.mindmap-canvas__node--connection')!;
    expect(connection.getAttribute('aria-pressed')).toBe('true');
  });

  it('centra la cámara en la rama abierta y vuelve a encuadrar', async () => {
    const before = fixture.componentInstance.transform();
    setPath(fixture, { ...EMPTY_PATH, moduleCode: '0001' });
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.transform()).not.toEqual(before), {
      timeout: 2000,
    });
    (el.querySelector('.mindmap-controls__button--wide') as HTMLButtonElement).click();
    await vi.waitFor(() => expect(fixture.componentInstance.transform().x).toBeCloseTo(400), {
      timeout: 2000,
    });
  });

  it('acerca y aleja con los botones', async () => {
    const [plus, minus] = el.querySelectorAll(
      '.mindmap-controls__button',
    ) as NodeListOf<HTMLButtonElement>;
    const k = fixture.componentInstance.transform().k;
    plus!.click();
    await vi.waitFor(() => expect(fixture.componentInstance.transform().k).toBeCloseTo(k * 1.25), {
      timeout: 2000,
    });
    minus!.click();
    await vi.waitFor(() => expect(fixture.componentInstance.transform().k).toBeCloseTo(k), {
      timeout: 2000,
    });
  });

  it('se traduce al catalán', () => {
    fixture.componentRef.setInput('isCa', true);
    fixture.detectChanges();
    expect(el.textContent).toContain('Reenquadrar');
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain('arrossega');
  });

  it('no hace nada con el zoom antes de enlazarlo', () => {
    const fresh = TestBed.createComponent(MindmapCanvasComponent);
    expect(() => {
      fresh.componentInstance.fit();
      fresh.componentInstance.zoomBy(2);
    }).not.toThrow();
  });
});

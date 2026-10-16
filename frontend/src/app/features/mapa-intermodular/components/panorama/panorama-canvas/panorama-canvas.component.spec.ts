import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import type { PanoramaFocus } from '../../../models/panorama.model';
import { renderEdges, renderLeaves } from '../../../utils/panorama-highlight';
import { layoutPanorama } from '../../../utils/panorama-layout';
import { PanoramaCanvasComponent } from './panorama-canvas.component';

const ALL = { query: '', moduleType: 'all', relationType: 'all' };
const layout = layoutPanorama(mindmapModules(), false);

function setFocus(fixture: ComponentFixture<PanoramaCanvasComponent>, focus: PanoramaFocus) {
  const edges = renderEdges(layout.edges, layout.leaves, focus, ALL);
  fixture.componentRef.setInput('edges', edges);
  fixture.componentRef.setInput('leaves', renderLeaves(layout.leaves, edges, focus, ALL));
  fixture.componentRef.setInput('focus', focus);
  fixture.detectChanges();
}

describe('PanoramaCanvasComponent', () => {
  let fixture: ComponentFixture<PanoramaCanvasComponent>;
  let el: HTMLElement;
  let focusChange: any;
  let leafActivate: any;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PanoramaCanvasComponent);
    fixture.componentRef.setInput('arcs', layout.arcs);
    fixture.componentRef.setInput('radius', layout.radius);
    fixture.componentRef.setInput('isCa', false);
    setFocus(fixture, null);
    await fixture.whenStable();
    el = fixture.nativeElement;
    focusChange = vi.fn();
    leafActivate = vi.fn();
    fixture.componentInstance.focusChange.subscribe(focusChange);
    fixture.componentInstance.leafActivate.subscribe(leafActivate);
  });

  const leaf = (id: string) =>
    el.querySelectorAll('.panorama-canvas__leaf')[layout.leaves.findIndex((l) => l.id === id)]!;

  it('pinta arcos de módulo, curvas y RA', () => {
    expect(el.querySelectorAll('.panorama-canvas__arc')).toHaveLength(2);
    expect(el.querySelector('.panorama-canvas__arc-label')?.textContent).toContain('0001');
    expect(el.querySelectorAll('.panorama-canvas__edge--normal')).toHaveLength(2);
    expect(el.querySelectorAll('.panorama-canvas__leaf')).toHaveLength(4);
    expect(leaf('0001_RA1').getAttribute('aria-label')).toBe('0001 RA1: Resultado RA1 de 0001');
    expect(
      el.querySelector('.panorama-canvas__leaf--flipped text')?.getAttribute('transform'),
    ).toBe('rotate(180)');
  });

  it('resalta al pasar el ratón o dar el foco y lo quita al salir', () => {
    const target = leaf('0001_RA1');
    target.dispatchEvent(new MouseEvent('mouseenter'));
    target.dispatchEvent(new FocusEvent('focus'));
    target.dispatchEvent(new MouseEvent('mouseleave'));
    target.dispatchEvent(new FocusEvent('blur'));
    const module = el.querySelector('.panorama-canvas__module')!;
    module.dispatchEvent(new MouseEvent('mouseenter'));
    module.dispatchEvent(new MouseEvent('mouseleave'));
    expect(focusChange.mock.calls.map((c: unknown[]) => c[0])).toEqual([
      { kind: 'ra', id: '0001_RA1' },
      { kind: 'ra', id: '0001_RA1' },
      null,
      null,
      { kind: 'module', code: '0001' },
      null,
    ]);
  });

  it('marca el estado de RA, curvas y módulo resaltados', () => {
    setFocus(fixture, { kind: 'module', code: '0001' });
    expect(el.querySelectorAll('.panorama-canvas__edge--out')).toHaveLength(2);
    expect(el.querySelector('.panorama-canvas__module--active')).not.toBeNull();
    expect(leaf('0002_RA1').classList).toContain('panorama-canvas__leaf--linked');
  });

  it('con ratón o teclado abre el RA', () => {
    const target = leaf('0002_RA1');
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(leafActivate).toHaveBeenCalledTimes(3);
    expect(leafActivate.mock.calls[0]![0].id).toBe('0002_RA1');
  });

  it('con el dedo, el primer toque resalta y el segundo abre', () => {
    const target = leaf('0002_RA1');
    const touch = new Event('pointerdown') as PointerEvent;
    Object.defineProperty(touch, 'pointerType', { value: 'touch' });
    target.dispatchEvent(touch);
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(focusChange).toHaveBeenCalledWith({ kind: 'ra', id: '0002_RA1' });
    expect(leafActivate).not.toHaveBeenCalled();
    setFocus(fixture, { kind: 'ra', id: '0002_RA1' });
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(leafActivate).toHaveBeenCalled();
  });

  it('acerca, aleja y reencuadra con los botones', async () => {
    const [plus, minus, fit] = el.querySelectorAll(
      '.mindmap-controls__button',
    ) as NodeListOf<HTMLButtonElement>;
    const k = fixture.componentInstance.transform().k;
    plus!.click();
    await vi.waitFor(() => expect(fixture.componentInstance.transform().k).toBeCloseTo(k * 1.25), {
      timeout: 2000,
    });
    minus!.click();
    fit!.click();
    await vi.waitFor(() => expect(fixture.componentInstance.transform().k).toBeCloseTo(k), {
      timeout: 2000,
    });
  });

  it('se traduce al catalán y no falla antes de enlazar el zoom', () => {
    fixture.componentRef.setInput('isCa', true);
    fixture.detectChanges();
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toContain('Panoràmica');
    const fresh = TestBed.createComponent(PanoramaCanvasComponent).componentInstance;
    expect(() => {
      fresh.fit();
      fresh.zoomBy(2);
    }).not.toThrow();
  });
});

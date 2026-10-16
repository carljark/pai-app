import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { buildLegend } from '../../../utils/relation-labels';
import { MindmapLegendComponent } from './mindmap-legend.component';

describe('MindmapLegendComponent', () => {
  function render(isCa = false, active = 'all') {
    const fixture = TestBed.createComponent(MindmapLegendComponent);
    fixture.componentRef.setInput('items', buildLegend(['tecnica', 'digital'], active, isCa));
    fixture.componentRef.setInput('isCa', isCa);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra los tipos presentes en orden y avisa al pulsar', () => {
    const fixture = render(false, 'digital');
    const toggled = vi.fn();
    fixture.componentInstance.toggled.subscribe(toggled);
    const items = fixture.nativeElement.querySelectorAll('.mindmap-legend__item');
    expect([...items].map((i: Element) => i.textContent?.trim())).toEqual([
      'Digital / Redes',
      'Técnica Práctica',
    ]);
    expect(items[0].getAttribute('aria-pressed')).toBe('true');
    (items[1] as HTMLButtonElement).click();
    expect(toggled).toHaveBeenCalledWith('tecnica');
  });

  it('se traduce al catalán y no pinta nada sin tipos', () => {
    const fixture = render(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.mindmap-legend')?.getAttribute('aria-label')).toContain(
      'competència',
    );
    expect(el.textContent).toContain('Tècnica Pràctica');
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(el.querySelector('.mindmap-legend')).toBeNull();
  });
});

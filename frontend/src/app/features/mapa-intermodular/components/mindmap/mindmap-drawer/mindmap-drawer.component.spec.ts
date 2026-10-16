import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { MindmapDrawerComponent } from './mindmap-drawer.component';

describe('MindmapDrawerComponent', () => {
  function render(isCa: boolean) {
    const fixture = TestBed.createComponent(MindmapDrawerComponent);
    fixture.componentRef.setInput('eyebrow', 'Ficha de afinidad');
    fixture.componentRef.setInput('from', 'Matemáticas');
    fixture.componentRef.setInput('to', 'Tecnología');
    fixture.componentRef.setInput('isCa', isCa);
    fixture.detectChanges();
    return fixture;
  }

  it('muestra el recorrido y avisa al cerrar', () => {
    const fixture = render(false);
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('aside')?.getAttribute('aria-label')).toBe('Ficha de afinidad');
    expect(el.querySelector('.mindmap-drawer__path')?.textContent).toMatch(
      /Matemáticas\s*→\s*Tecnología/,
    );
    const close = el.querySelector('.mindmap-drawer__close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Cerrar');
    close.click();
    expect(closed).toHaveBeenCalled();
  });

  it('traduce el botón de cerrar', () => {
    const el: HTMLElement = render(true).nativeElement;
    expect(el.querySelector('.mindmap-drawer__close')?.getAttribute('title')).toBe('Tancar (Esc)');
  });
});

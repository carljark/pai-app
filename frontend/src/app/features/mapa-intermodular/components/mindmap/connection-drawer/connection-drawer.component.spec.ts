import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { loadNivelesMock } from '../../../../../testing/niveles.mock';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import { ConnectionDrawerComponent } from './connection-drawer.component';

describe('ConnectionDrawerComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  const module = mindmapModules()[0]!;
  const ra = module.learningOutcomes[0]!;
  const connection = ra.connections[0]!;

  beforeEach(async () => {
    language.set('castellano');
    await TestBed.configureTestingModule({
      imports: [ConnectionDrawerComponent],
      providers: [{ provide: LayoutService, useValue: { language } }],
    }).compileComponents();
    loadNivelesMock();
  });

  function render() {
    const fixture = TestBed.createComponent(ConnectionDrawerComponent);
    fixture.componentRef.setInput('sourceModule', module);
    fixture.componentRef.setInput('sourceRa', ra);
    fixture.componentRef.setInput('connection', connection);
    fixture.componentRef.setInput('activeTab', 'FPB');
    fixture.detectChanges();
    return fixture;
  }

  it('muestra el recorrido de la conexión y el RA de origen', () => {
    const el: HTMLElement = render().nativeElement;
    expect(el.querySelector('.mindmap-drawer__path')?.textContent).toMatch(
      /0001 · RA1\s*→\s*0002 · RA1/,
    );
    expect(el.textContent).toContain('RA de origen — Análisis clínico');
    expect(el.textContent).toContain('Resultado RA1 de 0001');
    expect(el.querySelector('app-connection-card')).not.toBeNull();
  });

  it('se traduce al catalán', () => {
    language.set('catalan');
    const el: HTMLElement = render().nativeElement;
    expect(el.textContent).toContain('RA d’origen — Anàlisi clínica');
    expect(el.textContent).toContain('Resultat RA1 de 0001');
    expect(el.querySelector('.mindmap-drawer__close')?.getAttribute('aria-label')).toBe('Tancar');
  });

  it('avisa al cerrar y al crear un proyecto', () => {
    const fixture = render();
    const closed = vi.fn();
    const created = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.componentInstance.createProject.subscribe(created);
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('.mindmap-drawer__close') as HTMLButtonElement).click();
    (el.querySelector('.mapa-btn-action') as HTMLButtonElement).click();
    expect(closed).toHaveBeenCalled();
    expect(created).toHaveBeenCalledWith(connection);
  });
});

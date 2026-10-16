import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../services/layout.service';
import { AFINIDADES_1, NIVEL_AFINIDADES } from '../../../../testing/afinidades.mock';
import { loadNivelesMock } from '../../../../testing/niveles.mock';
import { AfinidadProyectoService } from '../../services/afinidad-proyecto.service';
import { AfinidadesEsoFacade } from '../../services/afinidades-eso.facade';
import { AfinidadesMindmapViewComponent } from './afinidades-mindmap-view.component';

describe('AfinidadesMindmapViewComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  const crearProyecto = vi.fn().mockResolvedValue(undefined);
  let fixture: ComponentFixture<AfinidadesMindmapViewComponent>;
  let facade: AfinidadesEsoFacade;
  let el: HTMLElement;

  beforeEach(async () => {
    language.set('castellano');
    crearProyecto.mockClear();
    await TestBed.configureTestingModule({
      imports: [AfinidadesMindmapViewComponent, HttpClientTestingModule],
      providers: [
        { provide: LayoutService, useValue: { language } },
        { provide: AfinidadProyectoService, useValue: { crearProyecto } },
      ],
    }).compileComponents();
    loadNivelesMock([NIVEL_AFINIDADES]);
    facade = TestBed.inject(AfinidadesEsoFacade);
    facade.data.set(AFINIDADES_1);
    fixture = TestBed.createComponent(AfinidadesMindmapViewComponent);
    fixture.componentRef.setInput('tab', 'ESO_1');
    el = fixture.nativeElement;
    await render();
  });

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function click(selector: string) {
    el.querySelector(selector)!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await render();
  }

  const hint = () => el.querySelector('.afinidades-mindmap-view__hint')?.textContent;

  it('arranca con el centro de la ESO y una materia por nodo', () => {
    expect(el.querySelector('.mindmap-canvas__node--root')?.textContent).toContain('ESO');
    expect(el.querySelectorAll('.mindmap-canvas__node--module')).toHaveLength(4);
    expect(hint()).toContain('Pulsa una materia');
  });

  it('despliega materia, materia afín y ficha, y abre la ficha en el panel', async () => {
    await click('.mindmap-canvas__node--module[aria-label^="MAT"]');
    expect(hint()).toContain('materia afín');
    expect(el.querySelectorAll('.mindmap-canvas__node--group')).toHaveLength(2);
    await click('.mindmap-canvas__node--group[aria-label^="BG"]');
    expect(hint()).toContain('Pulsa una ficha');
    await click('.mindmap-canvas__node--connection[aria-label^="2 "]');
    const drawer = el.querySelector('app-mindmap-drawer')!;
    expect(drawer.querySelector('.mindmap-drawer__path')?.textContent).toMatch(
      /Matemáticas\s*→\s*Biología y Geología · Tecnología/,
    );
    expect(drawer.querySelector('app-afinidad-card')).not.toBeNull();
    expect(el.querySelectorAll('.mindmap-canvas__arc')).toHaveLength(2);
  });

  it('«Crear proyecto» usa la ficha, la materia y el curso', async () => {
    await click('.mindmap-canvas__node--module[aria-label^="BG"]');
    await click('.mindmap-canvas__node--group[aria-label^="MAT"]');
    await click('.mindmap-canvas__node--connection[aria-label^="1 "]');
    const card = el.querySelector('app-afinidad-card')!;
    (card.querySelector('button') as HTMLButtonElement).click();
    expect(crearProyecto).toHaveBeenCalledWith(AFINIDADES_1.afinidades[0], 'BYG', 'ESO_1');
  });

  it('cierra el panel con su botón o con Esc', async () => {
    await click('.mindmap-canvas__node--module[aria-label^="BG"]');
    await click('.mindmap-canvas__node--group[aria-label^="MAT"]');
    await click('.mindmap-canvas__node--connection[aria-label^="1 "]');
    await click('.mindmap-drawer__close');
    expect(el.querySelector('app-mindmap-drawer')).toBeNull();
    await click('.mindmap-canvas__node--connection[aria-label^="1 "]');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await render();
    expect(el.querySelector('app-mindmap-drawer')).toBeNull();
  });

  it('se traduce al catalán sin plegar la rama', async () => {
    await click('.mindmap-canvas__node--module[aria-label^="MAT"]');
    language.set('catalan');
    await render();
    expect(
      el.querySelector('.mindmap-canvas__node--module[aria-label^="MAT"]')?.textContent,
    ).toContain('Matemàtiques');
    expect(hint()).toContain('matèria afí');
    await click('.mindmap-canvas__node--group[aria-label^="TEC"]');
    await click('.mindmap-canvas__node--connection');
    expect(el.querySelector('app-mindmap-drawer aside')?.getAttribute('aria-label')).toBe(
      'Fitxa d’afinitat',
    );
  });

  it('sin datos no pinta el lienzo y avisa en los dos idiomas', async () => {
    facade.data.set(null);
    await render();
    expect(el.querySelector('app-mindmap-canvas')).toBeNull();
    expect(el.textContent).toContain('Este curso todavía no tiene fichas de afinidad.');
    language.set('catalan');
    await render();
    expect(el.textContent).toContain('Aquest curs encara no té fitxes d’afinitat.');
  });
});

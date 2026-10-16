import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { loadNivelesMock } from '../../../../../testing/niveles.mock';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { MindmapViewComponent } from './mindmap-view.component';

describe('MindmapViewComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  let fixture: ComponentFixture<MindmapViewComponent>;
  let facade: MapaIntermodularFacade;
  let el: HTMLElement;

  beforeEach(async () => {
    language.set('castellano');
    await TestBed.configureTestingModule({
      imports: [MindmapViewComponent, HttpClientTestingModule],
      providers: [{ provide: LayoutService, useValue: { language } }],
    }).compileComponents();
    loadNivelesMock();
    facade = TestBed.inject(MapaIntermodularFacade);
    facade.activeTab.set('FPB');
    facade.modules.set(mindmapModules());
    fixture = TestBed.createComponent(MindmapViewComponent);
    el = fixture.nativeElement;
    await render();
  });

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function click(ariaLabelStart: string) {
    const node = el.querySelector(`.mindmap-canvas__node[aria-label^="${ariaLabelStart}"]`);
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await render();
  }

  const nodeIds = () =>
    [...el.querySelectorAll('.mindmap-canvas__node')].map((n) => n.getAttribute('aria-label'));

  it('arranca con el centro del ciclo y los módulos', () => {
    expect(nodeIds()).toHaveLength(3);
    expect(el.querySelector('.mindmap-canvas__node--root')?.textContent).toContain(
      'CFGB Peluquería y',
    );
    expect(el.querySelector('.mindmap-view__hint')?.textContent).toContain('Pulsa un módulo');
    expect(el.querySelector('app-connection-drawer')).toBeNull();
  });

  it('despliega módulo, RA y grupo y abre el panel de la conexión', async () => {
    await click('0001');
    expect(nodeIds()).toContain('RA1 Resultado RA1 de 0001');
    expect(el.querySelector('.mindmap-view__hint')?.textContent).toContain('Pulsa un RA');
    await click('RA1 Resultado');
    expect(el.querySelector('.mindmap-view__hint')?.textContent).toContain('módulo de destino');
    await click('0002 Módulo 0002');
    expect(el.querySelector('.mindmap-view__hint')?.textContent).toContain('Pulsa una conexión');
    await click('RA1 Texto 0002 RA1');
    expect(el.querySelector('.mindmap-view')?.classList).toContain('mindmap-view--with-drawer');
    expect(el.querySelector('app-connection-drawer')?.textContent).toContain(
      'Justificación 0002 RA1',
    );
    expect(facade.selectedRaId()).toBe('0001_RA1');
  });

  it('dibuja el arco solo si el módulo de destino está en el mapa', async () => {
    await click('0001');
    await click('RA1 Resultado');
    await click('0002 Módulo 0002');
    await click('RA1 Texto 0002 RA1');
    expect(el.querySelector('.mindmap-canvas__arc')).not.toBeNull();
    await click('0009 Módulo 0009');
    await click('RA4 Texto 0009 RA4');
    expect(el.querySelector('app-connection-drawer')).not.toBeNull();
    expect(el.querySelector('.mindmap-canvas__arc')).toBeNull();
  });

  it('cierra el panel con su botón o con Esc', async () => {
    await click('0001');
    await click('RA1 Resultado');
    await click('0002 Módulo 0002');
    await click('RA1 Texto 0002 RA1');
    (el.querySelector('.mindmap-drawer__close') as HTMLButtonElement).click();
    await render();
    expect(el.querySelector('app-connection-drawer')).toBeNull();
    await click('RA1 Texto 0002 RA1');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await render();
    expect(el.querySelector('app-connection-drawer')).toBeNull();
  });

  it('reenvía «Crear proyecto» con la conexión elegida', async () => {
    const created = vi.fn();
    fixture.componentInstance.createProject.subscribe(created);
    await click('0001');
    await click('RA2 Resultado');
    await click('0002 Módulo 0002');
    await click('RA1 Texto 0002 RA1');
    (el.querySelector('app-connection-drawer .mapa-btn-action') as HTMLButtonElement).click();
    expect(created.mock.calls[0]![0].relationType).toBe('ciencias');
  });

  it('la leyenda filtra por tipo de competencia', async () => {
    const items = el.querySelectorAll('.mindmap-legend__item');
    expect([...items].map((i) => i.textContent?.trim())).toEqual([
      'Ciencias Aplicadas',
      'Comunicación',
      'Digital / Redes',
      'Técnica Práctica',
    ]);
    (items[2] as HTMLButtonElement).click();
    await render();
    expect(items[2]!.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('[aria-label^="0002"]')?.classList).toContain(
      'mindmap-canvas__node--dimmed',
    );
  });

  it('la búsqueda de la cabecera resalta sin ocultar', async () => {
    facade.setSearch('calidad');
    await render();
    expect(nodeIds()).toHaveLength(3);
    expect(el.querySelector('[aria-label^="0002"]')?.classList).toContain(
      'mindmap-canvas__node--match',
    );
    expect(el.querySelector('[aria-label^="0001"]')?.classList).toContain(
      'mindmap-canvas__node--dimmed',
    );
  });

  it('cambia de idioma sin perder lo desplegado', async () => {
    await click('0001');
    language.set('catalan');
    await render();
    expect(nodeIds()).toContain('RA1 Resultat RA1 de 0001');
    expect(el.querySelector('.mindmap-view__hint')?.textContent).toContain('Prem un RA');
    expect(el.querySelector('.mindmap-legend__item')?.textContent).toContain('Ciències Aplicades');
  });

  it('avisa si el mapa no tiene módulos', async () => {
    facade.modules.set([]);
    await render();
    expect(el.querySelector('app-mindmap-canvas')).toBeNull();
    expect(el.querySelector('.mindmap-legend')).toBeNull();
    expect(el.textContent).toContain('Este mapa todavía no tiene módulos.');
    language.set('catalan');
    await render();
    expect(el.textContent).toContain('Aquest mapa encara no té mòduls.');
  });

  it('sin pestaña conocida el centro no lleva sigla', async () => {
    facade.activeTab.set('DESCONOCIDA');
    await render();
    expect(fixture.componentInstance.rootBadge()).toBe('');
  });
});

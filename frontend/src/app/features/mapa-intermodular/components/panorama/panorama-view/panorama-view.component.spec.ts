import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { loadNivelesMock } from '../../../../../testing/niveles.mock';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { MapaVistaService } from '../../../services/mapa-vista.service';
import { PanoramaViewComponent } from './panorama-view.component';

describe('PanoramaViewComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  let fixture: ComponentFixture<PanoramaViewComponent>;
  let facade: MapaIntermodularFacade;
  let el: HTMLElement;

  beforeEach(async () => {
    language.set('castellano');
    await TestBed.configureTestingModule({
      imports: [PanoramaViewComponent, HttpClientTestingModule],
      providers: [{ provide: LayoutService, useValue: { language } }],
    }).compileComponents();
    loadNivelesMock();
    facade = TestBed.inject(MapaIntermodularFacade);
    facade.activeTab.set('FPB');
    facade.modules.set(mindmapModules());
    fixture = TestBed.createComponent(PanoramaViewComponent);
    el = fixture.nativeElement;
    await render();
  });

  afterEach(() => localStorage.removeItem('pai_mapa_vista'));

  async function render() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const leaves = () => [...el.querySelectorAll('.panorama-canvas__leaf')];
  const leafOf = (label: string) =>
    leaves().find((l) => l.getAttribute('aria-label')!.startsWith(label))!;

  it('muestra el círculo de RA, las curvas y los totales', () => {
    expect(leaves()).toHaveLength(4);
    expect(el.querySelectorAll('.panorama-canvas__edge')).toHaveLength(2);
    expect(el.querySelector('app-panorama-info')?.textContent).toContain('4 RA');
    expect(el.textContent).toContain('Salientes');
  });

  it('al pasar por un RA muestra su ficha y resalta sus conexiones', async () => {
    leafOf('0002 RA1').dispatchEvent(new MouseEvent('mouseenter'));
    await render();
    expect(el.querySelector('app-panorama-info')?.textContent).toContain('Resultado RA1 de 0002');
    expect(el.querySelectorAll('.panorama-canvas__edge--in')).toHaveLength(2);
  });

  it('al pasar por un módulo muestra sus totales', async () => {
    el.querySelector('.panorama-canvas__module')!.dispatchEvent(new MouseEvent('mouseenter'));
    await render();
    expect(el.querySelector('app-panorama-info')?.textContent).toContain('Análisis clínico');
  });

  it('pulsar un RA abre el mapa mental con ese RA', async () => {
    leafOf('0001 RA2').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const vistas = TestBed.inject(MapaVistaService);
    expect(vistas.vista()).toBe('mental');
    expect(vistas.tomarRaPendiente()).toEqual({ moduleCode: '0001', raId: '0001_RA2' });
  });

  it('la leyenda y la búsqueda atenúan lo que no coincide', async () => {
    const legend = el.querySelectorAll('.mindmap-legend__item');
    expect([...legend].map((i) => i.textContent?.trim())).toEqual([
      'Ciencias Aplicadas',
      'Técnica Práctica',
    ]);
    (legend[0] as HTMLButtonElement).click();
    await render();
    expect(el.querySelectorAll('.panorama-canvas__edge--dimmed')).toHaveLength(1);
    (legend[0] as HTMLButtonElement).click();
    facade.setSearch('calidad');
    await render();
    expect(leafOf('0001 RA1').classList).toContain('panorama-canvas__leaf--dimmed');
  });

  it('al cambiar de curso quita el resaltado', async () => {
    fixture.componentInstance.focus.set({ kind: 'ra', id: '0001_RA1' });
    facade.activeTab.set('CFGM');
    await render();
    expect(fixture.componentInstance.focus()).toBeNull();
  });

  it('se traduce al catalán y avisa si no hay módulos', async () => {
    language.set('catalan');
    await render();
    expect(el.textContent).toContain('Sortints');
    facade.modules.set([]);
    await render();
    expect(el.querySelector('app-panorama-canvas')).toBeNull();
    expect(el.textContent).toContain('Aquest mapa encara no té mòduls.');
    language.set('castellano');
    await render();
    expect(el.textContent).toContain('Este mapa todavía no tiene módulos.');
  });

  it('ignora un resaltado que ya no existe en el curso', async () => {
    fixture.componentInstance.focus.set({ kind: 'ra', id: 'NADA' });
    expect(fixture.componentInstance.focusedLeaf()).toBeNull();
    fixture.componentInstance.focus.set({ kind: 'module', code: 'NADA' });
    expect(fixture.componentInstance.focusedArc()).toBeNull();
  });
});

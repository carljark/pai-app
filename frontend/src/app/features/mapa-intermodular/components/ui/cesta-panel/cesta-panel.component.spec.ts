import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { AFINIDADES_1, NIVEL_AFINIDADES } from '../../../../../testing/afinidades.mock';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import { NIVELES_MOCK, loadNivelesMock } from '../../../../../testing/niveles.mock';
import { AfinidadProyectoService } from '../../../services/afinidad-proyecto.service';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { CestaFacade } from '../../../services/cesta.facade';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { PlappSoundService } from '../../../services/plapp-sound.service';
import { CestaPanelComponent } from './cesta-panel.component';

describe('CestaPanelComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  const crearDesdeCriterios = vi.fn().mockResolvedValue(undefined);
  let fixture: ComponentFixture<CestaPanelComponent>;
  let el: HTMLElement;
  let cesta: CestaFacade;
  let mapa: MapaIntermodularFacade;

  const text = (sel: string) => el.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim();
  const all = (sel: string) =>
    Array.from(el.querySelectorAll(sel)).map((e) => e.textContent?.replace(/\s+/g, ' ').trim());
  const button = (sel: string) => el.querySelector(sel) as HTMLButtonElement;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    sessionStorage.clear();
    language.set('castellano');
    crearDesdeCriterios.mockClear();
    TestBed.configureTestingModule({
      imports: [CestaPanelComponent, HttpClientTestingModule],
      providers: [
        { provide: LayoutService, useValue: { language } },
        { provide: PlappSoundService, useValue: { plapp: vi.fn() } },
        { provide: AfinidadProyectoService, useValue: { crearDesdeCriterios } },
      ],
    });
    loadNivelesMock([...NIVELES_MOCK, NIVEL_AFINIDADES]);
    TestBed.inject(AfinidadesEsoFacade).data.set(AFINIDADES_1);
    mapa = TestBed.inject(MapaIntermodularFacade);
    mapa.modules.set(mindmapModules());
    mapa.activeTab.set('ESO_1');
    cesta = TestBed.inject(CestaFacade);
    fixture = TestBed.createComponent(CestaPanelComponent);
    el = fixture.nativeElement;
    await render();
  });

  afterEach(() => sessionStorage.clear());

  it('la cesta vacía explica cómo llenarla y no deja crear ni vaciar', () => {
    expect(text('.cesta-panel__titulo')).toBe('Cesta del proyecto');
    expect(text('.cesta-panel__vacia')).toContain('arrastra materias del mapa mental');
    expect(button('.cesta-panel__crear').disabled).toBe(true);
    expect(button('.cesta-panel__vaciar').disabled).toBe(true);
  });

  it('una sola materia pide añadir otra para ver lo que hay en común', async () => {
    cesta.meterUnidad('MAT');
    await render();
    expect(text('.cesta-panel__nombre')).toBe('Matemáticas');
    expect(text('.cesta-panel__aviso')).toBe('Añade otra materia para ver los criterios en común.');
    expect(button('.cesta-panel__crear').disabled).toBe(true);
  });

  it('dos materias sin ficha común lo indican en cada una', async () => {
    cesta.meterUnidad('TEC');
    cesta.meterUnidad('EF');
    await render();
    expect(all('.cesta-panel__aviso')).toEqual([
      'Sin criterios en común con el resto de la cesta.',
      'Sin criterios en común con el resto de la cesta.',
    ]);
  });

  it('lista los criterios en común, deja quitarlos y crea el proyecto', async () => {
    const cerrar = vi.fn();
    fixture.componentInstance.cerrar.subscribe(cerrar);
    cesta.meterUnidad('BYG');
    cesta.meterUnidad('MAT');
    await render();
    expect(all('.cesta-panel__clave')).toEqual(['CE 1.1 ✕', 'CE 2.1 ✕', 'CE 2.2 ✕']);
    expect(text('.cesta-panel__crear')).toBe('Crear Proyecto con la cesta (3)');
    button('.cesta-panel__quitar-clave').click();
    await render();
    expect(text('.cesta-panel__crear')).toBe('Crear Proyecto con la cesta (2)');
    button('.cesta-panel__crear').click();
    expect(crearDesdeCriterios).toHaveBeenCalledWith([['MAT', ['2.1', '2.2']]], 'ESO_1');
    expect(cerrar).toHaveBeenCalled();
  });

  it('quita una materia y vacía la cesta', async () => {
    cesta.meterUnidad('BYG');
    cesta.meterUnidad('MAT');
    await render();
    button('.cesta-panel__quitar').click();
    await render();
    expect(all('.cesta-panel__nombre')).toEqual(['Matemáticas']);
    button('.cesta-panel__vaciar').click();
    await render();
    expect(el.querySelector('.cesta-panel__grupo')).toBeNull();
  });

  it('en catalán usa «cistella» y las siglas CA', async () => {
    language.set('catalan');
    cesta.meterUnidad('BYG');
    cesta.meterUnidad('MAT');
    await render();
    expect(text('.cesta-panel__titulo')).toBe('Cistella del projecte');
    expect(all('.cesta-panel__clave')[0]).toBe('CA 1.1 ✕');
    expect(text('.cesta-panel__vaciar')).toBe('Buida');
    expect(text('.cesta-panel__crear')).toBe('Crear Projecte amb la cistella (3)');
    expect(button('.cesta-panel__quitar').getAttribute('aria-label')).toBe(
      'Treu Biologia i Geologia',
    );
  });

  it('en la FP habla de módulos y RA', async () => {
    mapa.activeTab.set('FPB');
    await render();
    expect(text('.cesta-panel__vacia')).toContain('arrastra módulos del mapa mental');
    cesta.meterUnidad('0001');
    await render();
    expect(text('.cesta-panel__aviso')).toBe('Añade otro módulo para ver los RA en común.');
    language.set('catalan');
    await render();
    expect(text('.cesta-panel__aviso')).toBe('Afegeix un altre mòdul per veure els RA en comú.');
  });
});

import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { AFINIDADES_1, NIVEL_AFINIDADES } from '../../../../../testing/afinidades.mock';
import { loadNivelesMock } from '../../../../../testing/niveles.mock';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { CestaDropService } from '../../../services/cesta-drop.service';
import { CestaFacade } from '../../../services/cesta.facade';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { PlappSoundService } from '../../../services/plapp-sound.service';
import { CestaComponent } from './cesta.component';

describe('CestaComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  let fixture: ComponentFixture<CestaComponent>;
  let el: HTMLElement;
  let drop: CestaDropService;

  const boton = () => el.querySelector('.cesta__boton') as HTMLButtonElement;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    sessionStorage.clear();
    language.set('castellano');
    TestBed.configureTestingModule({
      imports: [CestaComponent, HttpClientTestingModule],
      providers: [
        { provide: LayoutService, useValue: { language } },
        { provide: PlappSoundService, useValue: { plapp: vi.fn() } },
      ],
    });
    loadNivelesMock([NIVEL_AFINIDADES]);
    TestBed.inject(AfinidadesEsoFacade).data.set(AFINIDADES_1);
    TestBed.inject(MapaIntermodularFacade).activeTab.set('ESO_1');
    drop = TestBed.inject(CestaDropService);
    fixture = TestBed.createComponent(CestaComponent);
    el = fixture.nativeElement;
    await render();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('muestra la cesta vacía sin contador y abre y cierra el panel', async () => {
    expect(boton().textContent).toContain('Cesta');
    expect(boton().getAttribute('aria-label')).toBe('Cesta del proyecto: 0 elementos');
    expect(el.querySelector('.cesta__contador')).toBeNull();
    boton().click();
    await render();
    expect(el.querySelector('app-cesta-panel')).not.toBeNull();
    (el.querySelector('.cesta-panel__cerrar') as HTMLButtonElement).click();
    await render();
    expect(el.querySelector('app-cesta-panel')).toBeNull();
  });

  it('registra el botón como zona donde soltar las bolas', () => {
    boton().getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 50, bottom: 50, width: 50, height: 50 }) as DOMRect;
    expect(drop.contains(10, 10)).toBe(true);
    fixture.destroy();
    expect(drop.contains(10, 10)).toBe(false);
  });

  it('pinta la bola que se arrastra y se resalta al pasar por encima', async () => {
    drop.ghost.set({ x: 30, y: 40, color: 'rgb(1, 2, 3)', badge: 'MAT' });
    drop.over.set(true);
    await render();
    const fantasma = el.querySelector('.cesta__fantasma') as HTMLElement;
    expect(fantasma.textContent?.trim()).toBe('MAT');
    expect(fantasma.style.left).toBe('30px');
    expect(fantasma.style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(boton().classList).toContain('cesta__boton--sobre');
  });

  it('al recibir una bola cuenta la materia y hace la animación un momento', async () => {
    vi.useFakeTimers();
    TestBed.inject(CestaFacade).meterUnidad('MAT');
    await render();
    expect(el.querySelector('.cesta__contador')?.textContent?.trim()).toBe('1');
    expect(boton().getAttribute('aria-label')).toBe('Cesta del proyecto: 1 elemento');
    expect(boton().classList).toContain('cesta__boton--recibe');
    vi.advanceTimersByTime(500);
    await render();
    expect(boton().classList).not.toContain('cesta__boton--recibe');
  });

  it('nombra la cesta en catalán', async () => {
    language.set('catalan');
    await render();
    expect(boton().textContent).toContain('Cistella');
    expect(boton().getAttribute('aria-label')).toBe('Cistella del projecte: 0 elements');
    TestBed.inject(CestaFacade).meterUnidad('MAT');
    await render();
    expect(boton().getAttribute('aria-label')).toBe('Cistella del projecte: 1 element');
  });
});

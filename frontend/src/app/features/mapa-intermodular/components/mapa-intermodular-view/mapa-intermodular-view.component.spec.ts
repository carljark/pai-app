import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaIntermodularViewComponent } from './mapa-intermodular-view.component';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MapaIntermodularViewComponent', () => {
  let component: MapaIntermodularViewComponent;
  let fixture: ComponentFixture<MapaIntermodularViewComponent>;
  let mockLayout: any;
  let mockFacade: any;
  let mockTrans: any;

  beforeEach(async () => {
    mockLayout = {
      language: signal<'castellano' | 'catalan'>('castellano'),
      switchView: vi.fn(),
      isMobile: signal(false)
    };

    mockTrans = {
      t: signal({
        sidebarMapa: 'Mapa Intermodular'
      })
    };

    await TestBed.configureTestingModule({
      imports: [MapaIntermodularViewComponent],
      providers: [
        MapaIntermodularFacade,
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapaIntermodularViewComponent);
    component = fixture.componentInstance;
    mockFacade = TestBed.inject(MapaIntermodularFacade);
    fixture.detectChanges();
  });

  it('should create and render header', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mapa-header__title')?.textContent).toContain('Mapa Intermodular');
    expect(compiled.querySelectorAll('.mapa-stat-card').length).toBe(4);
  });

  it('should select module and RA on user click', () => {
    component.facade.selectModule('3063');
    fixture.detectChanges();
    expect(component.facade.selectedModuleCode()).toBe('3063');

    component.facade.selectRa('3063_RA1');
    fixture.detectChanges();
    expect(component.facade.selectedRaId()).toBe('3063_RA1');
  });

  it('should get correct relation labels', () => {
    expect(component.getRelationLabel('ciencias')).toBe('Ciencias Aplicadas');
    expect(component.getRelationLabel('comunicacion')).toBe('Comunicación');
    expect(component.getRelationLabel('empleabilidad')).toBe('Empleabilidad / FOL');

    mockLayout.language.set('catalan');
    expect(component.getRelationLabel('ciencias')).toBe('Ciències Aplicades');
  });

  it('should trigger createProjectFromConnection', () => {
    component.createProjectFromConnection();
    expect(mockLayout.switchView).toHaveBeenCalledWith('generator');
  });

  it('should copy summary to clipboard', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });

    vi.useFakeTimers();
    component.copySummary();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(component.copied()).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(component.copied()).toBe(false);
    vi.useRealTimers();
  });

  it('should switch language reactively', () => {
    mockLayout.language.set('catalan');
    fixture.detectChanges();
    expect(component.isCa()).toBe(true);

    mockLayout.language.set('castellano');
    fixture.detectChanges();
    expect(component.isCa()).toBe(false);
  });

  it('should click all filter pills, search input, modules, and RAs in DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Filter pills
    const pills = compiled.querySelectorAll('.filter-pill') as NodeListOf<HTMLButtonElement>;
    pills.forEach(p => p.click());
    fixture.detectChanges();

    // Search input
    const input = compiled.querySelector('input');
    if (input) {
      input.value = '3063';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('ngModelChange'));
      fixture.detectChanges();
    }

    // Module card click
    const modCard = compiled.querySelector('.mapa-module-card') as HTMLElement;
    if (modCard) {
      modCard.click();
      fixture.detectChanges();
    }

    // RA item click
    const raItem = compiled.querySelector('.mapa-ra-item') as HTMLElement;
    if (raItem) {
      raItem.click();
      fixture.detectChanges();
    }

    // Action buttons in hero
    const actionBtns = compiled.querySelectorAll('.mapa-btn-action') as NodeListOf<HTMLButtonElement>;
    actionBtns.forEach(b => b.click());
    fixture.detectChanges();
  });

  it('should test methods directly and handle clipboard edge cases', () => {
    component.onSelectModule('3063');
    component.onSelectRa('3063_RA1');
    const ev = new Event('click');
    const stopSpy = vi.spyOn(ev, 'stopPropagation');
    component.onSelectRa('3063_RA1', ev);
    expect(stopSpy).toHaveBeenCalled();

    component.onSetTypeFilter('especifico');
    component.onSearch('cuidado');

    // Clipboard undefined
    const origClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true, writable: true });
    component.copySummary();
    Object.defineProperty(navigator, 'clipboard', { value: origClipboard, configurable: true, writable: true });
  });

  it('should test empty connections state in template', () => {
    const mod = component.facade.selectedModule();
    if (mod && mod.learningOutcomes.length > 0) {
      mod.learningOutcomes[0].connections = [];
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No hay conexiones registradas');
    }
  });

  it('should test fallback relation labels', () => {
    expect(component.getRelationLabel('unknown_rel')).toBe('unknown_rel');
    expect(component.getRelationLabel('sostenibilidad')).toBe('Sostenibilidad');
    expect(component.getRelationLabel('digital')).toBe('Digital / Redes');
    expect(component.getRelationLabel('tecnica')).toBe('Técnica Práctica');
    expect(component.getRelationLabel('cliente')).toBe('Atención al Cliente');
  });
});

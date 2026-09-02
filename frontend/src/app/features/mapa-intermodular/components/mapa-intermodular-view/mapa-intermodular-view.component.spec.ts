import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaIntermodularViewComponent } from './mapa-intermodular-view.component';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MapaIntermodularViewComponent', () => {
  let component: MapaIntermodularViewComponent;
  let fixture: ComponentFixture<MapaIntermodularViewComponent>;
  let mockLayout: any;
  let mockFacade: any;
  let mockTrans: any;
  let curriculum: CurriculumFacade;

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
      imports: [MapaIntermodularViewComponent, HttpClientTestingModule],
      providers: [
        MapaIntermodularFacade,
        CurriculumFacade,
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapaIntermodularViewComponent);
    component = fixture.componentInstance;
    mockFacade = TestBed.inject(MapaIntermodularFacade);
    curriculum = TestBed.inject(CurriculumFacade);
    
    // Seed curriculum ras for testing matching
    curriculum.ras.set([
      { id: '3060-RA1', module: 'Preparación del entorno profesional', description: 'Muestra una imagen personal y profesional adecuada en el entorno de trabajo' },
      { id: '3005-RA1', module: 'Atención al cliente', description: 'Atiende a posibles clientes' },
      { id: '3009-RA1', module: 'Ciencias aplicadas I', description: 'Resuelve problemas matemáticos' }
    ]);
    
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

  it('should trigger createProjectFromConnection with all connections', () => {
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.createProjectFromConnection();
    expect(curriculum.tipoNivel()).toBe('FP_BASICA');
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);
    expect(mockLayout.switchView).toHaveBeenCalledWith('generator');
  });

  it('should trigger createProjectFromConnection for a specific connection', () => {
    const activeRa = component.facade.selectedRa();
    const conn = activeRa?.connections[0];
    if (conn) {
      component.createProjectFromConnection(conn);
      expect(curriculum.selectedRas().length).toBeGreaterThan(0);
      expect(mockLayout.switchView).toHaveBeenCalledWith('generator');
    }
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
    component.facade.setTypeFilter('all');
    component.facade.setSearch('');
    component.facade.selectModule('3060');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Filter pills
    const pills = compiled.querySelectorAll('.filter-pill') as NodeListOf<HTMLButtonElement>;
    pills.forEach(p => {
      p.click();
      fixture.detectChanges();
    });

    // Reset filter
    component.facade.setTypeFilter('all');
    component.facade.selectModule('3060');
    fixture.detectChanges();

    // Search input
    const input = compiled.querySelector('input');
    if (input) {
      input.value = '3060';
      input.dispatchEvent(new Event('input'));
      component.onSearch('3060');
      fixture.detectChanges();
    }

    // Module card click
    const modCards = compiled.querySelectorAll('.mapa-module-card') as NodeListOf<HTMLElement>;
    modCards.forEach(c => {
      c.click();
      fixture.detectChanges();
    });

    // RA item click
    const raItems = compiled.querySelectorAll('.mapa-ra-item') as NodeListOf<HTMLElement>;
    raItems.forEach(r => {
      r.click();
      fixture.detectChanges();
    });

    // Action buttons in hero
    const actionBtns = compiled.querySelectorAll('.mapa-btn-action') as NodeListOf<HTMLButtonElement>;
    actionBtns.forEach(b => {
      b.click();
      fixture.detectChanges();
    });
  });

  it('should test methods directly and propagation stop', () => {
    component.onSelectModule('3063');
    component.onSelectRa('3063_RA1');
    const ev = new Event('click');
    const stopSpy = vi.spyOn(ev, 'stopPropagation');
    component.onSelectRa('3063_RA1', ev);
    expect(stopSpy).toHaveBeenCalled();

    component.onSetTypeFilter('especifico');
    component.onSearch('cuidado');
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

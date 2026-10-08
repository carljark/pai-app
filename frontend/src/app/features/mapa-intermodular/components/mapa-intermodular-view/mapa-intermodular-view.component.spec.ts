import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaIntermodularViewComponent } from './mapa-intermodular-view.component';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { FPB_MODULES_SEED } from '../../data/mapa-intermodular.seed';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadNivelesMock, NIVELES_MOCK } from '../../../../testing/niveles.mock';
import { AfinidadesEsoService } from '../../services/afinidades-eso.service';
import { AFINIDADES_1, NIVEL_AFINIDADES } from '../../../../testing/afinidades.mock';
import { of } from 'rxjs';

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
      isMobile: signal(false),
    };

    mockTrans = {
      t: signal({
        sidebarMapa: 'Mapa Intermodular',
        loadingData: 'Cargando datos...',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [MapaIntermodularViewComponent, HttpClientTestingModule],
      providers: [
        MapaIntermodularFacade,
        CurriculumFacade,
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans },
      ],
    }).compileComponents();
    loadNivelesMock();

    fixture = TestBed.createComponent(MapaIntermodularViewComponent);
    component = fixture.componentInstance;
    mockFacade = TestBed.inject(MapaIntermodularFacade);
    curriculum = TestBed.inject(CurriculumFacade);

    mockFacade.seedCache = {
      FPB: [...FPB_MODULES_SEED],
      CFGM: [...FPB_MODULES_SEED],
      CFGM_PELUQUERIA: [...FPB_MODULES_SEED],
      CFGM_PELUQUERIA_2: [...FPB_MODULES_SEED],
      CFGS_EDUCACION_INFANTIL: [...FPB_MODULES_SEED],
      CFGS_EDUCACION_INFANTIL_2: [...FPB_MODULES_SEED],
    };
    mockFacade.isLoadingSeed.set(false);
    mockFacade.modules.set([...FPB_MODULES_SEED]);
    mockFacade.selectModule('3060');
    mockFacade.selectRa('3060_RA1');

    // Seed curriculum ras for testing matching
    curriculum.ras.set([
      {
        id: '3060-RA1',
        module: 'Preparación del entorno profesional',
        description: 'Muestra una imagen personal y profesional adecuada en el entorno de trabajo',
      },
      { id: '3005-RA1', module: 'Atención al cliente', description: 'Atiende a posibles clientes' },
      {
        id: '3009-RA1',
        module: 'Ciencias aplicadas I',
        description: 'Resuelve problemas matemáticos',
      },
    ]);

    fixture.detectChanges();
  });

  it('should switch cycle with the select and course with the segmented buttons', () => {
    const el = fixture.nativeElement as HTMLElement;
    const select = el.querySelector('.mapa-tabs__select') as HTMLSelectElement;
    const chooseCiclo = (tipoNivel: string) => {
      select.value = tipoNivel;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const cursoBtns = () =>
      el.querySelectorAll('.mapa-tabs__curso') as NodeListOf<HTMLButtonElement>;

    expect(select.options.length).toBe(4);
    expect(cursoBtns().length).toBe(0);

    chooseCiclo('CFGS_EDUCACION_INFANTIL');
    expect(component.facade.activeTab()).toBe('CFGS_EDUCACION_INFANTIL');
    expect(el.textContent).toContain('Mapa intermodular del CFGS Educación Infantil 1º');
    expect(cursoBtns().length).toBe(2);
    expect(cursoBtns()[0].getAttribute('aria-pressed')).toBe('true');

    cursoBtns()[1].click();
    fixture.detectChanges();
    expect(component.facade.activeTab()).toBe('CFGS_EDUCACION_INFANTIL_2');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(el.textContent).toContain('Mapa intermodular del CFGS Educació Infantil 2n');
    expect(cursoBtns()[1].textContent?.trim()).toBe('2n');
    expect(select.selectedOptions[0]?.textContent?.trim()).toBe('CFGS Educació Infantil');
    component.layout.language.set('castellano');
    fixture.detectChanges();
    expect(cursoBtns()[1].textContent?.trim()).toBe('2.º');

    // Al cambiar de ciclo se conserva el curso si existe
    chooseCiclo('CFGM_PELUQUERIA');
    expect(component.facade.activeTab()).toBe('CFGM_PELUQUERIA_2');
    cursoBtns()[0].click();
    fixture.detectChanges();
    expect(component.facade.activeTab()).toBe('CFGM_PELUQUERIA');

    // Ciclos sin cursos: sin selector de curso
    chooseCiclo('CFGM_ESTETICA');
    expect(component.facade.activeTab()).toBe('CFGM');
    expect(cursoBtns().length).toBe(0);
    chooseCiclo('FP_BASICA');
    expect(component.facade.activeTab()).toBe('FPB');

    // Un ciclo desconocido no cambia la pestaña
    chooseCiclo('DESCONOCIDO');
    expect(component.facade.activeTab()).toBe('FPB');

    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(component.isCa()).toBe(true);
    component.layout.language.set('castellano');
    fixture.detectChanges();
    expect(component.isCa()).toBe(false);
  });

  it('should click header main row and stats toggle button in DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mainRow = compiled.querySelector('.mapa-header__main-row') as HTMLElement;
    expect(mainRow).toBeTruthy();
    expect(component.headerExpanded()).toBe(false);

    // Click main row to expand
    mainRow.click();
    fixture.detectChanges();
    expect(component.headerExpanded()).toBe(true);

    // Click toggle button inside main row
    const toggleBtn = compiled.querySelector('.mapa-stats-toggle-btn') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
    toggleBtn.click();
    fixture.detectChanges();
    expect(component.headerExpanded()).toBe(false);
  });

  it('should create and render header and toggle stats', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mapa-header__title')?.textContent).toContain(
      'Mapa intermodular del CFGB Peluquería y Estética',
    );
    // Collapsed by default
    expect(compiled.querySelectorAll('.mapa-stat-card').length).toBe(0);
    expect(component.headerExpanded()).toBe(false);

    // Toggle stats
    component.toggleHeaderStats();
    fixture.detectChanges();
    expect(component.headerExpanded()).toBe(true);
    expect(compiled.querySelectorAll('.mapa-stat-card').length).toBe(4);
  });

  it('should render activity details and motivating factor', () => {
    component.facade.setTab('FPB');

    const dummyConn = {
      title_es: 'title_es',
      title_ca: 'title_ca',
      targetModuleCode: '3061',
      targetModuleName_es: 'mod_es',
      targetModuleName_ca: 'mod_ca',
      targetRaCode: 'RA2',
      targetRaText_es: 'ra_es',
      targetRaText_ca: 'ra_ca',
      sourceCriteria: 'a, b',
      relatedCriteria: [{ code: 'a', text_es: 'ce_es', text_ca: 'ce_ca' }],
      activities: [
        {
          id: '1',
          title_es: 'act_es',
          title_ca: 'act_ca',
          motivatingFactor_es: 'mot_es',
          motivatingFactor_ca: 'mot_ca',
          description_es: 'desc_es',
          description_ca: 'desc_ca',
          evidence_es: 'ev_es',
          evidence_ca: 'ev_ca',
          diversitySupport_es: 'div_es',
          diversitySupport_ca: 'div_ca',
        },
        {
          id: '2',
          title_es: 'act2',
          title_ca: 'act2',
          description_es: 'desc',
          description_ca: 'desc',
          evidence_es: 'ev',
          evidence_ca: 'ev',
          diversitySupport_es: 'div',
          diversitySupport_ca: 'div',
        },
      ],
    };
    const emptyConn = {
      targetModuleCode: '3062',
      targetModuleName_es: 'mod2',
      targetModuleName_ca: 'mod2',
      targetRaCode: 'RA3',
      targetRaText_es: 'ra3',
      targetRaText_ca: 'ra3',
      relatedCriteria: [],
      activities: [],
    };

    const customMod = {
      code: '3060',
      name_es: 'Mod',
      learningOutcomes: [
        {
          id: '3060_RA1',
          code: 'RA1',
          text_es: 'a',
          criteria_es: ['ce_1'],
          connections: [dummyConn, emptyConn],
        },
      ],
    };

    component.facade.modules.set([customMod as any]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.facade.searchQuery.set('');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('mot_es');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('mot_ca');
  });

  it('should render empty state when no module is selected', () => {
    component.facade.setTab('FPB');
    component.facade.selectedModuleCode.set('');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Selecciona un m');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Selecciona un m');
  });

  it('should render empty state when RA has no connections', () => {
    component.facade.setTab('FPB');
    const customMod = {
      code: '3060',
      name_es: 'Mod',
      learningOutcomes: [
        { id: '3060_RA1', code: 'RA1', text_es: 'a', criteria_es: ['ce_1'], connections: [] },
      ],
    };
    component.facade.modules.set([customMod as any]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No hay conexiones registradas para este RA',
    );
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'No hi ha connexions registrades per a aquest RA',
    );
  });

  it('should render all template conditions in both languages for full coverage', () => {
    // Check CFGM_PELUQUERIA tab button text
    component.facade.setTab('CFGM_PELUQUERIA');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('CFGM Peluquer');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('CFGM Perruqueria');
    component.layout.language.set('castellano');

    component.facade.setTab('FPB');

    const dummyConn = {
      title_es: 'title_es',
      title_ca: 'title_ca',
      targetModuleCode: '3061',
      targetModuleName_es: 'mod_es',
      targetModuleName_ca: 'mod_ca',
      targetRaCode: 'RA2',
      targetRaText_es: 'ra_es',
      targetRaText_ca: 'ra_ca',
      sourceCriteria: 'a, b',
      relatedCriteria: [{ code: 'a', text_es: 'ce_es', text_ca: 'ce_ca' }],
      activities: [
        {
          id: '1',
          title_es: 'act_es',
          title_ca: 'act_ca',
          motivatingFactor_es: 'mot_es',
          motivatingFactor_ca: 'mot_ca',
          description_es: 'desc_es',
          description_ca: 'desc_ca',
          evidence_es: 'ev_es',
          evidence_ca: 'ev_ca',
          diversitySupport_es: 'div_es',
          diversitySupport_ca: 'div_ca',
        },
        {
          id: '2',
          title_es: 'act2',
          title_ca: 'act2',
          description_es: 'desc',
          description_ca: 'desc',
          evidence_es: 'ev',
          evidence_ca: 'ev',
          diversitySupport_es: 'div',
          diversitySupport_ca: 'div',
        },
      ],
    };
    const emptyConn = {
      targetModuleCode: '3062',
      targetModuleName_es: 'mod2',
      targetModuleName_ca: 'mod2',
      targetRaCode: 'RA3',
      targetRaText_es: 'ra3',
      targetRaText_ca: 'ra3',
      relatedCriteria: [],
      activities: [],
    };

    const customMod = {
      code: '3060',
      name_es: 'Mod',
      learningOutcomes: [
        {
          id: '3060_RA1',
          code: 'RA1',
          text_es: 'a',
          text_ca: 'b',
          criteria_es: ['ce_1'],
          connections: [dummyConn, emptyConn],
        },
      ],
    };

    component.facade.modules.set([customMod as any]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.facade.searchQuery.set('');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('title_es');
    expect(fixture.nativeElement.textContent).toContain('mot_es');
    expect(fixture.nativeElement.textContent).toContain('Criterios propios');

    component.layout.language.set('catalan');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('title_ca');
    expect(fixture.nativeElement.textContent).toContain('mot_ca');
    expect(fixture.nativeElement.textContent).toContain('Criteris propis');
  });

  it('should render remaining edge cases in HTML (empty search, selected criterion)', () => {
    // 1. Empty modules due to search
    component.facade.searchQuery.set('GIBBERISH_NO_MATCH');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se encontr');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No s’ha trobat');

    component.layout.language.set('castellano');
    component.facade.searchQuery.set('');

    // 2. Selected Criterion
    const customMod = {
      code: '3060',
      name_es: 'Mod',
      learningOutcomes: [
        { id: '3060_RA1', code: 'RA1', text_es: 'a', criteria_es: ['ce_1'], connections: [] },
      ],
    };
    component.facade.modules.set([customMod as any]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.facade.selectedCriterion.set('crit_1');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ver todos');
    expect(fixture.nativeElement.textContent).toContain('Filtrado por criterio');

    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Veure tots');
    expect(fixture.nativeElement.textContent).toContain('Filtrat pel criteri');
  });

  it('should select module and RA on user click and collapse when clicking module again', () => {
    component.facade.selectModule('3063');
    fixture.detectChanges();
    expect(component.facade.selectedModuleCode()).toBe('3063');

    component.facade.selectRa('3063_RA1');
    fixture.detectChanges();
    expect(component.facade.selectedRaId()).toBe('3063_RA1');

    // Collapse module
    component.onSelectModule('3063');
    fixture.detectChanges();
    expect(component.facade.selectedModuleCode()).toBe('');
    expect(component.facade.selectedRa()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Selecciona un');
  });

  it('should render header for CFGM in both languages', () => {
    component.facade.setTab('CFGM');
    component.headerExpanded.set(true);
    fixture.detectChanges();
    component.layout.language.set('castellano');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1.er curso');
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('1r curs');
  });

  it('should set curriculum level correctly for CFGM_PELUQUERIA on project creation', () => {
    component.facade.setTab('CFGM_PELUQUERIA');
    component.createProjectFromConnection();
    expect(curriculum.tipoNivel()).toBe('CFGM_PELUQUERIA');
  });

  it('should get correct relation labels and toggle header in Catalan', () => {
    // getRelationLabel is in ConnectionsListComponent, not MapaIntermodularViewComponent
    // This tests the component's tab functionality instead
    mockLayout.language.set('castellano');
    fixture.detectChanges();

    mockLayout.language.set('catalan');
    fixture.detectChanges();

    // Toggle in Catalan
    fixture.detectChanges();
    component.toggleHeaderStats();
    fixture.detectChanges();
    expect(component.headerExpanded()).toBe(true);
    component.toggleHeaderStats();
    fixture.detectChanges();
    expect(component.headerExpanded()).toBe(false);
  });

  it('should trigger createProjectFromConnection with all connections', () => {
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.createProjectFromConnection();
    expect(curriculum.tipoNivel()).toBe('FP_BASICA');
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);
    expect(mockLayout.switchView).toHaveBeenCalledWith('generator');
  });

  it('should open the generator at CFGS Educación Infantil 2º from its map tab', async () => {
    await component.facade.setTab('CFGS_EDUCACION_INFANTIL_2', [...FPB_MODULES_SEED]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.createProjectFromConnection();
    expect(curriculum.tipoNivel()).toBe('CFGS_EDUCACION_INFANTIL');
    expect(curriculum.curso()).toBe('2º');
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

  it('should match curriculum RAs by exact, partial, and module index in createProjectFromConnection', () => {
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');

    curriculum.ras.set([
      { _id: '1', id: 'RA1', module: '3060 - Ciencias', description: 'Exact description' },
      {
        _id: '2',
        id: 'RA2',
        module: '3059 - Comunicación',
        description: 'Otra descripción parcial',
      },
    ]);

    component.createProjectFromConnection();
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);

    mockLayout.language.set('catalan');
    component.createProjectFromConnection();
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);
  });

  it('should switch language reactively and render in Catalan and Castellano', () => {
    mockLayout.language.set('catalan');
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    fixture.detectChanges();
    expect(component.isCa()).toBe(true);

    mockLayout.language.set('castellano');
    fixture.detectChanges();
    expect(component.isCa()).toBe(false);
  });

  it('should render empty state when no RA is selected', () => {
    component.facade.modules.set([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Selecciona');
    component.facade.modules.set([...FPB_MODULES_SEED]);
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    fixture.detectChanges();
  });

  it('should click all filter pills, search input, modules, and RAs in DOM', () => {
    component.headerExpanded.set(true);
    component.facade.setTypeFilter('all');
    component.facade.setSearch('');
    component.facade.selectModule('3060');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Filter pills
    const pills = compiled.querySelectorAll('.filter-pill') as NodeListOf<HTMLButtonElement>;
    expect(pills.length).toBe(4);
    pills.forEach((p) => {
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
    modCards.forEach((c) => {
      c.click();
      fixture.detectChanges();
    });

    // Re-select 3060 to ensure criteria are visible for pill testing
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    fixture.detectChanges();

    // RA item click
    const raItems = fixture.nativeElement.querySelectorAll(
      '.mapa-ra-item',
    ) as NodeListOf<HTMLElement>;
    raItems.forEach((r) => {
      r.click();
      fixture.detectChanges();
    });

    // Action buttons in hero
    const actionBtns = fixture.nativeElement.querySelectorAll(
      '.mapa-btn-action',
    ) as NodeListOf<HTMLButtonElement>;
    actionBtns.forEach((b) => {
      b.click();
      fixture.detectChanges();
    });

    // Criterion pills in hero
    const critPills = fixture.nativeElement.querySelectorAll(
      '.mapa-criterion-pill',
    ) as NodeListOf<HTMLButtonElement>;
    expect(critPills.length).toBeGreaterThan(0);
    critPills.forEach((cp) => {
      cp.click();
      fixture.detectChanges();
    });

    // Clear criteria button
    const clearBtn = fixture.nativeElement.querySelector(
      '.mapa-criteria-clear-btn',
    ) as HTMLButtonElement;
    if (clearBtn) {
      clearBtn.click();
      fixture.detectChanges();
    }
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

    component.onSelectCriterion('a) Se ha relacionado');
    expect(component.facade.selectedCriterion()).toBe('a) Se ha relacionado');
    component.onSelectCriterion(null);
    expect(component.facade.selectedCriterion()).toBeNull();

    expect(component.getCriterionCode('a) Se ha relacionado')).toBe('a');
    expect(component.getCriterionCode('1b) Se ha identificado')).toBe('1b');
    expect(component.getCriterionCode('Sin patron directo')).toBe('CE');
  });

  it('should test empty connections state in template', () => {
    mockLayout.language.set('castellano');
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    component.facade.modules.update((mods) => {
      return mods.map((m) =>
        m.code === '3060'
          ? {
              ...m,
              learningOutcomes: m.learningOutcomes.map((r) =>
                r.id === '3060_RA1' ? { ...r, connections: [] } : r,
              ),
            }
          : m,
      );
    });
    component.onSelectCriterion(null);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay conexiones registradas');
  });

  it('should test fallback relation labels', () => {
    // getRelationLabel is in ConnectionsListComponent, not MapaIntermodularViewComponent
    // This test was moved to connections-list.component.spec.ts
  });

  it('should activate headers and module cards with Enter only when they have the focus', () => {
    const enter = () => new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    const activateSpy = vi.spyOn(component, 'activateStep');
    const moduleSpy = vi.spyOn(component, 'onSelectModule');
    const headerSpy = vi.spyOn(component, 'toggleHeaderStats');
    const root = fixture.nativeElement as HTMLElement;

    for (const step of [1, 2, 3]) {
      const header = root.querySelector(`.mapa-step-header--${step}`) as HTMLElement;
      // Enter que sube desde el botón interior no debe activar el paso
      header.querySelector('.mapa-step-toggle-btn')!.dispatchEvent(enter());
      expect(activateSpy).not.toHaveBeenCalledWith(step);
      header.dispatchEvent(enter());
      expect(activateSpy).toHaveBeenCalledWith(step);
    }

    const card = root.querySelector('.mapa-module-card') as HTMLElement;
    card.querySelector('.mapa-module-header')!.dispatchEvent(enter());
    expect(moduleSpy).not.toHaveBeenCalled();
    card.dispatchEvent(enter());
    expect(moduleSpy).toHaveBeenCalled();

    const mainRow = root.querySelector('.mapa-header__main-row') as HTMLElement;
    mainRow.querySelector('.mapa-header__title-group')!.dispatchEvent(enter());
    expect(headerSpy).not.toHaveBeenCalled();
    mainRow.dispatchEvent(enter());
    expect(headerSpy).toHaveBeenCalled();
  });

  it('should toggle accordion steps 1, 2 and 3 and update classes in DOM', () => {
    // Initial state: all 3 steps open
    expect(component.step1Open()).toBe(true);
    expect(component.step2Open()).toBe(true);
    expect(component.step3Open()).toBe(true);

    const header1 = fixture.nativeElement.querySelector('.mapa-step-header--1') as HTMLElement;
    const header2 = fixture.nativeElement.querySelector('.mapa-step-header--2') as HTMLElement;
    const header3 = fixture.nativeElement.querySelector('.mapa-step-header--3') as HTMLElement;

    expect(header1).toBeTruthy();
    expect(header2).toBeTruthy();
    expect(header3).toBeTruthy();

    const btnToggle1 = header1.querySelector('.mapa-step-toggle-btn') as HTMLButtonElement;
    const btnToggle2 = header2.querySelector('.mapa-step-toggle-btn') as HTMLButtonElement;
    const btnToggle3 = header3.querySelector('.mapa-step-toggle-btn') as HTMLButtonElement;

    expect(btnToggle1).toBeTruthy();
    expect(btnToggle2).toBeTruthy();
    expect(btnToggle3).toBeTruthy();

    // Toggle step 1 via button click
    btnToggle1.click();
    fixture.detectChanges();
    expect(component.step1Open()).toBe(false);
    expect(fixture.nativeElement.querySelector('.mapa-step-body--1').classList).toContain(
      'collapsed',
    );

    // Clicking header1 directly (outside toggle btn) should ACTIVATE (open) step 1
    header1.click();
    fixture.detectChanges();
    expect(component.step1Open()).toBe(true);
    expect(fixture.nativeElement.querySelector('.mapa-step-body--1').classList).not.toContain(
      'collapsed',
    );

    // Toggle step 2 via button click
    btnToggle2.click();
    fixture.detectChanges();
    expect(component.step2Open()).toBe(false);
    expect(fixture.nativeElement.querySelector('.mapa-step-body--2').classList).toContain(
      'collapsed',
    );

    // Clicking header2 directly should activate step 2
    header2.click();
    fixture.detectChanges();
    expect(component.step2Open()).toBe(true);

    // Toggle step 3 via button click
    btnToggle3.click();
    fixture.detectChanges();
    expect(component.step3Open()).toBe(false);
    expect(fixture.nativeElement.querySelector('.mapa-step-body--3').classList).toContain(
      'collapsed',
    );

    // Clicking header3 directly should activate step 3
    header3.click();
    fixture.detectChanges();
    expect(component.step3Open()).toBe(true);

    // Test toggleStep direct method calls with event stopPropagation
    const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;
    component.toggleStep(1, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.step1Open()).toBe(false);
    component.toggleStep(1);
    expect(component.step1Open()).toBe(true);

    component.toggleStep(2);
    expect(component.step2Open()).toBe(false);
    component.toggleStep(2);
    expect(component.step2Open()).toBe(true);

    component.toggleStep(3);
    expect(component.step3Open()).toBe(false);
    component.toggleStep(3);
    expect(component.step3Open()).toBe(true);
  });

  it('should activate and scroll steps when activateStep is called', () => {
    vi.useFakeTimers();
    const scrollMock = vi.fn();
    const focusMock = vi.fn();
    const mockEl = { scrollIntoView: scrollMock, focus: focusMock } as any;
    const querySpy = vi.spyOn(document, 'querySelector').mockReturnValue(mockEl);

    component.step1Open.set(false);
    component.activateStep(1);
    expect(component.step1Open()).toBe(true);

    component.step2Open.set(false);
    component.activateStep(2);
    expect(component.step2Open()).toBe(true);

    component.step3Open.set(false);
    component.activateStep(3);
    expect(component.step3Open()).toBe(true);

    vi.advanceTimersByTime(100);
    expect(scrollMock).toHaveBeenCalledTimes(3);
    expect(focusMock).toHaveBeenCalledTimes(3);

    // When target element is null
    querySpy.mockReturnValue(null);
    component.activateStep(1);
    vi.advanceTimersByTime(100);

    querySpy.mockRestore();
    vi.useRealTimers();
  });

  it('should auto-expand step 2 and step 3 when onSelectRa is called', () => {
    component.step2Open.set(false);
    component.step3Open.set(false);
    fixture.detectChanges();

    component.onSelectRa('3060_RA1');
    fixture.detectChanges();

    expect(component.step2Open()).toBe(true);
    expect(component.step3Open()).toBe(true);
  });

  it('should test findCurriculumMatch edge cases and fallbacks in createProjectFromConnection', () => {
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');

    // Test with empty curriculum ras so fallbacks are hit
    curriculum.ras.set([]);
    mockLayout.language.set('castellano');
    component.createProjectFromConnection();
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);

    mockLayout.language.set('catalan');
    component.createProjectFromConnection();
    expect(curriculum.selectedRas().length).toBeGreaterThan(0);

    // Partial substring fallback
    curriculum.ras.set([
      { description: 'muestra una imagen personal y profesional', module: '3060' },
    ]);
    component.createProjectFromConnection();
    expect(curriculum.selectedRas()).toContain('muestra una imagen personal y profesional');
  });

  it('should handle createProjectFromConnection when no RA is selected and with duplicates', () => {
    // 1. When no active RA or module
    component.facade.selectedModuleCode.set('');
    component.facade.selectedRaId.set('');
    component.createProjectFromConnection();
    expect(mockLayout.switchView).toHaveBeenCalledWith('generator');

    // 2. When target description matches source description (duplicate branch)
    component.facade.selectModule('3060');
    component.facade.selectRa('3060_RA1');
    const desc = component.facade.selectedRa()?.text_es || '';
    curriculum.ras.set([{ id: 'RA1', description: desc, module: '3060' }]);
    const mockConn: any = {
      targetModuleCode: '3060',
      targetModuleName_es: 'Prep',
      targetRaCode: 'RA1',
      targetRaText_es: desc,
      targetRaText_ca: desc,
    };
    component.createProjectFromConnection(mockConn);
  });

  it('should cover CFGM_PELUQUERIA header expanded branches and activity labels in both languages', () => {
    // Expand header with CFGM_PELUQUERIA tab active to cover subtitle + stats h1 branches
    component.facade.setTab('CFGM_PELUQUERIA');
    component.headerExpanded.set(true);
    fixture.detectChanges();

    // ES: h1 title "Mapa intermodular del CFGM Peluquería"
    expect(fixture.nativeElement.textContent).toContain('CFGM Peluquer');
    // CA: same
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Perruqueria i Cosm');

    // CFGM_PELUQUERIA_2 2nd year subtitle
    component.facade.setTab('CFGM_PELUQUERIA_2');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2n curs');
    component.layout.language.set('castellano');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2.º curso');

    // Now set up a module+RA with activities while tab is CFGM_PELUQUERIA to cover activity labels
    component.layout.language.set('castellano');
    const dummyConn2 = {
      title_es: 'conn_es',
      title_ca: 'conn_ca',
      targetModuleCode: '0842',
      targetModuleName_es: 'Pentinats',
      targetModuleName_ca: 'Pentinats',
      targetRaCode: 'RA1',
      targetRaText_es: 'ra_es',
      targetRaText_ca: 'ra_ca',
      sourceCriteria: 'a',
      relatedCriteria: [],
      activities: [
        {
          id: 'p1',
          title_es: 'act_perruq_es',
          title_ca: 'act_perruq_ca',
          motivatingFactor_es: 'mot_perruq_es',
          motivatingFactor_ca: 'mot_perruq_ca',
          description_es: 'desc_perruq_es',
          description_ca: 'desc_perruq_ca',
          evidence_es: 'ev_perruq_es',
          evidence_ca: 'ev_perruq_ca',
          diversitySupport_es: 'div_perruq_es',
          diversitySupport_ca: 'div_perruq_ca',
        },
      ],
    };
    const peluquerMod = {
      code: '0845',
      name_es: 'Tall de cabells',
      name_ca: 'Tall de cabells',
      learningOutcomes: [
        {
          id: '0845_RA1',
          code: 'RA1',
          text_es: 'ra_es',
          text_ca: 'ra_ca',
          criteria_es: ['a) criteri'],
          connections: [dummyConn2],
        },
      ],
    };
    component.facade.modules.set([peluquerMod as any]);
    component.facade.selectModule('0845');
    component.facade.selectRa('0845_RA1');
    component.facade.searchQuery.set('');
    fixture.detectChanges();

    // Activity label should read "Propuestas de Actividades y Retos CFGM" (not FPB)
    expect(fixture.nativeElement.textContent).toContain('Propuestas de Actividades');
    expect(fixture.nativeElement.textContent).toContain('Aprendizajes y Diversidad CFGM');
    expect(fixture.nativeElement.textContent).toContain('act_perruq_es');

    // CA
    component.layout.language.set('catalan');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Propostes d');
    expect(fixture.nativeElement.textContent).toContain('Aprenentatges i Diversitat CFGM');
    expect(fixture.nativeElement.textContent).toContain('act_perruq_ca');
  });

  it('should name the CFGS Educación Infantil 2.º map from the catalog in Catalan', () => {
    const el = fixture.nativeElement as HTMLElement;
    const infantilMod = {
      code: '0013',
      name_es: 'Didáctica de la educación infantil',
      name_ca: 'Didàctica de l’educació infantil',
      type: 'especifico',
      learningOutcomes: [
        {
          id: '0013_RA1',
          code: 'RA1',
          text_es: 'ra_es',
          text_ca: 'ra_ca',
          criteria_es: ['a) criterio'],
          criteria_ca: ['a) criteri'],
          connections: [
            {
              title_es: 'conn_es',
              title_ca: 'conn_ca',
              targetModuleCode: '0016',
              targetModuleName_es: 'Juego infantil',
              targetModuleName_ca: 'Joc infantil',
              targetRaCode: 'RA1',
              targetRaText_es: 'ra_es',
              targetRaText_ca: 'ra_ca',
              sourceCriteria: 'a',
              relatedCriteria: [],
              activities: [
                {
                  id: 'i1',
                  title_es: 'act_infantil_es',
                  title_ca: 'act_infantil_ca',
                  description_es: 'd',
                  description_ca: 'd',
                  evidence_es: 'e',
                  evidence_ca: 'e',
                  diversitySupport_es: 'v',
                  diversitySupport_ca: 'v',
                },
              ],
            },
          ],
        },
      ],
    };
    mockFacade.seedCache.CFGS_EDUCACION_INFANTIL_2 = [infantilMod];
    component.layout.language.set('catalan');
    const select = el.querySelector('.mapa-tabs__select') as HTMLSelectElement;
    select.value = 'CFGS_EDUCACION_INFANTIL';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    (el.querySelectorAll('.mapa-tabs__curso')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    (el.querySelector('.mapa-header__main-row') as HTMLElement).click();
    fixture.detectChanges();

    expect(component.facade.activeTab()).toBe('CFGS_EDUCACION_INFANTIL_2');
    expect(el.querySelector('.mapa-header__title')?.textContent).toContain(
      'Mapa intermodular del CFGS Educació Infantil 2n',
    );
    expect(el.textContent).toContain('criteris d’avaluació de 2n curs');
    expect(el.textContent).toContain('Mòduls CFGS');
    expect(el.textContent).toContain('Propostes d’Activitats i Reptes CFGS');
    expect(el.textContent).toContain('Aprenentatges i Diversitat CFGS:');
    expect(el.querySelector('app-mapa-header')?.textContent).not.toContain('CFGM');
    expect(el.querySelector('app-activities-grid')?.textContent).not.toContain('CFGM');

    component.layout.language.set('castellano');
    fixture.detectChanges();
    expect(el.textContent).toContain('Propuestas de Actividades y Retos CFGS');
    expect(el.textContent).toContain('de 2.º curso');
  });

  it('should show skeleton loader when isLoadingSeed is true', () => {
    mockFacade.isLoadingSeed.set(true);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('app-skeleton-loader');
    expect(skeleton).not.toBeNull();

    // El contenido principal NO debe renderizarse mientras carga
    const accordions = fixture.nativeElement.querySelector('.mapa-vertical-accordions');
    expect(accordions).toBeNull();
  });

  it('should hide skeleton loader and show content when isLoadingSeed is false', () => {
    mockFacade.isLoadingSeed.set(false);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('app-skeleton-loader');
    expect(skeleton).toBeNull();

    const accordions = fixture.nativeElement.querySelector('.mapa-vertical-accordions');
    expect(accordions).not.toBeNull();
  });
  it('muestra el mapa de afinidades y no los pasos de FP en una pestaña de formato afinidades', async () => {
    const getAfinidades = vi.spyOn(TestBed.inject(AfinidadesEsoService), 'getAfinidades');
    getAfinidades.mockReturnValue(of(AFINIDADES_1));
    loadNivelesMock([...NIVELES_MOCK, { ...NIVEL_AFINIDADES, id: 'ESO_AFINIDADES' }]);
    const el = fixture.nativeElement as HTMLElement;
    expect(component.isAfinidades()).toBe(false);
    expect(el.querySelector('app-mapa-header')).toBeTruthy();
    expect(el.querySelector('app-afinidades-eso-view')).toBeNull();

    await component.facade.setTab('ESO_1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isAfinidades()).toBe(true);
    expect(el.querySelector('app-afinidades-eso-view')).toBeTruthy();
    expect(getAfinidades).toHaveBeenCalledWith('ESO_1');
    expect(el.querySelector('app-mapa-header')).toBeNull();
    expect(el.querySelector('app-modulo-list')).toBeNull();
    expect(el.querySelector('app-ra-detail')).toBeNull();
    expect(el.querySelector('app-connections-list')).toBeNull();
    expect(el.querySelectorAll('app-afinidad-card').length).toBe(2);

    await component.facade.setTab('FPB');
    fixture.detectChanges();
    expect(el.querySelector('app-afinidades-eso-view')).toBeNull();
    expect(el.querySelector('app-mapa-header')).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HistoryViewComponent } from './history-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HistoryViewComponent', () => {
  let component: HistoryViewComponent;
  let fixture: ComponentFixture<HistoryViewComponent>;
  let mockProjectsFacade: any;
  let mockAuthFacade: any;

  const project = (overrides: any = {}) => ({
    _id: '1',
    title: 'Proyecto',
    status: 'borrador',
    createdAt: new Date().toISOString(),
    modules: ['Mod1'],
    tipoNivel: 'FP_BASICA',
    ...overrides,
  });

  const translations = {
    historyTitle: 'History',
    courseLevelFP: 'FPB',
    courseLevelCFGM: 'CFGM',
    courseLevelCFGM_PELUQUERIA: 'CFGM Peluquería',
    courseLevelCFGMPeluqueria: 'CFGM Peluquería',
    courseLevelPDC: 'ESO',
    searchProjects: 'Search',
    historySearchPlaceholder: 'Buscar por palabras clave...',
    historyFilterModule: 'Módulo',
    historyFilterRa: 'RA',
    historyFilterAllModules: 'Todos los módulos',
    historyFilterAllRas: 'Todos los RA',
    historyResultsCount: 'resultados',
    noProjectsInSection: 'No hay proyectos en esta sección.',
    untitledProject: 'Proyecto sin título',
    retryBtn: 'Reintentar',
    viewError: 'Ver Error',
    openEditor: 'Abrir Editor',
    deleteFile: 'Borrar archivo',
    aiGemini: 'Primario',
    aiOpenRouter: 'Secundario',
    historyAllProjects: 'Todos los proyectos',
    historyMyProjects: 'Solo mis proyectos',
    historyAuthorLabel: 'Creado por',
    historyMyProjectBadge: 'Mío',
    historySharedBadge: 'Compartido',
    historySharedWith: 'Con',
    generatorCollaboratorsLabel: 'Compartir con (opcional)',
    generatorCollaboratorsEmpty: 'No hay otros usuarios disponibles.',
  };

  beforeEach(async () => {
    mockProjectsFacade = {
      projectsHistory: signal([]),
      historyTab: signal('FPB'),
      directory: signal([]),
      selectedCollaborators: signal([]),
      getCollaboratorNames: vi.fn().mockReturnValue([]),
      getCollaboratorIds: vi.fn().mockReturnValue([]),
      isShared: vi.fn().mockReturnValue(false),
      addCollaborator: vi.fn(),
      removeCollaborator: vi.fn(),
    };

    mockAuthFacade = {
      currentUser: signal({ _id: 'user1', name: 'Eva', role: 'teacher' }),
    };

    await TestBed.configureTestingModule({
      imports: [HistoryViewComponent],
      providers: [
        {
          provide: AppFacade,
          useValue: { viewPastProject: vi.fn(), deleteProject: vi.fn(), retryProject: vi.fn() },
        },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TranslationService, useValue: { t: signal(translations) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show empty message', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('No hay proyectos en esta sección.');
  });

  it('should render FP_BASICA projects by default', () => {
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'Proj FPB', tipoNivel: 'FP_BASICA' }),
      project({ _id: '2', title: 'Proj ESO', tipoNivel: 'DIVERSIFICACION_CURRICULAR' }),
    ]);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Proj FPB');
    expect(text).not.toContain('Proj ESO');
  });

  it('should filter by multiple keywords (AND) across content', () => {
    mockProjectsFacade.projectsHistory.set([
      project({
        _id: '1',
        title: 'Barbería moderna',
        generatedContent: { rawText: 'tendencias de corte' },
      }),
      project({
        _id: '2',
        title: 'Barbería clásica',
        generatedContent: { rawText: 'otro contenido' },
      }),
    ]);
    component.searchQuery.set('barbería corte');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Barbería moderna');
    expect(text).not.toContain('Barbería clásica');
  });

  it('should filter by module and RA', () => {
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'P1', modules: ['Modulo A'], ras: ['RA1'] }),
      project({ _id: '2', title: 'P2', modules: ['Modulo B'], ras: ['RA2'] }),
    ]);
    component.moduleFilter.set('Modulo A');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('P2');

    component.moduleFilter.set(null);
    component.raFilter.set('RA2');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('P2');
  });

  it('should render module and RA options and results count', () => {
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'P1', modules: ['Modulo A'], ras: ['RA1'] }),
    ]);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Módulo');
    expect(text).toContain('RA');
    expect(text).toContain('resultados');
  });

  it('should switch tab on click', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      '.history-view__tab',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('CFGM_PELUQUERIA');
  });

  it('should update search and module/ra filters from events', () => {
    component.onSearch({ target: { value: 'abc' } } as any);
    expect(component.searchQuery()).toBe('abc');

    component.onModuleChange('Modulo A');
    expect(component.moduleFilter()).toBe('Modulo A');

    component.onRaChange('RA1');
    expect(component.raFilter()).toBe('RA1');

    component.onModuleChange('');
    expect(component.moduleFilter()).toBeNull();
    expect(component.raFilter()).toBeNull();
  });

  it('should handle empty history, null user and label fallback', () => {
    mockProjectsFacade.projectsHistory.set(undefined);
    mockAuthFacade.currentUser.set(null);
    fixture.detectChanges();

    expect(component.moduleOptions()).toEqual([]);
    expect(component.raOptions()).toEqual([]);
    expect(component.filteredProjects()).toEqual([]);
    expect(component.labelFor('claveDesconocida')).toBe('claveDesconocida');

    component.onRaChange('');
    expect(component.raFilter()).toBeNull();
  });

  it('should wire toolbar DOM events', () => {
    const pills = fixture.nativeElement.querySelectorAll(
      '.history-view__pill',
    ) as NodeListOf<HTMLButtonElement>;
    pills[1].click();
    fixture.detectChanges();
    expect(component.onlyMine()).toBe(true);
    pills[0].click();
    fixture.detectChanges();
    expect(component.onlyMine()).toBe(false);

    const input = fixture.nativeElement.querySelector(
      '.history-view__search-input',
    ) as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    expect(component.searchQuery()).toBe('abc');

    const selects = fixture.debugElement.queryAll(By.css('app-select'));
    selects[0].triggerEventHandler('valueChange', 'Modulo A');
    expect(component.moduleFilter()).toBe('Modulo A');
    selects[1].triggerEventHandler('valueChange', 'RA1');
    expect(component.raFilter()).toBe('RA1');
  });
});

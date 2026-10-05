import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HistoryViewComponent } from './history-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LayoutService } from '../../../../services/layout.service';
import { NivelesService } from '../../../../services/niveles.service';
import { NIVELES_MOCK, NIVEL_FICTICIO, loadNivelesMock } from '../../../../testing/niveles.mock';

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
    levelsLoadError: 'No se ha podido cargar la lista de niveles educativos.',
    searchProjects: 'Search',
    historySearchPlaceholder: 'Buscar por palabras clave...',
    historySearchAllLevels: 'Buscando en todos los niveles',
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
      historyTab: signal('FP_BASICA'),
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
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    loadNivelesMock();
    TestBed.inject(LayoutService).language.set('castellano');

    fixture = TestBed.createComponent(HistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(LayoutService).language.set('castellano');
    localStorage.removeItem('pai_lang');
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

  it('should search in every tab, show the scope hint and rank title matches first', () => {
    mockProjectsFacade.projectsHistory.set([
      project({
        _id: '1',
        title: 'Otro',
        modules: [],
        generatedContent: { rawText: 'imatge al text' },
      }),
      project({ _id: '2', title: 'Imatge corporal', tipoNivel: 'CFGM_PELUQUERIA' }),
      project({ _id: '3', title: 'Sin relación' }),
    ]);
    component.activeTab.set('FP_BASICA');
    component.searchQuery.set('imatge');
    fixture.detectChanges();

    expect(component.filteredProjects().map((p: any) => p._id)).toEqual(['2', '1']);
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.history-view__tabs--searching')).toBeTruthy();
    expect(root.querySelector('.history-view__search-scope')?.textContent).toContain(
      'Buscando en todos los niveles',
    );

    component.searchQuery.set('');
    fixture.detectChanges();
    expect(component.filteredProjects().map((p: any) => p._id)).toEqual(['1', '3']);
    expect(root.querySelector('.history-view__search-scope')).toBeNull();
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
    buttons[2].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('CFGM_PELUQUERIA');
  });

  it('should show one tab per catalog level, in order and in the active language', () => {
    const labels = () =>
      Array.from(fixture.nativeElement.querySelectorAll('.history-view__tab')).map((b: any) =>
        b.textContent.trim(),
      );
    expect(labels()).toEqual([
      'CFGB Peluquería y Estética',
      'CFGM Estética y Belleza',
      'CFGM Peluquería y Cosmética Capilar',
      'CFGS Educación Infantil',
      'ESO',
      'ESO (PDC)',
    ]);
    TestBed.inject(LayoutService).language.set('catalan');
    fixture.detectChanges();
    expect(labels()[3]).toBe('CFGS Educació Infantil');
  });

  it('should put legacy projects without level in FP Básica and ESO ones in the PDC tab', () => {
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'Sin nivel', tipoNivel: undefined }),
      project({ _id: '2', title: 'PDC antiguo', tipoNivel: 'ESO' }),
      project({ _id: '3', title: 'PDC', tipoNivel: 'DIVERSIFICACION_CURRICULAR' }),
    ]);
    expect(component.filteredProjects().map((p: any) => p._id)).toEqual(['1']);
    component.activeTab.set('DIVERSIFICACION_CURRICULAR');
    expect(component.filteredProjects().map((p: any) => p._id)).toEqual(['2', '3']);
  });

  it('should add a tab and list the projects of a level added only to the catalog', () => {
    loadNivelesMock([...NIVELES_MOCK, NIVEL_FICTICIO]);
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'Proyecto ficticio', tipoNivel: 'CFGS_FICTICIO' }),
      project({ _id: '2', title: 'Proyecto FPB' }),
    ]);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('.history-view__tab');
    const last = tabs[tabs.length - 1] as HTMLButtonElement;
    expect(last.textContent?.trim()).toBe('CFGS Animación Ficticia');
    last.click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('CFGS_FICTICIO');
    expect(component.filteredProjects().map((p: any) => p.title)).toEqual(['Proyecto ficticio']);
  });

  it('should warn when the levels catalog could not be loaded', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.history-view__levels-error')).toBeNull();
    TestBed.inject(NivelesService).error.set(true);
    fixture.detectChanges();
    expect(root.querySelector('.history-view__levels-error')?.textContent).toContain(
      'No se ha podido cargar',
    );
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

  it('should handle empty history and null user', () => {
    mockProjectsFacade.projectsHistory.set(undefined);
    mockAuthFacade.currentUser.set(null);
    fixture.detectChanges();

    expect(component.moduleOptions()).toEqual([]);
    expect(component.raOptions()).toEqual([]);
    expect(component.filteredProjects()).toEqual([]);

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

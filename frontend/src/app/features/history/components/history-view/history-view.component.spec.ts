import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryViewComponent } from './history-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
    component.filters.searchQuery.set('barbería corte');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Barbería moderna');
    expect(text).not.toContain('Barbería clásica');
  });

  const levelSelect = () =>
    fixture.nativeElement.querySelector(
      '.history-filters__field--level select',
    ) as HTMLSelectElement;
  const chooseLevel = (id: string) => {
    levelSelect().value = id;
    levelSelect().dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };

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
    component.filters.activeTab.set('FP_BASICA');
    component.filters.searchQuery.set('imatge');
    fixture.detectChanges();

    expect(component.filters.filteredProjects().map((p: any) => p._id)).toEqual(['2', '1']);
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.history-filters--searching')).toBeTruthy();
    expect(root.querySelector('.history-view__search-scope')?.textContent).toContain(
      'Buscando en todos los niveles',
    );

    component.filters.searchQuery.set('');
    fixture.detectChanges();
    expect(component.filters.filteredProjects().map((p: any) => p._id)).toEqual(['1', '3']);
    expect(root.querySelector('.history-view__search-scope')).toBeNull();
  });

  it('should render the filters and results count', () => {
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'P1', modules: ['Modulo A'], ras: ['RA1'] }),
    ]);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Módulo');
    expect(text).toContain('RA');
    expect(text).toContain('resultados');
  });

  it('should switch level from the dropdown', () => {
    chooseLevel('CFGM_PELUQUERIA');
    expect(component.filters.activeTab()).toBe('CFGM_PELUQUERIA');
    expect(levelSelect().value).toBe('CFGM_PELUQUERIA');
  });

  it('should show one option per catalog level, in order and in the active language', () => {
    const labels = () => Array.from(levelSelect().options).map((o) => o.textContent?.trim());
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
    expect(component.filters.filteredProjects().map((p: any) => p._id)).toEqual(['1']);
    component.filters.activeTab.set('DIVERSIFICACION_CURRICULAR');
    expect(component.filters.filteredProjects().map((p: any) => p._id)).toEqual(['2', '3']);
  });

  it('should add an option and list the projects of a level added only to the catalog', () => {
    loadNivelesMock([...NIVELES_MOCK, NIVEL_FICTICIO]);
    mockProjectsFacade.projectsHistory.set([
      project({ _id: '1', title: 'Proyecto ficticio', tipoNivel: 'CFGS_FICTICIO' }),
      project({ _id: '2', title: 'Proyecto FPB' }),
    ]);
    fixture.detectChanges();
    const options = levelSelect().options;
    expect(options[options.length - 1].textContent?.trim()).toBe('CFGS Animación Ficticia');
    chooseLevel('CFGS_FICTICIO');
    expect(component.filters.activeTab()).toBe('CFGS_FICTICIO');
    expect(component.filters.filteredProjects().map((p: any) => p.title)).toEqual([
      'Proyecto ficticio',
    ]);
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

  it('should handle empty history and null user', () => {
    mockProjectsFacade.projectsHistory.set(undefined);
    mockAuthFacade.currentUser.set(null);
    fixture.detectChanges();
    expect(component.filters.filteredProjects()).toEqual([]);
  });

  it('should reload the curriculum index when the history opens', () => {
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/curriculum/filter-index').flush({ modules: [], items: [] });
    http.verify();
  });

  it('should wire toolbar DOM events', () => {
    const pills = fixture.nativeElement.querySelectorAll(
      '.history-view__pill',
    ) as NodeListOf<HTMLButtonElement>;
    pills[1].click();
    fixture.detectChanges();
    expect(component.filters.onlyMine()).toBe(true);
    pills[0].click();
    fixture.detectChanges();
    expect(component.filters.onlyMine()).toBe(false);

    const input = fixture.nativeElement.querySelector(
      '.history-view__search-input',
    ) as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    expect(component.filters.searchQuery()).toBe('abc');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalViewComponent } from './personal-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NIVELES_MOCK, NIVEL_FICTICIO, loadNivelesMock } from '../../../../testing/niveles.mock';
import { Project } from '../../../projects/models/project.model';

// Los tests usan proyectos parciales
const asProject = (p: object) => p as Project;

describe('PersonalViewComponent', () => {
  let component: PersonalViewComponent;
  let fixture: ComponentFixture<PersonalViewComponent>;

  const mockAppFacade = {
    viewPastProject: vi.fn(),
    retryProject: vi.fn(),
    deleteProject: vi.fn(),
  };

  const mockProjectsFacade = {
    myProjects: signal<any[]>([]),
    loadHistory: vi.fn(),
  };

  const mockAuthFacade = {
    currentUser: signal({ _id: 'u1', name: 'Eva', email: 'eva@test.com' }),
  };

  const mockLayoutService = {
    switchView: vi.fn(),
    language: signal<'castellano' | 'catalan'>('castellano'),
  };

  const mockTranslationService = {
    t: signal({
      personalTitle: 'Área Personal',
      personalSubtitle: 'Tus proyectos',
      personalTotalProjects: 'Total',
      personalDrafts: 'Borradores',
      personalPublished: 'Publicados',
      personalInQueue: 'En Cola',
      personalEmpty: 'No tienes proyectos',
      personalEmptyCta: 'Crear proyecto',
      personalFilterAll: 'Todos',
      personalFilterDrafts: 'Borradores',
      personalFilterPublished: 'Publicados',
      personalFilterErrors: 'Errores',
      personalSearchPlaceholder: 'Buscar...',
      createProjectBtn: 'Crear Proyecto',
      untitledProject: 'Sin título',
      aiGemini: 'Primario',
      aiOpenRouter: 'Secundario',
      retryBtn: 'Reintentar',
      viewError: 'Ver Error',
      openEditor: 'Abrir Editor',
      deleteFile: 'Borrar',
    }),
  };

  beforeEach(async () => {
    mockProjectsFacade.myProjects.set([]);
    mockLayoutService.language.set('castellano');
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PersonalViewComponent],
      providers: [
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: TranslationService, useValue: mockTranslationService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    loadNivelesMock();

    fixture = TestBed.createComponent(PersonalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse y cargar el historial en OnInit', () => {
    expect(component).toBeTruthy();
    expect(mockProjectsFacade.loadHistory).toHaveBeenCalled();
  });

  it('debería calcular métricas correctamente', () => {
    mockProjectsFacade.myProjects.set([
      { _id: '1', title: 'P1', status: 'borrador', tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'P2', status: 'publicado', tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
      { _id: '3', title: 'P3', status: 'en_cola', tipoNivel: 'FP_BASICA' },
      { _id: '4', title: 'P4', status: 'error', tipoNivel: 'FP_BASICA' },
    ]);
    fixture.detectChanges();

    expect(component.totalCount()).toBe(4);
    expect(component.draftsCount()).toBe(1);
    expect(component.publishedCount()).toBe(1);
    expect(component.inQueueCount()).toBe(1);
  });

  it('debería filtrar por nivel educativo mediante clicks en el DOM', () => {
    mockProjectsFacade.myProjects.set([
      { _id: '1', title: 'P1 FPB', tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'P2 CFGM', tipoNivel: 'CFGM_ESTETICA' },
      { _id: '2b', title: 'P2b CFGM Pel', tipoNivel: 'CFGM_PELUQUERIA' },
      { _id: '2c', title: 'P2c CFGS Inf', tipoNivel: 'CFGS_EDUCACION_INFANTIL' },
      { _id: '3', title: 'P3 ESO', tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
      { _id: '4', title: 'P4 ESO ordinaria', tipoNivel: 'ESO_ORDINARIA' },
    ]);
    fixture.detectChanges();

    const pills = fixture.nativeElement.querySelectorAll('.filter-bar .filter-pill');
    // Pills en el orden del catálogo: [ALL, FPB, CFGM, CFGM Pel, CFGS, ESO, ESO (PDC), ALL, estados…]
    const allPill = pills[0];
    const fpbPill = pills[1];
    const cfgmPill = pills[2];
    const cfgmPelPill = pills[3];
    const cfgsPill = pills[4];
    const esoOrdinariaPill = pills[5];
    const esoPill = pills[6];

    fpbPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('FP_BASICA');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('P1 FPB');

    cfgmPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('CFGM_ESTETICA');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('P2 CFGM');

    cfgmPelPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('CFGM_PELUQUERIA');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('P2b CFGM Pel');

    cfgsPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('CFGS_EDUCACION_INFANTIL');
    expect(component.filteredMyProjects().map((p) => p.title)).toEqual(['P2c CFGS Inf']);

    esoOrdinariaPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('ESO_ORDINARIA');
    expect(component.filteredMyProjects().map((p) => p.title)).toEqual(['P4 ESO ordinaria']);

    esoPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('DIVERSIFICACION_CURRICULAR');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('P3 ESO');

    allPill.click();
    fixture.detectChanges();
    expect(component.levelFilter()).toBe('ALL');
    expect(component.filteredMyProjects().length).toBe(6);
  });

  it('debería filtrar y etiquetar un nivel añadido solo al catálogo', () => {
    loadNivelesMock([...NIVELES_MOCK, NIVEL_FICTICIO]);
    mockProjectsFacade.myProjects.set([
      { _id: 'f', title: 'Ficticio', tipoNivel: 'CFGS_FICTICIO', courseLevel: '1º' },
      { _id: 'p', title: 'FPB', tipoNivel: 'FP_BASICA' },
    ]);
    fixture.detectChanges();
    const pills = fixture.nativeElement.querySelectorAll('.filter-bar .filter-pill');
    const ficticio = pills[7] as HTMLButtonElement;
    expect(ficticio.textContent?.trim()).toBe('CFGS Animación Ficticia');
    ficticio.click();
    fixture.detectChanges();
    expect(component.filteredMyProjects().map((p) => p.title)).toEqual(['Ficticio']);
    expect(fixture.nativeElement.textContent).toContain('1º CFGS Animación Ficticia');
  });

  it('debería nombrar los filtros de nivel con el catálogo en castellano y catalán', () => {
    const labels = () =>
      Array.from(fixture.nativeElement.querySelectorAll('.filter-bar .filter-pill'))
        .slice(1, 7)
        .map((b: any) => b.textContent.trim());
    expect(labels()).toEqual([
      'CFGB Peluquería y Estética',
      'CFGM Estética y Belleza',
      'CFGM Peluquería y Cosmética Capilar',
      'CFGS Educación Infantil',
      'ESO',
      'ESO (PDC)',
    ]);
    mockLayoutService.language.set('catalan');
    mockProjectsFacade.myProjects.set([
      { _id: 'd', title: 'Infantil', tipoNivel: 'CFGS_EDUCACION_INFANTIL', courseLevel: '2º' },
    ]);
    fixture.detectChanges();
    expect(labels()[3]).toBe('CFGS Educació Infantil');
    expect(fixture.nativeElement.textContent).toContain('2º CFGS Educació Infantil');
  });

  it('debería filtrar por estado del proyecto mediante clicks en el DOM', () => {
    mockProjectsFacade.myProjects.set([
      { _id: '1', title: 'P1', status: 'borrador' },
      { _id: '2', title: 'P2', status: 'publicado' },
      { _id: '3', title: 'P3', status: 'error' },
    ]);
    fixture.detectChanges();

    const pills = fixture.nativeElement.querySelectorAll('.filter-bar .filter-pill');
    // Status pills are indexes 7 (ALL), 8 (borrador), 9 (publicado), 10 (error)
    const borradorPill = pills[8];
    const publicadoPill = pills[9];
    const errorPill = pills[10];
    const allStatusPill = pills[7];

    borradorPill.click();
    fixture.detectChanges();
    expect(component.statusFilter()).toBe('borrador');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0]._id).toBe('1');

    publicadoPill.click();
    fixture.detectChanges();
    expect(component.statusFilter()).toBe('publicado');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0]._id).toBe('2');

    errorPill.click();
    fixture.detectChanges();
    expect(component.statusFilter()).toBe('error');
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0]._id).toBe('3');

    allStatusPill.click();
    fixture.detectChanges();
    expect(component.statusFilter()).toBe('ALL');
    expect(component.filteredMyProjects().length).toBe(3);
  });

  it('debería filtrar por búsqueda de texto y renderizar resultados', () => {
    mockProjectsFacade.myProjects.set([
      { _id: '1', title: 'Robótica y Sensores', modules: ['Tecno'], status: 'borrador' },
      { _id: '2', title: 'Cocina Mediterránea', modules: ['Hostelería'], status: 'publicado' },
      {
        _id: '3',
        title: null,
        modules: null,
        status: 'borrador',
        generatedContent: { modules: ['GenMod'] },
      },
    ]);
    fixture.detectChanges();

    component.searchQuery.set('robót');
    fixture.detectChanges();
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('Robótica y Sensores');

    component.searchQuery.set('hostelería');
    fixture.detectChanges();
    expect(component.filteredMyProjects().length).toBe(1);
    expect(component.filteredMyProjects()[0].title).toBe('Cocina Mediterránea');

    component.searchQuery.set('genmod');
    fixture.detectChanges();
    expect(component.filteredMyProjects().length).toBe(1);
  });

  it('debería llamar a las acciones desde los botones del DOM', () => {
    mockProjectsFacade.myProjects.set([
      {
        _id: '1',
        title: 'Proj Error',
        status: 'error',
        tipoNivel: 'FP_BASICA',
        usedAiProvider: 'openrouter',
        generationTimeMs: 14200,
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        title: 'Proj Borrador',
        status: 'borrador',
        tipoNivel: 'DIVERSIFICACION_CURRICULAR',
        usedAiProvider: 'gemini',
        generationTimeMs: 8100,
        createdAt: new Date().toISOString(),
      },
    ]);
    fixture.detectChanges();

    const headerCreateBtn = fixture.nativeElement.querySelector('.app-header button');
    headerCreateBtn.click();
    expect(mockLayoutService.switchView).toHaveBeenCalledWith('generator');

    const cardButtons = fixture.nativeElement.querySelectorAll('.card button');
    // Card 1 has Retry, View Error, Delete
    // Card 2 has Open Editor, Delete
    const retryBtn = cardButtons[0];
    const viewErrorBtn = cardButtons[1];
    const deleteBtn1 = cardButtons[2];
    const openEditorBtn = cardButtons[3];
    const deleteBtn2 = cardButtons[4];

    retryBtn.click();
    expect(mockAppFacade.retryProject).toHaveBeenCalled();

    viewErrorBtn.click();
    expect(mockAppFacade.viewPastProject).toHaveBeenCalled();

    deleteBtn1.click();
    expect(mockAppFacade.deleteProject).toHaveBeenCalledWith('1');

    openEditorBtn.click();
    expect(mockAppFacade.viewPastProject).toHaveBeenCalled();

    deleteBtn2.click();
    expect(mockAppFacade.deleteProject).toHaveBeenCalledWith('2');
  });

  it('debería mostrar mensaje de error cuando el estado es error y existe errorDetail', () => {
    mockProjectsFacade.myProjects.set([
      {
        _id: 'err1',
        title: 'Error Proj',
        status: 'error',
        errorDetail: 'Error de prueba en personal',
        createdAt: new Date().toISOString(),
      },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('⚠️ Error: Error de prueba en personal');
  });

  it('debería renderizar curso, niveles CFGM, módulos generados y error sin detalle', () => {
    const createdAt = new Date().toISOString();
    mockProjectsFacade.myProjects.set([
      {
        _id: 'a',
        title: 'Estética',
        status: 'en_cola',
        tipoNivel: 'CFGM_ESTETICA',
        courseLevel: '1º',
        generatedContent: { modules: ['Maquillaje'] },
        createdAt,
      },
      { _id: 'b', title: 'Pelu', status: 'generando', tipoNivel: 'CFGM_PELUQUERIA', createdAt },
      {
        _id: 'd',
        title: 'Infantil',
        status: 'borrador',
        tipoNivel: 'CFGS_EDUCACION_INFANTIL',
        courseLevel: '2º',
        createdAt,
      },
      { _id: 'c', title: 'Fallo', status: 'error', error: 'Fallo genérico', createdAt },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('1º CFGM Estética y Belleza');
    expect(text).toContain('2º CFGS Educación Infantil');
    expect(text).toContain('Maquillaje');
    expect(text).toContain('⚠️ Error: Fallo genérico');
  });

  it('debería mostrar estado vacío y permitir click en el botón de creación', () => {
    mockProjectsFacade.myProjects.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No tienes proyectos');
    const emptyCtaBtn = fixture.nativeElement.querySelector('.card button');
    emptyCtaBtn.click();
    expect(mockLayoutService.switchView).toHaveBeenCalledWith('generator');
  });

  it('debería manejar getDisplayTitle y getAiProviderLabel', () => {
    expect(component.getDisplayTitle(asProject({ title: 'Mi Proyecto' }))).toBe('Mi Proyecto');
    expect(
      component.getDisplayTitle(asProject({ title: 'Proyecto Generado', modules: ['M1', 'M2'] })),
    ).toBe('M1 + M2');
    expect(component.getDisplayTitle(asProject({}))).toBe('Sin título');

    expect(component.getAiProviderLabel(asProject({ usedAiProvider: 'openrouter' }))).toBe(
      'Secundario',
    );
    expect(component.getAiProviderLabel(asProject({ usedAiProvider: 'gemini' }))).toBe('Primario');
    expect(component.getAiProviderLabel(asProject({ usedModel: 'openrouter/mistral' }))).toBe(
      'Secundario',
    );
    expect(component.getAiProviderLabel(asProject({ usedModel: 'gemini-3.6' }))).toBe('Primario');
    expect(component.getAiProviderLabel(asProject({}))).toBeNull();
  });
});

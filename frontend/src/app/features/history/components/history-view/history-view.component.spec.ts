import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let mockAppFacade: any;
  let mockProjectsFacade: any;
  let mockAuthFacade: any;
  let mockTranslationService: any;

  beforeEach(async () => {
    mockAppFacade = {
      viewPastProject: vi.fn(),
      deleteProject: vi.fn(),
      retryProject: vi.fn(),
    };

    mockProjectsFacade = {
      projectsHistory: signal([]),
      historyTab: signal('FPB'),
    };

    mockAuthFacade = {
      currentUser: signal({ _id: 'user1', name: 'Eva' })
    };

    mockTranslationService = {
      t: signal({
        historyTitle: 'History',
        courseLevelFP: 'FPB',
        courseLevelCFGM: 'CFGM',
        courseLevelPDC: 'ESO',
        searchProjects: 'Search',
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
        historyMyProjectBadge: 'Mío'
      })
    };

    await TestBed.configureTestingModule({
      imports: [HistoryViewComponent],
      providers: [
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TranslationService, useValue: mockTranslationService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message when projectsHistory is empty', () => {
    mockProjectsFacade.projectsHistory.set([]);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('No hay proyectos en esta sección.');
  });

  it('should resolve display title using selected modules when title is generic', () => {
    expect(component.getDisplayTitle({ title: 'Proyecto Integrador', modules: ['ModA', 'ModB'] })).toBe('ModA + ModB');
    expect(component.getDisplayTitle({ title: 'Mi Proyecto', modules: ['ModA'] })).toBe('Mi Proyecto');
    expect(component.getDisplayTitle({ title: '', modules: [] })).toBe('Proyecto sin título');
  });

  it('should render FP_BASICA projects by default', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj FPB', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA', usedModel: 'gemini-3.6-flash', generationTimeMs: 12400 },
      { _id: '2', title: 'Proj ESO', status: 'borrador', createdAt: new Date().toISOString(), tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Proj FPB');
    expect(element.textContent).toContain('Primario');
    expect(element.textContent).toContain('12.4s');
    expect(element.textContent).not.toContain('gemini-3.6-flash');
    expect(element.textContent).not.toContain('Proj ESO');
  });

  it('should return correct provider label or null in getAiProviderLabel', () => {
    // usedAiProvider openrouter
    expect(component.getAiProviderLabel({ usedAiProvider: 'openrouter' })).toBe('Secundario');
    // aiProvider gemini
    expect(component.getAiProviderLabel({ aiProvider: 'gemini' })).toBe('Primario');
    // usedModel gemini
    expect(component.getAiProviderLabel({ usedModel: 'gemini-3.6-flash' })).toBe('Primario');
    // usedModel openrouter / meta-llama
    expect(component.getAiProviderLabel({ usedModel: 'meta-llama/llama-3.3-70b-instruct:free' })).toBe('Secundario');
    // none
    expect(component.getAiProviderLabel({})).toBeNull();
  });

  it('should switch to CFGM tab and show CFGM projects via click', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj FPB', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj CFGM', status: 'publicado', createdAt: new Date().toISOString(), modules: ['0633'], tipoNivel: 'CFGM_ESTETICA' },
      { _id: '3', title: 'Proj ESO', status: 'borrador', createdAt: new Date().toISOString(), tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.history-tab');
    expect(buttons.length).toBe(3);
    buttons[1].click(); // Click on CFGM tab
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(component.activeTab()).toBe('CFGM');
    expect(element.textContent).toContain('Proj CFGM');
    expect(element.textContent).not.toContain('Proj FPB');
    expect(element.textContent).not.toContain('Proj ESO');
  });

  it('should switch to ESO tab and show ESO projects via click', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj FPB', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj CFGM', status: 'publicado', createdAt: new Date().toISOString(), modules: ['0633'], tipoNivel: 'CFGM_ESTETICA' },
      { _id: '3', title: 'Proj ESO', status: 'borrador', createdAt: new Date().toISOString(), tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.history-tab');
    buttons[2].click(); // Click on ESO tab
    fixture.detectChanges();
    
    const element = fixture.nativeElement;
    expect(component.activeTab()).toBe('ESO');
    expect(element.textContent).toContain('Proj ESO');
    expect(element.textContent).not.toContain('Proj FPB');
    expect(element.textContent).not.toContain('Proj CFGM');
  });

  it('should filter projects by search query and test fallbacks', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Manzanas', status: 'publicado', createdAt: new Date().toISOString(), generatedContent: { modules: ['Math'] }, tipoNivel: 'FP_BASICA' },
      { _id: '2', title: '', status: 'borrador', createdAt: new Date().toISOString(), modules: null, tipoNivel: 'FP_BASICA' },
    ]);
    
    component.searchQuery.set('manzanas');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Manzanas');
    
    // search by generatedContent.modules
    component.searchQuery.set('math');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Manzanas');

    // search by Varios fallback
    component.searchQuery.set('varios');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Proyecto sin título');
  });

  it('should call viewPastProject and retryProject when buttons are clicked', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'borrador', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj 2', status: 'error', createdAt: new Date().toISOString(), tipoNivel: 'FP_BASICA' },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.card button');
    
    buttons[0].click(); // Open Editor for borrador
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[0]);
    
    buttons[2].click(); // Retry for error
    expect(mockAppFacade.retryProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[1]);

    buttons[3].click(); // View Error for error
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[1]);
  });

  it('should display error message when project status is error and errorDetail exists', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: 'err1', title: 'Error Proj', status: 'error', errorDetail: 'Timeout conectando con API', createdAt: new Date().toISOString(), tipoNivel: 'FP_BASICA' }
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('⚠️ Error: Timeout conectando con API');
  });

  it('should call deleteProject when delete button is clicked', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' }
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.card button');
    buttons[1].click(); // Delete button
    expect(mockAppFacade.deleteProject).toHaveBeenCalledWith('1');
  });
  
  it('should update search query on input', () => {
    const input = fixture.nativeElement.querySelector('.search-input');
    input.value = 'test search';
    input.dispatchEvent(new Event('input'));
    expect(component.searchQuery()).toBe('test search');
  });

  it('should handle author name, isMyProject, and onlyMine filtering', () => {
    const projOwn = { _id: '1', title: 'Own Project', tipoNivel: 'FP_BASICA', userId: { _id: 'user1', name: 'Eva' } };
    const projOther = { _id: '2', title: 'Other Project', tipoNivel: 'FP_BASICA', userId: { _id: 'user2', name: 'Pepe' } };
    mockProjectsFacade.projectsHistory.set([projOwn, projOther]);
    fixture.detectChanges();

    expect(component.getAuthorName(projOwn)).toBe('Eva');
    expect(component.getAuthorName({})).toBeNull();
    expect(component.isMyProject(projOwn)).toBe(true);
    expect(component.isMyProject(projOther)).toBe(false);

    expect(component.filteredProjects().length).toBe(2);

    // Toggle onlyMine via DOM button clicks
    const pills = fixture.nativeElement.querySelectorAll('.filter-pill');
    pills[1].click(); // Solo mis proyectos
    fixture.detectChanges();
    expect(component.onlyMine()).toBe(true);
    expect(component.filteredProjects().length).toBe(1);
    expect(component.filteredProjects()[0].title).toBe('Own Project');

    pills[0].click(); // Todos los proyectos
    fixture.detectChanges();
    expect(component.onlyMine()).toBe(false);
    expect(component.filteredProjects().length).toBe(2);

    // Switch tabs via DOM
    const tabs = fixture.nativeElement.querySelectorAll('.history-tab');
    tabs[0].click(); // FPB
    fixture.detectChanges();
    expect(component.activeTab()).toBe('FPB');

    // Search by author
    component.searchQuery.set('pepe');
    expect(component.filteredProjects().length).toBe(1);
    expect(component.filteredProjects()[0].title).toBe('Other Project');
  });

  it('should handle isMyProject with null user or id fallback', () => {
    const proj = { _id: '1', userId: 'user99' };
    
    // User null
    mockAuthFacade.currentUser.set(null);
    expect(component.isMyProject(proj)).toBe(false);

    // User with id instead of _id and string userId
    mockAuthFacade.currentUser.set({ id: 'user99' });
    expect(component.isMyProject(proj)).toBe(true);
  });
});

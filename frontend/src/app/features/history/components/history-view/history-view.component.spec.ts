import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryViewComponent } from './history-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HistoryViewComponent', () => {
  let component: HistoryViewComponent;
  let fixture: ComponentFixture<HistoryViewComponent>;
  let mockAppFacade: any;
  let mockProjectsFacade: any;
  let mockTranslationService: any;

  beforeEach(async () => {
    mockAppFacade = {
      viewPastProject: vi.fn(),
      deleteProject: vi.fn(),
    };

    mockProjectsFacade = {
      projectsHistory: signal([]),
    };

    mockTranslationService = {
      t: signal({
        historyTitle: 'History',
        courseLevelFP: 'FPB',
        courseLevelPDC: 'ESO',
        searchProjects: 'Search',
        noProjectsInSection: 'No hay proyectos en esta sección.',
        untitledProject: 'Proyecto sin título',
        viewError: 'Ver Error',
        openEditor: 'Abrir Editor',
        deleteFile: 'Borrar archivo'
      })
    };

    await TestBed.configureTestingModule({
      imports: [HistoryViewComponent],
      providers: [
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
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

  it('should render FP_BASICA projects by default', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj FPB', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj ESO', status: 'borrador', createdAt: new Date().toISOString(), tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Proj FPB');
    expect(element.textContent).not.toContain('Proj ESO');
  });

  it('should switch to ESO tab and show ESO projects via click', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj FPB', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj ESO', status: 'borrador', createdAt: new Date().toISOString(), tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.history-tab');
    buttons[1].click(); // Click on ESO tab
    fixture.detectChanges();
    
    const element = fixture.nativeElement;
    expect(component.activeTab()).toBe('ESO');
    expect(element.textContent).toContain('Proj ESO');
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

  it('should call viewPastProject when Open Editor or View Error is clicked', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'borrador', createdAt: new Date().toISOString(), modules: ['Mod1'], tipoNivel: 'FP_BASICA' },
      { _id: '2', title: 'Proj 2', status: 'error', createdAt: new Date().toISOString(), tipoNivel: 'FP_BASICA' },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.card button');
    
    buttons[0].click(); // Open Editor for borrador
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[0]);
    
    buttons[2].click(); // View Error
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[1]);
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
});

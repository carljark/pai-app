import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDashboardComponent } from './home-dashboard.component';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('HomeDashboardComponent', () => {
  let component: HomeDashboardComponent;
  let fixture: ComponentFixture<HomeDashboardComponent>;

  const mockProjectsFacade = {
    loadHistory: vi.fn(),
    projectsHistory: signal([])
  };

  const mockAuthFacade = {
    currentUser: signal({ name: 'TestUser' })
  };

  const mockTranslationService = {
    t: signal({
      homeTitle: 'Title',
      homeGreeting: 'Greeting',
      homeDescription: 'Description',
      homePill1: 'Pill1',
      homePill2: 'Pill2',
      homePill3: 'Pill3',
      homePill4: 'Pill4',
      homeNewProject: 'New Project',
      homeViewHistory: 'View History',
      homeRecentTitle: 'Recent',
      homeEmpty: 'Empty',
      homeStartNow: 'Start',
      homeDefaultModules: 'Default Modules',
      homeOpen: 'Open',
      statusPublished: 'Published',
      statusDraft: 'Draft',
      statusQueued: 'Queued',
      statusGenerating: 'Generating',
      statusError: 'Error'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDashboardComponent],
      providers: [
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load history on init', () => {
    expect(mockProjectsFacade.loadHistory).toHaveBeenCalled();
  });

  it('should get current user name', () => {
    expect(component.userName()).toBe('TestUser');
  });

  it('should get default user name if null', () => {
    mockAuthFacade.currentUser.set(null as any);
    expect(component.userName()).toBe('Docente');
  });

  it('should slice and sort recent projects', () => {
    const mockProjects = [
      { _id: '1', createdAt: '2023-01-01T00:00:00Z', status: 'publicado' },
      { _id: '2', createdAt: '2023-01-03T00:00:00Z', status: 'borrador' },
      { _id: '3', createdAt: '2023-01-02T00:00:00Z', status: 'error' },
      { _id: '4', createdAt: '2023-01-05T00:00:00Z', status: 'en_cola' },
      { _id: '5', createdAt: '2023-01-04T00:00:00Z', status: 'generando' },
      { _id: '6', createdAt: '2023-01-06T00:00:00Z', status: 'borrador' }
    ];
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    
    const recent = component.recentProjects();
    expect(recent.length).toBe(5);
    expect(recent[0]._id).toBe('6');
    expect(recent[1]._id).toBe('4');
  });

  it('should format status label', () => {
    expect(component.statusLabel('publicado')).toBe('Published');
    expect(component.statusLabel('borrador')).toBe('Draft');
    expect(component.statusLabel('en_cola')).toBe('Queued');
    expect(component.statusLabel('generando')).toBe('Generating');
    expect(component.statusLabel('error')).toBe('Error');
    expect(component.statusLabel('unknown')).toBe('unknown');
  });

  it('should emit navigate event on new project click', () => {
    const spy = vi.spyOn(component.navigate, 'emit');
    const btn = fixture.debugElement.nativeElement.querySelector('.home-cta--primary');
    btn.click();
    expect(spy).toHaveBeenCalledWith('generator');
  });

  it('should emit navigate event on history click', () => {
    const spy = vi.spyOn(component.navigate, 'emit');
    const btn = fixture.debugElement.nativeElement.querySelector('.home-cta--secondary');
    btn.click();
    expect(spy).toHaveBeenCalledWith('history');
  });

  it('should emit openProject on project click', () => {
    const mockProjects = [{ _id: '1', createdAt: '2023-01-01T00:00:00Z', status: 'publicado' }];
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    fixture.detectChanges();
    
    const spy = vi.spyOn(component.openProject, 'emit');
    const card = fixture.debugElement.nativeElement.querySelector('.home-project-card');
    card.click();
    expect(spy).toHaveBeenCalledWith(mockProjects[0]);
  });
  
  it('should show "ver todos los proyectos" if more than 5', () => {
    const mockProjects = Array(6).fill({ _id: '1', createdAt: '2023-01-01T00:00:00Z', status: 'publicado' });
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    fixture.detectChanges();
    
    const ghostBtn = fixture.debugElement.nativeElement.querySelector('.home-cta--ghost');
    expect(ghostBtn).toBeTruthy();
    
    const spy = vi.spyOn(component.navigate, 'emit');
    ghostBtn.click();
    expect(spy).toHaveBeenCalledWith('history');
  });

  it('should handle project level label correctly', () => {
    const mockProjects = [
      { _id: '1', createdAt: '2023-01-01T00:00:00Z', status: 'publicado', tipoNivel: 'DIVERSIFICACION_CURRICULAR' },
      { _id: '2', createdAt: '2023-01-01T00:00:00Z', status: 'publicado', tipoNivel: 'FP_BASICA' }
    ];
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    fixture.detectChanges();

    const levels = fixture.debugElement.nativeElement.querySelectorAll('.home-project-card__level');
    expect(levels[0].textContent).toContain('ESO (PDC)');
    expect(levels[1].textContent).toContain('FP Básica');
  });
});

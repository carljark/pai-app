import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDashboardComponent } from './home-dashboard.component';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LayoutService } from '../../../../services/layout.service';
import { loadNivelesMock } from '../../../../testing/niveles.mock';

describe('HomeDashboardComponent', () => {
  let component: HomeDashboardComponent;
  let fixture: ComponentFixture<HomeDashboardComponent>;

  const mockProjectsFacade = {
    loadHistory: vi.fn(),
    projectsHistory: signal([]),
  };

  const mockAuthFacade = {
    currentUser: signal({ name: 'TestUser' }),
  };

  const mockTranslationService = {
    t: signal({
      homeTitle: 'Title',
      homeGreeting: 'Greeting',
      homeTagline: 'Tagline',
      homePill1: 'Pill1',
      homePill2: 'Pill2',
      homePill3: 'Pill3',
      homePill4: 'Pill4',
      homeNewProject: 'New Project',
      homeViewHistory: 'View History',
      defaultUser: 'Docente',
      workshopViewAll: 'Ver todos los proyectos',

      homeRecentTitle: 'Recent',
      homeEmpty: 'Empty',
      homeStartNow: 'Start',
      homeDefaultModules: 'Default Modules',
      homeOpen: 'Open',
      statusPublished: 'Published',
      statusDraft: 'Draft',
      statusQueued: 'Queued',
      statusGenerating: 'Generating',
      statusError: 'Error',
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDashboardComponent],
      providers: [
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TranslationService, useValue: mockTranslationService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    loadNivelesMock();

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

  it('should render the greeting as headline with the tagline and the intro section', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1.home-hero__greeting')?.textContent).toContain(
      'Greeting, TestUser',
    );
    expect(root.querySelector('.home-hero__tagline')?.textContent).toContain('Tagline');
    expect(root.querySelector('app-home-intro')).toBeTruthy();
    expect(root.querySelector('.home-hero__word')).toBeTruthy();
    expect(root.querySelector('.home-hero__logo')).toBeTruthy();
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
      { _id: '6', createdAt: '2023-01-06T00:00:00Z', status: 'borrador' },
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

  it('should emit openProject with Enter only when the card itself has the focus', () => {
    const mockProjects = [{ _id: '1', createdAt: '2023-01-01T00:00:00Z', status: 'publicado' }];
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    fixture.detectChanges();

    const spy = vi.spyOn(component.openProject, 'emit');
    const card = fixture.debugElement.nativeElement.querySelector('.home-project-card');
    const enter = () => new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

    card.querySelector('.home-project-card__header').dispatchEvent(enter());
    expect(spy).not.toHaveBeenCalled();
    card.dispatchEvent(enter());
    expect(spy).toHaveBeenCalledWith(mockProjects[0]);
  });

  it('should show "ver todos los proyectos" if more than 5', () => {
    const mockProjects = Array(6).fill({
      _id: '1',
      createdAt: '2023-01-01T00:00:00Z',
      status: 'publicado',
    });
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
      {
        _id: '1',
        createdAt: '2023-01-01T00:00:00Z',
        status: 'publicado',
        tipoNivel: 'DIVERSIFICACION_CURRICULAR',
      },
      { _id: '2', createdAt: '2023-01-01T00:00:00Z', status: 'publicado', tipoNivel: 'FP_BASICA' },
      {
        _id: '3',
        createdAt: '2023-01-01T00:00:00Z',
        status: 'publicado',
        tipoNivel: 'CFGS_EDUCACION_INFANTIL',
        courseLevel: '2º',
      },
    ];
    mockProjectsFacade.projectsHistory.set(mockProjects as any);
    fixture.detectChanges();

    const levels = fixture.debugElement.nativeElement.querySelectorAll('.home-project-card__level');
    expect(levels[0].textContent).toContain('ESO (PDC)');
    expect(levels[1].textContent).toContain('CFGB Peluquería y Estética');
    expect(levels[2].textContent).toContain('2º CFGS Educación Infantil');

    const layout = TestBed.inject(LayoutService);
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(levels[2].textContent).toContain('2º CFGS Educació Infantil');
    layout.language.set('castellano');
    localStorage.removeItem('pai_lang');
  });
});

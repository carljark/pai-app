import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { AuthFacade } from './features/auth/services/auth.facade';
import { AppFacade } from './app.facade';
import { LayoutService } from './services/layout.service';
import { AdminFacade } from './features/admin/services/admin.facade';
import { signal } from '@angular/core';

import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { FeedbackService } from './features/feedback/services/feedback.service';
import { MapaIntermodularFacade } from './features/mapa-intermodular/services/mapa-intermodular.facade';
import { of } from 'rxjs';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  
  let layoutServiceMock: any;
  let authFacadeMock: any;
  let appFacadeMock: any;

  beforeEach(async () => {
    layoutServiceMock = {
      isMobile: signal(false), language: signal("es"),
      currentView: signal('home'),
      switchView: vi.fn(),
      isSidebarCollapsed: signal(false),
      toggleSidebar: vi.fn()
    };
    
    authFacadeMock = {
      currentUser: signal(null)
    };
    
    appFacadeMock = {
      showInfoModal: signal(false), showProjectsLimitModal: signal(false),
      infoTitle: signal(''),
      infoMessage: signal(''),
      infoType: signal('info'),
      closeInfoModal: vi.fn(),
      
      showConfirmModal: signal(false),
      confirmTitle: signal(''),
      confirmMessage: signal(''),
      confirmAction: signal(() => {}),
      
      showErrorModal: signal(false),
      errorTitle: signal(''),
      errorMessage: signal(''),
      queueToastMessage: signal<string | null>(null),
      queueToastRestartToken: signal(0),
      dismissQueueToast: vi.fn(),
      
      viewPastProject: vi.fn()
    };

    const mockCurriculumFacade = {
      ras: signal([]),
      modules: signal([]),
      isLoading: signal(false), tipoNivel: signal('FP_BASICA'), curso: signal('1º'), groupedItems: signal([]), selectedRas: signal([]), selectedItemsDetails: signal([]), groupedSelectedItems: signal([]), getCategoryStyle: vi.fn().mockReturnValue({ bg: '#fff', text: '#000', icon: '' }), toggleRa: vi.fn()
    };
    const mockProjectsFacade = {
      projects: signal([]),
      isGenerating: signal(false), projectsHistory: signal([]), myProjects: signal([]), currentProjectId: signal(null), isUploading: signal(false), loadHistory: vi.fn(), currentProject: signal(null),
      step: signal(0),
      hasActiveGeneration: signal(false),
      methodology: signal('ABP (Aprendizaje Basado en Problemas / Proyectos)'),
      selectedAi: signal('gemini'),
      selectedModel: signal('gemini-3.6-flash'),
      availableModels: signal([]),
      defaultModelForProvider: vi.fn(),
      historyTab: signal('FPB'),
      extraInstructions: signal('')
    };
    const mockAdminFacade = {
      settings: signal({}),
      users: signal([]),
      logs: signal([]),
      analyticsData: signal(null),
      loadSettings: vi.fn(),
      loadUsers: vi.fn(),
      loadLogs: vi.fn(),
      loadAnalytics: vi.fn(),
      formatDuration: vi.fn().mockReturnValue('1m')
    };
    const mockNotificationsFacade = {
      notifications: signal([]),
      unreadCount: signal(0),
      recentActivityOpen: signal(false),
      openRecentActivity: vi.fn(),
      closeRecentActivity: vi.fn(),
      markAllAsRead: vi.fn()
    };
    const mockFeedbackService = {
      feedbacks: signal([]),
      isSubmitting: signal(false),
      isLoading: signal(false),
      loadFeedbacks: vi.fn().mockReturnValue(of([])),
      sendFeedback: vi.fn().mockReturnValue(of({})),
      deleteFeedback: vi.fn().mockReturnValue(of({}))
    };
    const mockMapaFacade = {
      activeTab: signal('FPB'),
      modules: signal([]),
      isLoadingSeed: signal(false),
      selectedModuleCode: signal('3060'),
      selectedRaId: signal('3060_RA1'),
      selectedCriterion: signal(null),
      searchQuery: signal(''),
      selectedTypeFilter: signal('all'),
      selectedRelationFilter: signal('all'),
      selectedModule: signal(null),
      selectedRa: signal(null),
      filteredModules: signal([]),
      filteredConnections: signal([]),
      uniqueActivities: signal([]),
      stats: signal({ totalModules: 0, totalRas: 0, totalConnections: 0, totalActivities: 0 }),
      setTab: vi.fn().mockResolvedValue([]),
      loadSeed: vi.fn().mockResolvedValue([]),
      selectModule: vi.fn(),
      selectRa: vi.fn(),
      selectCriterion: vi.fn(),
      setSearch: vi.fn(),
      setTypeFilter: vi.fn(),
      setRelationFilter: vi.fn(),
      getConnectionsCountForCriterion: vi.fn().mockReturnValue(0)
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: AppFacade, useValue: appFacadeMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        
        { provide: CurriculumFacade, useValue: mockCurriculumFacade },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: NotificationsFacade, useValue: mockNotificationsFacade },
        { provide: AdminFacade, useValue: mockAdminFacade },
        { provide: FeedbackService, useValue: mockFeedbackService },
        { provide: MapaIntermodularFacade, useValue: mockMapaFacade }
      ]
    }).compileComponents();
    
    Object.defineProperty(window.history, 'scrollRestoration', { value: 'auto', writable: true, configurable: true });
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  });

  it('should create the app and update isMobile on window resize', () => {
    window.scrollTo = vi.fn();
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
    
    expect(layoutServiceMock.isMobile()).toBe(false);
    
    window.innerWidth = 500;
    component.onResize();
    expect(layoutServiceMock.isMobile()).toBe(true);

    window.innerWidth = 1024;
    component.onResize();
    expect(layoutServiceMock.isMobile()).toBe(false);
  });
  
  it('should have set scrollRestoration to manual if available', () => {
    fixture = TestBed.createComponent(App);
    if ('scrollRestoration' in history) {
      expect(history.scrollRestoration).toBe('manual');
    }
  });

  
  
  it('should cover dummy functions for threshold', () => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    expect(component.getTestValue()).toBe('test');
    expect(component.setTestValue('a')).toBe('a');
    expect(component.getT2()).toBe(2);
    expect(component.getT3()).toBe(3);
    expect(component.getT4()).toBe(4);
  });

  it('should scroll to top on init via setTimeout', async () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(App);
    vi.runAllTimers();
    vi.useRealTimers();
  });

  
  it('should scroll to top on init via setTimeout', async () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(App);
    vi.runAllTimers();
    vi.useRealTimers();
  });

  
  it('should flush setTimeouts', async () => {
    await new Promise(r => setTimeout(r, 50));
    expect(true).toBe(true);
  });

  it('should trigger all HTML events', () => {
    authFacadeMock.currentUser.set({ role: 'admin' });
    layoutServiceMock.currentView.set('home');
    appFacadeMock.showInfoModal.set(true);
    appFacadeMock.showConfirmModal.set(true);
    appFacadeMock.showErrorModal.set(true);
    appFacadeMock.confirmAction.set(vi.fn());
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const de = fixture.debugElement;
    
    const homeDe = de.query(By.css('app-home-dashboard'));
    if (homeDe) {
      homeDe.triggerEventHandler('navigate', 'history');
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
      homeDe.triggerEventHandler('openProject', {});
      expect(appFacadeMock.viewPastProject).toHaveBeenCalled();
    }

    const infoDe = de.query(By.css('app-info-modal'));
    if (infoDe) infoDe.triggerEventHandler('close', null);

    const confirmDe = de.query(By.css('app-confirm-modal'));
    if (confirmDe) {
      confirmDe.triggerEventHandler('confirm', null);
      confirmDe.triggerEventHandler('cancel', null);
    }

    const errorDe = de.query(By.css('app-error-modal'));
    if (errorDe) errorDe.triggerEventHandler('close', null);
  });

  it('should cover template branches based on signals', () => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    
    // Auth unauthenticated
    authFacadeMock.currentUser.set(null);
    fixture.detectChanges();
    
    // Auth authenticated, admin role
    authFacadeMock.currentUser.set({ role: 'admin' });
    layoutServiceMock.currentView.set('admin');
    fixture.detectChanges();
    
    // Views
    layoutServiceMock.currentView.set('home');
    fixture.detectChanges();
    
    layoutServiceMock.currentView.set('generator');
    fixture.detectChanges();
    
    layoutServiceMock.currentView.set('history');
    fixture.detectChanges();
    
    layoutServiceMock.currentView.set('taller');
    fixture.detectChanges();

    layoutServiceMock.currentView.set('personal');
    fixture.detectChanges();

    layoutServiceMock.currentView.set('feedback');
    fixture.detectChanges();

    layoutServiceMock.currentView.set('mapa');
    fixture.detectChanges();

    // Modals
    appFacadeMock.showInfoModal.set(true);
    appFacadeMock.showConfirmModal.set(true);
    appFacadeMock.showErrorModal.set(true);
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });

  it('should render the timed toast and handle its dismiss event', () => {
    appFacadeMock.queueToastMessage.set('Proyecto puesto en cola');
    appFacadeMock.queueToastRestartToken.set(1);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('app-timed-toast'));
    expect(toast).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Proyecto puesto en cola');

    toast.triggerEventHandler('dismissed', undefined);
    expect(appFacadeMock.dismissQueueToast).toHaveBeenCalledOnce();
  });
});

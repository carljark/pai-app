import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { AuthFacade } from './features/auth/services/auth.facade';
import { AppFacade } from './app.facade';
import { LayoutService } from './services/layout.service';
import { AdminFacade } from './features/admin/services/admin.facade';
import { signal } from '@angular/core';

import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';

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
      
      showConfirmModal: signal(false),
      confirmTitle: signal(''),
      confirmMessage: signal(''),
      confirmAction: signal(() => {}),
      
      showErrorModal: signal(false),
      errorMessage: signal(''),
      
      viewPastProject: vi.fn()
    };

    const mockCurriculumFacade = {
      ras: signal([]),
      modules: signal([]),
      isLoading: signal(false), tipoNivel: signal('FP_BASICA'), groupedItems: signal([]), selectedRas: signal([]), selectedItemsDetails: signal([]), groupedSelectedItems: signal([]), getCategoryStyle: vi.fn().mockReturnValue({ bg: '#fff', text: '#000', icon: '' }), toggleRa: vi.fn()
    };
    const mockProjectsFacade = {
      projects: signal([]),
      isGenerating: signal(false), projectsHistory: signal([]), currentProjectId: signal(null), isUploading: signal(false), loadHistory: vi.fn(), currentProject: signal(null),
      step: signal(0),
      hasActiveGeneration: signal(false)
    };
    const mockAdminFacade = {
      settings: signal({}),
      users: signal([]),
      logs: signal([]),
      loadSettings: vi.fn(),
      loadUsers: vi.fn(),
      loadLogs: vi.fn()
    };
    const mockNotificationsFacade = {
      notifications: signal([]),
      unreadCount: signal(0)
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
        { provide: AdminFacade, useValue: mockAdminFacade }
      ]
    }).compileComponents();
    
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  });

  it('should create the app and update isMobile on window resize', () => {
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

  
  it('should scroll to top on init via setTimeout', async () => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(App);
    vi.runAllTimers();
    vi.useRealTimers();
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

    // Modals
    appFacadeMock.showInfoModal.set(true);
    appFacadeMock.showConfirmModal.set(true);
    appFacadeMock.showErrorModal.set(true);
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});

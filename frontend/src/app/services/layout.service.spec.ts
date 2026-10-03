import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';
import { AuthFacade } from '../features/auth/services/auth.facade';

describe('LayoutService', () => {
  let service: LayoutService;
  let authFacadeMock: any;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // La URL de jsdom persiste entre tests: se parte siempre de la raíz
    window.history.replaceState(null, '', '/');

    authFacadeMock = {
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [LayoutService, { provide: AuthFacade, useValue: authFacadeMock }],
    });
  });

  it('should be created with default values', () => {
    service = TestBed.inject(LayoutService);
    expect(service).toBeTruthy();
    expect(service.currentView()).toBe('home');
    expect(service.isMobile()).toBeDefined();
    expect(service.isSidebarCollapsed()).toBe(false);
    expect(service.language()).toBe('castellano');
  });

  it('should load saved view and language from localStorage', () => {
    localStorage.setItem('pai_view', 'generator');
    localStorage.setItem('pai_lang', 'catalan');
    service = TestBed.inject(LayoutService);
    expect(service.currentView()).toBe('generator');
    expect(service.isSidebarCollapsed()).toBe(true);
    expect(service.language()).toBe('catalan');
  });

  it('should uncollapse sidebar when saved view is home', () => {
    localStorage.setItem('pai_view', 'home');
    service = TestBed.inject(LayoutService);
    expect(service.currentView()).toBe('home');
    expect(service.isSidebarCollapsed()).toBe(false);
  });

  it('should toggle sidebar', () => {
    service = TestBed.inject(LayoutService);
    expect(service.isSidebarCollapsed()).toBe(false);
    service.toggleSidebar();
    expect(service.isSidebarCollapsed()).toBe(true);
    service.toggleSidebar();
    expect(service.isSidebarCollapsed()).toBe(false);
  });

  it('should switch view and save to localStorage (via effect) and scroll to top', () => {
    service = TestBed.inject(LayoutService);

    // Mock window.scrollTo
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    service.switchView('taller');
    TestBed.flushEffects();

    expect(service.currentView()).toBe('taller');
    expect(service.isSidebarCollapsed()).toBe(true);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    expect(localStorage.getItem('pai_view')).toBe('taller');

    service.switchView('personal');
    TestBed.flushEffects();
    expect(service.currentView()).toBe('personal');
    expect(service.isSidebarCollapsed()).toBe(true);

    service.switchView('feedback');
    TestBed.flushEffects();
    expect(service.currentView()).toBe('feedback');
    expect(service.isSidebarCollapsed()).toBe(true);

    service.switchView('home');
    TestBed.flushEffects();
    expect(service.currentView()).toBe('home');
    expect(service.isSidebarCollapsed()).toBe(false);
  });

  describe('historial del navegador', () => {
    beforeEach(() => vi.spyOn(window, 'scrollTo').mockImplementation(() => {}));

    it('refleja la vista guardada en la URL al arrancar sin añadir entradas', () => {
      localStorage.setItem('pai_view', 'history');
      const length = window.history.length;
      service = TestBed.inject(LayoutService);
      expect(window.location.search).toBe('?view=history');
      expect(window.history.length).toBe(length);
    });

    it('la URL manda sobre la vista guardada y pide el proyecto del taller', () => {
      localStorage.setItem('pai_view', 'home');
      window.history.replaceState(null, '', '/?view=taller&project=p1');
      service = TestBed.inject(LayoutService);
      expect(service.currentView()).toBe('taller');
      expect(service.isSidebarCollapsed()).toBe(true);
      expect(service.requestedProject()).toBe('p1');
    });

    it('acepta los enlaces antiguos ?project=<id>', () => {
      window.history.replaceState(null, '', '/?project=p7');
      service = TestBed.inject(LayoutService);
      expect(service.currentView()).toBe('taller');
      expect(service.requestedProject()).toBe('p7');
      expect(window.location.search).toBe('?view=taller&project=p7');
    });

    it('añade una entrada por cada cambio de pantalla, sin duplicar la actual', () => {
      service = TestBed.inject(LayoutService);
      const length = window.history.length;

      service.switchView('history');
      service.switchView('taller', 'p1');
      service.switchView('taller', 'p1');

      expect(window.location.search).toBe('?view=taller&project=p1');
      expect(window.history.length).toBe(length + 2);
    });

    it('al ir atrás o adelante muestra la pantalla y el proyecto de esa entrada', () => {
      service = TestBed.inject(LayoutService);

      window.history.replaceState(null, '', '/?view=taller&project=p2');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(service.currentView()).toBe('taller');
      expect(service.requestedProject()).toBe('p2');

      window.history.replaceState(null, '', '/?view=history');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(service.currentView()).toBe('history');
      expect(service.requestedProject()).toBeNull();

      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(service.currentView()).toBe('home');
    });
  });

  it('should call authService.logout when logout is called', () => {
    service = TestBed.inject(LayoutService);
    service.logout();
    expect(authFacadeMock.logout).toHaveBeenCalled();
  });
});

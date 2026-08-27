import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';
import { AuthFacade } from '../features/auth/services/auth.facade';

describe('LayoutService', () => {
  let service: LayoutService;
  let authFacadeMock: any;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    authFacadeMock = {
      logout: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        { provide: AuthFacade, useValue: authFacadeMock }
      ]
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

  it('should load saved view from localStorage', () => {
    localStorage.setItem('pai_view', 'generator');
    service = TestBed.inject(LayoutService);
    expect(service.currentView()).toBe('generator');
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
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    
    expect(localStorage.getItem('pai_view')).toBe('taller');
  });

  it('should call authService.logout when logout is called', () => {
    service = TestBed.inject(LayoutService);
    service.logout();
    expect(authFacadeMock.logout).toHaveBeenCalled();
  });
});

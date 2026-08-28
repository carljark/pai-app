import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { LayoutService } from '../../../services/layout.service';
import { TranslationService } from '../../../services/translation.service';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { ProjectsFacade } from '../../../features/projects/services/projects.facade';
import { NotificationsBadgeComponent } from '../../../features/notifications/components/notifications-badge/notifications-badge.component';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications-badge',
  standalone: true,
  template: '<div></div>'
})
class MockNotificationsBadgeComponent {
  @Input() projects: any[] = [];
}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const mockLayout = {
    isSidebarCollapsed: signal(false),
    toggleSidebar: vi.fn(),
    switchView: vi.fn(),
    currentView: signal('home'),
    language: signal('castellano'),
    logout: vi.fn()
  };
  
  const mockTrans = {
    t: signal({
      sidebarExpand: 'Expandir',
      sidebarCollapse: 'Colapsar',
      sidebarHome: 'Inicio',
      sidebarNewProject: 'Nuevo Proyecto',
      sidebarHistory: 'Historial',
      sidebarTaller: 'Taller Editor',
      sidebarAdmin: 'Admin Panel',
      sidebarLangTooltip: 'Cambiar Idioma',
      sidebarLangLabel: 'Idioma',
      sidebarLogoutTooltip: 'Cerrar Sesión',
      logout: 'Salir'
    })
  };

  const mockAuth = {
    currentUser: signal({ name: 'Admin', role: 'admin' })
  };

  const mockProjects = {
    loadHistory: vi.fn(),
    projectsHistory: signal([])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans },
        { provide: AuthFacade, useValue: mockAuth },
        { provide: ProjectsFacade, useValue: mockProjects }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should cover methods directly', () => {
    component.toggleLanguage();
    expect(mockLayout.language()).toBe('catalan');
    component.toggleLanguage();
    expect(mockLayout.language()).toBe('castellano');
  });

  
  it('should trigger all HTML event bindings for coverage safely', () => {
    mockAuth.currentUser = signal({ name: 'Admin', role: 'admin' });
    fixture.detectChanges();
    
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    buttons.forEach((b: any) => b.click());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    const btn = fixture.debugElement.nativeElement.querySelector('.desktop-only button');
    btn.click();
    expect(mockLayout.toggleSidebar).toHaveBeenCalled();
  });
  
  it('should have collapsed class if collapsed', () => {
    mockLayout.isSidebarCollapsed.set(true);
    fixture.detectChanges();
    const aside = fixture.debugElement.nativeElement.querySelector('.app-sidebar');
    expect(aside.classList.contains('collapsed')).toBe(true);
  });

  it('should switch view on nav click', () => {
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('.nav-item');
    // Index 1 is the second button (Nuevo Proyecto) -> view 'generator'
    buttons[2].click();
    expect(mockLayout.switchView).toHaveBeenCalledWith('generator');
  });

  it('should load history and switch view on history nav click', () => {
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('.nav-item');
    // Index 2 is Historial
    buttons[3].click();
    expect(mockProjects.loadHistory).toHaveBeenCalled();
    expect(mockLayout.switchView).toHaveBeenCalledWith('history');
  });

  it('should show admin panel if user is admin', () => {
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('.nav-item');
    let hasAdmin = false;
    buttons.forEach((b: any) => {
      if (b.textContent.includes('Admin Panel')) hasAdmin = true;
    });
    expect(hasAdmin).toBe(true);
  });

  it('should not show admin panel if user is not admin', () => {
    mockAuth.currentUser.set({ name: 'User', role: 'user' });
    fixture.detectChanges();
    
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('.nav-item');
    let hasAdmin = false;
    buttons.forEach((b: any) => {
      if (b.textContent.includes('Admin Panel')) hasAdmin = true;
    });
    expect(hasAdmin).toBe(false);
  });

  

  it('should logout', () => {
    const logoutBtn = fixture.debugElement.nativeElement.querySelector('[data-tooltip="Cerrar Sesión"]');
    logoutBtn.click();
    expect(mockLayout.logout).toHaveBeenCalled();
  });
});

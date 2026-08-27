import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from '@angular/core/testing';
import { AppFacade } from './app.facade';
import { LayoutService } from './services/layout.service';
import { TranslationService } from './services/translation.service';
import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { PaiService } from './services/pai.service';
import { AuthFacade } from './features/auth/services/auth.facade';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('AppFacade', () => {
  let facade: AppFacade;
  let authFacadeMock: any;
  let curriculumFacadeMock: any;
  let projectsFacadeMock: any;
  let layoutServiceMock: any;
  let notificationsFacadeMock: any;
  let translationServiceMock: any;
  let paiServiceMock: any;

  beforeEach(() => {
    authFacadeMock = {
      currentUser: signal(null)
    };

    curriculumFacadeMock = {
      loadRas: vi.fn(),
      loadCes: vi.fn(),
      selectedRas: signal([]),
      clearSelection: vi.fn(),
      tipoNivel: signal('FP_BASICA')
    };

    projectsFacadeMock = {
      loadHistory: vi.fn(),
      isGenerating: signal(false),
      generateProject: vi.fn(),
      deleteProject: vi.fn(),
      currentProjectId: signal(''),
      generatedProject: signal(''),
      loadProjectFiles: vi.fn()
    };

    layoutServiceMock = {
      language: signal('castellano'),
      switchView: vi.fn()
    };

    notificationsFacadeMock = {
      latestNotification: signal(null)
    };

    translationServiceMock = {};
    paiServiceMock = {};

    TestBed.configureTestingModule({
      providers: [
        AppFacade,
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: CurriculumFacade, useValue: curriculumFacadeMock },
        { provide: ProjectsFacade, useValue: projectsFacadeMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: NotificationsFacade, useValue: notificationsFacadeMock },
        { provide: TranslationService, useValue: translationServiceMock },
        { provide: PaiService, useValue: paiServiceMock },
      ]
    });

    // Don't inject it yet so effects can be controlled
  });

  it('should create the facade', () => {
    facade = TestBed.inject(AppFacade);
    expect(facade).toBeTruthy();
  });

  it('should load curriculum and history when user is set', () => {
    facade = TestBed.inject(AppFacade);
    
    authFacadeMock.currentUser.set({ name: 'Test' });
    TestBed.flushEffects();

    expect(curriculumFacadeMock.loadRas).toHaveBeenCalledWith('castellano');
    expect(curriculumFacadeMock.loadCes).toHaveBeenCalledWith('castellano');
    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
  });

  it('should react to latestNotification STATUS', () => {
    facade = TestBed.inject(AppFacade);
    
    notificationsFacadeMock.latestNotification.set({ type: 'STATUS', message: 'test' });
    TestBed.flushEffects();
    
    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
  });

  it('should react to latestNotification ERROR', () => {
    facade = TestBed.inject(AppFacade);
    
    notificationsFacadeMock.latestNotification.set({ type: 'ERROR', message: 'some error' });
    TestBed.flushEffects();
    
    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
    expect(facade.errorMessage()).toBe('some error');
    expect(facade.showErrorModal()).toBe(true);
  });

  it('should react to latestNotification COMPLETED', () => {
    vi.useFakeTimers();
    facade = TestBed.inject(AppFacade);
    
    notificationsFacadeMock.latestNotification.set({ type: 'COMPLETED', message: 'done' });
    TestBed.flushEffects();
    
    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
    
    vi.advanceTimersByTime(100);
    
    expect(facade.infoTitle()).toBe('¡Proyecto Generado!');
    expect(facade.infoMessage()).toBe('done');
    expect(facade.infoType()).toBe('success');
    expect(facade.showInfoModal()).toBe(true);
    
    vi.useRealTimers();
  });

  describe('generateProject', () => {
    beforeEach(() => {
      facade = TestBed.inject(AppFacade);
    });

    it('should show info if no ras selected', () => {
      curriculumFacadeMock.selectedRas.set([]);
      facade.generateProject();
      
      expect(facade.infoTitle()).toBe('Atención');
      expect(facade.infoMessage()).toBe('Por favor, selecciona al menos un elemento de la lista.');
      expect(facade.showInfoModal()).toBe(true);
    });

    it('should generate project on success', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));
      
      facade.generateProject();
      
      expect(projectsFacadeMock.isGenerating()).toBe(false);
      expect(curriculumFacadeMock.clearSelection).toHaveBeenCalled();
      expect(facade.infoTitle()).toBe('Proyecto en Cola');
      expect(facade.showInfoModal()).toBe(true);
      expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
    });

    it('should show error modal on generate project error', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(throwError(() => ({ error: { error: 'Server error' } })));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      facade.generateProject();
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(facade.errorMessage()).toContain('Server error');
      expect(facade.showErrorModal()).toBe(true);
      expect(projectsFacadeMock.isGenerating()).toBe(false);
    });
    
    it('should show error modal on generate project error with message', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(throwError(() => ({ error: { message: 'Server message' } })));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      facade.generateProject();
      
      expect(facade.errorMessage()).toContain('Server message');
      expect(facade.showErrorModal()).toBe(true);
    });
    
    it('should show error modal on generate project general error', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(throwError(() => ({ message: 'General msg' })));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      facade.generateProject();
      
      expect(facade.errorMessage()).toContain('General msg');
      expect(facade.showErrorModal()).toBe(true);
    });
  });

  describe('deleteProject', () => {
    beforeEach(() => {
      facade = TestBed.inject(AppFacade);
    });

    it('should show confirm modal and execute deletion on success', () => {
      projectsFacadeMock.deleteProject.mockReturnValue(of({}));
      
      facade.deleteProject('123');
      
      expect(facade.confirmTitle()).toBe('Eliminar Proyecto');
      expect(facade.showConfirmModal()).toBe(true);
      
      // Execute the action
      facade.confirmAction()();
      
      expect(projectsFacadeMock.deleteProject).toHaveBeenCalledWith('123');
      expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
      expect(facade.showConfirmModal()).toBe(false);
    });

    it('should execute deletion on error', () => {
      projectsFacadeMock.deleteProject.mockReturnValue(throwError(() => ({ error: { error: 'Delete err' } })));
      
      facade.deleteProject('123');
      
      // Execute the action
      facade.confirmAction()();
      
      expect(facade.errorMessage()).toBe('Delete err');
      expect(facade.showErrorModal()).toBe(true);
      expect(facade.showConfirmModal()).toBe(false);
    });
    
    it('should fallback to default error on deletion error', () => {
      projectsFacadeMock.deleteProject.mockReturnValue(throwError(() => ({})));
      
      facade.deleteProject('123');
      
      // Execute the action
      facade.confirmAction()();
      
      expect(facade.errorMessage()).toBe('Error al borrar el proyecto');
    });
  });

  describe('viewPastProject', () => {
    beforeEach(() => {
      facade = TestBed.inject(AppFacade);
    });

    it('should populate fields and switch view', () => {
      const proj = {
        _id: '123',
        generatedContent: { rawText: 'content' },
        ras: ['ra1'],
        tipoNivel: 'ESO'
      };
      
      facade.viewPastProject(proj);
      
      expect(projectsFacadeMock.currentProjectId()).toBe('123');
      expect(projectsFacadeMock.generatedProject()).toBe('content');
      expect(curriculumFacadeMock.selectedRas()).toEqual(['ra1']);
      expect(curriculumFacadeMock.tipoNivel()).toBe('ESO');
      expect(projectsFacadeMock.loadProjectFiles).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('taller');
    });

    it('should handle missing fields', () => {
      const proj = { _id: '123' };
      
      facade.viewPastProject(proj);
      
      expect(projectsFacadeMock.generatedProject()).toBe('Sin contenido');
      expect(curriculumFacadeMock.selectedRas()).toEqual([]);
      expect(curriculumFacadeMock.tipoNivel()).toBe('FP_BASICA');
    });
  });
});

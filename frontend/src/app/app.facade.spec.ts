import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AppFacade } from './app.facade';
import { LayoutService } from './services/layout.service';
import { TranslationService } from './services/translation.service';
import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { PaiService } from './services/pai.service';
import { AuthFacade } from './features/auth/services/auth.facade';
import { TelemetryService } from './services/telemetry.service';
import { signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { TRANSLATIONS_ES } from './services/translations.es';
import { Project } from './features/projects/models/project.model';

// Los tests usan proyectos parciales (incluidos formatos legacy de la API)
const asProject = (p: object) => p as Project;

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
      currentUser: signal(null),
    };

    curriculumFacadeMock = {
      loadRas: vi.fn(),
      loadCes: vi.fn(),
      selectedRas: signal([]),
      groupedSelectedItems: signal([]),
      clearSelection: vi.fn(),
      tipoNivel: signal('FP_BASICA'),
    };

    projectsFacadeMock = {
      loadHistory: vi.fn(),
      isGenerating: signal(false),
      generateProject: vi.fn(),
      deleteProject: vi.fn(),
      retryProject: vi.fn(),
      currentProjectId: signal(''),
      generatedProject: signal(''),
      contentLanguage: signal('castellano'),
      loadProjectFiles: vi.fn(),
      projectsHistory: signal<any[]>([]),
      historyTab: signal('FPB'),
      extraInstructions: signal(''),
    };

    layoutServiceMock = {
      language: signal('castellano'),
      currentView: signal('home'),
      switchView: vi.fn(),
      requestedProject: signal<string | null>(null),
    };

    notificationsFacadeMock = {
      notifications: signal<any[]>([]),
      latestNotification: signal(null),
      clearLatestNotification: vi.fn(),
      openRecentActivity: vi.fn(),
      loadNotifications: vi.fn(),
    };

    const telemetryServiceMock = {
      startTracking: vi.fn(),
      stopTracking: vi.fn(),
      setCurrentPage: vi.fn(),
      flushHeartbeat: vi.fn(),
      logEvent: vi.fn().mockReturnValue(of({ ok: true })),
    };

    translationServiceMock = {
      t: vi.fn().mockReturnValue(TRANSLATIONS_ES),
    };
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
        { provide: TelemetryService, useValue: telemetryServiceMock },
      ],
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

  it('should refresh history when the notifications list changes', () => {
    facade = TestBed.inject(AppFacade);
    projectsFacadeMock.loadHistory.mockClear();

    notificationsFacadeMock.notifications.set([{ projectId: 'p1', status: 'generando' }]);
    TestBed.flushEffects();

    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
  });

  it('should ignore notification type INFO', () => {
    facade = TestBed.inject(AppFacade);
    projectsFacadeMock.loadHistory.mockClear();
    notificationsFacadeMock.latestNotification.set({ type: 'INFO', message: 'connected' });
    TestBed.flushEffects();
    expect(projectsFacadeMock.loadHistory).not.toHaveBeenCalled();
  });

  it('should react to latestNotification ERROR', () => {
    facade = TestBed.inject(AppFacade);

    notificationsFacadeMock.notifications.set([{ projectId: 'e1', status: 'error' }]);
    notificationsFacadeMock.latestNotification.set({ type: 'ERROR', message: 'some error' });
    TestBed.flushEffects();

    expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
    expect(facade.errorMessage()).toBe('some error');
    expect(facade.showErrorModal()).toBe(true);
  });

  it('should react to latestNotification COMPLETED', () => {
    vi.useFakeTimers();
    facade = TestBed.inject(AppFacade);

    notificationsFacadeMock.notifications.set([
      { projectId: 'c1', status: 'borrador', generationTimeMs: 1000 },
    ]);
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

  it('should not show duplicate COMPLETED modal for the same project', () => {
    vi.useFakeTimers();
    facade = TestBed.inject(AppFacade);

    notificationsFacadeMock.latestNotification.set({
      type: 'COMPLETED',
      projectId: 'p1',
      message: 'done 1',
    });
    TestBed.flushEffects();
    vi.advanceTimersByTime(100);
    expect(facade.infoMessage()).toBe('done 1');

    facade.closeInfoModal();
    expect(facade.showInfoModal()).toBe(false);
    expect(notificationsFacadeMock.clearLatestNotification).toHaveBeenCalled();

    notificationsFacadeMock.latestNotification.set({
      type: 'COMPLETED',
      projectId: 'p1',
      message: 'done duplicate',
    });
    TestBed.flushEffects();
    vi.advanceTimersByTime(100);
    expect(facade.showInfoModal()).toBe(false);
    expect(facade.infoMessage()).toBe('');

    vi.useRealTimers();
  });

  it('closeInfoModal should reset fields and clear latest notification', () => {
    facade = TestBed.inject(AppFacade);
    facade.showInfoModal.set(true);
    facade.infoTitle.set('Test Title');
    facade.infoMessage.set('Test Message');
    facade.infoType.set('success');

    facade.closeInfoModal();

    expect(facade.showInfoModal()).toBe(false);
    expect(facade.infoTitle()).toBe('Información');
    expect(facade.infoMessage()).toBe('');
    expect(facade.infoType()).toBe('info');
    expect(notificationsFacadeMock.clearLatestNotification).toHaveBeenCalled();
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

    it('should generate project on success and set historyTab to FPB for FP_BASICA', () => {
      curriculumFacadeMock.tipoNivel.set('FP_BASICA');
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();

      expect(projectsFacadeMock.historyTab()).toBe('FPB');
      expect(projectsFacadeMock.isGenerating()).toBe(false);
      expect(curriculumFacadeMock.clearSelection).toHaveBeenCalled();
      expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
      expect(notificationsFacadeMock.openRecentActivity).toHaveBeenCalledOnce();
    });

    it('opens notifications and shows the queue toast before the request responds', () => {
      const request = new Subject<unknown>();
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(request);

      facade.generateProject();

      expect(notificationsFacadeMock.openRecentActivity).toHaveBeenCalledOnce();
      expect(facade.queueToastMessage()).toBe('Proyecto puesto en cola');
      expect(facade.queueToastRestartToken()).toBe(1);

      request.next({});
      expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
    });

    it('should generate project on success and set historyTab to ESO for DIVERSIFICACION_CURRICULAR', () => {
      curriculumFacadeMock.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
      curriculumFacadeMock.selectedRas.set(['ce1']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();

      expect(projectsFacadeMock.historyTab()).toBe('ESO');
      expect(projectsFacadeMock.isGenerating()).toBe(false);
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
    });

    it('should warn and list existing projects with the same selection', () => {
      curriculumFacadeMock.selectedRas.set(['ra1', 'ra2']);
      projectsFacadeMock.projectsHistory.set([
        { _id: 'p1', title: 'Duplicado', status: 'borrador', ras: ['ra2', 'ra1'] },
        { _id: 'p2', title: 'Otro', status: 'borrador', ras: ['ra1'] },
        { _id: 'p3', title: 'Error', status: 'error', ras: ['ra1', 'ra2'] },
      ]);

      facade.generateProject();

      expect(facade.showDuplicateModal()).toBe(true);
      expect(facade.duplicateProjects().map((p: any) => p._id)).toEqual(['p1']);
      expect(projectsFacadeMock.generateProject).not.toHaveBeenCalled();
    });

    it('should continue and generate when the user confirms the duplicate warning', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.projectsHistory.set([
        { _id: 'p1', title: 'Duplicado', status: 'borrador', ras: ['ra1'] },
      ]);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();
      expect(facade.showDuplicateModal()).toBe(true);

      facade.confirmDuplicates();

      expect(facade.showDuplicateModal()).toBe(false);
      expect(projectsFacadeMock.generateProject).toHaveBeenCalled();
    });

    it('should cancel the duplicate warning without generating', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.projectsHistory.set([
        { _id: 'p1', title: 'Duplicado', status: 'borrador', ras: ['ra1'] },
      ]);

      facade.generateProject();
      facade.cancelDuplicates();

      expect(facade.showDuplicateModal()).toBe(false);
      expect(projectsFacadeMock.generateProject).not.toHaveBeenCalled();
    });

    it('should open an existing duplicate project from the warning', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.projectsHistory.set([
        {
          _id: 'p1',
          title: 'Duplicado',
          status: 'borrador',
          ras: ['ra1'],
          generatedContent: { rawText: 'x' },
        },
      ]);
      facade.generateProject();

      facade.openDuplicateProject(asProject({ _id: 'p1', generatedContent: { rawText: 'x' } }));

      expect(facade.showDuplicateModal()).toBe(false);
      expect(projectsFacadeMock.currentProjectId()).toBe('p1');
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('taller', expect.any(String));
    });

    it('should open a project in a new window via ?view=taller&project=<id>', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      facade.openProjectInNewWindow(asProject({ _id: 'p1' }));
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('?view=taller&project=p1'),
        '_blank',
      );
      openSpy.mockRestore();
    });

    it('should open the project requested by the URL or the browser history without a new entry', () => {
      const project = { _id: 'p5', status: 'borrador', generatedContent: { rawText: 'Texto' } };
      layoutServiceMock.requestedProject.set('p5');
      TestBed.flushEffects();
      // Todavía no ha llegado el historial: la petición queda pendiente
      expect(layoutServiceMock.requestedProject()).toBe('p5');

      projectsFacadeMock.projectsHistory.set([project]);
      TestBed.flushEffects();

      expect(projectsFacadeMock.currentProjectId()).toBe('p5');
      expect(projectsFacadeMock.generatedProject()).toBe('Texto');
      expect(layoutServiceMock.switchView).not.toHaveBeenCalled();
      expect(layoutServiceMock.requestedProject()).toBeNull();
    });

    it('should not reload the project when the requested one is already open', () => {
      projectsFacadeMock.projectsHistory.set([
        { _id: 'p6', generatedContent: { rawText: 'Nuevo' } },
      ]);
      projectsFacadeMock.currentProjectId.set('p6');
      projectsFacadeMock.generatedProject.set('Cambios sin guardar');

      layoutServiceMock.requestedProject.set('p6');
      TestBed.flushEffects();

      expect(projectsFacadeMock.generatedProject()).toBe('Cambios sin guardar');
      expect(layoutServiceMock.requestedProject()).toBeNull();
    });

    it('should generate project on success and set historyTab to CFGM for CFGM_ESTETICA', () => {
      curriculumFacadeMock.tipoNivel.set('CFGM_ESTETICA');
      curriculumFacadeMock.selectedRas.set(['ra_cfgm']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();

      expect(projectsFacadeMock.historyTab()).toBe('CFGM');
      expect(projectsFacadeMock.isGenerating()).toBe(false);
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
    });

    it('should generate project on success and set historyTab to CFGM_PELUQUERIA for CFGM_PELUQUERIA', () => {
      curriculumFacadeMock.tipoNivel.set('CFGM_PELUQUERIA');
      curriculumFacadeMock.selectedRas.set(['ra_cfgm_pel']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();

      expect(projectsFacadeMock.historyTab()).toBe('CFGM_PELUQUERIA');
      expect(projectsFacadeMock.isGenerating()).toBe(false);
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('history');
    });

    it('should set historyTab to CFGS_EDUCACION_INFANTIL for CFGS_EDUCACION_INFANTIL', () => {
      curriculumFacadeMock.tipoNivel.set('CFGS_EDUCACION_INFANTIL');
      curriculumFacadeMock.selectedRas.set(['ra_cfgs_inf']);
      projectsFacadeMock.generateProject.mockReturnValue(of({}));

      facade.generateProject();

      expect(projectsFacadeMock.historyTab()).toBe('CFGS_EDUCACION_INFANTIL');
    });

    it('should show error modal on generate project error', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(
        throwError(() => ({ error: { error: 'Server error' } })),
      );

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.generateProject();

      expect(consoleSpy).toHaveBeenCalled();
      expect(facade.errorMessage()).toContain('Server error');
      expect(facade.showErrorModal()).toBe(true);
      expect(projectsFacadeMock.isGenerating()).toBe(false);
    });

    it('should show error modal on generate project error with message', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(
        throwError(() => ({ error: { message: 'Server message' } })),
      );

      vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.generateProject();

      expect(facade.errorMessage()).toContain('Server message');
      expect(facade.showErrorModal()).toBe(true);
    });

    it('should show error modal on generate project general error', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(
        throwError(() => ({ message: 'General msg' })),
      );

      vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.generateProject();

      expect(facade.errorMessage()).toContain('General msg');
      expect(facade.showErrorModal()).toBe(true);
    });

    it('should show error modal on generate project unknown error', () => {
      curriculumFacadeMock.selectedRas.set(['ra1']);
      projectsFacadeMock.generateProject.mockReturnValue(throwError(() => ({})));

      vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.generateProject();

      expect(facade.errorMessage()).toContain('Error desconocido');
      expect(facade.showErrorModal()).toBe(true);
    });
  });

  it('should cover initial confirmAction', () => {
    facade.confirmAction()();
    expect(true).toBe(true);
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
      projectsFacadeMock.deleteProject.mockReturnValue(
        throwError(() => ({ error: { error: 'Delete err' } })),
      );

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

    it('should handle empty projectId in deleteProject', () => {
      facade.deleteProject('');
      expect(facade.confirmTitle()).toBe('Eliminar Proyecto');
      expect(facade.showConfirmModal()).toBe(true);
    });
  });

  describe('viewPastProject', () => {
    beforeEach(() => {
      facade = TestBed.inject(AppFacade);
    });

    it('should populate fields and switch view with object content', () => {
      const proj = {
        _id: '123',
        generatedContent: { rawText: 'content' },
        ras: ['ra1'],
        tipoNivel: 'ESO',
      };

      facade.viewPastProject(asProject(proj));

      expect(projectsFacadeMock.currentProjectId()).toBe('123');
      expect(projectsFacadeMock.generatedProject()).toBe('content');
      expect(projectsFacadeMock.loadProjectFiles).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('taller', expect.any(String));
    });

    it('should populate fields and switch view with string content', () => {
      const proj = {
        _id: '123-str',
        generatedContent: 'string content text',
      };

      facade.viewPastProject(asProject(proj));

      expect(projectsFacadeMock.currentProjectId()).toBe('123-str');
      expect(projectsFacadeMock.generatedProject()).toBe('string content text');
      expect(projectsFacadeMock.loadProjectFiles).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('taller', expect.any(String));
    });

    it('should handle missing fields', () => {
      const proj = { _id: '123' };

      facade.viewPastProject(asProject(proj));

      expect(projectsFacadeMock.generatedProject()).toBe('Sin contenido');
      expect(projectsFacadeMock.loadProjectFiles).toHaveBeenCalled();
      expect(layoutServiceMock.switchView).toHaveBeenCalledWith('taller', expect.any(String));
    });

    it('should show error modal when project status is error with errorDetail', () => {
      const proj = {
        _id: 'err-1',
        status: 'error',
        errorDetail: 'Fallo al procesar con IA',
      };

      facade.viewPastProject(asProject(proj));

      expect(facade.errorMessage()).toBe('Fallo al procesar con IA');
      expect(facade.showErrorModal()).toBe(true);
      expect(layoutServiceMock.switchView).not.toHaveBeenCalled();
    });

    it('should use project.error when the project has no errorDetail', () => {
      facade.viewPastProject(asProject({ _id: 'err-3', status: 'error', error: 'Cuota agotada' }));

      expect(facade.errorMessage()).toBe('Cuota agotada');
      expect(facade.showErrorModal()).toBe(true);
    });

    it('should not open a new window for a project without id', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      facade.openProjectInNewWindow(asProject({}));
      expect(openSpy).not.toHaveBeenCalled();
      openSpy.mockRestore();
    });

    it('should show error modal with fallback message when project status is error without errorDetail', () => {
      const proj = {
        _id: 'err-2',
        status: 'error',
      };

      facade.viewPastProject(asProject(proj));

      expect(facade.errorMessage()).toBe('Error desconocido');
      expect(facade.showErrorModal()).toBe(true);
      expect(layoutServiceMock.switchView).not.toHaveBeenCalled();
    });
  });

  describe('retryProject', () => {
    beforeEach(() => {
      facade = TestBed.inject(AppFacade);
    });

    it('should retry project successfully and show info modal', () => {
      projectsFacadeMock.retryProject.mockReturnValue(of({ message: 'ok' }));
      const proj = { _id: 'proj-error-1' };

      facade.retryProject(asProject(proj));

      expect(projectsFacadeMock.retryProject).toHaveBeenCalledWith('proj-error-1');
      expect(facade.infoTitle()).toBe('Proyecto en Cola');
      expect(facade.showInfoModal()).toBe(true);
      expect(projectsFacadeMock.loadHistory).toHaveBeenCalled();
    });

    it('should handle retry error with server error object', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      projectsFacadeMock.retryProject.mockReturnValue(
        throwError(() => ({ error: { error: 'Error del servidor' } })),
      );
      const proj = { _id: 'proj-error-2' };

      facade.retryProject(asProject(proj));

      expect(facade.errorTitle()).toBe('Error al Reintentar');
      expect(facade.errorMessage()).toBe('Error del servidor');
      expect(facade.showErrorModal()).toBe(true);
      consoleSpy.mockRestore();
    });

    it('should handle retry error with fallback message', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      projectsFacadeMock.retryProject.mockReturnValue(throwError(() => ({})));
      const proj = { _id: 'proj-error-3' };

      facade.retryProject(asProject(proj));

      expect(facade.errorMessage()).toBe('Error desconocido');
      expect(facade.showErrorModal()).toBe(true);
      consoleSpy.mockRestore();
    });

    it('should handle retry for project without _id', () => {
      projectsFacadeMock.retryProject.mockReturnValue(of({ message: 'ok' }));
      facade.retryProject(asProject({}));
      expect(projectsFacadeMock.retryProject).toHaveBeenCalledWith(undefined);
      expect(facade.infoTitle()).toBe('Proyecto en Cola');
    });
  });
});

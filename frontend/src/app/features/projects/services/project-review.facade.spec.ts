import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProjectReviewFacade } from './project-review.facade';
import { ProjectsFacade } from './projects.facade';
import { TranslationService } from '../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../services/translations.es';
import { AppFacade } from '../../../app.facade';
import { Project } from '../models/project.model';

const asProject = (p: object) => p as Project;
const POLL_MS = ProjectReviewFacade.POLL_INTERVAL_MS;

const original = asProject({
  _id: 'p1',
  title: 'Proyecto',
  contentVersion: 2,
  generatedContent: { rawText: 'Texto' },
});

const dimension = { id: 'coherence', score: 4, justification: 'J', suggestions: ['S'] };
const running = () => ({ status: 'revisando', startedAt: new Date().toISOString() });
const done = { status: 'completada', contentVersion: 2, overall: 4, dimensions: [dimension] };

/** Respuesta de la API con la revisión en el estado indicado. */
const dto = (review: object, id = 'p1') => ({
  _id: id,
  title: 'Proyecto',
  status: 'borrador',
  tipoNivel: 'FP_BASICA',
  courseLevel: '1º',
  modules: [],
  userId: 'u1',
  createdAt: '2026-11-12',
  updatedAt: '2026-11-12',
  contentVersion: 2,
  generatedContent: { rawText: 'Texto' },
  review,
});

describe('ProjectReviewFacade', () => {
  let facade: ProjectReviewFacade;
  let httpMock: HttpTestingController;
  let projects: any;
  let appFacade: { showToast: ReturnType<typeof vi.fn> };

  const setup = (history: Project[] = [original]) => {
    const projectsHistory = signal<Project[]>(history);
    const currentProjectId = signal<string | null>('p1');
    projects = {
      projectsHistory,
      currentProjectId,
      currentProject: computed(() => projectsHistory().find((p) => p._id === currentProjectId())),
      selectedAi: signal('openrouter'),
      selectedModel: signal('openai/gpt-6-luna'),
    };
    appFacade = { showToast: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProjectsFacade, useValue: projects },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
        { provide: AppFacade, useValue: appFacade },
      ],
    });
    facade = TestBed.inject(ProjectReviewFacade);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.flushEffects();
  };

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('sin revisión ni proyecto no hay resultados, errores ni revisión en curso', () => {
    setup();
    expect(facade.review()).toBeNull();
    expect(facade.hasResults()).toBe(false);
    expect(facade.stale()).toBe(false);
    expect(facade.reviewError()).toBe(false);
    projects.currentProjectId.set(null);
    expect(facade.isReviewing()).toBe(false);
    expect(facade.stale()).toBe(false);
  });

  it('inicia la revisión, sigue su progreso y avisa al terminar', () => {
    setup();
    facade.reviewCurrentProject();
    const req = httpMock.expectOne('/api/projects/p1/review');
    expect(req.request.body).toEqual({ aiProvider: 'openrouter', aiModel: 'openai/gpt-6-luna' });
    req.flush(dto(running()), { status: 202, statusText: 'Accepted' });
    expect(facade.isReviewing()).toBe(true);

    facade.reviewCurrentProject();
    httpMock.expectNone('/api/projects/p1/review');

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(running()));
    expect(appFacade.showToast).not.toHaveBeenCalled();

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
    expect(appFacade.showToast).toHaveBeenCalledWith(
      `${TRANSLATIONS_ES.reviewCompletedToast}: Proyecto`,
    );
    expect(facade.hasResults()).toBe(true);
    expect(facade.stale()).toBe(false);

    vi.advanceTimersByTime(POLL_MS * 2);
    httpMock.expectNone('/api/projects/p1');
  });

  it('avisa del fallo y muestra el error de la revisión', () => {
    setup();
    facade.reviewCurrentProject();
    httpMock.expectOne('/api/projects/p1/review').flush(dto(running()));
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto({ status: 'error', error: 'sin cuota' }));
    expect(appFacade.showToast).toHaveBeenCalledWith(
      `${TRANSLATIONS_ES.reviewFailedToast}: Proyecto`,
    );
    expect(facade.reviewError()).toBe(true);
  });

  it('marca como desactualizada una revisión de otra versión', () => {
    setup([asProject({ ...original, review: { ...done, contentVersion: 1 } })]);
    expect(facade.stale()).toBe(true);
  });

  it('con 409 sigue la revisión ya en curso', () => {
    setup();
    facade.reviewCurrentProject();
    httpMock
      .expectOne('/api/projects/p1/review')
      .flush({ error: 'en curso' }, { status: 409, statusText: 'Conflict' });
    httpMock.expectOne('/api/projects/p1').flush(dto(running()));
    expect(facade.isReviewing()).toBe(true);
    expect(facade.reviewError()).toBe(false);

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
  });

  it('marca el error de inicio solo para ese proyecto y reintenta tras fallos de red', () => {
    setup([original, asProject({ ...original, _id: 'p2' })]);
    facade.reviewCurrentProject();
    httpMock
      .expectOne('/api/projects/p1/review')
      .flush({ error: 'sin permisos' }, { status: 403, statusText: 'Forbidden' });
    expect(facade.reviewError()).toBe(true);
    projects.currentProjectId.set('p2');
    expect(facade.reviewError()).toBe(false);

    projects.currentProjectId.set('p1');
    facade.reviewCurrentProject();
    httpMock.expectOne('/api/projects/p1/review').flush(dto(running()));
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').error(new ProgressEvent('network'));
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
  });

  it('reanuda el seguimiento de una revisión en curso al abrir el proyecto', () => {
    setup([asProject({ ...original, review: running() })]);
    expect(facade.isReviewing()).toBe(true);
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
    expect(appFacade.showToast).toHaveBeenCalled();
  });

  it('no inicia nada sin proyecto abierto', () => {
    setup();
    projects.currentProjectId.set(null);
    facade.reviewCurrentProject();
    httpMock.expectNone('/api/projects/p1/review');
  });
});

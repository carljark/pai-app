import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { computed, signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProjectTranslationFacade } from './project-translation.facade';
import { ProjectsFacade } from './projects.facade';
import { LayoutService } from '../../../services/layout.service';
import { TranslationService } from '../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../services/translations.es';
import { AppFacade } from '../../../app.facade';
import { Project } from '../models/project.model';

const asProject = (p: object) => p as Project;
const POLL_MS = ProjectTranslationFacade.POLL_INTERVAL_MS;

const original = asProject({
  _id: 'p1',
  title: 'Proyecto',
  language: 'castellano',
  contentVersion: 1,
  generatedContent: { rawText: 'Texto ES' },
});

/** Respuesta de la API con la traducción al catalán en el estado indicado. */
const dto = (catalan: object, id = 'p1') => ({
  _id: id,
  title: 'Proyecto',
  status: 'borrador',
  tipoNivel: 'FP_BASICA',
  courseLevel: '1º',
  modules: [],
  userId: 'u1',
  createdAt: '2026-10-02',
  updatedAt: '2026-10-02',
  language: 'castellano',
  contentVersion: 1,
  generatedContent: { rawText: 'Texto ES' },
  translations: { catalan },
});
const running = () => ({ status: 'traduciendo', startedAt: new Date().toISOString() });
const done = { rawText: 'Text CA', sourceVersion: 1, status: 'completada' };

describe('ProjectTranslationFacade', () => {
  let facade: ProjectTranslationFacade;
  let httpMock: HttpTestingController;
  let projects: any;
  let appFacade: { showToast: ReturnType<typeof vi.fn> };
  let language: ReturnType<typeof signal<'castellano' | 'catalan'>>;

  const setup = (history: Project[] = [original]) => {
    language = signal<'castellano' | 'catalan'>('catalan');
    const projectsHistory = signal<Project[]>(history);
    const currentProjectId = signal<string | null>('p1');
    projects = {
      projectsHistory,
      currentProjectId,
      currentProject: computed(() => projectsHistory().find((p) => p._id === currentProjectId())),
      contentLanguage: signal('castellano'),
      generatedProject: signal('Texto ES'),
      undoStacksByProject: signal<Record<string, string[]>>({ p1: ['anterior'] }),
      selectedAi: signal('gemini'),
      selectedModel: signal('gemini-3.6-flash'),
    };
    appFacade = { showToast: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProjectsFacade, useValue: projects },
        { provide: LayoutService, useValue: { language } },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
        { provide: AppFacade, useValue: appFacade },
      ],
    });
    facade = TestBed.inject(ProjectTranslationFacade);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.flushEffects();
  };

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('expone la vista del proyecto actual o null si no hay proyecto', () => {
    setup();
    expect(facade.view()?.missingTranslation).toBe(true);
    expect(facade.isTranslating()).toBe(false);
    projects.currentProjectId.set(null);
    expect(facade.view()).toBeNull();
    expect(facade.isTranslating()).toBe(false);
  });

  it('showCurrentProject muestra la versión del idioma y vacía el deshacer', () => {
    setup([asProject({ ...original, translations: { catalan: done } })]);
    facade.showCurrentProject();
    expect(projects.contentLanguage()).toBe('catalan');
    expect(projects.generatedProject()).toBe('Text CA');
    expect(projects.undoStacksByProject()).toEqual({ p1: [] });

    projects.currentProjectId.set(null);
    facade.showCurrentProject();
    expect(projects.generatedProject()).toBe('Text CA');
  });

  it('inicia la traducción, sigue su progreso y avisa al terminar', () => {
    setup();
    facade.translateCurrentProject();
    const req = httpMock.expectOne('/api/projects/p1/translate');
    expect(req.request.body).toEqual({
      target: 'catalan',
      aiProvider: 'gemini',
      aiModel: 'gemini-3.6-flash',
    });
    req.flush(dto(running()), { status: 202, statusText: 'Accepted' });
    expect(facade.isTranslating()).toBe(true);

    facade.translateCurrentProject();
    httpMock.expectNone('/api/projects/p1/translate');

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(running()));
    expect(appFacade.showToast).not.toHaveBeenCalled();

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
    expect(appFacade.showToast).toHaveBeenCalledWith(
      `${TRANSLATIONS_ES.translationCompletedToast}: Proyecto`,
    );
    expect(projects.generatedProject()).toBe('Text CA');
    expect(projects.contentLanguage()).toBe('catalan');
    expect(facade.isTranslating()).toBe(false);

    vi.advanceTimersByTime(POLL_MS * 2);
    httpMock.expectNone('/api/projects/p1');
  });

  it('avisa del fallo y no toca el editor si se está viendo otro proyecto', () => {
    setup([original, asProject({ ...original, _id: 'p2' })]);
    facade.translateCurrentProject();
    httpMock.expectOne('/api/projects/p1/translate').flush(dto(running()));
    projects.currentProjectId.set('p2');

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto({ status: 'error', error: 'sin cuota' }));
    expect(appFacade.showToast).toHaveBeenCalledWith(
      `${TRANSLATIONS_ES.translationFailedToast}: Proyecto`,
    );
    expect(projects.generatedProject()).toBe('Texto ES');
  });

  it('no cambia el editor si la interfaz ya no está en el idioma traducido', () => {
    setup();
    facade.translateCurrentProject();
    httpMock.expectOne('/api/projects/p1/translate').flush(dto(running()));
    language.set('castellano');

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
    expect(appFacade.showToast).toHaveBeenCalled();
    expect(projects.generatedProject()).toBe('Texto ES');
  });

  it('con 409 sigue la traducción ya en curso', () => {
    setup();
    facade.translateCurrentProject();
    httpMock
      .expectOne('/api/projects/p1/translate')
      .flush({ error: 'en curso' }, { status: 409, statusText: 'Conflict' });
    httpMock.expectOne('/api/projects/p1').flush(dto(running()));
    expect(facade.isTranslating()).toBe(true);
    expect(facade.translationError()).toBe(false);

    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
  });

  it('marca el error de inicio solo para ese proyecto y reintenta tras fallos de red', () => {
    setup([original, asProject({ ...original, _id: 'p2' })]);
    facade.translateCurrentProject();
    httpMock
      .expectOne('/api/projects/p1/translate')
      .flush({ error: 'sin permisos' }, { status: 403, statusText: 'Forbidden' });
    expect(facade.translationError()).toBe(true);
    projects.currentProjectId.set('p2');
    expect(facade.translationError()).toBe(false);

    projects.currentProjectId.set('p1');
    facade.translateCurrentProject();
    httpMock.expectOne('/api/projects/p1/translate').flush(dto(running()));
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').error(new ProgressEvent('network'));
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
  });

  it('reanuda el seguimiento de una traducción en curso al abrir el proyecto (p. ej. tras recargar)', () => {
    setup([asProject({ ...original, translations: { catalan: running() } })]);
    expect(facade.isTranslating()).toBe(true);
    vi.advanceTimersByTime(POLL_MS);
    httpMock.expectOne('/api/projects/p1').flush(dto(done));
    expect(appFacade.showToast).toHaveBeenCalled();
  });

  it('no inicia nada sin proyecto abierto', () => {
    setup();
    projects.currentProjectId.set(null);
    facade.translateCurrentProject();
    httpMock.expectNone('/api/projects/p1/translate');
  });
});

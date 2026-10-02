import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectTranslationFacade } from './project-translation.facade';
import { ProjectsFacade } from './projects.facade';
import { LayoutService } from '../../../services/layout.service';
import { Project } from '../models/project.model';

const asProject = (p: object) => p as Project;

const original = asProject({
  _id: 'p1',
  title: 'Proyecto',
  language: 'castellano',
  contentVersion: 1,
  generatedContent: { rawText: 'Texto ES' },
});

const translatedDto = {
  _id: 'p1',
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
  translations: { catalan: { rawText: 'Text CA', sourceVersion: 1 } },
};

describe('ProjectTranslationFacade', () => {
  let facade: ProjectTranslationFacade;
  let httpMock: HttpTestingController;
  let projects: any;
  let language: ReturnType<typeof signal<'castellano' | 'catalan'>>;

  beforeEach(() => {
    language = signal<'castellano' | 'catalan'>('catalan');
    projects = {
      projectsHistory: signal<Project[]>([original]),
      currentProjectId: signal<string | null>('p1'),
      currentProject: signal<Project | undefined>(original),
      contentLanguage: signal('castellano'),
      generatedProject: signal('Texto ES'),
      undoStacksByProject: signal<Record<string, string[]>>({ p1: ['anterior'] }),
      selectedAi: signal('gemini'),
      selectedModel: signal('gemini-3.6-flash'),
    };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProjectsFacade, useValue: projects },
        { provide: LayoutService, useValue: { language } },
      ],
    });
    facade = TestBed.inject(ProjectTranslationFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('expone la vista del proyecto actual o null si no hay proyecto', () => {
    expect(facade.view()?.missingTranslation).toBe(true);
    projects.currentProject.set(undefined);
    expect(facade.view()).toBeNull();
  });

  it('showCurrentProject muestra la versión del idioma y vacía el deshacer', () => {
    projects.currentProject.set(
      asProject({
        ...original,
        translations: { catalan: { rawText: 'Text CA', sourceVersion: 1 } },
      }),
    );
    facade.showCurrentProject();
    expect(projects.contentLanguage()).toBe('catalan');
    expect(projects.generatedProject()).toBe('Text CA');
    expect(projects.undoStacksByProject()).toEqual({ p1: [] });
  });

  it('showCurrentProject no hace nada sin proyecto y no toca el deshacer sin id', () => {
    projects.currentProject.set(undefined);
    facade.showCurrentProject();
    expect(projects.generatedProject()).toBe('Texto ES');

    projects.currentProject.set(original);
    projects.currentProjectId.set(null);
    facade.showCurrentProject();
    expect(projects.undoStacksByProject()).toEqual({ p1: ['anterior'] });
  });

  it('traduce, actualiza el historial y muestra la traducción', () => {
    facade.translateCurrentProject();
    facade.translateCurrentProject();
    expect(facade.isTranslating()).toBe(true);

    const req = httpMock.expectOne('/api/projects/p1/translate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      target: 'catalan',
      aiProvider: 'gemini',
      aiModel: 'gemini-3.6-flash',
    });
    req.flush(translatedDto);

    expect(facade.isTranslating()).toBe(false);
    expect(projects.projectsHistory()[0].translations.catalan.rawText).toBe('Text CA');
    expect(projects.generatedProject()).toBe('Text CA');
    expect(projects.contentLanguage()).toBe('catalan');
  });

  it('no cambia el editor si el usuario abrió otro proyecto durante la traducción', () => {
    facade.translateCurrentProject();
    projects.currentProjectId.set('otro');
    httpMock.expectOne('/api/projects/p1/translate').flush(translatedDto);
    expect(projects.generatedProject()).toBe('Texto ES');
    expect(projects.projectsHistory()[0].translations.catalan.rawText).toBe('Text CA');
  });

  it('marca el error si falla y no pide nada sin proyecto', () => {
    facade.translateCurrentProject();
    httpMock
      .expectOne('/api/projects/p1/translate')
      .flush({ error: 'fallo' }, { status: 500, statusText: 'Error' });
    expect(facade.isTranslating()).toBe(false);
    expect(facade.translationError()).toBe(true);

    projects.currentProject.set(undefined);
    facade.translateCurrentProject();
    httpMock.expectNone('/api/projects/p1/translate');
  });
});

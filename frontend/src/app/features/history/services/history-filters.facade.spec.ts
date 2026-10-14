import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HistoryFiltersFacade } from './history-filters.facade';
import { ProjectsFacade } from '../../projects/services/projects.facade';
import { AuthFacade } from '../../auth/services/auth.facade';
import { LayoutService } from '../../../services/layout.service';
import { loadNivelesMock } from '../../../testing/niveles.mock';
import { ANALISIS, FILTER_INDEX, LEVEL, PEINADOS } from '../../../testing/filter-index.mock';

describe('HistoryFiltersFacade', () => {
  let facade: HistoryFiltersFacade;
  let http: HttpTestingController;
  let history: ReturnType<typeof signal<any[] | undefined>>;
  let user: ReturnType<typeof signal<any>>;

  const project = (overrides: any = {}) => ({
    _id: '1',
    title: 'P',
    tipoNivel: LEVEL,
    courseLevel: '1º',
    modules: ['Peinados'],
    ras: ['Peina'],
    userId: 'u1',
    ...overrides,
  });
  const ids = () => facade.filteredProjects().map((p) => p._id);
  const labels = (options: { label: string }[]) => options.map((o) => o.label);

  beforeEach(() => {
    history = signal<any[] | undefined>([]);
    user = signal<any>({ _id: 'u1' });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ProjectsFacade,
          useValue: { projectsHistory: history, historyTab: signal(LEVEL) },
        },
        { provide: AuthFacade, useValue: { currentUser: user } },
      ],
    });
    loadNivelesMock();
    TestBed.inject(LayoutService).language.set('castellano');
    facade = TestBed.inject(HistoryFiltersFacade);
    http = TestBed.inject(HttpTestingController);
    facade.loadIndex();
    http.expectOne('/api/curriculum/filter-index').flush(FILTER_INDEX);
  });

  afterEach(() => {
    http.verify();
    TestBed.inject(LayoutService).language.set('castellano');
  });

  it('shows one option per module and RA whatever the language of the project', () => {
    history.set([
      project(),
      project({ _id: '2', modules: ['Pentinats'], ras: ['Pentina', 'Recull'] }),
    ]);
    expect(labels(facade.moduleOptions())).toEqual(['Peinados']);
    facade.setModule(PEINADOS);
    expect(labels(facade.raOptions())).toEqual(['RA1. Peina', 'RA2. Recoge']);
    expect(ids()).toEqual(['1', '2']);

    TestBed.inject(LayoutService).language.set('catalan');
    expect(labels(facade.moduleOptions())).toEqual(['Pentinats']);
    expect(labels(facade.raOptions())).toEqual(['RA1. Pentina', 'RA2. Recull']);

    facade.setRa(`${PEINADOS}|RA2`);
    expect(ids()).toEqual(['2']);
  });

  it('narrows each filter with the previous one: level, course, module and RA', () => {
    history.set([
      project({ _id: '1', modules: ['Peinados'] }),
      project({ _id: '2', courseLevel: '2º', modules: ['Análisis'], ras: ['Analiza'] }),
      project({ _id: '3', tipoNivel: 'FP_BASICA', modules: ['Otro'] }),
    ]);
    expect(facade.cursoOptions()).toEqual(['1º', '2º']);
    expect(labels(facade.moduleOptions())).toEqual(['Peinados', 'Análisis']);
    expect(facade.raOptions()).toEqual([]);

    facade.setCurso('2º');
    expect(labels(facade.moduleOptions())).toEqual(['Análisis']);
    expect(ids()).toEqual(['2']);

    facade.setModule(ANALISIS);
    facade.setRa(`${ANALISIS}|RA1`);
    expect(facade.ra()).toBe(`${ANALISIS}|RA1`);

    facade.setCurso('1º');
    expect([facade.module(), facade.ra()]).toEqual([null, null]);
    expect(ids()).toEqual(['1']);

    facade.setLevel('FP_BASICA');
    expect(facade.curso()).toBeNull();
    expect(ids()).toEqual(['3']);
  });

  it('ignores a course or module that does not belong to the level changed from outside', () => {
    history.set([project()]);
    facade.setCurso('2º');
    facade.setModule(PEINADOS);
    facade.activeTab.set('CFGM_ESTETICA');
    expect(facade.curso()).toBeNull();
    expect(facade.module()).toBeNull();
  });

  it('searches every level but keeps the options of the chosen level', () => {
    history.set([project(), project({ _id: '2', tipoNivel: 'FP_BASICA', title: 'Peinado fácil' })]);
    facade.searchQuery.set('peinado');
    expect(facade.isSearching()).toBe(true);
    expect(ids()).toEqual(['1', '2']);
    expect(labels(facade.moduleOptions())).toEqual(['Peinados']);
    facade.setModule(PEINADOS);
    expect(ids()).toEqual(['1']);
  });

  it('filters by owner and orders the levels of the catalog', () => {
    history.set([project(), project({ _id: '2', userId: 'u2' })]);
    facade.onlyMine.set(true);
    expect(ids()).toEqual(['1']);
    user.set(null);
    expect(ids()).toEqual(['1', '2']);
    expect(facade.levelOptions()[0]).toEqual({
      value: 'FP_BASICA',
      label: 'CFGB Peluquería y Estética',
    });
  });

  it('handles an empty history and resets empty selections', () => {
    history.set(undefined);
    expect(facade.moduleOptions()).toEqual([]);
    expect(facade.filteredProjects()).toEqual([]);
    facade.setModule('');
    facade.setRa('');
    expect([facade.module(), facade.ra()]).toEqual([null, null]);
  });

  it('logs the error when the index cannot be loaded and keeps the texts as options', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    facade.loadIndex();
    http.expectOne('/api/curriculum/filter-index').flush('x', { status: 500, statusText: 'Error' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

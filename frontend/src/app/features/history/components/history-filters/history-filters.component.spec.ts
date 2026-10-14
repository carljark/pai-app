import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HistoryFiltersComponent } from './history-filters.component';
import { HistoryFiltersFacade } from '../../services/history-filters.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { loadNivelesMock } from '../../../../testing/niveles.mock';
import { FILTER_INDEX, LEVEL, PEINADOS } from '../../../../testing/filter-index.mock';

describe('HistoryFiltersComponent', () => {
  let fixture: ComponentFixture<HistoryFiltersComponent>;
  let facade: HistoryFiltersFacade;
  let history: ReturnType<typeof signal<any[]>>;
  let tab: ReturnType<typeof signal<string>>;

  const root = () => fixture.nativeElement as HTMLElement;
  const selects = () => Array.from(root().querySelectorAll('select'));
  const choose = (select: HTMLSelectElement, value: string) => {
    select.value = value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };
  const cursoButtons = () =>
    Array.from(root().querySelectorAll<HTMLButtonElement>('.history-filters__curso'));
  const fieldLabels = () =>
    Array.from(root().querySelectorAll('.history-filters__label')).map((l) =>
      l.textContent?.trim(),
    );

  beforeEach(() => {
    history = signal<any[]>([
      { _id: '1', tipoNivel: LEVEL, courseLevel: '1º', modules: ['Pentinats'], ras: ['Peina'] },
      { _id: '2', tipoNivel: 'ESO_ORDINARIA', modules: ['Matemáticas'], ras: ['CE'] },
    ]);
    tab = signal(LEVEL);
    TestBed.configureTestingModule({
      imports: [HistoryFiltersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProjectsFacade, useValue: { projectsHistory: history, historyTab: tab } },
        { provide: AuthFacade, useValue: { currentUser: signal(null) } },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
      ],
    });
    loadNivelesMock();
    TestBed.inject(LayoutService).language.set('castellano');
    facade = TestBed.inject(HistoryFiltersFacade);
    facade.loadIndex();
    TestBed.inject(HttpTestingController)
      .expectOne('/api/curriculum/filter-index')
      .flush(FILTER_INDEX);
    fixture = TestBed.createComponent(HistoryFiltersComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(LayoutService).language.set('castellano'));

  it('goes from level to course, module and RA', () => {
    expect(fieldLabels()).toEqual(['Ciclo o nivel', 'Curso', 'Módulo', 'RA']);
    const [, moduleSelect, raSelect] = selects();
    expect(raSelect!.disabled).toBe(true);
    expect(raSelect!.options[0]!.textContent?.trim()).toBe('Elige antes un módulo');

    choose(moduleSelect!, PEINADOS);
    expect(facade.module()).toBe(PEINADOS);
    expect(raSelect!.disabled).toBe(false);
    expect(raSelect!.options[0]!.textContent?.trim()).toBe('Todos los RA');

    choose(raSelect!, `${PEINADOS}|RA1`);
    expect(facade.ra()).toBe(`${PEINADOS}|RA1`);
  });

  it('chooses the course with the segmented buttons in the active language', () => {
    TestBed.inject(LayoutService).language.set('catalan');
    fixture.detectChanges();
    expect(cursoButtons().map((b) => b.textContent?.trim())).toEqual(['Todos', '1r', '2n']);
    cursoButtons()[2]!.click();
    fixture.detectChanges();
    expect(facade.curso()).toBe('2º');
    expect(cursoButtons()[2]!.classList).toContain('history-filters__curso--active');
    cursoButtons()[0]!.click();
    expect(facade.curso()).toBeNull();
  });

  it('changes the level and uses subjects and CE in the ESO', () => {
    choose(selects()[0]!, 'ESO_ORDINARIA');
    expect(tab()).toBe('ESO_ORDINARIA');
    expect(fieldLabels()).toContain('Materia');
    expect(fieldLabels()).toContain('CE');
    const [, subject, ce] = selects().slice(-3);
    expect(subject!.options[0]!.textContent?.trim()).toBe('Todas las materias');
    expect(ce!.options[0]!.textContent?.trim()).toBe('Elige antes una materia');
    choose(subject!, subject!.options[1]!.value);
    expect(ce!.options[0]!.textContent?.trim()).toBe('Todas las CE');
  });

  it('hides the course selector when the level has a single course and dims it while searching', () => {
    tab.set('CFGM_ESTETICA');
    facade.searchQuery.set('algo');
    fixture.detectChanges();
    expect(cursoButtons()).toEqual([]);
    expect(root().querySelector('.history-filters--searching')).toBeTruthy();
  });
});

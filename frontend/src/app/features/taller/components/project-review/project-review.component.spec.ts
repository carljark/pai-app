import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectReviewComponent } from './project-review.component';
import { ProjectReviewFacade } from '../../../projects/services/project-review.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { ReviewApplyFacade } from '../../../projects/services/review-apply.facade';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

const dimensions = [
  { id: 'timing', score: 2, justification: 'Muy apretado', suggestions: ['Añadir sesiones'] },
  {
    id: 'coherence',
    score: 5,
    justification: 'Buen hilo',
    suggestions: ['Nada', 'Revisar fase 2'],
    section: 'Fase 2',
  },
  { id: 'clarity', score: 3, justification: 'Correcta', suggestions: ['Tablas'] },
];
const completed = {
  status: 'completada',
  overall: 3.3,
  summary: 'Resumen global',
  usedModel: 'gemini-3.6-flash',
  dimensions,
};

describe('ProjectReviewComponent', () => {
  let fixture: ComponentFixture<ProjectReviewComponent>;
  let facade: any;
  let currentProject: ReturnType<typeof signal<any>>;
  let currentUser: ReturnType<typeof signal<any>>;
  let readOnly: ReturnType<typeof signal<boolean>>;
  let blocked: ReturnType<typeof signal<boolean>>;
  let t: ReturnType<typeof signal<any>>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent || '';
  const query = (selector: string) => el().querySelector(selector) as HTMLElement | null;
  const render = () => fixture.detectChanges();

  beforeEach(async () => {
    currentProject = signal<any>({ _id: 'p1', generatedContent: { rawText: 'Texto' } });
    currentUser = signal<any>({ role: 'teacher', canUseAi: true });
    readOnly = signal(false);
    blocked = signal(false);
    t = signal(TRANSLATIONS_ES);
    facade = {
      review: signal<any>(null),
      isReviewing: signal(false),
      hasResults: signal(false),
      stale: signal(false),
      reviewError: signal(false),
      reviewCurrentProject: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ProjectReviewComponent],
      providers: [
        { provide: ProjectReviewFacade, useValue: facade },
        { provide: ProjectsFacade, useValue: { currentProject, isThinking: signal(false) } },
        { provide: TranslationService, useValue: { t } },
        { provide: AuthFacade, useValue: { currentUser } },
        { provide: EditLockFacade, useValue: { readOnly, blocked } },
        {
          provide: ReviewApplyFacade,
          useValue: { applying: signal(null), failed: signal(null), apply: vi.fn() },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectReviewComponent);
    render();
  });

  const showResults = () => {
    facade.review.set(completed);
    facade.hasResults.set(true);
    render();
  };

  it('ofrece revisar un proyecto con contenido y lanza la revisión al pulsar', () => {
    expect(text()).toContain(TRANSLATIONS_ES.reviewIntro);
    query('.project-review__action')!.click();
    expect(facade.reviewCurrentProject).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.expanded()).toBe(true);
  });

  it('no muestra nada sin contenido ni a quien no puede revisar y no tiene resultados', () => {
    currentProject.set({ _id: 'p1' });
    render();
    expect(query('.project-review')).toBeNull();

    currentProject.set({ _id: 'p1', generatedContent: { rawText: 'Texto' } });
    currentUser.set({ role: 'teacher', canUseAi: false });
    render();
    expect(query('.project-review')).toBeNull();

    currentUser.set({ role: 'admin', canUseAi: false });
    render();
    expect(query('.project-review__action')).not.toBeNull();

    readOnly.set(true);
    render();
    expect(query('.project-review')).toBeNull();
  });

  it('en solo lectura muestra los resultados sin botón de revisar', () => {
    readOnly.set(true);
    showResults();
    expect(query('.project-review__action')).toBeNull();
    expect(text()).toContain('3.3');
  });

  it('muestra el estado en curso sin botón y los avisos de error y desactualizada', () => {
    facade.isReviewing.set(true);
    render();
    expect(text()).toContain(TRANSLATIONS_ES.reviewInProgress);
    expect(query('.project-review__action')).toBeNull();
    expect(text()).not.toContain(TRANSLATIONS_ES.reviewIntro);

    facade.isReviewing.set(false);
    facade.reviewError.set(true);
    render();
    expect(query('[role="alert"]')?.textContent).toContain(TRANSLATIONS_ES.reviewError);

    showResults();
    facade.stale.set(true);
    render();
    expect(text()).toContain(TRANSLATIONS_ES.reviewStale);
    expect(query('.project-review__action')?.textContent).toContain(TRANSLATIONS_ES.reviewAgainBtn);
  });

  it('despliega los resultados en orden fijo con su nivel de nota', () => {
    showResults();
    expect(query('.project-review__overall--fair')?.textContent).toContain('3.3');
    expect(query('.project-review__body')).toBeNull();

    query('.project-review__toggle')!.click();
    render();
    expect(text()).toContain('Resumen global');
    const names = Array.from(el().querySelectorAll('.project-review__dimension')).map((n) =>
      n.textContent?.trim(),
    );
    expect(names).toEqual(['Coherencia', 'Temporización', 'Claridad y formato']);
    expect(query('.project-review__score--good')?.textContent).toContain('5/5');
    expect(query('.project-review__score--weak')?.textContent).toContain('2/5');
    expect(el().querySelectorAll('.review-suggestions__item')).toHaveLength(4);
    expect(el().querySelectorAll('.review-suggestions__apply')).toHaveLength(4);
    expect(text()).toContain(`${TRANSLATIONS_ES.reviewSection}: Fase 2`);
    // El modelo de IA solo lo ven los administradores
    expect(text()).not.toContain('gemini-3.6-flash');
    currentUser.set({ role: 'admin', canUseAi: true });
    render();
    expect(text()).toContain('gemini-3.6-flash');

    // Con el turno de otra persona no se pueden aplicar sugerencias
    blocked.set(true);
    render();
    expect(el().querySelectorAll('.review-suggestions__apply')).toHaveLength(0);

    query('.project-review__toggle')!.click();
    render();
    expect(query('.project-review__body')).toBeNull();
  });

  it('traduce los nombres de los aspectos y omite el modelo si no se conoce', () => {
    facade.review.set({ ...completed, usedModel: undefined });
    facade.hasResults.set(true);
    t.set(TRANSLATIONS_CA);
    fixture.componentInstance.expanded.set(true);
    render();
    expect(text()).toContain('Temporització');
    expect(text()).not.toContain(TRANSLATIONS_CA.reviewModel + ':');
    expect(fixture.componentInstance.dimensionLabel('desconocido')).toBe('desconocido');
    expect(fixture.componentInstance.scoreLevel(undefined)).toBe('weak');
  });

  it('tolera una revisión sin aspectos', () => {
    facade.review.set({ status: 'error' });
    render();
    expect(fixture.componentInstance.dimensions()).toEqual([]);
  });
});

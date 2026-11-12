import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReviewSuggestionsComponent } from './review-suggestions.component';
import { ReviewApplyFacade } from '../../../projects/services/review-apply.facade';
import { ProjectReviewFacade } from '../../../projects/services/project-review.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';

const dimension = {
  id: 'assessment' as const,
  score: 2,
  justification: 'Faltan instrumentos',
  suggestions: ['Autoevaluación', 'Coevaluación', 'Diana'],
};

describe('ReviewSuggestionsComponent', () => {
  let fixture: ComponentFixture<ReviewSuggestionsComponent>;
  let applyFacade: any;
  let review: ReturnType<typeof signal<any>>;
  let isThinking: ReturnType<typeof signal<boolean>>;

  const el = () => fixture.nativeElement as HTMLElement;
  const all = (selector: string) => Array.from(el().querySelectorAll<HTMLButtonElement>(selector));
  const render = (canApply = true) => {
    fixture.componentRef.setInput('dimension', dimension);
    fixture.componentRef.setInput('canApply', canApply);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    applyFacade = {
      applying: signal<string | null>(null),
      failed: signal<string | null>(null),
      apply: vi.fn(),
    };
    review = signal<any>({ applied: ['assessment:1'] });
    isThinking = signal(false);
    await TestBed.configureTestingModule({
      imports: [ReviewSuggestionsComponent],
      providers: [
        { provide: ReviewApplyFacade, useValue: applyFacade },
        { provide: ProjectReviewFacade, useValue: { review } },
        { provide: ProjectsFacade, useValue: { isThinking } },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReviewSuggestionsComponent);
  });

  it('aplica una sugerencia o todas las pendientes y marca las aplicadas', () => {
    render();
    expect(all('.review-suggestions__item--applied')).toHaveLength(1);
    expect(el().textContent).toContain(`✓ ${TRANSLATIONS_ES.reviewApplied}`);
    const buttons = all('.review-suggestions__apply');
    expect(buttons).toHaveLength(2);

    buttons[1]!.click();
    expect(applyFacade.apply).toHaveBeenCalledWith('assessment', 2);
    all('.review-suggestions__apply-all')[0]!.click();
    expect(applyFacade.apply).toHaveBeenLastCalledWith('assessment', undefined);
  });

  it('muestra «Aplicando…» y desactiva los botones mientras trabaja la IA', () => {
    applyFacade.applying.set('assessment:0');
    render();
    expect(all('.review-suggestions__apply')[0]!.textContent).toContain(
      TRANSLATIONS_ES.reviewApplying,
    );
    expect(all('.review-suggestions__apply').every((b) => b.disabled)).toBe(true);

    applyFacade.applying.set('assessment:*');
    fixture.detectChanges();
    expect(all('.review-suggestions__apply-all')[0]!.textContent).toContain(
      TRANSLATIONS_ES.reviewApplying,
    );

    applyFacade.applying.set(null);
    isThinking.set(true);
    fixture.detectChanges();
    expect(all('.review-suggestions__apply-all')[0]!.disabled).toBe(true);
  });

  it('sin permiso no hay botones; con una sola pendiente no hay «Aplicar todas»', () => {
    render(false);
    expect(all('.review-suggestions__apply')).toHaveLength(0);
    expect(all('.review-suggestions__apply-all')).toHaveLength(0);

    review.set({ applied: ['assessment:0', 'assessment:1'] });
    render();
    expect(all('.review-suggestions__apply')).toHaveLength(1);
    expect(all('.review-suggestions__apply-all')).toHaveLength(0);
  });

  it('avisa del error solo en el aspecto que falló', () => {
    review.set(null);
    applyFacade.failed.set('clarity:0');
    render();
    expect(el().querySelector('[role="alert"]')).toBeNull();
    applyFacade.failed.set('assessment:*');
    fixture.detectChanges();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain(
      TRANSLATIONS_ES.reviewApplyError,
    );
  });
});

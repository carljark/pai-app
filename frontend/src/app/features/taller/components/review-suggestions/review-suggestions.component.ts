import { Component, computed, inject, input } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { ProjectReviewFacade } from '../../../projects/services/project-review.facade';
import { ReviewApplyFacade } from '../../../projects/services/review-apply.facade';
import {
  ProjectReviewDimension,
  isSuggestionApplied,
  suggestionKey,
} from '../../../projects/models/project-review.model';

/**
 * Sugerencias de un aspecto de la revisión con IA, con «Aplicar» en cada una y «Aplicar todas»
 * para las pendientes. La IA reescribe el apartado afectado y el cambio entra en el editor.
 */
@Component({
  selector: 'app-review-suggestions',
  standalone: true,
  templateUrl: './review-suggestions.component.html',
  styleUrl: './review-suggestions.component.scss',
})
export class ReviewSuggestionsComponent {
  trans = inject(TranslationService);
  applyFacade = inject(ReviewApplyFacade);
  private review = inject(ProjectReviewFacade);
  private projects = inject(ProjectsFacade);

  dimension = input.required<ProjectReviewDimension>();
  /** Permiso de IA, poder editar el proyecto y tener el turno de edición. */
  canApply = input(false);

  /** Mientras la IA trabaja (en esta u otra sugerencia, o en el asistente) no se lanza otra. */
  busy = computed(() => Boolean(this.applyFacade.applying()) || this.projects.isThinking());

  pendingCount = computed(
    () => this.dimension().suggestions.filter((_, i) => !this.isApplied(i)).length,
  );

  /** El último intento fallido fue en este aspecto. */
  failedHere = computed(() =>
    (this.applyFacade.failed() ?? '').startsWith(`${this.dimension().id}:`),
  );

  isApplied(index: number): boolean {
    return isSuggestionApplied(this.review.review(), this.dimension().id, index);
  }

  isApplying(index?: number): boolean {
    return this.applyFacade.applying() === suggestionKey(this.dimension().id, index);
  }

  apply(index?: number): void {
    this.applyFacade.apply(this.dimension().id, index);
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { ProjectReviewFacade } from '../../../projects/services/project-review.facade';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { ReviewSuggestionsComponent } from '../review-suggestions/review-suggestions.component';
import {
  ProjectReviewDimension,
  REVIEW_DIMENSIONS,
} from '../../../projects/models/project-review.model';

/** Nota a partir de la cual un aspecto se considera bien resuelto (y por debajo de la cual, flojo). */
const GOOD_SCORE = 4;
const WEAK_SCORE = 2;

/**
 * Panel del taller con la revisión con IA: botón para pedirla, estado en curso y resultados
 * (nota global, resumen y una tarjeta por aspecto con justificación y sugerencias).
 */
@Component({
  selector: 'app-project-review',
  standalone: true,
  imports: [ReviewSuggestionsComponent],
  templateUrl: './project-review.component.html',
  styleUrl: './project-review.component.scss',
})
export class ProjectReviewComponent {
  facade = inject(ProjectReviewFacade);
  trans = inject(TranslationService);
  private projects = inject(ProjectsFacade);
  private auth = inject(AuthFacade);
  private editLock = inject(EditLockFacade);

  expanded = signal(false);

  /** Solo hay algo que revisar si el proyecto ya tiene contenido generado. */
  hasContent = computed(() => Boolean(this.projects.currentProject()?.generatedContent?.rawText));

  /** Revisar usa la IA y guarda el resultado en el proyecto: hace falta permiso de IA y poder editarlo. */
  canReview = computed(() => {
    const user = this.auth.currentUser();
    return Boolean(user?.canUseAi || user?.role === 'admin') && !this.editLock.readOnly();
  });

  /** Aplicar sugerencias cambia el texto: además, hace falta el turno de edición. */
  canApply = computed(() => this.canReview() && !this.editLock.blocked());

  /** El modelo de IA usado solo lo ven los administradores. */
  isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  /** Aspectos de la revisión en el orden fijo de la interfaz. */
  dimensions = computed<ProjectReviewDimension[]>(() => {
    const list = this.facade.review()?.dimensions ?? [];
    return REVIEW_DIMENSIONS.map((id) => list.find((d) => d.id === id)).filter(
      (d): d is ProjectReviewDimension => Boolean(d),
    );
  });

  toggle(): void {
    this.expanded.update((value) => !value);
  }

  review(): void {
    this.expanded.set(true);
    this.facade.reviewCurrentProject();
  }

  dimensionLabel(id: string): string {
    return this.trans.t().reviewDimensions[id] ?? id;
  }

  /** Modificador BEM según la nota: buena, media o floja. */
  scoreLevel(score: number | undefined): 'good' | 'fair' | 'weak' {
    if ((score ?? 0) >= GOOD_SCORE) return 'good';
    return (score ?? 0) <= WEAK_SCORE ? 'weak' : 'fair';
  }
}

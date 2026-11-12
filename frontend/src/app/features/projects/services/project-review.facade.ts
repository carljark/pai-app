import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';
import { AppFacade } from '../../../app.facade';
import { ProjectsFacade } from './projects.facade';
import { ProjectsService } from './projects.service';
import { Project } from '../models/project.model';
import { isReviewInProgress, isReviewStale } from '../models/project-review.model';

/**
 * Revisión con IA del proyecto abierto en el taller. El backend revisa en segundo plano y guarda
 * el estado en `review.status`; aquí se sigue por sondeo (como la traducción), de modo que
 * sobrevive a cambios de pantalla y recargas, y se avisa con un toast al terminar.
 */
@Injectable({ providedIn: 'root' })
export class ProjectReviewFacade {
  private projects = inject(ProjectsFacade);
  private projectsService = inject(ProjectsService);
  private appFacade = inject(AppFacade);
  private trans = inject(TranslationService);

  static readonly POLL_INTERVAL_MS = 4000;
  /** Proyectos con una revisión en seguimiento. */
  private pending = new Set<string>();
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  /** Proyecto cuya petición de revisión no se pudo iniciar (permisos, red…). */
  private startErrorFor = signal<string | null>(null);

  review = computed(() => this.projects.currentProject()?.review ?? null);
  isReviewing = computed(() => isReviewInProgress(this.review()));
  hasResults = computed(() => Boolean(this.review()?.dimensions?.length));
  stale = computed(() =>
    isReviewStale(this.review(), this.projects.currentProject()?.contentVersion),
  );
  reviewError = computed(() => {
    const failedToStart = this.startErrorFor() === this.projects.currentProjectId();
    return (!this.isReviewing() && this.review()?.status === 'error') || failedToStart;
  });

  constructor() {
    // Revisión en curso detectada en el proyecto abierto (p. ej. tras recargar): se sigue
    effect(() => {
      const project = this.projects.currentProject();
      if (!project || !this.isReviewing()) return;
      untracked(() => this.track(project._id));
    });
  }

  reviewCurrentProject(): void {
    const project = this.projects.currentProject();
    if (!project || this.isReviewing()) return;
    this.startErrorFor.set(null);
    this.projectsService
      .reviewProject(project._id, this.projects.selectedAi(), this.projects.selectedModel())
      .subscribe({
        next: (updated) => {
          this.replaceInHistory(updated);
          this.track(updated._id);
        },
        error: (err: HttpErrorResponse) => this.onStartError(project._id, err),
      });
  }

  private onStartError(projectId: string, err: HttpErrorResponse): void {
    if (err.status !== 409) {
      this.startErrorFor.set(projectId);
      return;
    }
    // Ya había una revisión en curso (otra pestaña o doble clic): se sigue esa
    this.track(projectId);
    this.pollOne(projectId);
  }

  private track(projectId: string): void {
    this.pending.add(projectId);
    this.pollTimer ??= setInterval(() => this.pollAll(), ProjectReviewFacade.POLL_INTERVAL_MS);
  }

  private untrack(projectId: string): void {
    this.pending.delete(projectId);
    if (this.pending.size > 0 || !this.pollTimer) return;
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  private pollAll(): void {
    for (const projectId of this.pending) this.pollOne(projectId);
  }

  private pollOne(projectId: string): void {
    this.projectsService.getProject(projectId).subscribe({
      next: (project) => this.onPolled(project),
      error: () => {
        // Fallo puntual de red: se reintenta en el siguiente ciclo
      },
    });
  }

  private onPolled(project: Project): void {
    this.replaceInHistory(project);
    if (isReviewInProgress(project.review)) return;
    this.untrack(project._id);
    const t = this.trans.t();
    const completed = project.review?.status === 'completada';
    const message = completed ? t.reviewCompletedToast : t.reviewFailedToast;
    this.appFacade.showToast(`${message}: ${project.title}`);
  }

  private replaceInHistory(updated: Project): void {
    this.projects.projectsHistory.update((list) =>
      list.map((p) => (p._id === updated._id ? updated : p)),
    );
  }
}

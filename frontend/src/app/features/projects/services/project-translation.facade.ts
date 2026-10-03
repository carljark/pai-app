import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LayoutService } from '../../../services/layout.service';
import { TranslationService } from '../../../services/translation.service';
import { AppFacade } from '../../../app.facade';
import { ProjectsFacade } from './projects.facade';
import { ProjectsService } from './projects.service';
import {
  ContentLanguage,
  Project,
  ProjectContentView,
  isTranslationInProgress,
  projectTextIn,
  resolveProjectContent,
} from '../models/project.model';

/**
 * Traducción de proyectos al idioma de la interfaz. El backend traduce en segundo plano y
 * guarda el estado en `translations[idioma].status`; aquí se sigue su progreso por sondeo,
 * de modo que sobrevive a cambios de pantalla y recargas, y se avisa con un toast al terminar.
 */
@Injectable({ providedIn: 'root' })
export class ProjectTranslationFacade {
  private projects = inject(ProjectsFacade);
  private projectsService = inject(ProjectsService);
  private layout = inject(LayoutService);
  private appFacade = inject(AppFacade);
  private trans = inject(TranslationService);

  static readonly POLL_INTERVAL_MS = 4000;
  /** Traducciones en seguimiento: id de proyecto → idioma de destino. */
  private pending = new Map<string, ContentLanguage>();
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  /** Proyecto cuya petición de traducción no se pudo iniciar (permisos, red…). */
  private startErrorFor = signal<string | null>(null);

  /** Versión que corresponde al proyecto actual en el idioma de la interfaz. */
  view = computed<ProjectContentView | null>(() => {
    const project = this.projects.currentProject();
    return project ? resolveProjectContent(project, this.layout.language()) : null;
  });

  isTranslating = computed(() => this.view()?.translating ?? false);
  translationError = computed(() => {
    const failedToStart = this.startErrorFor() === this.projects.currentProjectId();
    return Boolean(this.view()?.translationFailed) || failedToStart;
  });

  constructor() {
    // Traducción en curso detectada en el proyecto abierto (p. ej. tras recargar): se sigue
    effect(() => {
      const project = this.projects.currentProject();
      if (!project || !this.view()?.translating) return;
      const target = this.layout.language();
      untracked(() => this.track(project._id, target));
    });
  }

  /** Muestra en el editor la versión del idioma de la interfaz (traducción u original). */
  showCurrentProject(): void {
    const project = this.projects.currentProject();
    if (!project) return;
    const view = resolveProjectContent(project, this.layout.language());
    this.applyContent(project._id, view.language, view.text);
  }

  translateCurrentProject(): void {
    const project = this.projects.currentProject();
    if (!project || this.isTranslating()) return;
    const target = this.layout.language();
    this.startErrorFor.set(null);
    this.projectsService
      .translateProject(
        project._id,
        target,
        this.projects.selectedAi(),
        this.projects.selectedModel(),
      )
      .subscribe({
        next: (updated) => {
          this.replaceInHistory(updated);
          this.track(updated._id, target);
        },
        error: (err: HttpErrorResponse) => this.onStartError(project._id, target, err),
      });
  }

  private onStartError(projectId: string, target: ContentLanguage, err: HttpErrorResponse): void {
    if (err.status !== 409) {
      this.startErrorFor.set(projectId);
      return;
    }
    // Ya había una traducción en curso (otra pestaña o doble clic): se sigue esa
    this.track(projectId, target);
    this.pollOne(projectId, target);
  }

  private track(projectId: string, target: ContentLanguage): void {
    this.pending.set(projectId, target);
    this.pollTimer ??= setInterval(() => this.pollAll(), ProjectTranslationFacade.POLL_INTERVAL_MS);
  }

  private untrack(projectId: string): void {
    this.pending.delete(projectId);
    if (this.pending.size > 0 || !this.pollTimer) return;
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  private pollAll(): void {
    for (const [projectId, target] of this.pending) this.pollOne(projectId, target);
  }

  private pollOne(projectId: string, target: ContentLanguage): void {
    this.projectsService.getProject(projectId).subscribe({
      next: (project) => this.onPolled(project, target),
      error: () => {
        // Fallo puntual de red: se reintenta en el siguiente ciclo
      },
    });
  }

  private onPolled(project: Project, target: ContentLanguage): void {
    this.replaceInHistory(project);
    if (isTranslationInProgress(project.translations?.[target])) return;
    this.untrack(project._id);
    this.onFinished(project, target);
  }

  /** Avisa del resultado y, si el usuario está viendo ese proyecto en ese idioma, lo muestra. */
  private onFinished(project: Project, target: ContentLanguage): void {
    const completed = project.translations?.[target]?.status === 'completada';
    const t = this.trans.t();
    const message = completed ? t.translationCompletedToast : t.translationFailedToast;
    this.appFacade.showToast(`${message}: ${project.title}`);
    const isViewing =
      this.projects.currentProjectId() === project._id && this.layout.language() === target;
    if (completed && isViewing)
      this.applyContent(project._id, target, projectTextIn(project, target));
  }

  private replaceInHistory(updated: Project): void {
    this.projects.projectsHistory.update((list) =>
      list.map((p) => (p._id === updated._id ? updated : p)),
    );
  }

  /** Cambia la versión editada; el deshacer se vacía porque pertenece a la otra versión. */
  private applyContent(projectId: string, language: ContentLanguage, text: string): void {
    this.projects.contentLanguage.set(language);
    this.projects.generatedProject.set(text);
    this.projects.undoStacksByProject.update((map) => ({ ...map, [projectId]: [] }));
  }
}

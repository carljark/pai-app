import { Injectable, computed, inject, signal } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { ProjectsFacade } from './projects.facade';
import { ProjectsService } from './projects.service';
import {
  ContentLanguage,
  Project,
  ProjectContentView,
  projectTextIn,
  resolveProjectContent,
} from '../models/project.model';

/**
 * Traducción del proyecto abierto en el taller al idioma de la interfaz.
 * El original no se modifica: la traducción se guarda como versión propia del idioma.
 */
@Injectable({ providedIn: 'root' })
export class ProjectTranslationFacade {
  private projects = inject(ProjectsFacade);
  private projectsService = inject(ProjectsService);
  private layout = inject(LayoutService);

  isTranslating = signal(false);
  translationError = signal(false);

  /** Versión que corresponde al proyecto actual en el idioma de la interfaz. */
  view = computed<ProjectContentView | null>(() => {
    const project = this.projects.currentProject();
    return project ? resolveProjectContent(project, this.layout.language()) : null;
  });

  /** Muestra en el editor la versión del idioma de la interfaz (traducción u original). */
  showCurrentProject(): void {
    const view = this.view();
    if (view) this.applyContent(view.language, view.text);
  }

  translateCurrentProject(): void {
    const project = this.projects.currentProject();
    if (!project || this.isTranslating()) return;
    const target = this.layout.language();
    this.isTranslating.set(true);
    this.translationError.set(false);
    this.projectsService
      .translateProject(
        project._id,
        target,
        this.projects.selectedAi(),
        this.projects.selectedModel(),
      )
      .subscribe({
        next: (updated) => this.onTranslated(updated, target),
        error: () => {
          this.isTranslating.set(false);
          this.translationError.set(true);
        },
      });
  }

  private onTranslated(updated: Project, target: ContentLanguage): void {
    this.isTranslating.set(false);
    this.projects.projectsHistory.update((list) =>
      list.map((p) => (p._id === updated._id ? updated : p)),
    );
    // Si el usuario cambió de proyecto mientras se traducía, no se toca el editor
    if (this.projects.currentProjectId() !== updated._id) return;
    this.applyContent(target, projectTextIn(updated, target));
  }

  /** Cambia la versión editada; el deshacer se vacía porque pertenece a la otra versión. */
  private applyContent(language: ContentLanguage, text: string): void {
    const id = this.projects.currentProjectId();
    this.projects.contentLanguage.set(language);
    this.projects.generatedProject.set(text);
    if (id) this.projects.undoStacksByProject.update((map) => ({ ...map, [id]: [] }));
  }
}

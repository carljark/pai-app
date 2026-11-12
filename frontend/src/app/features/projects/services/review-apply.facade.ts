import { Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectsFacade } from './projects.facade';
import { ProjectsService } from './projects.service';
import { EditLockFacade } from './edit-lock.facade';
import { ApplySuggestionResponse, suggestionKey } from '../models/project-review.model';

/**
 * Aplicar las sugerencias de la revisión con IA. Sigue el camino del asistente del taller: guarda
 * el estado para «Deshacer», pone el texto nuevo en el editor y lo guarda como borrador.
 */
@Injectable({ providedIn: 'root' })
export class ReviewApplyFacade {
  private projects = inject(ProjectsFacade);
  private projectsService = inject(ProjectsService);
  private editLock = inject(EditLockFacade);

  /** Sugerencia que se está aplicando (`suggestionKey`), o `null`. */
  applying = signal<string | null>(null);
  /** Clave de la última sugerencia que no se pudo aplicar. */
  failed = signal<string | null>(null);

  /** Aplica una sugerencia o, sin `index`, todas las pendientes del aspecto. */
  apply(dimension: string, index?: number): void {
    const project = this.projects.currentProject();
    const context = this.projects.generatedProject();
    if (!project || !context || this.applying() || this.projects.isThinking()) return;
    const key = suggestionKey(dimension, index);
    this.start(key);
    const body = {
      context,
      dimension,
      ...(index === undefined ? {} : { index }),
      aiProvider: this.projects.selectedAi(),
      aiModel: this.projects.selectedModel(),
    };
    this.projectsService.applyReviewSuggestion(project._id, body).subscribe({
      next: (res) => this.onApplied(project._id, res),
      error: (err: HttpErrorResponse) => this.onFailed(key, err),
    });
  }

  private start(key: string): void {
    this.applying.set(key);
    this.failed.set(null);
    this.projects.pushUndo();
    this.projects.isThinking.set(true);
  }

  private onApplied(projectId: string, res: ApplySuggestionResponse): void {
    this.markApplied(projectId, res.applied);
    this.projects.generatedProject.set(res.newText);
    this.finish();
    this.projects.updateProjectStatus('borrador')?.subscribe();
  }

  private onFailed(key: string, err: HttpErrorResponse): void {
    this.projects.popUndo();
    this.finish();
    this.failed.set(key);
    this.editLock.handleConflict(err);
  }

  private finish(): void {
    this.applying.set(null);
    this.projects.isThinking.set(false);
  }

  /** Marca las sugerencias en la copia local del proyecto (el backend ya las guardó). */
  private markApplied(projectId: string, keys: string[]): void {
    this.projects.projectsHistory.update((list) =>
      list.map((p) => {
        if (p._id !== projectId || !p.review) return p;
        const applied = [...new Set([...(p.review.applied ?? []), ...keys])];
        return { ...p, review: { ...p.review, applied } };
      }),
    );
  }
}

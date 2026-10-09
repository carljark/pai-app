import { Component, effect, inject, signal, untracked } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { NotificationsFacade } from '../../../notifications/services/notifications.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { CollaborationService } from '../../../projects/services/collaboration.service';
import { ProjectChange } from '../../../projects/models/collaboration.model';

/** Registro desplegable de quién cambió el proyecto abierto en el taller y cuándo. */
@Component({
  selector: 'app-project-change-log',
  standalone: true,
  templateUrl: './project-change-log.component.html',
  styleUrl: './project-change-log.component.scss',
})
export class ProjectChangeLogComponent {
  private service = inject(CollaborationService);
  private projects = inject(ProjectsFacade);
  private notifications = inject(NotificationsFacade);
  private layout = inject(LayoutService);
  trans = inject(TranslationService);

  isOpen = signal(false);
  isLoading = signal(false);
  changes = signal<ProjectChange[]>([]);

  constructor() {
    // Abierto, se recarga al cambiar de proyecto, al editar o al cambiar el turno de edición
    effect(() => {
      this.projects.currentProjectId();
      this.projects.generatedProject();
      this.notifications.editLockEvent();
      if (this.isOpen()) untracked(() => this.load());
    });
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  load(): void {
    const id = this.projects.currentProjectId();
    if (!id) return;
    this.isLoading.set(true);
    this.service.getChanges(id).subscribe({
      next: (changes) => {
        this.changes.set(changes);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el registro de cambios', err);
        this.isLoading.set(false);
      },
    });
  }

  actionLabel(change: ProjectChange): string {
    const t = this.trans.t();
    return t.changeActions[change.action] || t.changeActionDefault;
  }

  /** Recurso, instrucción a la IA o idioma de destino, si la acción lo tiene. */
  detail(change: ProjectChange): string {
    const { filename, instruction, target } = change.details || {};
    return filename || instruction || target || '';
  }

  formatDate(value: string | Date): string {
    const locale = this.layout.language() === 'catalan' ? 'ca-ES' : 'es-ES';
    return new Date(value).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
  }
}

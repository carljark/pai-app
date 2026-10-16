import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ProjectsFacade } from '../../services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { Project } from '../../models/project.model';
import { canEditProject } from '../../utils/project-access';

/** Longitud máxima del nombre; la misma que valida el backend. */
export const MAX_PROJECT_TITLE_LENGTH = 150;

/**
 * Nombre de un proyecto en las listas, con un botón para cambiarlo. Solo lo ven quienes
 * pueden editar el proyecto (autor, colaboradores y administradores).
 */
@Component({
  selector: 'app-project-title',
  standalone: true,
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss'],
})
export class ProjectTitleComponent {
  private projects = inject(ProjectsFacade);
  private auth = inject(AuthFacade);
  private injector = inject(Injector);
  trans = inject(TranslationService);

  project = input.required<Project>();
  displayTitle = input.required<string>();

  readonly maxLength = MAX_PROJECT_TITLE_LENGTH;
  editing = signal(false);
  draft = signal('');
  saving = signal(false);
  failed = signal(false);
  canRename = computed(() => canEditProject(this.project(), this.auth.currentUser()));

  private input = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  startEdit(): void {
    this.draft.set(this.displayTitle());
    this.failed.set(false);
    this.editing.set(true);
    afterNextRender(() => this.input()?.nativeElement.select(), { injector: this.injector });
  }

  cancel(): void {
    this.editing.set(false);
    this.failed.set(false);
  }

  save(): void {
    const title = this.draft().replace(/\s+/g, ' ').trim();
    if (!title || this.saving()) return;
    if (title === this.project().title) return this.cancel();
    this.saving.set(true);
    this.projects.renameProject(this.project()._id, title).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
      },
      error: () => {
        this.saving.set(false);
        this.failed.set(true);
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.save();
    } else if (event.key === 'Escape') {
      this.cancel();
    }
  }
}

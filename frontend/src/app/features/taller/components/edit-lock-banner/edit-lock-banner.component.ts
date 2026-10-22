import { Component, computed, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { HelpTextsService } from '../../../help/services/help-texts.service';

/**
 * Aviso del taller sobre quién puede modificar el proyecto: solo lectura para quien no es
 * autor ni colaborador, el nombre de quien tiene el turno de edición, o el turno propio. En el
 * proyecto de ejemplo de la visita guiada invita a hacer una copia propia para editarla.
 */
@Component({
  selector: 'app-edit-lock-banner',
  standalone: true,
  templateUrl: './edit-lock-banner.component.html',
  styleUrl: './edit-lock-banner.component.scss',
})
export class EditLockBannerComponent {
  editLock = inject(EditLockFacade);
  trans = inject(TranslationService);
  help = inject(HelpTextsService);
  appFacade = inject(AppFacade);
  private projects = inject(ProjectsFacade);

  exampleProject = computed(() => {
    const project = this.projects.currentProject();
    return project?.isExample ? project : null;
  });
}

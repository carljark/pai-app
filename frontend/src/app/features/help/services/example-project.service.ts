import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppFacade } from '../../../app.facade';
import { ProjectsService } from '../../projects/services/projects.service';
import { ProjectsFacade } from '../../projects/services/projects.facade';
import { HelpTextsService } from './help-texts.service';

/** Abre en el taller el proyecto de ejemplo de la visita guiada (no está en el historial). */
@Injectable({ providedIn: 'root' })
export class ExampleProjectService {
  private service = inject(ProjectsService);
  private projects = inject(ProjectsFacade);
  private appFacade = inject(AppFacade);
  private help = inject(HelpTextsService);

  /** Devuelve `false` (y muestra el error) si no se ha podido abrir. */
  async open(): Promise<boolean> {
    try {
      const project = await firstValueFrom(this.service.getExampleProject());
      this.projects.exampleProject.set(project);
      this.appFacade.viewPastProject(project);
      return true;
    } catch {
      this.appFacade.errorTitle.set(this.help.t().tours.taller.title);
      this.appFacade.errorMessage.set(this.help.t().example.loadError);
      this.appFacade.showErrorModal.set(true);
      return false;
    }
  }
}

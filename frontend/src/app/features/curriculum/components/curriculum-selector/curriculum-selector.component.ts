import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { CriteriosFacade } from '../../services/criterios.facade';
import { CeCriteriosListComponent } from '../ce-criterios-list/ce-criterios-list.component';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { Project } from '../../../projects/models/project.model';
import { AppFacade } from '../../../../app.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  imports: [CommonModule, CeCriteriosListComponent],
  templateUrl: './curriculum-selector.component.html',
  styleUrls: ['./curriculum-selector.component.scss'],
})
export class CurriculumSelectorComponent {
  facade = inject(CurriculumFacade);
  criterios = inject(CriteriosFacade);
  projects = inject(ProjectsFacade);
  appFacade = inject(AppFacade);
  trans = inject(TranslationService);
  title = input.required<string>();
  isOpen = signal(true);

  // Novedades para el botón
  isGenerating = input<boolean>(false);
  generateText = input.required<string>();
  generatingText = input.required<string>();
  generate = output<void>();

  openProject(project: Project): void {
    this.appFacade.openProjectInNewWindow(project);
  }
}

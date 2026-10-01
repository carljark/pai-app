import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { CurriculumSelectorComponent } from '../../../curriculum/components/curriculum-selector/curriculum-selector.component';
import { AppFacade } from '../../../../app.facade'; // Will be created to hold global methods
import { AuthFacade } from '../../../auth/services/auth.facade';
import { getDefaultModelForProvider } from '../../../projects/models/project.model';

@Component({
  selector: 'app-generator-view',
  standalone: true,
  imports: [CommonModule, CurriculumSelectorComponent],
  templateUrl: './generator-view.component.html',
  styleUrls: ['./generator-view.component.scss']
})
export class GeneratorViewComponent {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);
  projects = inject(ProjectsFacade);
  appFacade = inject(AppFacade);
  auth = inject(AuthFacade);

  onCourseChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.curriculum.setCurso(value);
  }

  onMethodologyChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.projects.methodology.set(value);
  }

  onAiChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'gemini' | 'openrouter';
    this.projects.selectedAi.set(value);
    this.projects.selectedModel.set(getDefaultModelForProvider(value));
  }

  onModelChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.projects.selectedModel.set(value);
  }

  onExtraInstructionsChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.projects.extraInstructions.set(value);
  }

  generateProject() {
    this.appFacade.generateProject();
  }
}

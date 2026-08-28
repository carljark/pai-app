import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { CurriculumSelectorComponent } from '../../../curriculum/components/curriculum-selector/curriculum-selector.component';
import { AppFacade } from '../../../../app.facade'; // Will be created to hold global methods

@Component({
  selector: 'app-generator-view',
  standalone: true,
  imports: [CommonModule, CurriculumSelectorComponent],
  template: `
    <div class="app-header">
      <h2 class="app-header-title">{{ trans.t().subtitle }}</h2>
    </div>
    <div class="card">
      <div class="form-group">
        <label>{{ trans.t().generatorLevelLabel }}</label>
        <div class="tabs">
          <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'FP_BASICA'" (click)="curriculum.setTipoNivel('FP_BASICA')">{{ trans.t().courseLevelFP }}</div>
          <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'DIVERSIFICACION_CURRICULAR'" (click)="curriculum.setTipoNivel('DIVERSIFICACION_CURRICULAR')">ESO</div>
        </div>
      </div>
      
      <app-curriculum-selector 
        [title]="trans.t().selectedItemsTitle" 
        [generateText]="trans.t().generateBtn" 
        [generatingText]="trans.t().generatingBtn"
        [isGenerating]="projects.isGenerating()"
        (generate)="generateProject()">
      </app-curriculum-selector>
    </div>
  `
})
export class GeneratorViewComponent {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);
  projects = inject(ProjectsFacade);
  appFacade = inject(AppFacade);

  generateProject() {
    this.appFacade.generateProject();
  }
}

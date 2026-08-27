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
        <label>Nivel Educativo</label>
        <div class="tabs">
          <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'FP_BASICA'" (click)="curriculum.tipoNivel.set('FP_BASICA')">FP Básica</div>
          <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'DIVERSIFICACION_CURRICULAR'" (click)="curriculum.tipoNivel.set('DIVERSIFICACION_CURRICULAR')">Diversificación Curricular</div>
        </div>
      </div>
      
      <app-curriculum-selector [title]="trans.t().selectedItemsTitle" [generateText]="trans.t().generateBtn" [generatingText]="trans.t().generatingBtn"></app-curriculum-selector>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <button (click)="generateProject()" [disabled]="projects.isGenerating()" class="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {{ projects.isGenerating() ? trans.t().generatingBtn : trans.t().generateBtn }}
        </button>
      </div>
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

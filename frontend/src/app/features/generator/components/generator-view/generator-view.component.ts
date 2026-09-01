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
      <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 24px;">
        <div class="form-group" style="flex: 1; min-width: 250px; margin-bottom: 0;">
          <label>{{ trans.t().generatorLevelLabel }}</label>
          <div class="tabs">
            <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'FP_BASICA'" (click)="curriculum.setTipoNivel('FP_BASICA')">{{ trans.t().courseLevelFP }}</div>
            <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'DIVERSIFICACION_CURRICULAR'" (click)="curriculum.setTipoNivel('DIVERSIFICACION_CURRICULAR')">ESO</div>
          </div>
        </div>
        
        <div class="form-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
          <label>{{ trans.t().generatorCourseLabel }}</label>
          <div class="tabs">
            @if (curriculum.tipoNivel() === 'FP_BASICA') {
              <div class="tabs-item" [class.active]="curriculum.curso() === '1º'" (click)="curriculum.setCurso('1º')">1º</div>
              <div class="tabs-item" [class.active]="curriculum.curso() === '2º'" (click)="curriculum.setCurso('2º')">2º</div>
            } @else {
              <div class="tabs-item" [class.active]="curriculum.curso() === '3º'" (click)="curriculum.setCurso('3º')">3º</div>
              <div class="tabs-item" [class.active]="curriculum.curso() === '4º'" (click)="curriculum.setCurso('4º')">4º</div>
            }
          </div>
        </div>

        <div class="form-group" style="flex: 2; min-width: 320px; margin-bottom: 0;">
          <label>{{ trans.t().generatorMethodologyLabel }}</label>
          <div class="tabs">
            <div class="tabs-item" [class.active]="projects.methodology().includes('ABP')" (click)="projects.methodology.set('ABP (Aprendizaje Basado en Problemas / Proyectos)')">{{ trans.t().methodologyABP }}</div>
            <div class="tabs-item" [class.active]="projects.methodology().includes('ABR')" (click)="projects.methodology.set('ABR (Aprendizaje Basado en Retos)')">{{ trans.t().methodologyABR }}</div>
            <div class="tabs-item" [class.active]="projects.methodology().includes('ApS')" (click)="projects.methodology.set('ApS (Aprendizaje y Servicio)')">{{ trans.t().methodologyApS }}</div>
          </div>
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

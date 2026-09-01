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
        
        <div class="form-group" style="flex: 1; min-width: 180px; margin-bottom: 0;">
          <label for="generator-course-select">{{ trans.t().generatorCourseLabel }}</label>
          <select 
            id="generator-course-select"
            class="form-select" 
            [value]="curriculum.curso()" 
            (change)="onCourseChange($event)">
            @if (curriculum.tipoNivel() === 'FP_BASICA') {
              <option value="1º">1º</option>
              <option value="2º">2º</option>
            } @else {
              <option value="3º">3º</option>
              <option value="4º">4º</option>
            }
          </select>
        </div>

        <div class="form-group" style="flex: 2; min-width: 280px; margin-bottom: 0;">
          <label for="generator-methodology-select">{{ trans.t().generatorMethodologyLabel }}</label>
          <select 
            id="generator-methodology-select"
            class="form-select" 
            [value]="projects.methodology()" 
            (change)="onMethodologyChange($event)">
            <option value="ABP (Aprendizaje Basado en Problemas / Proyectos)">{{ trans.t().methodologyABP }}</option>
            <option value="ABR (Aprendizaje Basado en Retos)">{{ trans.t().methodologyABR }}</option>
            <option value="ApS (Aprendizaje y Servicio)">{{ trans.t().methodologyApS }}</option>
          </select>
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

  onCourseChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.curriculum.setCurso(value);
  }

  onMethodologyChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.projects.methodology.set(value);
  }

  generateProject() {
    this.appFacade.generateProject();
  }
}

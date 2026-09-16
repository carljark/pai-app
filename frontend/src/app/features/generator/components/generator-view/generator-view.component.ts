import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { CurriculumSelectorComponent } from '../../../curriculum/components/curriculum-selector/curriculum-selector.component';
import { AppFacade } from '../../../../app.facade'; // Will be created to hold global methods
import { AuthFacade } from '../../../auth/services/auth.facade';

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
            <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'DIVERSIFICACION_CURRICULAR'" (click)="curriculum.setTipoNivel('DIVERSIFICACION_CURRICULAR')">{{ trans.t().courseLevelPDC }}</div>
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
              <option value="1º" [selected]="curriculum.curso() === '1º'">{{ trans.t().firstYearOption }}</option>
              <option value="2º" [selected]="curriculum.curso() === '2º'">{{ trans.t().secondYearOption }}</option>
            } @else {
              <option value="3º" [selected]="curriculum.curso() === '3º'">{{ trans.t().thirdYearOption }}</option>
              <option value="4º" [selected]="curriculum.curso() === '4º'">{{ trans.t().fourthYearOption }}</option>
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

        @if (auth.currentUser()?.role === 'admin') {
          <div class="form-group" style="flex: 1.2; min-width: 180px; margin-bottom: 0;">
            <label for="generator-ai-select">{{ trans.t().generatorAiLabel }}</label>
            <select 
              id="generator-ai-select"
              class="form-select" 
              [value]="projects.selectedAi()" 
              (change)="onAiChange($event)">
              <option value="gemini">{{ trans.t().aiGemini }}</option>
              <option value="openrouter">{{ trans.t().aiOpenRouter }}</option>
            </select>
          </div>

          <div class="form-group" style="flex: 1.8; min-width: 220px; margin-bottom: 0;">
            <label for="generator-model-select">{{ trans.t().generatorModelLabel }}</label>
            <select 
              id="generator-model-select"
              class="form-select" 
              [value]="projects.selectedModel()" 
              (change)="onModelChange($event)">
              @if (projects.selectedAi() === 'gemini') {
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Último)</option>
                <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
                <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
              } @else {
                <option value="openrouter/free">Auto Gratuito (Recomendado)</option>
                <option value="nex-agi/nex-n2.5-pro:free">Nex-N2.5 Pro (Razonamiento)</option>
                <option value="dots-studio/dots-3-note-preview:free">Dots3 Note 512k (Documentos)</option>
                <option value="inclusionai/ling-3.0-flash-vl:free">Ling 3.0 Flash (Rápido)</option>
                <option value="cohere/north-mini-code:free">Cohere North Mini</option>
                <option value="liquid/lfm-2.5-2.6b:free">LiquidAI LFM 2.5</option>
              }
            </select>
          </div>
        }
      </div>
      
      <div class="form-group" style="margin-bottom: 24px;">
        <label for="generator-extra-instructions" style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-weight: 500;">{{ trans.t().generatorExtraInstructionsLabel }}</span>
          <span style="font-size: 0.8rem; color: #6b7280; font-weight: normal;">{{ trans.t().generatorExtraInstructionsOptional }}</span>
        </label>
        <textarea 
          id="generator-extra-instructions"
          class="form-input" 
          rows="3"
          [placeholder]="trans.t().generatorExtraInstructionsPlaceholder"
          [value]="projects.extraInstructions()"
          (input)="onExtraInstructionsChange($event)"
          style="resize: vertical; min-height: 72px; line-height: 1.5; font-family: inherit;">
        </textarea>
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
    this.projects.selectedModel.set(value === 'gemini' ? 'gemini-3.8-flash' : 'openrouter/free');
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

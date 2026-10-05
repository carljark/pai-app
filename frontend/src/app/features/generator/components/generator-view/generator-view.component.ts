import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { TipoNivel } from '../../../curriculum/utils/curriculum-grouping';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AIProvider } from '../../../projects/models/project.model';
import { NivelesService } from '../../../../services/niveles.service';
import { CurriculumSelectorComponent } from '../../../curriculum/components/curriculum-selector/curriculum-selector.component';
import { AppFacade } from '../../../../app.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../components/app-select/app-select.component';

@Component({
  selector: 'app-generator-view',
  standalone: true,
  imports: [CommonModule, CurriculumSelectorComponent, AppSelectComponent],
  templateUrl: './generator-view.component.html',
  styleUrls: ['./generator-view.component.scss'],
})
export class GeneratorViewComponent {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);
  projects = inject(ProjectsFacade);
  appFacade = inject(AppFacade);
  auth = inject(AuthFacade);
  niveles = inject(NivelesService);

  /** Titulaciones del catálogo para el desplegable, en el idioma activo. */
  levelOptions = computed<SelectOption[]>(() => {
    const isCa = this.layout.language() === 'catalan';
    return this.niveles
      .niveles()
      .map((nivel) => ({ value: nivel.id, label: this.niveles.nombre(nivel, isCa) }));
  });

  /** Cursos de la titulación activa según el catálogo. */
  courseOptions = computed<SelectOption[]>(() => {
    const t = this.trans.t();
    const labels: Record<string, string> = {
      '1º': t.firstYearOption,
      '2º': t.secondYearOption,
      '3º': t.thirdYearOption,
      '4º': t.fourthYearOption,
    };
    const cursos = this.niveles.find(this.curriculum.tipoNivel())?.cursos ?? [];
    return cursos.map(({ curso }) => ({ value: curso, label: labels[curso] ?? curso }));
  });

  methodologyOptions = computed<SelectOption[]>(() => [
    {
      value: 'ABP (Aprendizaje Basado en Problemas / Proyectos)',
      label: this.trans.t().methodologyABP,
    },
    { value: 'ABR (Aprendizaje Basado en Retos)', label: this.trans.t().methodologyABR },
    { value: 'ApS (Aprendizaje y Servicio)', label: this.trans.t().methodologyApS },
  ]);

  /** Solo los proveedores que ofrece el backend (Gemini puede estar desactivado). */
  aiOptions = computed<SelectOption[]>(() =>
    [
      { value: 'gemini', label: this.trans.t().aiGemini },
      { value: 'openrouter', label: this.trans.t().aiOpenRouter },
    ].filter((option) => this.projects.availableProviders().includes(option.value as AIProvider)),
  );

  modelOptions = computed<SelectOption[]>(() =>
    this.projects.availableModels().map((model) => ({ value: model.value, label: model.label })),
  );

  onLevelChange(value: string) {
    this.curriculum.setTipoNivel(value as TipoNivel);
  }

  onCourseChange(value: string) {
    this.curriculum.setCurso(value);
  }

  onMethodologyChange(value: string) {
    this.projects.methodology.set(value);
  }

  onAiChange(value: string) {
    const provider = value as 'gemini' | 'openrouter';
    this.projects.selectedAi.set(provider);
    this.projects.selectedModel.set(this.projects.defaultModelForProvider(provider));
  }

  onModelChange(value: string) {
    this.projects.selectedModel.set(value);
  }

  getUserName(id: string): string {
    return this.projects.directory().find((u) => u._id === id)?.name || id;
  }

  onExtraInstructionsChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.projects.extraInstructions.set(value);
  }

  generateProject() {
    this.appFacade.generateProject();
  }
}

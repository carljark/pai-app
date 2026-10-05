import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import {
  CurriculumFacade,
  courseModuleOrder,
} from '../../../curriculum/services/curriculum.facade';
import { TipoNivel } from '../../../curriculum/utils/curriculum-grouping';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import {
  AIProvider,
  HISTORY_TAB_LABEL_KEYS,
  HistoryTab,
} from '../../../projects/models/project.model';
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

  /** Pestañas de titulación del generador, en orden de visualización. */
  readonly levelTabs: { nivel: TipoNivel; key: (typeof HISTORY_TAB_LABEL_KEYS)[HistoryTab] }[] = [
    { nivel: 'FP_BASICA', key: HISTORY_TAB_LABEL_KEYS.FPB },
    { nivel: 'CFGM_ESTETICA', key: HISTORY_TAB_LABEL_KEYS.CFGM },
    { nivel: 'CFGM_PELUQUERIA', key: HISTORY_TAB_LABEL_KEYS.CFGM_PELUQUERIA },
    { nivel: 'CFGS_EDUCACION_INFANTIL', key: HISTORY_TAB_LABEL_KEYS.CFGS_EDUCACION_INFANTIL },
    { nivel: 'DIVERSIFICACION_CURRICULAR', key: HISTORY_TAB_LABEL_KEYS.ESO },
  ];

  /** Titulaciones para el desplegable, en el idioma activo. */
  levelOptions = computed<SelectOption[]>(() =>
    this.levelTabs.map((level) => ({ value: level.nivel, label: this.trans.t()[level.key] })),
  );

  courseOptions = computed<SelectOption[]>(() => {
    const nivel = this.curriculum.tipoNivel();
    if (nivel === 'FP_BASICA' || courseModuleOrder(nivel, '1º')) {
      return [
        { value: '1º', label: this.trans.t().firstYearOption },
        { value: '2º', label: this.trans.t().secondYearOption },
      ];
    }
    if (nivel === 'CFGM_ESTETICA') {
      return [{ value: '1º', label: this.trans.t().firstYearOption }];
    }
    return [
      { value: '3º', label: this.trans.t().thirdYearOption },
      { value: '4º', label: this.trans.t().fourthYearOption },
    ];
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

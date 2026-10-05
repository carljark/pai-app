import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';
import {
  HISTORY_TAB_LABEL_KEYS,
  HistoryTab,
  Project,
  courseLevelLabelKey,
  getHistoryTabForTipoNivel,
} from '../../../projects/models/project.model';

/** Orden de los filtros de nivel (pills) en "Mis proyectos". */
const LEVEL_FILTERS: HistoryTab[] = [
  'FPB',
  'CFGM_PELUQUERIA',
  'CFGM',
  'CFGS_EDUCACION_INFANTIL',
  'ESO_ORDINARIA',
  'ESO',
];

/** Coincidencia de la búsqueda con título, módulos o estado del proyecto. */
function matchesSearch(p: Project, q: string): boolean {
  const title = (p.title || 'Proyecto sin título').toLowerCase();
  const modules = (
    p.modules?.join(', ') ||
    p.generatedContent?.modules?.join(', ') ||
    'Varios'
  ).toLowerCase();
  const status = (p.status || '').toLowerCase();
  return title.includes(q) || modules.includes(q) || status.includes(q);
}

@Component({
  selector: 'app-personal-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './personal-view.component.scss',
  templateUrl: './personal-view.component.html',
})
export class PersonalViewComponent implements OnInit {
  appFacade = inject(AppFacade);
  projectsFacade = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  trans = inject(TranslationService);
  layout = inject(LayoutService);

  readonly levelFilters = LEVEL_FILTERS.map((id) => ({ id, key: HISTORY_TAB_LABEL_KEYS[id] }));
  levelFilter = signal<'ALL' | HistoryTab>('ALL');
  statusFilter = signal<'ALL' | 'borrador' | 'publicado' | 'error'>('ALL');
  searchQuery = signal<string>('');

  ngOnInit() {
    this.projectsFacade.loadHistory();
  }

  // Métricas
  totalCount = computed(() => this.projectsFacade.myProjects().length);
  draftsCount = computed(
    () => this.projectsFacade.myProjects().filter((p) => p.status === 'borrador').length,
  );
  publishedCount = computed(
    () => this.projectsFacade.myProjects().filter((p) => p.status === 'publicado').length,
  );
  inQueueCount = computed(
    () =>
      this.projectsFacade
        .myProjects()
        .filter((p) => p.status === 'en_cola' || p.status === 'generando').length,
  );

  filteredMyProjects = computed(() => {
    let list = this.projectsFacade.myProjects() || [];
    const levelFilter = this.levelFilter();
    if (levelFilter !== 'ALL') {
      list = list.filter((p) => getHistoryTabForTipoNivel(p.tipoNivel) === levelFilter);
    }
    const statusFilter = this.statusFilter();
    if (statusFilter !== 'ALL') list = list.filter((p) => p.status === statusFilter);
    const q = this.searchQuery().toLowerCase().trim();
    if (q) list = list.filter((p) => matchesSearch(p, q));
    return list;
  });

  getDisplayTitle(project: Project): string {
    const isGeneric =
      !project.title ||
      project.title === 'Proyecto Integrador' ||
      project.title === 'Proyecto de ESO' ||
      project.title === 'Proyecto Generado';
    if (isGeneric && project.modules && project.modules.length > 0) {
      return project.modules.join(' + ');
    }
    return project.title || this.trans.t().untitledProject;
  }

  /** Nombre del nivel (ciclo o ESO) del proyecto en el idioma activo. */
  levelLabel(project: Project): string {
    return this.trans.t()[courseLevelLabelKey(project.tipoNivel)];
  }

  labelFor(key: (typeof HISTORY_TAB_LABEL_KEYS)[HistoryTab]): string {
    return this.trans.t()[key];
  }

  getAiProviderLabel(project: Project): string | null {
    const p = project.usedAiProvider || project.aiProvider;
    if (p === 'openrouter') return this.trans.t().aiOpenRouter;
    if (p === 'gemini') return this.trans.t().aiGemini;
    if (project.usedModel) {
      return project.usedModel.toLowerCase().includes('gemini')
        ? this.trans.t().aiGemini
        : this.trans.t().aiOpenRouter;
    }
    return null;
  }
}

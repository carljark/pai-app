import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { HistoryProjectCardComponent } from '../history-project-card/history-project-card.component';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../components/app-select/app-select.component';
import {
  HistoryFilters,
  HistoryTabId,
  collectModuleOptions,
  collectRaOptions,
  matchesProjectFilters,
  parseKeywords,
  sortByRelevance,
} from '../../utils/history-filter';

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [CommonModule, HistoryProjectCardComponent, AppSelectComponent],
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.scss'],
})
export class HistoryViewComponent {
  appFacade = inject(AppFacade);
  projects = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  trans = inject(TranslationService);

  activeTab = this.projects.historyTab;
  onlyMine = signal<boolean>(false);
  searchQuery = signal<string>('');
  moduleFilter = signal<string | null>(null);
  raFilter = signal<string | null>(null);

  readonly tabs: { id: HistoryTabId; key: string }[] = [
    { id: 'FPB', key: 'courseLevelFP' },
    { id: 'CFGM_PELUQUERIA', key: 'courseLevelCFGMPeluqueria' },
    { id: 'CFGM', key: 'courseLevelCFGM' },
    { id: 'CFGS_EDUCACION_INFANTIL', key: 'courseLevelCFGSEducacionInfantil' },
    { id: 'ESO_ORDINARIA', key: 'courseLevelESO' },
    { id: 'ESO', key: 'courseLevelPDC' },
  ];

  moduleOptions = computed(() => collectModuleOptions(this.projects.projectsHistory() || []));
  raOptions = computed(() =>
    collectRaOptions(this.projects.projectsHistory() || [], this.moduleFilter()),
  );

  moduleSelectOptions = computed<SelectOption[]>(() =>
    this.moduleOptions().map((m) => ({ value: m, label: m })),
  );
  raSelectOptions = computed<SelectOption[]>(() =>
    this.raOptions().map((r) => ({ value: r, label: r })),
  );

  keywords = computed(() => parseKeywords(this.searchQuery()));
  /** Con texto en el buscador se busca en todos los niveles (las pestañas no filtran). */
  isSearching = computed(() => this.keywords().length > 0);

  filteredProjects = computed(() => {
    const owner = this.auth.currentUser();
    const ownerId = owner ? owner._id || owner.id : undefined;
    const filters: HistoryFilters = {
      tab: this.activeTab() as HistoryTabId,
      onlyMine: this.onlyMine(),
      ownerId,
      keywords: this.keywords(),
      module: this.moduleFilter(),
      ra: this.raFilter(),
    };
    const matches = (this.projects.projectsHistory() || []).filter((p) =>
      matchesProjectFilters(p, filters),
    );
    return sortByRelevance(matches, filters.keywords);
  });

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  labelFor(key: string): string {
    const t = this.trans.t();
    return t[key as keyof typeof t] || key;
  }

  onModuleChange(value: string) {
    this.moduleFilter.set(value || null);
    this.raFilter.set(null);
  }

  onRaChange(value: string) {
    this.raFilter.set(value || null);
  }
}

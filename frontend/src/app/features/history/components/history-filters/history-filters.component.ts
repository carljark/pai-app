import { Component, computed, inject } from '@angular/core';
import { AppSelectComponent } from '../../../../components/app-select/app-select.component';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';
import { NivelesService } from '../../../../services/niveles.service';
import { cursoCorto } from '../../../mapa-intermodular/utils/mapa-labels';
import { HistoryFiltersFacade } from '../../services/history-filters.facade';

/** Filtros del historial de lo general a lo específico: nivel, curso, módulo y RA. */
@Component({
  selector: 'app-history-filters',
  standalone: true,
  imports: [AppSelectComponent],
  templateUrl: './history-filters.component.html',
  styleUrl: './history-filters.component.scss',
})
export class HistoryFiltersComponent {
  filters = inject(HistoryFiltersFacade);
  trans = inject(TranslationService);
  niveles = inject(NivelesService);
  private layout = inject(LayoutService);

  isCa = computed(() => this.layout.language() === 'catalan');
  /** En la ESO se filtra por materia y CE en lugar de por módulo y RA. */
  usaRa = computed(() => this.niveles.usaRa(this.filters.activeTab()));

  /** Sin módulo elegido, el desplegable de RA está desactivado y lo indica. */
  raPlaceholder = computed(() => {
    const t = this.trans.t();
    if (!this.filters.module())
      return this.usaRa() ? t.historyFilterPickModule : t.historyFilterPickSubject;
    return this.usaRa() ? t.historyFilterAllRas : t.historyFilterAllCes;
  });

  cursoLabel(curso: string): string {
    return cursoCorto(curso, this.isCa());
  }
}

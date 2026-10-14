import { Component, inject } from '@angular/core';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { TranslationService } from '../../../../services/translation.service';
import { NivelesService } from '../../../../services/niveles.service';
import { HistoryProjectCardComponent } from '../history-project-card/history-project-card.component';
import { HistoryFiltersComponent } from '../history-filters/history-filters.component';
import { HistoryFiltersFacade } from '../../services/history-filters.facade';

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [HistoryProjectCardComponent, HistoryFiltersComponent],
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.scss'],
})
export class HistoryViewComponent {
  projects = inject(ProjectsFacade);
  trans = inject(TranslationService);
  niveles = inject(NivelesService);
  filters = inject(HistoryFiltersFacade);

  constructor() {
    // Se recarga al abrir el historial para incluir los módulos y RA de los proyectos nuevos
    this.filters.loadIndex();
  }

  onSearch(event: Event) {
    this.filters.searchQuery.set((event.target as HTMLInputElement).value);
  }
}

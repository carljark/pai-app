import { Component, inject, computed, input } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { IntermodularActivity } from '@mapa-intermodular/models/mapa-intermodular.model';
import { CommonModule } from '@angular/common';
import { MapaTab } from '../../../utils/mapa-labels';
import { NivelesService } from '../../../../../services/niveles.service';

@Component({
  selector: 'app-activities-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities-grid.component.html',
  styleUrl: './activities-grid.component.scss',
})
export class ActivitiesGridComponent {
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  private niveles = inject(NivelesService);

  activities = input.required<IntermodularActivity[]>();
  activeTab = input.required<MapaTab>();

  /** Sigla de la etapa del mapa activo («CFGB», «CFGM», «CFGS»…). */
  sigla = computed(() => {
    const tab = this.niveles.mapaTab(this.activeTab());
    return tab ? this.niveles.sigla(tab.nivel) : '';
  });

  title = computed(() =>
    `${this.isCa() ? 'Propostes d’Activitats i Reptes' : 'Propuestas de Actividades y Retos'} ${this.sigla()}`.trim(),
  );

  diversityLabel = computed(() =>
    `${this.isCa() ? 'Aprenentatges i Diversitat' : 'Aprendizajes y Diversidad'} ${this.sigla()}`.trim() + ':',
  );
}

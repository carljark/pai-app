import { Component, computed, inject, input, output } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { IntermodularConnection } from '@mapa-intermodular/models/mapa-intermodular.model';
import { ActivitiesGridComponent } from '../activities-grid/activities-grid.component';
import { MapaTab } from '../../../utils/mapa-labels';
import { relationLabel } from '../../../utils/relation-labels';
import { CestaFacade } from '../../../services/cesta.facade';
import { CestaBotonComponent } from '../cesta-boton/cesta-boton.component';

/** Ficha de una conexión: destino, criterios, justificación, actividades y «Crear proyecto». */
@Component({
  selector: 'app-connection-card',
  standalone: true,
  imports: [ActivitiesGridComponent, CestaBotonComponent],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.scss',
})
export class ConnectionCardComponent {
  private layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  connection = input.required<IntermodularConnection>();
  activeTab = input.required<MapaTab>();

  createProject = output<IntermodularConnection>();

  cesta = inject(CestaFacade);
  enCesta = computed(() => this.cesta.conexionEnCesta(this.connection()));

  getRelationLabel(type: string): string {
    return relationLabel(type, this.isCa());
  }
}

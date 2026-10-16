import { Component, computed, inject, input, output } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import type {
  FPBModule,
  IntermodularConnection,
  LearningOutcome,
} from '../../../models/mapa-intermodular.model';
import type { MapaTab } from '../../../utils/mapa-labels';
import { ConnectionCardComponent } from '../../ui/connection-card/connection-card.component';
import { MindmapDrawerComponent } from '../mindmap-drawer/mindmap-drawer.component';

/** Panel lateral del mapa mental de FP: RA de origen y ficha de la conexión elegida. */
@Component({
  selector: 'app-connection-drawer',
  standalone: true,
  imports: [MindmapDrawerComponent, ConnectionCardComponent],
  templateUrl: './connection-drawer.component.html',
  styleUrl: './connection-drawer.component.scss',
})
export class ConnectionDrawerComponent {
  private layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  sourceModule = input.required<FPBModule>();
  sourceRa = input.required<LearningOutcome>();
  connection = input.required<IntermodularConnection>();
  activeTab = input.required<MapaTab>();

  closed = output<void>();
  createProject = output<IntermodularConnection>();

  sourceModuleName = computed(() =>
    this.isCa() ? this.sourceModule().name_ca : this.sourceModule().name_es,
  );
  sourceRaText = computed(() => (this.isCa() ? this.sourceRa().text_ca : this.sourceRa().text_es));
}

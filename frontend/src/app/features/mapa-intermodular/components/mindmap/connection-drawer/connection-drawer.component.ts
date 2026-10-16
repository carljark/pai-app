import { Component, computed, inject, input, output } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import type {
  FPBModule,
  IntermodularConnection,
  LearningOutcome,
} from '../../../models/mapa-intermodular.model';
import type { MapaTab } from '../../../utils/mapa-labels';
import { ConnectionCardComponent } from '../../ui/connection-card/connection-card.component';

/** Panel lateral con la conexión elegida en el mapa mental. */
@Component({
  selector: 'app-connection-drawer',
  standalone: true,
  imports: [ConnectionCardComponent],
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

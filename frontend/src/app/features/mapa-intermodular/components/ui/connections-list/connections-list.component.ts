import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { IntermodularConnection } from '@mapa-intermodular/models/mapa-intermodular.model';
import { CommonModule } from '@angular/common';
import { ConnectionCardComponent } from '../connection-card/connection-card.component';
import { MapaTab } from '../../../utils/mapa-labels';

@Component({
  selector: 'app-connections-list',
  standalone: true,
  imports: [CommonModule, ConnectionCardComponent],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.scss',
})
export class ConnectionsListComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  connections = input.required<IntermodularConnection[]>();
  selectedCriterion = input.required<string | null>();
  step3Open = input.required<boolean>();
  activeTab = input.required<MapaTab>();

  @Output() createProject = new EventEmitter<IntermodularConnection>();
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }

  getCriterionCode(critText: string): string {
    const m =
      critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[).\s]/i) ||
      critText.match(/(?:^|\b|-)(\d*[a-z])[).\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }
}

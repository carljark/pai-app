import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { MapaTab } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { LayoutService } from '../../../../../services/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class MapaTabsComponent {
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  activeTab = input.required<MapaTab>();

  @Output() tabChange = new EventEmitter<MapaTab>();

  setTab(tab: MapaTab) {
    this.tabChange.emit(tab);
  }
}

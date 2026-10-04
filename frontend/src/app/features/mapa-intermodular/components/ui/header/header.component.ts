import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../../../services/layout.service';
import { CommonModule } from '@angular/common';
import { MapaStats } from '../../../models/mapa-intermodular.model';
import { MapaTab, mapaTabConfig, mapaTabLabel } from '../../../services/mapa-tabs.config';

@Component({
  selector: 'app-mapa-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class MapaHeaderComponent {
  layout = inject(LayoutService);

  headerExpanded = input.required<boolean>();
  activeTab = input.required<MapaTab>();
  searchQuery = input.required<string>();
  typeFilter = input.required<string>();
  stats = input.required<MapaStats>();

  isCa = computed(() => this.layout.language() === 'catalan');

  /** Título con el nombre del ciclo y el curso de la pestaña activa. */
  title = computed(() => {
    const label = mapaTabLabel(this.activeTab(), this.isCa());
    return this.activeTab() === 'FPB'
      ? `Mapa Intermodular ${label}`
      : `Mapa intermodular del ${label}`;
  });

  /** ¿La pestaña activa corresponde al 2.º curso de un ciclo? */
  isSecondYear = computed(() => mapaTabConfig(this.activeTab()).curso === '2º');

  // Outputs for parent component
  @Output() headerToggle = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() typeFilterChange = new EventEmitter<string>();

  toggleHeaderStatsHandler() {
    this.headerToggle.emit();
  }

  onSearch(query: string) {
    this.searchChange.emit(query);
  }

  onSetTypeFilter(type: string) {
    this.typeFilterChange.emit(type);
  }
}

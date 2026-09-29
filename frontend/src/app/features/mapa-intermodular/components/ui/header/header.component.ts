import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../../../services/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html'
})
export class MapaHeaderComponent {
  layout = inject(LayoutService);

  headerExpanded = input.required<boolean>();
  activeTab = input.required<'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2'>();
  searchQuery = input.required<string>();
  typeFilter = input.required<string>();
  stats = input.required<any>();

  isCa = computed(() => this.layout.language() === 'catalan');

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

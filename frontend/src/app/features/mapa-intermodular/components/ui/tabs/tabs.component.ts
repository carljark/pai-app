import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { MapaTab } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { LayoutService } from '../../../../../services/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mapa-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapa-tabs" style="display: flex; gap: 1rem; padding: 1rem 1rem 0; background: var(--bg-card); border-bottom: 1px solid var(--border-color);">
      <button 
        class="mapa-tab-btn" 
        [class.active]="activeTab() === 'FPB'"
        (click)="setTab('FPB')"
        style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent;"
        [style.border-bottom-color]="activeTab() === 'FPB' ? 'var(--primary-color)' : 'transparent'"
        [style.color]="activeTab() === 'FPB' ? 'var(--primary-color)' : 'inherit'">
        FPB
      </button>
      <button 
        class="mapa-tab-btn" 
        [class.active]="activeTab() === 'CFGM'"
        (click)="setTab('CFGM')"
        style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent;"
        [style.border-bottom-color]="activeTab() === 'CFGM' ? 'var(--primary-color)' : 'transparent'"
        [style.color]="activeTab() === 'CFGM' ? 'var(--primary-color)' : 'inherit'">
        {{ isCa() ? 'CFGM Estètica i Bellesa' : 'CFGM Estética y Belleza' }}
      </button>
      <button class="mapa-tab-btn" [class.active]="activeTab() === 'CFGM_PELUQUERIA'" (click)="setTab('CFGM_PELUQUERIA')" style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent;" [style.border-bottom-color]="activeTab() === 'CFGM_PELUQUERIA' ? 'var(--primary-color)' : 'transparent'" [style.color]="activeTab() === 'CFGM_PELUQUERIA' ? 'var(--primary-color)' : 'inherit'">
        {{ isCa() ? 'CFGM Perruqueria i Cosmètica Capil·lar 1r' : 'CFGM Peluquería y Cosmética Capilar 1º' }}
      </button>
      <button class="mapa-tab-btn" [class.active]="activeTab() === 'CFGM_PELUQUERIA_2'" (click)="setTab('CFGM_PELUQUERIA_2')" style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent;" [style.border-bottom-color]="activeTab() === 'CFGM_PELUQUERIA_2' ? 'var(--primary-color)' : 'transparent'" [style.color]="activeTab() === 'CFGM_PELUQUERIA_2' ? 'var(--primary-color)' : 'inherit'">
        {{ isCa() ? 'CFGM Perruqueria i Cosmètica Capil·lar 2n' : 'CFGM Peluquería y Cosmética Capilar 2º' }}
      </button>
    </div>
  `
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
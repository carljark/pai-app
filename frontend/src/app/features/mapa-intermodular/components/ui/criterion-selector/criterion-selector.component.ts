import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { LayoutService } from '../../../../../services/layout.service';

@Component({
  selector: 'app-criterion-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ra().criteria_es && ra().criteria_es.length > 0) {
      <div class="mapa-ra-criteria-box">
        <div class="mapa-ra-criteria-header">
          <span class="mapa-ra-criteria-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            {{ isCa() ? 'Criteris d’Avaluació (Filtra les coincidències):' : 'Criterios de Evaluación (Filtra las coincidencias):' }}
          </span>
          @if (selectedCriterion()) {
            <button class="mapa-criteria-clear-btn" (click)="selectCriterion(null)">
              {{ isCa() ? '✕ Veure tots' : '✕ Ver todos' }}
            </button>
          }
        </div>

        <div class="mapa-criteria-selector-grid">
          <button 
            class="mapa-criterion-pill" 
            [class.active]="selectedCriterion() === null"
            (click)="selectCriterion(null)">
            <span class="mapa-crit-letter">★</span>
            <span class="mapa-crit-label">{{ isCa() ? 'Tots els Criteris del RA' : 'Todos los Criterios del RA' }}</span>
            <span class="mapa-crit-badge-count">{{ ra().connections.length }}</span>
          </button>

          @for (crit of (isCa() ? (ra().criteria_ca || ra().criteria_es) : ra().criteria_es); track $index) {
            <button 
              class="mapa-criterion-pill" 
              [class.active]="selectedCriterion() === crit"
              (click)="selectCriterion(crit)">
              <span class="mapa-crit-letter">{{ getCriterionCode(crit) }}</span>
              <span class="mapa-crit-label">{{ crit }}</span>
              <span class="mapa-crit-badge-count">{{ facade.getConnectionsCountForCriterion(crit) }}</span>
            </button>
          }
        </div>
      </div>
    }
  `
})
export class CriterionSelectorComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  ra = input.required<any>();
  selectedCriterion = input.required<string | null>();

  @Output() onSelectCriterion = new EventEmitter<string | null>();

  selectCriterion(criterion: string | null) {
    this.onSelectCriterion.emit(criterion);
  }
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number) {
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }

  getCriterionCode(critText: string): string {
    const m = critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[\)\.\s]/i) || critText.match(/(?:^|\b|\-)(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }
}
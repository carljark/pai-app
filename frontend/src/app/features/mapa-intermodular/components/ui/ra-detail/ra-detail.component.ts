import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';

@Component({
  selector: 'app-ra-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapa-step-header mapa-step-header--2" 
      [class.open]="step2Open()"
      (click)="activateStep(2)"
      [attr.aria-expanded]="step2Open()"
      [title]="isCa() ? 'Activar i desplaçar al Pas 2' : 'Activar y desplazar al Paso 2'">
      <div class="mapa-step-header__left">
        <button 
          type="button" 
          class="mapa-step-toggle-btn"
          (click)="toggleStep(2, $event)"
          [attr.aria-label]="step2Open() ? (isCa() ? 'Col·lapsar Pas 2' : 'Colapsar Paso 2') : (isCa() ? 'Expandir Pas 2' : 'Expandir Paso 2')"
          [title]="step2Open() ? (isCa() ? 'Col·lapsar Pas 2' : 'Colapsar Paso 2') : (isCa() ? 'Expandir Pas 2' : 'Expandir Paso 2')">
          <span class="mapa-step-chevron" [class.rotated]="step2Open()">▼</span>
        </button>
        <h2 class="mapa-step-title">
          {{ isCa() ? '2. RA i Criteris d\'Avaluació' : '2. RA y Criterios de Evaluación' }}
        </h2>
      </div>
      <div class="mapa-step-header__right">
        @if (facade.selectedCriterion(); as sc) {
          <span class="mapa-active-criterion-badge">
            {{ isCa() ? 'Filtrat pel criteri:' : 'Filtrado por criterio:' }} <strong>{{ getCriterionCode(sc) }}</strong>
          </span>
        }
      </div>
    </div>

    <div tabindex="-1" class="mapa-step-body mapa-step-body--2" [class.collapsed]="!step2Open()">
      @if (facade.selectedRa(); as ra) {
        <!-- Active RA Hero Card -->
        <div class="mapa-active-ra-hero">
          <div class="mapa-active-ra-badge">
            <span class="mapa-pill-primary">{{ facade.selectedModule()?.code }} • {{ ra.code }}</span>
            <span class="mapa-active-ra-module">{{ isCa() ? facade.selectedModule()?.name_ca : facade.selectedModule()?.name_es }}</span>
          </div>
          <h3 class="mapa-active-ra-title">{{ isCa() ? ra.text_ca : ra.text_es }}</h3>

          <div class="mapa-actions-bar">
            <button class="mapa-btn-action mapa-btn-action--primary" (click)="createProject.emit()">
              {{ isCa() ? 'Crear Projecte amb aquestes connexions' : 'Crear Proyecto con estas conexiones' }}
            </button>
          </div>
        </div>

        <!-- Criteria Selector Box -->
        @if (ra.criteria_es && ra.criteria_es.length > 0) {
          <div class="mapa-ra-criteria-box">
            <div class="mapa-ra-criteria-header">
              <span class="mapa-ra-criteria-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                {{ isCa() ? 'Criteris d\'Avaluació (Filtra les coincidències):' : 'Criterios de Evaluación (Filtra las coincidencias):' }}
              </span>
              @if (facade.selectedCriterion()) {
                <button class="mapa-criteria-clear-btn" (click)="selectCriterion(null)">
                  {{ isCa() ? '✕ Veure tots' : '✕ Ver todos' }}
                </button>
              }
            </div>

            <div class="mapa-criteria-selector-grid">
              <button 
                class="mapa-criterion-pill" 
                [class.active]="facade.selectedCriterion() === null"
                (click)="selectCriterion(null)">
                <span class="mapa-crit-letter">★</span>
                <span class="mapa-crit-label">{{ isCa() ? 'Tots els Criteris del RA' : 'Todos los Criterios del RA' }}</span>
                <span class="mapa-crit-badge-count">{{ ra.connections.length }}</span>
              </button>

              @for (crit of (isCa() ? (ra.criteria_ca || ra.criteria_es) : ra.criteria_es); track $index) {
                <button 
                  class="mapa-criterion-pill" 
                  [class.active]="facade.selectedCriterion() === crit"
                  (click)="selectCriterion(crit)">
                  <span class="mapa-crit-letter">{{ getCriterionCode(crit) }}</span>
                  <span class="mapa-crit-label">{{ crit }}</span>
                  <span class="mapa-crit-badge-count">{{ facade.getConnectionsCountForCriterion(crit) }}</span>
                </button>
              }
            </div>
          </div>
        }
      } @else {
        <div class="mapa-empty-state">
          {{ isCa() ? 'Selecciona un mòdul i un RA per veure els seus criteris.' : 'Selecciona un módulo y un RA para ver sus criterios.' }}
        </div>
      }
    </div>
  `
})
export class RaDetailComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  step2Open = input.required<boolean>();
  selectedCriterion = input.required<string | null>();

  @Output() onSelectCriterion = new EventEmitter<string | null>();
  @Output() createProject = new EventEmitter<void>();
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }

  selectCriterion(criterion: string | null) {
    this.onSelectCriterion.emit(criterion);
  }

  getCriterionCode(critText: string): string {
    const m = critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[\)\.\s]/i) || critText.match(/(?:^|\b|\-)(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }
}
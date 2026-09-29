import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { IntermodularConnection } from '@mapa-intermodular/models/mapa-intermodular.model';

@Component({
  selector: 'app-connections-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="mapa-step-header mapa-step-header--3" 
      [class.open]="step3Open()"
      (click)="activateStep(3)"
      [attr.aria-expanded]="step3Open()"
      [title]="isCa() ? 'Activar i desplaçar al Pas 3' : 'Activar y desplazar al Paso 3'">
      <div class="mapa-step-header__left">
        <button 
          type="button" 
          class="mapa-step-toggle-btn"
          (click)="toggleStep(3, $event)"
          [attr.aria-label]="step3Open() ? (isCa() ? 'Col·lapsar Pas 3' : 'Colapsar Paso 3') : (isCa() ? 'Expandir Pas 3' : 'Expandir Paso 3')"
          [title]="step3Open() ? (isCa() ? 'Col·lapsar Pas 3' : 'Colapsar Paso 3') : (isCa() ? 'Expandir Pas 3' : 'Expandir Paso 3')">
          <span class="mapa-step-chevron" [class.rotated]="step3Open()">▼</span>
        </button>
        <h2 class="mapa-step-title">
          {{ isCa() ? '3. Connexions Intermodulars Coincidents' : '3. Conexiones Intermodulares Coincidentes' }}
          <span class="mapa-step-count-badge">({{ connections().length }})</span>
        </h2>
      </div>
      <div class="mapa-step-header__right">
        @if (selectedCriterion(); as sc) {
          <span class="mapa-active-criterion-badge">
            {{ isCa() ? 'Filtrat pel criteri:' : 'Filtrado por criterio:' }} <strong>{{ getCriterionCode(sc) }}</strong>
          </span>
        }
      </div>
    </div>

    <div tabindex="-1" class="mapa-step-body mapa-step-body--3" [class.collapsed]="!step3Open()">
      @if (connections().length > 0) {
        <div class="mapa-connections-section">
          <div class="mapa-connections-list">
            @for (conn of connections(); track $index) {
              <div class="mapa-connection-card">
                <div class="mapa-conn-header">
                  <div class="mapa-conn-target">
                    <span class="mapa-conn-badge">{{ conn.targetModuleCode }}</span>
                    <div>
                      <strong class="mapa-conn-mod-name">{{ isCa() ? conn.targetModuleName_ca : conn.targetModuleName_es }}</strong>
                      @if (conn.title_es) {
                        <div class="mapa-conn-coincidence-subtitle">
                          {{ isCa() ? (conn.title_ca ?? conn.title_es) : conn.title_es }}
                        </div>
                      }
                    </div>
                    <span class="mapa-target-ra-pill">{{ conn.targetRaCode }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="mapa-relation-type-tag" [class]="'tag-' + conn.relationType">
                      {{ getRelationLabel(conn.relationType) }}
                    </span>
                    <button class="mapa-btn-action mapa-btn-action--primary mapa-btn-action--sm" (click)="createProject.emit(conn)">
                      {{ isCa() ? 'Crear Projecte' : 'Crear Proyecto' }}
                    </button>
                  </div>
                </div>

                <p class="mapa-target-ra-desc">
                  {{ isCa() ? conn.targetRaText_ca : conn.targetRaText_es }}
                </p>

                <div class="mapa-criteria-breakdown">
                  @if (conn.sourceCriteria) {
                    <div class="mapa-crit-row">
                      <span class="mapa-crit-badge-label mapa-crit-badge--source">
                        {{ isCa() ? 'Criteris propis implicats:' : 'Criterios propios implicados:' }}
                      </span>
                      <span class="mapa-crit-badge-text">{{ conn.sourceCriteria }}</span>
                    </div>
                  }

                  @if (conn.relatedCriteria && conn.relatedCriteria.length > 0) {
                    <div class="mapa-crit-row mapa-crit-row--related">
                      <span class="mapa-crit-badge-label mapa-crit-badge--target">
                        {{ isCa() ? "Criteris d'altres mòduls relacionats:" : 'Criterios de otros módulos relacionados:' }}
                      </span>
                      <div class="mapa-related-chips-wrap">
                        @for (rel of conn.relatedCriteria; track rel.moduleCode + rel.criteria) {
                          <div class="mapa-related-chip-item">
                            <span class="mapa-related-code-tag">{{ rel.moduleCode }}</span>
                            <span class="mapa-related-name-tag">{{ isCa() ? (rel.moduleName_ca || rel.moduleName_es) : rel.moduleName_es }}:</span>
                            <strong class="mapa-related-crit-tag">{{ isCa() ? (rel.criteria_ca || rel.criteria) : (rel.criteria_es || rel.criteria) }}</strong>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>

                <div class="mapa-justification-box">
                  <span class="mapa-just-label">{{ isCa() ? 'Justificació Curricular i Anàlisi de Coincidència:' : 'Justificación Curricular y Análisis de Coincidencia:' }}</span>
                  <p>{{ isCa() ? conn.justification_ca : conn.justification_es }}</p>
                </div>

                <app-activities-grid 
                  [activities]="conn.activities || []"
                  [activeTab]="activeTab()">
                </app-activities-grid>
              </div>
            } @empty {
              <div class="mapa-empty-state">
                {{ isCa() ? 'No hi ha connexions registrades per a aquest RA.' : 'No hay conexiones registradas para este RA.' }}
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="mapa-empty-state">
          {{ isCa() ? 'Selecciona un mòdul de la llista superior per a visualitzar les seves connexions.' : 'Selecciona un módulo de la lista superior para visualizar sus conexiones.' }}
        </div>
      }
    </div>
  `
})
export class ConnectionsListComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  connections = input.required<IntermodularConnection[]>();
  selectedCriterion = input.required<string | null>();
  step3Open = input.required<boolean>();
  activeTab = input.required<'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2'>();

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
    const m = critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[\)\.\s]/i) || critText.match(/(?:^|\b|\-)(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }

  getRelationLabel(type: string): string {
    const labels: Record<string, { es: string; ca: string }> = {
      ciencias: { es: 'Ciencias Aplicadas', ca: 'Ciències Aplicades' },
      comunicacion: { es: 'Comunicación', ca: 'Comunicació' },
      empleabilidad: { es: 'Empleabilidad / FOL', ca: 'Ocupabilitat / FOL' },
      cliente: { es: 'Atención al Cliente', ca: 'Atenció al Client' },
      sostenibilidad: { es: 'Sostenibilidad', ca: 'Sostenibilitat' },
      digital: { es: 'Digital / Redes', ca: 'Digital / Xarxes' },
      tecnica: { es: 'Técnica Práctica', ca: 'Tècnica Pràctica' }
    };
    return this.isCa() ? (labels[type]?.ca || type) : (labels[type]?.es || type);
  }
}
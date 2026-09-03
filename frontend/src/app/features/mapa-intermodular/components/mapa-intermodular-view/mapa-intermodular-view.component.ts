import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { IntermodularConnection } from '../../models/mapa-intermodular.model';

@Component({
  selector: 'app-mapa-intermodular-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mapa-container">
      <!-- Ultra-collapsed Header by default (Only title visible) -->
      <header class="mapa-header" [class.expanded]="headerExpanded()">
        <div class="mapa-header__main-row" (click)="toggleHeaderStats()">
          <div class="mapa-header__title-group">
            <div class="mapa-header__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="18" cy="6" r="3"></circle>
                <circle cx="12" cy="18" r="3"></circle>
                <line x1="8.5" y1="7.5" x2="15.5" y2="7.5"></line>
                <line x1="7.5" y1="8.5" x2="10.5" y2="15.5"></line>
                <line x1="16.5" y1="8.5" x2="13.5" y2="15.5"></line>
              </svg>
            </div>
            <h1 class="mapa-header__title">
              {{ isCa() ? 'Mapa Intermodular FPB' : 'Mapa Intermodular FPB' }}
            </h1>
          </div>

          <button 
            class="mapa-stats-toggle-btn" 
            (click)="$event.stopPropagation(); toggleHeaderStats()" 
            [title]="isCa() ? 'Mostrar o ocultar opcions' : 'Mostrar u ocultar opciones'">
            <span class="toggle-icon">{{ headerExpanded() ? '▲' : '▼' }}</span>
            <span>{{ headerExpanded() ? (isCa() ? 'Col·lapsar' : 'Colapsar') : (isCa() ? 'Filtres i Estadístiques' : 'Filtros y Estadísticas') }}</span>
          </button>
        </div>

        @if (headerExpanded()) {
          <div class="mapa-header__expanded-body">
            <p class="mapa-header__subtitle">
              {{ isCa() 
                ? 'Explorador interactiu de connexions curriculars, criteris i activitats FPB.' 
                : 'Explorador interactivo de conexiones curriculares, criterios y actividades FPB.' }}
            </p>

            <!-- Controls in expanded header -->
            <div class="mapa-controls">
              <div class="mapa-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  [ngModel]="facade.searchQuery()" 
                  (ngModelChange)="onSearch($event)" 
                  [placeholder]="isCa() ? 'Cerca mòdul, RA o criteri...' : 'Buscar módulo, RA o criterio...'"
                />
              </div>

              <div class="mapa-filter-pills">
                <button 
                  [class.active]="facade.selectedTypeFilter() === 'all'" 
                  (click)="onSetTypeFilter('all')" 
                  class="filter-pill">
                  {{ isCa() ? 'Tots' : 'Todos' }}
                </button>
                <button 
                  [class.active]="facade.selectedTypeFilter() === 'especifico'" 
                  (click)="onSetTypeFilter('especifico')" 
                  class="filter-pill">
                  {{ isCa() ? 'Específics' : 'Específicos' }}
                </button>
                <button 
                  [class.active]="facade.selectedTypeFilter() === 'comun'" 
                  (click)="onSetTypeFilter('comun')" 
                  class="filter-pill">
                  {{ isCa() ? 'Comuns' : 'Comunes' }}
                </button>
                <button 
                  [class.active]="facade.selectedTypeFilter() === 'transversal'" 
                  (click)="onSetTypeFilter('transversal')" 
                  class="filter-pill">
                  {{ isCa() ? 'Transversals' : 'Transversales' }}
                </button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="mapa-stats">
              <div class="mapa-stat-card">
                <span class="mapa-stat-value">{{ facade.stats().totalModules }}</span>
                <span class="mapa-stat-label">{{ isCa() ? 'Mòduls FPB' : 'Módulos FPB' }}</span>
              </div>
              <div class="mapa-stat-card">
                <span class="mapa-stat-value">{{ facade.stats().totalRas }}</span>
                <span class="mapa-stat-label">{{ isCa() ? 'Resultats d’Aprenentatge' : 'Resultados de Aprendizaje' }}</span>
              </div>
              <div class="mapa-stat-card">
                <span class="mapa-stat-value">{{ facade.stats().totalConnections }}</span>
                <span class="mapa-stat-label">{{ isCa() ? 'Connexions Intermodulars' : 'Conexiones Intermodulares' }}</span>
              </div>
              <div class="mapa-stat-card">
                <span class="mapa-stat-value">{{ facade.stats().totalActivities }}</span>
                <span class="mapa-stat-label">{{ isCa() ? 'Activitats Innovadores' : 'Actividades Innovadoras' }}</span>
              </div>
            </div>
          </div>
        }
      </header>

      <!-- TOP TIER (50vh Height): Left = Modules/RAs, Right = RA Hero & Criteria Selector -->
      <div class="mapa-top-grid">
        <!-- Top Left Column: Module & RA Selector -->
        <aside class="mapa-sidebar-panel">
          <div class="mapa-panel-header">
            <h2 class="mapa-panel-title">
              {{ isCa() ? '1. Mòduls i Resultats d’Aprenentatge' : '1. Módulos y Resultados de Aprendizaje' }}
            </h2>
          </div>

          <div class="mapa-sidebar-scroll">
            <div class="mapa-modules-list">
              @for (mod of facade.filteredModules(); track mod.code) {
                <div 
                  class="mapa-module-card" 
                  [class.selected]="facade.selectedModuleCode() === mod.code"
                  (click)="onSelectModule(mod.code)">
                  <div class="mapa-module-header">
                    <span class="mapa-badge-code" [style.background]="mod.color">{{ mod.code }}</span>
                    <strong class="mapa-module-name">{{ isCa() ? mod.name_ca : mod.name_es }}</strong>
                  </div>

                  @if (facade.selectedModuleCode() === mod.code) {
                    <div class="mapa-ra-list">
                      @for (ra of mod.learningOutcomes; track ra.id) {
                        <button 
                          class="mapa-ra-item" 
                          [class.active]="facade.selectedRaId() === ra.id"
                          (click)="onSelectRa(ra.id, $event)">
                          <span class="mapa-ra-code">{{ ra.code }}</span>
                          <span class="mapa-ra-text">{{ isCa() ? ra.text_ca : ra.text_es }}</span>
                          <span class="mapa-ra-count" title="Connexions">{{ ra.connections.length }}</span>
                        </button>
                      }
                    </div>
                  }
                </div>
              } @empty {
                <div class="mapa-empty-state">
                  {{ isCa() ? 'No s’ha trobat cap mòdul amb aquest filtre.' : 'No se encontró ningún módulo con este filtro.' }}
                </div>
              }
            </div>
          </div>
        </aside>

        <!-- Top Right Column: Selected RA & Criteria Selector -->
        <section class="mapa-ra-panel">
          <div class="mapa-panel-header">
            <h2 class="mapa-panel-title">
              {{ isCa() ? '2. RA i Criteris d’Avaluació' : '2. RA y Criterios de Evaluación' }}
            </h2>
          </div>

          @if (facade.selectedRa(); as ra) {
            <div class="mapa-ra-panel-scroll">
              <!-- Active RA Hero Card -->
              <div class="mapa-active-ra-hero">
                <div class="mapa-active-ra-badge">
                  <span class="mapa-pill-primary">{{ facade.selectedModule()?.code }} • {{ ra.code }}</span>
                  <span class="mapa-active-ra-module">{{ isCa() ? facade.selectedModule()?.name_ca : facade.selectedModule()?.name_es }}</span>
                </div>
                <h3 class="mapa-active-ra-title">{{ isCa() ? ra.text_ca : ra.text_es }}</h3>

                <div class="mapa-actions-bar">
                  <button class="mapa-btn-action mapa-btn-action--primary" (click)="createProjectFromConnection()">
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
                      {{ isCa() ? 'Criteris d’Avaluació (Filtra les coincidències):' : 'Criterios de Evaluación (Filtra las coincidencias):' }}
                    </span>
                    @if (facade.selectedCriterion()) {
                      <button class="mapa-criteria-clear-btn" (click)="onSelectCriterion(null)">
                        {{ isCa() ? '✕ Veure tots' : '✕ Ver todos' }}
                      </button>
                    }
                  </div>

                  <div class="mapa-criteria-selector-grid">
                    <button 
                      class="mapa-criterion-pill" 
                      [class.active]="facade.selectedCriterion() === null"
                      (click)="onSelectCriterion(null)">
                      <span class="mapa-crit-letter">★</span>
                      <span class="mapa-crit-label">{{ isCa() ? 'Tots els Criteris del RA' : 'Todos los Criterios del RA' }}</span>
                      <span class="mapa-crit-badge-count">{{ ra.connections.length }}</span>
                    </button>

                    @for (crit of (isCa() ? (ra.criteria_ca || ra.criteria_es) : ra.criteria_es); track crit) {
                      <button 
                        class="mapa-criterion-pill" 
                        [class.active]="facade.selectedCriterion() === crit"
                        (click)="onSelectCriterion(crit)">
                        <span class="mapa-crit-letter">{{ getCriterionCode(crit) }}</span>
                        <span class="mapa-crit-label">{{ crit }}</span>
                        <span class="mapa-crit-badge-count">{{ facade.getConnectionsCountForCriterion(crit) }}</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="mapa-empty-state">
              {{ isCa() ? 'Selecciona un mòdul i un RA per veure els seus criteris.' : 'Selecciona un módulo y un RA para ver sus criterios.' }}
            </div>
          }
        </section>
      </div>

      <!-- BOTTOM TIER (100% Full Width): Intermodular Connections & Activities Section -->
      <main class="mapa-bottom-section">
        @if (facade.selectedRa(); as ra) {
          <div class="mapa-connections-section">
            <div class="mapa-connections-header-row">
              <h3 class="mapa-section-title">
                {{ isCa() ? '3. Connexions Intermodulars Coincidents' : '3. Conexiones Intermodulares Coincidentes' }}
                ({{ facade.filteredConnections().length }})
              </h3>
              @if (facade.selectedCriterion(); as sc) {
                <span class="mapa-active-criterion-badge">
                  {{ isCa() ? 'Filtrat pel criteri:' : 'Filtrado por criterio:' }} <strong>{{ getCriterionCode(sc) }}</strong>
                </span>
              }
            </div>

            <div class="mapa-connections-list">
              @for (conn of facade.filteredConnections(); track $index) {
                <div class="mapa-connection-card">
                  <!-- Target Header -->
                  <div class="mapa-conn-header">
                    <div class="mapa-conn-target">
                      <span class="mapa-conn-badge">{{ conn.targetModuleCode }}</span>
                      <div>
                        <strong class="mapa-conn-mod-name">{{ isCa() ? conn.targetModuleName_ca : conn.targetModuleName_es }}</strong>
                        @if (conn.title_es) {
                          <div class="mapa-conn-coincidence-subtitle">{{ isCa() ? (conn.title_ca || conn.title_es) : conn.title_es }}</div>
                        }
                      </div>
                      <span class="mapa-target-ra-pill">{{ conn.targetRaCode }}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <span class="mapa-relation-type-tag" [class]="'tag-' + conn.relationType">
                        {{ getRelationLabel(conn.relationType) }}
                      </span>
                      <button class="mapa-btn-action mapa-btn-action--primary mapa-btn-action--sm" (click)="createProjectFromConnection(conn)">
                        {{ isCa() ? 'Crear Projecte' : 'Crear Proyecto' }}
                      </button>
                    </div>
                  </div>

                  <p class="mapa-target-ra-desc">
                    {{ isCa() ? conn.targetRaText_ca : conn.targetRaText_es }}
                  </p>

                  <!-- Criteria Analysis & Relations -->
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
                          {{ isCa() ? 'Criteris d’altres mòduls relacionats:' : 'Criterios de otros módulos relacionados:' }}
                        </span>
                        <div class="mapa-related-chips-wrap">
                          @for (rel of conn.relatedCriteria; track rel.moduleCode + rel.criteria) {
                            <div class="mapa-related-chip-item">
                              <span class="mapa-related-code-tag">{{ rel.moduleCode }}</span>
                              <span class="mapa-related-name-tag">{{ isCa() ? rel.moduleName_ca : rel.moduleName_es }}:</span>
                              <strong class="mapa-related-crit-tag">{{ rel.criteria }}</strong>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Justification -->
                  <div class="mapa-justification-box">
                    <span class="mapa-just-label">{{ isCa() ? 'Justificació Curricular i Anàlisi de Coincidència:' : 'Justificación Curricular y Análisis de Coincidencia:' }}</span>
                    <p>{{ isCa() ? conn.justification_ca : conn.justification_es }}</p>
                  </div>

                  <!-- Activities -->
                  <div class="mapa-activities-container">
                    <h4 class="mapa-activities-title">
                      {{ isCa() ? 'Propostes d’Activitats i Reptes FPB' : 'Propuestas de Actividades y Retos FPB' }}
                    </h4>

                    <div class="mapa-activities-grid">
                      @for (act of conn.activities; track act.id) {
                        <div class="mapa-activity-item">
                          <div class="mapa-activity-header">
                            <strong class="mapa-act-title">{{ isCa() ? act.title_ca : act.title_es }}</strong>
                          </div>

                          @if (act.motivatingFactor_es) {
                            <p class="mapa-act-idea">
                              <strong>{{ isCa() ? 'Context / Idea motivadora:' : 'Contexto / Idea motivadora:' }}</strong>
                              {{ isCa() ? act.motivatingFactor_ca : act.motivatingFactor_es }}
                            </p>
                          }

                          <p class="mapa-act-desc">
                            <strong>{{ isCa() ? 'Desenvolupament:' : 'Desarrollo:' }}</strong>
                            {{ isCa() ? act.description_ca : act.description_es }}
                          </p>

                          <div class="mapa-act-meta">
                            <div class="mapa-meta-box mapa-meta-evidence">
                              <strong>{{ isCa() ? 'Producte / Evidència:' : 'Producto / Evidencia:' }}</strong>
                              <span>{{ isCa() ? act.evidence_ca : act.evidence_es }}</span>
                            </div>

                            <div class="mapa-meta-box mapa-meta-diversity">
                              <strong>{{ isCa() ? 'Aprenentatges i Diversitat FPB:' : 'Aprendizajes y Diversidad FPB:' }}</strong>
                              <span>{{ isCa() ? act.diversitySupport_ca : act.diversitySupport_es }}</span>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
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
      </main>
    </div>
  `,
  styleUrl: './mapa-intermodular-view.component.scss'
})
export class MapaIntermodularViewComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);

  headerExpanded = signal(false);

  isCa = computed(() => this.layout.language() === 'catalan');

  toggleHeaderStats() {
    this.headerExpanded.update(v => !v);
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

  onSelectModule(code: string) {
    this.facade.selectModule(code);
  }

  onSelectRa(raId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.facade.selectRa(raId);
  }

  onSetTypeFilter(type: string) {
    this.facade.setTypeFilter(type);
  }

  onSearch(query: string) {
    this.facade.setSearch(query);
  }

  onSelectCriterion(criterion: string | null) {
    this.facade.selectCriterion(criterion);
  }

  getCriterionCode(critText: string): string {
    const m = critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[\)\.\s]/i) || critText.match(/(?:^|\b|\-)(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }

  createProjectFromConnection(connection?: IntermodularConnection) {
    this.curriculum.setTipoNivel('FP_BASICA');
    const allRas = this.curriculum.ras();
    const activeRa = this.facade.selectedRa();
    const activeModule = this.facade.selectedModule();
    const selected: string[] = [];

    const findMatch = (modCode: string, modName: string, raCode: string, raTextEs: string, raTextCa: string) => {
      // 1. Exact match
      const exact = allRas.find(r => r.description === raTextEs || r.description === raTextCa);
      if (exact) return exact.description;

      // 2. Partial substring / normalized match
      const normEs = raTextEs.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
      const normCa = raTextCa.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
      const textMatch = allRas.find(r => {
        const normDesc = (r.description || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return (normEs && normDesc.includes(normEs)) || (normCa && normDesc.includes(normCa)) ||
               (normDesc && normEs.includes(normDesc.substring(0, 25)));
      });
      if (textMatch) return textMatch.description;

      // 3. Module + RA index matching
      const raIdx = raCode.replace(/\D/g, '');
      const modMatch = allRas.find(r => {
        const modStr = ((r.module || (r as any).subject || '') + ' ' + (r.id || '')).toLowerCase();
        return (modStr.includes(modCode.toLowerCase()) || modStr.includes(modName.toLowerCase().substring(0, 8))) &&
               ((r.id && r.id.toLowerCase().includes(raCode.toLowerCase())) || (r.id && r.id.replace(/\D/g, '') === raIdx));
      });
      if (modMatch) return modMatch.description;

      // 4. Default to current language text
      return this.isCa() ? (raTextCa || raTextEs) : (raTextEs || raTextCa);
    };

    if (activeRa && activeModule) {
      const sourceDesc = findMatch(activeModule.code, activeModule.name_es, activeRa.code, activeRa.text_es, activeRa.text_ca);
      if (sourceDesc) selected.push(sourceDesc);

      const conns = connection ? [connection] : this.facade.filteredConnections();
      for (const c of conns) {
        const targetDesc = findMatch(c.targetModuleCode, c.targetModuleName_es, c.targetRaCode, c.targetRaText_es, c.targetRaText_ca);
        if (targetDesc && !selected.includes(targetDesc)) {
          selected.push(targetDesc);
        }
      }
    }

    if (selected.length > 0) {
      this.curriculum.selectedRas.set(selected);
    }

    this.layout.switchView('generator');
  }
}

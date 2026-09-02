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
        }
      </main>
    </div>
  `,
  styles: [`
    .mapa-container {
      max-width: 100%;
      margin: 0;
      padding: 0;
      font-family: inherit;
    }

    /* 1. Header Styles (Ultra Compact & Expandable) */
    .mapa-header {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 10px;
      padding: 8px 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      transition: all 0.25s ease;
    }

    .mapa-header.expanded {
      padding: 14px 18px;
    }

    .mapa-header__main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .mapa-header__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mapa-header__icon {
      background: #0284c7;
      color: white;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .mapa-header__title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #0c4a6e;
      margin: 0;
      line-height: 1.2;
    }

    .mapa-header__expanded-body {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #bae6fd;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .mapa-header__subtitle {
      font-size: 0.8rem;
      color: #0369a1;
      margin: 0;
    }

    .mapa-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .mapa-search {
      position: relative;
      display: flex;
      align-items: center;
      min-width: 220px;
      flex: 1;
    }

    .mapa-search svg {
      position: absolute;
      left: 10px;
      color: #94a3b8;
    }

    .mapa-search input {
      width: 100%;
      padding: 7px 12px 7px 32px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      background: white;
    }

    .mapa-filter-pills {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background: white;
      border: 1px solid #cbd5e1;
      padding: 5px 10px;
      border-radius: 16px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #475569;
    }

    .filter-pill.active {
      background: #0284c7;
      color: white;
      border-color: #0284c7;
    }

    .mapa-stats-toggle-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background: white;
      border: 1px solid #0284c7;
      color: #0284c7;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mapa-stats-toggle-btn:hover {
      background: #0284c7;
      color: white;
    }

    .toggle-icon {
      font-size: 0.65rem;
    }

    .mapa-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #bae6fd;
    }

    .mapa-stat-card {
      background: white;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #e0f2fe;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .mapa-stat-value {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0284c7;
    }

    .mapa-stat-label {
      font-size: 0.72rem;
      color: #64748b;
      margin-top: 2px;
    }

    /* 2. TOP TIER (Compact Height Grid ~32vh) */
    .mapa-top-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      height: 32vh;
      max-height: 320px;
      min-height: 220px;
      margin-bottom: 16px;
    }

    @media (max-width: 960px) {
      .mapa-top-grid {
        grid-template-columns: 1fr;
        height: auto;
        max-height: none;
      }
    }

    .mapa-sidebar-panel,
    .mapa-ra-panel {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .mapa-panel-header {
      padding: 8px 14px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }

    .mapa-panel-title {
      font-size: 0.88rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }

    .mapa-sidebar-scroll,
    .mapa-ra-panel-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px 12px;
    }

    /* Custom thin scrollbar */
    .mapa-sidebar-scroll::-webkit-scrollbar,
    .mapa-ra-panel-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .mapa-sidebar-scroll::-webkit-scrollbar-track,
    .mapa-ra-panel-scroll::-webkit-scrollbar-track {
      background: #f8fafc;
    }
    .mapa-sidebar-scroll::-webkit-scrollbar-thumb,
    .mapa-ra-panel-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .mapa-modules-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mapa-module-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mapa-module-card:hover {
      border-color: #94a3b8;
    }

    .mapa-module-card.selected {
      border-color: #0284c7;
      box-shadow: 0 0 0 1px #0284c7;
      background: #f0f9ff;
    }

    .mapa-module-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mapa-badge-code {
      color: white;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-module-name {
      font-size: 0.85rem;
      color: #1e293b;
      flex: 1;
    }

    .mapa-ra-list {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .mapa-ra-item {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 8px;
      text-align: left;
      font-size: 0.78rem;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .mapa-ra-item.active {
      background: #0284c7;
      color: white;
      border-color: #0284c7;
    }

    .mapa-ra-code {
      font-weight: 700;
    }

    .mapa-ra-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mapa-ra-count {
      background: rgba(0,0,0,0.06);
      padding: 2px 5px;
      border-radius: 8px;
      font-size: 0.68rem;
      font-weight: 700;
    }

    .mapa-ra-item.active .mapa-ra-count {
      background: rgba(255,255,255,0.25);
    }

    /* Right Panel: Hero & Criteria Styles */
    .mapa-active-ra-hero {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
    }

    .mapa-active-ra-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
    }

    .mapa-pill-primary {
      background: #0284c7;
      color: white;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-active-ra-module {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 600;
    }

    .mapa-active-ra-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin: 0 0 8px 0;
    }

    .mapa-actions-bar {
      display: flex;
      gap: 6px;
    }

    .mapa-btn-action {
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .mapa-btn-action--primary {
      background: #10b981;
      color: white;
    }

    .mapa-btn-action--sm {
      padding: 4px 8px;
      font-size: 0.74rem;
    }

    /* Criteria Selector */
    .mapa-ra-criteria-box {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
    }

    .mapa-ra-criteria-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .mapa-ra-criteria-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      display: flex;
      align-items: center;
    }

    .mapa-criteria-clear-btn {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
    }

    .mapa-criteria-selector-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mapa-criterion-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #334155;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }

    .mapa-criterion-pill:hover {
      border-color: #0284c7;
      background: #f0f9ff;
    }

    .mapa-criterion-pill.active {
      background: #0284c7;
      color: white;
      border-color: #0369a1;
    }

    .mapa-crit-letter {
      background: rgba(0,0,0,0.06);
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 0.72rem;
      flex-shrink: 0;
    }

    .mapa-criterion-pill.active .mapa-crit-letter {
      background: rgba(255,255,255,0.25);
      color: white;
    }

    .mapa-crit-label {
      flex: 1;
      line-height: 1.35;
    }

    .mapa-crit-badge-count {
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .mapa-criterion-pill.active .mapa-crit-badge-count {
      background: white;
      color: #0284c7;
    }

    /* 3. BOTTOM TIER (100% Full Width) */
    .mapa-bottom-section {
      width: 100%;
    }

    .mapa-connections-section {
      width: 100%;
    }

    .mapa-connections-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }

    .mapa-section-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .mapa-active-criterion-badge {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 3px 10px;
      border-radius: 16px;
      font-size: 0.78rem;
    }

    .mapa-connections-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .mapa-connection-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      width: 100%;
    }

    .mapa-conn-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;
    }

    .mapa-conn-target {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mapa-conn-badge {
      background: #64748b;
      color: white;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-conn-mod-name {
      font-size: 0.95rem;
      color: #0f172a;
    }

    .mapa-conn-coincidence-subtitle {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      margin-top: 1px;
    }

    .mapa-target-ra-pill {
      background: #e2e8f0;
      color: #334155;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-relation-type-tag {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 16px;
      text-transform: uppercase;
    }

    .tag-ciencias { background: #dbeafe; color: #1e40af; }
    .tag-comunicacion { background: #dcfce7; color: #166534; }
    .tag-empleabilidad { background: #fee2e2; color: #991b1b; }
    .tag-cliente { background: #fef3c7; color: #92400e; }
    .tag-sostenibilidad { background: #ecfdf5; color: #065f46; }
    .tag-digital { background: #f3e8ff; color: #6b21a8; }
    .tag-tecnica { background: #e0f2fe; color: #075985; }

    .mapa-target-ra-desc {
      font-size: 0.88rem;
      color: #334155;
      margin: 0 0 12px 0;
    }

    /* Criteria Breakdown in Card */
    .mapa-criteria-breakdown {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
    }

    .mapa-crit-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 0.82rem;
    }

    .mapa-crit-badge-label {
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
      font-size: 0.75rem;
    }

    .mapa-crit-badge--source {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    .mapa-crit-badge--target {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
    }

    .mapa-crit-badge-text {
      color: #1e293b;
      font-weight: 600;
      align-self: center;
    }

    .mapa-related-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex: 1;
    }

    .mapa-related-chip-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: white;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.76rem;
    }

    .mapa-related-code-tag {
      background: #64748b;
      color: white;
      font-weight: 700;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.7rem;
    }

    .mapa-related-name-tag {
      color: #64748b;
    }

    .mapa-related-crit-tag {
      color: #0f172a;
    }

    .mapa-justification-box {
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
      font-size: 0.85rem;
      color: #475569;
    }

    .mapa-just-label {
      font-weight: 700;
      color: #1e293b;
      display: block;
      margin-bottom: 4px;
    }

    .mapa-justification-box p {
      margin: 0;
      line-height: 1.5;
    }

    /* Activities Container & Grid */
    .mapa-activities-container {
      margin-top: 14px;
    }

    .mapa-activities-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 10px 0;
    }

    .mapa-activities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    @media (max-width: 640px) {
      .mapa-activities-grid {
        grid-template-columns: 1fr;
      }
    }

    .mapa-activity-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mapa-act-title {
      font-size: 0.88rem;
      color: #0f172a;
    }

    .mapa-act-idea {
      font-size: 0.82rem;
      color: #475569;
      background: #f8fafc;
      padding: 6px 10px;
      border-radius: 6px;
      border-left: 3px solid #6366f1;
      margin: 0;
    }

    .mapa-act-idea strong {
      color: #4338ca;
    }

    .mapa-act-desc {
      font-size: 0.83rem;
      color: #334155;
      line-height: 1.45;
      margin: 0;
    }

    .mapa-act-meta {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 4px;
    }

    .mapa-meta-box {
      font-size: 0.74rem;
      padding: 6px 8px;
      border-radius: 6px;
      line-height: 1.35;
    }

    .mapa-meta-evidence {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }

    .mapa-meta-diversity {
      background: #fefce8;
      border: 1px solid #fef08a;
      color: #854d0e;
    }

    .mapa-empty-state {
      padding: 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 0.88rem;
    }
  `]
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
    const m = critText.match(/^(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }

  createProjectFromConnection(connection?: IntermodularConnection) {
    this.curriculum.setTipoNivel('FP_BASICA');
    const allRas = this.curriculum.ras();
    const activeRa = this.facade.selectedRa();
    const activeModule = this.facade.selectedModule();
    const selected: string[] = [];

    if (activeRa) {
      const matchSource = allRas.find(r => 
        (r.id && activeModule && r.id.includes(activeModule.code) && r.id.includes(activeRa.code)) ||
        (r.description && r.description.includes(activeRa.text_es.substring(0, 30)))
      );
      selected.push(matchSource ? matchSource.description : (this.isCa() ? activeRa.text_ca : activeRa.text_es));

      const conns = connection ? [connection] : activeRa.connections;
      for (const c of conns) {
        const match = allRas.find(r => 
          (r.id && r.id.includes(c.targetModuleCode) && r.id.includes(c.targetRaCode)) ||
          (r.description && r.description.includes(c.targetRaText_es.substring(0, 30)))
        );
        if (match && !selected.includes(match.description)) {
          selected.push(match.description);
        }
      }
    }

    if (selected.length > 0) {
      this.curriculum.selectedRas.set(selected);
    }

    this.layout.switchView('generator');
  }
}

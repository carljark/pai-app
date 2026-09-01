import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-mapa-intermodular-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mapa-container">
      <!-- Header -->
      <header class="mapa-header">
        <div class="mapa-header__title-row">
          <div class="mapa-header__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="12" cy="18" r="3"></circle>
              <line x1="8.5" y1="7.5" x2="15.5" y2="7.5"></line>
              <line x1="7.5" y1="8.5" x2="10.5" y2="15.5"></line>
              <line x1="16.5" y1="8.5" x2="13.5" y2="15.5"></line>
            </svg>
          </div>
          <div>
            <h1 class="mapa-header__title">
              {{ isCa() ? 'Mapa Intermodular FPB' : 'Mapa Intermodular FPB' }}
            </h1>
            <p class="mapa-header__subtitle">
              {{ isCa() 
                ? 'Explorador interactiu de connexions curriculars, justificacions pedagògiques i activitats adaptades per a FP Bàsica.' 
                : 'Explorador interactivo de conexiones curriculares, justificaciones pedagógicas y actividades adaptadas para FP Básica.' }}
            </p>
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

        <!-- Search & Filter Controls -->
        <div class="mapa-controls">
          <div class="mapa-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              [ngModel]="facade.searchQuery()" 
              (ngModelChange)="onSearch($event)" 
              [placeholder]="isCa() ? 'Cerca per codi, mòdul o contingut...' : 'Buscar por código, módulo o contenido...'"
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
      </header>

      <!-- Main Layout -->
      <div class="mapa-grid">
        <!-- Left Column: Module & RA Selector -->
        <aside class="mapa-sidebar">
          <h2 class="mapa-section-title">
            {{ isCa() ? '1. Mòduls i Resultats d’Aprenentatge' : '1. Módulos y Resultados de Aprendizaje' }}
          </h2>

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
        </aside>

        <!-- Right Column: Intermodular Connections & Activities -->
        <main class="mapa-content">
          @if (facade.selectedRa(); as ra) {
            <!-- Active RA Summary Card -->
            <div class="mapa-active-ra-hero">
              <div class="mapa-active-ra-badge">
                <span class="mapa-pill-primary">{{ facade.selectedModule()?.code }} • {{ ra.code }}</span>
                <span class="mapa-active-ra-module">{{ isCa() ? facade.selectedModule()?.name_ca : facade.selectedModule()?.name_es }}</span>
              </div>
              <h3 class="mapa-active-ra-title">{{ isCa() ? ra.text_ca : ra.text_es }}</h3>
              @if (ra.importance_es) {
                <p class="mapa-active-ra-importance">
                  💡 <strong>{{ isCa() ? 'Importància a FPB:' : 'Importancia en FPB:' }}</strong> 
                  {{ isCa() ? ra.importance_ca : ra.importance_es }}
                </p>
              }

              <div class="mapa-actions-bar">
                <button class="mapa-btn-action mapa-btn-action--primary" (click)="createProjectFromConnection()">
                  🚀 {{ isCa() ? 'Crear Projecte amb aquesta connexió' : 'Crear Proyecto con esta conexión' }}
                </button>
                <button class="mapa-btn-action mapa-btn-action--secondary" (click)="copySummary()">
                  📋 {{ copied() ? (isCa() ? 'Copiat!' : '¡Copiado!') : (isCa() ? 'Copiar Resum' : 'Copiar Resumen') }}
                </button>
              </div>
            </div>

            <!-- Connected Modules Section -->
            <div class="mapa-connections-section">
              <h3 class="mapa-section-title">
                🔗 {{ isCa() ? 'Connexions Intermodulars Coincidents' : 'Conexiones Intermodulares Coincidentes' }}
                ({{ ra.connections.length }})
              </h3>

              <div class="mapa-connections-list">
                @for (conn of ra.connections; track conn.targetModuleCode + conn.targetRaCode) {
                  <div class="mapa-connection-card">
                    <!-- Target Header -->
                    <div class="mapa-conn-header">
                      <div class="mapa-conn-target">
                        <span class="mapa-conn-badge">{{ conn.targetModuleCode }}</span>
                        <strong>{{ isCa() ? conn.targetModuleName_ca : conn.targetModuleName_es }}</strong>
                        <span class="mapa-target-ra-pill">{{ conn.targetRaCode }}</span>
                      </div>
                      <span class="mapa-relation-type-tag" [class]="'tag-' + conn.relationType">
                        {{ getRelationLabel(conn.relationType) }}
                      </span>
                    </div>

                    <p class="mapa-target-ra-desc">
                      {{ isCa() ? conn.targetRaText_ca : conn.targetRaText_es }}
                    </p>

                    <!-- Justification -->
                    <div class="mapa-justification-box">
                      <span class="mapa-just-label">🎯 {{ isCa() ? 'Justificació Curricular:' : 'Justificación Curricular:' }}</span>
                      <p>{{ isCa() ? conn.justification_ca : conn.justification_es }}</p>
                    </div>

                    <!-- Activities -->
                    <div class="mapa-activities-container">
                      <h4 class="mapa-activities-title">
                        ✨ {{ isCa() ? 'Propostes d’Activitats i Reptes FPB' : 'Propuestas de Actividades y Retos FPB' }}
                      </h4>

                      @for (act of conn.activities; track act.id) {
                        <div class="mapa-activity-item">
                          <div class="mapa-activity-header">
                            <strong class="mapa-act-title">{{ isCa() ? act.title_ca : act.title_es }}</strong>
                          </div>

                          <p class="mapa-act-desc">{{ isCa() ? act.description_ca : act.description_es }}</p>

                          @if (act.stepByStep_es && act.stepByStep_es.length > 0) {
                            <div class="mapa-act-steps">
                              <strong>{{ isCa() ? 'Desenvolupament pas a pas:' : 'Desarrollo paso a paso:' }}</strong>
                              <ul>
                                @for (step of (isCa() ? act.stepByStep_ca : act.stepByStep_es); track step) {
                                  <li>{{ step }}</li>
                                }
                              </ul>
                            </div>
                          }

                          <div class="mapa-act-meta">
                            <div class="mapa-meta-box mapa-meta-evidence">
                              <strong>📦 {{ isCa() ? 'Evidència / Producte:' : 'Evidencia / Producto:' }}</strong>
                              <span>{{ isCa() ? act.evidence_ca : act.evidence_es }}</span>
                            </div>

                            <div class="mapa-meta-box mapa-meta-diversity">
                              <strong>🤝 {{ isCa() ? 'Atenció a la Diversitat FPB:' : 'Atención a la Diversidad FPB:' }}</strong>
                              <span>{{ isCa() ? act.diversitySupport_ca : act.diversitySupport_es }}</span>
                            </div>
                          </div>
                        </div>
                      }
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
    </div>
  `,
  styles: [`
    .mapa-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 20px 60px 20px;
      font-family: inherit;
    }

    .mapa-header {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
    }

    .mapa-header__title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .mapa-header__icon {
      background: #0284c7;
      color: white;
      padding: 12px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mapa-header__title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #0c4a6e;
      margin: 0 0 4px 0;
    }

    .mapa-header__subtitle {
      font-size: 0.95rem;
      color: #0369a1;
      margin: 0;
    }

    .mapa-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .mapa-stat-card {
      background: white;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid #e0f2fe;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .mapa-stat-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0284c7;
    }

    .mapa-stat-label {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 2px;
    }

    .mapa-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
    }

    .mapa-search {
      position: relative;
      flex: 1;
      min-width: 260px;
      display: flex;
      align-items: center;
    }

    .mapa-search svg {
      position: absolute;
      left: 12px;
      color: #94a3b8;
    }

    .mapa-search input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.9rem;
      background: white;
    }

    .mapa-filter-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background: white;
      border: 1px solid #cbd5e1;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
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

    .mapa-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 960px) {
      .mapa-grid {
        grid-template-columns: 1fr;
      }
    }

    .mapa-section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 14px 0;
    }

    .mapa-modules-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 700px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .mapa-module-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mapa-module-card:hover {
      border-color: #94a3b8;
    }

    .mapa-module-card.selected {
      border-color: #0284c7;
      box-shadow: 0 0 0 1px #0284c7;
      background: #f8fafc;
    }

    .mapa-module-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mapa-badge-code {
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .mapa-module-name {
      font-size: 0.9rem;
      color: #1e293b;
      flex: 1;
    }

    .mapa-ra-list {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mapa-ra-item {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: left;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 8px;
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
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .mapa-ra-item.active .mapa-ra-count {
      background: rgba(255,255,255,0.25);
    }

    .mapa-active-ra-hero {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }

    .mapa-active-ra-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .mapa-pill-primary {
      background: #0284c7;
      color: white;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
    }

    .mapa-active-ra-module {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
    }

    .mapa-active-ra-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }

    .mapa-active-ra-importance {
      font-size: 0.85rem;
      color: #475569;
      background: #f8fafc;
      padding: 8px 12px;
      border-left: 3px solid #0284c7;
      border-radius: 4px;
      margin: 0 0 16px 0;
    }

    .mapa-actions-bar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .mapa-btn-action {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .mapa-btn-action--primary {
      background: #10b981;
      color: white;
    }

    .mapa-btn-action--secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .mapa-connections-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mapa-connection-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .mapa-conn-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
    }

    .mapa-conn-target {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mapa-conn-badge {
      background: #64748b;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-target-ra-pill {
      background: #e2e8f0;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .mapa-relation-type-tag {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
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
      font-size: 0.9rem;
      color: #334155;
      margin: 0 0 12px 0;
    }

    .mapa-justification-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px;
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

    .mapa-activities-container {
      margin-top: 14px;
    }

    .mapa-activities-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .mapa-activity-item {
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      padding: 14px;
      margin-bottom: 10px;
    }

    .mapa-act-title {
      font-size: 0.95rem;
      color: #0369a1;
      display: block;
      margin-bottom: 6px;
    }

    .mapa-act-desc {
      font-size: 0.85rem;
      color: #334155;
      margin: 0 0 10px 0;
      line-height: 1.5;
    }

    .mapa-act-steps {
      font-size: 0.8rem;
      color: #475569;
      margin-bottom: 10px;
    }

    .mapa-act-steps ul {
      margin: 4px 0 0 0;
      padding-left: 18px;
    }

    .mapa-act-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    @media (max-width: 640px) {
      .mapa-act-meta {
        grid-template-columns: 1fr;
      }
    }

    .mapa-meta-box {
      font-size: 0.75rem;
      padding: 8px;
      border-radius: 6px;
      line-height: 1.4;
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
      font-size: 0.9rem;
    }
  `]
})
export class MapaIntermodularViewComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);

  copied = signal(false);

  isCa = computed(() => this.layout.language() === 'catalan');

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

  copySummary() {
    const summary = this.facade.exportConnectionSummary(this.layout.language());
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
  }

  createProjectFromConnection() {
    this.layout.switchView('generator');
  }
}

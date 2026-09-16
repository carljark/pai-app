import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
  selector: 'app-personal-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .personal-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }
    .stat-card {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--c-primary);
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--c-text-muted);
      font-weight: 500;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }
    .pill-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-pill {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--c-border);
      background: var(--c-surface);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      color: var(--c-text-muted);
      transition: all 0.2s;
    }
    .filter-pill:hover {
      color: var(--c-text);
      border-color: var(--c-primary);
    }
    .filter-pill.active {
      background: var(--c-primary);
      color: #ffffff;
      border-color: var(--c-primary);
    }
    .search-wrapper {
      position: relative;
      max-width: 300px;
      width: 100%;
    }
    .search-icon {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--c-text-muted); pointer-events: none;
    }
    .search-input {
      width: 100%; padding: 8px 16px 8px 36px; border: 1px solid var(--c-border); border-radius: 20px; font-size: 0.9rem;
      outline: none; transition: border-color 0.2s;
    }
    .search-input:focus { border-color: var(--c-primary); }
  `],
  template: `
    <div class="personal-container">
      <!-- Encabezado -->
      <div class="app-header" style="flex-direction: row; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 class="app-header-title" style="margin: 0;">👤 {{ trans.t().personalTitle }}</h2>
          <p style="margin: 4px 0 0 0; color: var(--c-text-muted); font-size: 0.95rem;">
            {{ trans.t().personalSubtitle }}
          </p>
        </div>
        <button (click)="layout.switchView('generator')" class="btn-primary" style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          {{ trans.t().createProjectBtn }}
        </button>
      </div>

      <!-- Tarjetas de Métricas -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-number">{{ totalCount() }}</span>
          <span class="stat-label">{{ trans.t().personalTotalProjects }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-number" style="color: #0284c7;">{{ draftsCount() }}</span>
          <span class="stat-label">{{ trans.t().personalDrafts }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-number" style="color: #16a34a;">{{ publishedCount() }}</span>
          <span class="stat-label">{{ trans.t().personalPublished }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-number" style="color: #d97706;">{{ inQueueCount() }}</span>
          <span class="stat-label">{{ trans.t().personalInQueue }}</span>
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="filter-bar">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <!-- Filtro de Nivel -->
          <div class="pill-group">
            <button class="filter-pill" [class.active]="levelFilter() === 'ALL'" (click)="levelFilter.set('ALL')">
              {{ trans.t().personalFilterAll }}
            </button>
            <button class="filter-pill" [class.active]="levelFilter() === 'FPB'" (click)="levelFilter.set('FPB')">
              {{ trans.t().courseLevelFP }}
            </button>
            <button class="filter-pill" [class.active]="levelFilter() === 'ESO'" (click)="levelFilter.set('ESO')">
              {{ trans.t().courseLevelPDC }}
            </button>
          </div>

          <!-- Filtro de Estado -->
          <div class="pill-group">
            <button class="filter-pill" [class.active]="statusFilter() === 'ALL'" (click)="statusFilter.set('ALL')">
              {{ trans.t().personalFilterAll }}
            </button>
            <button class="filter-pill" [class.active]="statusFilter() === 'borrador'" (click)="statusFilter.set('borrador')">
              {{ trans.t().personalFilterDrafts }}
            </button>
            <button class="filter-pill" [class.active]="statusFilter() === 'publicado'" (click)="statusFilter.set('publicado')">
              {{ trans.t().personalFilterPublished }}
            </button>
            <button class="filter-pill" [class.active]="statusFilter() === 'error'" (click)="statusFilter.set('error')">
              {{ trans.t().personalFilterErrors }}
            </button>
          </div>
        </div>

        <!-- Buscador -->
        <div class="search-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            [placeholder]="trans.t().personalSearchPlaceholder" 
            [(ngModel)]="searchQuery" 
            class="search-input">
        </div>
      </div>

      <!-- Lista de Proyectos Propios -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        @for (project of filteredMyProjects(); track project._id) {
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 18px 24px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <h3 style="margin: 0; font-size: 1.15rem; color: var(--c-text);">{{ getDisplayTitle(project) }}</h3>
                <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 600;">
                  {{ project.tipoNivel === 'DIVERSIFICACION_CURRICULAR' ? trans.t().courseLevelPDC : trans.t().courseLevelFP }}
                </span>
              </div>
              
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span class="badge" 
                      [class.badge-info]="project.status === 'borrador'" 
                      [class.badge-success]="project.status === 'publicado'" 
                      [class.badge-warning]="project.status === 'en_cola' || project.status === 'generando'" 
                      [class.badge-danger]="project.status === 'error'">
                  {{ project.status | uppercase }}
                </span>
                <span style="font-size: 0.85rem; color: var(--c-text-muted);">{{ project.createdAt | date:'short' }}</span>
                <span style="font-size: 0.85rem; color: var(--c-text-muted);">• {{ project.modules?.join(', ') || project.generatedContent?.modules?.join(', ') || 'Varios' }}</span>
                
                @if (getAiProviderLabel(project)) {
                  <span style="font-size: 0.75rem; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                    {{ getAiProviderLabel(project) }}
                  </span>
                }
                @if (project.generationTimeMs) {
                  <span style="font-size: 0.75rem; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 500;">
                    ⏱️ {{ (project.generationTimeMs / 1000).toFixed(1) }}s
                  </span>
                }
              </div>
            </div>

            <!-- Acciones -->
            <div style="display: flex; gap: 10px; align-items: center;">
              @if (project.status === 'error') {
                <button (click)="appFacade.retryProject(project)" class="btn-primary" style="background-color: #f59e0b; border-color: #d97706; padding: 6px 12px; font-size: 0.85rem;">
                  {{ trans.t().retryBtn }}
                </button>
                <button (click)="appFacade.viewPastProject(project)" class="btn-secondary" style="color: #ef4444;">
                  {{ trans.t().viewError }}
                </button>
              } @else if (project.status === 'borrador' || project.status === 'publicado') {
                <button (click)="appFacade.viewPastProject(project)" class="btn-primary">
                  {{ trans.t().openEditor }}
                </button>
              }
              <button (click)="appFacade.deleteProject(project._id)" class="btn-secondary" style="color: #ef4444; padding: 6px 10px;" [title]="trans.t().deleteFile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        } @empty {
          <div class="card" style="text-align: center; padding: 48px 24px; color: var(--c-text-muted); display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--c-border);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <p style="margin: 0; font-size: 1rem; font-weight: 500;">{{ trans.t().personalEmpty }}</p>
            <button (click)="layout.switchView('generator')" class="btn-primary" style="margin-top: 8px;">
              {{ trans.t().personalEmptyCta }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class PersonalViewComponent implements OnInit {
  appFacade = inject(AppFacade);
  projectsFacade = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  trans = inject(TranslationService);
  layout = inject(LayoutService);

  levelFilter = signal<'ALL' | 'FPB' | 'ESO'>('ALL');
  statusFilter = signal<'ALL' | 'borrador' | 'publicado' | 'error'>('ALL');
  searchQuery = signal<string>('');

  ngOnInit() {
    this.projectsFacade.loadHistory();
  }

  // Métricas
  totalCount = computed(() => this.projectsFacade.myProjects().length);
  draftsCount = computed(() => this.projectsFacade.myProjects().filter(p => p.status === 'borrador').length);
  publishedCount = computed(() => this.projectsFacade.myProjects().filter(p => p.status === 'publicado').length);
  inQueueCount = computed(() => this.projectsFacade.myProjects().filter(p => p.status === 'en_cola' || p.status === 'generando').length);

  filteredMyProjects = computed(() => {
    let list = this.projectsFacade.myProjects() || [];

    // Filtro de Nivel
    if (this.levelFilter() === 'FPB') {
      list = list.filter(p => p.tipoNivel === 'FP_BASICA' || !p.tipoNivel);
    } else if (this.levelFilter() === 'ESO') {
      list = list.filter(p => p.tipoNivel === 'DIVERSIFICACION_CURRICULAR' || p.tipoNivel === 'ESO');
    }

    // Filtro de Estado
    if (this.statusFilter() !== 'ALL') {
      list = list.filter(p => p.status === this.statusFilter());
    }

    // Filtro de búsqueda
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(p => {
        const title = (p.title || 'Proyecto sin título').toLowerCase();
        const modules = (p.modules?.join(', ') || p.generatedContent?.modules?.join(', ') || 'Varios').toLowerCase();
        const status = (p.status || '').toLowerCase();
        return title.includes(q) || modules.includes(q) || status.includes(q);
      });
    }

    return list;
  });

  getDisplayTitle(project: any): string {
    const isGeneric = !project.title || 
      project.title === 'Proyecto Integrador' || 
      project.title === 'Proyecto de ESO' || 
      project.title === 'Proyecto Generado';
    if (isGeneric && project.modules && project.modules.length > 0) {
      return project.modules.join(' + ');
    }
    return project.title || this.trans.t().untitledProject;
  }

  getAiProviderLabel(project: any): string | null {
    const p = project.usedAiProvider || project.aiProvider;
    if (p === 'openrouter') return this.trans.t().aiOpenRouter;
    if (p === 'gemini') return this.trans.t().aiGemini;
    if (project.usedModel) {
      return project.usedModel.toLowerCase().includes('gemini')
        ? this.trans.t().aiGemini
        : this.trans.t().aiOpenRouter;
    }
    return null;
  }
}

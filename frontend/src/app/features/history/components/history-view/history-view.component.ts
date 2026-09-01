import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .history-tabs {
      display: flex; gap: 24px; border-bottom: 1px solid var(--c-border); width: 100%; margin-top: 16px;
    }
    .history-tab {
      padding: 8px 16px;
      cursor: pointer;
      font-weight: 500;
      color: var(--c-text-muted);
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      background: none;
      border-top: none;
      border-left: none;
      border-right: none;
      font-size: 1rem;
    }
    .history-tab:hover {
      color: var(--c-text);
    }
    .history-tab.active {
      color: var(--c-primary);
      border-bottom-color: var(--c-primary);
    }
    .search-wrapper {
      position: relative;
      max-width: 320px;
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
    <div class="app-header" style="flex-direction: column; align-items: flex-start; gap: 8px; border-bottom: none; padding-bottom: 0;">
      <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 16px;">
        <h2 class="app-header-title" style="margin: 0;">{{ trans.t().historyTitle }}</h2>
        
        <div class="search-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" [placeholder]="trans.t().searchProjects" (input)="onSearch($event)" [value]="searchQuery()" class="search-input">
        </div>
      </div>
      
      <div class="history-tabs">
        <button class="history-tab" [class.active]="activeTab() === 'FPB'" (click)="activeTab.set('FPB')">
          {{ trans.t().courseLevelFP }}
        </button>
        <button class="history-tab" [class.active]="activeTab() === 'ESO'" (click)="activeTab.set('ESO')">
          {{ trans.t().courseLevelPDC }}
        </button>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
      @for (project of filteredProjects(); track project._id) {
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--c-text);">{{ project.title || trans.t().untitledProject }}</h3>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <span class="badge" [class.badge-info]="project.status === 'borrador'" [class.badge-success]="project.status === 'publicado'" [class.badge-warning]="project.status === 'en_cola' || project.status === 'generando'" [class.badge-danger]="project.status === 'error'">
                {{ project.status | uppercase }}
              </span>
              <span style="font-size: 0.85rem; color: var(--c-text-muted);">{{ project.createdAt | date:'short' }}</span>
              <span style="font-size: 0.85rem; color: var(--c-text-muted);">• {{ project.modules?.join(', ') || project.generatedContent?.modules?.join(', ') || 'Varios' }}</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            @if (project.status === 'error') {
              <button (click)="appFacade.viewPastProject(project)" class="btn-secondary" style="color: #ef4444;">{{ trans.t().viewError }}</button>
            } @else if (project.status === 'borrador' || project.status === 'publicado') {
              <button (click)="appFacade.viewPastProject(project)" class="btn-primary">{{ trans.t().openEditor }}</button>
            }
            <button (click)="appFacade.deleteProject(project._id)" class="btn-secondary" style="color: #ef4444; padding: 4px 8px;" [title]="trans.t().deleteFile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      } @empty {
        <div style="text-align: center; padding: 40px; color: var(--c-text-muted);">
          {{ trans.t().noProjectsInSection }}
        </div>
      }
    </div>
  `
})
export class HistoryViewComponent {
  appFacade = inject(AppFacade);
  projects = inject(ProjectsFacade);
  trans = inject(TranslationService);

  activeTab = signal<'FPB' | 'ESO'>('FPB');
  searchQuery = signal<string>('');

  filteredProjects = computed(() => {
    let list = this.projects.projectsHistory() || [];
    
    // Filtro de Pestaña (Nivel)
    list = list.filter(p => {
      if (this.activeTab() === 'FPB') {
        return p.tipoNivel === 'FP_BASICA';
      } else {
        return p.tipoNivel === 'DIVERSIFICACION_CURRICULAR';
      }
    });

    // Filtro de Búsqueda
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

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }
}

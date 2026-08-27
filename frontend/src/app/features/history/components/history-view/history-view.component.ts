import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';

@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-header">
      <h2 class="app-header-title">Historial de Proyectos</h2>
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      @for (project of projects.projectsHistory(); track project._id) {
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1f2937;">{{ project.title || 'Proyecto sin título' }}</h3>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <span class="badge" [class.badge-info]="project.status === 'borrador'" [class.badge-success]="project.status === 'publicado'" [class.badge-warning]="project.status === 'en_cola' || project.status === 'generando'" [class.badge-danger]="project.status === 'error'">
                {{ project.status | uppercase }}
              </span>
              <span style="font-size: 0.85rem; color: #6b7280;">{{ project.createdAt | date:'short' }}</span>
              <span style="font-size: 0.85rem; color: #6b7280;">• {{ project.modules?.join(', ') || 'Varios' }}</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            @if (project.status === 'error') {
              <button (click)="appFacade.viewPastProject(project)" class="btn-secondary" style="color: #ef4444;">Ver Error</button>
            } @else if (project.status === 'borrador' || project.status === 'publicado') {
              <button (click)="appFacade.viewPastProject(project)" class="btn-primary">Abrir Editor</button>
            }
            <button (click)="appFacade.deleteProject(project._id)" class="btn-secondary" style="color: #ef4444; padding: 4px 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      } @empty {
        <div style="text-align: center; padding: 40px; color: #6b7280;">
          No hay proyectos en esta sección.
        </div>
      }
    </div>
  `
})
export class HistoryViewComponent {
  appFacade = inject(AppFacade);
  projects = inject(ProjectsFacade);
}

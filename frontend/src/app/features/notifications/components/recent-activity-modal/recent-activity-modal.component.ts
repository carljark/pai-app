import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-recent-activity-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div 
        (click)="closeModal.emit()" 
        style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(2px);">
      </div>

      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 520px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.25); z-index: 10000; overflow: hidden; display: flex; flex-direction: column;">
        <div style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #2c3e50; font-size: 1.1rem;">Actividad Reciente</strong>
          <button (click)="closeModal.emit()" style="background: none; border: none; cursor: pointer; color: #7f8c8d; padding: 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div style="max-height: 60vh; overflow-y: auto; padding: 10px 0;">
          @if (recentProjects().length === 0) {
            <div style="padding: 30px 20px; text-align: center; color: #7f8c8d; font-size: 1rem;">
              No hay proyectos recientes en cola ni completados hoy.
            </div>
          }
          @for (p of recentProjects(); track (p._id || p.id || $index)) {
            <div style="padding: 12px 20px; border-bottom: 1px solid #f1f2f6; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <strong style="color: #2c3e50; font-size: 0.95rem; line-height: 1.3;">
                    {{ p.modules && p.modules.length > 0 ? p.modules.join(' + ') : (p.title || 'Múltiples RA/CE') }}
                  </strong>
                  @if (p.userName) {
                    <span style="font-size: 0.8rem; color: #7f8c8d; font-weight: normal; margin-left: 6px;">por {{ p.userName }}</span>
                  }
                </div>
                <span style="font-size: 0.85rem; color: #95a5a6; white-space: nowrap; margin-left: 15px;">
                  {{ (p.updatedAt || p.createdAt || p.timestamp) | date:'shortTime' }}
                </span>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: bold; flex-wrap: wrap;">
                  @if (p.status === 'en_cola') {
                    <span style="color: #f39c12; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                      En cola...
                    </span>
                  } @else if (p.status === 'generando') {
                    <span style="color: #3498db; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.58 5.58"/></svg> 
                      @if (p.phase === 'reintentando') {
                        <span style="color: #d97706; background: #fef3c7; padding: 1px 6px; border-radius: 6px; font-size: 0.8rem;">🔄 {{ trans.t().notificationRetrying }}</span>
                      } @else {
                        <span style="color: #0284c7; background: #e0f2fe; padding: 1px 6px; border-radius: 6px; font-size: 0.8rem;">🔍 {{ trans.t().notificationAnalyzing }}</span>
                      }
                      <span style="background: #e0f2fe; color: #0284c7; padding: 1px 6px; border-radius: 10px; font-size: 0.8rem; font-family: monospace;">⏱️ {{ getElapsedTime(p) }}</span>
                    </span>
                  } @else if (p.status === 'error') {
                    <span style="color: #e74c3c; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> 
                      Error
                    </span>
                  } @else {
                    <span style="color: #27ae60; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 
                      Completado
                      @if (p.generationTimeMs) {
                        <span style="color: #166534; background: #dcfce7; padding: 1px 6px; border-radius: 10px; font-size: 0.75rem; font-weight: normal;">({{ formatDurationMs(p.generationTimeMs) }})</span>
                      }
                    </span>
                  }
                </div>

                @if ((p.status === 'generando' || p.status === 'en_cola') && ((p.rasCount && p.rasCount > 2) || (p.ras && p.ras.length > 2))) {
                  <div style="font-size: 0.78rem; color: #b45309; background: #fef3c7; border: 1px solid #fde68a; border-radius: 4px; padding: 2px 6px; display: inline-flex; align-items: center; gap: 4px; align-self: flex-start;">
                    <span>⚠️ {{ trans.t().longGenerationNotice }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class RecentActivityModalComponent {
  trans = inject(TranslationService);
  isOpen = input<boolean>(false);
  recentProjects = input<any[]>([]);
  now = input<number>(Date.now());
  closeModal = output<void>();

  formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getElapsedTime(project: any): string {
    if (!project) return '00:00';
    const started = project.generationStartedAt 
      ? new Date(project.generationStartedAt).getTime() 
      : new Date(project.updatedAt || project.createdAt || project.timestamp).getTime();
    const diffSec = Math.max(0, Math.floor((this.now() - started) / 1000));
    return this.formatElapsed(diffSec);
  }

  formatDurationMs(ms?: number): string {
    if (!ms) return '';
    return `${(ms / 1000).toFixed(1)}s`;
  }
}

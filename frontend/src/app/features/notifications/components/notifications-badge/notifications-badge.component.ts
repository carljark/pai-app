import { Component, input, signal, computed, inject, effect, untracked } from '@angular/core';
import { NotificationsFacade } from '../../services/notifications.facade';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { RecentActivityModalComponent } from '../recent-activity-modal/recent-activity-modal.component';

@Component({
  selector: 'app-notifications-badge',
  standalone: true,
  imports: [CommonModule, RecentActivityModalComponent],
  template: `
    <div>
      <button 
        (click)="openNotifications()" 
        class="nav-item" [attr.data-tooltip]="trans.t().sidebarNotifications"
        [class.active]="activeCount() > 0 || unreadCount() > 0"
        style="width: 100%;">
        
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          @if(unreadCount() > 0 || activeCount() > 0) {
            <span style="position: absolute; top: -2px; right: -2px; background: #e74c3c; border-radius: 50%; width: 8px; height: 8px; border: 2px solid white;"></span>
          }
        </div>
        
        <span class="nav-text">{{ trans.t().sidebarNotifications }}</span>
        
        @if(unreadCount() > 0 || activeCount() > 0) {
          <span class="nav-text" style="background: #e74c3c; color: white; border-radius: 20px; padding: 2px 8px; font-size: 0.75rem; margin-left: auto;">
            @if (generatingProject(); as genProj) {
              ⏱️ {{ getElapsedTime(genProj) }}
            } @else {
              {{ unreadCount() + activeCount() }}
            }
          </span>
        }
      </button>

      <app-recent-activity-modal 
        [isOpen]="isOpen()" 
        [recentProjects]="recentProjects()" 
        [now]="now()" 
        (closeModal)="isOpen.set(false)">
      </app-recent-activity-modal>
    </div>
  `
})
export class NotificationsBadgeComponent {
  projects = input<any[]>([]);
  private notificationsFacade = inject(NotificationsFacade);
  trans = inject(TranslationService);
  
  isOpen = signal(false);
  now = signal(Date.now());

  unreadCount = computed(() => 
    this.notificationsFacade.notifications().filter(n => !n.read && n.type === 'COMPLETED').length
  );

  recentProjects = computed(() => {
    const notifs = this.notificationsFacade.notifications();
    if (notifs.length > 0) return notifs;
    const current = untracked(() => this.now());
    const oneDay = 24 * 60 * 60 * 1000;
    return this.projects().filter(p => {
      if (p.status === 'en_cola' || p.status === 'generando') return true;
      return (current - new Date(p.createdAt).getTime()) < oneDay;
    });
  });

  activeCount = computed(() => 
    this.recentProjects().filter(p => p.status === 'en_cola' || p.status === 'generando').length
  );

  generatingProject = computed(() => 
    this.recentProjects().find(p => p.status === 'generando')
  );

  constructor() {
    effect((onCleanup) => {
      const hasGenerating = this.recentProjects().some(p => p.status === 'generando');
      if (hasGenerating) {
        const timer = setInterval(() => this.now.set(Date.now()), 1000);
        onCleanup(() => clearInterval(timer));
      }
    });
  }

  openNotifications() {
    this.isOpen.set(true);
    this.notificationsFacade.markAllAsRead();
  }

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


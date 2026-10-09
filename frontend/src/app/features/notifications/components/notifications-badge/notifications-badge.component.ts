import { Component, input, signal, computed, inject, effect, untracked } from '@angular/core';
import { NotificationsFacade } from '../../services/notifications.facade';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { RecentActivityModalComponent } from '../recent-activity-modal/recent-activity-modal.component';
import { ActivityItem } from '../../models/notification.model';
import { activityStartTime } from '../../utils/activity-time';
import { Project } from '../../../projects/models/project.model';

@Component({
  selector: 'app-notifications-badge',
  standalone: true,
  imports: [CommonModule, RecentActivityModalComponent],
  templateUrl: './notifications-badge.component.html',
})
export class NotificationsBadgeComponent {
  projects = input<Project[]>([]);
  notificationsFacade = inject(NotificationsFacade);
  trans = inject(TranslationService);

  now = signal(Date.now());

  /** Proyectos completados e invitaciones a colaborar sin leer. */
  unreadCount = computed(
    () =>
      this.notificationsFacade
        .notifications()
        .filter((n) => !n.read && (n.type === 'COMPLETED' || n.type === 'INVITATION')).length,
  );

  recentProjects = computed<ActivityItem[]>(() => {
    const notifs = this.notificationsFacade.activity();
    if (notifs.length > 0) return notifs;
    const current = untracked(() => this.now());
    const oneDay = 24 * 60 * 60 * 1000;
    return this.projects().filter((p) => {
      if (p.status === 'en_cola' || p.status === 'generando') return true;
      return current - new Date(p.createdAt).getTime() < oneDay;
    });
  });

  activeCount = computed(
    () =>
      this.recentProjects().filter((p) => p.status === 'en_cola' || p.status === 'generando')
        .length,
  );

  generatingProject = computed(() => this.recentProjects().find((p) => p.status === 'generando'));

  constructor() {
    effect((onCleanup) => {
      const hasGenerating = this.recentProjects().some((p) => p.status === 'generando');
      if (hasGenerating) {
        const timer = setInterval(() => this.now.set(Date.now()), 1000);
        onCleanup(() => clearInterval(timer));
      }
    });
  }

  openNotifications() {
    this.notificationsFacade.openRecentActivity();
  }

  formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getElapsedTime(project: ActivityItem | null | undefined): string {
    if (!project) return '00:00';
    const started = activityStartTime(project);
    const diffSec = Math.max(0, Math.floor((this.now() - started) / 1000));
    return this.formatElapsed(diffSec);
  }

  formatDurationMs(ms?: number): string {
    if (!ms) return '';
    return `${(ms / 1000).toFixed(1)}s`;
  }
}

import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { ActivityItem } from '../../models/notification.model';
import { activityStartTime } from '../../utils/activity-time';

@Component({
  selector: 'app-recent-activity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity-modal.component.html',
})
export class RecentActivityModalComponent {
  trans = inject(TranslationService);
  isOpen = input<boolean>(false);
  recentProjects = input<ActivityItem[]>([]);
  now = input<number>(Date.now());
  closeModal = output<void>();

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

  isToday(dateVal: string | Date | null | undefined): boolean {
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return false;
    const nowDate = new Date(this.now());
    return (
      d.getFullYear() === nowDate.getFullYear() &&
      d.getMonth() === nowDate.getMonth() &&
      d.getDate() === nowDate.getDate()
    );
  }

  /** Email o nombre del autor; `userId` puede venir poblado (objeto) o como id. */
  ownerLabel(p: ActivityItem): string | undefined {
    const ownerEmail = typeof p.userId === 'object' ? p.userId.email : undefined;
    return p.userEmail || ownerEmail || p.userName;
  }

  getErrorMessage(p: ActivityItem | null | undefined): string | null {
    if (!p) return null;
    if (p.errorDetail) return p.errorDetail;
    if (p.error) return p.error;
    if (
      p.status === 'error' &&
      p.message &&
      p.message !== p.title &&
      p.message !== 'Proyecto Educativo'
    ) {
      return p.message;
    }
    return null;
  }
}

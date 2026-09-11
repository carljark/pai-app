import { Injectable, inject, signal, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { PaiService } from '../../../services/pai.service';
import { AppNotification, RawNotificationEvent } from '../models/notification.model';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade {
  private http = inject(HttpClient);
  private authService = inject(AuthFacade);
  private paiService = inject(PaiService);

  notifications = signal<AppNotification[]>([]);
  latestNotification = signal<AppNotification | null>(null);

  constructor() {
    let sseSub: any = null;

    effect(() => {
      const user = this.authService.currentUser();
      untracked(() => {
        if (user) {
          this.loadNotifications();
          if (!sseSub) {
            sseSub = this.paiService.listenToProjectUpdates().subscribe({
              next: (raw: RawNotificationEvent) => this.handleSseEvent(raw),
              error: (err) => console.error('SSE Error in facade', err)
            });
          }
        } else {
          if (sseSub) {
            sseSub.unsubscribe();
            sseSub = null;
          }
          this.notifications.set([]);
          this.latestNotification.set(null);
        }
      });
    });
  }

  loadNotifications() {
    const user = this.authService.currentUser();
    const userId = user?._id;
    this.http.get<any[]>('/api/notifications').subscribe({
      next: (items) => {
        const mapped = (items || []).map(i => NotificationMapper.fromDbEntity(i, userId));
        this.notifications.set(mapped);
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  private handleSseEvent(raw: RawNotificationEvent) {
    const user = this.authService.currentUser();
    const userId = user?._id;
    const mapped = NotificationMapper.fromRawEvent(raw, userId);
    this.latestNotification.set(mapped);

    this.notifications.update(list => this.mergeNotification(list, mapped));
  }

  private mergeNotification(list: AppNotification[], notif: AppNotification): AppNotification[] {
    if (notif.projectId) {
      const idx = list.findIndex(n => n.projectId === notif.projectId);
      if (idx >= 0) {
        const updated = [...list];
        const newTime = notif.updatedAt || notif.timestamp;
        updated[idx] = { ...list[idx], ...notif, id: list[idx].id, timestamp: newTime };
        return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }
    }
    return [notif, ...list];
  }


  markAsRead(id: string) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
    this.http.post('/api/notifications/read-all', {}).subscribe({
      error: (err) => console.error('Error marking notifications read in backend', err)
    });
  }
}


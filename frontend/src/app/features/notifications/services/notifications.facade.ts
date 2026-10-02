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
  recentActivityOpen = signal(false);

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

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.authService.currentUser()) {
          this.loadNotifications();
        }
      });
    }
  }

  loadNotifications() {
    const user = this.authService.currentUser();
    const userId = user?._id;
    const requestedAt = Date.now();
    this.http.get<any[]>('/api/notifications').subscribe({
      next: (items) => {
        const validItems = (items || []).filter(i =>
          Boolean(i.projectId || (i.status && ['en_cola', 'generando', 'borrador', 'publicado', 'error'].includes(i.status)))
        );
        const fetched = validItems.map(i => NotificationMapper.fromDbEntity(i, userId));
        this.notifications.update(current => this.reconcileNotifications(current, fetched, requestedAt));
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  /**
   * Fusiona la lista recibida de la base de datos con la que ya está en memoria,
   * sin descartar las notificaciones que hayan llegado por SSE mientras la
   * petición estaba en vuelo (evita que el proyecto recién creado desaparezca).
   */
  private reconcileNotifications(
    current: AppNotification[],
    fetched: AppNotification[],
    requestedAt: number
  ): AppNotification[] {
    const result = [...fetched];

    for (const existing of current) {
      const idx = existing.projectId
        ? result.findIndex(n => n.projectId === existing.projectId)
        : -1;
      const existingTime = (existing.updatedAt || existing.timestamp).getTime();

      if (idx === -1) {
        // No está en el snapshot: solo se conserva si apareció tras iniciar la petición.
        if (existingTime >= requestedAt) {
          result.push(existing);
        }
      } else {
        const fetchedTime = (result[idx].updatedAt || result[idx].timestamp).getTime();
        if (existingTime > fetchedTime) {
          result[idx] = { ...result[idx], ...existing, id: result[idx].id };
        }
      }
    }

    return result.sort(
      (a, b) => (b.updatedAt || b.timestamp).getTime() - (a.updatedAt || a.timestamp).getTime()
    );
  }

  private handleSseEvent(raw: RawNotificationEvent) {
    if (raw.type === 'CONNECTED') {
      // En cada (re)conexión resincronizamos con la base de datos para no perder
      // eventos terminales ocurridos durante una desconexión.
      this.loadNotifications();
      return;
    }
    if (!raw.projectId && !raw.notification?.projectId) {
      return;
    }

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

  openRecentActivity() {
    this.loadNotifications();
    this.recentActivityOpen.set(true);
    this.markAllAsRead();
  }

  closeRecentActivity() {
    this.recentActivityOpen.set(false);
  }

  clearLatestNotification() {
    this.latestNotification.set(null);
  }
}

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
  private sseRevision = 0;

  private static readonly POLL_INTERVAL_MS = 5000;

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

    // Respaldo de sondeo: mientras el modal está abierto refrescamos
    // periódicamente por si los eventos SSE de estado/fin se pierden.
    effect((onCleanup) => {
      if (!this.recentActivityOpen()) return;
      const timer: any = setInterval(() => this.loadNotifications(), NotificationsFacade.POLL_INTERVAL_MS);
      timer.unref?.();
      onCleanup(() => clearInterval(timer));
    });
  }

  loadNotifications() {
    const user = this.authService.currentUser();
    const userId = user?._id;
    const revision = this.sseRevision;
    this.http.get<any[]>('/api/notifications').subscribe({
      next: (items) => {
        const validItems = (items || []).filter(i =>
          Boolean(i.projectId || (i.status && ['en_cola', 'generando', 'borrador', 'publicado', 'error'].includes(i.status)))
        );
        const fetched = validItems.map(i => NotificationMapper.fromDbEntity(i, userId));
        if (this.sseRevision === revision) {
          this.notifications.set(fetched);
        } else {
          // Llegaron eventos SSE mientras la petición estaba en vuelo: fusionamos
          // para no descartar el proyecto recién creado.
          this.notifications.update(current => this.mergeFetched(current, fetched));
        }
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  /**
   * Fusiona el snapshot de la base de datos con lo que ya está en memoria,
   * conservando las notificaciones que no vienen en el snapshot (recibidas por
   * SSE durante la petición) y prefiriendo la entrada más reciente.
   */
  private mergeFetched(current: AppNotification[], fetched: AppNotification[]): AppNotification[] {
    const result = [...fetched];

    for (const existing of current) {
      const idx = existing.projectId
        ? result.findIndex(n => n.projectId === existing.projectId)
        : -1;

      if (idx === -1) {
        result.push(existing);
      } else {
        const existingTime = (existing.updatedAt || existing.timestamp).getTime();
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
    this.sseRevision++;

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

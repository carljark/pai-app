import { Injectable, inject, signal, effect, untracked } from '@angular/core';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { PaiService } from '../../../services/pai.service';
import { AppNotification, RawNotificationEvent } from '../models/notification.model';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade {
  private authService = inject(AuthFacade);
  private paiService = inject(PaiService);

  // Estado centralizado de notificaciones
  notifications = signal<AppNotification[]>([]);
  latestNotification = signal<AppNotification | null>(null);

  constructor() {
    let sseSub: any = null;

    effect(() => {
      const user = this.authService.currentUser();
      untracked(() => {
        if (user) {
          if (!sseSub) {
            sseSub = this.paiService.listenToProjectUpdates().subscribe({
              next: (raw: RawNotificationEvent) => {
                const mappedNotif = NotificationMapper.fromRawEvent(raw);
                
                this.latestNotification.set(mappedNotif);
                this.notifications.update(list => [mappedNotif, ...list]);

                // Mantener las alertas temporales hasta que haya un sistema UI de Toasts nativo
                // El alert se ha movido al app.ts para usar el modal bonificado
              },
              error: (err) => console.error('SSE Error in facade', err)
            });
          }
        } else {
          // Desconectar si el usuario cierra sesión
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

  markAsRead(id: string) {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }
}

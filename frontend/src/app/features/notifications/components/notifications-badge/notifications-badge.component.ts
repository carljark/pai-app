import { Component, input, signal, computed, inject, effect } from '@angular/core';
import { NotificationsFacade } from '../../services/notifications.facade';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-notifications-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Botón de Notificaciones -->
      <button 
        (click)="openNotifications()" 
        class="nav-item" [attr.data-tooltip]="trans.t().sidebarNotifications"
        [class.active]="activeCount() > 0 || unreadCount() > 0"
        style="width: 100%;">
        
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
          <!-- Bell Icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          
          <!-- Red Indicator Dot for unread/active -->
          @if(unreadCount() > 0 || activeCount() > 0) {
            <span style="position: absolute; top: -2px; right: -2px; background: #e74c3c; border-radius: 50%; width: 8px; height: 8px; border: 2px solid white;"></span>
          }
        </div>
        
        <span class="nav-text">{{ trans.t().sidebarNotifications }}</span>
        
        <!-- Optional text pill for desktop when there's an active process -->
        @if(unreadCount() > 0 || activeCount() > 0) {
          <span class="nav-text" style="background: #e74c3c; color: white; border-radius: 20px; padding: 2px 8px; font-size: 0.75rem; margin-left: auto;">
            {{ unreadCount() + activeCount() }}
          </span>
        }
      </button>

      <!-- Modal Centrado -->
      @if (isOpen()) {
        <!-- Backdrop (Fondo oscuro) -->
        <div 
          (click)="isOpen.set(false)" 
          style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; backdrop-filter: blur(2px);">
        </div>

        <!-- Ventana del Modal -->
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.25); z-index: 10000; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Cabecera del Modal -->
          <div style="padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #2c3e50; font-size: 1.1rem;">Actividad Reciente (24h)</strong>
            <button (click)="isOpen.set(false)" style="background: none; border: none; cursor: pointer; color: #7f8c8d; padding: 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='transparent'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Lista de Proyectos -->
          <div style="max-height: 60vh; overflow-y: auto; padding: 10px 0;">
            @if (recentProjects().length === 0) {
              <div style="padding: 30px 20px; text-align: center; color: #7f8c8d; font-size: 1rem;">
                No hay proyectos recientes en cola ni completados hoy.
              </div>
            }
            @for (p of recentProjects(); track p._id) {
              <div style="padding: 15px 20px; border-bottom: 1px solid #f1f2f6; display: flex; flex-direction: column; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <strong style="color: #2c3e50; font-size: 1rem; line-height: 1.3;">
                    {{ p.modules?.join(' + ') || 'Múltiples RA/CE' }}
                  </strong>
                  <span style="font-size: 0.85rem; color: #95a5a6; white-space: nowrap; margin-left: 15px;">
                    {{ p.createdAt | date:'shortTime' }}
                  </span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: bold;">
                  @if (p.status === 'en_cola') {
                    <span style="color: #f39c12; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                      En cola...
                    </span>
                  } @else if (p.status === 'generando') {
                    <span style="color: #3498db; animation: pulse 2s infinite; display: flex; align-items: center; gap: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.58 5.58"/></svg> 
                      Generando IA...
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
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class NotificationsBadgeComponent {
  projects = input.required<any[]>();
  private notificationsFacade = inject(NotificationsFacade);
  trans = inject(TranslationService);
  
  isOpen = signal(false);

  unreadCount = computed(() => 
    this.notificationsFacade.notifications().filter(n => !n.read && n.type === 'COMPLETED').length
  );

  activeCount = computed(() => 
    this.projects().filter(p => p.status === 'en_cola' || p.status === 'generando').length
  );

  openNotifications() {
    this.isOpen.set(true);
    this.notificationsFacade.markAllAsRead();
  }

  recentProjects = computed(() => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return this.projects().filter(p => {
      const isPending = p.status === 'en_cola' || p.status === 'generando';
      const isRecent = (now - new Date(p.createdAt).getTime()) < oneDay;
      return isPending || isRecent;
    });
  });
}

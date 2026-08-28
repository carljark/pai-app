import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';
import { TranslationService } from '../../../services/translation.service';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { ProjectsFacade } from '../../../features/projects/services/projects.facade';
import { NotificationsBadgeComponent } from '../../../features/notifications/components/notifications-badge/notifications-badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NotificationsBadgeComponent],
  template: `
    <aside class="app-sidebar" [class.collapsed]="layout.isSidebarCollapsed()">
      <div class="desktop-only" style="justify-content: flex-end; margin-bottom: 8px;">
        <button class="nav-item" [attr.data-tooltip]="layout.isSidebarCollapsed() ? trans.t().sidebarExpand : trans.t().sidebarCollapse" style="width: auto; padding: 8px; justify-content: center;" (click)="layout.toggleSidebar()">
          @if(layout.isSidebarCollapsed()) {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          } @else {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          }
        </button>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 8px;">
        <button (click)="layout.switchView('home')" [class.active]="layout.currentView() === 'home'" class="nav-item" [attr.data-tooltip]="trans.t().sidebarHome">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span class="nav-text">{{ trans.t().sidebarHome }}</span>
        </button>
        <button (click)="layout.switchView('generator')" [class.active]="layout.currentView() === 'generator'" class="nav-item" [attr.data-tooltip]="trans.t().sidebarNewProject">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          <span class="nav-text">{{ trans.t().sidebarNewProject }}</span>
        </button>
        <button (click)="projects.loadHistory(); layout.switchView('history')" [class.active]="layout.currentView() === 'history'" class="nav-item" [attr.data-tooltip]="trans.t().sidebarHistory">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="nav-text">{{ trans.t().sidebarHistory }}</span>
        </button>
        <button (click)="layout.switchView('taller')" [class.active]="layout.currentView() === 'taller'" class="nav-item" [attr.data-tooltip]="trans.t().sidebarTaller">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <span class="nav-text">{{ trans.t().sidebarTaller }}</span>
        </button>
        @if (auth.currentUser()?.role === 'admin') {
          <button (click)="layout.switchView('admin')" [class.active]="layout.currentView() === 'admin'" class="nav-item" [attr.data-tooltip]="trans.t().sidebarAdmin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span class="nav-text">{{ trans.t().sidebarAdmin }}</span>
          </button>
        }
        
        <div style="height: 1px; background: #e5e7eb; margin: 12px 0;"></div>
        
        <app-notifications-badge [projects]="projects.projectsHistory()"></app-notifications-badge>
        
        <button class="nav-item" [attr.data-tooltip]="trans.t().sidebarLangTooltip" (click)="toggleLanguage()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="nav-text">{{ trans.t().sidebarLangLabel }}: {{ layout.language() === 'castellano' ? 'ES' : 'CA' }}</span>
        </button>
        
        <button class="nav-item" [attr.data-tooltip]="trans.t().sidebarLogoutTooltip" (click)="layout.logout()" style="color: #ef4444;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span class="nav-text">{{ trans.t().logout }}</span>
        </button>
      </nav>
      
      <div style="flex-grow: 1;"></div>
      <div class="sidebar-username" style="text-align: center; color: #9ca3af; font-size: 0.75rem;">
        {{ auth.currentUser()?.name }}
      </div>
    </aside>
  `
})
export class SidebarComponent {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  auth = inject(AuthFacade);
  projects = inject(ProjectsFacade);

  toggleLanguage() {
    this.layout.language.set(this.layout.language() === 'castellano' ? 'catalan' : 'castellano');
  }
}

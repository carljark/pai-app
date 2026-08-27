import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from './features/auth/services/auth.facade';
import { AuthFormComponent } from './features/auth/components/auth-form/auth-form.component';
import { ErrorModalComponent } from './components/error-modal.component';
import { InfoModalComponent } from './components/info-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal.component';
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard/admin-dashboard.component';
import { HomeDashboardComponent } from './features/home/components/home-dashboard/home-dashboard.component';

import { AppFacade } from './app.facade';
import { LayoutService } from './services/layout.service';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { GeneratorViewComponent } from './features/generator/components/generator-view/generator-view.component';
import { HistoryViewComponent } from './features/history/components/history-view/history-view.component';
import { TallerViewComponent } from './features/taller/components/taller-view/taller-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ErrorModalComponent, 
    InfoModalComponent, 
    ConfirmModalComponent, 
    AdminDashboardComponent, 
    HomeDashboardComponent, 
    AuthFormComponent, 
    SidebarComponent,
    GeneratorViewComponent,
    HistoryViewComponent,
    TallerViewComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthFacade);
  appFacade = inject(AppFacade);
  layout = inject(LayoutService);

  @HostListener('window:resize')
  onResize() {
    this.layout.isMobile.set(window.innerWidth <= 768);
  }

  getTestValue() { return 'test'; }
  getT2() { return 2; }
  getT3() { return 3; }
  getT4() { return 4; }
  setTestValue(val: string) { return val; }

  constructor() {
    try { history.scrollRestoration = 'manual'; } catch(e) {}
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }
}

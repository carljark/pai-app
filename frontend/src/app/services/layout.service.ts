import { Injectable, signal, effect, inject } from '@angular/core';
import { AuthFacade } from '../features/auth/services/auth.facade';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  authService = inject(AuthFacade);
  
  currentView = signal<'home' | 'generator' | 'history' | 'taller' | 'admin'>('home');
  isMobile = signal<boolean>(window.innerWidth <= 768);
  isSidebarCollapsed = signal<boolean>(false);
  language = signal<'castellano' | 'catalan'>('castellano');

  constructor() {
    const savedView = localStorage.getItem('pai_view') as any;
    if (savedView) this.currentView.set(savedView);
    
    effect(() => {
      localStorage.setItem('pai_view', this.currentView());
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  switchView(view: 'home' | 'generator' | 'taller' | 'history' | 'admin') {
    this.currentView.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}

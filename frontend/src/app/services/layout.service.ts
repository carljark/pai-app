import { Injectable, signal, effect, inject } from '@angular/core';
import { AuthFacade } from '../features/auth/services/auth.facade';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  authService = inject(AuthFacade);
  
  currentView = signal<'home' | 'generator' | 'history' | 'taller' | 'admin' | 'mapa'>('home');
  isMobile = signal<boolean>(window.innerWidth <= 768);
  isSidebarCollapsed = signal<boolean>(false);
  language = signal<'castellano' | 'catalan'>('castellano');

  constructor() {
    const savedView = localStorage.getItem('pai_view') as any;
    if (savedView) this.currentView.set(savedView);
    
    const savedLang = localStorage.getItem('pai_lang') as any;
    if (savedLang === 'catalan' || savedLang === 'castellano') {
      this.language.set(savedLang);
    }
    
    effect(() => {
      localStorage.setItem('pai_view', this.currentView());
      localStorage.setItem('pai_lang', this.language());
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  switchView(view: 'home' | 'generator' | 'taller' | 'history' | 'admin' | 'mapa') {
    this.currentView.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}

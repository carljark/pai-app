import { Injectable, signal, effect, inject } from '@angular/core';
import { AuthFacade } from '../features/auth/services/auth.facade';

export type AppView =
  'home' | 'generator' | 'history' | 'taller' | 'admin' | 'mapa' | 'personal' | 'feedback';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  authService = inject(AuthFacade);

  currentView = signal<AppView>('home');
  isMobile = signal<boolean>(window.innerWidth <= 768);
  isSidebarCollapsed = signal<boolean>(false);
  language = signal<'castellano' | 'catalan'>('castellano');

  constructor() {
    // Se confía en el valor persistido por el propio servicio
    const savedView = localStorage.getItem('pai_view') as AppView | null;
    if (savedView) {
      this.currentView.set(savedView);
      this.isSidebarCollapsed.set(savedView !== 'home');
    }

    const savedLang = localStorage.getItem('pai_lang');
    if (savedLang === 'catalan' || savedLang === 'castellano') {
      this.language.set(savedLang);
    }

    effect(() => {
      localStorage.setItem('pai_view', this.currentView());
      localStorage.setItem('pai_lang', this.language());
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update((v) => !v);
  }

  switchView(
    view: 'home' | 'generator' | 'taller' | 'history' | 'admin' | 'mapa' | 'personal' | 'feedback',
  ) {
    this.currentView.set(view);
    this.isSidebarCollapsed.set(view !== 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}

import { Injectable, signal, effect, inject } from '@angular/core';
import { AuthFacade } from '../features/auth/services/auth.facade';
import { AppView, buildViewUrl, parseViewRoute } from './view-route';

export type { AppView } from './view-route';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  authService = inject(AuthFacade);

  currentView = signal<AppView>('home');
  isMobile = signal<boolean>(window.innerWidth <= 768);
  isSidebarCollapsed = signal<boolean>(false);
  language = signal<'castellano' | 'catalan'>('castellano');
  /** Proyecto que piden la URL inicial o el historial (atrás/adelante); lo abre `AppFacade`. */
  requestedProject = signal<string | null>(null);

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

    this.initBrowserHistory();
  }

  /**
   * La URL manda sobre la última vista guardada (enlaces y recargas). La entrada actual del
   * historial se normaliza y se escuchan los botones atrás/adelante del navegador.
   */
  private initBrowserHistory(): void {
    const route = parseViewRoute(window.location.search);
    if (route) {
      this.applyView(route.view, false);
      this.requestedProject.set(route.project ?? null);
    }
    const current = route ?? { view: this.currentView() };
    window.history.replaceState(null, '', buildViewUrl(current, window.location.pathname));
    window.addEventListener('popstate', () => this.onPopState());
  }

  /** Atrás/adelante: se muestra la pantalla de esa entrada sin añadir otra al historial. */
  private onPopState(): void {
    const route = parseViewRoute(window.location.search) ?? { view: 'home' };
    this.applyView(route.view);
    this.requestedProject.set(route.project ?? null);
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update((v) => !v);
  }

  /** Cambia de pantalla y añade una entrada al historial (en el taller, con el proyecto). */
  switchView(view: AppView, project?: string) {
    this.applyView(view);
    const url = buildViewUrl(project ? { view, project } : { view }, window.location.pathname);
    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState(null, '', url);
    }
  }

  private applyView(view: AppView, scroll = true): void {
    this.currentView.set(view);
    this.isSidebarCollapsed.set(view !== 'home');
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
  }
}

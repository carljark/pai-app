import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { AuthFacade } from '../../auth/services/auth.facade';
import { OnboardingService, OnboardingState, OnboardingUpdate } from './onboarding.service';
import { TourId } from '../tours/tour.model';

/** Clave de «Más tarde»: la bienvenida no vuelve a salir hasta la próxima sesión del navegador. */
export const WELCOME_LATER_KEY = 'plappin.welcomeLater';

const sessionStore = (): Storage | null => {
  try {
    return sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Estado de la bienvenida, del panel de Ayuda y de las visitas completadas. Se carga al haber
 * un usuario aprobado; los usuarios pendientes de aprobación no ven la bienvenida.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingFacade {
  private service = inject(OnboardingService);
  private auth = inject(AuthFacade);

  private state = signal<OnboardingState | null>(null);
  completedTours = computed<TourId[]>(() => this.state()?.completedTours ?? []);
  welcomeVisible = signal(false);
  helpOpen = signal(false);

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      untracked(() => (user && user.role !== 'pending' ? this.load() : this.reset()));
    });
  }

  load(): void {
    this.service.get().subscribe({
      next: (state) => {
        this.state.set(state);
        this.welcomeVisible.set(!state.welcomeDismissed && !this.postponed());
      },
      error: () => this.welcomeVisible.set(false),
    });
  }

  /** «Más tarde»: se cierra en esta sesión sin guardar nada en el servidor. */
  later(): void {
    this.welcomeVisible.set(false);
    sessionStore()?.setItem(WELCOME_LATER_KEY, '1');
  }

  /** «No volver a mostrar» o «Empezar la visita»: no vuelve a salir en ningún dispositivo. */
  dismissWelcome(): void {
    this.welcomeVisible.set(false);
    this.save({ welcomeDismissed: true });
  }

  markCompleted(tour: TourId): void {
    if (this.completedTours().includes(tour)) return;
    this.state.update((s) => ({
      welcomeDismissed: s?.welcomeDismissed ?? false,
      completedTours: [...(s?.completedTours ?? []), tour],
    }));
    this.save({ completedTour: tour });
  }

  private save(changes: OnboardingUpdate): void {
    this.service.update(changes).subscribe({
      next: (state) => this.state.set(state),
      error: () => undefined,
    });
  }

  private postponed(): boolean {
    return sessionStore()?.getItem(WELCOME_LATER_KEY) === '1';
  }

  private reset(): void {
    this.state.set(null);
    this.welcomeVisible.set(false);
    this.helpOpen.set(false);
  }
}

import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { HelpTextsService } from '../../services/help-texts.service';
import { OnboardingFacade } from '../../services/onboarding.facade';
import { TourService } from '../../services/tour.service';

type Language = 'castellano' | 'catalan';

/**
 * Bienvenida a quien aún no la ha cerrado: elige el idioma de la interfaz y empieza la visita
 * «Conoce Plappin», la pospone a la próxima sesión o la descarta para siempre.
 */
@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  templateUrl: './welcome-modal.component.html',
  styleUrl: './welcome-modal.component.scss',
})
export class WelcomeModalComponent {
  onboarding = inject(OnboardingFacade);
  layout = inject(LayoutService);
  t = inject(HelpTextsService).t;
  private tours = inject(TourService);
  private injector = inject(Injector);
  private startButton = viewChild<ElementRef<HTMLButtonElement>>('startButton');

  readonly languages: { value: Language; label: string }[] = [
    { value: 'castellano', label: 'Castellano' },
    { value: 'catalan', label: 'Català' },
  ];

  constructor() {
    // Al abrirse, el foco va al botón principal (teclado y lectores de pantalla)
    effect(() => {
      if (!this.onboarding.welcomeVisible()) return;
      untracked(() =>
        afterNextRender(() => this.startButton()?.nativeElement.focus(), {
          injector: this.injector,
        }),
      );
    });
  }

  setLanguage(language: Language): void {
    this.layout.language.set(language);
  }

  start(): void {
    this.onboarding.dismissWelcome();
    void this.tours.start('intro');
  }

  later(): void {
    this.onboarding.later();
  }

  never(): void {
    this.onboarding.dismissWelcome();
  }
}

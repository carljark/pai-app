import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { HelpTextsService } from '../../services/help-texts.service';
import { OnboardingFacade } from '../../services/onboarding.facade';
import { TourService } from '../../services/tour.service';
import { TOUR_IDS, TourId } from '../../tours/tour.model';

interface TourItem {
  id: TourId;
  title: string;
  description: string;
  completed: boolean;
}

/** Panel lateral de Ayuda: visitas guiadas (con las hechas marcadas), preguntas frecuentes y contacto. */
@Component({
  selector: 'app-help-panel',
  standalone: true,
  templateUrl: './help-panel.component.html',
  styleUrl: './help-panel.component.scss',
})
export class HelpPanelComponent {
  onboarding = inject(OnboardingFacade);
  t = inject(HelpTextsService).t;
  private tours = inject(TourService);
  private layout = inject(LayoutService);
  private injector = inject(Injector);
  private closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  items = computed<TourItem[]>(() => {
    const texts = this.t().tours;
    const done = this.onboarding.completedTours();
    return TOUR_IDS.map((id) => ({
      id,
      title: texts[id].title,
      description: texts[id].description,
      completed: done.includes(id),
    }));
  });

  constructor() {
    // Al abrirse, el foco entra en el panel (Esc lo cierra)
    effect(() => {
      if (!this.onboarding.helpOpen()) return;
      untracked(() =>
        afterNextRender(() => this.closeButton()?.nativeElement.focus(), {
          injector: this.injector,
        }),
      );
    });
  }

  close(): void {
    this.onboarding.helpOpen.set(false);
  }

  startTour(id: TourId): void {
    void this.tours.start(id);
  }

  contact(): void {
    this.close();
    this.layout.switchView('feedback');
  }
}

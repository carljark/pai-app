import { Injectable, InjectionToken, Injector, afterNextRender, inject } from '@angular/core';
import { driver, type Config, type DriveStep, type Driver } from 'driver.js';
import { LayoutService } from '../../../services/layout.service';
import { TelemetryService } from '../../../services/telemetry.service';
import { TOURS } from '../tours/tours';
import { TourDefinition, TourId } from '../tours/tour.model';
import { HelpTextsService } from './help-texts.service';
import { OnboardingFacade } from './onboarding.facade';
import { ExampleProjectService } from './example-project.service';

/** Crea el motor de la visita; los tests lo sustituyen por un doble. */
export const TOUR_DRIVER = new InjectionToken<(config: Config) => Driver>('TOUR_DRIVER', {
  providedIn: 'root',
  factory: () => driver,
});

/** Espera máxima a que aparezca el primer elemento de la visita (datos que llegan por HTTP). */
const ANCHOR_TIMEOUT_MS = 2000;
const ANCHOR_POLL_MS = 100;

export const anchorSelector = (anchor: string) => `[data-tour="${anchor}"]`;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Visitas guiadas con driver.js: lleva a la pantalla de la visita, espera a que esté pintada,
 * resalta los pasos cuyo elemento existe y guarda la visita como completada al terminarla.
 * Ver documentation/visita_guiada.md.
 */
@Injectable({ providedIn: 'root' })
export class TourService {
  private createDriver = inject(TOUR_DRIVER);
  private injector = inject(Injector);
  private layout = inject(LayoutService);
  private telemetry = inject(TelemetryService);
  private help = inject(HelpTextsService);
  private onboarding = inject(OnboardingFacade);
  private example = inject(ExampleProjectService);
  private active: Driver | null = null;

  async start(id: TourId): Promise<void> {
    const tour = TOURS[id];
    this.active?.destroy();
    this.onboarding.helpOpen.set(false);
    if (!(await this.goToView(tour))) return;
    await this.waitForAnchors(tour);
    const steps = this.buildSteps(tour);
    if (steps.length > 0) this.run(tour, steps);
  }

  private async goToView(tour: TourDefinition): Promise<boolean> {
    if (tour.example) return this.example.open();
    if (this.layout.currentView() !== tour.view) this.layout.switchView(tour.view);
    if (tour.sidebar) this.layout.isSidebarCollapsed.set(false);
    return true;
  }

  /** Tras el render, espera (como mucho 2 s) a que exista algún elemento de la visita. */
  private async waitForAnchors(tour: TourDefinition): Promise<void> {
    await new Promise<void>((resolve) =>
      afterNextRender(() => resolve(), { injector: this.injector }),
    );
    const anchors = tour.steps.map((s) => s.anchor).filter((a): a is string => a !== null);
    for (let waited = 0; waited < ANCHOR_TIMEOUT_MS; waited += ANCHOR_POLL_MS) {
      if (anchors.some((a) => document.querySelector(anchorSelector(a)))) return;
      await wait(ANCHOR_POLL_MS);
    }
  }

  /** Pasos con sus textos; se omiten los que señalan un elemento que no está en pantalla. */
  buildSteps(tour: TourDefinition): DriveStep[] {
    const texts = this.help.t().tours[tour.id].steps;
    return tour.steps.flatMap((step, i): DriveStep[] => {
      const text = texts[i];
      const element = step.anchor ? document.querySelector(anchorSelector(step.anchor)) : null;
      if (!text || (step.anchor && !element)) return [];
      const popover = { title: text.title, description: text.text, side: step.side };
      return [element ? { element, popover } : { popover }];
    });
  }

  private run(tour: TourDefinition, steps: DriveStep[]): void {
    const nav = this.help.t().nav;
    const instance = this.createDriver({
      steps,
      showProgress: steps.length > 1,
      progressText: nav.progress,
      nextBtnText: nav.next,
      prevBtnText: nav.prev,
      doneBtnText: nav.done,
      popoverClass: 'plappin-tour',
      smoothScroll: true,
      onDestroyStarted: (_el, _step, { driver: d }) => this.finish(tour.id, d),
    });
    this.active = instance;
    this.log('TOUR_STARTED', { tour: tour.id });
    instance.drive();
  }

  /** Terminar en el último paso cuenta como completada; cerrar antes, como abandonada. */
  private finish(id: TourId, instance: Driver): void {
    const step = (instance.getActiveIndex() ?? 0) + 1;
    if (instance.isLastStep()) {
      this.onboarding.markCompleted(id);
      this.log('TOUR_COMPLETED', { tour: id });
    } else {
      this.log('TOUR_ABANDONED', { tour: id, step });
    }
    this.active = null;
    instance.destroy();
  }

  private log(action: string, details: Record<string, unknown>): void {
    this.telemetry.logEvent(action, undefined, details).subscribe({ error: () => undefined });
  }
}

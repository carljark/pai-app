import type { AppView } from '../../../services/view-route';

/** Visitas guiadas; el backend solo guarda estos ids (`backend/src/data/tours.ts`). */
export type TourId = 'intro' | 'generator' | 'taller' | 'mapa';

export const TOUR_IDS: readonly TourId[] = ['intro', 'generator', 'taller', 'mapa'];

export type TourSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Paso de una visita: el elemento con `data-tour="<anchor>"` que se resalta, o `null` para un
 * mensaje centrado sin elemento. Los textos están en `help.es.ts`/`help.ca.ts`, en el mismo orden.
 */
export interface TourStep {
  anchor: string | null;
  side?: TourSide;
}

export interface TourDefinition {
  id: TourId;
  /** Pantalla en la que transcurre la visita. */
  view: AppView;
  /** Despliega la barra lateral antes de empezar (visita del menú). */
  sidebar?: boolean;
  /** Abre el proyecto de ejemplo en el taller antes de empezar. */
  example?: boolean;
  steps: readonly TourStep[];
}

export interface TourStepText {
  title: string;
  text: string;
}

export interface TourTexts {
  title: string;
  description: string;
  steps: readonly TourStepText[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Textos de la bienvenida, el panel de Ayuda y las visitas en un idioma. */
export interface HelpTexts {
  welcome: {
    title: string;
    intro: string;
    languageLabel: string;
    start: string;
    later: string;
    never: string;
  };
  panel: {
    title: string;
    close: string;
    toursTitle: string;
    startTour: string;
    completed: string;
    faqTitle: string;
    contactTitle: string;
    contactText: string;
    contactButton: string;
  };
  sidebarLabel: string;
  helpButtonLabel: string;
  nav: { next: string; prev: string; done: string; progress: string };
  example: { banner: string; copy: string; loadError: string };
  tours: Record<TourId, TourTexts>;
  faq: readonly FaqEntry[];
}

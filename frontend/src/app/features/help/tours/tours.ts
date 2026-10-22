import { TourDefinition, TourId } from './tour.model';

/** Menú lateral: qué hay en cada opción. */
const INTRO: TourDefinition = {
  id: 'intro',
  view: 'home',
  sidebar: true,
  steps: [
    { anchor: 'sidebar-generator', side: 'right' },
    { anchor: 'sidebar-personal', side: 'right' },
    { anchor: 'sidebar-history', side: 'right' },
    { anchor: 'sidebar-taller', side: 'right' },
    { anchor: 'sidebar-mapa', side: 'right' },
    { anchor: 'sidebar-solicitudes', side: 'right' },
    { anchor: 'sidebar-help', side: 'right' },
  ],
};

/** Generador: de la titulación al botón Generar, sin generar nada. */
const GENERATOR: TourDefinition = {
  id: 'generator',
  view: 'generator',
  steps: [
    { anchor: 'generator-level', side: 'bottom' },
    { anchor: 'generator-methodology', side: 'bottom' },
    { anchor: 'generator-collaborators', side: 'bottom' },
    { anchor: 'generator-extra', side: 'top' },
    { anchor: 'generator-curriculum', side: 'right' },
    { anchor: 'generator-cart', side: 'left' },
  ],
};

/** Taller, sobre el proyecto de ejemplo. */
const TALLER: TourDefinition = {
  id: 'taller',
  view: 'taller',
  example: true,
  steps: [
    { anchor: 'taller-example', side: 'bottom' },
    { anchor: 'taller-content', side: 'right' },
    { anchor: 'taller-actions', side: 'bottom' },
    { anchor: 'taller-resources', side: 'left' },
    { anchor: null },
  ],
};

/** Mapa intermodular (en la ESO, el de afinidades solo tiene los dos primeros pasos). */
const MAPA: TourDefinition = {
  id: 'mapa',
  view: 'mapa',
  steps: [
    { anchor: 'mapa-tabs', side: 'bottom' },
    { anchor: 'mapa-vista', side: 'bottom' },
    { anchor: 'mapa-modulos', side: 'top' },
    { anchor: 'mapa-ra', side: 'top' },
    { anchor: 'mapa-conexiones', side: 'top' },
  ],
};

export const TOURS: Record<TourId, TourDefinition> = {
  intro: INTRO,
  generator: GENERATOR,
  taller: TALLER,
  mapa: MAPA,
};

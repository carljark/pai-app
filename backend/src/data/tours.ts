/** Visitas guiadas del frontend (`features/help/tours`); el progreso solo admite estos ids. */
export const TOUR_IDS = ['intro', 'generator', 'taller', 'mapa'] as const;
export type TourId = (typeof TOUR_IDS)[number];

export const isTourId = (value: unknown): value is TourId => TOUR_IDS.includes(value as TourId);

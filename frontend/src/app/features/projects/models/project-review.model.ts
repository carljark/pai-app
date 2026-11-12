/** Revisión con IA del proyecto (ver documentation/revision_automatica_proyectos.md). */
export type ReviewStatus = 'revisando' | 'completada' | 'error';

/** Igual que en el backend: una revisión en curso más antigua se considera abandonada. */
export const REVIEW_LOCK_MS = 15 * 60 * 1000;

/** Aspectos que valora la revisión, en el orden en que se muestran (mismos ids que el backend). */
export const REVIEW_DIMENSIONS = [
  'curricularAlignment',
  'coherence',
  'drivingQuestion',
  'activities',
  'assessment',
  'integration',
  'inclusion',
  'timing',
  'clarity',
] as const;
export type ReviewDimensionId = (typeof REVIEW_DIMENSIONS)[number];

export interface ProjectReviewDimension {
  id: ReviewDimensionId;
  score: number;
  justification: string;
  suggestions: string[];
  section?: string;
}

export interface ProjectReview {
  status?: ReviewStatus;
  startedAt?: string | Date;
  finishedAt?: string | Date;
  /** `contentVersion` del proyecto que se revisó. */
  contentVersion?: number;
  language?: string;
  usedModel?: string;
  overall?: number;
  summary?: string;
  dimensions?: ProjectReviewDimension[];
  /** Sugerencias ya aplicadas, como `aspecto:índice` (ver `suggestionKey`). */
  applied?: string[];
  error?: string;
}

/** Respuesta al aplicar sugerencias: el documento nuevo (sin guardar) y las sugerencias marcadas. */
export interface ApplySuggestionResponse {
  newText: string;
  section: string | null;
  applied: string[];
}

/** Clave de una sugerencia (igual que en el backend); sin índice, todas las de un aspecto. */
export const suggestionKey = (dimension: string, index?: number): string =>
  `${dimension}:${index ?? '*'}`;

export function isSuggestionApplied(
  review: ProjectReview | null | undefined,
  dimension: string,
  index: number,
): boolean {
  return Boolean(review?.applied?.includes(suggestionKey(dimension, index)));
}

/** `true` si la revisión está en curso y su bloqueo no ha caducado. */
export function isReviewInProgress(review?: ProjectReview | null): boolean {
  if (review?.status !== 'revisando' || !review.startedAt) return false;
  return Date.now() - new Date(review.startedAt).getTime() < REVIEW_LOCK_MS;
}

/** `true` si hay resultados y el proyecto ha cambiado desde que se revisó. */
export function isReviewStale(
  review: ProjectReview | null | undefined,
  contentVersion?: number,
): boolean {
  if (!review?.dimensions?.length) return false;
  return (review.contentVersion ?? 0) !== (contentVersion ?? 0);
}

import { ActivityItem } from '../models/notification.model';

/**
 * Instante (ms) desde el que se cuenta el tiempo de generación de un elemento de actividad.
 * Devuelve `NaN` si el elemento no trae ninguna fecha, igual que `new Date(undefined)`.
 */
export function activityStartTime(item: ActivityItem): number {
  const reference = item.generationStartedAt || item.updatedAt || item.createdAt || item.timestamp;
  return reference ? new Date(reference).getTime() : NaN;
}

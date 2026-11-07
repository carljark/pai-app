import { up as ingestAfinidades } from './25_ingest_afinidades_eso';

/**
 * Vuelve a cargar las fichas de afinidades de la ESO desde los JSON (tarea 253): fichas nuevas de 4.º,
 * hasta al menos 6 por materia, y actividades conjuntas en todas las de ese curso. Reutiliza la
 * ingesta de la 25, que solo sustituye la colección `afinidadesos`, así que es seguro reejecutarla.
 */
export const up = ingestAfinidades;

import { up as ingestAfinidades } from './25_ingest_afinidades_eso';

/**
 * Vuelve a cargar las fichas de afinidades de la ESO desde los JSON (tarea 247): 22 fichas
 * nuevas de 1.º y actividades conjuntas en todas las de 1.º. Reutiliza la ingesta de la 25, que
 * solo sustituye la colección `afinidadesos`, así que es seguro reejecutarla.
 */
export const up = ingestAfinidades;

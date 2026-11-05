/** Criterios (ESO, «1.1») o RA (FP, «RA1») por materia o módulo. */
export type ClavesPorUnidad = Record<string, string[]>;

/**
 * Contenido de la cesta de una pestaña del mapa. Las «unidades» son materias (ESO) o módulos
 * (FP); las «claves», criterios de evaluación (ESO) o resultados de aprendizaje (FP).
 */
export interface CestaEstado {
  /** Unidades metidas arrastrando: aportan lo que tienen en común con el resto de la cesta. */
  unidades: string[];
  /** Claves añadidas con el botón «Añadir a la cesta» de una ficha, conexión o RA. */
  extras: ClavesPorUnidad;
  /** Claves que el docente ha quitado a mano. */
  excluidas: ClavesPorUnidad;
}

export const CESTA_VACIA: CestaEstado = { unidades: [], extras: {}, excluidas: {} };

/** Materia o módulo de la cesta con las claves que aporta al proyecto. */
export interface GrupoCesta {
  unidad: string;
  claves: string[];
  /** Entró arrastrando la bola del mapa mental (y no solo por una ficha o conexión). */
  arrastrada: boolean;
}

import type { IntermodularConnection } from '../models/mapa-intermodular.model';

/**
 * Clave de un criterio a partir de su texto: la letra («a) Se ha…», «3060-1a. Se ha…» → «a») o,
 * en las competencias específicas de los ámbitos de FP Básica, su número («1.1 Explicar…» → «1.1»).
 */
export function criterioClave(texto: string): string {
  const t = texto.toLowerCase().trim();
  const numero = t.match(/^(\d+\.\d+)\s/);
  if (numero) return numero[1]!;
  const letra = t.match(/^[a-z0-9\-\s.]*?([a-z])[).\s]/) || t.match(/([a-z])/);
  return letra ? letra[1]! : t;
}

/** La conexión parte del criterio indicado por su texto (por clave o por su código de origen). */
export function conexionDeCriterio(c: IntermodularConnection, texto: string): boolean {
  const target = texto.toLowerCase().trim();
  const clave = criterioClave(texto);
  if (c.criteriaKeys && (c.criteriaKeys.includes(target) || c.criteriaKeys.includes(clave)))
    return true;
  return !!c.sourceCriteria && c.sourceCriteria.toLowerCase().includes(clave);
}

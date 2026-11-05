import type { AfinidadEso } from '../models/afinidad-eso.model';
import type { ClavesPorUnidad } from '../models/cesta.model';
import { criteriosDeMateria } from './afinidad-seleccion';
import { unirClaves } from './cesta';

/** Criterios que cita la ficha de cada materia (de todas o solo de las indicadas). */
export function criteriosDeFicha(
  ficha: AfinidadEso,
  materias: string[] = ficha.materias,
): ClavesPorUnidad {
  const porMateria: ClavesPorUnidad = {};
  for (const m of materias) porMateria[m] = criteriosDeMateria(ficha, m);
  return porMateria;
}

/**
 * Criterios en común entre las materias de la cesta: los de cada ficha que une al menos dos de
 * ellas, tomando solo los de las materias que están en la cesta. Solo cuentan las fichas en las
 * que participa alguna materia arrastrada; las añadidas con botón aportan solo su ficha.
 */
export function comunesEso(
  fichas: AfinidadEso[],
  enCesta: string[],
  arrastradas: string[],
): ClavesPorUnidad {
  const comunes: ClavesPorUnidad = {};
  for (const ficha of fichas) {
    const dentro = ficha.materias.filter((m) => enCesta.includes(m));
    if (dentro.length < 2 || !dentro.some((m) => arrastradas.includes(m))) continue;
    unirClaves(comunes, criteriosDeFicha(ficha, dentro));
  }
  return comunes;
}

import { AfinidadEso } from '../models/afinidad-eso.model';
import { CriterioItem, EvaluativeCriteria } from '../../curriculum/models/curriculum.model';

/** CE del generador que se selecciona desde una ficha, con los criterios que cita la ficha. */
export interface SeleccionCe {
  key: string;
  ids: string[];
  todos: CriterioItem[];
}

/** Materias de la ficha con la consultada en primer lugar (el orden del proyecto). */
export function materiasEnOrden(afinidad: AfinidadEso, principal: string): string[] {
  const resto = afinidad.materias.filter((m) => m !== principal);
  return afinidad.materias.includes(principal) ? [principal, ...resto] : resto;
}

/** Criterios citados de una materia en todos los vínculos de la ficha, sin repetir. */
function criteriosDeMateria(afinidad: AfinidadEso, materia: string): string[] {
  const ids = afinidad.vinculos.flatMap((v) => v.criterios[materia] ?? []);
  return [...new Set(ids)];
}

/** Agrupa los criterios por la CE a la que pertenecen («2.1» → CE2). */
function porCe(ids: string[]): Map<number, string[]> {
  const grupos = new Map<number, string[]>();
  for (const id of ids) {
    const num = Number(id.split('.')[0]);
    grupos.set(num, [...(grupos.get(num) ?? []), id]);
  }
  return grupos;
}

/**
 * Traduce los criterios de una ficha de afinidad a la selección del generador de la ESO:
 * una entrada por CE con los criterios citados que existen en el curso. Se omiten las CE
 * que no están en el currículo cargado.
 */
export function seleccionDeAfinidad(
  afinidad: AfinidadEso,
  principal: string,
  ces: EvaluativeCriteria[],
): SeleccionCe[] {
  const seleccion: SeleccionCe[] = [];
  for (const materia of materiasEnOrden(afinidad, principal)) {
    for (const [num, ids] of porCe(criteriosDeMateria(afinidad, materia))) {
      const ce = ces.find((c) => c.subjectCode === materia && c.ce_num === num);
      const todos = ce?.criteriosDetalle ?? [];
      const validos = ids.filter((id) => todos.some((c) => c.id === id));
      if (ce?.value && validos.length > 0) seleccion.push({ key: ce.value, ids: validos, todos });
    }
  }
  return seleccion;
}

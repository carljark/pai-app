import { EvaluativeCriteria } from '../models/curriculum.model';
import { GroupedCurriculumItem } from './curriculum-grouping';

/** Etiqueta del tipo de materia; las comunes no se marcan. */
const TIPO_LABELS: Record<string, { es: string; ca: string }> = {
  opcion: { es: 'De opción', ca: "D'opció" },
  optativa: { es: 'Optativa', ca: 'Optativa' },
};

function esoCategory(ce: EvaluativeCriteria, isCa: boolean): string {
  const subject = ce.subject || '';
  const label = TIPO_LABELS[ce.tipo || ''];
  return label ? `${subject} · ${isCa ? label.ca : label.es}` : subject;
}

/**
 * Agrupa las CE de la ESO por materia, en el orden de la API (comunes, de opción y optativas).
 * Cada CE se numera con su número oficial y se selecciona por su valor único.
 */
export function groupEsoCes(list: EvaluativeCriteria[], isCa: boolean): GroupedCurriculumItem[] {
  const groups = new Map<string, GroupedCurriculumItem>();
  for (const ce of list) {
    const category = esoCategory(ce, isCa);
    const group = groups.get(category) ?? { category, items: [], totalItems: 0 };
    group.items.push({
      index: ce.ce_num ?? group.items.length + 1,
      text: ce.description,
      value: ce.value,
      criterios: ce.criteriosDetalle,
    });
    group.totalItems = group.items.length;
    groups.set(category, group);
  }
  return Array.from(groups.values());
}

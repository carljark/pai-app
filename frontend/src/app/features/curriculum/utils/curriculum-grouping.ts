import { LearningOutcome, EvaluativeCriteria, CriterioItem } from '../models/curriculum.model';
import { normalizeTipoNivel } from '../../projects/models/project.model';

/** Nivel educativo: un id del catálogo de niveles (`NivelesService`). */
export type TipoNivel = string;

export interface GroupedCurriculumItem {
  category: string;
  /** `value` es el valor seleccionado cuando no coincide con el texto (CE de la ESO). */
  items: { index: number; text: string; value?: string; criterios?: CriterioItem[] }[];
  totalItems: number;
  moduleCode?: string;
}

export interface ItemInfo {
  subject: string;
  index: number;
  text?: string;
  criterios?: CriterioItem[];
}

function localizeRa(r: LearningOutcome, isCa: boolean): LearningOutcome {
  return {
    ...r,
    module: isCa ? r.module_ca || r.module : r.module_es || r.module,
    subject: isCa ? r.module_ca || r.subject || r.module : r.module_es || r.subject || r.module,
    description: isCa ? r.description_ca || r.description : r.description_es || r.description,
    criterios: isCa ? r.criterios_ca || r.criterios : r.criterios_es || r.criterios,
  };
}

/**
 * Filtra los RAs del nivel y los traduce al idioma activo. Si el curso fija sus módulos
 * (catálogo de niveles), solo quedan los de esos módulos.
 */
export function filterRasForNivel(
  ras: LearningOutcome[],
  tipoNivel: TipoNivel,
  modulos: string[] | null,
  isCa: boolean,
): LearningOutcome[] {
  const list = ras
    .filter((ra) => normalizeTipoNivel(ra.tipoNivel) === tipoNivel)
    .map((r) => localizeRa(r, isCa));
  return modulos ? list.filter((r) => modulos.includes(r.moduleCode ?? '')) : list;
}

function toIndexedItems(texts: string[]): Pick<GroupedCurriculumItem, 'items' | 'totalItems'> {
  const items = Array.from(new Set(texts)).map((text, idx) => ({ index: idx + 1, text }));
  return { items, totalItems: items.length };
}

function moduleCategory(ra: LearningOutcome): string {
  const name = ra.subject || ra.module || '';
  const code = ra.moduleCode;
  return code && !name.startsWith(code) ? `${code}. ${name}` : name;
}

export function groupRasByModule(list: LearningOutcome[]): GroupedCurriculumItem[] {
  const groups: Record<string, string[]> = {};
  const moduleCodes: Record<string, string> = {};
  for (const ra of list) {
    const category = moduleCategory(ra);
    if (!groups[category]) {
      groups[category] = [];
      if (ra.moduleCode) moduleCodes[category] = ra.moduleCode;
    }
    groups[category].push(ra.description);
  }
  return Object.keys(groups).map((key) => ({
    category: key,
    ...toIndexedItems(groups[key]),
    moduleCode: moduleCodes[key],
  }));
}

/** Ordena los módulos según el orden oficial del curso; sin orden, se mantienen como llegan. */
export function sortGroupsByModuleOrder(
  groups: GroupedCurriculumItem[],
  order: string[] | null,
): GroupedCurriculumItem[] {
  if (!order) return groups;
  return groups.sort((a, b) => {
    const idxA = order.indexOf(a.moduleCode || '');
    const idxB = order.indexOf(b.moduleCode || '');
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return a.category.localeCompare(b.category);
  });
}

export function groupCes(list: EvaluativeCriteria[]): GroupedCurriculumItem[] {
  const groups: Record<string, GroupedCurriculumItem> = {};
  for (const ce of list) {
    const category = `${ce.area || ce.subject} - ${ce.subject}`;
    const group = (groups[category] ??= { category, items: [], totalItems: 0 });
    if (group.items.some((item) => item.text === ce.description)) continue;
    group.items.push({
      index: group.items.length + 1,
      text: ce.description,
      criterios: ce.criteriosDetalle,
    });
    group.totalItems = group.items.length;
  }
  return Object.values(groups);
}

export function buildItemLookup(groups: GroupedCurriculumItem[]): Map<string, ItemInfo> {
  const lookup = new Map<string, ItemInfo>();
  for (const group of groups) {
    for (const item of group.items) {
      lookup.set(item.value ?? item.text, {
        subject: group.category,
        index: item.index,
        text: item.text,
        criterios: item.criterios,
      });
    }
  }
  return lookup;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isSimilar(normItem: string, normDesc: string): boolean {
  if (normItem === normDesc) return true;
  return (
    normDesc.length > 20 &&
    (normItem.includes(normDesc.substring(0, 30)) || normDesc.includes(normItem.substring(0, 30)))
  );
}

/** Búsqueda aproximada de un RA seleccionado entre los elementos del currículum disponible. */
export function fuzzyFindItem(desc: string, groups: GroupedCurriculumItem[]): ItemInfo | undefined {
  const normDesc = normalize(desc);
  for (const group of groups) {
    const item = group.items.find((i) => isSimilar(normalize(i.text), normDesc));
    if (item) return { subject: group.category, index: item.index };
  }
  return undefined;
}

export function shortenDescription(desc: string): string {
  return desc.length > 60 ? `${desc.substring(0, 60)}...` : desc;
}

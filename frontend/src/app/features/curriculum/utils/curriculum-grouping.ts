import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';
import { CfgmRaData, CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';

export type TipoNivel =
  'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA';
type CfgmTipo = 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA';

export interface GroupedCurriculumItem {
  category: string;
  items: { index: number; text: string }[];
  totalItems: number;
  moduleCode?: string;
}

export interface ItemInfo {
  subject: string;
  index: number;
}

export const CFGM_MODULE_ORDER = [
  '0633',
  '0635',
  '0636',
  '0638',
  '0640',
  '0641',
  '1664',
  '1709',
  '0156',
];
export const CFGM_PELUQUERIA_1ST_ORDER = [
  '0845',
  '0842',
  '0844',
  '0846',
  '0849',
  '1664',
  '1709',
  '0156',
];
export const CFGM_PELUQUERIA_2ND_ORDER = [
  '0640',
  '0643',
  '0843',
  '0848',
  '0636',
  '1708',
  '1710',
  '1713',
];

const CFGM_FALLBACK_DATA: Record<CfgmTipo, CfgmRaData[]> = {
  CFGM_ESTETICA: CFGM_ESTETICA_RAS_DATA,
  CFGM_PELUQUERIA: CFGM_PELUQUERIA_RAS_DATA,
};

function isCfgm(tipoNivel: string): tipoNivel is CfgmTipo {
  return tipoNivel === 'CFGM_ESTETICA' || tipoNivel === 'CFGM_PELUQUERIA';
}

function peluqueriaOrder(curso: string): string[] {
  return curso === '2º' ? CFGM_PELUQUERIA_2ND_ORDER : CFGM_PELUQUERIA_1ST_ORDER;
}

/** RAs de respaldo desde los seeds CFGM cuando la API aún no los devuelve. */
function cfgmFallbackRas(tipo: CfgmTipo, isCa: boolean): LearningOutcome[] {
  return CFGM_FALLBACK_DATA[tipo].map((r) => {
    const name = `${r.moduleCode}. ${isCa ? r.module_ca : r.module_es}`;
    return {
      id: r.id,
      module: name,
      subject: name,
      description: isCa ? r.description_ca : r.description_es,
      tipoNivel: tipo,
      moduleCode: r.moduleCode,
      criterios: isCa ? r.criterios_ca : r.criterios_es,
    };
  });
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

/** Filtra los RAs del nivel (y del curso en Peluquería) y los traduce al idioma activo. */
export function filterRasForNivel(
  ras: LearningOutcome[],
  tipoNivel: TipoNivel,
  curso: string,
  isCa: boolean,
): LearningOutcome[] {
  let list = ras.filter(
    (ra) => ra.tipoNivel === tipoNivel || (!ra.tipoNivel && tipoNivel === 'FP_BASICA'),
  );
  if (isCfgm(tipoNivel) && list.length === 0) list = cfgmFallbackRas(tipoNivel, isCa);
  list = list.map((r) => localizeRa(r, isCa));
  if (tipoNivel === 'CFGM_PELUQUERIA') {
    const allowedModules = peluqueriaOrder(curso);
    list = list.filter((r) => allowedModules.includes(r.moduleCode ?? ''));
  }
  return list;
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

/** Ordena los módulos CFGM según el orden oficial; el resto de niveles se mantiene. */
export function sortCfgmGroups(
  groups: GroupedCurriculumItem[],
  tipoNivel: TipoNivel,
  curso: string,
): GroupedCurriculumItem[] {
  if (!isCfgm(tipoNivel)) return groups;
  const order = tipoNivel === 'CFGM_PELUQUERIA' ? peluqueriaOrder(curso) : CFGM_MODULE_ORDER;
  return groups.sort((a, b) => {
    const idxA = order.indexOf(a.moduleCode || '');
    const idxB = order.indexOf(b.moduleCode || '');
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return a.category.localeCompare(b.category);
  });
}

export function groupCes(list: EvaluativeCriteria[]): GroupedCurriculumItem[] {
  const groups: Record<string, string[]> = {};
  for (const ce of list) {
    const groupName = `${ce.area || ce.subject} - ${ce.subject}`;
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(ce.description);
  }
  return Object.keys(groups).map((key) => ({ category: key, ...toIndexedItems(groups[key]) }));
}

export function buildItemLookup(groups: GroupedCurriculumItem[]): Map<string, ItemInfo> {
  const lookup = new Map<string, ItemInfo>();
  for (const group of groups) {
    for (const item of group.items) {
      lookup.set(item.text, { subject: group.category, index: item.index });
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

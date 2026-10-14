import { Project, normalizeTipoNivel } from '../../projects/models/project.model';
import { projectModules, projectRas } from './history-filter';

/** Módulo (FP) o materia (ESO) del índice del currículo (`GET /api/curriculum/filter-index`). */
export interface FilterIndexModule {
  key: string;
  tipoNivel: string;
  es: string;
  ca: string;
  /** Textos con los que lo guardan los proyectos (castellano, catalán y antiguos). */
  aliases: string[];
}

/** RA o CE del índice, con su módulo y su orden dentro de él. */
export interface FilterIndexItem extends FilterIndexModule {
  moduleKey: string;
  order: number;
}

export interface FilterIndex {
  modules: FilterIndexModule[];
  items: FilterIndexItem[];
}

/** Opción de filtro: una por módulo o RA, aunque los proyectos lo guarden en los dos idiomas. */
export interface FilterOption {
  key: string;
  es: string;
  ca: string;
  /** Módulo del RA; sin él (texto fuera del índice), el RA vale para cualquier módulo. */
  moduleKey?: string;
  order: number;
}

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const lookupKey = (tipoNivel: string, text: string) => `${tipoNivel}\u0000${normalize(text)}`;

/** Texto que no está en el índice: se agrupa por nivel y texto normalizado. */
const textOption = (tipoNivel: string, text: string): FilterOption => ({
  key: `txt|${lookupKey(tipoNivel, text)}`,
  es: text,
  ca: text,
  order: Number.MAX_SAFE_INTEGER,
});

const buildLookup = <T extends FilterIndexModule>(entries: T[]): Map<string, T> => {
  const lookup = new Map<string, T>();
  for (const entry of entries) {
    for (const alias of entry.aliases) {
      const key = lookupKey(normalizeTipoNivel(entry.tipoNivel), alias);
      if (!lookup.has(key)) lookup.set(key, entry);
    }
  }
  return lookup;
};

/** Traduce los módulos y RA guardados como texto en cada proyecto a opciones bilingües únicas. */
export class CurriculumResolver {
  private modules: Map<string, FilterIndexModule>;
  private items: Map<string, FilterIndexItem>;
  private cache = new WeakMap<Project, { modules: FilterOption[]; items: FilterOption[] }>();

  constructor(index: FilterIndex) {
    this.modules = buildLookup(index.modules);
    this.items = buildLookup(index.items);
  }

  modulesOf(project: Project): FilterOption[] {
    return this.resolve(project).modules;
  }

  itemsOf(project: Project): FilterOption[] {
    return this.resolve(project).items;
  }

  private resolve(project: Project) {
    let resolved = this.cache.get(project);
    if (!resolved) {
      const tipoNivel = normalizeTipoNivel(project.tipoNivel);
      resolved = {
        modules: this.options(projectModules(project), tipoNivel, this.modules),
        items: this.options(projectRas(project), tipoNivel, this.items),
      };
      this.cache.set(project, resolved);
    }
    return resolved;
  }

  private options(
    texts: string[],
    tipoNivel: string,
    lookup: Map<string, FilterIndexModule & Partial<FilterIndexItem>>,
  ): FilterOption[] {
    const byKey = new Map<string, FilterOption>();
    for (const text of texts.filter(Boolean)) {
      const entry = lookup.get(lookupKey(tipoNivel, text));
      const option = entry ? toOption(entry) : textOption(tipoNivel, text);
      if (!byKey.has(option.key)) byKey.set(option.key, option);
    }
    return Array.from(byKey.values());
  }
}

const toOption = (entry: FilterIndexModule & Partial<FilterIndexItem>): FilterOption => ({
  key: entry.key,
  es: entry.es,
  ca: entry.ca,
  moduleKey: entry.moduleKey,
  order: entry.order ?? 0,
});

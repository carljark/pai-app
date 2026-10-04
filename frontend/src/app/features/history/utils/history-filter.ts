import { HistoryTab, Project, getOwnerId } from '../../projects/models/project.model';

export type HistoryTabId = HistoryTab;

export interface HistoryFilters {
  tab: HistoryTabId;
  onlyMine: boolean;
  ownerId?: string;
  keywords: string[];
  module: string | null;
  ra: string | null;
}

const normalize = (value: string): string =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function projectModules(project: Project): string[] {
  if (project.modules && project.modules.length > 0) return project.modules;
  return project.generatedContent?.modules || [];
}

export function projectRas(project: Project): string[] {
  return project.ras || [];
}

export function matchesTab(project: Project, tab: HistoryTabId): boolean {
  if (tab === 'FPB') {
    return (
      project.tipoNivel === 'FP_BASICA' ||
      (!project.tipoNivel && !project.courseLevel?.includes('CFGM'))
    );
  }
  if (tab === 'CFGM') return project.tipoNivel === 'CFGM_ESTETICA';
  if (tab === 'CFGM_PELUQUERIA') return project.tipoNivel === 'CFGM_PELUQUERIA';
  if (tab === 'CFGS_EDUCACION_INFANTIL') return project.tipoNivel === 'CFGS_EDUCACION_INFANTIL';
  return project.tipoNivel === 'DIVERSIFICACION_CURRICULAR' || project.tipoNivel === 'ESO';
}

export function parseKeywords(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

const containsAll = (texts: (string | undefined)[], keywords: string[]): boolean => {
  const haystack = normalize(texts.filter(Boolean).join(' '));
  return keywords.every((keyword) => haystack.includes(keyword));
};

/** Texto del proyecto: original y traducciones guardadas (para buscar también en catalán). */
const contentTexts = (project: Project): (string | undefined)[] => [
  project.generatedContent?.rawText,
  ...Object.values(project.translations || {}).map((t) => t?.rawText),
];

/**
 * Relevancia de un proyecto para la búsqueda: 2 si todas las palabras están en el título,
 * los módulos o los RA; 1 si hace falta el contenido; 0 si no coincide.
 */
export function keywordRank(project: Project, keywords: string[]): number {
  const metadata = [
    project.title,
    projectModules(project).join(' '),
    projectRas(project).join(' '),
  ];
  if (containsAll(metadata, keywords)) return 2;
  return containsAll([...metadata, ...contentTexts(project)], keywords) ? 1 : 0;
}

export function matchesKeywords(project: Project, keywords: string[]): boolean {
  return keywords.length === 0 || keywordRank(project, keywords) > 0;
}

/** Con búsqueda, primero los que coinciden en título, módulos o RA (orden estable). */
export function sortByRelevance(projects: Project[], keywords: string[]): Project[] {
  if (keywords.length === 0) return projects;
  const ranked = projects.map((project, index) => ({
    project,
    index,
    rank: keywordRank(project, keywords),
  }));
  ranked.sort((a, b) => b.rank - a.rank || a.index - b.index);
  return ranked.map((r) => r.project);
}

export function matchesProjectFilters(project: Project, filters: HistoryFilters): boolean {
  // Al buscar por palabras se buscan proyectos de todos los niveles, no solo de la pestaña activa
  if (filters.keywords.length === 0 && !matchesTab(project, filters.tab)) return false;
  if (filters.onlyMine && filters.ownerId) {
    if (getOwnerId(project.userId) !== filters.ownerId) return false;
  }
  if (filters.module && !projectModules(project).includes(filters.module)) return false;
  if (filters.ra && !projectRas(project).includes(filters.ra)) return false;
  return matchesKeywords(project, filters.keywords);
}

export function collectModuleOptions(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) =>
    projectModules(p).forEach((m) => {
      if (m) set.add(m);
    }),
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function collectRaOptions(projects: Project[], module: string | null): string[] {
  const set = new Set<string>();
  projects.forEach((p) => {
    if (module && !projectModules(p).includes(module)) return;
    projectRas(p).forEach((r) => {
      if (r) set.add(r);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

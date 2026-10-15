import type { CurriculumResolver } from './curriculum-resolver';
import {
  HistoryTab,
  Project,
  getOwnerId,
  normalizeTipoNivel,
} from '../../projects/models/project.model';

export type HistoryTabId = HistoryTab;

export interface HistoryFilters {
  tab: HistoryTabId;
  /** Curso del nivel; `null` abarca todos. */
  curso: string | null;
  onlyMine: boolean;
  ownerId?: string;
  keywords: string[];
  /** Clave del módulo o RA (`FilterOption.key`), igual en castellano y en catalán. */
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

/** Cada pestaña es un nivel del catálogo; los proyectos antiguos se normalizan (vacío, `ESO`). */
export function matchesTab(project: Project, tab: HistoryTabId): boolean {
  return normalizeTipoNivel(project.tipoNivel) === tab;
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

export function projectCurso(project: Project): string {
  return project.courseLevel || project.generatedContent?.courseLevel || '';
}

/** Nivel, curso y autoría: lo que acota las opciones de módulo y RA. */
export function matchesScope(project: Project, filters: HistoryFilters): boolean {
  if (filters.onlyMine && filters.ownerId) {
    if (getOwnerId(project.userId) !== filters.ownerId) return false;
  }
  // Al buscar por palabras se buscan proyectos de todos los niveles, no solo del seleccionado
  if (filters.keywords.length > 0) return true;
  if (!matchesTab(project, filters.tab)) return false;
  return !filters.curso || projectCurso(project) === filters.curso;
}

export function matchesCurriculum(
  project: Project,
  filters: Pick<HistoryFilters, 'module' | 'ra'>,
  resolver: CurriculumResolver,
): boolean {
  const { module, ra } = filters;
  if (module && !resolver.modulesOf(project).some((m) => m.key === module)) return false;
  return !ra || resolver.itemsOf(project).some((r) => r.key === ra);
}

export function matchesProjectFilters(
  project: Project,
  filters: HistoryFilters,
  resolver: CurriculumResolver,
): boolean {
  return (
    matchesScope(project, filters) &&
    matchesCurriculum(project, filters, resolver) &&
    matchesKeywords(project, filters.keywords)
  );
}

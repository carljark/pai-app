import { Project } from '../../projects/models/project.model';

export type HistoryTabId = 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'ESO';

export interface HistoryFilters {
  tab: HistoryTabId;
  onlyMine: boolean;
  ownerId?: string;
  keywords: string[];
  module: string | null;
  ra: string | null;
}

const normalize = (value: string): string =>
  (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function projectModules(project: Project): string[] {
  if (project.modules && project.modules.length > 0) return project.modules;
  return project.generatedContent?.modules || [];
}

export function projectRas(project: Project): string[] {
  return project.ras || [];
}

export function matchesTab(project: Project, tab: HistoryTabId): boolean {
  if (tab === 'FPB') {
    return project.tipoNivel === 'FP_BASICA' || (!project.tipoNivel && !project.courseLevel?.includes('CFGM'));
  }
  if (tab === 'CFGM') return project.tipoNivel === 'CFGM_ESTETICA';
  if (tab === 'CFGM_PELUQUERIA') return project.tipoNivel === 'CFGM_PELUQUERIA';
  return project.tipoNivel === 'DIVERSIFICACION_CURRICULAR' || project.tipoNivel === 'ESO';
}

export function parseKeywords(query: string): string[] {
  return normalize(query).split(/\s+/).map(t => t.trim()).filter(Boolean);
}

export function matchesKeywords(project: Project, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const haystack = normalize([
    project.title,
    projectModules(project).join(' '),
    projectRas(project).join(' '),
    project.generatedContent?.rawText,
  ].filter(Boolean).join(' '));
  return keywords.every(keyword => haystack.includes(keyword));
}

export function matchesProjectFilters(project: Project, filters: HistoryFilters): boolean {
  if (!matchesTab(project, filters.tab)) return false;
  if (filters.onlyMine && filters.ownerId) {
    const authorId = (project.userId as any)?._id || project.userId;
    if (authorId?.toString() !== filters.ownerId) return false;
  }
  if (filters.module && !projectModules(project).includes(filters.module)) return false;
  if (filters.ra && !projectRas(project).includes(filters.ra)) return false;
  return matchesKeywords(project, filters.keywords);
}

export function collectModuleOptions(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach(p => projectModules(p).forEach(m => { if (m) set.add(m); }));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function collectRaOptions(projects: Project[], module: string | null): string[] {
  const set = new Set<string>();
  projects.forEach(p => {
    if (module && !projectModules(p).includes(module)) return;
    projectRas(p).forEach(r => { if (r) set.add(r); });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

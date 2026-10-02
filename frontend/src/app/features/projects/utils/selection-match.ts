import { Project } from '../models/project.model';

/** Clave normalizada de una selección (RAs o CEs): trim, minúsculas y orden. */
export function selectionKey(items: string[] | undefined | null): string {
  return [...(items || [])].map(item => (item || '').trim().toLowerCase()).sort().join('||');
}

/** Proyectos generados cuya selección de RAs/CEs coincide exactamente con la dada. */
export function findProjectsWithSameSelection(projects: Project[], selectedRas: string[]): Project[] {
  const target = selectionKey(selectedRas);
  if (!target) return [];
  return (projects || []).filter(project => {
    if (project.status === 'error' || !Array.isArray(project.ras)) return false;
    return selectionKey(project.ras) === target;
  });
}

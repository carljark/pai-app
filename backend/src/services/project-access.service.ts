/**
 * Permisos de edición de un proyecto: lo pueden modificar su autor, los colaboradores
 * invitados y los administradores; para el resto de usuarios es de solo lectura.
 */

const idOf = (ref: any): string | undefined => (ref?._id || ref)?.toString();

export const ownerIdOf = (project: any): string | undefined => idOf(project?.userId);

export const collaboratorIdsOf = (project: any): string[] =>
  (project?.collaborators || [])
    .map((c: any) => idOf(c?.userId))
    .filter((id: string | undefined): id is string => !!id);

/** Autor y colaboradores: quienes reciben los avisos del proyecto. */
export const participantIdsOf = (project: any): string[] => {
  const owner = ownerIdOf(project);
  return Array.from(new Set([...(owner ? [owner] : []), ...collaboratorIdsOf(project)]));
};

export const canManageCollaborators = (project: any, user: any): boolean =>
  user?.role === 'admin' || ownerIdOf(project) === idOf(user);

/** El proyecto de ejemplo solo lo modifican los administradores. */
export const canEditProject = (project: any, user: any): boolean => {
  const userId = idOf(user);
  if (!project || !userId) return false;
  if (user.role === 'admin') return true;
  return !project.isExample && participantIdsOf(project).includes(userId);
};

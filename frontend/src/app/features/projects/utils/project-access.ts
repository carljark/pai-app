import { User } from '../../auth/models/auth.model';
import { Project, getOwnerId } from '../models/project.model';

const userIdOf = (user: User | null | undefined): string | undefined => user?._id || user?.id;

/**
 * Mismas reglas que el backend: pueden modificar el proyecto su autor, los colaboradores
 * invitados y los administradores; para el resto es de solo lectura.
 */
export function canEditProject(
  project: Project | null | undefined,
  user: User | null | undefined,
): boolean {
  const userId = userIdOf(user);
  if (!project || !userId) return false;
  if (user?.role === 'admin' || getOwnerId(project.userId) === userId) return true;
  return (project.collaborators || []).some((c) => getOwnerId(c.userId) === userId);
}

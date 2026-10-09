import { describe, it, expect } from 'vitest';
import { canEditProject } from './project-access';
import { Project } from '../models/project.model';

const asProject = (p: object) => p as Project;

describe('canEditProject', () => {
  const project = asProject({
    _id: 'p1',
    userId: { _id: 'autor', name: 'Autor' },
    collaborators: [{ userId: 'mate' }, { userId: { _id: 'mate2', name: 'Mate' } }],
  });

  it('permite editar al autor, a los colaboradores y a los administradores', () => {
    expect(canEditProject(project, { _id: 'autor', name: '', email: '' })).toBe(true);
    expect(canEditProject(project, { id: 'mate', name: '', email: '' })).toBe(true);
    expect(canEditProject(project, { _id: 'mate2', name: '', email: '' })).toBe(true);
    expect(canEditProject(project, { _id: 'x', name: '', email: '', role: 'admin' })).toBe(true);
  });

  it('el resto de usuarios solo puede leer', () => {
    expect(canEditProject(project, { _id: 'otro', name: '', email: '' })).toBe(false);
    expect(
      canEditProject(asProject({ userId: 'autor' }), { _id: 'otro', name: '', email: '' }),
    ).toBe(false);
    expect(canEditProject(project, null)).toBe(false);
    expect(canEditProject(undefined, { _id: 'autor', name: '', email: '' })).toBe(false);
  });
});

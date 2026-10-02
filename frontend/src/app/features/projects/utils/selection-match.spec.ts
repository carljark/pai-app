import { describe, it, expect } from 'vitest';
import { selectionKey, findProjectsWithSameSelection } from './selection-match';

describe('selection-match', () => {
  const project = (overrides: any = {}) => ({ _id: '1', status: 'borrador', ras: ['ra1'], ...overrides } as any);

  it('selectionKey normaliza orden, mayúsculas y espacios', () => {
    expect(selectionKey([' B ', 'a'])).toBe('a||b');
    expect(selectionKey(undefined as any)).toBe('');
  });

  it('encuentra proyectos con la misma selección exacta y descarta error/sin ras', () => {
    const projects = [
      project({ _id: 'p1', ras: ['ra2', 'ra1'] }),
      project({ _id: 'p2', ras: ['ra1'] }),
      project({ _id: 'p3', status: 'error', ras: ['ra1', 'ra2'] }),
      project({ _id: 'p4', ras: undefined }),
    ];
    const res = findProjectsWithSameSelection(projects as any, ['ra1', 'ra2']);
    expect(res.map(p => p._id)).toEqual(['p1']);
  });

  it('devuelve [] si no hay selección', () => {
    expect(findProjectsWithSameSelection([project()] as any, [])).toEqual([]);
  });
});

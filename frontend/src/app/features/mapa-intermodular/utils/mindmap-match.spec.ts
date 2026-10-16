import { describe, expect, it } from 'vitest';
import type { MindmapNode, MindmapPath } from '../models/mindmap.model';
import { nodeVisualState, normalizeQuery, type VisualContext } from './mindmap-match';
import { EMPTY_PATH } from './mindmap-tree';

function node(partial: Partial<MindmapNode>): MindmapNode {
  return {
    id: 'x',
    kind: 'module',
    badge: '',
    label: '',
    color: '',
    expandable: true,
    expanded: false,
    searchText: '',
    relationTypes: [],
    children: [],
    ...partial,
  };
}

function ctx(partial: Partial<VisualContext> = {}, path: Partial<MindmapPath> = {}): VisualContext {
  return {
    query: '',
    moduleType: 'all',
    relationType: 'all',
    ...partial,
    path: { ...EMPTY_PATH, ...path },
  };
}

const MODULE = node({
  kind: 'module',
  moduleCode: '0001',
  moduleType: 'especifico',
  searchText: '0001 análisis',
  relationTypes: ['tecnica'],
});
const RA = node({ kind: 'ra', raId: 'r1', moduleType: 'especifico', searchText: 'ra1 muestras' });
const GROUP = node({ kind: 'group', targetModuleCode: '0002', relationTypes: ['digital'] });
const CONNECTION = node({ kind: 'connection', connectionIndex: 1, relationTypes: ['tecnica'] });

describe('normalizeQuery', () => {
  it('pasa a minúsculas y recorta; lo que no es texto queda vacío', () => {
    expect(normalizeQuery('  Análisis ')).toBe('análisis');
    expect(normalizeQuery(undefined)).toBe('');
  });
});

describe('nodeVisualState', () => {
  it('el centro nunca se atenúa', () => {
    const root = node({ kind: 'root' });
    expect(nodeVisualState(root, ctx({ query: 'zzz', relationType: 'digital' }))).toEqual({
      dimmed: false,
      muted: false,
      match: false,
    });
  });

  it('sin filtros ni rama abierta todo se ve normal', () => {
    for (const n of [MODULE, RA, GROUP, CONNECTION]) {
      expect(nodeVisualState(n, ctx())).toEqual({ dimmed: false, muted: false, match: false });
    }
  });

  it('apaga los hermanos de la rama abierta en cada nivel', () => {
    const path = { moduleCode: '0009', raId: 'r9', groupCode: '0009', connectionIndex: 0 };
    for (const n of [MODULE, RA, GROUP, CONNECTION]) {
      expect(nodeVisualState(n, ctx({}, path)).muted).toBe(true);
    }
    const own = { moduleCode: '0001', raId: 'r1', groupCode: '0002', connectionIndex: 1 };
    for (const n of [MODULE, RA, GROUP, CONNECTION]) {
      expect(nodeVisualState(n, ctx({}, own)).muted).toBe(false);
    }
  });

  it('resalta lo que coincide con la búsqueda y atenúa módulos y RA que no', () => {
    expect(nodeVisualState(MODULE, ctx({ query: 'análisis' }))).toMatchObject({
      match: true,
      dimmed: false,
    });
    expect(nodeVisualState(RA, ctx({ query: 'análisis' }))).toMatchObject({
      match: false,
      dimmed: true,
    });
    expect(nodeVisualState(GROUP, ctx({ query: 'análisis' })).dimmed).toBe(false);
  });

  it('atenúa los módulos de otro tipo', () => {
    expect(nodeVisualState(MODULE, ctx({ moduleType: 'comun' })).dimmed).toBe(true);
    expect(nodeVisualState(MODULE, ctx({ moduleType: 'especifico' })).dimmed).toBe(false);
    expect(nodeVisualState(GROUP, ctx({ moduleType: 'comun' })).dimmed).toBe(false);
  });

  it('atenúa las ramas sin el tipo de competencia elegido', () => {
    expect(nodeVisualState(MODULE, ctx({ relationType: 'tecnica' })).dimmed).toBe(false);
    expect(nodeVisualState(GROUP, ctx({ relationType: 'tecnica' })).dimmed).toBe(true);
    expect(nodeVisualState(CONNECTION, ctx({ relationType: 'digital' })).dimmed).toBe(true);
  });
});

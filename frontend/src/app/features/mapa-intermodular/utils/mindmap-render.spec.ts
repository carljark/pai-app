import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import { layoutMindmap } from './mindmap-layout';
import { focusNodeId, renderLinks, renderNodes } from './mindmap-render';
import { EMPTY_PATH, buildMindmapTree } from './mindmap-tree';

const PATH = { moduleCode: '0001', raId: '0001_RA1', groupCode: '', connectionIndex: null };

function laidOut(path = PATH) {
  return layoutMindmap(
    buildMindmapTree({
      modules: mindmapModules(),
      path,
      isCa: false,
      rootBadge: 'CFGS',
      rootLabel: 'Laboratorio Clínico y Biomédico 2.º',
    }),
  );
}

describe('renderNodes', () => {
  it('añade estado visual y etiqueta en líneas', () => {
    const nodes = renderNodes(laidOut().nodes, {
      query: '',
      moduleType: 'all',
      relationType: 'all',
      path: PATH,
    });
    const root = nodes.find((n) => n.node.id === 'root')!;
    const group = nodes.find((n) => n.node.id === 'g:0001_RA1:0002')!;
    const other = nodes.find((n) => n.node.id === 'm:0002')!;
    expect(root.lines).toEqual(['Laboratorio Clínico', 'y Biomédico 2.º']);
    expect(group.lines).toEqual(['Módulo 0002']);
    expect(other.state.muted).toBe(true);
  });
});

describe('renderLinks', () => {
  it('atenúa los trazos hacia nodos apagados o atenuados', () => {
    const { nodes, links } = laidOut();
    const rendered = renderNodes(nodes, {
      query: '',
      moduleType: 'comun',
      relationType: 'all',
      path: PATH,
    });
    const byTarget = new Map(renderLinks(links, rendered).map((l) => [l.targetId, l.faded]));
    expect(byTarget.get('m:0001')).toBe(true);
    expect(byTarget.get('m:0002')).toBe(true);
    expect(byTarget.get('g:0001_RA1:0002')).toBe(false);
  });
});

describe('focusNodeId', () => {
  const tree = (path: typeof PATH | typeof EMPTY_PATH) =>
    buildMindmapTree({
      modules: mindmapModules(),
      path,
      isCa: false,
      rootBadge: '',
      rootLabel: '',
    });

  it('apunta al nodo desplegado más profundo, sin contar la conexión elegida', () => {
    expect(focusNodeId(tree(EMPTY_PATH))).toBe('root');
    expect(focusNodeId(tree({ ...EMPTY_PATH, moduleCode: '0001' }))).toBe('m:0001');
    expect(focusNodeId(tree(PATH))).toBe('r:0001_RA1');
    const open = { ...PATH, groupCode: '0002', connectionIndex: 0 };
    expect(focusNodeId(tree(open))).toBe('g:0001_RA1:0002');
  });
});

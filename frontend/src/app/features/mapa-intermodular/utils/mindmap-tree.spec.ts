import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import type { MindmapPath } from '../models/mindmap.model';
import {
  EMPTY_PATH,
  NEUTRAL_COLOR,
  buildMindmapTree,
  findSelectedConnection,
  groupConnections,
  type MindmapTreeContext,
} from './mindmap-tree';

function context(path: Partial<MindmapPath> = {}, isCa = false): MindmapTreeContext {
  return {
    modules: mindmapModules(),
    path: { ...EMPTY_PATH, ...path },
    isCa,
    rootBadge: 'CFGS',
    rootLabel: 'Laboratorio 2.º',
  };
}

describe('buildMindmapTree', () => {
  it('arranca con el centro y los módulos plegados', () => {
    const root = buildMindmapTree(context());
    expect(root).toMatchObject({
      id: 'root',
      kind: 'root',
      badge: 'CFGS',
      label: 'Laboratorio 2.º',
    });
    expect(root.children.map((m) => m.id)).toEqual(['m:0001', 'm:0002']);
    expect(root.children.every((m) => m.children.length === 0 && !m.expanded)).toBe(true);
  });

  it('describe cada módulo con su color, tipo, RA y tipos de competencia', () => {
    const [first, second] = buildMindmapTree(context()).children;
    expect(first).toMatchObject({ badge: '0001', label: 'Análisis clínico', color: '#2563eb' });
    expect(first!.count).toBe(3);
    expect(first!.relationTypes).toEqual(['tecnica', 'digital', 'comunicacion', 'ciencias']);
    expect(first!.searchText).toContain('resultado ra1 de 0001');
    expect(second).toMatchObject({ color: NEUTRAL_COLOR, moduleType: 'comun' });
  });

  it('abrir un módulo despliega sus RA', () => {
    const module = buildMindmapTree(context({ moduleCode: '0001' })).children[0]!;
    expect(module.expanded).toBe(true);
    expect(module.children.map((r) => r.badge)).toEqual(['RA1', 'RA2', 'RA3']);
    expect(module.children[2]!.expandable).toBe(false);
  });

  it('abrir un RA agrupa sus conexiones por módulo de destino', () => {
    const ra = buildMindmapTree(context({ moduleCode: '0001', raId: '0001_RA1' })).children[0]!
      .children[0]!;
    expect(ra.children.map((g) => [g.id, g.count])).toEqual([
      ['g:0001_RA1:0002', 2],
      ['g:0001_RA1:0009', 1],
    ]);
    expect(ra.children[0]!.color).toBe(NEUTRAL_COLOR);
    expect(ra.children[1]!.label).toBe('Módulo 0009');
  });

  it('abrir un grupo muestra sus conexiones con su índice original', () => {
    const tree = buildMindmapTree(
      context({ moduleCode: '0001', raId: '0001_RA1', groupCode: '0002', connectionIndex: 2 }),
    );
    const group = tree.children[0]!.children[0]!.children[0]!;
    expect(group.children.map((c) => [c.id, c.badge, c.expanded])).toEqual([
      ['c:0001_RA1:0', 'RA1', false],
      ['c:0001_RA1:2', 'RA2', true],
    ]);
    expect(group.children[0]!.label).toBe('Texto 0002 RA1');
    expect(group.children[1]!.label).toBe('Texto 0002 RA2');
  });

  it('usa los textos en catalán', () => {
    const tree = buildMindmapTree(
      context({ moduleCode: '0001', raId: '0001_RA1', groupCode: '0002' }, true),
    );
    const module = tree.children[0]!;
    const group = module.children[0]!.children[0]!;
    expect(module.label).toBe('Anàlisi clínica');
    expect(module.children[0]!.label).toBe('Resultat RA1 de 0001');
    expect(group.label).toBe('Mòdul 0002');
    expect(group.children.map((c) => c.label)).toEqual(['Text 0002 RA1', 'Text 0002 RA2']);
  });

  it('agrupa conservando el orden de aparición', () => {
    const ra = mindmapModules()[0]!.learningOutcomes[0]!;
    const groups = groupConnections(ra);
    expect([...groups.keys()]).toEqual(['0002', '0009']);
    expect(groups.get('0002')!.map((i) => i.index)).toEqual([0, 2]);
  });
});

describe('findSelectedConnection', () => {
  const modules = mindmapModules();
  const path = { ...EMPTY_PATH, moduleCode: '0001', raId: '0001_RA1', groupCode: '0002' };

  it('devuelve la conexión elegida con su módulo y RA', () => {
    const found = findSelectedConnection(modules, { ...path, connectionIndex: 1 });
    expect(found?.module.code).toBe('0001');
    expect(found?.ra.id).toBe('0001_RA1');
    expect(found?.connection.targetModuleCode).toBe('0009');
  });

  it('devuelve null sin conexión elegida o si la rama ya no existe', () => {
    expect(findSelectedConnection(modules, path)).toBeNull();
    expect(findSelectedConnection(modules, { ...path, connectionIndex: 7 })).toBeNull();
    expect(findSelectedConnection([], { ...path, connectionIndex: 0 })).toBeNull();
  });
});

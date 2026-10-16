import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import { PANORAMA_RADIUS, layoutPanorama } from './panorama-layout';
import { NEUTRAL_COLOR } from './mindmap-tree';

describe('layoutPanorama', () => {
  const layout = layoutPanorama(mindmapModules(), false);

  it('coloca un punto por RA, agrupados por módulo', () => {
    expect(layout.leaves.map((l) => l.id)).toEqual([
      '0001_RA1',
      '0001_RA2',
      '0001_RA3',
      '0002_RA1',
    ]);
    expect(layout.leaves[0]).toMatchObject({
      moduleCode: '0001',
      moduleName: 'Análisis clínico',
      raCode: 'RA1',
      text: 'Resultado RA1 de 0001',
      color: '#2563eb',
    });
    expect(layout.leaves[0]!.transform).toMatch(/^rotate\(-?[\d.]+\) translate\(300,0\)$/);
    expect(layout.leaves[3]!.color).toBe(NEUTRAL_COLOR);
    expect(layout.radius).toBe(PANORAMA_RADIUS);
  });

  it('dibuja solo las conexiones cuyo RA de destino está en el curso', () => {
    expect(layout.edges.map((e) => `${e.sourceId}→${e.targetId}`)).toEqual([
      '0001_RA1→0002_RA1',
      '0001_RA2→0002_RA1',
    ]);
    expect(layout.outside).toBe(2);
    expect(layout.edges[0]).toMatchObject({
      sourceModule: '0001',
      targetModule: '0002',
      relationType: 'tecnica',
    });
    expect(layout.edges[0]!.path).toMatch(/^M/);
  });

  it('cuenta las conexiones salientes y entrantes de cada RA y módulo', () => {
    const target = layout.leaves.find((l) => l.id === '0002_RA1')!;
    expect(target).toMatchObject({ outgoing: 0, incoming: 2 });
    expect(target.relationTypes).toEqual(['tecnica', 'ciencias']);
    expect(layout.arcs.map((a) => [a.code, a.outgoing, a.incoming])).toEqual([
      ['0001', 2, 0],
      ['0002', 0, 2],
    ]);
    expect(layout.arcs[1]!.color).toBe(NEUTRAL_COLOR);
    expect(layout.arcs[0]!.path).toMatch(/^M/);
  });

  it('gira las etiquetas de la mitad izquierda', () => {
    expect(layout.leaves.some((l) => l.flipped)).toBe(true);
    expect(layout.leaves.some((l) => !l.flipped)).toBe(true);
  });

  it('usa los nombres en catalán y omite los módulos sin RA', () => {
    const modules = [
      ...mindmapModules(),
      { ...mindmapModules()[1]!, code: '0003', learningOutcomes: [] },
    ];
    const ca = layoutPanorama(modules, true);
    expect(ca.leaves[0]!.moduleName).toBe('Anàlisi clínica');
    expect(ca.leaves[0]!.text).toBe('Resultat RA1 de 0001');
    expect(ca.arcs.map((a) => a.code)).toEqual(['0001', '0002']);
    expect(ca.arcs[0]!.name).toBe('Anàlisi clínica');
  });

  it('sin módulos no hay nada que pintar', () => {
    expect(layoutPanorama([], false)).toMatchObject({
      leaves: [],
      edges: [],
      arcs: [],
      outside: 0,
    });
  });
});

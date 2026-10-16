import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import type { PanoramaFocus } from '../models/panorama.model';
import { leafPasses, renderEdges, renderLeaves, type PanoramaFilter } from './panorama-highlight';
import { layoutPanorama } from './panorama-layout';

const { leaves, edges } = layoutPanorama(mindmapModules(), false);
const ALL: PanoramaFilter = { query: '', moduleType: 'all', relationType: 'all' };

function render(focus: PanoramaFocus, filter = ALL) {
  const e = renderEdges(edges, leaves, focus, filter);
  const l = renderLeaves(leaves, e, focus, filter);
  return {
    edges: Object.fromEntries(e.map((x) => [`${x.sourceId}→${x.targetId}`, x.state])),
    leaves: Object.fromEntries(l.map((x) => [x.id, x.state])),
    order: e.map((x) => x.state),
  };
}

describe('leafPasses', () => {
  it('aplica tipo de módulo, tipo de competencia y búsqueda', () => {
    const leaf = leaves[0]!;
    expect(leafPasses(leaf, ALL)).toBe(true);
    expect(leafPasses(leaf, { ...ALL, moduleType: 'comun' })).toBe(false);
    expect(leafPasses(leaf, { ...ALL, relationType: 'tecnica' })).toBe(true);
    expect(leafPasses(leaf, { ...ALL, relationType: 'digital' })).toBe(false);
    expect(leafPasses(leaf, { ...ALL, query: 'análisis' })).toBe(true);
    expect(leafPasses(leaf, { ...ALL, query: 'zzz' })).toBe(false);
  });
});

describe('renderEdges y renderLeaves', () => {
  it('sin resaltado ni filtros todo se ve normal', () => {
    const r = render(null);
    expect(Object.values(r.edges)).toEqual(['normal', 'normal']);
    expect(Object.values(r.leaves).every((s) => s === 'normal')).toBe(true);
  });

  it('al resaltar un RA marca sus salientes y entrantes y sus vecinos', () => {
    const source = render({ kind: 'ra', id: '0001_RA1' });
    expect(source.edges).toEqual({ '0001_RA1→0002_RA1': 'out', '0001_RA2→0002_RA1': 'dimmed' });
    expect(source.leaves).toMatchObject({
      '0001_RA1': 'active',
      '0002_RA1': 'linked',
      '0001_RA2': 'dimmed',
    });
    const target = render({ kind: 'ra', id: '0002_RA1' });
    expect(Object.values(target.edges)).toEqual(['in', 'in']);
  });

  it('al resaltar un módulo marca las conexiones de todos sus RA', () => {
    const r = render({ kind: 'module', code: '0001' });
    expect(Object.values(r.edges)).toEqual(['out', 'out']);
    expect(r.leaves).toMatchObject({ '0001_RA3': 'active', '0002_RA1': 'linked' });
    expect(Object.values(render({ kind: 'module', code: '0002' }).edges)).toEqual(['in', 'in']);
  });

  it('atenúa lo que no pasa los filtros', () => {
    const byType = render(null, { ...ALL, relationType: 'ciencias' });
    expect(byType.edges).toEqual({ '0001_RA1→0002_RA1': 'dimmed', '0001_RA2→0002_RA1': 'normal' });
    expect(byType.leaves['0001_RA1']).toBe('dimmed');
    const byQuery = render(null, { ...ALL, query: 'zzz' });
    expect(Object.values(byQuery.edges)).toEqual(['dimmed', 'dimmed']);
  });

  it('pinta las curvas resaltadas al final, encima de las demás', () => {
    expect(render({ kind: 'ra', id: '0001_RA2' }).order).toEqual(['dimmed', 'out']);
  });
});

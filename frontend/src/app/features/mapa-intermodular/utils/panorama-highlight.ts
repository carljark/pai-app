import type {
  EdgeState,
  PanoramaEdge,
  PanoramaFocus,
  PanoramaLeaf,
  RenderedEdge,
  RenderedLeaf,
} from '../models/panorama.model';

export interface PanoramaFilter {
  /** Búsqueda en minúsculas y sin espacios en los extremos. */
  query: string;
  moduleType: string;
  relationType: string;
}

/** Orden de pintado: las curvas resaltadas encima de las demás. */
const EDGE_ORDER: Record<EdgeState, number> = { dimmed: 0, normal: 1, in: 2, out: 3 };

export function leafPasses(leaf: PanoramaLeaf, f: PanoramaFilter): boolean {
  if (f.moduleType !== 'all' && leaf.moduleType !== f.moduleType) return false;
  if (f.relationType !== 'all' && !(leaf.relationTypes as string[]).includes(f.relationType)) {
    return false;
  }
  return !f.query || leaf.searchText.includes(f.query);
}

/** La curva pasa los filtros si su tipo coincide y alguno de sus extremos los pasa. */
function edgePasses(edge: PanoramaEdge, f: PanoramaFilter, passing: Set<string>): boolean {
  if (f.relationType !== 'all' && edge.relationType !== f.relationType) return false;
  return passing.has(edge.sourceId) || passing.has(edge.targetId);
}

/** Saliente o entrante respecto al RA o módulo resaltado; `null` si no le afecta. */
function direction(edge: PanoramaEdge, focus: NonNullable<PanoramaFocus>): EdgeState | null {
  const [source, target, key] =
    focus.kind === 'ra'
      ? [edge.sourceId, edge.targetId, focus.id]
      : [edge.sourceModule, edge.targetModule, focus.code];
  if (source === key) return 'out';
  return target === key ? 'in' : null;
}

/** Estado de cada curva según el resaltado y los filtros, ordenadas para pintarlas. */
export function renderEdges(
  edges: PanoramaEdge[],
  leaves: PanoramaLeaf[],
  focus: PanoramaFocus,
  filter: PanoramaFilter,
): RenderedEdge[] {
  const passing = new Set(leaves.filter((l) => leafPasses(l, filter)).map((l) => l.id));
  const rendered = edges.map((edge) => {
    const passes = edgePasses(edge, filter, passing);
    const dir = focus ? direction(edge, focus) : 'normal';
    const state: EdgeState = passes && dir ? dir : 'dimmed';
    return { ...edge, state };
  });
  return rendered.sort((a, b) => EDGE_ORDER[a.state] - EDGE_ORDER[b.state]);
}

/** Estado de cada RA: el resaltado, los conectados con él, los atenuados y el resto. */
export function renderLeaves(
  leaves: PanoramaLeaf[],
  edges: RenderedEdge[],
  focus: PanoramaFocus,
  filter: PanoramaFilter,
): RenderedLeaf[] {
  const linked = new Set(
    edges
      .filter((e) => e.state === 'out' || e.state === 'in')
      .flatMap((e) => [e.sourceId, e.targetId]),
  );
  return leaves.map((leaf) => ({ ...leaf, state: leafState(leaf, focus, filter, linked) }));
}

function leafState(
  leaf: PanoramaLeaf,
  focus: PanoramaFocus,
  filter: PanoramaFilter,
  linked: Set<string>,
): RenderedLeaf['state'] {
  const isActive =
    (focus?.kind === 'ra' && focus.id === leaf.id) ||
    (focus?.kind === 'module' && focus.code === leaf.moduleCode);
  if (isActive) return 'active';
  if (focus) return linked.has(leaf.id) ? 'linked' : 'dimmed';
  return leafPasses(leaf, filter) ? 'normal' : 'dimmed';
}

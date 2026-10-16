import { cluster, hierarchy, type HierarchyPointNode } from 'd3-hierarchy';
import { arc, curveBundle, lineRadial } from 'd3-shape';
import type {
  CompetenceType,
  FPBModule,
  IntermodularConnection,
  LearningOutcome,
} from '../models/mapa-intermodular.model';
import type {
  PanoramaArc,
  PanoramaEdge,
  PanoramaLayout,
  PanoramaLeaf,
} from '../models/panorama.model';
import { polar } from './mindmap-layout';
import { NEUTRAL_COLOR } from './mindmap-tree';

/** Radio del círculo de RA; el arco de módulo y su código van por fuera. */
export const PANORAMA_RADIUS = 300;
const ARC_INNER = PANORAMA_RADIUS + 34;
const ARC_OUTER = PANORAMA_RADIUS + 44;
const ARC_LABEL = PANORAMA_RADIUS + 60;
/** Tensión de las curvas: 0 = rectas, 1 = totalmente agrupadas. */
const BUNDLE_BETA = 0.85;

/** Nodo del árbol raíz → módulo → RA con el que se calcula la panorámica. */
interface PanoramaDatum {
  module?: FPBModule;
  ra?: LearningOutcome;
  children?: PanoramaDatum[];
}

type PointNode = HierarchyPointNode<PanoramaDatum>;

const bundle = lineRadial<PointNode>()
  .curve(curveBundle.beta(BUNDLE_BETA))
  .angle((d) => d.x)
  .radius((d) => d.y);

const moduleArc = arc<{ startAngle: number; endAngle: number }>()
  .innerRadius(ARC_INNER)
  .outerRadius(ARC_OUTER)
  .cornerRadius(3);

function datum(modules: FPBModule[]): PanoramaDatum {
  return {
    children: modules
      .filter((m) => m.learningOutcomes.length > 0)
      .map((module) => ({
        module,
        children: module.learningOutcomes.map((ra) => ({ module, ra })),
      })),
  };
}

/** RA en círculo agrupados por módulo, arcos de módulo y conexiones como curvas agrupadas. */
export function layoutPanorama(modules: FPBModule[], isCa: boolean): PanoramaLayout {
  if (!modules.some((m) => m.learningOutcomes.length > 0)) {
    return { leaves: [], edges: [], arcs: [], outside: 0, radius: PANORAMA_RADIUS };
  }
  const root = cluster<PanoramaDatum>()
    .size([2 * Math.PI, PANORAMA_RADIUS])
    .separation((a, b) => (a.parent === b.parent ? 1 : 3))(hierarchy(datum(modules)));
  const nodes = new Map(root.leaves().map((n) => [n.data.ra!.id, n]));
  const { edges, outside } = buildEdges(nodes);
  const leaves = root.leaves().map((n) => toLeaf(n, edges, isCa));
  const arcs = root.children!.map((m) => toArc(m, edges, isCa));
  return { leaves, edges, arcs, outside, radius: PANORAMA_RADIUS };
}

function buildEdges(nodes: Map<string, PointNode>): { edges: PanoramaEdge[]; outside: number } {
  const edges: PanoramaEdge[] = [];
  let outside = 0;
  for (const source of nodes.values()) {
    source.data.ra!.connections.forEach((c, index) => {
      const target = nodes.get(`${c.targetModuleCode}_${c.targetRaCode}`);
      if (target) edges.push(toEdge(source, target, c, index));
      else outside++;
    });
  }
  return { edges, outside };
}

function toEdge(
  source: PointNode,
  target: PointNode,
  c: IntermodularConnection,
  index: number,
): PanoramaEdge {
  return {
    id: `${source.data.ra!.id}>${index}`,
    sourceId: source.data.ra!.id,
    targetId: target.data.ra!.id,
    sourceModule: source.data.module!.code,
    targetModule: target.data.module!.code,
    relationType: c.relationType,
    color: moduleColor(source.data.module!),
    path: bundle(source.path(target))!,
  };
}

function toLeaf(n: PointNode, edges: PanoramaEdge[], isCa: boolean): PanoramaLeaf {
  const { module, ra } = n.data as Required<Pick<PanoramaDatum, 'module' | 'ra'>>;
  const own = edges.filter((e) => e.sourceId === ra.id || e.targetId === ra.id);
  return {
    id: ra.id,
    moduleCode: module.code,
    moduleName: isCa ? module.name_ca : module.name_es,
    moduleType: module.type,
    raCode: ra.code,
    text: isCa ? ra.text_ca : ra.text_es,
    color: moduleColor(module),
    transform: `rotate(${round((n.x * 180) / Math.PI - 90)}) translate(${n.y},0)`,
    flipped: n.x >= Math.PI,
    searchText: [module.code, module.name_es, module.name_ca, ra.code, ra.text_es, ra.text_ca]
      .join(' ')
      .toLowerCase(),
    relationTypes: uniqueTypes(own),
    outgoing: own.filter((e) => e.sourceId === ra.id).length,
    incoming: own.filter((e) => e.targetId === ra.id).length,
  };
}

function toArc(m: PointNode, edges: PanoramaEdge[], isCa: boolean): PanoramaArc {
  const module = m.data.module!;
  const angles = m.leaves().map((l) => l.x);
  const pad = 0.02;
  const startAngle = Math.min(...angles) - pad;
  const endAngle = Math.max(...angles) + pad;
  const [labelX, labelY] = polar((startAngle + endAngle) / 2, ARC_LABEL);
  return {
    code: module.code,
    name: isCa ? module.name_ca : module.name_es,
    color: moduleColor(module),
    moduleType: module.type,
    path: moduleArc({ startAngle, endAngle })!,
    labelX: round(labelX),
    labelY: round(labelY),
    outgoing: edges.filter((e) => e.sourceModule === module.code).length,
    incoming: edges.filter((e) => e.targetModule === module.code).length,
  };
}

function moduleColor(module: FPBModule): string {
  return module.color || NEUTRAL_COLOR;
}

function uniqueTypes(edges: PanoramaEdge[]): CompetenceType[] {
  return [...new Set(edges.map((e) => e.relationType))];
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

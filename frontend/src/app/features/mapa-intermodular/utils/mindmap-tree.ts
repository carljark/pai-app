import type {
  CompetenceType,
  FPBModule,
  IntermodularConnection,
  LearningOutcome,
} from '../models/mapa-intermodular.model';
import type { MindmapNode, MindmapPath } from '../models/mindmap.model';
import { relationColor } from './relation-labels';

/** Color de los nodos sin color propio (centro y módulos de destino ajenos al mapa). */
export const NEUTRAL_COLOR = '#4a7c65';

export const EMPTY_PATH: MindmapPath = {
  moduleCode: '',
  raId: '',
  groupCode: '',
  connectionIndex: null,
};

export interface MindmapTreeContext {
  modules: FPBModule[];
  path: MindmapPath;
  isCa: boolean;
  rootBadge: string;
  rootLabel: string;
}

/** Conexión de un RA con su posición original en `ra.connections`. */
interface IndexedConnection {
  connection: IntermodularConnection;
  index: number;
}

function lower(...parts: (string | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p)
    .join(' ')
    .toLowerCase();
}

function uniqueTypes(connections: IntermodularConnection[]): CompetenceType[] {
  return [...new Set(connections.map((c) => c.relationType))];
}

/** Árbol visible del mapa: centro, módulos y, solo en la rama abierta, RA, grupos y conexiones. */
export function buildMindmapTree(ctx: MindmapTreeContext): MindmapNode {
  return {
    id: 'root',
    kind: 'root',
    badge: ctx.rootBadge,
    label: ctx.rootLabel,
    color: NEUTRAL_COLOR,
    expandable: false,
    expanded: true,
    searchText: '',
    relationTypes: [],
    children: ctx.modules.map((m) => moduleNode(m, ctx)),
  };
}

function moduleNode(m: FPBModule, ctx: MindmapTreeContext): MindmapNode {
  const expanded = ctx.path.moduleCode === m.code;
  const ras = m.learningOutcomes;
  return {
    id: `m:${m.code}`,
    kind: 'module',
    badge: m.code,
    label: ctx.isCa ? m.name_ca : m.name_es,
    color: m.color || NEUTRAL_COLOR,
    expandable: ras.length > 0,
    expanded,
    searchText: lower(
      m.code,
      m.name_es,
      m.name_ca,
      ...ras.flatMap((ra) => [ra.code, ra.text_es, ra.text_ca]),
    ),
    relationTypes: uniqueTypes(ras.flatMap((ra) => ra.connections)),
    moduleType: m.type,
    moduleCode: m.code,
    count: ras.length,
    children: expanded ? ras.map((ra) => raNode(m, ra, ctx)) : [],
  };
}

function raNode(m: FPBModule, ra: LearningOutcome, ctx: MindmapTreeContext): MindmapNode {
  const expanded = ctx.path.raId === ra.id;
  return {
    id: `r:${ra.id}`,
    kind: 'ra',
    badge: ra.code,
    label: ctx.isCa ? ra.text_ca : ra.text_es,
    color: m.color || NEUTRAL_COLOR,
    expandable: ra.connections.length > 0,
    expanded,
    searchText: lower(ra.code, ra.text_es, ra.text_ca),
    relationTypes: uniqueTypes(ra.connections),
    moduleType: m.type,
    moduleCode: m.code,
    raId: ra.id,
    count: ra.connections.length,
    children: expanded ? groupNodes(ra, ctx) : [],
  };
}

/** Agrupa las conexiones del RA por módulo de destino, en el orden en que aparecen. */
export function groupConnections(ra: LearningOutcome): Map<string, IndexedConnection[]> {
  const groups = new Map<string, IndexedConnection[]>();
  ra.connections.forEach((connection, index) => {
    const list = groups.get(connection.targetModuleCode) ?? [];
    list.push({ connection, index });
    groups.set(connection.targetModuleCode, list);
  });
  return groups;
}

function groupNodes(ra: LearningOutcome, ctx: MindmapTreeContext): MindmapNode[] {
  return [...groupConnections(ra)].map(([code, items]) => groupNode(ra, code, items, ctx));
}

function groupNode(
  ra: LearningOutcome,
  code: string,
  items: IndexedConnection[],
  ctx: MindmapTreeContext,
): MindmapNode {
  const first = items[0]!.connection;
  const expanded = ctx.path.groupCode === code;
  const target = ctx.modules.find((m) => m.code === code);
  return {
    id: `g:${ra.id}:${code}`,
    kind: 'group',
    badge: code,
    label: ctx.isCa ? first.targetModuleName_ca : first.targetModuleName_es,
    color: target?.color || NEUTRAL_COLOR,
    expandable: true,
    expanded,
    searchText: lower(code, first.targetModuleName_es, first.targetModuleName_ca),
    relationTypes: uniqueTypes(items.map((i) => i.connection)),
    raId: ra.id,
    targetModuleCode: code,
    count: items.length,
    children: expanded ? items.map((i) => connectionNode(ra, i, ctx)) : [],
  };
}

function connectionNode(
  ra: LearningOutcome,
  { connection: c, index }: IndexedConnection,
  ctx: MindmapTreeContext,
): MindmapNode {
  return {
    id: `c:${ra.id}:${index}`,
    kind: 'connection',
    badge: c.targetRaCode,
    label: ctx.isCa ? c.targetRaText_ca : c.targetRaText_es,
    color: relationColor(c.relationType),
    expandable: false,
    expanded: ctx.path.connectionIndex === index,
    searchText: lower(c.targetRaCode, c.title_es, c.title_ca, c.targetRaText_es, c.targetRaText_ca),
    relationTypes: [c.relationType],
    raId: ra.id,
    targetModuleCode: c.targetModuleCode,
    connectionIndex: index,
    connection: c,
    children: [],
  };
}

/** Conexión de la rama abierta, con su módulo y RA de origen, o `null` si no hay ninguna. */
export function findSelectedConnection(
  modules: FPBModule[],
  path: MindmapPath,
): { module: FPBModule; ra: LearningOutcome; connection: IntermodularConnection } | null {
  if (path.connectionIndex === null) return null;
  const module = modules.find((m) => m.code === path.moduleCode);
  const ra = module?.learningOutcomes.find((r) => r.id === path.raId);
  const connection = ra?.connections[path.connectionIndex];
  if (!module || !ra || !connection) return null;
  return { module, ra, connection };
}

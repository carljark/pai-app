import type { MindmapNode, MindmapPath, NodeVisualState } from '../models/mindmap.model';

export interface VisualContext {
  /** Búsqueda en minúsculas y sin espacios en los extremos. */
  query: string;
  /** Tipo de módulo de los filtros de la cabecera («all» = todos). */
  moduleType: string;
  /** Tipo de competencia elegido en la leyenda («all» = todos). */
  relationType: string;
  path: MindmapPath;
}

const NO_STATE: NodeVisualState = { dimmed: false, muted: false, match: false };

/** Normaliza la búsqueda (texto o vacío) para compararla con `searchText`. */
export function normalizeQuery(query: unknown): string {
  return typeof query === 'string' ? query.toLowerCase().trim() : '';
}

/** Estado visual del nodo: atenuado por filtros, apagado si hay otra rama abierta o resaltado. */
export function nodeVisualState(node: MindmapNode, ctx: VisualContext): NodeVisualState {
  if (node.kind === 'root') return NO_STATE;
  const match = !!ctx.query && node.searchText.includes(ctx.query);
  return {
    match,
    muted: isOffPath(node, ctx.path),
    dimmed: failsFilters(node, ctx, match),
  };
}

/** Otro hermano del mismo nivel está desplegado (o seleccionado, en las conexiones). */
function isOffPath(node: MindmapNode, path: MindmapPath): boolean {
  switch (node.kind) {
    case 'module':
      return !!path.moduleCode && node.moduleCode !== path.moduleCode;
    case 'ra':
      return !!path.raId && node.raId !== path.raId;
    case 'group':
      return !!path.groupCode && node.targetModuleCode !== path.groupCode;
    default:
      return path.connectionIndex !== null && node.connectionIndex !== path.connectionIndex;
  }
}

function failsFilters(node: MindmapNode, ctx: VisualContext, match: boolean): boolean {
  const isCurricular = node.kind === 'module' || node.kind === 'ra';
  if (isCurricular && ctx.moduleType !== 'all' && node.moduleType !== ctx.moduleType) return true;
  if (ctx.relationType !== 'all' && !(node.relationTypes as string[]).includes(ctx.relationType)) {
    return true;
  }
  return isCurricular && !!ctx.query && !match;
}

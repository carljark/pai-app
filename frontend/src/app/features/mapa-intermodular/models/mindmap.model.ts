import type { NodeView } from '../utils/mindmap-node-view';
import type { CompetenceType, IntermodularConnection } from './mapa-intermodular.model';

/** Nivel de un nodo del mapa mental: centro, módulo, RA, grupo de destino o conexión. */
export type MindmapNodeKind = 'root' | 'module' | 'ra' | 'group' | 'connection';

/** Nodo del árbol visible del mapa mental (solo las ramas desplegadas tienen hijos). */
export interface MindmapNode {
  id: string;
  kind: MindmapNodeKind;
  /** Texto corto dentro del círculo (código del módulo o del RA). */
  badge: string;
  /** Texto descriptivo junto al círculo, ya en el idioma activo. */
  label: string;
  color: string;
  expandable: boolean;
  expanded: boolean;
  /** Textos en minúsculas (ES y CA) con los que se compara la búsqueda. */
  searchText: string;
  /** Tipos de competencia presentes en la rama (para el filtro de la leyenda). */
  relationTypes: CompetenceType[];
  moduleType?: string;
  moduleCode?: string;
  raId?: string;
  targetModuleCode?: string;
  connectionIndex?: number;
  connection?: IntermodularConnection;
  count?: number;
  children: MindmapNode[];
}

/** Nodo con su posición en el lienzo (origen en el centro del mapa). */
export interface PositionedNode {
  node: MindmapNode;
  x: number;
  y: number;
  depth: number;
  /** El nodo está a la izquierda del centro: su etiqueta se alinea a la derecha. */
  isLeft: boolean;
}

/** Trazo entre dos nodos, ya convertido en `d` de un `<path>`. */
export interface MindmapLink {
  id: string;
  path: string;
  color: string;
  targetId: string;
}

/** Rama desplegada: un único módulo, RA, grupo y conexión a la vez. */
export interface MindmapPath {
  moduleCode: string;
  raId: string;
  groupCode: string;
  connectionIndex: number | null;
}

/** Estado visual de un nodo según la rama abierta, la búsqueda y los filtros. */
export interface NodeVisualState {
  dimmed: boolean;
  muted: boolean;
  match: boolean;
}

/** Nodo listo para pintar: posición, estado visual y etiqueta partida en líneas. */
export interface RenderedNode extends PositionedNode {
  state: NodeVisualState;
  lines: string[];
  view: NodeView;
}

/** Trazo listo para pintar, apagado o atenuado como su nodo de destino. */
export interface RenderedLink extends MindmapLink {
  faded: boolean;
}

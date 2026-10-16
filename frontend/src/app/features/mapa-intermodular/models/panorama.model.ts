import type { CompetenceType } from './mapa-intermodular.model';

/** RA de la panorámica, colocado en el círculo junto a los de su módulo. */
export interface PanoramaLeaf {
  /** Id del RA (`<módulo>_<RA>`), el mismo que usan las conexiones como destino. */
  id: string;
  moduleCode: string;
  moduleName: string;
  moduleType: string;
  raCode: string;
  text: string;
  color: string;
  /** `rotate(…) translate(…)` que lleva el punto a su sitio en el círculo. */
  transform: string;
  /** La etiqueta está en la mitad izquierda: se gira 180° y se alinea al final. */
  flipped: boolean;
  searchText: string;
  /** Tipos de competencia de las conexiones que salen del RA o llegan a él. */
  relationTypes: CompetenceType[];
  outgoing: number;
  incoming: number;
}

/** Conexión de la panorámica, como curva agrupada entre dos RA del curso. */
export interface PanoramaEdge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceModule: string;
  targetModule: string;
  relationType: CompetenceType;
  color: string;
  path: string;
}

/** Arco exterior que agrupa los RA de un módulo, con su código. */
export interface PanoramaArc {
  code: string;
  name: string;
  color: string;
  moduleType: string;
  path: string;
  labelX: number;
  labelY: number;
  outgoing: number;
  incoming: number;
}

export interface PanoramaLayout {
  leaves: PanoramaLeaf[];
  edges: PanoramaEdge[];
  arcs: PanoramaArc[];
  /** Conexiones cuyo RA de destino no pertenece al curso (no se dibujan). */
  outside: number;
  radius: number;
}

/** Lo que el usuario resalta al pasar el ratón o dar el foco: un RA o un módulo entero. */
export type PanoramaFocus = { kind: 'ra'; id: string } | { kind: 'module'; code: string } | null;

export type LeafState = 'active' | 'linked' | 'dimmed' | 'normal';
export type EdgeState = 'out' | 'in' | 'dimmed' | 'normal';

export interface RenderedLeaf extends PanoramaLeaf {
  state: LeafState;
}

export interface RenderedEdge extends PanoramaEdge {
  state: EdgeState;
}

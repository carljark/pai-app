import type { AfinidadEso, AfinidadesCurso, MateriaAfinidades } from '../models/afinidad-eso.model';
import type { MindmapNode, MindmapPath } from '../models/mindmap.model';
import { NEUTRAL_COLOR } from './mindmap-tree';

/** Colores de las materias, en orden; se repiten si hay más materias que colores. */
const PALETTE = [
  '#2563eb',
  '#db2777',
  '#16a34a',
  '#ea580c',
  '#7c3aed',
  '#0891b2',
  '#ca8a04',
  '#dc2626',
  '#4f46e5',
  '#059669',
  '#9333ea',
  '#0d9488',
];

export interface AfinidadesTreeContext {
  data: AfinidadesCurso;
  path: MindmapPath;
  isCa: boolean;
  rootBadge: string;
  rootLabel: string;
}

/** Ficha con su posición en `data.afinidades`, que es su índice en la rama. */
interface IndexedFicha {
  ficha: AfinidadEso;
  index: number;
}

/** Sigla de una materia para el círculo: iniciales de las palabras con contenido (máx. 3). */
export function materiaSigla(name: string): string {
  const words = name.split(/[\s-]+/).filter((w) => w.length > 2 || /^[IVX\d]+$/.test(w));
  const initials = words.map((w) => w[0]!.toUpperCase()).join('');
  return initials.length >= 2 ? initials.slice(0, 3) : name.slice(0, 3).toUpperCase();
}

/** Árbol visible del mapa mental de la ESO: materias → materias afines → fichas. */
export function buildAfinidadesTree(ctx: AfinidadesTreeContext): MindmapNode {
  return {
    ...base('root', 'root', ctx.rootBadge, ctx.rootLabel, NEUTRAL_COLOR),
    expanded: true,
    children: ctx.data.materias.map((m) => materiaNode(m, ctx)),
  };
}

function base(id: string, kind: MindmapNode['kind'], badge: string, label: string, color: string) {
  return {
    id,
    kind,
    badge,
    label,
    color,
    expandable: false,
    expanded: false,
    searchText: '',
    relationTypes: [],
    children: [] as MindmapNode[],
  };
}

function materiaNode(m: MateriaAfinidades, ctx: AfinidadesTreeContext): MindmapNode {
  const fichas = fichasDe(ctx.data, m.code);
  const expanded = ctx.path.moduleCode === m.code;
  return {
    ...base(
      `m:${m.code}`,
      'module',
      materiaSigla(m.name_es),
      nombre(m, ctx.isCa),
      colorDe(ctx, m.code),
    ),
    expandable: fichas.length > 0,
    expanded,
    moduleCode: m.code,
    moduleType: m.tipo,
    count: fichas.length,
    children: expanded ? partnerNodes(m.code, fichas, ctx) : [],
  };
}

function partnerNodes(
  materia: string,
  fichas: IndexedFicha[],
  ctx: AfinidadesTreeContext,
): MindmapNode[] {
  const partners = new Map<string, IndexedFicha[]>();
  for (const item of fichas) {
    for (const code of item.ficha.materias.filter((c) => c !== materia)) {
      partners.set(code, [...(partners.get(code) ?? []), item]);
    }
  }
  return [...partners].map(([code, items]) => partnerNode(materia, code, items, ctx));
}

function partnerNode(
  materia: string,
  code: string,
  items: IndexedFicha[],
  ctx: AfinidadesTreeContext,
): MindmapNode {
  const m = ctx.data.materias.find((x) => x.code === code);
  const expanded = ctx.path.groupCode === code;
  const label = m ? nombre(m, ctx.isCa) : code;
  return {
    ...base(
      `g:${materia}:${code}`,
      'group',
      materiaSigla(m?.name_es ?? code),
      label,
      colorDe(ctx, code),
    ),
    expandable: true,
    expanded,
    moduleCode: materia,
    targetModuleCode: code,
    count: items.length,
    children: expanded ? items.map((i) => fichaNode(materia, code, i, ctx)) : [],
  };
}

function fichaNode(
  materia: string,
  partner: string,
  { ficha, index }: IndexedFicha,
  ctx: AfinidadesTreeContext,
): MindmapNode {
  const fuente = ficha.fuentes.find((f) => f.materia === materia) ?? ficha;
  const ambito = ctx.isCa ? fuente.ambito_ca : fuente.ambito_es;
  return {
    ...base(`c:${materia}:${index}`, 'connection', `${index + 1}`, ambito, colorDe(ctx, partner)),
    expanded: ctx.path.connectionIndex === index,
    moduleCode: materia,
    targetModuleCode: partner,
    connectionIndex: index,
  };
}

/** Fichas en las que participa la materia, con su índice en el curso. */
function fichasDe(data: AfinidadesCurso, materia: string): IndexedFicha[] {
  return data.afinidades
    .map((ficha, index) => ({ ficha, index }))
    .filter(({ ficha }) => ficha.materias.includes(materia));
}

function nombre(m: MateriaAfinidades, isCa: boolean): string {
  return isCa ? m.name_ca : m.name_es;
}

function colorDe(ctx: AfinidadesTreeContext, code: string): string {
  const index = ctx.data.materias.findIndex((m) => m.code === code);
  return PALETTE[Math.max(index, 0) % PALETTE.length]!;
}

/** Ficha elegida y materia desde la que se consulta, o `null` si no hay ninguna. */
export function findSelectedFicha(
  data: AfinidadesCurso | null,
  path: MindmapPath,
): { ficha: AfinidadEso; materia: string } | null {
  if (!data || path.connectionIndex === null) return null;
  const ficha = data.afinidades[path.connectionIndex];
  return ficha ? { ficha, materia: path.moduleCode } : null;
}

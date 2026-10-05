import { MapaTabInfo } from '../../../services/niveles.service';

/** Identificador de una pestaña del mapa intermodular (declarada en el catálogo de niveles). */
export type MapaTab = string;

/** Curso abreviado para los botones y el nombre de la pestaña: «1.º» / «1r». */
const CURSO_CORTO: Record<string, { es: string; ca: string }> = {
  '1º': { es: '1.º', ca: '1r' },
  '2º': { es: '2.º', ca: '2n' },
  '3º': { es: '3.º', ca: '3r' },
  '4º': { es: '4.º', ca: '4t' },
};

/** Curso como ordinal delante de «curso»/«curs»: «1.er curso» / «1r curs». */
const CURSO_ORDINAL_ES: Record<string, string> = { '1º': '1.er', '3º': '3.er' };

export function cursoCorto(curso: string, isCa: boolean): string {
  return CURSO_CORTO[curso]?.[isCa ? 'ca' : 'es'] ?? curso;
}

/** «1.er curso» / «2n curs». */
export function cursoLargo(curso: string, isCa: boolean): string {
  if (isCa) return `${cursoCorto(curso, true)} curs`;
  return `${CURSO_ORDINAL_ES[curso] ?? cursoCorto(curso, false)} curso`;
}

/** Nombre del ciclo de la pestaña, sin curso. */
export function mapaCicloLabel(tab: MapaTabInfo, isCa: boolean): string {
  return isCa ? tab.nivel.nombre_ca : tab.nivel.nombre_es;
}

/** Nombre de la pestaña: ciclo y, si el mapa es de un curso, el curso («… 2n»). */
export function mapaTabLabel(tab: MapaTabInfo | undefined, isCa: boolean): string {
  if (!tab) return '';
  const ciclo = mapaCicloLabel(tab, isCa);
  return tab.curso ? `${ciclo} ${isCa ? cursoCorto(tab.curso, true) : tab.curso}` : ciclo;
}

import type { CompetenceType } from '../models/mapa-intermodular.model';

const RELATION_LABELS: Record<CompetenceType, { es: string; ca: string }> = {
  ciencias: { es: 'Ciencias Aplicadas', ca: 'Ciències Aplicades' },
  comunicacion: { es: 'Comunicación', ca: 'Comunicació' },
  empleabilidad: { es: 'Empleabilidad / FOL', ca: 'Ocupabilitat / FOL' },
  cliente: { es: 'Atención al Cliente', ca: 'Atenció al Client' },
  sostenibilidad: { es: 'Sostenibilidad', ca: 'Sostenibilitat' },
  digital: { es: 'Digital / Redes', ca: 'Digital / Xarxes' },
  tecnica: { es: 'Técnica Práctica', ca: 'Tècnica Pràctica' },
};

/** Color de cada tipo de competencia: el mismo tono que el texto de sus etiquetas `tag-*`. */
export const RELATION_COLORS: Record<CompetenceType, string> = {
  ciencias: '#1e40af',
  comunicacion: '#166534',
  empleabilidad: '#991b1b',
  cliente: '#92400e',
  sostenibilidad: '#065f46',
  digital: '#6b21a8',
  tecnica: '#075985',
};

/** Tipos de competencia en el orden de la leyenda. */
export const RELATION_TYPES = Object.keys(RELATION_LABELS) as CompetenceType[];

/** Nombre del tipo de competencia en el idioma activo (o el propio código si es desconocido). */
export function relationLabel(type: string, isCa: boolean): string {
  const labels = RELATION_LABELS[type as CompetenceType];
  return labels ? labels[isCa ? 'ca' : 'es'] : type;
}

/** Color del tipo de competencia, con gris neutro para tipos desconocidos. */
export function relationColor(type: string): string {
  return RELATION_COLORS[type as CompetenceType] ?? '#6b7280';
}

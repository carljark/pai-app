/**
 * Esqueleto de un proyecto para generarlo por partes: una primera llamada a la IA diseña las fases,
 * actividades y anexos, y todas las partes posteriores lo reciben para mantener títulos y numeración.
 */
export interface OutlineActivity {
  numero: number;
  titulo: string;
  resumen?: string;
}

export interface OutlinePhase {
  numero: number;
  titulo: string;
  sesiones?: string;
  ras?: string[];
  actividades: OutlineActivity[];
}

export interface OutlineAnnex {
  numero: number;
  titulo: string;
  actividad?: number;
}

export interface ProjectOutline {
  titulo: string;
  productoFinal?: string;
  fases: OutlinePhase[];
  anexos: OutlineAnnex[];
}

export const MAX_OUTLINE_PHASES = 8;
export const MAX_OUTLINE_ANNEXES = 24;

export const OUTLINE_MARKER = '--- PRIMER PASO: ESQUELETO DEL PROYECTO ---';

export const buildOutlinePrompt = (userPrompt: string): string => `${userPrompt}

${OUTLINE_MARKER}
El proyecto se redactará por partes en llamadas independientes. En esta llamada NO redactes el proyecto: diseña solo su esqueleto, que compartirán todas las partes.
Devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional ni bloques de código, con esta forma:
{"titulo": "...", "productoFinal": "...", "fases": [{"numero": 1, "titulo": "...", "sesiones": "...", "ras": ["RA2 del módulo 0843"], "actividades": [{"numero": 1, "titulo": "...", "resumen": "..."}]}], "anexos": [{"numero": 1, "titulo": "...", "actividad": 1}]}
- Entre 3 y 6 fases; numera las actividades de forma correlativa en todo el proyecto.
- Reparte entre las fases TODOS los RA/CE seleccionados, citándolos con su número oficial.
- Prevé un anexo imprimible por cada material que necesiten las actividades (entre 4 y 16), numerados correlativamente e indicando su actividad.
- Escribe los títulos y resúmenes en el idioma del proyecto.`;

const toNumber = (value: unknown, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : fallback;
};

const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const parseActivity = (raw: any, index: number): OutlineActivity | null => {
  const titulo = toText(raw?.titulo);
  if (!titulo) return null;
  const resumen = toText(raw?.resumen);
  return { numero: toNumber(raw?.numero, index + 1), titulo, ...(resumen ? { resumen } : {}) };
};

const parsePhase = (raw: any, index: number): OutlinePhase | null => {
  const titulo = toText(raw?.titulo);
  const actividades = (Array.isArray(raw?.actividades) ? raw.actividades : [])
    .map(parseActivity)
    .filter((a: OutlineActivity | null): a is OutlineActivity => a !== null);
  if (!titulo || actividades.length === 0) return null;
  const sesiones = toText(String(raw?.sesiones ?? ''));
  const ras = Array.isArray(raw?.ras) ? raw.ras.map(toText).filter(Boolean) : [];
  return { numero: toNumber(raw?.numero, index + 1), titulo, actividades, ...(sesiones ? { sesiones } : {}), ...(ras.length ? { ras } : {}) };
};

const parseAnnex = (raw: any, index: number): OutlineAnnex | null => {
  const titulo = toText(raw?.titulo);
  if (!titulo) return null;
  const actividad = Number(raw?.actividad);
  return { numero: toNumber(raw?.numero, index + 1), titulo, ...(Number.isFinite(actividad) && actividad > 0 ? { actividad } : {}) };
};

const extractJson = (text: string): any => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
};

/** Esqueleto validado, o `null` si la respuesta no sirve (entonces se genera en una sola llamada). */
export const parseOutline = (text: string | null | undefined): ProjectOutline | null => {
  const raw = extractJson(text || '');
  const titulo = toText(raw?.titulo);
  const fases = (Array.isArray(raw?.fases) ? raw.fases : [])
    .map(parsePhase)
    .filter((p: OutlinePhase | null): p is OutlinePhase => p !== null)
    .slice(0, MAX_OUTLINE_PHASES);
  if (!titulo || fases.length === 0) return null;
  const anexos = (Array.isArray(raw?.anexos) ? raw.anexos : [])
    .map(parseAnnex)
    .filter((a: OutlineAnnex | null): a is OutlineAnnex => a !== null)
    .slice(0, MAX_OUTLINE_ANNEXES);
  const productoFinal = toText(raw?.productoFinal);
  return { titulo, fases, anexos, ...(productoFinal ? { productoFinal } : {}) };
};

const renderPhase = (phase: OutlinePhase): string[] => {
  const extras = [phase.sesiones ? `sesiones: ${phase.sesiones}` : '', phase.ras?.length ? `RA/CE: ${phase.ras.join(', ')}` : ''].filter(Boolean).join(' — ');
  const header = `Fase ${phase.numero}. ${phase.titulo}${extras ? ` (${extras})` : ''}`;
  const activities = phase.actividades.map(a => `  - Actividad ${a.numero}. ${a.titulo}${a.resumen ? `: ${a.resumen}` : ''}`);
  return [header, ...activities];
};

/** Esqueleto en texto plano para incluirlo en el prompt de cada parte. */
export const renderOutline = (outline: ProjectOutline): string => {
  const annexes = outline.anexos.map(a => `  - Anexo ${a.numero}. ${a.titulo}${a.actividad ? ` (actividad ${a.actividad})` : ''}`);
  return [
    `Título: ${outline.titulo}`,
    ...(outline.productoFinal ? [`Producto final: ${outline.productoFinal}`] : []),
    ...outline.fases.flatMap(renderPhase),
    ...(annexes.length ? ['Anexos previstos:', ...annexes] : [])
  ].join('\n');
};

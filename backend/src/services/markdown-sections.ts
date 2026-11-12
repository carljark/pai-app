/** Localizar y sustituir apartados (encabezado + contenido) de un documento Markdown. */

/** Apartado: líneas `[start, end)` del documento, nivel de su encabezado y el encabezado. */
export interface SectionRange {
  start: number;
  end: number;
  level: number;
  heading: string;
}

const HEADING = /^(#{1,6})\s+(.*)$/;

/** Texto comparable de un encabezado: sin tildes, mayúsculas, numeración inicial ni marcas de formato. */
export const normalizeHeading = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .replace(/^[\s\d.)\-–:]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Encabezados del documento con su línea, nivel y texto normalizado (fuera de bloques de código). */
const headingsOf = (lines: string[]) => {
  const headings: Array<{ line: number; level: number; text: string; normalized: string }> = [];
  let inCode = false;
  lines.forEach((line, index) => {
    if (line.trimStart().startsWith('```')) inCode = !inCode;
    const match = inCode ? null : line.match(HEADING);
    if (match) headings.push({ line: index, level: match[1]!.length, text: match[2]!, normalized: normalizeHeading(match[2]!) });
  });
  return headings;
};

/** 3: coincide exactamente; 2: el encabezado contiene lo buscado; 1: lo buscado contiene el encabezado; 0: nada. */
const matchScore = (normalized: string, needle: string): number => {
  if (!normalized) return 0;
  if (normalized === needle) return 3;
  if (normalized.includes(needle)) return 2;
  return normalized.length >= 4 && needle.includes(normalized) ? 1 : 0;
};

/**
 * Apartado cuyo encabezado corresponde a `heading` (sin tildes, mayúsculas ni numeración). Gana la
 * coincidencia más exacta y, a igualdad, el encabezado más profundo (el más específico) y el primero.
 */
export const findSection = (text: string, heading: string): SectionRange | null => {
  const needle = normalizeHeading(heading);
  if (!needle) return null;
  const lines = text.split('\n');
  const headings = headingsOf(lines);
  let best: (typeof headings)[number] | null = null;
  let bestScore = 0;
  for (const h of headings) {
    const score = matchScore(h.normalized, needle);
    if (score > bestScore || (score === bestScore && score > 0 && h.level > best!.level)) {
      best = h;
      bestScore = score;
    }
  }
  if (!best) return null;
  const next = headings.find((h) => h.line > best!.line && h.level <= best!.level);
  return { start: best.line, end: next ? next.line : lines.length, level: best.level, heading: best.text };
};

export const sectionText = (text: string, range: SectionRange): string =>
  text.split('\n').slice(range.start, range.end).join('\n');

/** Documento con el apartado sustituido; deja una línea en blanco antes del encabezado siguiente. */
export const replaceSection = (text: string, range: SectionRange, newSection: string): string => {
  const lines = text.split('\n');
  const replacement = newSection.replace(/\s+$/, '').split('\n');
  const separator = range.end < lines.length ? [''] : [];
  return [...lines.slice(0, range.start), ...replacement, ...separator, ...lines.slice(range.end)].join('\n');
};

/** Texto del apartado que corresponde a `heading`, o `null` si no hay ninguno. */
export const extractSection = (text: string, heading: string): string | null => {
  const range = findSection(text, heading);
  return range ? sectionText(text, range) : null;
};

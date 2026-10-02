import { RA } from '../models/RA';
import { CE } from '../models/CE';
import { CONTENT_LANGUAGES, type ContentLanguage } from '../models/Project';
import { generateAiContentWithFallback } from './ai.service';

/** Tamaño máximo (caracteres) de cada sección enviada a la IA. */
export const MAX_TRANSLATION_SECTION_CHARS = 6000;
/** Máximo de pares del glosario curricular incluidos en cada petición. */
export const MAX_GLOSSARY_ENTRIES = 60;

const LANGUAGE_NAMES: Record<ContentLanguage, string> = {
  castellano: 'castellano (español de España)',
  catalan: 'catalán (variante balear, normativa del IEC)'
};

const CATALAN_MARKERS = [' els ', ' les ', ' amb ', ' per a ', ' aquest', ' què ', ' l\'', ' d\'', ' també ', ' alumnat '];
const SPANISH_MARKERS = [' los ', ' las ', ' con ', ' para ', ' este ', ' qué ', ' del ', ' también ', ' alumnado ', ' y '];

export const isContentLanguage = (value: unknown): value is ContentLanguage =>
  typeof value === 'string' && (CONTENT_LANGUAGES as readonly string[]).includes(value);

/** Idioma del proyecto; los anteriores a la migración 12 se consideran en castellano. */
export const projectLanguage = (project: { language?: string | null }): ContentLanguage =>
  isContentLanguage(project.language) ? project.language : 'castellano';

const countMarkers = (text: string, markers: string[]): number =>
  markers.reduce((total, marker) => total + text.split(marker).length - 1, 0);

/** Heurística por palabras frecuentes para clasificar textos ya generados. */
export const detectContentLanguage = (text: string | null | undefined): ContentLanguage => {
  const sample = ` ${(text || '').toLowerCase().slice(0, 20000)} `;
  return countMarkers(sample, CATALAN_MARKERS) > countMarkers(sample, SPANISH_MARKERS) ? 'catalan' : 'castellano';
};

/** Divide un bloque demasiado largo por párrafos. */
const splitByParagraphs = (block: string, maxChars: number): string[] => {
  const parts: string[] = [];
  let current = '';
  for (const paragraph of block.split(/\n{2,}/)) {
    if (current && current.length + paragraph.length + 2 > maxChars) {
      parts.push(current);
      current = '';
    }
    current = current ? `${current}\n\n${paragraph}` : paragraph;
  }
  return current ? [...parts, current] : parts;
};

/** Bloques que empiezan en cada encabezado de nivel 1 a 3. */
const splitByHeadings = (text: string): string[] => {
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of text.split('\n')) {
    if (/^#{1,3}\s/.test(line) && current.length > 0) {
      blocks.push(current.join('\n'));
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) blocks.push(current.join('\n'));
  return blocks;
};

/**
 * Trocea el Markdown en secciones de como mucho `maxChars` caracteres, cortando por
 * encabezados y, si un apartado es mayor, por párrafos. Así cada petición a la IA es acotada.
 */
export const splitMarkdownSections = (text: string, maxChars = MAX_TRANSLATION_SECTION_CHARS): string[] => {
  const blocks = splitByHeadings(text).flatMap(block =>
    block.length > maxChars ? splitByParagraphs(block, maxChars) : [block]
  );
  const sections: string[] = [];
  let current = '';
  for (const block of blocks) {
    if (current && current.length + block.length + 1 > maxChars) {
      sections.push(current);
      current = '';
    }
    current = current ? `${current}\n${block}` : block;
  }
  return current.trim() ? [...sections, current] : sections;
};

type GlossaryDoc = Record<string, unknown>;

const fieldFor = (language: ContentLanguage, base: string) => `${base}_${language === 'catalan' ? 'ca' : 'es'}`;

/** Pares "origen → destino" de un documento (descripción y nombre de módulo). */
const glossaryPairs = (doc: GlossaryDoc, source: ContentLanguage, target: ContentLanguage): string[] =>
  ['description', 'module'].flatMap(base => {
    const from = doc[fieldFor(source, base)];
    const to = doc[fieldFor(target, base)];
    return typeof from === 'string' && typeof to === 'string' && from && to && from !== to
      ? [`- "${from}" → "${to}"`]
      : [];
  });

/**
 * Glosario con las denominaciones oficiales (BOE / CAIB) de los RAs y CEs del proyecto,
 * para que la traducción use la terminología curricular oficial y no una traducción libre.
 */
export const buildCurriculumGlossary = async (
  selections: string[],
  source: ContentLanguage,
  target: ContentLanguage
): Promise<string> => {
  if (selections.length === 0) return '';
  const query = { $or: [{ description: { $in: selections } }, { description_es: { $in: selections } }, { description_ca: { $in: selections } }] };
  const [ras, ces] = await Promise.all([RA.find(query).lean(), CE.find({ $or: query.$or.slice(1) }).lean()]);
  const pairs = [...ras, ...ces].flatMap(doc => glossaryPairs(doc as GlossaryDoc, source, target));
  return Array.from(new Set(pairs)).slice(0, MAX_GLOSSARY_ENTRIES).join('\n');
};

export const buildTranslationPrompt = (
  section: string,
  source: ContentLanguage,
  target: ContentLanguage,
  glossary: string
): { prompt: string; system: string } => {
  const glossaryBlock = glossary
    ? `\nUsa EXACTAMENTE estas denominaciones oficiales cuando aparezcan (origen → destino):\n${glossary}\n`
    : '';
  const prompt = `Traduce del ${LANGUAGE_NAMES[source]} al ${LANGUAGE_NAMES[target]} el siguiente fragmento de un proyecto educativo en Markdown.
- Conserva exactamente la estructura Markdown: encabezados, listas, tablas, negritas y enlaces.
- No añadas, resumas ni omitas contenido, y no traduzcas códigos de módulo ni identificadores (p. ej. "3060", "RA2", "a)").
- Devuelve solo el fragmento traducido, sin comentarios ni bloques de código.
${glossaryBlock}
--- FRAGMENTO ---
${section}`;
  const system = 'Eres un traductor profesional especializado en documentación curricular de Formación Profesional en España y las Illes Balears.';
  return { prompt, system };
};

const stripCodeFences = (text: string): string =>
  (text || '').trim().replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/i, '');

export interface TranslationOptions {
  source: ContentLanguage;
  target: ContentLanguage;
  glossary: string;
  provider: 'gemini' | 'openrouter';
  model?: string;
}

/** Traduce el Markdown sección a sección, en orden, con el mismo motor y fallback que la generación. */
export const translateMarkdown = async (text: string, options: TranslationOptions): Promise<string> => {
  const translated: string[] = [];
  for (const section of splitMarkdownSections(text)) {
    const { prompt, system } = buildTranslationPrompt(section, options.source, options.target, options.glossary);
    const result = await generateAiContentWithFallback(prompt, system, options.provider, undefined, options.model);
    translated.push(stripCodeFences(result.text));
  }
  return translated.join('\n\n');
};

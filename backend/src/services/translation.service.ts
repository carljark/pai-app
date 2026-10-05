import { RA } from '../models/RA';
import { CE } from '../models/CE';
import { CONTENT_LANGUAGES, type ContentLanguage } from '../models/Project';
import { generateAiContentWithFallback } from './ai.service';
import { ESO_ORDINARIA, parseEsoSelection } from './eso-curriculum.service';

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

/** Pares "origen → destino" de un documento (descripción y nombre de módulo o materia). */
const glossaryPairs = (doc: GlossaryDoc, source: ContentLanguage, target: ContentLanguage): string[] =>
  ['description', 'module', 'subject'].flatMap(base => {
    const from = doc[fieldFor(source, base)];
    const to = doc[fieldFor(target, base)];
    return typeof from === 'string' && typeof to === 'string' && from && to && from !== to
      ? [`- "${from}" → "${to}"`]
      : [];
  });

/** CE de la ESO ordinaria seleccionadas como «Materia · CEn. Descripción». */
const findEsoGlossaryCes = async (selections: string[]) => {
  const parsed = selections.map(parseEsoSelection).filter(p => p !== null);
  if (parsed.length === 0) return [];
  return CE.find({
    tipoNivel: ESO_ORDINARIA,
    $or: parsed.map(p => ({ ce_num: p.ceNum, $or: [{ subject_es: p.subject }, { subject_ca: p.subject }] }))
  }).lean();
};

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
  const [ras, ces, esoCes] = await Promise.all([
    RA.find(query).lean(), CE.find({ $or: query.$or.slice(1) }).lean(), findEsoGlossaryCes(selections)
  ]);
  const pairs = [...ras, ...ces, ...esoCes].flatMap(doc => glossaryPairs(doc as GlossaryDoc, source, target));
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

/** Nº de secciones que se traducen a la vez. */
export const TRANSLATION_CONCURRENCY = 3;

/** Proveedor y modelo que usarán las siguientes secciones (cambia si entra el respaldo). */
interface TranslationRun {
  provider: 'gemini' | 'openrouter';
  model?: string;
  failed: boolean;
}

const translateSection = async (section: string, options: TranslationOptions, run: TranslationRun) => {
  const { prompt, system } = buildTranslationPrompt(section, options.source, options.target, options.glossary);
  // Sin razonamiento: en una traducción no aporta y multiplica el tiempo de respuesta
  const result = await generateAiContentWithFallback(prompt, system, run.provider, undefined, run.model, {
    reasoning: false
  });
  // Respaldo "pegajoso": si el proveedor o el modelo preferido fallaron, las secciones siguientes
  // van directamente al que ha respondido en lugar de volver a esperar al que falla
  run.provider = result.provider;
  if (result.requestedModel) run.model = result.requestedModel;
  else delete run.model;
  return stripCodeFences(result.text);
};

/**
 * Traduce el Markdown por secciones, `TRANSLATION_CONCURRENCY` a la vez, con el mismo motor y
 * fallback que la generación, y las une en su orden original. Si una sección falla no se lanzan más.
 */
export const translateMarkdown = async (text: string, options: TranslationOptions): Promise<string> => {
  const sections = splitMarkdownSections(text);
  const translated: string[] = new Array(sections.length);
  const run: TranslationRun = { provider: options.provider, ...(options.model ? { model: options.model } : {}), failed: false };
  let next = 0;
  const worker = async () => {
    while (next < sections.length && !run.failed) {
      const index = next++;
      try {
        translated[index] = await translateSection(sections[index]!, options, run);
      } catch (error) {
        run.failed = true;
        throw error;
      }
    }
  };
  const workers = Math.min(TRANSLATION_CONCURRENCY, sections.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return translated.join('\n\n');
};

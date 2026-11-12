import type { ContentLanguage } from '../models/Project';
import { generateAiContentWithFallback } from './ai.service';
import { findNivel } from '../data/niveles';

/**
 * Aspectos que valora la revisión con IA. Los ids son estables: el frontend muestra sus nombres
 * desde las traducciones de la interfaz, nunca desde el texto de la IA.
 */
export const REVIEW_DIMENSIONS = [
  'curricularAlignment',
  'coherence',
  'drivingQuestion',
  'activities',
  'assessment',
  'integration',
  'inclusion',
  'timing',
  'clarity'
] as const;
export type ReviewDimensionId = (typeof REVIEW_DIMENSIONS)[number];

export const MIN_REVIEW_SCORE = 1;
export const MAX_REVIEW_SCORE = 5;
/** Sugerencias por aspecto que se conservan como máximo. */
export const MAX_REVIEW_SUGGESTIONS = 4;

/** Qué se valora en cada aspecto (texto para la IA). */
const DIMENSION_CRITERIA: Record<ReviewDimensionId, string> = {
  curricularAlignment: 'Alineación curricular: los RA/CE o criterios seleccionados aparecen con su numeración oficial, se trabajan de verdad en las actividades y se evalúan.',
  coherence: 'Coherencia: las fases, sesiones y actividades siguen un hilo lógico que conduce al producto final.',
  drivingQuestion: 'Pregunta motriz y producto final: son auténticos, conectados con el entorno real y motivadores para el alumnado.',
  activities: 'Actividades: suponen un reto adecuado al nivel educativo, son concretas y realizables en el aula.',
  assessment: 'Evaluación: instrumentos, criterios de calificación y rúbricas coherentes con los RA/CE y con las actividades.',
  integration: 'Integración: conexión real entre módulos o materias (intermodularidad o interdisciplinariedad), no una mera yuxtaposición.',
  inclusion: 'Inclusión: medidas de Diseño Universal para el Aprendizaje (DUA) y atención a la diversidad concretas y aplicables.',
  timing: 'Temporización: sesiones y duración realistas para el contenido y el curso.',
  clarity: 'Claridad: redacción precisa, estructura ordenada y formato utilizable por otro docente.'
};

/** Qué valora un aspecto (texto para la IA); vacío si el id no existe. */
export const dimensionCriterion = (id: string): string => DIMENSION_CRITERIA[id as ReviewDimensionId] ?? '';

const LANGUAGE_NAMES: Record<ContentLanguage, string> = {
  castellano: 'castellano (español de España)',
  catalan: 'catalán (variante balear, normativa del IEC)'
};

export interface ReviewDimension {
  id: ReviewDimensionId;
  score: number;
  justification: string;
  suggestions: string[];
  section?: string;
}

export interface ParsedReview {
  overall: number;
  summary: string;
  dimensions: ReviewDimension[];
}

/** Datos del proyecto que necesita el prompt de revisión. */
export interface ReviewableProject {
  title?: string | null;
  tipoNivel?: string | null;
  courseLevel?: string | null;
  modules?: string[] | null;
  ras?: string[] | null;
  generatedContent?: { rawText?: string | null } | null;
}

const listOrDash = (items: string[] | null | undefined): string =>
  items && items.length > 0 ? items.map(item => `- ${item}`).join('\n') : '- (no indicado)';

/** Nombre oficial del nivel (el prompt va en castellano) o, si no está en el catálogo, su id. */
const levelName = (tipoNivel: string | null | undefined): string =>
  findNivel(tipoNivel)?.nombre_es ?? (tipoNivel || '(no indicado)');

const curriculumContext = (project: ReviewableProject): string =>
  [
    `Título: ${project.title || '(sin título)'}`,
    `Nivel educativo: ${levelName(project.tipoNivel)}${project.courseLevel ? `, curso ${project.courseLevel}` : ''}`,
    `Módulos o materias:\n${listOrDash(project.modules)}`,
    `Resultados de aprendizaje o criterios seleccionados:\n${listOrDash(project.ras)}`
  ].join('\n');

const responseFormat = (): string => {
  const example = REVIEW_DIMENSIONS.map(id => `    { "id": "${id}", "score": 4, "justification": "…", "suggestions": ["…"], "section": "…" }`);
  return `{\n  "summary": "…",\n  "dimensions": [\n${example.join(',\n')}\n  ]\n}`;
};

/** Instrucción de sistema de la revisión, en el idioma en que debe responder la IA. */
export const buildReviewSystem = (language: ContentLanguage): string => `Eres un asesor pedagógico experto en Formación Profesional y ESO en las Illes Balears, con experiencia en aprendizaje basado en proyectos.
Revisas proyectos didácticos de forma crítica, concreta y constructiva: señalas lo que funciona y, sobre todo, qué cambiar y dónde.
Respondes ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después.
Todos los textos del JSON van en ${LANGUAGE_NAMES[language]}.`;

/** Prompt de revisión: contexto curricular, aspectos a valorar, formato de respuesta y el proyecto. */
export const buildReviewPrompt = (project: ReviewableProject): string => `Revisa el proyecto didáctico que aparece al final.

--- CONTEXTO CURRICULAR ---
${curriculumContext(project)}

--- ASPECTOS A VALORAR ---
Puntúa cada aspecto con un número entero de ${MIN_REVIEW_SCORE} (muy deficiente) a ${MAX_REVIEW_SCORE} (excelente):
${REVIEW_DIMENSIONS.map(id => `- "${id}": ${DIMENSION_CRITERIA[id]}`).join('\n')}

--- FORMATO DE RESPUESTA ---
Devuelve exactamente este JSON, con los ${REVIEW_DIMENSIONS.length} aspectos en este orden:
${responseFormat()}
- "summary": valoración global en 2-4 frases.
- "justification": 1-3 frases que justifiquen la nota con referencias concretas al texto.
- "suggestions": de 1 a ${MAX_REVIEW_SUGGESTIONS} mejoras concretas y aplicables (qué cambiar y cómo).
- "section": título del apartado del proyecto al que se refieren sobre todo las sugerencias (opcional).

--- PROYECTO ---
${project.generatedContent?.rawText || ''}`;

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

const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const toSuggestions = (value: unknown): string[] =>
  (Array.isArray(value) ? value : []).map(toText).filter(Boolean).slice(0, MAX_REVIEW_SUGGESTIONS);

const isValidScore = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= MIN_REVIEW_SCORE && (value as number) <= MAX_REVIEW_SCORE;

/** Valoración de un aspecto, o `null` si le falta la nota válida, la justificación o las sugerencias. */
const parseDimension = (raw: any, id: ReviewDimensionId): ReviewDimension | null => {
  const justification = toText(raw?.justification);
  const suggestions = toSuggestions(raw?.suggestions);
  if (!isValidScore(raw?.score) || !justification || suggestions.length === 0) return null;
  const section = toText(raw?.section);
  return { id, score: raw.score, justification, suggestions, ...(section ? { section } : {}) };
};

/** Media de las notas, con un decimal. */
export const overallScore = (dimensions: ReviewDimension[]): number =>
  Math.round((dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length) * 10) / 10;

/** Revisión validada, o `null` si la respuesta no trae todos los aspectos bien formados. */
export const parseReview = (text: string | null | undefined): ParsedReview | null => {
  const raw = extractJson(text || '');
  const summary = toText(raw?.summary);
  const list: any[] = Array.isArray(raw?.dimensions) ? raw.dimensions : [];
  const dimensions = REVIEW_DIMENSIONS.map(id => parseDimension(list.find(d => d?.id === id), id));
  if (!summary || dimensions.some(d => d === null)) return null;
  const valid = dimensions as ReviewDimension[];
  return { overall: overallScore(valid), summary, dimensions: valid };
};

/** Peticiones a la IA como máximo por revisión: la segunda solo si la primera no es un JSON válido. */
export const MAX_REVIEW_ATTEMPTS = 2;

export interface ReviewAiChoice {
  provider: 'gemini' | 'openrouter';
  model?: string;
}

export interface ReviewResult extends ParsedReview {
  usedModel: string;
}

/**
 * Pide la revisión a la IA con la cascada habitual y sin razonamiento (el proyecto ya está diseñado).
 * Si la respuesta no es válida se repite una vez con el proveedor y modelo que respondieron.
 */
export const requestProjectReview = async (
  project: ReviewableProject,
  language: ContentLanguage,
  choice: ReviewAiChoice
): Promise<ReviewResult> => {
  const prompt = buildReviewPrompt(project);
  const system = buildReviewSystem(language);
  let run: ReviewAiChoice = choice;
  for (let attempt = 1; attempt <= MAX_REVIEW_ATTEMPTS; attempt++) {
    const result = await generateAiContentWithFallback(prompt, system, run.provider, undefined, run.model, { reasoning: false });
    const review = parseReview(result.text);
    if (review) return { ...review, usedModel: result.model };
    run = result.requestedModel ? { provider: result.provider, model: result.requestedModel } : { provider: result.provider };
  }
  throw new Error('La IA no devolvió una revisión válida');
};

import { generateAiContentWithFallback } from './ai.service';
import { dimensionCriterion, type ReviewAiChoice } from './project-review.service';
import { findSection, replaceSection, sectionText, type SectionRange } from './markdown-sections';
import { buildRewritePrompt } from '../controllers/project.controller';

/** Error con el código HTTP que debe devolver el endpoint. */
export class ApplyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Una reescritura completa más corta que esta fracción del original se considera cortada. */
export const MIN_FULL_REWRITE_RATIO = 0.5;

export interface SelectedSuggestions {
  dimension: any;
  /** Sugerencias que se aplican, con su índice en el aspecto. */
  suggestions: Array<{ index: number; text: string }>;
}

/** Clave con la que se marca una sugerencia aplicada (`review.applied`). */
export const suggestionKey = (dimension: string, index: number): string => `${dimension}:${index}`;

/** Una sugerencia concreta o, sin `index`, todas las pendientes del aspecto. */
export const selectSuggestions = (review: any, dimensionId: string, index?: number): SelectedSuggestions => {
  if (review?.status !== 'completada') throw new ApplyError(400, 'El proyecto no tiene una revisión completada');
  const dimension = (review.dimensions || []).find((d: any) => d.id === dimensionId);
  if (!dimension) throw new ApplyError(400, 'Ese aspecto no está en la revisión');
  const all: Array<{ index: number; text: string }> = (dimension.suggestions || []).map((text: string, i: number) => ({ index: i, text }));
  if (index !== undefined) {
    const one = all.find((s) => s.index === index);
    if (!one) throw new ApplyError(400, 'Esa sugerencia no está en la revisión');
    return { dimension, suggestions: [one] };
  }
  const applied: string[] = review.applied || [];
  const pending = all.filter((s) => !applied.includes(suggestionKey(dimensionId, s.index)));
  if (pending.length === 0) throw new ApplyError(400, 'No quedan sugerencias pendientes en este aspecto');
  return { dimension, suggestions: pending };
};

/** Instrucción para la IA a partir de las sugerencias y de la valoración del aspecto. */
export const buildApplyInstruction = ({ dimension, suggestions }: SelectedSuggestions): string =>
  [
    `Aplica estas mejoras propuestas por la revisión pedagógica del proyecto (${dimensionCriterion(dimension.id) || dimension.id}):`,
    ...suggestions.map((s) => `- ${s.text}`),
    `Valoración de la revisión: ${dimension.justification || ''}`
  ].join('\n');

/** Prompt para reescribir un único apartado, que debe volver completo y con su mismo encabezado. */
export const buildSectionPrompt = (section: string, instruction: string): string => `Eres el Motor Pedagógico PAI. El profesor quiere mejorar un apartado de su proyecto didáctico.

APARTADO ACTUAL (MARKDOWN):
"""
${section}
"""

MEJORAS QUE HAY QUE APLICAR:
"""
${instruction}
"""

TAREA:
Reescribe el apartado aplicando las mejoras de forma concreta y coherente, y conserva todo lo que no tengan que cambiar.

REGLAS ESTRICTAS:
- Devuelve ÚNICAMENTE el apartado completo reescrito, empezando por su misma línea de encabezado: «${section.split('\n')[0]}».
- No escribas nada de otros apartados ni expliques los cambios.
- Escribe en el mismo idioma que el apartado actual y conserva la numeración oficial de RA, CE y criterios.
- Sin saludos ni bloques de código envolventes (\`\`\`). Markdown estándar, sin LaTeX ni el símbolo $.`;

const stripCodeFences = (text: string): string =>
  (text || '').trim().replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/i, '').trim();

/** El apartado devuelto es válido si empieza por un encabezado del mismo nivel y tiene contenido. */
export const validSection = (text: string, level: number): boolean => {
  const [first, ...rest] = text.split('\n');
  return new RegExp(`^#{${level}}\\s+\\S`).test(first || '') && rest.join('\n').trim().length > 0;
};

export interface ApplyResult {
  newText: string;
  /** Encabezado del apartado reescrito, o `null` si se reescribió el documento completo. */
  section: string | null;
  usedModel: string;
}

const askAi = (prompt: string, choice: ReviewAiChoice) =>
  generateAiContentWithFallback(prompt, 'Eres un asistente pedagógico de edición curricular experto, directo y preciso.', choice.provider, undefined, choice.model, { reasoning: false });

const rewriteSection = async (context: string, range: SectionRange, instruction: string, choice: ReviewAiChoice): Promise<ApplyResult> => {
  const result = await askAi(buildSectionPrompt(sectionText(context, range), instruction), choice);
  const section = stripCodeFences(result.text);
  if (!validSection(section, range.level)) throw new ApplyError(502, 'No se pudo aplicar la sugerencia: la IA no devolvió el apartado completo');
  return { newText: replaceSection(context, range, section), section: range.heading, usedModel: result.model };
};

const rewriteDocument = async (context: string, instruction: string, choice: ReviewAiChoice): Promise<ApplyResult> => {
  const result = await askAi(buildRewritePrompt(context, instruction), choice);
  const newText = stripCodeFences(result.text);
  if (newText.length < context.length * MIN_FULL_REWRITE_RATIO) {
    throw new ApplyError(502, 'No se pudo aplicar la sugerencia: la respuesta de la IA llegó incompleta');
  }
  return { newText, section: null, usedModel: result.model };
};

/**
 * Aplica las sugerencias sobre el texto que se está editando: reescribe solo el apartado que indica la
 * revisión y, si no se encuentra, el documento completo (como el asistente del taller).
 */
export const applySuggestions = async (context: string, selected: SelectedSuggestions, choice: ReviewAiChoice): Promise<ApplyResult> => {
  const instruction = buildApplyInstruction(selected);
  const range = selected.dimension.section ? findSection(context, selected.dimension.section) : null;
  return range ? rewriteSection(context, range, instruction, choice) : rewriteDocument(context, instruction, choice);
};

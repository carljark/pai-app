import { generateAiContentWithFallback, type AiGenerationResult, type PhaseCallback } from './ai.service';
import { buildOutlinePrompt, parseOutline, renderOutline, type OutlinePhase, type ProjectOutline } from './project-outline';

/**
 * Generación de proyectos por partes: un esqueleto común y después cada parte (inicio, fases,
 * evaluación, cierre y anexos) en llamadas paralelas, para que ninguna respuesta se acerque al
 * límite de salida del modelo. Ver documentation/generacion_proyectos_por_partes.md.
 */

/** Partes que se generan a la vez. */
export const SECTION_CONCURRENCY = 4;
/** Anexos que redacta cada llamada. */
export const ANNEXES_PER_PART = 4;
/** Las partes redactan sobre un esqueleto ya diseñado (con razonamiento): sin razonamiento son mucho más rápidas. */
export const SECTION_REASONING = false;

export const isSectionedGenerationEnabled = (): boolean => process.env.SECTIONED_GENERATION !== 'false';

export interface ProjectPart {
  key: string;
  /** Encabezado que se inserta antes del texto de la parte (p. ej. el apartado que agrupa las fases). */
  prefix?: string;
  task: string;
}

export interface SectionedGenerationInput {
  prompt: string;
  instruction: string;
  provider: 'gemini' | 'openrouter';
  model?: string;
  language?: string;
  onPhaseChange?: PhaseCallback;
}

const LABELS = {
  castellano: { phases: 'Desarrollo de las fases y actividades', annexes: 'Anexos', activity: 'Actividad', annex: 'Anexo' },
  catalan: { phases: 'Desenvolupament de les fases i activitats', annexes: 'Annexos', activity: 'Activitat', annex: 'Annex' }
};

const labelsFor = (language?: string) => (language === 'catalan' ? LABELS.catalan : LABELS.castellano);

const introPart = (outline: ProjectOutline): ProjectPart => ({
  key: 'inicio',
  task: `el comienzo del proyecto: el título "${outline.titulo}" como encabezado de nivel 1 (#) y, como apartados de nivel 2 (##), "Identidad del Proyecto", justificación y contextualización, pregunta motriz y producto final, elementos curriculares (todos los RA/CE seleccionados con su número oficial y sus criterios de evaluación literales), objetivos didácticos, metodología y temporización general con el cronograma de las fases.`
});

const phasePart = (phase: OutlinePhase, index: number, language?: string): ProjectPart => {
  const labels = labelsFor(language);
  const activities = phase.actividades.map(a => `"#### ${labels.activity} ${a.numero}. ${a.titulo}"`).join(', ');
  return {
    key: `fase-${phase.numero}`,
    ...(index === 0 ? { prefix: `## ${labels.phases}` } : {}),
    task: `la fase ${phase.numero} completa: empieza por el encabezado "### Fase ${phase.numero}. ${phase.titulo}" y desarrolla cada una de sus actividades como apartado propio (${activities}) con TODA la estructura detallada obligatoria de las instrucciones del sistema. Cuando una actividad necesite material imprimible, remite a su anexo por número (por ejemplo "Material: ${labels.annex} 3") sin desarrollarlo.`
  };
};

const evaluationPart = (): ProjectPart => ({
  key: 'evaluacion',
  task: 'el apartado de evaluación, con un encabezado de nivel 2 (##) en el idioma del proyecto: una tabla que relacione cada RA/CE y sus criterios con las actividades y los instrumentos, la rúbrica global del proyecto, una rúbrica independiente por cada módulo según las reglas del sistema, y los instrumentos de evaluación, autoevaluación y coevaluación.'
});

const closingPart = (): ProjectPart => ({
  key: 'cierre',
  task: 'los apartados finales, con encabezados de nivel 2 (##): la propuesta para la Carpeta de Aprendizaje si las instrucciones del sistema la exigen (FP Básica), la atención a la diversidad (DUA), los recursos y materiales generales y una breve conclusión. No incluyas los anexos.'
});

const annexParts = (outline: ProjectOutline, language?: string): ProjectPart[] => {
  const labels = labelsFor(language);
  const parts: ProjectPart[] = [];
  for (let i = 0; i < outline.anexos.length; i += ANNEXES_PER_PART) {
    const group = outline.anexos.slice(i, i + ANNEXES_PER_PART);
    const headings = group.map(a => `"### ${labels.annex} ${a.numero}. ${a.titulo}"`).join(', ');
    parts.push({
      key: `anexos-${group[0]!.numero}`,
      ...(i === 0 ? { prefix: `## ${labels.annexes}` } : {}),
      task: `estos anexos completos, cada uno con su encabezado (${headings}) e indicando a qué actividad pertenece, con su contenido imprimible íntegro según las reglas del sistema sobre los anexos.`
    });
  }
  return parts;
};

/** Partes del proyecto en el orden en que aparecerán en el documento. */
export const buildProjectParts = (outline: ProjectOutline, language?: string): ProjectPart[] => [
  introPart(outline),
  ...outline.fases.map((phase, index) => phasePart(phase, index, language)),
  evaluationPart(),
  closingPart(),
  ...annexParts(outline, language)
];

export const buildPartPrompt = (userPrompt: string, outlineText: string, part: ProjectPart): string => `${userPrompt}

--- ESQUELETO DEL PROYECTO (común a todas las partes; respeta sus títulos y su numeración) ---
${outlineText}

--- TU PARTE ---
El proyecto se redacta por partes en llamadas independientes que después se unen en un único documento. En esta llamada escribe ÚNICAMENTE ${part.task}
- No escribas contenido de las demás partes: las reglas del sistema sobre ellas las cumplen las otras llamadas.
- No comentes el proceso ni menciones que el documento se escribe por partes.`;

const stripCodeFences = (text: string): string =>
  (text || '').trim().replace(/^```(?:markdown)?\s*/i, '').replace(/\s*```$/i, '');

/** Proveedor y modelo que usan las partes siguientes (respaldo "pegajoso", como en la traducción). */
interface SectionRun {
  provider: 'gemini' | 'openrouter';
  model?: string;
  fallbackUsed: boolean;
  models: string[];
  cascadeLog: string[];
}

const recordResult = (run: SectionRun, key: string, result: AiGenerationResult, elapsedMs: number) => {
  // Si entra el otro proveedor, el modelo elegido ya no le sirve
  if (result.requestedModel) run.model = result.requestedModel;
  else if (result.provider !== run.provider) delete run.model;
  run.provider = result.provider;
  run.fallbackUsed = run.fallbackUsed || result.fallbackUsed;
  if (!run.models.includes(result.model)) run.models.push(result.model);
  run.cascadeLog.push(...(result.cascadeLog || []).map(line => `[${key}] ${line}`), `[${key}] ${elapsedMs} ms`);
};

const generatePart = async (input: SectionedGenerationInput, outlineText: string, part: ProjectPart, run: SectionRun) => {
  const start = Date.now();
  const result = await generateAiContentWithFallback(
    buildPartPrompt(input.prompt, outlineText, part), input.instruction, run.provider, undefined, run.model,
    { reasoning: SECTION_REASONING }
  );
  recordResult(run, part.key, result, Date.now() - start);
  const text = stripCodeFences(result.text);
  return part.prefix ? `${part.prefix}\n\n${text}` : text;
};

/** Ejecuta `task` sobre cada elemento, `limit` a la vez, conservando el orden. Tras un fallo no lanza más. */
export const mapWithConcurrency = async <T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;
  let failed = false;
  const worker = async () => {
    while (next < items.length && !failed) {
      const index = next++;
      try {
        results[index] = await task(items[index]!);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

const toGenerationResult = (texts: string[], run: SectionRun): AiGenerationResult => ({
  text: texts.join('\n\n'),
  provider: run.provider,
  model: run.models.join(' + '),
  fallbackUsed: run.fallbackUsed,
  cascadeLog: run.cascadeLog
});

const generateSingleCall = (input: SectionedGenerationInput) =>
  generateAiContentWithFallback(input.prompt, input.instruction, input.provider, undefined, input.model);

/**
 * Genera el proyecto por partes. Si el esqueleto no es un JSON válido, recurre a la generación en
 * una sola llamada. Un fallo en cualquier parte (tras la cascada de modelos) hace fallar la generación.
 */
export const generateProjectBySections = async (input: SectionedGenerationInput): Promise<AiGenerationResult> => {
  const start = Date.now();
  const outlineResult = await generateAiContentWithFallback(
    buildOutlinePrompt(input.prompt), input.instruction, input.provider, input.onPhaseChange, input.model
  );
  const outline = parseOutline(outlineResult.text);
  if (!outline) {
    console.warn('[Sections] El esqueleto no es un JSON válido: se genera el proyecto en una sola llamada.');
    return generateSingleCall(input);
  }
  const run: SectionRun = {
    provider: input.provider, ...(input.model ? { model: input.model } : {}), fallbackUsed: false, models: [], cascadeLog: []
  };
  recordResult(run, 'esqueleto', outlineResult, Date.now() - start);
  const parts = buildProjectParts(outline, input.language);
  const outlineText = renderOutline(outline);
  const texts = await mapWithConcurrency(parts, SECTION_CONCURRENCY, part => generatePart(input, outlineText, part, run));
  console.log(`[Sections] Proyecto generado en ${parts.length} partes + esqueleto en ${Date.now() - start} ms.`);
  return toGenerationResult(texts, run);
};

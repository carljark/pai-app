import fs from 'fs';
import path from 'path';
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  GEMINI_MODEL_CASCADE,
  GEMINI_MODELS_WITH_THINKING_LEVEL,
  OPENROUTER_MODELS_WITH_REASONING_EFFORT,
  OPENROUTER_MODEL_CASCADE,
  isGeminiEnabled,
  modelFitsProvider,
  resolveProvider
} from '../data/ai-models';
import { NIVELES } from '../data/niveles';

/** Nº máximo de ejemplos de referencia que se inyectan en el prompt. */
export const MAX_INTEF_EXAMPLES = 8;
/** Recorte de cada ejemplo para no saturar el prompt (y evitar 503 del proveedor). */
export const MAX_INTEF_EXAMPLE_CHARS = 1200;
/** Máximo de fichas de aprendizaje-servicio (`kind: 'aps'`) entre los ejemplos inyectados. */
export const MAX_APS_EXAMPLES = 3;

export interface ExampleCriteria {
  tipoNivel?: string;
  courseLevel?: string;
  title?: string;
  modules?: string[];
  ras?: string[];
}

const STOPWORDS = new Set([
  'para', 'con', 'los', 'las', 'una', 'uno', 'del', 'que', 'por', 'como', 'sus', 'este', 'esta', 'son',
  'the', 'and', 'of', 'proyecto', 'proyectos', 'alumnado', 'alumnos', 'actividad', 'actividades',
  'contenido', 'contenidos', 'resultado', 'resultados', 'aprendizaje', 'criterio', 'criterios',
  'modulo', 'modulos', 'trabajo', 'realizar', 'utilizar', 'desarrollo', 'fase', 'fases', 'tarea',
  'tareas', 'sobre', 'entre', 'desde', 'mediante', 'diferentes', 'cada', 'traves', 'sido', 'tiene',
  // Genéricas: aparecen en casi cualquier ficha («conocimientos básicos», «formación profesional»)
  'basica', 'basicas', 'basico', 'basicos', 'formacion', 'profesional', 'profesionales', 'habilidades',
  'conocimientos', 'personas', 'alumnas', 'forma', 'formas', 'manera', 'modo'
]);

function tokenize(text: string): string[] {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

/** Familia profesional de cada nivel (catálogo): los nombres de módulo no siempre la mencionan. */
const LEVEL_KEYWORDS: Record<string, string> = Object.fromEntries(
  NIVELES.filter(n => n.palabrasClave).map(n => [n.id, n.palabrasClave as string])
);

/**
 * Selecciona hasta {@link MAX_INTEF_EXAMPLES} ejemplos, priorizando los más
 * relevantes para el proyecto solicitado según solapamiento de palabras clave
 * con sus módulos, RAs/CEs, título y nivel/curso. Ante empate, prefiere los de
 * contenido más completo.
 */
export const selectRelevantExamples = (examples: any[], criteria: ExampleCriteria = {}): any[] => {
  if (!Array.isArray(examples)) return [];

  const queryTokens = new Set(tokenize([
    criteria.tipoNivel,
    LEVEL_KEYWORDS[criteria.tipoNivel || ''],
    criteria.courseLevel,
    criteria.title,
    ...(criteria.modules || []),
    ...(criteria.ras || [])
  ].filter(Boolean).join(' ')));

  const indexed = examples.map(exampleTokens);
  const idf = inverseDocumentFrequency(indexed, queryTokens);
  const family = new Set(tokenize(LEVEL_KEYWORDS[criteria.tipoNivel || ''] || ''));
  const scored = examples.map((example, index) => ({
    example,
    index,
    score: scoreExample(indexed[index]!, queryTokens, idf, family),
    len: (example?.originalContent || example?.content_sample || '').length
  }));

  scored.sort((a, b) => b.score - a.score || b.len - a.len || a.index - b.index);
  return takeWithApsLimit(scored.map(s => s.example));
};

interface ExampleTokens {
  ras: Set<string>;
  modules: Set<string>;
  base: Set<string>;
}

const exampleTokens = (example: any): ExampleTokens => ({
  ras: new Set(tokenize((example?.ras || []).join(' '))),
  modules: new Set(tokenize((example?.modules || []).join(' '))),
  base: new Set(tokenize([example?.title, example?.description, example?.originalContent].filter(Boolean).join(' ')))
});

/**
 * Peso de cada palabra de la consulta según su rareza en el corpus de ejemplos: una palabra
 * específica («peluquería») cuenta mucho más que una frecuente («forma», «manera»).
 */
const inverseDocumentFrequency = (indexed: ExampleTokens[], queryTokens: Set<string>): Map<string, number> => {
  const idf = new Map<string, number>();
  for (const token of queryTokens) {
    const df = indexed.filter(t => t.ras.has(token) || t.modules.has(token) || t.base.has(token)).length;
    idf.set(token, Math.log(1 + indexed.length / (1 + df)));
  }
  return idf;
};

/**
 * Coincidencias con los RA/CE pesan 3, con los módulos 2 y con el resto del texto 1, multiplicadas por
 * su rareza. La familia profesional del nivel (`family`) pesa 3 aparezca donde aparezca.
 */
const scoreExample = (tokens: ExampleTokens, queryTokens: Set<string>, idf: Map<string, number>, family: Set<string>): number => {
  let score = 0;
  for (const token of queryTokens) {
    const found = tokens.ras.has(token) || tokens.modules.has(token) || tokens.base.has(token);
    const weight = !found ? 0 : family.has(token) || tokens.ras.has(token) ? 3 : tokens.modules.has(token) ? 2 : 1;
    score += weight * (idf.get(token) || 0);
  }
  return score;
};

/**
 * Primeros {@link MAX_INTEF_EXAMPLES} ejemplos con como mucho {@link MAX_APS_EXAMPLES} fichas de
 * aprendizaje-servicio: son resúmenes breves y no deben desplazar a los proyectos completos.
 */
const takeWithApsLimit = (ranked: any[]): any[] => {
  const selected: any[] = [];
  let aps = 0;
  for (const example of ranked) {
    if (selected.length >= MAX_INTEF_EXAMPLES) break;
    if (example?.kind === 'aps') {
      if (aps >= MAX_APS_EXAMPLES) continue;
      aps++;
    }
    selected.push(example);
  }
  return selected;
};

export const buildContexts = (settings: any, criteria: ExampleCriteria = {}) => {
  const schoolContextStr = settings
    ? `\n\n--- CONTEXTO DEL CENTRO EDUCATIVO ---\nNombre: ${settings.schoolName}\nCiudad: ${settings.schoolCity}\nContexto: ${settings.schoolContext}`
    : '';

  let intefExamplesContext = '';
  try {
    const examplesPath = path.join(process.cwd(), 'src/data/intef_examples.json');
    if (fs.existsSync(examplesPath)) {
      const allExamples = JSON.parse(fs.readFileSync(examplesPath, 'utf-8'));
      const selected = selectRelevantExamples(allExamples, criteria);
      if (selected.length > 0) {
        const compact = selected.map(example => ({
          title: example?.title,
          modules: example?.modules,
          ras: example?.ras,
          methodology: example?.methodology,
          originalContent: String(example?.originalContent || example?.content_sample || '').slice(0, MAX_INTEF_EXAMPLE_CHARS),
          ...(example?.kind ? { source: example.source } : {})
        }));
        intefExamplesContext = "\n--- EJEMPLOS DE REFERENCIA: INTEF Y BUENAS PRÁCTICAS DE APRENDIZAJE-SERVICIO (más relevantes) ---\n" + JSON.stringify(compact);
      }
    }
  } catch (e) { console.warn("No se cargaron los ejemplos del INTEF"); }

  return { schoolContextStr, intefExamplesContext };
};

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> => {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(errorMsg);
      err.name = 'TimeoutError';
      reject(err);
    }, timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

export interface SingleAiResult {
  text: string;
  model: string;
  /** Id del catálogo con el que se obtuvo la respuesta (puede diferir del pedido por la cascada). */
  requestedModel?: string;
  cascadeLog?: string[];
}

// Los modelos disponibles se definen en un único lugar: backend/src/data/ai-models.ts
export {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  GEMINI_MODEL_CASCADE,
  OPENROUTER_MODELS_WITH_REASONING_EFFORT
};

export const DEFAULT_REASONING_EFFORT = 'high';

/** Petición a la Interactions API; `thinking_level` solo en modelos con soporte confirmado. */
const buildGeminiInteraction = (model: string, input: string, systemInstruction: string, reasoning = true): any => ({
  model,
  input,
  system_instruction: systemInstruction,
  ...(reasoning && GEMINI_MODELS_WITH_THINKING_LEVEL.has(model)
    ? { generation_config: { thinking_level: 'high' } }
    : {})
});

export const generateGeminiContent = async (
  userPrompt: string,
  systemInstruction: string,
  preferredModel = DEFAULT_GEMINI_MODEL,
  timeoutMs = 1_200_000,
  reasoning = true
): Promise<SingleAiResult> => {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ httpOptions: { timeout: timeoutMs } });
  const modelsToTry = [preferredModel, ...GEMINI_MODEL_CASCADE.filter(m => m !== preferredModel)];
  let lastError: any = null;
  const cascadeLog: string[] = [];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      if (i > 0) {
        console.warn(`[Gemini] Fallback interno: intentando modelo ${modelName} tras error con el anterior.`);
      } else {
        console.log(`[Gemini] Iniciando generación con modelo ${modelName}...`);
      }
      // `generateContent` devuelve 404 a cuentas nuevas en los modelos 3.x: se usa la Interactions API
      const request = ai.interactions.create(buildGeminiInteraction(modelName, userPrompt, systemInstruction, reasoning));
      const response = await withTimeout(request, timeoutMs, `Timeout en Gemini (${modelName}): el proveedor no respondió a tiempo`);
      cascadeLog.push(`${modelName}: OK`);
      return {
        text: response.output_text ?? '',
        model: response.model || modelName,
        cascadeLog
      };
    } catch (err: any) {
      lastError = err;
      const errorMsg = err.status ? `HTTP ${err.status}` : (err.message || 'error');
      cascadeLog.push(`${modelName}: ${errorMsg}`);
      console.warn(`[Gemini] Fallo con modelo ${modelName}:`, err.message || err);
    }
  }

  if (lastError?.name === 'TimeoutError' || lastError?.message?.includes('Timeout en Gemini')) {
    throw Object.assign(new Error('Timeout en Gemini (20m): el proveedor no respondió a tiempo'), { cascadeLog });
  }
  const error = lastError instanceof Error
    ? lastError
    : new Error(String(lastError || 'Fallaron todos los modelos de Gemini'));
  throw Object.assign(error, { cascadeLog });
};

const requestOpenRouterApi = async (apiKey: string, payload: any, timeoutMs = 1_200_000) => {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://plappin.app',
      'X-Title': 'Plappin'
    },
    body: JSON.stringify(payload)
  });
};

const parseOpenRouterResponse = async (response: Response, fallbackModel: string): Promise<SingleAiResult> => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error en OpenRouter (${response.status}): ${errorBody}`);
  }
  const data: any = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Respuesta vacía o formato inesperado de OpenRouter');
  return { text, model: data.model || fallbackModel };
};

export const generateOpenRouterContent = async (
  userPrompt: string,
  systemInstruction: string,
  model = DEFAULT_OPENROUTER_MODEL,
  reasoning = true
): Promise<SingleAiResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY no está configurada');

  const messages = [
    { role: 'system', content: systemInstruction },
    { role: 'user', content: userPrompt }
  ];
  // Cascada: el modelo pedido y, si falla, el resto del catálogo en orden (DeepSeek → GPT-6 Luna → gratuitos)
  const modelsToTry = [model, ...OPENROUTER_MODEL_CASCADE.filter(m => m !== model)];
  const cascadeLog: string[] = [];
  let lastError: any = null;
  for (const [index, candidate] of modelsToTry.entries()) {
    if (index > 0) console.warn(`[OpenRouter] Fallback interno: intentando modelo ${candidate} tras error con el anterior.`);
    try {
      const response = await requestOpenRouterApi(apiKey, buildOpenRouterPayload(candidate, messages, reasoning));
      const result = await parseOpenRouterResponse(response, candidate);
      cascadeLog.push(`${candidate}: OK`);
      return { ...result, requestedModel: candidate, cascadeLog };
    } catch (err: any) {
      lastError = err;
      cascadeLog.push(`${candidate}: ${err.status ? `HTTP ${err.status}` : (err.message || 'error')}`);
      console.warn(`[OpenRouter] Fallo con modelo ${candidate}:`, err.message || err);
    }
  }
  if (lastError?.name === 'TimeoutError' || lastError?.name === 'AbortError') {
    throw Object.assign(new Error('Timeout en OpenRouter (20m): el proveedor no respondió a tiempo'), { cascadeLog });
  }
  throw Object.assign(lastError, { cascadeLog });
};

/**
 * Cuerpo de la petición a OpenRouter. En los modelos con soporte confirmado del parámetro
 * `reasoning` se pide esfuerzo alto o, con `reasoning: false`, se desactiva: DeepSeek razona
 * por defecto aunque no se le pida, lo que multiplica por 5 el tiempo de una traducción.
 */
const buildOpenRouterPayload = (model: string, messages: object[], reasoning: boolean): Record<string, any> => {
  const payload: Record<string, any> = { model, messages };
  if (!OPENROUTER_MODELS_WITH_REASONING_EFFORT.has(model)) return payload;
  if (reasoning) payload.reasoning_effort = DEFAULT_REASONING_EFFORT;
  else payload.reasoning = { enabled: false };
  return payload;
};

export interface AiGenerationResult {
  text: string;
  provider: 'gemini' | 'openrouter';
  model: string;
  requestedModel?: string;
  fallbackUsed: boolean;
  cascadeLog?: string[];
}

export type PhaseCallback = (phase: 'analizando' | 'reintentando', provider: 'gemini' | 'openrouter') => Promise<void> | void;

const executeProvider = async (
  provider: 'gemini' | 'openrouter',
  userPrompt: string,
  systemInstruction: string,
  preferredModel?: string,
  reasoning = true
): Promise<SingleAiResult> => {
  return provider === 'gemini'
    ? generateGeminiContent(userPrompt, systemInstruction, preferredModel, undefined, reasoning)
    : generateOpenRouterContent(userPrompt, systemInstruction, preferredModel, reasoning);
};

const tryProvider = async (
  provider: 'gemini' | 'openrouter',
  isFallback: boolean,
  prompt: string,
  instruction: string,
  onPhaseChange?: PhaseCallback,
  preferredModel?: string,
  reasoning = true
): Promise<AiGenerationResult> => {
  if (isFallback) console.warn(`[AI Service] Fallback activado: intentando con ${provider} tras fallo.`);
  await onPhaseChange?.(isFallback ? 'reintentando' : 'analizando', provider);
  const { text, model, requestedModel, cascadeLog } = await executeProvider(provider, prompt, instruction, isFallback ? undefined : preferredModel, reasoning);
  console.log(`[AI Service] Respuesta obtenida de ${provider} (modelo exacto: ${model})${isFallback ? ' tras fallback' : ''}`);
  return { text, provider, model, requestedModel, fallbackUsed: isFallback, cascadeLog };
};

export interface AiRequestOptions {
  /** `false` evita el razonamiento alto (p. ej. en traducciones, donde no aporta y multiplica el tiempo). */
  reasoning?: boolean;
}

/** Orden de proveedores: sin Gemini habilitado, solo OpenRouter (sin respaldo). */
const providerOrder = (preferred: 'gemini' | 'openrouter'): Array<'gemini' | 'openrouter'> => {
  if (!isGeminiEnabled()) return ['openrouter'];
  return preferred === 'openrouter' ? ['openrouter', 'gemini'] : ['gemini', 'openrouter'];
};

export const generateAiContentWithFallback = async (
  userPrompt: string,
  systemInstruction: string,
  preferredProvider: 'gemini' | 'openrouter' = 'gemini',
  onPhaseChange?: PhaseCallback,
  preferredModel?: string,
  options: AiRequestOptions = {}
): Promise<AiGenerationResult> => {
  const order = providerOrder(resolveProvider(preferredProvider));
  // Un modelo de otro proveedor (p. ej. de Gemini estando desactivado) se descarta
  const model = preferredModel && modelFitsProvider(order[0]!, preferredModel) ? preferredModel : undefined;
  const reasoning = options.reasoning ?? true;

  let lastError: any = null;
  let fullCascadeLog: string[] = [];
  for (let i = 0; i < order.length; i++) {
    const provider = order[i];
    try {
      const result = await tryProvider(provider, i > 0, userPrompt, systemInstruction, onPhaseChange, model, reasoning);
      // Si tenemos éxito, añadimos los logs de intentos previos fallidos al cascadeLog del resultado
      if (fullCascadeLog.length > 0) {
        return { ...result, cascadeLog: [...fullCascadeLog, ...result.cascadeLog] };
      }
      return result;
    } catch (err: any) {
      lastError = err;
      // Acumular el cascadeLog del error (si existe)
      if (err.cascadeLog) {
        fullCascadeLog = [...fullCascadeLog, ...err.cascadeLog];
      } else {
        // Si no hay cascadeLog en el error, crear uno básico
        const providerModel = i === 0 && model ? model :
                           provider === 'gemini' ? DEFAULT_GEMINI_MODEL :
                            DEFAULT_OPENROUTER_MODEL;
        fullCascadeLog.push(`${providerModel}: ${err.message || 'Error desconocido'}`);
      }
      console.error(`[AI Service] Error con proveedor ${provider}:`, err.message || err);
    }
  }
  // Si llegamos aquí, todos fallaron
  const error = new Error(`Fallaron todos los proveedores de IA. Último error: ${lastError?.message || lastError}`);
  Object.assign(error, { cascadeLog: fullCascadeLog });
  throw error;
};

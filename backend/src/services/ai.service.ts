import fs from 'fs';
import path from 'path';
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  GEMINI_MODEL_CASCADE,
  GEMINI_MODELS_WITH_THINKING_LEVEL,
  OPENROUTER_MODELS_WITH_REASONING_EFFORT
} from '../data/ai-models';

/** Nº máximo de ejemplos de referencia que se inyectan en el prompt. */
export const MAX_INTEF_EXAMPLES = 8;
/** Recorte de cada ejemplo para no saturar el prompt (y evitar 503 del proveedor). */
export const MAX_INTEF_EXAMPLE_CHARS = 1200;

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
  'tareas', 'sobre', 'entre', 'desde', 'mediante', 'diferentes', 'cada', 'traves', 'sido', 'tiene'
]);

function tokenize(text: string): string[] {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

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
    criteria.courseLevel,
    criteria.title,
    ...(criteria.modules || []),
    ...(criteria.ras || [])
  ].filter(Boolean).join(' ')));

  const scored = examples.map((example, index) => {
    const len = (example?.originalContent || example?.content_sample || '').length;
    let score = 0;

    if (queryTokens.size > 0) {
      const rasTokens = new Set(tokenize((example?.ras || []).join(' ')));
      const moduleTokens = new Set(tokenize((example?.modules || []).join(' ')));
      const baseTokens = new Set(tokenize(
        [example?.title, example?.description, example?.originalContent].filter(Boolean).join(' ')
      ));

      for (const token of queryTokens) {
        if (rasTokens.has(token)) score += 3;
        else if (moduleTokens.has(token)) score += 2;
        else if (baseTokens.has(token)) score += 1;
      }
    }

    return { example, index, score, len };
  });

  scored.sort((a, b) => b.score - a.score || b.len - a.len || a.index - b.index);
  return scored.slice(0, MAX_INTEF_EXAMPLES).map(s => s.example);
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
          originalContent: String(example?.originalContent || example?.content_sample || '').slice(0, MAX_INTEF_EXAMPLE_CHARS)
        }));
        intefExamplesContext = "\n--- EJEMPLOS DEL INTEF (más relevantes) ---\n" + JSON.stringify(compact);
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

export const generateGeminiContent = async (
  userPrompt: string,
  systemInstruction: string,
  preferredModel = DEFAULT_GEMINI_MODEL,
  timeoutMs = 1_200_000
): Promise<SingleAiResult> => {
  const { GoogleGenAI, ThinkingLevel } = await import('@google/genai');
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
      const request = ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction,
          ...(GEMINI_MODELS_WITH_THINKING_LEVEL.has(modelName)
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
            : {})
        }
      });
      const response = await withTimeout(request, timeoutMs, `Timeout en Gemini (${modelName}): el proveedor no respondió a tiempo`);
      cascadeLog.push(`${modelName}: OK`);
      return {
        text: response.text,
        model: (response as any).modelVersion || modelName,
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
  model = DEFAULT_OPENROUTER_MODEL
): Promise<SingleAiResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY no está configurada');

  const messages = [
    { role: 'system', content: systemInstruction },
    { role: 'user', content: userPrompt }
  ];
  const payload: Record<string, any> = { model, messages };
  if (OPENROUTER_MODELS_WITH_REASONING_EFFORT.has(model)) {
    payload.reasoning_effort = DEFAULT_REASONING_EFFORT;
  }
  const cascadeLog: string[] = [];
  try {
    const response = await requestOpenRouterApi(apiKey, payload);
    const result = await parseOpenRouterResponse(response, model);
    cascadeLog.push(`${model}: OK`);
    return { ...result, cascadeLog };
  } catch (err: any) {
    const errorMsg = err.status ? `HTTP ${err.status}` : (err.message || 'error');
    cascadeLog.push(`${model}: ${errorMsg}`);
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw Object.assign(new Error('Timeout en OpenRouter (20m): el proveedor gratuito no respondió a tiempo'), { cascadeLog });
    }
    throw Object.assign(err, { cascadeLog });
  }
};

export interface AiGenerationResult {
  text: string;
  provider: 'gemini' | 'openrouter';
  model: string;
  fallbackUsed: boolean;
  cascadeLog?: string[];
}

export type PhaseCallback = (phase: 'analizando' | 'reintentando', provider: 'gemini' | 'openrouter') => Promise<void> | void;

const executeProvider = async (
  provider: 'gemini' | 'openrouter',
  userPrompt: string,
  systemInstruction: string,
  preferredModel?: string
): Promise<SingleAiResult> => {
  return provider === 'gemini'
    ? generateGeminiContent(userPrompt, systemInstruction, preferredModel)
    : generateOpenRouterContent(userPrompt, systemInstruction, preferredModel);
};

const tryProvider = async (
  provider: 'gemini' | 'openrouter',
  isFallback: boolean,
  prompt: string,
  instruction: string,
  onPhaseChange?: PhaseCallback,
  preferredModel?: string
): Promise<AiGenerationResult> => {
  if (isFallback) console.warn(`[AI Service] Fallback activado: intentando con ${provider} tras fallo.`);
  await onPhaseChange?.(isFallback ? 'reintentando' : 'analizando', provider);
  const { text, model, cascadeLog } = await executeProvider(provider, prompt, instruction, isFallback ? undefined : preferredModel);
  console.log(`[AI Service] Respuesta obtenida de ${provider} (modelo exacto: ${model})${isFallback ? ' tras fallback' : ''}`);
  return { text, provider, model, fallbackUsed: isFallback, cascadeLog };
};

export const generateAiContentWithFallback = async (
  userPrompt: string,
  systemInstruction: string,
  preferredProvider: 'gemini' | 'openrouter' = 'gemini',
  onPhaseChange?: PhaseCallback,
  preferredModel?: string
): Promise<AiGenerationResult> => {
  const order: Array<'gemini' | 'openrouter'> = preferredProvider === 'openrouter'
    ? ['openrouter', 'gemini']
    : ['gemini', 'openrouter'];

  let lastError: any = null;
  let fullCascadeLog: string[] = [];
  for (let i = 0; i < order.length; i++) {
    const provider = order[i];
    try {
      const result = await tryProvider(provider, i > 0, userPrompt, systemInstruction, onPhaseChange, preferredModel);
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
        const providerModel = i === 0 && preferredModel ? preferredModel :
                           provider === 'gemini' ? (preferredModel || DEFAULT_GEMINI_MODEL) :
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

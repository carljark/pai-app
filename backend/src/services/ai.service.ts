import fs from 'fs';
import path from 'path';

export const buildContexts = (settings: any) => {
  const schoolContextStr = settings 
    ? `\n\n--- CONTEXTO DEL CENTRO EDUCATIVO ---\nNombre: ${settings.schoolName}\nCiudad: ${settings.schoolCity}\nContexto: ${settings.schoolContext}`
    : '';

  let intefExamplesContext = '';
  try {
    const examplesPath = path.join(process.cwd(), 'src/data/intef_examples.json');
    if (fs.existsSync(examplesPath)) {
      const examples = JSON.parse(fs.readFileSync(examplesPath, 'utf-8'));
      intefExamplesContext = "\n--- EJEMPLOS DEL INTEF ---\n" + JSON.stringify(examples);
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
}

export const generateGeminiContent = async (
  userPrompt: string,
  systemInstruction: string,
  timeoutMs = 600_000
): Promise<SingleAiResult> => {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ httpOptions: { timeout: timeoutMs } });
  const modelName = 'gemini-3.6-flash';
  try {
    const request = ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: { systemInstruction }
    });
    const response = await withTimeout(request, timeoutMs, 'Timeout en Gemini (10m): el proveedor no respondió a tiempo');
    return {
      text: response.text,
      model: (response as any).modelVersion || modelName
    };
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.message?.includes('Timeout en Gemini')) {
      throw new Error('Timeout en Gemini (10m): el proveedor no respondió a tiempo');
    }
    throw err;
  }
};

const requestOpenRouterApi = async (apiKey: string, payload: any, timeoutMs = 600_000) => {
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
  model = 'openrouter/free'
): Promise<SingleAiResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY no está configurada');

  const messages = [
    { role: 'system', content: systemInstruction },
    { role: 'user', content: userPrompt }
  ];
  try {
    const response = await requestOpenRouterApi(apiKey, { model, messages });
    return await parseOpenRouterResponse(response, model);
  } catch (err: any) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      throw new Error('Timeout en OpenRouter (10m): el proveedor gratuito no respondió a tiempo');
    }
    throw err;
  }
};

export interface AiGenerationResult {
  text: string;
  provider: 'gemini' | 'openrouter';
  model: string;
  fallbackUsed: boolean;
}

export type PhaseCallback = (phase: 'analizando' | 'reintentando', provider: 'gemini' | 'openrouter') => Promise<void> | void;

const executeProvider = async (
  provider: 'gemini' | 'openrouter',
  userPrompt: string,
  systemInstruction: string
): Promise<SingleAiResult> => {
  return provider === 'gemini'
    ? generateGeminiContent(userPrompt, systemInstruction)
    : generateOpenRouterContent(userPrompt, systemInstruction);
};

const tryProvider = async (
  provider: 'gemini' | 'openrouter',
  isFallback: boolean,
  prompt: string,
  instruction: string,
  onPhaseChange?: PhaseCallback
): Promise<AiGenerationResult> => {
  if (isFallback) console.warn(`[AI Service] Fallback activado: intentando con ${provider} tras fallo.`);
  await onPhaseChange?.(isFallback ? 'reintentando' : 'analizando', provider);
  const { text, model } = await executeProvider(provider, prompt, instruction);
  console.log(`[AI Service] Respuesta obtenida de ${provider} (modelo exacto: ${model})${isFallback ? ' tras fallback' : ''}`);
  return { text, provider, model, fallbackUsed: isFallback };
};

export const generateAiContentWithFallback = async (
  userPrompt: string,
  systemInstruction: string,
  preferredProvider: 'gemini' | 'openrouter' = 'gemini',
  onPhaseChange?: PhaseCallback
): Promise<AiGenerationResult> => {
  const order: Array<'gemini' | 'openrouter'> = preferredProvider === 'openrouter'
    ? ['openrouter', 'gemini']
    : ['gemini', 'openrouter'];

  let lastError: any = null;
  for (let i = 0; i < order.length; i++) {
    const provider = order[i];
    try {
      return await tryProvider(provider, i > 0, userPrompt, systemInstruction, onPhaseChange);
    } catch (err: any) {
      lastError = err;
      console.error(`[AI Service] Error con proveedor ${provider}:`, err.message || err);
    }
  }
  throw new Error(`Fallaron todos los proveedores de IA. Último error: ${lastError?.message || lastError}`);
};


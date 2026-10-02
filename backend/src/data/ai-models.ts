/**
 * Fuente única de verdad de los modelos de IA disponibles en Plappin.
 * El generador y el taller obtienen esta lista a través del endpoint
 * `GET /api/ai/models`, de modo que no hay nombres de modelo hardcodeados
 * en el frontend.
 */

export type AiProviderId = 'gemini' | 'openrouter';

export interface AiModelCatalogEntry {
  value: string;
  label: string;
  provider: AiProviderId;
  /** Enviar `thinkingConfig.thinkingLevel` en Gemini. */
  thinkingLevel?: boolean;
  /** Enviar `reasoning_effort` en OpenRouter. */
  reasoningEffort?: boolean;
}

export interface AiProviderCatalog {
  value: AiProviderId;
  label: string;
  defaultModel: string;
}

/**
 * Modelos Gemini habilitados. De momento solo 3.6 Flash: los 3.8 y 3.7 están
 * sufriendo saturación de capacidad (HTTP 503) de forma recurrente y la cuenta
 * está en el nivel gratuito (5 peticiones/minuto por modelo).
 */
export const GEMINI_AVAILABLE_MODELS: AiModelCatalogEntry[] = [
  { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', provider: 'gemini', thinkingLevel: true }
];

export const OPENROUTER_AVAILABLE_MODELS: AiModelCatalogEntry[] = [
  { value: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash', provider: 'openrouter', reasoningEffort: true },
  { value: 'openai/gpt-6-luna', label: 'GPT-6 Luna (OpenAI)', provider: 'openrouter', reasoningEffort: true },
  { value: 'openrouter/free', label: 'Auto Gratuito (Router automático)', provider: 'openrouter' },
  { value: 'dots-studio/dots-3-note-preview:free', label: 'Dots3 Note 512k (Documentos)', provider: 'openrouter' },
  { value: 'inclusionai/ling-3.0-flash-vl:free', label: 'Ling 3.0 Flash (Rápido)', provider: 'openrouter' },
  { value: 'cohere/north-mini-code:free', label: 'Cohere North Mini', provider: 'openrouter' },
  { value: 'liquid/lfm-2.5-2.6b:free', label: 'LiquidAI LFM 2.5', provider: 'openrouter' },
  { value: 'thinkingmachines/inkling-small:free', label: 'Inkling Small (free)', provider: 'openrouter', reasoningEffort: true }
];

export const AI_AVAILABLE_MODELS: AiModelCatalogEntry[] = [
  ...GEMINI_AVAILABLE_MODELS,
  ...OPENROUTER_AVAILABLE_MODELS
];

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
export const DEFAULT_OPENROUTER_MODEL = 'deepseek/deepseek-v4.1-flash';

export const AI_PROVIDER_CATALOG: AiProviderCatalog[] = [
  { value: 'gemini', label: 'Gemini', defaultModel: DEFAULT_GEMINI_MODEL },
  { value: 'openrouter', label: 'OpenRouter', defaultModel: DEFAULT_OPENROUTER_MODEL }
];

export const GEMINI_MODEL_CASCADE: string[] = GEMINI_AVAILABLE_MODELS.map(m => m.value);
export const GEMINI_MODELS_WITH_THINKING_LEVEL = new Set(
  GEMINI_AVAILABLE_MODELS.filter(m => m.thinkingLevel).map(m => m.value)
);
export const OPENROUTER_MODELS_WITH_REASONING_EFFORT = new Set(
  OPENROUTER_AVAILABLE_MODELS.filter(m => m.reasoningEffort).map(m => m.value)
);

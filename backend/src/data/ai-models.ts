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

/**
 * Gemini está DESACTIVADO por defecto: la cuenta está en el nivel gratuito (20 peticiones/día por
 * modelo) y se agota enseguida. Se reactiva con `GEMINI_ENABLED=true` en el `.env` (p. ej. tras
 * activar la facturación de Google Cloud). Se lee en cada llamada para poder cambiarlo en tests.
 */
export const isGeminiEnabled = (): boolean => process.env.GEMINI_ENABLED === 'true';

/** Proveedores y modelos que se ofrecen en `GET /api/ai/models` según la configuración. */
export const getEnabledProviderCatalog = (): AiProviderCatalog[] =>
  AI_PROVIDER_CATALOG.filter(p => p.value !== 'gemini' || isGeminiEnabled());
export const getEnabledModels = (): AiModelCatalogEntry[] =>
  AI_AVAILABLE_MODELS.filter(m => m.provider !== 'gemini' || isGeminiEnabled());

/** Proveedor efectivo de una petición: OpenRouter si se pide o si Gemini está desactivado. */
export const resolveProvider = (value: unknown): AiProviderId =>
  value === 'openrouter' || !isGeminiEnabled() ? 'openrouter' : 'gemini';

/** Los modelos de OpenRouter llevan prefijo de organización (`openai/…`); los de Gemini, no. */
export const modelFitsProvider = (provider: AiProviderId, model: string): boolean =>
  provider === 'openrouter' ? model.includes('/') : !model.includes('/');

export const GEMINI_MODEL_CASCADE: string[] = GEMINI_AVAILABLE_MODELS.map(m => m.value);
/** Orden de reintento en OpenRouter: DeepSeek (por defecto), GPT-6 Luna y después los gratuitos. */
export const OPENROUTER_MODEL_CASCADE: string[] = OPENROUTER_AVAILABLE_MODELS.map(m => m.value);
export const GEMINI_MODELS_WITH_THINKING_LEVEL = new Set(
  GEMINI_AVAILABLE_MODELS.filter(m => m.thinkingLevel).map(m => m.value)
);
export const OPENROUTER_MODELS_WITH_REASONING_EFFORT = new Set(
  OPENROUTER_AVAILABLE_MODELS.filter(m => m.reasoningEffort).map(m => m.value)
);

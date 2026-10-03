import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEnabledModels,
  getEnabledProviderCatalog,
  modelFitsProvider,
  resolveProvider
} from '../data/ai-models';
import { getAiModels } from '../controllers/ai.controller';
import {
  generateGeminiContent,
  generateOpenRouterContent,
  generateAiContentWithFallback,
  DEFAULT_OPENROUTER_MODEL,
  DEFAULT_REASONING_EFFORT
} from '../services/ai.service';

const interactionsCreateMock = vi.fn().mockResolvedValue({ output_text: 'Respuesta simulada Gemini' });

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      interactions = {
        create: interactionsCreateMock
      };
    }
  };
});

describe('AI Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    interactionsCreateMock.mockReset();
    interactionsCreateMock.mockResolvedValue({ output_text: 'Respuesta simulada Gemini' });
  });

  it('debería generar contenido con Gemini usando modelo por defecto gemini-3.6-flash', async () => {
    const res = await generateGeminiContent('prompt', 'instruction');
    expect(res.text).toBe('Respuesta simulada Gemini');
    expect(res.model).toBe('gemini-3.6-flash');
    expect(interactionsCreateMock).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-3.6-flash',
      system_instruction: 'instruction',
      generation_config: { thinking_level: 'high' }
    }));
  });

  it('debería devolver texto vacío si la interacción no trae output_text', async () => {
    interactionsCreateMock.mockResolvedValueOnce({ status: 'completed', steps: [] });
    const res = await generateGeminiContent('prompt', 'instruction', 'gemini-2.5-pro');
    expect(res.text).toBe('');
    expect(interactionsCreateMock).toHaveBeenCalledWith(
      expect.not.objectContaining({ generation_config: expect.anything() })
    );
  });

  it('debería soportar preferredModel y fallback de modelos internos en Gemini', async () => {
    // Primer intento falla con status HTTP (ej: 429 quota o 503 unavailable), segundo intento tiene éxito con model
    const httpError = new Error('Quota limit 429');
    (httpError as any).status = 429;
    interactionsCreateMock
      .mockRejectedValueOnce(httpError)
      .mockResolvedValueOnce({ output_text: 'Respuesta segundo modelo', model: 'gemini-3.6-flash-v2' });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await generateGeminiContent('prompt', 'instruction', 'gemini-2.5-pro');

    expect(res.text).toBe('Respuesta segundo modelo');
    expect(res.model).toBe('gemini-3.6-flash-v2');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Fallback interno: intentando modelo gemini-3.6-flash'));
    warnSpy.mockRestore();
  });

  it('generateGeminiContent debería manejar timeout si tarda demasiado', async () => {
    interactionsCreateMock.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
    await expect(generateGeminiContent('p', 'i', 'gemini-3.6-flash', 10)).rejects.toThrow('Timeout en Gemini');
  });

  it('generateGeminiContent debería relanzar otros errores cuando fallan todos los modelos', async () => {
    interactionsCreateMock.mockRejectedValue(new Error('Internal Gemini Error'));
    await expect(generateGeminiContent('p', 'i')).rejects.toMatchObject({
      message: 'Internal Gemini Error',
      cascadeLog: [
        'gemini-3.6-flash: Internal Gemini Error'
      ]
    });
  });

  it('generateOpenRouterContent debería lanzar error si falta API key', async () => {
    await expect(generateOpenRouterContent('p', 'i')).rejects.toThrow('OPENROUTER_API_KEY no está configurada');
  });

  it('generateOpenRouterContent debería generar con éxito extrayendo el modelo devuelto', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        choices: [{ message: { content: 'Respuesta OpenRouter' } }]
      })
    });
    vi.stubGlobal('fetch', mockFetch);

    const res = await generateOpenRouterContent('prompt', 'instruction');
    expect(res.text).toBe('Respuesta OpenRouter');
    expect(res.model).toBe('meta-llama/llama-3.3-70b-instruct:free');
    expect(mockFetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining(DEFAULT_OPENROUTER_MODEL)
    }));
    const requestBody = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(requestBody.reasoning_effort).toBe(DEFAULT_REASONING_EFFORT);
  });

  it('solo configura reasoning_effort en modelos OpenRouter que lo admiten', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Respuesta' } }] })
    });
    vi.stubGlobal('fetch', mockFetch);

    await generateOpenRouterContent('prompt', 'instruction', 'thinkingmachines/inkling-small:free');
    await generateOpenRouterContent('prompt', 'instruction', 'dots-studio/dots-3-note-preview:free');
    await generateOpenRouterContent('prompt', 'instruction', 'openrouter/free');
    await generateOpenRouterContent('prompt', 'instruction', 'openai/gpt-6-luna');

    const bodies = mockFetch.mock.calls.map(call => JSON.parse((call[1] as RequestInit).body as string));
    expect(bodies[0].reasoning_effort).toBe('high');
    expect(bodies[1]).not.toHaveProperty('reasoning_effort');
    expect(bodies[2]).not.toHaveProperty('reasoning_effort');
    expect(bodies[3].reasoning_effort).toBe('high');
  });

  it('generateOpenRouterContent debería manejar respuesta fallida HTTP', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized'
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(generateOpenRouterContent('p', 'i')).rejects.toThrow('Error en OpenRouter (401)');
  });

  it('generateOpenRouterContent debería manejar respuesta vacía o sin content', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [] })
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(generateOpenRouterContent('p', 'i')).rejects.toThrow('Respuesta vacía');
  });

  it('generateAiContentWithFallback debería usar Gemini por defecto sin fallback si tiene éxito', async () => {
    const res = await generateAiContentWithFallback('p', 'i', 'gemini');
    expect(res.provider).toBe('gemini');
    expect(res.fallbackUsed).toBe(false);
    expect(res.text).toBe('Respuesta simulada Gemini');
    expect(res.model).toBe('gemini-3.6-flash');
  });

  it('generateAiContentWithFallback debería hacer fallback a OpenRouter si Gemini falla', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        model: DEFAULT_OPENROUTER_MODEL,
        choices: [{ message: { content: 'Respuesta Fallback OpenRouter' } }]
      })
    }));
    const mockFetch = vi.mocked(fetch);

    interactionsCreateMock.mockRejectedValue(new Error('Quota limit'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await generateAiContentWithFallback('p', 'i', 'gemini');
    expect(res.provider).toBe('openrouter');
    expect(res.fallbackUsed).toBe(true);
    expect(res.text).toBe('Respuesta Fallback OpenRouter');
    expect(res.model).toBe(DEFAULT_OPENROUTER_MODEL);
    expect(res.cascadeLog).toEqual([
      'gemini-3.6-flash: Quota limit',
      `${DEFAULT_OPENROUTER_MODEL}: OK`
    ]);
    expect(mockFetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', expect.objectContaining({
      body: expect.stringContaining(DEFAULT_OPENROUTER_MODEL)
    }));
    const fallbackBody = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
    expect(fallbackBody.reasoning_effort).toBe(DEFAULT_REASONING_EFFORT);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Fallback activado'));
    warnSpy.mockRestore();
  });

  it('generateAiContentWithFallback debería hacer fallback a Gemini si OpenRouter falla', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')));
    interactionsCreateMock.mockResolvedValueOnce({ output_text: 'Respuesta simulada Gemini' });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await generateAiContentWithFallback('p', 'i', 'openrouter');
    expect(res.provider).toBe('gemini');
    expect(res.fallbackUsed).toBe(true);
    expect(res.text).toBe('Respuesta simulada Gemini');
    expect(res.model).toBe('gemini-3.6-flash');
    warnSpy.mockRestore();
  });

  it('generateOpenRouterContent debería manejar TimeoutError o AbortError', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    const timeoutErr = new Error('The operation was aborted');
    timeoutErr.name = 'TimeoutError';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeoutErr));

    await expect(generateOpenRouterContent('p', 'i')).rejects.toThrow('Timeout en OpenRouter');
  });

  it('generateAiContentWithFallback debería llamar a onPhaseChange', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    interactionsCreateMock.mockRejectedValue(new Error('Quota limit'));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Respuesta' } }] })
    }));

    const phaseCalls: string[] = [];
    const onPhaseChange = vi.fn().mockImplementation((phase, provider) => {
      phaseCalls.push(`${phase}:${provider}`);
    });

    await generateAiContentWithFallback('p', 'i', 'gemini', onPhaseChange);
    expect(onPhaseChange).toHaveBeenCalledTimes(2);
    expect(phaseCalls).toEqual(['analizando:gemini', 'reintentando:openrouter']);
  });

  it('generateAiContentWithFallback debería lanzar error si fallan ambos (incluso con error en string)', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce('Error OR sin message'));
    interactionsCreateMock.mockRejectedValue('Error Gemini sin message');

    await expect(generateAiContentWithFallback('p', 'i', 'gemini')).rejects.toThrow('Fallaron todos los proveedores');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});

describe('AI Service - Gemini desactivado y peticiones sin razonamiento', () => {
  const okFetch = () =>
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Respuesta OpenRouter' } }] })
    });
  const sentBody = (fetchMock: ReturnType<typeof vi.fn>, call = 0) =>
    JSON.parse((fetchMock.mock.calls[call]![1] as RequestInit).body as string);

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    interactionsCreateMock.mockReset();
    interactionsCreateMock.mockResolvedValue({ output_text: 'Respuesta Gemini' });
  });

  afterEach(() => {
    process.env.GEMINI_ENABLED = 'true';
    vi.unstubAllGlobals();
  });

  it('con Gemini desactivado usa solo OpenRouter y descarta modelos de Gemini', async () => {
    process.env.GEMINI_ENABLED = 'false';
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);

    const res = await generateAiContentWithFallback('p', 'i', 'gemini', undefined, 'gemini-3.6-flash');

    expect(res.provider).toBe('openrouter');
    expect(res.fallbackUsed).toBe(false);
    expect(interactionsCreateMock).not.toHaveBeenCalled();
    expect(sentBody(fetchMock).model).toBe(DEFAULT_OPENROUTER_MODEL);
  });

  it('con Gemini desactivado no hay respaldo si OpenRouter falla', async () => {
    process.env.GEMINI_ENABLED = 'false';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'Error' }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(generateAiContentWithFallback('p', 'i', 'openrouter')).rejects.toThrow('Fallaron todos los proveedores');
    expect(interactionsCreateMock).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('si falla DeepSeek intenta GPT-6 Luna y después los gratuitos, en ese orden', async () => {
    const failure = { ok: false, status: 503, text: async () => 'Saturado' };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(failure)
      .mockResolvedValueOnce(failure)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ choices: [{ message: { content: 'Libre' } }] }) });
    vi.stubGlobal('fetch', fetchMock);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await generateOpenRouterContent('p', 'i');

    expect(fetchMock.mock.calls.map((_, i) => sentBody(fetchMock, i).model)).toEqual([
      'deepseek/deepseek-v4.1-flash',
      'openai/gpt-6-luna',
      'openrouter/free'
    ]);
    expect(res.requestedModel).toBe('openrouter/free');
    expect(res.cascadeLog).toEqual([
      'deepseek/deepseek-v4.1-flash: Error en OpenRouter (503): Saturado',
      'openai/gpt-6-luna: Error en OpenRouter (503): Saturado',
      'openrouter/free: OK'
    ]);
    warnSpy.mockRestore();
  });

  it('reasoning: false desactiva el razonamiento solo en modelos que lo admiten', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);

    await generateAiContentWithFallback('p', 'i', 'openrouter', undefined, 'deepseek/deepseek-v4.1-flash', { reasoning: false });
    expect(sentBody(fetchMock)).not.toHaveProperty('reasoning_effort');
    expect(sentBody(fetchMock).reasoning).toEqual({ enabled: false });

    await generateOpenRouterContent('p', 'i', 'openrouter/free', false);
    expect(sentBody(fetchMock, 1)).not.toHaveProperty('reasoning');

    await generateAiContentWithFallback('p', 'i', 'gemini', undefined, undefined, { reasoning: false });
    expect(interactionsCreateMock).toHaveBeenCalledWith(
      expect.not.objectContaining({ generation_config: expect.anything() })
    );
  });

  it('el catálogo y el proveedor efectivo dependen de GEMINI_ENABLED', () => {
    process.env.GEMINI_ENABLED = 'false';
    expect(getEnabledProviderCatalog().map(p => p.value)).toEqual(['openrouter']);
    expect(getEnabledModels().every(m => m.provider === 'openrouter')).toBe(true);
    expect(resolveProvider('gemini')).toBe('openrouter');

    process.env.GEMINI_ENABLED = 'true';
    expect(getEnabledProviderCatalog().map(p => p.value)).toEqual(['gemini', 'openrouter']);
    expect(resolveProvider('gemini')).toBe('gemini');
    expect(resolveProvider(undefined)).toBe('gemini');
    expect(resolveProvider('openrouter')).toBe('openrouter');
    expect(modelFitsProvider('openrouter', 'openai/gpt-6-luna')).toBe(true);
    expect(modelFitsProvider('gemini', 'openai/gpt-6-luna')).toBe(false);
    expect(modelFitsProvider('gemini', 'gemini-3.6-flash')).toBe(true);
  });

  it('GET /api/ai/models solo devuelve lo habilitado', () => {
    process.env.GEMINI_ENABLED = 'false';
    const res = { json: vi.fn() };
    getAiModels({}, res as any);
    const body = res.json.mock.calls[0]![0];
    expect(body.providers.map((p: { value: string }) => p.value)).toEqual(['openrouter']);
    expect(body.models.some((m: { provider: string }) => m.provider === 'gemini')).toBe(false);
  });
});

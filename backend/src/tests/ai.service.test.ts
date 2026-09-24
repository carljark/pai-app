import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateGeminiContent,
  generateOpenRouterContent,
  generateAiContentWithFallback
} from '../services/ai.service';

const generateContentMock = vi.fn().mockResolvedValue({ text: 'Respuesta simulada Gemini' });

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: generateContentMock
      };
    }
  };
});

describe('AI Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENROUTER_API_KEY;
    generateContentMock.mockReset();
    generateContentMock.mockResolvedValue({ text: 'Respuesta simulada Gemini' });
  });

  it('debería generar contenido con Gemini usando modelo por defecto gemini-3.8-flash', async () => {
    const res = await generateGeminiContent('prompt', 'instruction');
    expect(res.text).toBe('Respuesta simulada Gemini');
    expect(res.model).toBe('gemini-3.8-flash');
  });

  it('debería soportar preferredModel y fallback de modelos internos en Gemini', async () => {
    // Primer intento falla con status HTTP (ej: 429 quota o 503 unavailable), segundo intento tiene éxito con modelVersion
    const httpError = new Error('Quota limit 429');
    (httpError as any).status = 429;
    generateContentMock
      .mockRejectedValueOnce(httpError)
      .mockResolvedValueOnce({ text: 'Respuesta segundo modelo', modelVersion: 'gemini-3.8-flash-v2' });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await generateGeminiContent('prompt', 'instruction', 'gemini-2.5-pro');

    expect(res.text).toBe('Respuesta segundo modelo');
    expect(res.model).toBe('gemini-3.8-flash-v2');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Fallback interno: intentando modelo gemini-3.8-flash'));
    warnSpy.mockRestore();
  });

  it('generateGeminiContent debería manejar timeout si tarda demasiado', async () => {
    generateContentMock.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
    await expect(generateGeminiContent('p', 'i', 'gemini-3.8-flash', 10)).rejects.toThrow('Timeout en Gemini');
  });

  it('generateGeminiContent debería relanzar otros errores cuando fallan todos los modelos', async () => {
    generateContentMock.mockRejectedValue(new Error('Internal Gemini Error'));
    await expect(generateGeminiContent('p', 'i')).rejects.toThrow('Internal Gemini Error');
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
      method: 'POST'
    }));
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
    expect(res.model).toBe('gemini-3.8-flash');
  });

  it('generateAiContentWithFallback debería hacer fallback a OpenRouter si Gemini falla', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        model: 'mistralai/mistral-7b-instruct:free',
        choices: [{ message: { content: 'Respuesta Fallback OpenRouter' } }]
      })
    }));

    generateContentMock.mockRejectedValue(new Error('Quota limit'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await generateAiContentWithFallback('p', 'i', 'gemini');
    expect(res.provider).toBe('openrouter');
    expect(res.fallbackUsed).toBe(true);
    expect(res.text).toBe('Respuesta Fallback OpenRouter');
    expect(res.model).toBe('mistralai/mistral-7b-instruct:free');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Fallback activado'));
    warnSpy.mockRestore();
  });

  it('generateAiContentWithFallback debería hacer fallback a Gemini si OpenRouter falla', async () => {
    process.env.OPENROUTER_API_KEY = 'test_key';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')));
    generateContentMock.mockResolvedValueOnce({ text: 'Respuesta simulada Gemini' });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await generateAiContentWithFallback('p', 'i', 'openrouter');
    expect(res.provider).toBe('gemini');
    expect(res.fallbackUsed).toBe(true);
    expect(res.text).toBe('Respuesta simulada Gemini');
    expect(res.model).toBe('gemini-3.8-flash');
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
    generateContentMock.mockRejectedValue(new Error('Quota limit'));
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
    generateContentMock.mockRejectedValue('Error Gemini sin message');

    await expect(generateAiContentWithFallback('p', 'i', 'gemini')).rejects.toThrow('Fallaron todos los proveedores');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});


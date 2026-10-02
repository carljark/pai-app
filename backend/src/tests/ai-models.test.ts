import { describe, it, expect, vi } from 'vitest';
import { getAiModels } from '../controllers/ai.controller';
import {
  AI_AVAILABLE_MODELS,
  AI_PROVIDER_CATALOG,
  GEMINI_AVAILABLE_MODELS,
  DEFAULT_GEMINI_MODEL,
  GEMINI_MODEL_CASCADE
} from '../data/ai-models';

describe('AI models catalog', () => {
  it('solo habilita gemini-3.6-flash como modelo Gemini', () => {
    expect(GEMINI_AVAILABLE_MODELS.map(m => m.value)).toEqual(['gemini-3.6-flash']);
    expect(DEFAULT_GEMINI_MODEL).toBe('gemini-3.6-flash');
    expect(GEMINI_MODEL_CASCADE).toEqual(['gemini-3.6-flash']);
  });

  it('todos los modelos declaran un proveedor válido', () => {
    for (const model of AI_AVAILABLE_MODELS) {
      expect(['gemini', 'openrouter']).toContain(model.provider);
      expect(model.value.length).toBeGreaterThan(0);
      expect(model.label.length).toBeGreaterThan(0);
    }
    for (const provider of AI_PROVIDER_CATALOG) {
      expect(AI_AVAILABLE_MODELS.some(m => m.provider === provider.value && m.value === provider.defaultModel)).toBe(true);
    }
  });

  it('getAiModels devuelve proveedores y modelos', () => {
    const res: any = { json: vi.fn() };
    getAiModels({}, res);
    expect(res.json).toHaveBeenCalledWith({
      providers: AI_PROVIDER_CATALOG,
      models: AI_AVAILABLE_MODELS
    });
  });
});

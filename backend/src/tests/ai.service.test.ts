import { describe, it, expect, vi } from 'vitest';
import { generateGeminiContent } from '../services/ai.service';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockResolvedValue({ text: 'Respuesta simulada' })
      };
    }
  };
});

describe('AI Service', () => {
  it('debería generar contenido con Gemini', async () => {
    const res = await generateGeminiContent('prompt', 'instruction');
    expect(res).toBe('Respuesta simulada');
  });
});

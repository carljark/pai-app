import { describe, it, expect, vi } from 'vitest';
import { buildContexts } from '../services/ai.service';
import fs from 'fs';

describe('ai.service', () => {
  it('Debería retornar un context string si settings no existe', () => {
    const { schoolContextStr } = buildContexts(null);
    expect(schoolContextStr).toBe('');
  });

  it('Debería retornar un string vacío de INTEF si el archivo no existe', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
    const { intefExamplesContext } = buildContexts({});
    expect(intefExamplesContext).toBe('');
    vi.restoreAllMocks();
  });

  it('Debería saltar catch si falla la lectura de INTEF', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => { throw new Error('Error de lectura') });
    const { intefExamplesContext } = buildContexts({});
    expect(intefExamplesContext).toBe('');
    vi.restoreAllMocks();
  });
});

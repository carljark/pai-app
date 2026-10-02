import { describe, it, expect, vi } from 'vitest';
import { buildContexts, selectRelevantExamples, MAX_INTEF_EXAMPLES, MAX_INTEF_EXAMPLE_CHARS } from '../services/ai.service';
import fs from 'fs';

const makeExample = (title: string, opts: any = {}) => ({
  title,
  description: opts.description || '',
  modules: opts.modules || [],
  ras: opts.ras || [],
  originalContent: opts.originalContent ?? 'x'.repeat(20),
  ...(opts.content_sample ? { content_sample: opts.content_sample } : {})
});

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

  it('buildContexts inyecta como máximo MAX_INTEF_EXAMPLES ejemplos', () => {
    const many = Array.from({ length: 35 }, (_, i) => makeExample('Ejemplo ' + i));
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(many) as any);
    const { intefExamplesContext } = buildContexts({}, {});
    const payload = JSON.parse(intefExamplesContext.split('\n').pop() as string);
    expect(payload).toHaveLength(MAX_INTEF_EXAMPLES);
    vi.restoreAllMocks();
  });

  it('recorta el contenido de cada ejemplo para no saturar el prompt', () => {
    const big = makeExample('Grande', { originalContent: 'x'.repeat(MAX_INTEF_EXAMPLE_CHARS + 500) });
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([big]) as any);
    const { intefExamplesContext } = buildContexts({}, {});
    const payload = JSON.parse(intefExamplesContext.split('\n').pop() as string);
    expect(payload[0].originalContent).toHaveLength(MAX_INTEF_EXAMPLE_CHARS);
    vi.restoreAllMocks();
  });
});

describe('selectRelevantExamples', () => {
  it('limita el resultado a MAX_INTEF_EXAMPLES', () => {
    const list = Array.from({ length: 30 }, (_, i) => makeExample('Ejemplo ' + i));
    expect(selectRelevantExamples(list, {})).toHaveLength(MAX_INTEF_EXAMPLES);
  });

  it('devuelve [] si la entrada no es un array', () => {
    expect(selectRelevantExamples(null as any)).toEqual([]);
    expect(selectRelevantExamples(undefined as any)).toEqual([]);
  });

  it('prioriza los ejemplos con más solapamiento de RAs y módulos', () => {
    const list = [
      makeExample('Irrelevante', { originalContent: 'z'.repeat(99) }),
      makeExample('Sobre panadería', {
        ras: ['Elaborar masas de pan'],
        modules: ['Amasado y fermentación'],
        originalContent: 'y'.repeat(10)
      })
    ];
    const res = selectRelevantExamples(list, {
      tipoNivel: 'FP_BASICA',
      ras: ['Elaborar masas de pan'],
      modules: ['Amasado y fermentación']
    });
    expect(res[0].title).toBe('Sobre panadería');
  });

  it('sin criterios prioriza el contenido más completo', () => {
    const list = [
      makeExample('Corto', { originalContent: 'x'.repeat(5) }),
      makeExample('Largo', { originalContent: 'x'.repeat(80) })
    ];
    expect(selectRelevantExamples(list, {})[0].title).toBe('Largo');
  });

  it('usa content_sample como alternativa para medir la longitud', () => {
    const list = [
      makeExample('ConSample', { originalContent: '', content_sample: 'y'.repeat(80) }),
      makeExample('Corto', { originalContent: 'z'.repeat(10) })
    ];
    expect(selectRelevantExamples(list, {})[0].title).toBe('ConSample');
  });

  it('ignora palabras cortas y stopwords al puntuar', () => {
    const list = [makeExample('Neutro')];
    const res = selectRelevantExamples(list, { ras: ['de la para proyecto'] });
    expect(res).toHaveLength(1);
  });
});

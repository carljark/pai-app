import { describe, it, expect, vi } from 'vitest';
import { buildContexts, selectRelevantExamples, MAX_INTEF_EXAMPLES, MAX_INTEF_EXAMPLE_CHARS, MAX_APS_EXAMPLES } from '../services/ai.service';
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

  it('indica la fuente de las referencias de la carpeta de proyectos', () => {
    const eei = { ...makeExample('Taller de rap'), kind: 'eei', source: 'INTEF, Experiencias Educativas Inspiradoras n.º 131 (2024)' };
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([eei, makeExample('Antiguo')]) as any);
    const { intefExamplesContext } = buildContexts({}, {});
    expect(intefExamplesContext).toContain('BUENAS PRÁCTICAS DE APRENDIZAJE-SERVICIO');
    const payload = JSON.parse(intefExamplesContext.split('\n').pop() as string);
    expect(payload.find((e: any) => e.title === 'Taller de rap').source).toContain('n.º 131');
    expect(payload.find((e: any) => e.title === 'Antiguo')).not.toHaveProperty('source');
    vi.restoreAllMocks();
  });
});

describe('referencias de intef_examples.json', () => {
  it('incluye las experiencias INTEF y las prácticas de aprendizaje-servicio de la carpeta de referencias', () => {
    const all = JSON.parse(fs.readFileSync('src/data/intef_examples.json', 'utf-8'));
    expect(all.filter((e: any) => e.kind === 'eei')).toHaveLength(5);
    expect(all.filter((e: any) => e.kind === 'aps')).toHaveLength(76);
    expect(all.every((e: any) => e.title && Array.isArray(e.ras) && Array.isArray(e.modules) && e.originalContent)).toBe(true);
    expect(all.filter((e: any) => e.kind).every((e: any) => e.source)).toBe(true);
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

  it('incluye como mucho MAX_APS_EXAMPLES fichas de aprendizaje-servicio', () => {
    const aps = Array.from({ length: 6 }, (_, i) => ({ ...makeExample('ApS ' + i, { ras: ['Peinados solidarios'] }), kind: 'aps' }));
    const others = Array.from({ length: 6 }, (_, i) => makeExample('Proyecto ' + i));
    const res = selectRelevantExamples([...aps, ...others], { ras: ['Peinados solidarios'] });
    expect(res).toHaveLength(MAX_INTEF_EXAMPLES);
    expect(res.filter(e => e.kind === 'aps')).toHaveLength(MAX_APS_EXAMPLES);
    expect(res.slice(0, MAX_APS_EXAMPLES).every(e => e.kind === 'aps')).toBe(true);
  });

  it('pondera más las palabras raras del corpus que las frecuentes', () => {
    // Sin ponderar empatarían (una coincidencia en los RA cada uno) y ganaría el primero de la lista
    const common = Array.from({ length: 6 }, (_, i) => makeExample('Común ' + i, { ras: ['Investigar el entorno'] }));
    const rare = makeExample('Raro', { ras: ['Elaborar tintes'] });
    const res = selectRelevantExamples([...common, rare], { ras: ['Investigar tintes'] });
    expect(res[0].title).toBe('Raro');
  });

  it('da peso a la familia profesional del nivel aunque los módulos no la nombren', () => {
    // Sin el peso de la familia, la coincidencia en los RA del genérico (3) superaría a la del texto (1)
    const generic = makeExample('Genérico', { ras: ['Atender con amabilidad'] });
    const family = makeExample('Solidario', { description: 'Servicio de peluquería para mayores' });
    const res = selectRelevantExamples([family, generic, makeExample('Otro')], {
      tipoNivel: 'FP_BASICA', ras: ['Atender al cliente']
    });
    expect(res[0].title).toBe('Solidario');
  });

  it('ignora palabras cortas y stopwords al puntuar', () => {
    const list = [makeExample('Neutro')];
    const res = selectRelevantExamples(list, { ras: ['de la para proyecto'] });
    expect(res).toHaveLength(1);
  });
});

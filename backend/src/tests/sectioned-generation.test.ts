import { describe, it, expect, vi, afterEach } from 'vitest';
import * as aiService from '../services/ai.service';
import {
  buildOutlinePrompt, parseOutline, renderOutline, OUTLINE_MARKER, MAX_OUTLINE_PHASES, MAX_OUTLINE_ANNEXES
} from '../services/project-outline';
import {
  buildProjectParts, buildPartPrompt, generateProjectBySections, isSectionedGenerationEnabled, mapWithConcurrency,
  SECTION_CONCURRENCY
} from '../services/sectioned-generation.service';

const OUTLINE = {
  titulo: 'El mapa del cuerpo',
  productoFinal: 'Atlas anatómico',
  fases: [
    { numero: 1, titulo: 'Lanzamiento', sesiones: '3', ras: ['RA1 del módulo 0640'], actividades: [{ numero: 1, titulo: 'Reto', resumen: 'Pregunta motriz' }] },
    { numero: 2, titulo: 'Cartografía', actividades: [{ numero: 2, titulo: 'Planos' }, { numero: 3, titulo: 'Ejes' }] }
  ],
  anexos: Array.from({ length: 5 }, (_, i) => ({ numero: i + 1, titulo: `Ficha ${i + 1}`, actividad: 2 }))
};

const aiResult = (text: string, extra: Record<string, unknown> = {}) => ({
  text, provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash', requestedModel: 'deepseek/deepseek-v4.1-flash',
  fallbackUsed: false, cascadeLog: ['deepseek/deepseek-v4.1-flash: OK'], ...extra
}) as aiService.AiGenerationResult;

/** Responde al esqueleto con OUTLINE y a cada parte con su clave, extraída del encabezado pedido. */
const mockSections = (outline: object = OUTLINE) =>
  vi.spyOn(aiService, 'generateAiContentWithFallback').mockImplementation(async (prompt: string) => {
    if (prompt.includes(OUTLINE_MARKER)) return aiResult(`\`\`\`json\n${JSON.stringify(outline)}\n\`\`\``);
    const task = prompt.split('ÚNICAMENTE ')[1] || '';
    return aiResult(`\`\`\`markdown\nTEXTO DE: ${task.slice(0, 160)}\n\`\`\``);
  });

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.SECTIONED_GENERATION;
});

describe('Esqueleto del proyecto (project-outline)', () => {
  it('buildOutlinePrompt debería añadir al prompt la petición del esqueleto en JSON', () => {
    const prompt = buildOutlinePrompt('PROMPT BASE');
    expect(prompt.startsWith('PROMPT BASE')).toBe(true);
    expect(prompt).toContain(OUTLINE_MARKER);
    expect(prompt).toContain('"fases"');
  });

  it('parseOutline debería aceptar JSON con texto o bloques de código alrededor y normalizarlo', () => {
    const raw = { ...OUTLINE, fases: [...OUTLINE.fases, { titulo: '', actividades: [] }, { titulo: 'Sin actividades válidas', actividades: [{ titulo: '' }] }] };
    const outline = parseOutline(`Aquí tienes:\n\`\`\`json\n${JSON.stringify(raw)}\n\`\`\``);
    expect(outline?.titulo).toBe('El mapa del cuerpo');
    expect(outline?.fases).toHaveLength(2);
    expect(outline?.anexos).toHaveLength(5);
    expect(outline?.fases[0]?.ras).toEqual(['RA1 del módulo 0640']);
  });

  it('parseOutline debería numerar por posición cuando faltan números y descartar anexos sin título', () => {
    const outline = parseOutline(JSON.stringify({
      titulo: 'T', fases: [{ titulo: 'F', sesiones: 4, actividades: [{ titulo: 'A' }, { numero: 'x', titulo: 'B' }] }],
      anexos: [{ titulo: 'Ficha' }, { titulo: '' }, { numero: 7, titulo: 'Diana', actividad: 'no' }]
    }));
    expect(outline?.fases[0]).toMatchObject({ numero: 1, sesiones: '4', actividades: [{ numero: 1 }, { numero: 2 }] });
    expect(outline?.anexos).toEqual([{ numero: 1, titulo: 'Ficha' }, { numero: 7, titulo: 'Diana' }]);
    expect(outline?.productoFinal).toBeUndefined();
  });

  it('parseOutline debería devolver null si la respuesta no sirve', () => {
    expect(parseOutline('no es JSON')).toBeNull();
    expect(parseOutline('{ roto }')).toBeNull();
    expect(parseOutline(null)).toBeNull();
    expect(parseOutline(JSON.stringify({ titulo: 'Sin fases', fases: [] }))).toBeNull();
    expect(parseOutline(JSON.stringify({ fases: OUTLINE.fases }))).toBeNull();
  });

  it('parseOutline debería limitar el número de fases y anexos', () => {
    const phase = OUTLINE.fases[1];
    const outline = parseOutline(JSON.stringify({
      titulo: 'T',
      fases: Array.from({ length: MAX_OUTLINE_PHASES + 3 }, () => phase),
      anexos: Array.from({ length: MAX_OUTLINE_ANNEXES + 5 }, (_, i) => ({ titulo: `A${i}` }))
    }));
    expect(outline?.fases).toHaveLength(MAX_OUTLINE_PHASES);
    expect(outline?.anexos).toHaveLength(MAX_OUTLINE_ANNEXES);
  });

  it('renderOutline debería listar fases, actividades y anexos', () => {
    const text = renderOutline(parseOutline(JSON.stringify(OUTLINE))!);
    expect(text).toContain('Título: El mapa del cuerpo');
    expect(text).toContain('Producto final: Atlas anatómico');
    expect(text).toContain('Fase 1. Lanzamiento (sesiones: 3 — RA/CE: RA1 del módulo 0640)');
    expect(text).toContain('  - Actividad 1. Reto: Pregunta motriz');
    expect(text).toContain('Fase 2. Cartografía\n');
    expect(text).toContain('  - Anexo 5. Ficha 5 (actividad 2)');
    expect(renderOutline({ titulo: 'T', fases: [], anexos: [] })).toBe('Título: T');
  });
});

describe('Generación por partes (sectioned-generation.service)', () => {
  it('buildProjectParts debería ordenar inicio, fases, evaluación, cierre y anexos en grupos de 4', () => {
    const parts = buildProjectParts(parseOutline(JSON.stringify(OUTLINE))!);
    expect(parts.map(p => p.key)).toEqual(['inicio', 'fase-1', 'fase-2', 'evaluacion', 'cierre', 'anexos-1', 'anexos-5']);
    expect(parts[1]?.prefix).toBe('## Desarrollo de las fases y actividades');
    expect(parts[2]?.prefix).toBeUndefined();
    expect(parts[5]?.prefix).toBe('## Anexos');
    expect(parts[1]?.task).toContain('"#### Actividad 1. Reto"');
    expect(parts[5]?.task).toContain('"### Anexo 4. Ficha 4"');
    expect(parts[6]?.task).toContain('"### Anexo 5. Ficha 5"');
  });

  it('buildProjectParts debería usar los encabezados en catalán y omitir anexos si no hay', () => {
    const outline = { ...parseOutline(JSON.stringify(OUTLINE))!, anexos: [] };
    const parts = buildProjectParts(outline, 'catalan');
    expect(parts[1]?.prefix).toBe('## Desenvolupament de les fases i activitats');
    expect(parts[1]?.task).toContain('"#### Activitat 1. Reto"');
    expect(parts.map(p => p.key)).not.toContain('anexos-1');
    const withAnnexes = buildProjectParts(parseOutline(JSON.stringify(OUTLINE))!, 'catalan');
    expect(withAnnexes[withAnnexes.length - 2]?.prefix).toBe('## Annexos');
  });

  it('buildPartPrompt debería incluir el prompt, el esqueleto y solo la tarea de la parte', () => {
    const prompt = buildPartPrompt('PROMPT', 'ESQUELETO', { key: 'cierre', task: 'el cierre.' });
    expect(prompt).toContain('PROMPT');
    expect(prompt).toContain('ESQUELETO');
    expect(prompt).toContain('escribe ÚNICAMENTE el cierre.');
  });

  it('isSectionedGenerationEnabled debería estar activo salvo SECTIONED_GENERATION=false', () => {
    expect(isSectionedGenerationEnabled()).toBe(true);
    process.env.SECTIONED_GENERATION = 'false';
    expect(isSectionedGenerationEnabled()).toBe(false);
  });

  it('mapWithConcurrency debería respetar el límite y el orden, y dejar de lanzar tras un fallo', async () => {
    let active = 0;
    let max = 0;
    const results = await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async n => {
      active++;
      max = Math.max(max, active);
      await new Promise(resolve => setTimeout(resolve, 7 - n));
      active--;
      return n * 10;
    });
    expect(results).toEqual([10, 20, 30, 40, 50, 60]);
    expect(max).toBe(2);

    const seen: number[] = [];
    await expect(mapWithConcurrency([1, 2, 3, 4], 1, async n => {
      seen.push(n);
      if (n === 2) throw new Error('fallo');
      return n;
    })).rejects.toThrow('fallo');
    expect(seen).toEqual([1, 2]);
    expect(await mapWithConcurrency([], 3, async n => n)).toEqual([]);
  });

  it('generateProjectBySections debería generar esqueleto y partes y unirlas en orden', async () => {
    const spy = mockSections();
    const onPhaseChange = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await generateProjectBySections({
      prompt: 'PROMPT', instruction: 'SISTEMA', provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash', onPhaseChange
    });

    expect(spy).toHaveBeenCalledTimes(1 + 7);
    expect(spy.mock.calls[0]?.[3]).toBe(onPhaseChange);
    expect(spy.mock.calls[1]?.[3]).toBeUndefined();
    expect(spy.mock.calls[1]?.[4]).toBe('deepseek/deepseek-v4.1-flash');
    expect(spy.mock.calls[1]?.[5]).toEqual({ reasoning: false });
    expect(spy.mock.calls.every(call => call[1] === 'SISTEMA')).toBe(true);
    const text = result.text;
    expect(text).not.toContain('```');
    expect(text.indexOf('el título "El mapa del cuerpo"')).toBeLessThan(text.indexOf('## Desarrollo de las fases y actividades'));
    expect(text.indexOf('## Desarrollo de las fases y actividades')).toBeLessThan(text.indexOf('"### Fase 1. Lanzamiento"'));
    expect(text.indexOf('"### Fase 2. Cartografía"')).toBeLessThan(text.indexOf('el apartado de evaluación'));
    expect(text.indexOf('los apartados finales')).toBeLessThan(text.indexOf('## Anexos'));
    expect(result).toMatchObject({ provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash', fallbackUsed: false });
    expect(result.cascadeLog?.[0]).toBe('[esqueleto] deepseek/deepseek-v4.1-flash: OK');
    expect(result.cascadeLog).toContainEqual(expect.stringMatching(/^\[anexos-5\] \d+ ms$/));
  });

  it('generateProjectBySections no debería superar el límite de partes simultáneas', async () => {
    let active = 0;
    let max = 0;
    const outline = { ...OUTLINE, fases: Array.from({ length: 6 }, (_, i) => ({ ...OUTLINE.fases[1], numero: i + 1 })) };
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockImplementation(async (prompt: string) => {
      if (prompt.includes(OUTLINE_MARKER)) return aiResult(JSON.stringify(outline));
      active++;
      max = Math.max(max, active);
      await new Promise(resolve => setTimeout(resolve, 5));
      active--;
      return aiResult('parte');
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await generateProjectBySections({ prompt: 'P', instruction: 'I', provider: 'openrouter' });
    expect(max).toBe(SECTION_CONCURRENCY);
  });

  it('generateProjectBySections debería seguir con el proveedor de respaldo y conservar el modelo de Gemini', async () => {
    const spy = vi.spyOn(aiService, 'generateAiContentWithFallback')
      .mockResolvedValueOnce(aiResult(JSON.stringify({ ...OUTLINE, anexos: [] }), { provider: 'gemini', model: 'gemini-3.6-flash', requestedModel: undefined }))
      .mockResolvedValueOnce(aiResult('inicio', { fallbackUsed: true, model: 'modelo-respaldo', requestedModel: 'modelo-respaldo', cascadeLog: undefined }))
      .mockResolvedValue(aiResult('parte', { model: 'modelo-respaldo', requestedModel: 'modelo-respaldo' }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const result = await generateProjectBySections({ prompt: 'P', instruction: 'I', provider: 'gemini', model: 'gemini-3.6-flash' });

    expect(spy.mock.calls[1]?.[2]).toBe('gemini');
    expect(spy.mock.calls[1]?.[4]).toBe('gemini-3.6-flash');
    const later = spy.mock.calls.slice(SECTION_CONCURRENCY + 1);
    expect(later.every(call => call[2] === 'openrouter' && call[4] === 'modelo-respaldo')).toBe(true);
    expect(result.fallbackUsed).toBe(true);
    expect(result.model).toBe('gemini-3.6-flash + modelo-respaldo');
  });

  it('generateProjectBySections debería olvidar el modelo elegido si responde otro proveedor sin modelo pedido', async () => {
    const spy = vi.spyOn(aiService, 'generateAiContentWithFallback')
      .mockResolvedValueOnce(aiResult(JSON.stringify(OUTLINE), { provider: 'gemini', model: 'gemini-3.6-flash', requestedModel: undefined }))
      .mockResolvedValue(aiResult('parte', { provider: 'gemini', model: 'gemini-3.6-flash', requestedModel: undefined }));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await generateProjectBySections({ prompt: 'P', instruction: 'I', provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash' });
    expect(spy.mock.calls[1]?.[2]).toBe('gemini');
    expect(spy.mock.calls[1]?.[4]).toBeUndefined();
  });

  it('generateProjectBySections debería generar en una sola llamada si el esqueleto no es válido', async () => {
    const spy = vi.spyOn(aiService, 'generateAiContentWithFallback')
      .mockResolvedValueOnce(aiResult('Aquí tienes el proyecto completo...'))
      .mockResolvedValueOnce(aiResult('# Proyecto completo'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await generateProjectBySections({ prompt: 'PROMPT', instruction: 'I', provider: 'openrouter', model: 'm' });

    expect(result.text).toBe('# Proyecto completo');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1]).toEqual(['PROMPT', 'I', 'openrouter', undefined, 'm']);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Sections]'));
  });

  it('generateProjectBySections debería fallar si falla el esqueleto o cualquier parte', async () => {
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockRejectedValueOnce(new Error('sin esqueleto'));
    await expect(generateProjectBySections({ prompt: 'P', instruction: 'I', provider: 'openrouter' })).rejects.toThrow('sin esqueleto');

    vi.restoreAllMocks();
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockImplementation(async (prompt: string) => {
      if (prompt.includes(OUTLINE_MARKER)) return aiResult(JSON.stringify(OUTLINE));
      if (prompt.includes('"### Fase 2.')) throw Object.assign(new Error('parte caída'), { cascadeLog: ['m: HTTP 503'] });
      return aiResult('parte');
    });
    await expect(generateProjectBySections({ prompt: 'P', instruction: 'I', provider: 'openrouter' })).rejects.toThrow('parte caída');
  });
});

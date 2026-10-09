import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processQueue, initQueue } from '../services/queue.service';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import * as aiService from '../services/ai.service';
import * as sseService from '../services/sse.service';
import * as sectionedService from '../services/sectioned-generation.service';

describe('Queue Service', () => {
  beforeEach(() => {
    vi.spyOn(sseService, 'sendToUser').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería salir si ya está procesando', async () => {
    // Para forzar la concurrencia, llamamos dos veces
    // Es difícil de testear de forma síncrona sin exportar isProcessing, pero lo simulamos:
    vi.spyOn(Project, 'findOneAndUpdate').mockImplementationOnce((async () => {
      processQueue(); // Llama a sí mismo y debería salir inmediatamente
      return null;
    }) as any);
    await processQueue();
    expect(Project.findOneAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('debería procesar un proyecto con éxito', async () => {
    const mockProject = {
      _id: 'proj1',
      userId: 'user1',
      aiPrompt: 'prompt',
      aiInstruction: 'instruction',
      status: 'en_cola',
      title: 'test',
      save: vi.fn().mockResolvedValue(true)
    };
    
    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProject as any)
      .mockResolvedValueOnce(null); // Termina el bucle
      
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockImplementation(async (_prompt, _instr, _prov, notify) => {
      if (notify) {
        await notify('analizando', 'gemini');
        await notify('reintentando', 'openrouter');
      }
      return {
        text: 'Contenido AI',
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        fallbackUsed: false
      };
    });
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await processQueue();

    expect(mockProject.status).toBe('borrador');
    expect((mockProject as any).generatedContent?.rawText).toBe('Contenido AI');
    expect((mockProject as any).usedModel).toBe('gemini-3.8-flash');
    expect((mockProject as any).generationTimeMs).toBeDefined();
    expect((mockProject as any).generationTimeMs).toBeGreaterThanOrEqual(0);
    expect(mockProject.save).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[Queue/AI]'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('generado por (gemini | modelo: gemini-3.8-flash)'));
    expect(sseService.sendToUser).toHaveBeenCalledWith('user1', expect.objectContaining({
      type: 'PROJECT_COMPLETED',
      generationTimeMs: expect.any(Number)
    }));
    consoleLogSpy.mockRestore();
  });

  it('debería procesar con fallback activado', async () => {
    const mockProject = {
      _id: 'proj_fallback',
      userId: 'user_fb',
      aiPrompt: 'prompt',
      aiInstruction: 'instruction',
      aiProvider: 'gemini',
      status: 'en_cola',
      title: 'test fallback',
      save: vi.fn().mockResolvedValue(true)
    };
    
    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProject as any)
      .mockResolvedValueOnce(null);
      
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockResolvedValue({
      text: 'Contenido OpenRouter',
      provider: 'openrouter',
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      fallbackUsed: true,
      cascadeLog: ['gemini-3.8-flash: HTTP 503', 'meta-llama/llama-3.3-70b-instruct:free: OK']
    });
    vi.spyOn(ActivityLog.prototype, 'save').mockImplementation(function (this: any) {
      expect(this.details.cascadeLog).toEqual([
        'gemini-3.8-flash: HTTP 503',
        'meta-llama/llama-3.3-70b-instruct:free: OK'
      ]);
      return Promise.resolve(this);
    } as any);

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await processQueue();

    expect(mockProject.status).toBe('borrador');
    expect((mockProject as any).usedAiProvider).toBe('openrouter');
    expect((mockProject as any).usedModel).toBe('meta-llama/llama-3.3-70b-instruct:free');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('fallback: openrouter | modelo: meta-llama/llama-3.3-70b-instruct:free'));
    consoleLogSpy.mockRestore();
  });

  it('debería manejar errores de la IA y registrar el tiempo transcurrido en el log', async () => {
    const mockProject = {
      _id: 'proj2',
      userId: 'user2',
      status: 'en_cola',
      title: 'Proyecto Fallido',
      save: vi.fn().mockResolvedValue(true)
    };
    
    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProject as any)
      .mockResolvedValueOnce(null);
      
    vi.spyOn(aiService, 'generateAiContentWithFallback').mockRejectedValue(Object.assign(new Error('AI failed'), {
      cascadeLog: ['gemini-3.8-flash: HTTP 503', 'gemini-3.7-flash: HTTP 503']
    }));
    vi.spyOn(ActivityLog.prototype, 'save').mockImplementation(function (this: any) {
      if (this.action === 'ERROR_GENERATE_PROJECT') {
        expect(this.details.cascadeLog).toEqual([
          'gemini-3.8-flash: HTTP 503',
          'gemini-3.7-flash: HTTP 503'
        ]);
      }
      return Promise.resolve(this);
    } as any);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await processQueue();

    expect(mockProject.status).toBe('error');
    expect((mockProject as any).errorDetail).toBe('AI failed');
    expect((mockProject as any).generationTimeMs).toBeDefined();
    expect((mockProject as any).generationTimeMs).toBeGreaterThanOrEqual(0);
    expect(mockProject.save).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[Queue/AI] Error al generar proyecto'), expect.any(Error));
    expect(sseService.sendToUser).toHaveBeenCalledWith('user2', expect.objectContaining({
      type: 'PROJECT_ERROR',
      generationTimeMs: expect.any(Number)
    }));
    consoleErrorSpy.mockRestore();
  });

  it('debería restaurar proyectos en estado generando a en_cola al inicializar', async () => {
    vi.spyOn(Project, 'updateMany').mockResolvedValueOnce({ modifiedCount: 1 } as any);
    vi.spyOn(Project, 'findOneAndUpdate').mockResolvedValueOnce(null); // Evita loop en processQueue

    await expect(initQueue()).resolves.not.toThrow();
    expect(Project.updateMany).toHaveBeenCalledWith({ status: 'generando' }, { status: 'en_cola', $unset: { generationStartedAt: 1 } });
  });


  it('debería capturar errores al inicializar la cola', async () => {
    vi.spyOn(Project, 'updateMany').mockRejectedValueOnce(new Error('DB connection failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(initQueue()).resolves.not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('debería manejar proyectos sin userId y errores sin message', async () => {
    const mockProjectNoUser = {
      _id: 'proj_no_user',
      status: 'en_cola',
      title: 'No User Proj',
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProjectNoUser as any)
      .mockResolvedValueOnce(null);

    vi.spyOn(aiService, 'generateAiContentWithFallback').mockRejectedValue('Error de texto plano');
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await processQueue();

    expect(mockProjectNoUser.status).toBe('error');
    expect((mockProjectNoUser as any).errorDetail).toBe('Error de texto plano');
    expect(sseService.sendToUser).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('debería generar por partes con el idioma y el modelo del proyecto', async () => {
    const mockProject = {
      _id: 'proj_sections', userId: 'user_s', aiPrompt: 'prompt', aiInstruction: 'instruction',
      aiProvider: 'openrouter', aiModel: 'deepseek/deepseek-v4.1-flash', language: 'catalan',
      status: 'en_cola', title: 'Per parts', save: vi.fn().mockResolvedValue(true)
    };
    vi.spyOn(Project, 'findOneAndUpdate').mockResolvedValueOnce(mockProject as any).mockResolvedValueOnce(null);
    const sections = vi.spyOn(sectionedService, 'generateProjectBySections').mockResolvedValue({
      text: 'Projecte per parts', provider: 'openrouter', model: 'deepseek/deepseek-v4.1-flash', fallbackUsed: false
    });
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await processQueue();

    expect(sections).toHaveBeenCalledWith(expect.objectContaining({
      prompt: 'prompt', instruction: 'instruction', provider: 'openrouter',
      model: 'deepseek/deepseek-v4.1-flash', language: 'catalan', onPhaseChange: expect.any(Function)
    }));
    expect(mockProject.status).toBe('borrador');
    expect((mockProject as any).generatedContent.rawText).toBe('Projecte per parts');
  });

  it('debería generar en una sola llamada con SECTIONED_GENERATION=false', async () => {
    process.env.SECTIONED_GENERATION = 'false';
    const mockProject = {
      _id: 'proj_single', userId: 'user_1', aiPrompt: 'prompt', aiInstruction: 'instruction',
      status: 'en_cola', title: 'Una llamada', save: vi.fn().mockResolvedValue(true)
    };
    vi.spyOn(Project, 'findOneAndUpdate').mockResolvedValueOnce(mockProject as any).mockResolvedValueOnce(null);
    const sections = vi.spyOn(sectionedService, 'generateProjectBySections');
    const single = vi.spyOn(aiService, 'generateAiContentWithFallback').mockResolvedValue({
      text: 'Texto', provider: 'gemini', model: 'gemini-3.6-flash', fallbackUsed: false
    });
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await processQueue();
    delete process.env.SECTIONED_GENERATION;

    expect(sections).not.toHaveBeenCalled();
    expect(single).toHaveBeenCalledTimes(1);
    expect(single).toHaveBeenCalledWith('prompt', 'instruction', 'gemini', expect.any(Function), undefined);
    expect(mockProject.status).toBe('borrador');
  });

  it('debería manejar proyectos sin userId en éxito', async () => {
    const mockProjectSuccessNoUser = {
      _id: 'proj_success_no_user',
      status: 'en_cola',
      title: 'Success No User',
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProjectSuccessNoUser as any)
      .mockResolvedValueOnce(null);

    vi.spyOn(aiService, 'generateAiContentWithFallback').mockResolvedValue({
      text: 'Texto generado',
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      fallbackUsed: false
    });
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);

    await processQueue();

    expect(mockProjectSuccessNoUser.status).toBe('borrador');
    expect(sseService.sendToUser).not.toHaveBeenCalled();
  });
});

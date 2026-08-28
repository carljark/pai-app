import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processQueue, initQueue } from '../services/queue.service';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import * as aiService from '../services/ai.service';
import * as sseService from '../services/sse.service';

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
    vi.spyOn(Project, 'findOneAndUpdate').mockImplementationOnce(async () => {
      processQueue(); // Llama a sí mismo y debería salir inmediatamente
      return null;
    });
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
      
    vi.spyOn(aiService, 'generateGeminiContent').mockResolvedValue('Contenido AI');
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);

    await processQueue();

    expect(mockProject.status).toBe('borrador');
    expect(mockProject.generatedContent?.rawText).toBe('Contenido AI');
    expect(mockProject.save).toHaveBeenCalled();
    expect(sseService.sendToUser).toHaveBeenCalledWith('user1', expect.objectContaining({ type: 'PROJECT_COMPLETED' }));
  });

  it('debería manejar errores de la IA', async () => {
    const mockProject = {
      _id: 'proj2',
      userId: 'user2',
      status: 'en_cola',
      save: vi.fn().mockResolvedValue(true)
    };
    
    vi.spyOn(Project, 'findOneAndUpdate')
      .mockResolvedValueOnce(mockProject as any)
      .mockResolvedValueOnce(null);
      
    vi.spyOn(aiService, 'generateGeminiContent').mockRejectedValue(new Error('AI failed'));
    vi.spyOn(ActivityLog.prototype, 'save').mockResolvedValue(true as any);

    await processQueue();

    expect(mockProject.status).toBe('error');
    expect((mockProject as any).errorDetail).toBe('AI failed');
    expect(mockProject.save).toHaveBeenCalled();
    expect(sseService.sendToUser).toHaveBeenCalledWith('user2', expect.objectContaining({ type: 'PROJECT_ERROR' }));
  });

  it('debería restaurar proyectos en estado generando a en_cola al inicializar', async () => {
    vi.spyOn(Project, 'updateMany').mockResolvedValueOnce({ modifiedCount: 1 } as any);
    vi.spyOn(Project, 'findOneAndUpdate').mockResolvedValueOnce(null); // Evita loop en processQueue

    await expect(initQueue()).resolves.not.toThrow();
    expect(Project.updateMany).toHaveBeenCalledWith({ status: 'generando' }, { status: 'en_cola' });
  });

  it('debería capturar errores al inicializar la cola', async () => {
    vi.spyOn(Project, 'updateMany').mockRejectedValueOnce(new Error('DB connection failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(initQueue()).resolves.not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { generateGeminiContent } from '../services/ai.service';
import { sendToUser } from './sse.service';

let isProcessing = false;

export async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    while (true) {
      // Tomar el siguiente proyecto en cola
      const nextProject = await Project.findOneAndUpdate(
        { status: 'en_cola' },
        { status: 'generando' },
        { sort: { createdAt: 1 }, new: true }
      );

      if (!nextProject) {
        break; // No hay más proyectos en cola
      }

      const userId = nextProject.userId?.toString();
      if (userId) {
        sendToUser(userId, { type: 'PROJECT_STATUS', projectId: nextProject._id, status: 'generando' });
      }

      try {
        const startTime = Date.now();
        // Llamada a Gemini
        const text = await generateGeminiContent(nextProject.aiPrompt || '', nextProject.aiInstruction || '');
        const generationTimeMs = Date.now() - startTime;

        // Actualizar proyecto a borrador
        nextProject.status = 'borrador';
        nextProject.generatedContent = { rawText: text };
        // Limpiamos los prompts guardados temporalmente para no ocupar espacio
        nextProject.aiPrompt = undefined;
        nextProject.aiInstruction = undefined;
        await nextProject.save();

        // Registrar log de éxito
        await new ActivityLog({
          userId: nextProject.userId,
          action: 'GENERATE_PROJECT',
          projectId: nextProject._id,
          details: { generationTimeMs, title: nextProject.title }
        }).save();

        // Notificar éxito al usuario
        if (userId) {
          sendToUser(userId, { type: 'PROJECT_COMPLETED', projectId: nextProject._id, project: nextProject });
        }
      } catch (error: any) {
        // En caso de fallo de IA
        nextProject.status = 'error';
        nextProject.errorDetail = error.message || error.toString();
        await nextProject.save();

        await new ActivityLog({
          userId: nextProject.userId,
          action: 'ERROR_GENERATE_PROJECT',
          projectId: nextProject._id,
          details: { error: nextProject.errorDetail }
        }).save();

        // Notificar error al usuario
        if (userId) {
          sendToUser(userId, { type: 'PROJECT_ERROR', projectId: nextProject._id, error: nextProject.errorDetail });
        }
      }
    }
  } catch (err) {
    console.error('Error in Queue Worker:', err);
  } finally {
    isProcessing = false;
  }
}

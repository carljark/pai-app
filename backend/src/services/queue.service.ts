import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { generateGeminiContent } from '../services/ai.service';
import { sendToUser } from './sse.service';
import { syncProjectNotification } from './notification.service';

let isProcessing = false;

export async function initQueue() {
  try {
    const restored = await Project.updateMany(
      { status: 'generando' },
      { status: 'en_cola' }
    );
    if (restored.modifiedCount > 0) {
      console.log(`[Queue] Restaurados ${restored.modifiedCount} proyectos atascados en 'generando' a 'en_cola'.`);
    }
    processQueue().catch(console.error);
  } catch (err) {
    console.error('[Queue] Error al inicializar la cola:', err);
  }
}

async function handleProjectSuccess(project: any, text: string, generationTimeMs: number) {
  console.log(`[Queue/AI] Proyecto "${project.title}" (${project._id}) generado por la IA en ${generationTimeMs}ms (${(generationTimeMs / 1000).toFixed(2)}s).`);
  project.status = 'borrador';
  project.generationTimeMs = generationTimeMs;
  project.generatedContent = { rawText: text };
  project.aiPrompt = undefined;
  project.aiInstruction = undefined;
  project.updatedAt = new Date();
  await project.save();

  await new ActivityLog({
    userId: project.userId,
    action: 'GENERATE_PROJECT',
    projectId: project._id,
    details: { generationTimeMs, title: project.title }
  }).save();

  const userId = project.userId?.toString();
  if (userId) {
    sendToUser(userId, { type: 'PROJECT_COMPLETED', projectId: project._id, project, generationTimeMs });
  }
  await syncProjectNotification(project, {
    type: 'PROJECT_COMPLETED',
    title: 'Proyecto Generado',
    message: `El proyecto se ha generado satisfactoriamente (${(generationTimeMs / 1000).toFixed(1)}s).`
  });
}

async function handleProjectError(project: any, error: any, generationTimeMs: number) {
  console.error(`[Queue/AI] Error al generar proyecto "${project.title}" (${project._id}) tras ${generationTimeMs}ms (${(generationTimeMs / 1000).toFixed(2)}s):`, error);
  project.status = 'error';
  project.generationTimeMs = generationTimeMs;
  project.errorDetail = error?.message || error?.toString();
  project.updatedAt = new Date();
  await project.save();

  await new ActivityLog({
    userId: project.userId,
    action: 'ERROR_GENERATE_PROJECT',
    projectId: project._id,
    details: { error: project.errorDetail, generationTimeMs, title: project.title }
  }).save();

  const userId = project.userId?.toString();
  if (userId) {
    sendToUser(userId, { type: 'PROJECT_ERROR', projectId: project._id, error: project.errorDetail, generationTimeMs });
  }
  await syncProjectNotification(project, {
    type: 'PROJECT_ERROR',
    title: 'Error de Generación',
    message: `Error al generar el proyecto: ${project.errorDetail}`
  });
}

async function executeProjectGeneration(project: any) {
  const userId = project.userId?.toString();
  if (userId) {
    sendToUser(userId, {
      type: 'PROJECT_STATUS',
      projectId: project._id,
      status: 'generando',
      generationStartedAt: project.generationStartedAt
    });
  }
  await syncProjectNotification(project, {
    type: 'PROJECT_STATUS',
    title: 'Generando Proyecto',
    message: `Generando proyecto con IA...`
  });

  const startTime = Date.now();
  try {
    const text = await generateGeminiContent(project.aiPrompt || '', project.aiInstruction || '');
    const generationTimeMs = Date.now() - startTime;
    await handleProjectSuccess(project, text, generationTimeMs);
  } catch (error: any) {
    const generationTimeMs = Date.now() - startTime;
    await handleProjectError(project, error, generationTimeMs);
  }
}

export async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    while (true) {
      const nextProject = await Project.findOneAndUpdate(
        { status: 'en_cola' },
        { status: 'generando', generationStartedAt: new Date() },
        { sort: { createdAt: 1 }, returnDocument: 'after' }
      );
      if (!nextProject) break;
      await executeProjectGeneration(nextProject);
    }
  } catch (err) {
    console.error('Error in Queue Worker:', err);
  } finally {
    isProcessing = false;
  }
}

import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { generateAiContentWithFallback } from '../services/ai.service';
import { sendToUser } from './sse.service';
import { syncProjectNotification } from './notification.service';

let isProcessing = false;

export async function initQueue() {
  try {
    const restored = await Project.updateMany(
      { status: 'generando' },
      { status: 'en_cola', $unset: { generationStartedAt: 1 } }
    );
    if (restored.modifiedCount > 0) {
      console.log(`[Queue] Restaurados ${restored.modifiedCount} proyectos atascados en 'generando' a 'en_cola'.`);
    }
    processQueue().catch(console.error);
  } catch (err) {
    console.error('[Queue] Error al inicializar la cola:', err);
  }
}

async function saveProjectSuccess(
  project: any,
  text: string,
  generationTimeMs: number,
  fallbackUsed = false,
  model?: string
) {
  const modelNote = model ? ` | modelo: ${model}` : '';
  const providerNote = fallbackUsed ? `(fallback: ${project.usedAiProvider}${modelNote})` : `(${project.usedAiProvider || 'gemini'}${modelNote})`;
  console.log(`[Queue/AI] Proyecto "${project.title}" (${project._id}) generado por ${providerNote} en ${generationTimeMs}ms.`);
  project.status = 'borrador';
  project.phase = undefined;
  project.generationTimeMs = generationTimeMs;
  project.generatedContent = { rawText: text };
  project.usedModel = model;
  project.aiPrompt = undefined;
  project.aiInstruction = undefined;
  project.updatedAt = new Date();
  await project.save();

  await new ActivityLog({
    userId: project.userId,
    action: 'GENERATE_PROJECT',
    projectId: project._id,
    details: { generationTimeMs, title: project.title, provider: project.usedAiProvider, fallbackUsed, model }
  }).save();
}

async function notifyProjectSuccess(project: any, generationTimeMs: number) {
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

async function handleProjectSuccess(
  project: any,
  text: string,
  generationTimeMs: number,
  fallbackUsed = false,
  model?: string
) {
  await saveProjectSuccess(project, text, generationTimeMs, fallbackUsed, model);
  await notifyProjectSuccess(project, generationTimeMs);
}

async function saveProjectError(project: any, error: any, generationTimeMs: number) {
  console.error(`[Queue/AI] Error al generar proyecto "${project.title}" (${project._id}) tras ${generationTimeMs}ms:`, error);
  project.status = 'error';
  project.phase = undefined;
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
}

async function notifyProjectError(project: any, generationTimeMs: number) {
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

async function handleProjectError(project: any, error: any, generationTimeMs: number) {
  await saveProjectError(project, error, generationTimeMs);
  await notifyProjectError(project, generationTimeMs);
}

function createPhaseNotifier(project: any) {
  return async (phase: 'analizando' | 'reintentando', provider: string) => {
    project.phase = phase;
    const msg = phase === 'reintentando' ? `Reintentando con ${provider}...` : 'Analizando...';
    await syncProjectNotification(project, {
      type: 'PROJECT_STATUS',
      title: 'Generando Proyecto',
      message: msg,
      phase
    });
  };
}

async function startProjectGeneration(project: any) {
  project.status = 'generando';
  project.phase = 'analizando';
  project.generationStartedAt = new Date();
  await project.save();

  const userId = project.userId?.toString();
  if (userId) {
    sendToUser(userId, {
      type: 'PROJECT_STATUS',
      projectId: project._id,
      status: 'generando',
      phase: 'analizando',
      generationStartedAt: project.generationStartedAt
    });
  }
  await syncProjectNotification(project, {
    type: 'PROJECT_STATUS',
    title: 'Generando Proyecto',
    message: 'Analizando...',
    phase: 'analizando'
  });
}

async function executeProjectGeneration(project: any) {
  await startProjectGeneration(project);
  const notifyPhase = createPhaseNotifier(project);
  const startTime = Date.now();

  try {
    const result = await generateAiContentWithFallback(
      project.aiPrompt || '',
      project.aiInstruction || '',
      project.aiProvider || 'gemini',
      notifyPhase
    );
    project.usedAiProvider = result.provider;
    await handleProjectSuccess(project, result.text, Date.now() - startTime, result.fallbackUsed, result.model);
  } catch (error: any) {
    await handleProjectError(project, error, Date.now() - startTime);
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

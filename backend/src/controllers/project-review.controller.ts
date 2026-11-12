import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';
import { resolveProvider } from '../data/ai-models';
import { projectLanguage } from '../services/translation.service';
import { requestProjectReview, type ReviewAiChoice } from '../services/project-review.service';

/** Una revisión marcada como `revisando` hace más de este tiempo se considera abandonada. */
export const REVIEW_LOCK_MS = 15 * 60 * 1000;

/** Proveedor y modelo elegidos en el taller o, si no llegan, los de la generación. */
const resolveAiChoice = (body: any, project: any): ReviewAiChoice => {
  const provider = resolveProvider(body?.aiProvider || project.aiProvider);
  const model = body?.aiModel || project.aiModel;
  return model ? { provider, model: String(model) } : { provider };
};

/**
 * Marca la revisión como `revisando` solo si no hay otra en curso (o la anterior caducó). Conserva
 * la revisión anterior hasta que termine la nueva. Un único `updateOne` condicional evita carreras.
 */
const acquireReviewLock = async (projectId: unknown): Promise<boolean> => {
  const expired = new Date(Date.now() - REVIEW_LOCK_MS);
  const result = await Project.updateOne(
    { _id: projectId, $or: [{ 'review.status': { $ne: 'revisando' } }, { 'review.startedAt': { $lt: expired } }] },
    { $set: { 'review.status': 'revisando', 'review.startedAt': new Date() }, $unset: { 'review.error': '' } }
  );
  return result.modifiedCount === 1;
};

const markReviewFailed = async (projectId: unknown, error: any) => {
  await Project.updateOne(
    { _id: projectId },
    { $set: { 'review.status': 'error', 'review.finishedAt': new Date(), 'review.error': error?.message || String(error) } }
  );
};

/**
 * Al arrancar no puede haber revisiones en curso (se ejecutan en este proceso): las que quedaron
 * en `revisando` por un reinicio se marcan como fallidas para poder repetirlas enseguida.
 */
export const failInterruptedReviews = async (): Promise<number> => {
  const result = await Project.updateMany(
    { 'review.status': 'revisando' },
    { $set: { 'review.status': 'error', 'review.error': 'Revisión interrumpida por un reinicio del servidor' } }
  );
  if (result.modifiedCount > 0) console.log(`[Project/Review] ${result.modifiedCount} revisiones interrumpidas marcadas como fallidas.`);
  return result.modifiedCount;
};

/** Revisa y guarda en segundo plano; el estado queda en `review.status`. */
export const runProjectReview = async (projectId: unknown, aiChoice: ReviewAiChoice, userId: unknown): Promise<void> => {
  try {
    const project = await Project.findById(projectId);
    if (!project) return;
    const language = projectLanguage(project);
    const { usedModel, ...review } = await requestProjectReview(project, language, aiChoice);
    const { startedAt } = project.review ?? {};
    await Project.updateOne({ _id: projectId }, {
      $set: {
        review: { ...review, status: 'completada', startedAt, finishedAt: new Date(), contentVersion: project.contentVersion, language, usedModel }
      }
    });
    const details = { title: project.title, overall: review.overall, model: usedModel };
    await new ActivityLog({ userId, action: 'REVIEW_PROJECT', projectId, details }).save();
  } catch (error: any) {
    console.error('[Project/Review] Error al revisar el proyecto:', error);
    await markReviewFailed(projectId, error);
  }
};

/**
 * POST /api/projects/:id/review — inicia la revisión con IA del original y responde 202 con el
 * proyecto en estado `revisando`. El contenido no se modifica. Si ya hay una en curso responde 409.
 */
export const reviewProject = async (req: any, res: Response) => {
  try {
    // `requireProjectEditor` ya cargó el proyecto y comprobó los permisos
    const project = req.project;
    if (!project.generatedContent?.rawText) {
      return res.status(400).json({ error: 'El proyecto no tiene contenido que revisar' });
    }
    if (!(await acquireReviewLock(project._id))) {
      return res.status(409).json({ error: 'Ya hay una revisión en curso para este proyecto' });
    }
    const started = await Project.findById(project._id).populate(PROJECT_POPULATE);
    void runProjectReview(project._id, resolveAiChoice(req.body, project), req.user?._id);
    res.status(202).json(started);
  } catch (error: any) {
    console.error('[Project/Review] Error al iniciar la revisión:', error);
    res.status(500).json({ error: 'Error al iniciar la revisión del proyecto' });
  }
};

/** GET /api/projects/:id/review — última revisión del proyecto (o `null`) y si está desactualizada. */
export const getProjectReview = async (req: any, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Proyecto no válido' });
    const project = await Project.findById(req.params.id, { review: 1, contentVersion: 1 }).lean();
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    const review = project.review ?? null;
    const stale = review?.status === 'completada' && review.contentVersion !== project.contentVersion;
    res.json({ review, stale });
  } catch {
    res.status(500).json({ error: 'Error al cargar la revisión del proyecto' });
  }
};

import type { Response } from 'express';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { resolveAiChoice } from './project-review.controller';
import { ApplyError, applySuggestions, selectSuggestions, suggestionKey } from '../services/review-apply.service';

type ApplyBody = { context: string; dimension: string; index?: number };

/** Cuerpo válido de la petición, o el mensaje de error. */
const parseBody = (body: any): ApplyBody | string => {
  if (typeof body?.context !== 'string' || !body.context.trim()) return 'Falta el texto del proyecto';
  if (typeof body?.dimension !== 'string' || !body.dimension) return 'Falta el aspecto de la revisión';
  if (body.index === undefined || body.index === null) return { context: body.context, dimension: body.dimension };
  return Number.isInteger(body.index) && body.index >= 0
    ? { context: body.context, dimension: body.dimension, index: body.index }
    : 'Sugerencia no válida';
};

/**
 * POST /api/projects/:id/review/apply — aplica con IA una sugerencia de la revisión (o, sin `index`,
 * todas las pendientes del aspecto) sobre el texto que se edita (`context`). Devuelve el documento
 * nuevo sin guardarlo: el taller lo pone en el editor (con deshacer) y lo guarda como borrador.
 * Las sugerencias quedan marcadas en `review.applied`.
 */
export const applyReviewSuggestion = async (req: any, res: Response) => {
  try {
    const body = parseBody(req.body);
    if (typeof body === 'string') return res.status(400).json({ error: body });
    // `projectEditGuards` ya cargó el proyecto y comprobó permisos y turno de edición
    const project = req.project;
    const selected = selectSuggestions(project.review, body.dimension, body.index);
    const result = await applySuggestions(body.context, selected, resolveAiChoice(req.body, project));
    const applied = selected.suggestions.map((s) => suggestionKey(body.dimension, s.index));
    await Project.updateOne({ _id: project._id }, { $addToSet: { 'review.applied': { $each: applied } } });
    const details = { title: project.title, dimension: body.dimension, applied, section: result.section, model: result.usedModel };
    await new ActivityLog({ userId: req.user?._id, action: 'APPLY_REVIEW_SUGGESTION', projectId: project._id, details }).save();
    res.json({ newText: result.newText, section: result.section, applied });
  } catch (error: any) {
    if (error instanceof ApplyError) return res.status(error.status).json({ error: error.message });
    console.error('[Project/Review] Error al aplicar la sugerencia:', error);
    res.status(500).json({ error: 'Error al aplicar la sugerencia con la IA' });
  }
};

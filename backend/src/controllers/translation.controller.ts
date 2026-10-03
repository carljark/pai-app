import type { Response } from 'express';
import { Project, CONTENT_LANGUAGES, type ContentLanguage } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';
import { resolveProvider } from "../data/ai-models";
import {
  buildCurriculumGlossary,
  isContentLanguage,
  projectLanguage,
  translateMarkdown
} from '../services/translation.service';

/** Una traducción marcada como `traduciendo` hace más de este tiempo se considera abandonada. */
export const TRANSLATION_LOCK_MS = 30 * 60 * 1000;

type ValidationError = { status: number; message: string };
type AiChoice = { provider: 'gemini' | 'openrouter'; model?: string };

const validateTranslation = (project: any, target: unknown): ValidationError | null => {
  if (!isContentLanguage(target)) return { status: 400, message: 'Idioma de destino no válido' };
  if (!project) return { status: 404, message: 'Proyecto no encontrado' };
  if (!project.generatedContent?.rawText) {
    return { status: 400, message: 'El proyecto no tiene contenido que traducir' };
  }
  if (projectLanguage(project) === target) {
    return { status: 400, message: 'El proyecto ya está en ese idioma' };
  }
  return null;
};

/** Proveedor y modelo elegidos en el taller o, si no llegan, los de la generación. */
const resolveAiChoice = (body: any, project: any): AiChoice => {
  const provider = resolveProvider(body.aiProvider || project.aiProvider);
  const model = body.aiModel || project.aiModel;
  return model ? { provider, model: String(model) } : { provider };
};

/**
 * Marca la traducción como `traduciendo` solo si no hay otra en curso (o la anterior caducó).
 * Al ser un único `updateOne` condicional, dos peticiones simultáneas no pueden obtener ambas el bloqueo.
 */
const acquireTranslationLock = async (projectId: unknown, target: ContentLanguage): Promise<boolean> => {
  const path = `translations.${target}`;
  const expired = new Date(Date.now() - TRANSLATION_LOCK_MS);
  const result = await Project.updateOne(
    {
      _id: projectId,
      $or: [{ [`${path}.status`]: { $ne: 'traduciendo' } }, { [`${path}.startedAt`]: { $lt: expired } }]
    },
    { $set: { [`${path}.status`]: 'traduciendo', [`${path}.startedAt`]: new Date() }, $unset: { [`${path}.error`]: '' } }
  );
  return result.modifiedCount === 1;
};

const markTranslationFailed = async (projectId: unknown, target: ContentLanguage, error: any) => {
  const path = `translations.${target}`;
  await Project.updateOne(
    { _id: projectId },
    { $set: { [`${path}.status`]: 'error', [`${path}.error`]: error?.message || String(error) } }
  );
};

/**
 * Al arrancar el servidor no puede haber ninguna traducción en curso (se ejecutan en este proceso):
 * las que quedaron en `traduciendo` por un reinicio o despliegue se marcan como fallidas para
 * que se puedan reintentar enseguida, sin esperar a que caduque el bloqueo.
 */
export const failInterruptedTranslations = async (): Promise<number> => {
  let total = 0;
  for (const language of CONTENT_LANGUAGES) {
    const path = `translations.${language}`;
    const result = await Project.updateMany(
      { [`${path}.status`]: 'traduciendo' },
      { $set: { [`${path}.status`]: 'error', [`${path}.error`]: 'Traducción interrumpida por un reinicio del servidor' } }
    );
    total += result.modifiedCount;
  }
  if (total > 0) console.log(`[Project/Translate] ${total} traducciones interrumpidas marcadas como fallidas.`);
  return total;
};

/** Traduce y guarda en segundo plano; el estado queda en `translations[target].status`. */
export const runProjectTranslation = async (
  projectId: unknown,
  target: ContentLanguage,
  aiChoice: AiChoice,
  userId: unknown
): Promise<void> => {
  try {
    const project = await Project.findById(projectId);
    if (!project) return;
    const source = projectLanguage(project);
    const glossary = await buildCurriculumGlossary(project.ras || [], source, target);
    const rawText = await translateMarkdown(project.generatedContent!.rawText!, { source, target, glossary, ...aiChoice });
    const translation = { rawText, sourceVersion: project.contentVersion, translatedAt: new Date(), status: 'completada' };
    await Project.updateOne({ _id: projectId }, { $set: { [`translations.${target}`]: translation } });
    await new ActivityLog({ userId, action: 'TRANSLATE_PROJECT', projectId, details: { title: project.title, target } }).save();
  } catch (error: any) {
    console.error('[Project/Translate] Error al traducir el proyecto:', error);
    await markTranslationFailed(projectId, target, error);
  }
};

/**
 * POST /api/projects/:id/translate — inicia la traducción del original al idioma `target`
 * y responde 202 con el proyecto en estado `traduciendo`. El original no se modifica.
 * Si ya hay una traducción en curso a ese idioma responde 409.
 */
export const translateProject = async (req: any, res: Response) => {
  try {
    const { target } = req.body;
    const project = await Project.findById(req.params.id);
    const error = validateTranslation(project, target);
    if (error) return res.status(error.status).json({ error: error.message });

    if (!(await acquireTranslationLock(project!._id, target))) {
      return res.status(409).json({ error: 'Ya hay una traducción en curso para este proyecto' });
    }
    // Se lee antes de lanzar el trabajo para responder siempre con el estado `traduciendo`
    const started = await Project.findById(project!._id).populate(PROJECT_POPULATE);
    void runProjectTranslation(project!._id, target, resolveAiChoice(req.body, project), req.user?._id);
    res.status(202).json(started);
  } catch (error: any) {
    console.error('[Project/Translate] Error al iniciar la traducción:', error);
    res.status(500).json({ error: 'Error al iniciar la traducción del proyecto' });
  }
};

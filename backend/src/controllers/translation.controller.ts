import type { Response } from 'express';
import { Project, type ContentLanguage } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { PROJECT_POPULATE } from './project.controller';
import {
  buildCurriculumGlossary,
  isContentLanguage,
  projectLanguage,
  translateMarkdown
} from '../services/translation.service';

type ValidationError = { status: number; message: string };

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
const resolveAiChoice = (body: any, project: any): { provider: 'gemini' | 'openrouter'; model?: string } => {
  const provider = (body.aiProvider || project.aiProvider) === 'openrouter' ? 'openrouter' : 'gemini';
  const model = body.aiModel || project.aiModel;
  return model ? { provider, model: String(model) } : { provider };
};

const saveTranslation = async (project: any, target: ContentLanguage, rawText: string, userId: unknown) => {
  project.set(`translations.${target}`, {
    rawText,
    sourceVersion: project.contentVersion,
    translatedAt: new Date()
  });
  await project.save();
  await new ActivityLog({
    userId,
    action: 'TRANSLATE_PROJECT',
    projectId: project._id,
    details: { title: project.title, target }
  }).save();
};

/**
 * POST /api/projects/:id/translate — traduce el contenido original al idioma `target`
 * y lo guarda en `translations[target]`. El original no se modifica.
 */
export const translateProject = async (req: any, res: Response) => {
  try {
    const { target } = req.body;
    const project = await Project.findById(req.params.id);
    const error = validateTranslation(project, target);
    if (error) return res.status(error.status).json({ error: error.message });

    const source = projectLanguage(project!);
    const glossary = await buildCurriculumGlossary(project!.ras || [], source, target);
    const rawText = await translateMarkdown(project!.generatedContent!.rawText!, {
      source,
      target,
      glossary,
      ...resolveAiChoice(req.body, project)
    });
    await saveTranslation(project, target, rawText, req.user?._id);
    res.json(await Project.findById(project!._id).populate(PROJECT_POPULATE));
  } catch (error: any) {
    console.error('[Project/Translate] Error al traducir el proyecto:', error);
    res.status(500).json({ error: 'Error al traducir el proyecto con la IA' });
  }
};

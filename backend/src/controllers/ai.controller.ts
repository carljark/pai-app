import type { Response } from 'express';
import { AI_AVAILABLE_MODELS, AI_PROVIDER_CATALOG } from '../data/ai-models';

/** Devuelve el catálogo único de proveedores y modelos de IA disponibles. */
export const getAiModels = (_req: any, res: Response) => {
  res.json({
    providers: AI_PROVIDER_CATALOG,
    models: AI_AVAILABLE_MODELS
  });
};

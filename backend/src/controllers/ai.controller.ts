import type { Response } from 'express';
import { getEnabledModels, getEnabledProviderCatalog } from '../data/ai-models';

/** Devuelve el catálogo de proveedores y modelos de IA habilitados (sin Gemini si está desactivado). */
export const getAiModels = (_req: any, res: Response) => {
  res.json({
    providers: getEnabledProviderCatalog(),
    models: getEnabledModels()
  });
};

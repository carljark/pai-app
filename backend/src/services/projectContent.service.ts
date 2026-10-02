import { isContentLanguage, projectLanguage } from './translation.service';

interface ProjectContentDoc {
  language?: string | null;
  generatedContent?: { rawText?: string | null } | null;
  translations?: Record<string, { rawText?: string | null } | null | undefined> | null;
}

/** `true` si `language` es un idioma válido distinto del original del proyecto. */
const isTranslationLanguage = (project: ProjectContentDoc, language: unknown): language is string =>
  isContentLanguage(language) && language !== projectLanguage(project);

/**
 * Texto del proyecto en el idioma pedido: la traducción si existe y, si no, el original.
 * Lo usan las exportaciones para descargar lo que el usuario está viendo.
 */
export const pickProjectText = (project: ProjectContentDoc, language?: unknown): string | null | undefined => {
  if (isTranslationLanguage(project, language)) {
    const translated = project.translations?.[language]?.rawText;
    if (translated) return translated;
  }
  return project.generatedContent?.rawText;
};

/**
 * Actualización de `PUT /api/projects/:id`. Si se edita en un idioma distinto del original,
 * se guarda como versión propia de ese idioma sin tocar el original. Si se edita el original,
 * `contentVersion` sube cuando el texto cambia, lo que marca las traducciones como desactualizadas.
 */
export const buildContentUpdate = (
  project: ProjectContentDoc,
  rawText: string | undefined,
  status: string | undefined,
  language?: unknown
): Record<string, unknown> => {
  const base = { status: status || 'borrador' };
  if (isTranslationLanguage(project, language)) {
    return {
      $set: { ...base, [`translations.${language}.rawText`]: rawText, [`translations.${language}.editedAt`]: new Date() }
    };
  }
  const changed = rawText !== project.generatedContent?.rawText;
  return {
    $set: { ...base, 'generatedContent.rawText': rawText },
    ...(changed ? { $inc: { contentVersion: 1 } } : {})
  };
};

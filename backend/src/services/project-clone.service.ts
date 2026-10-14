import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { Project, CONTENT_LANGUAGES, type ContentLanguage } from '../models/Project';

/**
 * Copia de un proyecto terminado a nombre de otro usuario (o del mismo).
 * Ver documentation/clonar_proyectos.md.
 */
export const CLONABLE_STATUSES = ['borrador', 'publicado'];

/** Títulos por defecto que no describen el proyecto: en su lugar se usan los módulos. */
const GENERIC_TITLES = ['Proyecto Integrador', 'Proyecto de ESO', 'Proyecto Generado'];

const COPY_PREFIX: Record<ContentLanguage, string> = { castellano: 'Copia de', catalan: 'Còpia de' };
const FALLBACK_NAME: Record<ContentLanguage, string> = { castellano: 'proyecto', catalan: 'projecte' };

/** Campos que la copia hereda tal cual del original. */
const COPIED_FIELDS = [
  'modules', 'ras', 'criteriosSeleccionados', 'methodology', 'tipoNivel', 'courseLevel', 'language',
  'contentVersion', 'extraInstructions', 'aiProvider', 'aiModel', 'usedAiProvider', 'usedModel', 'generationTimeMs'
] as const;

export const toContentLanguage = (value: unknown): ContentLanguage =>
  CONTENT_LANGUAGES.includes(value as ContentLanguage) ? (value as ContentLanguage) : 'castellano';

/** Nombre visible del original: su título o, si es genérico, sus módulos (como el historial). */
const displayName = (p: any, language: ContentLanguage): string => {
  const title = typeof p.title === 'string' ? p.title.trim() : '';
  const modules = (p.modules || []).filter(Boolean);
  if ((!title || GENERIC_TITLES.includes(title)) && modules.length) return modules.join(' + ');
  return title || FALLBACK_NAME[language];
};

export const cloneTitle = (p: any, language: ContentLanguage): string =>
  `${COPY_PREFIX[language]} ${displayName(p, language)}`;

/** Solo se copian traducciones terminadas; una en curso o con error no tiene texto fiable. */
const copyTranslations = (translations: any) =>
  Object.fromEntries(
    CONTENT_LANGUAGES.filter(l => translations?.[l]?.rawText).map(l => {
      const { rawText, sourceVersion, translatedAt, editedAt } = translations[l];
      return [l, { rawText, sourceVersion, translatedAt, editedAt, status: 'completada' }];
    })
  );

const pick = (source: any, fields: readonly string[]) =>
  Object.fromEntries(fields.filter(f => source[f] !== undefined && source[f] !== null).map(f => [f, source[f]]));

/** Documento de la copia: es de `userId`, sin colaboradores ni turno de edición, y en borrador. */
export const buildCloneDoc = (original: any, userId: mongoose.Types.ObjectId | string, language: ContentLanguage) => ({
  ...pick(original, COPIED_FIELDS),
  title: cloneTitle(original, language),
  status: 'borrador' as const,
  generatedContent: {
    rawText: original.generatedContent?.rawText || '',
    jsonStructure: original.generatedContent?.jsonStructure
  },
  translations: copyTranslations(original.translations),
  userId,
  collaborators: [],
  clonedFrom: original._id
});

/** Copia los archivos adjuntos (`uploads/<id>`); si el original no tiene, no hace nada. */
export const copyProjectFiles = async (fromId: string, toId: string): Promise<void> => {
  const source = path.join(process.cwd(), 'uploads', fromId);
  try {
    await fs.access(source);
  } catch {
    return;
  }
  await fs.cp(source, path.join(process.cwd(), 'uploads', toId), { recursive: true });
};

export const createClone = async (original: any, userId: mongoose.Types.ObjectId | string, language: ContentLanguage) =>
  Project.create(buildCloneDoc(original, userId, language));

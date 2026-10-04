import mongoose from 'mongoose';
import { Project, CONTENT_LANGUAGES } from '../models/Project';

/**
 * Exportación e importación de proyectos entre instalaciones (producción ↔ local) o entre usuarios.
 * Se exportan proyectos de cualquier usuario; al importarlos quedan a nombre de quien importa.
 * Ver documentation/exportacion_importacion_proyectos.md.
 */
export const TRANSFER_FORMAT = 'plappin-projects';
export const TRANSFER_VERSION = 1;
/** Solo se exportan proyectos terminados: los que están en cola o generándose no tienen contenido. */
export const EXPORTABLE_STATUSES = ['borrador', 'publicado'];

const COPIED_FIELDS = [
  'title', 'modules', 'ras', 'methodology', 'tipoNivel', 'courseLevel', 'status', 'language', 'contentVersion',
  'extraInstructions', 'generationTimeMs', 'aiProvider', 'aiModel', 'usedAiProvider', 'usedModel', 'createdAt', 'updatedAt'
] as const;

const TIPOS_NIVEL: string[] = (Project.schema.path('tipoNivel') as any).enumValues;

export interface TransferUser {
  email: string;
  name?: string;
}

export interface ImportSummary {
  imported: number;
  skipped: number;
  errors: { title: string; error: string }[];
}

const pick = (source: any, fields: readonly string[]) =>
  Object.fromEntries(fields.filter(f => source?.[f] !== undefined && source?.[f] !== null).map(f => [f, source[f]]));

/** Solo traducciones terminadas: las que estaban en curso o con error no se exportan. */
const exportTranslation = (t: any) =>
  t?.rawText ? { ...pick(t, ['rawText', 'sourceVersion', 'translatedAt', 'editedAt']), status: 'completada' } : undefined;

const exportTranslations = (translations: any) =>
  Object.fromEntries(CONTENT_LANGUAGES.map(l => [l, exportTranslation(translations?.[l])]).filter(([, t]) => t));

const exportUser = (user: any): TransferUser | null => (user?.email ? { email: user.email, name: user.name } : null);

/** Proyecto (con `userId` y colaboradores poblados) en el formato de intercambio. */
export const serializeProject = (p: any) => ({
  sourceId: p.importSourceId || String(p._id),
  ...pick(p, COPIED_FIELDS),
  generatedContent: { rawText: p.generatedContent?.rawText || '' },
  translations: exportTranslations(p.translations),
  owner: exportUser(p.userId),
  collaborators: (p.collaborators || [])
    .filter((c: any) => c.userId?.email)
    .map((c: any) => ({ ...exportUser(c.userId), addedAt: c.addedAt }))
});

/** Todos los proyectos terminados o, si se indican, solo los de `ids` (que también deben estar terminados). */
export const buildProjectsExport = async (ids: string[] = []) => {
  const validIds = ids.filter(id => mongoose.isValidObjectId(id));
  const filter = { status: { $in: EXPORTABLE_STATUSES }, ...(ids.length ? { _id: { $in: validIds } } : {}) };
  const projects = await Project.find(filter)
    .sort({ createdAt: 1 })
    .populate('userId', 'name email')
    .populate('collaborators.userId', 'name email')
    .lean();
  return {
    format: TRANSFER_FORMAT,
    version: TRANSFER_VERSION,
    exportedAt: new Date().toISOString(),
    count: projects.length,
    projects: projects.map(serializeProject)
  };
};

/** Mensaje de error si el cuerpo no es un fichero de exportación válido; `null` si lo es. */
export const validateTransferPayload = (body: any): string | null => {
  if (body?.format !== TRANSFER_FORMAT) return 'El fichero no es una exportación de proyectos de Plappin.';
  if (body.version !== TRANSFER_VERSION) return `Versión de exportación no compatible (${body.version}).`;
  if (!Array.isArray(body.projects)) return 'La exportación no contiene una lista de proyectos.';
  return null;
};

/** Lista ligera de los proyectos exportables (de cualquier usuario) para elegir cuáles exportar. */
export const listExportableProjects = async () => {
  const projects = await Project.find({ status: { $in: EXPORTABLE_STATUSES } })
    .select('title modules tipoNivel courseLevel status language createdAt userId')
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .lean();
  return projects.map((p: any) => ({
    _id: String(p._id),
    title: importedTitle(p),
    ...pick(p, ['tipoNivel', 'courseLevel', 'status', 'language', 'createdAt']),
    owner: exportUser(p.userId)
  }));
};

/**
 * ¿Ya tiene quien importa este proyecto? Se compara con sus proyectos importados del mismo origen y,
 * si el origen es esta misma instalación, con el propio proyecto original si es suyo. Así se puede
 * copiar a la cuenta propia un proyecto de otro usuario, pero no duplicarlo al reimportar.
 */
const alreadyImported = async (sourceId: unknown, importerId: any): Promise<boolean> => {
  if (typeof sourceId !== 'string' || !sourceId) return false;
  const or: any[] = [{ importSourceId: sourceId }];
  if (mongoose.isValidObjectId(sourceId)) or.push({ _id: sourceId });
  return Boolean(await Project.exists({ userId: importerId, $or: or }));
};

/**
 * Motivo por el que un proyecto del fichero no se puede importar; `null` si es válido. Los proyectos
 * antiguos sin título ni nivel se aceptan (ver {@link importedTitle} y el nivel por defecto del modelo).
 */
export const invalidProjectReason = (p: any): string | null => {
  if (typeof p?.generatedContent?.rawText !== 'string' || !p.generatedContent.rawText.trim()) return 'No tiene contenido.';
  if (p.tipoNivel !== undefined && !TIPOS_NIVEL.includes(p.tipoNivel)) return `Nivel no reconocido (${p.tipoNivel}).`;
  return null;
};

/** Mismo título por defecto que al crear un proyecto: los módulos, o un texto genérico. */
export const importedTitle = (p: any): string => {
  if (typeof p?.title === 'string' && p.title.trim()) return p.title;
  const modules = Array.isArray(p?.modules) ? p.modules.filter(Boolean) : [];
  return modules.length ? modules.join(' + ') : 'Proyecto importado';
};

/** El proyecto importado es de quien importa y no conserva colaboradores de la instalación de origen. */
const toProjectDoc = (p: any, importerId: any) => ({
  ...pick(p, COPIED_FIELDS),
  title: importedTitle(p),
  status: EXPORTABLE_STATUSES.includes(p.status) ? p.status : 'borrador',
  language: CONTENT_LANGUAGES.includes(p.language) ? p.language : 'castellano',
  generatedContent: { rawText: p.generatedContent.rawText },
  translations: exportTranslations(p.translations),
  userId: importerId,
  collaborators: [],
  importSourceId: typeof p.sourceId === 'string' ? p.sourceId : undefined,
  importedAt: new Date()
});

const importOne = async (p: any, importerId: any, summary: ImportSummary) => {
  const reason = invalidProjectReason(p);
  if (reason) {
    summary.errors.push({ title: importedTitle(p), error: reason });
    return;
  }
  if (await alreadyImported(p.sourceId, importerId)) {
    summary.skipped++;
    return;
  }
  await Project.create(toProjectDoc(p, importerId));
  summary.imported++;
};

/** Crea a nombre de quien importa los proyectos del fichero que todavía no tenga. */
export const importProjects = async (projects: any[], importerId: any): Promise<ImportSummary> => {
  const summary: ImportSummary = { imported: 0, skipped: 0, errors: [] };
  for (const p of projects) {
    try {
      await importOne(p, importerId, summary);
    } catch (error: any) {
      summary.errors.push({ title: importedTitle(p), error: error?.message || String(error) });
    }
  }
  return summary;
};

import mongoose from 'mongoose';
import { Project, CONTENT_LANGUAGES } from '../models/Project';
import { User } from '../models/User';

/**
 * Exportación e importación de proyectos entre instalaciones (producción ↔ local).
 * Los usuarios se identifican por email, porque sus ids no coinciden entre bases de datos.
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
  ownerFallback: number;
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

/** Todos los proyectos terminados o, si se indican, solo los de `ids`. */
export const buildProjectsExport = async (ids: string[] = []) => {
  const validIds = ids.filter(id => mongoose.isValidObjectId(id));
  const filter = ids.length ? { _id: { $in: validIds } } : { status: { $in: EXPORTABLE_STATUSES } };
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

const normalizeEmail = (email: unknown) => (typeof email === 'string' ? email.trim().toLowerCase() : '');

const usersByEmail = async (projects: any[]): Promise<Map<string, any>> => {
  const emails = new Set<string>();
  for (const p of projects) {
    emails.add(normalizeEmail(p?.owner?.email));
    for (const c of p?.collaborators || []) emails.add(normalizeEmail(c?.email));
  }
  emails.delete('');
  const users = await User.find({ email: { $in: [...emails] } }).select('_id email').lean();
  return new Map(users.map(u => [normalizeEmail(u.email), u._id]));
};

const alreadyImported = async (sourceId: unknown): Promise<boolean> => {
  if (typeof sourceId !== 'string' || !sourceId) return false;
  const or: any[] = [{ importSourceId: sourceId }];
  if (mongoose.isValidObjectId(sourceId)) or.push({ _id: sourceId });
  return Boolean(await Project.exists({ $or: or }));
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

const toProjectDoc = (p: any, users: Map<string, any>, fallbackUserId: any) => {
  const ownerId = users.get(normalizeEmail(p.owner?.email));
  const collaborators = (p.collaborators || [])
    .map((c: any) => ({ userId: users.get(normalizeEmail(c?.email)), addedAt: c?.addedAt }))
    .filter((c: any) => c.userId && String(c.userId) !== String(ownerId || fallbackUserId));
  return {
    ...pick(p, COPIED_FIELDS),
    title: importedTitle(p),
    status: EXPORTABLE_STATUSES.includes(p.status) ? p.status : 'borrador',
    language: CONTENT_LANGUAGES.includes(p.language) ? p.language : 'castellano',
    generatedContent: { rawText: p.generatedContent.rawText },
    translations: exportTranslations(p.translations),
    userId: ownerId || fallbackUserId,
    collaborators,
    importSourceId: typeof p.sourceId === 'string' ? p.sourceId : undefined,
    importedAt: new Date()
  };
};

const importOne = async (p: any, users: Map<string, any>, importerId: any, summary: ImportSummary) => {
  const reason = invalidProjectReason(p);
  if (reason) {
    summary.errors.push({ title: importedTitle(p), error: reason });
    return;
  }
  if (await alreadyImported(p.sourceId)) {
    summary.skipped++;
    return;
  }
  const doc = toProjectDoc(p, users, importerId);
  if (!users.has(normalizeEmail(p.owner?.email))) summary.ownerFallback++;
  await Project.create(doc);
  summary.imported++;
};

/**
 * Crea los proyectos del fichero. Se omiten los que ya existen (mismo origen), y los de un autor
 * que no existe en esta instalación quedan a nombre de quien importa.
 */
export const importProjects = async (projects: any[], importerId: any): Promise<ImportSummary> => {
  const summary: ImportSummary = { imported: 0, skipped: 0, ownerFallback: 0, errors: [] };
  const users = await usersByEmail(projects);
  for (const p of projects) {
    try {
      await importOne(p, users, importerId, summary);
    } catch (error: any) {
      summary.errors.push({ title: importedTitle(p), error: error?.message || String(error) });
    }
  }
  return summary;
};

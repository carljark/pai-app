/**
 * Domain models for Projects feature (Hexagonal Architecture - Domain Layer)
 * Pure TypeScript interfaces, no Angular dependencies.
 */

export type ProjectStatus = 'borrador' | 'generando' | 'en_cola' | 'publicado' | 'error';
/** Nivel educativo (`tipoNivel`): un id del catálogo de niveles (`GET /api/niveles`). */
export type ProjectType = string;
/** Pestaña de nivel del historial: el `tipoNivel` normalizado. */
export type HistoryTab = string;

/** Nivel de los proyectos antiguos que no guardan `tipoNivel`. */
export const DEFAULT_TIPO_NIVEL = 'FP_BASICA';

/** Alias antiguos de `tipoNivel`: `ESO` era el Programa de Diversificación Curricular. */
const TIPO_NIVEL_ALIASES: Record<string, string> = { ESO: 'DIVERSIFICACION_CURRICULAR' };

/** `tipoNivel` del catálogo: vacío pasa a FP Básica y los alias antiguos a su id actual. */
export function normalizeTipoNivel(tipoNivel: string | null | undefined): string {
  if (!tipoNivel) return DEFAULT_TIPO_NIVEL;
  return TIPO_NIVEL_ALIASES[tipoNivel] ?? tipoNivel;
}
export type AIProvider = 'gemini' | 'openrouter';
export type ContentLanguage = 'castellano' | 'catalan';

/** Versión del contenido en un idioma distinto del original. */
export type TranslationStatus = 'traduciendo' | 'completada' | 'error';

/** Igual que en el backend: una traducción en curso más antigua se considera abandonada. */
export const TRANSLATION_LOCK_MS = 30 * 60 * 1000;

export interface ProjectTranslation {
  /** Vacío mientras se traduce por primera vez. */
  rawText?: string;
  /** `contentVersion` del original que se tradujo. */
  sourceVersion?: number;
  translatedAt?: string | Date;
  editedAt?: string | Date;
  status?: TranslationStatus;
  startedAt?: string | Date;
  error?: string;
}

/** `true` si la traducción está en curso y su bloqueo no ha caducado. */
export function isTranslationInProgress(translation?: ProjectTranslation): boolean {
  if (translation?.status !== 'traduciendo' || !translation.startedAt) return false;
  return Date.now() - new Date(translation.startedAt).getTime() < TRANSLATION_LOCK_MS;
}

export interface ProjectModule {
  code: string;
  name: string;
  subject?: string;
  subject_es?: string;
  subject_ca?: string;
}

export interface ProjectFile {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string | Date;
  projectId: string;
}

export interface GeneratedContent {
  rawText: string;
  modules?: string[];
  methodology?: string;
  aiProvider?: AIProvider;
  aiModel?: string;
  courseLevel?: string;
}

export interface Project {
  _id: string;
  title: string;
  status: ProjectStatus;
  tipoNivel: ProjectType;
  courseLevel: string;
  modules: string[];
  ras?: string[];
  generatedContent?: GeneratedContent;
  userId: string | { _id: string; name: string; email?: string };
  collaborators?: Collaborator[];
  createdAt: string | Date;
  updatedAt: string | Date;
  // Campos opcionales que puede devolver la API (legacy)
  error?: string;
  errorDetail?: string;
  generationTimeMs?: number;
  usedAiProvider?: AIProvider;
  usedModel?: string;
  aiProvider?: AIProvider;
  // Idioma del contenido original y sus traducciones
  language?: ContentLanguage;
  contentVersion?: number;
  translations?: Partial<Record<ContentLanguage, ProjectTranslation>>;
}

export interface Collaborator {
  userId: string | { _id: string; name: string; email?: string };
  addedAt?: string | Date;
}

export interface DirectoryUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateProjectPayload {
  selectedRas: string[];
  methodology: string;
  modules: string[];
  tipoNivel: ProjectType;
  language: string;
  aiProvider: AIProvider;
  aiModel: string;
  courseLevel: string;
  title: string;
  extraInstructions?: string;
  collaboratorIds?: string[];
}

export interface UpdateProjectPayload {
  rawText: string;
  status: ProjectStatus;
  /** Idioma del texto editado: si no es el original, se guarda como su traducción. */
  language?: ContentLanguage;
}

export interface RewriteSectionPayload {
  context: string;
  instruction: string;
  aiProvider: AIProvider;
  aiModel: string;
}

export interface GenerateProjectResponse {
  project: Project;
  message?: string;
}

export interface ProjectsHistoryResponse {
  projects: Project[];
  total: number;
}

export interface FileUploadResponse {
  file: ProjectFile;
  message: string;
}

export interface FileDeleteResponse {
  message: string;
}

export interface ExportDocxResponse {
  blob: Blob;
  filename: string;
}

export interface ImportDocxResponse {
  project: Project;
  message: string;
}

export interface RetryProjectResponse {
  project: Project;
  message: string;
}

export interface ProjectFilters {
  searchQuery?: string;
  tipoNivel?: ProjectType;
  status?: ProjectStatus;
  onlyMine?: boolean;
  userId?: string;
}

export interface ProjectStats {
  totalProjects: number;
  totalUsageSeconds: number;
  projectsByType: Record<ProjectType, number>;
  projectsByStatus: Record<ProjectStatus, number>;
  averageGenerationTime: number;
}

export interface AIModelOption {
  value: string;
  label: string;
  provider: AIProvider;
}

export interface MethodologyOption {
  value: string;
  label: string;
}

export const METHODOLOGY_OPTIONS: MethodologyOption[] = [
  {
    value: 'ABP (Aprendizaje Basado en Problemas / Proyectos)',
    label: 'ABP (Aprendizaje Basado en Problemas / Proyectos)',
  },
  { value: 'ABR (Aprendizaje Basado en Retos)', label: 'ABR (Aprendizaje Basado en Retos)' },
  { value: 'ApS (Aprendizaje y Servicio)', label: 'ApS (Aprendizaje y Servicio)' },
];

export const AI_PROVIDER_OPTIONS: { value: AIProvider; label: string }[] = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'openrouter', label: 'OpenRouter' },
];

export interface AiModelOptionDto {
  value: string;
  label: string;
  provider: AIProvider;
  thinkingLevel?: boolean;
  reasoningEffort?: boolean;
}

export interface AiProviderOptionDto {
  value: AIProvider;
  label: string;
  defaultModel: string;
}

export interface AiModelsResponse {
  providers: AiProviderOptionDto[];
  models: AiModelOptionDto[];
}

/** Idioma del contenido original; los proyectos anteriores a la traducción están en castellano. */
export function projectLanguage(project: Pick<Project, 'language'>): ContentLanguage {
  return project.language || 'castellano';
}

/** Texto original, admitiendo el formato legacy en que `generatedContent` era un string. */
export function originalText(project: Pick<Project, 'generatedContent'>): string {
  const content = project.generatedContent as GeneratedContent | string | undefined;
  return (typeof content === 'string' ? content : content?.rawText) || '';
}

/** Qué versión del contenido se muestra según el idioma de la interfaz. */
export interface ProjectContentView {
  text: string;
  /** Idioma del texto mostrado (el que se guarda y se exporta). */
  language: ContentLanguage;
  isTranslation: boolean;
  /** La traducción se hizo sobre una versión anterior del original. */
  stale: boolean;
  /** La interfaz está en otro idioma y todavía no hay traducción. */
  missingTranslation: boolean;
  /** Hay una traducción a este idioma en curso. */
  translating: boolean;
  /** La última traducción a este idioma falló o quedó abandonada. */
  translationFailed: boolean;
}

/** Vista de una traducción existente; está desactualizada si el original cambió después. */
function translatedView(
  project: Project,
  language: ContentLanguage,
  text: string,
  translation: ProjectTranslation,
): Omit<ProjectContentView, 'translating' | 'translationFailed'> {
  const stale = (translation.sourceVersion ?? 0) !== (project.contentVersion ?? 0);
  return { text, language, isTranslation: true, stale, missingTranslation: false };
}

/** Estado de la traducción al idioma de la interfaz (si no es el original). */
function translationState(
  translation: ProjectTranslation | undefined,
): Pick<ProjectContentView, 'translating' | 'translationFailed'> {
  const translating = isTranslationInProgress(translation);
  const abandoned = translation?.status === 'traduciendo' && !translating;
  return { translating, translationFailed: translation?.status === 'error' || abandoned };
}

export function resolveProjectContent(
  project: Project,
  uiLanguage: ContentLanguage,
): ProjectContentView {
  const original = projectLanguage(project);
  const translation = uiLanguage !== original ? project.translations?.[uiLanguage] : undefined;
  const state = translationState(translation);
  if (translation?.rawText) {
    return { ...translatedView(project, uiLanguage, translation.rawText, translation), ...state };
  }
  return {
    text: originalText(project),
    language: original,
    isTranslation: false,
    stale: false,
    missingTranslation: uiLanguage !== original,
    ...state,
  };
}

/** Texto del proyecto en un idioma: su traducción si existe y, si no, el original. */
export function projectTextIn(project: Project, language: ContentLanguage): string {
  const translated = project.translations?.[language]?.rawText;
  return language !== projectLanguage(project) && translated ? translated : originalText(project);
}

/** Id del autor tanto si `userId` viene poblado (objeto) como si es un string. */
export function getOwnerId(userId: Project['userId'] | null | undefined): string | undefined {
  if (userId && typeof userId === 'object') return userId._id;
  return userId || undefined;
}

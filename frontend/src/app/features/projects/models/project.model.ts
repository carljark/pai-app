/**
 * Domain models for Projects feature (Hexagonal Architecture - Domain Layer)
 * Pure TypeScript interfaces, no Angular dependencies.
 */

export type ProjectStatus = 'borrador' | 'generando' | 'en_cola' | 'publicado' | 'error';
export type ProjectType =
  'FP_BASICA' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA' | 'DIVERSIFICACION_CURRICULAR' | 'ESO';
export type HistoryTab = 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'ESO';
export type AIProvider = 'gemini' | 'openrouter';
export type ContentLanguage = 'castellano' | 'catalan';

/** Versión del contenido en un idioma distinto del original. */
export interface ProjectTranslation {
  rawText: string;
  /** `contentVersion` del original que se tradujo. */
  sourceVersion?: number;
  translatedAt?: string | Date;
  editedAt?: string | Date;
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

export function getHistoryTabForTipoNivel(tipoNivel: ProjectType): HistoryTab {
  switch (tipoNivel) {
    case 'DIVERSIFICACION_CURRICULAR':
    case 'ESO':
      return 'ESO';
    case 'CFGM_ESTETICA':
      return 'CFGM';
    case 'CFGM_PELUQUERIA':
      return 'CFGM_PELUQUERIA';
    default:
      return 'FPB';
  }
}

export function isFPProject(tipoNivel: ProjectType): boolean {
  return tipoNivel === 'FP_BASICA' || tipoNivel === 'CFGM_ESTETICA' || !tipoNivel;
}

export function isESOProject(tipoNivel: ProjectType): boolean {
  return tipoNivel === 'DIVERSIFICACION_CURRICULAR';
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
}

export function resolveProjectContent(
  project: Project,
  uiLanguage: ContentLanguage,
): ProjectContentView {
  const original = projectLanguage(project);
  const translation = project.translations?.[uiLanguage];
  if (uiLanguage !== original && translation?.rawText) {
    const stale = (translation.sourceVersion ?? 0) !== (project.contentVersion ?? 0);
    return {
      text: translation.rawText,
      language: uiLanguage,
      isTranslation: true,
      stale,
      missingTranslation: false,
    };
  }
  const missingTranslation = uiLanguage !== original;
  return {
    text: originalText(project),
    language: original,
    isTranslation: false,
    stale: false,
    missingTranslation,
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

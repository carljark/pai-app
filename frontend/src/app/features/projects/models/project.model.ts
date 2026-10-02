/**
 * Domain models for Projects feature (Hexagonal Architecture - Domain Layer)
 * Pure TypeScript interfaces, no Angular dependencies.
 */

export type ProjectStatus = 'borrador' | 'generando' | 'en_cola' | 'publicado' | 'error';
export type ProjectType = 'FP_BASICA' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA' | 'DIVERSIFICACION_CURRICULAR' | 'ESO';
export type HistoryTab = 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'ESO';
export type AIProvider = 'gemini' | 'openrouter';

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
  { value: 'ABP (Aprendizaje Basado en Problemas / Proyectos)', label: 'ABP (Aprendizaje Basado en Problemas / Proyectos)' },
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
    case 'CFGM_ESTETICA': return 'CFGM';
    case 'CFGM_PELUQUERIA': return 'CFGM_PELUQUERIA';
    default: return 'FPB';
  }
}

export function isFPProject(tipoNivel: ProjectType): boolean {
  return tipoNivel === 'FP_BASICA' || tipoNivel === 'CFGM_ESTETICA' || !tipoNivel;
}

export function isESOProject(tipoNivel: ProjectType): boolean {
  return tipoNivel === 'DIVERSIFICACION_CURRICULAR';
}

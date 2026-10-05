/**
 * Projects Mapper (Hexagonal Architecture - Infrastructure Layer)
 * Transforms between API DTOs and Domain models.
 * Pure functions, no Angular dependencies.
 */

import {
  Project,
  ProjectStatus,
  ProjectType,
  GeneratedContent,
  ProjectFile,
  CreateProjectPayload,
  GenerateProjectResponse,
  FileUploadResponse,
  ImportDocxResponse,
  RetryProjectResponse,
  AIProvider,
  ContentLanguage,
  ProjectTranslation,
} from '../models/project.model';

// ============================================
// API DTO Types (what backend sends/receives)
// ============================================

export interface ProjectDto {
  _id: string;
  title: string;
  status: string;
  tipoNivel: string;
  courseLevel: string;
  modules: string[];
  ras?: string[];
  generatedContent?: {
    rawText: string;
    modules?: string[];
    methodology?: string;
    aiProvider?: string;
    aiModel?: string;
    courseLevel?: string;
  };
  userId: string | { _id: string; name: string };
  collaborators?: {
    userId: string | { _id: string; name: string; email?: string };
    addedAt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  // Datos de la generación: error y proveedor/modelo de IA utilizados
  error?: string;
  errorDetail?: string;
  generationTimeMs?: number;
  aiProvider?: AIProvider;
  usedAiProvider?: AIProvider;
  usedModel?: string;
  language?: ContentLanguage;
  contentVersion?: number;
  translations?: Partial<Record<ContentLanguage, ProjectTranslation>>;
}

export interface ProjectFileDto {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  projectId: string;
}

export interface GenerateProjectResponseDto {
  project: ProjectDto;
  message?: string;
}

export interface FileUploadResponseDto {
  file: ProjectFileDto;
  message: string;
}

export interface ImportDocxResponseDto {
  project: ProjectDto;
  message: string;
}

export interface RetryProjectResponseDto {
  project: ProjectDto;
  message: string;
}

/** El endpoint de reescritura devuelve `{ rawText }` o el texto plano. */
/** Respuesta actual del backend en `POST /rewrite`. */
export interface RewriteResultDto {
  newText?: string;
  rewrittenPart?: string;
  rawText?: string;
  provider?: AIProvider;
  model?: string;
  fallbackUsed?: boolean;
}
export type RewriteSectionResponseDto = string | RewriteResultDto;

// ============================================
// Domain → DTO (for sending to API)
// ============================================

export function toCreateProjectPayload(domain: CreateProjectPayload): CreateProjectPayload {
  // Payload structure matches domain 1:1, just ensure types
  return {
    selectedRas: domain.selectedRas,
    methodology: domain.methodology,
    modules: domain.modules,
    tipoNivel: domain.tipoNivel,
    language: domain.language,
    aiProvider: domain.aiProvider,
    aiModel: domain.aiModel,
    courseLevel: domain.courseLevel,
    title: domain.title,
    extraInstructions: domain.extraInstructions,
    collaboratorIds: domain.collaboratorIds,
  };
}

export function toUpdateProjectPayload(rawText: string, status: ProjectStatus) {
  return { rawText, status };
}

export function toRewriteSectionPayload(
  context: string,
  instruction: string,
  aiProvider: 'gemini' | 'openrouter',
  aiModel: string,
) {
  return { context, instruction, aiProvider, aiModel };
}

export function toFileUploadFormData(file: File, _projectId: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export function toImportDocxFormData(file: File, _projectId: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

// ============================================
// DTO → Domain (for receiving from API)
// ============================================

export function mapStatus(status: string): ProjectStatus {
  const validStatuses: ProjectStatus[] = ['borrador', 'generando', 'en_cola', 'publicado', 'error'];
  return validStatuses.includes(status as ProjectStatus) ? (status as ProjectStatus) : 'borrador';
}

export function mapTipoNivel(tipo: string): ProjectType {
  const validTypes: ProjectType[] = [
    'FP_BASICA',
    'CFGM_ESTETICA',
    'CFGM_PELUQUERIA',
    'CFGS_EDUCACION_INFANTIL',
    'ESO_ORDINARIA',
    'DIVERSIFICACION_CURRICULAR',
  ];
  return validTypes.includes(tipo as ProjectType) ? (tipo as ProjectType) : 'FP_BASICA';
}

function mapGeneratedContent(dto: ProjectDto['generatedContent']): GeneratedContent | undefined {
  if (!dto) return undefined;
  return {
    rawText: dto.rawText || '',
    modules: dto.modules,
    methodology: dto.methodology,
    aiProvider: dto.aiProvider as 'gemini' | 'openrouter' | undefined,
    aiModel: dto.aiModel,
    courseLevel: dto.courseLevel,
  };
}

function mapUserId(
  userId: string | { _id: string; name: string },
): string | { _id: string; name: string } {
  return userId;
}

function mapCollaborators(dto: ProjectDto['collaborators']) {
  if (!Array.isArray(dto)) return [];
  return dto.map((c) => ({ userId: c.userId, addedAt: c.addedAt }));
}

export function fromProjectDto(dto: ProjectDto): Project {
  return {
    _id: dto._id,
    title: dto.title || 'Sin título',
    status: mapStatus(dto.status),
    tipoNivel: mapTipoNivel(dto.tipoNivel),
    courseLevel: dto.courseLevel || '',
    modules: Array.isArray(dto.modules) ? dto.modules : [],
    ras: Array.isArray(dto.ras) ? dto.ras : [],
    generatedContent: mapGeneratedContent(dto.generatedContent),
    userId: mapUserId(dto.userId),
    collaborators: mapCollaborators(dto.collaborators),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    error: dto.error,
    errorDetail: dto.errorDetail,
    generationTimeMs: dto.generationTimeMs,
    aiProvider: dto.aiProvider,
    usedAiProvider: dto.usedAiProvider,
    usedModel: dto.usedModel,
    language: dto.language,
    contentVersion: dto.contentVersion,
    translations: dto.translations,
  };
}

export function fromProjectDtoArray(dtos: ProjectDto[]): Project[] {
  return (dtos || []).map(fromProjectDto);
}

export function fromGenerateProjectResponse(
  dto: GenerateProjectResponseDto,
): GenerateProjectResponse {
  return {
    project: fromProjectDto(dto.project),
    message: dto.message,
  };
}

export function fromFileUploadResponse(dto: FileUploadResponseDto): FileUploadResponse {
  return {
    file: fromProjectFileDto(dto.file),
    message: dto.message,
  };
}

export function fromImportDocxResponse(dto: ImportDocxResponseDto): ImportDocxResponse {
  return {
    project: fromProjectDto(dto.project),
    message: dto.message,
  };
}

export function fromRetryProjectResponse(dto: RetryProjectResponseDto): RetryProjectResponse {
  return {
    project: fromProjectDto(dto.project),
    message: dto.message,
  };
}

export function fromProjectFileDto(dto: ProjectFileDto): ProjectFile {
  return {
    _id: dto._id,
    filename: dto.filename,
    originalName: dto.originalName,
    mimeType: dto.mimeType,
    size: dto.size,
    uploadedAt: dto.uploadedAt,
    projectId: dto.projectId,
  };
}

export function fromProjectFileDtoArray(dtos: ProjectFileDto[]): ProjectFile[] {
  return (dtos || []).map(fromProjectFileDto);
}

/** Extrae el texto reescrito; si no hay `rawText`, devuelve la respuesta tal cual. */
export function fromRewriteSectionResponse(
  res: RewriteSectionResponseDto,
): RewriteSectionResponseDto {
  return (typeof res === 'object' && res?.rawText) || res;
}

/** Texto reescrito de la respuesta, tanto si llega como texto plano como si llega como objeto. */
export function rewrittenText(res: RewriteSectionResponseDto): string {
  if (typeof res === 'string') return res;
  return res?.newText || res?.rewrittenPart || '';
}

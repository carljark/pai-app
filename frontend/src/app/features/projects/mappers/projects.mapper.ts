/**
 * Projects Mapper (Hexagonal Architecture - Infrastructure Layer)
 * Transforms between API DTOs and Domain models.
 * Pure functions, no Angular dependencies.
 */

import {
  Project,
  ProjectStatus,
  ProjectType,
  HistoryTab,
  GeneratedContent,
  ProjectFile,
  CreateProjectPayload,
  GenerateProjectResponse,
  FileUploadResponse,
  ImportDocxResponse,
  RetryProjectResponse,
} from '../models/project.model';

// ============================================
// API DTO Types (what backend sends/receives)
// ============================================

interface ProjectDto {
  _id: string;
  title: string;
  status: string;
  tipoNivel: string;
  courseLevel: string;
  modules: string[];
  generatedContent?: {
    rawText: string;
    modules?: string[];
    methodology?: string;
    aiProvider?: string;
    aiModel?: string;
    courseLevel?: string;
  };
  userId: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface ProjectFileDto {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  projectId: string;
}

interface GenerateProjectResponseDto {
  project: ProjectDto;
  message?: string;
}

interface FileUploadResponseDto {
  file: ProjectFileDto;
  message: string;
}

interface ImportDocxResponseDto {
  project: ProjectDto;
  message: string;
}

interface RetryProjectResponseDto {
  project: ProjectDto;
  message: string;
}

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
  };
}

export function toUpdateProjectPayload(rawText: string, status: ProjectStatus) {
  return { rawText, status };
}

export function toRewriteSectionPayload(context: string, instruction: string, aiProvider: 'gemini' | 'openrouter', aiModel: string) {
  return { context, instruction, aiProvider, aiModel };
}

export function toFileUploadFormData(file: File, projectId: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export function toImportDocxFormData(file: File, projectId: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

// ============================================
// DTO → Domain (for receiving from API)
// ============================================

function mapStatus(status: string): ProjectStatus {
  const validStatuses: ProjectStatus[] = ['borrador', 'generando', 'en_cola', 'publicado', 'error'];
  return validStatuses.includes(status as ProjectStatus) ? status as ProjectStatus : 'borrador';
}

function mapTipoNivel(tipo: string): ProjectType {
  const validTypes: ProjectType[] = ['FP_BASICA', 'CFGM_ESTETICA', 'CFGM_PELUQUERIA', 'DIVERSIFICACION_CURRICULAR'];
  return validTypes.includes(tipo as ProjectType) ? tipo as ProjectType : 'FP_BASICA';
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

function mapUserId(userId: string | { _id: string; name: string }): string | { _id: string; name: string } {
  return userId;
}

export function fromProjectDto(dto: ProjectDto): Project {
  return {
    _id: dto._id,
    title: dto.title || 'Sin título',
    status: mapStatus(dto.status),
    tipoNivel: mapTipoNivel(dto.tipoNivel),
    courseLevel: dto.courseLevel || '',
    modules: Array.isArray(dto.modules) ? dto.modules : [],
    generatedContent: mapGeneratedContent(dto.generatedContent),
    userId: mapUserId(dto.userId),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function fromProjectDtoArray(dtos: ProjectDto[]): Project[] {
  return (dtos || []).map(fromProjectDto);
}

export function fromGenerateProjectResponse(dto: GenerateProjectResponseDto): GenerateProjectResponse {
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
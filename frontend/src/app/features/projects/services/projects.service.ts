/**
 * Projects Service (Hexagonal Architecture - Infrastructure Layer)
 * Only HTTP calls, no business logic, no state.
 * Uses ProjectsMapper for DTO ↔ Domain transformation.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Project,
  ProjectFile,
  CreateProjectPayload,
  UpdateProjectPayload,
  GenerateProjectResponse,
  FileUploadResponse,
  ImportDocxResponse,
  RetryProjectResponse,
  AiModelsResponse,
  DirectoryUser,
  ContentLanguage,
  AIProvider,
} from '../models/project.model';

import {
  fromProjectDto,
  fromProjectDtoArray,
  fromGenerateProjectResponse,
  fromFileUploadResponse,
  fromImportDocxResponse,
  fromRetryProjectResponse,
  fromProjectFileDtoArray,
  toCreateProjectPayload,
  toFileUploadFormData,
  toImportDocxFormData,
  fromRewriteSectionResponse,
  ProjectDto,
  ProjectFileDto,
  GenerateProjectResponseDto,
  FileUploadResponseDto,
  ImportDocxResponseDto,
  RetryProjectResponseDto,
  RewriteSectionResponseDto,
} from '../mappers/projects.mapper';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  // ---- IA / Modelos ----

  /** Catálogo de modelos de IA (fuente única en el backend). */
  getAiModels(): Observable<AiModelsResponse> {
    return this.http.get<AiModelsResponse>('/api/ai/models');
  }

  /** Directorio de usuarios para invitar como colaboradores. */
  getUserDirectory(): Observable<DirectoryUser[]> {
    return this.http.get<DirectoryUser[]>('/api/users/directory');
  }

  addCollaborator(projectId: string, userId: string): Observable<Project> {
    return this.http
      .post<ProjectDto>(`${this.apiUrl}/${projectId}/collaborators`, { userId })
      .pipe(map(fromProjectDto));
  }

  removeCollaborator(projectId: string, userId: string): Observable<Project> {
    return this.http
      .delete<ProjectDto>(`${this.apiUrl}/${projectId}/collaborators/${userId}`)
      .pipe(map(fromProjectDto));
  }

  // ---- Historial ----

  getHistory(): Observable<Project[]> {
    return this.http.get<ProjectDto[]>(this.apiUrl).pipe(map(fromProjectDtoArray));
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }

  retryProject(projectId: string): Observable<RetryProjectResponse> {
    return this.http
      .post<RetryProjectResponseDto>(`${this.apiUrl}/${projectId}/retry`, {})
      .pipe(map(fromRetryProjectResponse));
  }

  // ---- Generación ----

  generateProject(payload: CreateProjectPayload): Observable<GenerateProjectResponse> {
    const dto = toCreateProjectPayload(payload);
    return this.http
      .post<GenerateProjectResponseDto>(`${this.apiUrl}/generate`, dto)
      .pipe(map(fromGenerateProjectResponse));
  }

  updateProjectStatus(projectId: string, payload: UpdateProjectPayload): Observable<Project> {
    return this.http
      .put<ProjectDto>(`${this.apiUrl}/${projectId}`, payload)
      .pipe(map(fromProjectDto));
  }

  rewriteSection(payload: {
    projectId: string;
    context: string;
    instruction: string;
    aiProvider: 'gemini' | 'openrouter';
    aiModel: string;
  }): Observable<RewriteSectionResponseDto> {
    // El backend devuelve { rawText: string } o string plano
    return this.http
      .post<RewriteSectionResponseDto>(`${this.apiUrl}/rewrite`, payload)
      .pipe(map(fromRewriteSectionResponse));
  }

  // ---- Undo/Redo (estado local, no HTTP) ----
  // Se maneja en el Facade, no hay endpoints de undo

  // ---- Archivos ----

  getProjectFiles(projectId: string): Observable<ProjectFile[]> {
    return this.http
      .get<ProjectFileDto[]>(`${this.apiUrl}/${projectId}/files`)
      .pipe(map(fromProjectFileDtoArray));
  }

  uploadFile(projectId: string, file: File): Observable<FileUploadResponse> {
    const formData = toFileUploadFormData(file, projectId);
    return this.http
      .post<FileUploadResponseDto>(`${this.apiUrl}/${projectId}/files`, formData)
      .pipe(map(fromFileUploadResponse));
  }

  deleteFile(projectId: string, filename: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/files/${filename}`);
  }

  getDownloadUrl(projectId: string, filename: string): string {
    return `${this.apiUrl}/${projectId}/files/${filename}`;
  }

  /** Proyecto actualizado (se usa para seguir el progreso de una traducción). */
  getProject(projectId: string): Observable<Project> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${projectId}`).pipe(map(fromProjectDto));
  }

  /** Exporta la versión del idioma indicado (su traducción si existe). */
  exportDocx(projectId: string, language: ContentLanguage): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${projectId}/export-docx`, {
      responseType: 'blob',
      params: { lang: language },
    });
  }

  /** Traduce el contenido original con la IA y devuelve el proyecto con la traducción guardada. */
  translateProject(
    projectId: string,
    target: ContentLanguage,
    aiProvider: AIProvider,
    aiModel: string,
  ): Observable<Project> {
    return this.http
      .post<ProjectDto>(`${this.apiUrl}/${projectId}/translate`, { target, aiProvider, aiModel })
      .pipe(map(fromProjectDto));
  }

  importDocx(projectId: string, file: File): Observable<ImportDocxResponse> {
    const formData = toImportDocxFormData(file, projectId);
    return this.http
      .post<ImportDocxResponseDto>(`${this.apiUrl}/${projectId}/import-docx`, formData)
      .pipe(map(fromImportDocxResponse));
  }
}

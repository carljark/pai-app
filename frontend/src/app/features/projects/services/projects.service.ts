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
  ProjectStatus,
  ProjectType,
  ProjectFile,
  CreateProjectPayload,
  UpdateProjectPayload,
  GenerateProjectResponse,
  FileUploadResponse,
  ImportDocxResponse,
  RetryProjectResponse,
  AiModelsResponse,
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
  toUpdateProjectPayload,
  toRewriteSectionPayload,
  toFileUploadFormData,
  toImportDocxFormData,
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

  // ---- Historial ----

  getHistory(): Observable<Project[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(fromProjectDtoArray)
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }

  retryProject(projectId: string): Observable<RetryProjectResponse> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/retry`, {}).pipe(
      map(fromRetryProjectResponse)
    );
  }

  // ---- Generación ----

  generateProject(payload: CreateProjectPayload): Observable<GenerateProjectResponse> {
    const dto = toCreateProjectPayload(payload);
    return this.http.post<any>(`${this.apiUrl}/generate`, dto).pipe(
      map(fromGenerateProjectResponse)
    );
  }

  updateProjectStatus(projectId: string, payload: UpdateProjectPayload): Observable<Project> {
    return this.http.put<any>(`${this.apiUrl}/${projectId}`, payload).pipe(
      map(fromProjectDto)
    );
  }

  rewriteSection(payload: { context: string; instruction: string; aiProvider: 'gemini' | 'openrouter'; aiModel: string }): Observable<string> {
    // El backend devuelve { rawText: string } o string plano
    return this.http.post<any>(`${this.apiUrl}/rewrite`, payload).pipe(
      map(res => res?.rawText || res)
    );
  }

  // ---- Undo/Redo (estado local, no HTTP) ----
  // Se maneja en el Facade, no hay endpoints de undo

  // ---- Archivos ----

  getProjectFiles(projectId: string): Observable<ProjectFile[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${projectId}/files`).pipe(
      map(fromProjectFileDtoArray)
    );
  }

  uploadFile(projectId: string, file: File): Observable<FileUploadResponse> {
    const formData = toFileUploadFormData(file, projectId);
    return this.http.post<any>(`${this.apiUrl}/${projectId}/files`, formData).pipe(
      map(fromFileUploadResponse)
    );
  }

  deleteFile(projectId: string, filename: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/files/${filename}`);
  }

  getDownloadUrl(projectId: string, filename: string): string {
    return `${this.apiUrl}/${projectId}/files/${filename}`;
  }

  exportDocx(projectId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${projectId}/export-docx`, { responseType: 'blob' });
  }

  importDocx(projectId: string, file: File): Observable<ImportDocxResponse> {
    const formData = toImportDocxFormData(file, projectId);
    return this.http.post<any>(`${this.apiUrl}/${projectId}/import-docx`, formData).pipe(
      map(fromImportDocxResponse)
    );
  }
}
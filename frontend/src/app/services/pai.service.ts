import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LearningOutcome,
  EvaluativeCriteria,
} from '../features/curriculum/models/curriculum.model';
import { ActivityLog, AdminUser, CenterSettings } from '../features/admin/models/admin.model';
import { RawNotificationEvent } from '../features/notifications/models/notification.model';
import {
  FileUploadResponseDto,
  GenerateProjectResponseDto,
  ImportDocxResponseDto,
  ProjectDto,
  ProjectFileDto,
  RewriteSectionResponseDto,
} from '../features/projects/mappers/projects.mapper';

@Injectable({ providedIn: 'root' })
export class PaiService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getRas(lang = 'castellano'): Observable<LearningOutcome[]> {
    return this.http.get<LearningOutcome[]>(`${this.apiUrl}/ras?lang=${lang}`);
  }

  getLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/admin/logs`);
  }

  getCes(lang = 'castellano'): Observable<EvaluativeCriteria[]> {
    return this.http.get<EvaluativeCriteria[]>(`${this.apiUrl}/ces?lang=${lang}`);
  }

  generateProject(
    selectedRas: string[],
    methodology: string,
    modules: string[],
    tipoNivel: string,
    language: string,
    courseLevel: string,
    title?: string,
  ): Observable<GenerateProjectResponseDto> {
    return this.http.post<GenerateProjectResponseDto>(`${this.apiUrl}/projects/generate`, {
      selectedRas,
      methodology,
      modules,
      tipoNivel,
      language,
      courseLevel,
      title,
    });
  }

  listenToProjectUpdates(): Observable<RawNotificationEvent> {
    return new Observable<RawNotificationEvent>((observer) => {
      const EventSourceImpl: typeof EventSource | undefined = window?.EventSource;

      if (!EventSourceImpl) {
        return () => {
          // Sin EventSource no hay conexión que cerrar
        };
      }

      const token = localStorage.getItem('pai_token');
      // EventSource no soporta cabeceras, así que el token viaja por query parameter
      const eventSource = new EventSourceImpl(`${this.apiUrl}/projects/stream?token=${token}`);

      eventSource.onmessage = (event: MessageEvent<string>) => {
        observer.next(JSON.parse(event.data) as RawNotificationEvent);
      };

      eventSource.onerror = (error: Event) => {
        console.error('SSE Error:', error);
        // observer.error(error); // Mejor no cerrarlo por desconexiones puntuales
      };

      return () => {
        eventSource.close();
      };
    });
  }

  getProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.apiUrl}/projects`);
  }

  updateProject(id: string, rawText: string, status: string): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.apiUrl}/projects/${id}`, { rawText, status });
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }

  rewriteSection(context: string, instruction: string): Observable<RewriteSectionResponseDto> {
    return this.http.post<RewriteSectionResponseDto>(`${this.apiUrl}/projects/rewrite`, {
      context,
      instruction,
    });
  }

  // Archivos adjuntos
  getProjectFiles(projectId: string): Observable<ProjectFileDto[]> {
    return this.http.get<ProjectFileDto[]>(`${this.apiUrl}/projects/${projectId}/files`);
  }

  uploadFile(projectId: string, file: File): Observable<FileUploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponseDto>(
      `${this.apiUrl}/projects/${projectId}/files`,
      formData,
    );
  }

  deleteFile(projectId: string, filename: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/files/${filename}`);
  }

  getDownloadUrl(projectId: string, filename: string): string {
    return `${this.apiUrl}/projects/${projectId}/files/${filename}`;
  }

  // Admin
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/admin/users`);
  }

  updateUserPermissions(
    id: string,
    data: { role?: string; canUseAi?: boolean },
  ): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/admin/users/${id}/permissions`, data);
  }

  // Settings del Centro
  getSettings(): Observable<CenterSettings> {
    return this.http.get<CenterSettings>(`${this.apiUrl}/settings`);
  }

  updateSettings(data: Partial<CenterSettings>): Observable<CenterSettings> {
    return this.http.put<CenterSettings>(`${this.apiUrl}/settings`, data);
  }

  // DOCX Import/Export
  exportDocx(projectId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/export-docx`, {
      responseType: 'blob',
    });
  }

  importDocx(projectId: string, file: File): Observable<ImportDocxResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportDocxResponseDto>(
      `${this.apiUrl}/projects/${projectId}/import-docx`,
      formData,
    );
  }
}

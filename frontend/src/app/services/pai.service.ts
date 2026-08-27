import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaiService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getRas(lang: string = 'castellano'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ras?lang=${lang}`);
  }

  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/logs`);
  }

  getCes(lang: string = 'castellano'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ces?lang=${lang}`);
  }

  generateProject(selectedRas: string[], methodology: string, modules: string[], tipoNivel: string, language: string, courseLevel: string, title?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects/generate`, { selectedRas, methodology, modules, tipoNivel, language, courseLevel, title });
  }

  listenToProjectUpdates(): Observable<any> {
    return new Observable((observer) => {
      const token = localStorage.getItem('pai_token');
      // Enviar token por query parameter o usar interceptor? EventSource no soporta headers.
      // Así que lo pasamos por URL
      const eventSource = new EventSource(`${this.apiUrl}/projects/stream?token=${token}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        // observer.error(error); // Mejor no cerrarlo por desconexiones puntuales
      };

      return () => {
        eventSource.close();
      };
    });
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  updateProject(id: string, rawText: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/projects/${id}`, { rawText, status });
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/projects/${id}`);
  }

  rewriteSection(context: string, selectedText: string, instruction: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects/rewrite`, { context, selectedText, instruction });
  }

  // Archivos adjuntos
  getProjectFiles(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects/${projectId}/files`);
  }

  uploadFile(projectId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/files`, formData);
  }

  deleteFile(projectId: string, filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/projects/${projectId}/files/${filename}`);
  }

  getDownloadUrl(projectId: string, filename: string): string {
    return `${this.apiUrl}/projects/${projectId}/files/${filename}`;
  }

  // Admin
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  updateUserPermissions(id: string, data: { role?: string; canUseAi?: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}/permissions`, data);
  }

  // Settings del Centro
  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings`);
  }

  updateSettings(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/settings`, data);
  }

  // DOCX Import/Export
  exportDocx(projectId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/export-docx`, { responseType: 'blob' });
  }

  importDocx(projectId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/import-docx`, formData);
  }
}

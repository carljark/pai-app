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

  getCes(lang: string = 'castellano'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ces?lang=${lang}`);
  }

  generateProject(selectedRas: string[], methodology: string, modules: string[], tipoNivel: string, language: string, courseLevel: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects/generate`, { selectedRas, methodology, modules, tipoNivel, language, courseLevel });
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  updateProject(id: string, rawText: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/projects/${id}`, { rawText, status });
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
}

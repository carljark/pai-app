import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getRas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ras`);
  }

  generateProject(selectedRas: string[], methodology: string, modules: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects/generate`, { selectedRas, methodology, modules });
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  updateProject(id: string, rawText: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/projects/${id}`, { rawText, status });
  }

  rewriteSection(context: string, selectedText: string, instruction: string): Observable<{newText: string}> {
    return this.http.post<{newText: string}>(`${this.apiUrl}/projects/rewrite`, { context, selectedText, instruction });
  }
}

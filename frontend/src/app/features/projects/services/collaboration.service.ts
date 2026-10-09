/**
 * Collaboration Service (Infrastructure Layer)
 * Llamadas HTTP del trabajo colaborativo: turno de edición y registro de cambios.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditLockResponse, ProjectChange } from '../models/collaboration.model';

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  getEditLock(projectId: string): Observable<EditLockResponse> {
    return this.http.get<EditLockResponse>(`${this.apiUrl}/${projectId}/edit-lock`);
  }

  takeEditLock(projectId: string): Observable<EditLockResponse> {
    return this.http.post<EditLockResponse>(`${this.apiUrl}/${projectId}/edit-lock`, {});
  }

  releaseEditLock(projectId: string): Observable<{ released: boolean }> {
    return this.http.delete<{ released: boolean }>(`${this.apiUrl}/${projectId}/edit-lock`);
  }

  /**
   * Libera el turno al cerrar la pestaña: `keepalive` permite que la petición termine
   * aunque la página se descargue (sendBeacon no admite la cabecera de autorización).
   */
  releaseOnUnload(projectId: string): void {
    const token = localStorage.getItem('pai_token');
    void fetch(`${this.apiUrl}/${projectId}/edit-lock`, {
      method: 'DELETE',
      keepalive: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => undefined);
  }

  getChanges(projectId: string): Observable<ProjectChange[]> {
    return this.http.get<ProjectChange[]>(`${this.apiUrl}/${projectId}/changes`);
  }
}

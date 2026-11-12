import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Petición de autorización OAuth de un asistente (p. ej. el conector de claude.ai). */
export interface OAuthAuthorizationRequest {
  clientName: string;
  clientUri: string | null;
  redirectHost: string;
  scopes: string[];
}

/** Aplicación conectada a la cuenta por OAuth. */
export interface OAuthGrant {
  _id: string;
  clientName: string;
  createdAt: string;
  lastUsedAt: string | null;
}

/** Consentimiento OAuth del servidor MCP y aplicaciones conectadas. */
@Injectable({ providedIn: 'root' })
export class OAuthConsentService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/oauth';

  getRequest(id: string): Observable<OAuthAuthorizationRequest> {
    return this.http.get<OAuthAuthorizationRequest>(`${this.apiUrl}/requests/${id}`);
  }

  /** Acepta o rechaza; devuelve la URL a la que hay que volver (el asistente). */
  answer(id: string, approve: boolean): Observable<{ redirectUrl: string }> {
    return this.http.post<{ redirectUrl: string }>(`${this.apiUrl}/requests/${id}`, { approve });
  }

  listGrants(): Observable<OAuthGrant[]> {
    return this.http.get<OAuthGrant[]>(`${this.apiUrl}/grants`);
  }

  revokeGrant(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/grants/${id}`);
  }
}

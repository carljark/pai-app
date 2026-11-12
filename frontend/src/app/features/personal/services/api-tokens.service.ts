import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/** Token de conexión con asistentes de IA (servidor MCP), sin el valor completo. */
export interface ApiToken {
  _id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

/** Respuesta al crear un token: la única vez que llega `token` completo. */
export interface CreatedApiToken extends ApiToken {
  token: string;
}

/** Tokens personales para conectar Claude, Gemini u otros asistentes a Plappin por MCP. */
@Injectable({ providedIn: 'root' })
export class ApiTokensService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/users/me/tokens';

  tokens = signal<ApiToken[]>([]);

  load(): Observable<ApiToken[]> {
    return this.http.get<ApiToken[]>(this.apiUrl).pipe(tap((list) => this.tokens.set(list)));
  }

  create(name: string): Observable<CreatedApiToken> {
    return this.http.post<CreatedApiToken>(this.apiUrl, { name }).pipe(
      tap(({ _id, name, prefix, createdAt, lastUsedAt }) => {
        // El token completo no se guarda en el estado: solo se muestra una vez
        this.tokens.update((list) => [{ _id, name, prefix, createdAt, lastUsedAt }, ...list]);
      }),
    );
  }

  revoke(id: string): Observable<unknown> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.tokens.update((list) => list.filter((t) => t._id !== id))));
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/auth.model';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';

  currentUser = signal<User | null>(null);

  constructor() {
    const userStr = localStorage.getItem('pai_user');
    this.currentUser.set(AuthMapper.fromStorage(userStr));
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('pai_token', res.token);
          localStorage.setItem('pai_user', AuthMapper.toStorage(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('pai_token');
    localStorage.removeItem('pai_user');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pai_token');
  }
}

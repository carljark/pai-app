import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AdminUser, CenterSettings, ActivityLog } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminFacade {
  private http = inject(HttpClient);
  
  users = signal<AdminUser[]>([]);
  settings = signal<CenterSettings | null>(null);
  logs = signal<ActivityLog[]>([]);

  loadUsers() {
    this.http.get<AdminUser[]>('/api/admin/users').subscribe(res => this.users.set(res));
  }

  loadSettings() {
    this.http.get<CenterSettings>('/api/settings').subscribe(res => this.settings.set(res));
  }

  loadLogs() {
    this.http.get<ActivityLog[]>('/api/admin/logs').subscribe(res => this.logs.set(res));
  }

  updateUserRole(userId: string, role: string) {
    return this.http.put(`/api/admin/users/${userId}/role`, { role }).pipe(
      tap(() => this.loadUsers())
    );
  }

  updateUserAi(userId: string, canUseAi: boolean) {
    return this.http.put(`/api/admin/users/${userId}/ai`, { canUseAi }).pipe(
      tap(() => this.loadUsers())
    );
  }

  deleteUser(userId: string) {
    return this.http.delete(`/api/admin/users/${userId}`).pipe(
      tap(() => this.loadUsers())
    );
  }

  saveSettings(payload: CenterSettings) {
    return this.http.put('/api/settings', payload).pipe(
      tap(() => this.loadSettings())
    );
  }
}

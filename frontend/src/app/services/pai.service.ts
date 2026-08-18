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

  generateProject(selectedRas: string[], methodology: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/projects/generate`, { selectedRas, methodology });
  }
}

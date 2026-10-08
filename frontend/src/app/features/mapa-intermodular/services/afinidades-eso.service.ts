import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AfinidadesCurso } from '../models/afinidad-eso.model';
import { MapaTab } from '../utils/mapa-labels';

@Injectable({ providedIn: 'root' })
export class AfinidadesEsoService {
  private http = inject(HttpClient);

  getAfinidades(tab: MapaTab): Observable<AfinidadesCurso> {
    return this.http.get<AfinidadesCurso>('/api/afinidades-eso', { params: { tab } });
  }
}

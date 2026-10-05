import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FPBModule } from '../models/mapa-intermodular.model';
import { MapaTab } from '../utils/mapa-labels';

@Injectable({ providedIn: 'root' })
export class MapaIntermodularService {
  private http = inject(HttpClient);

  getModules(tab: MapaTab): Observable<FPBModule[]> {
    return this.http.get<FPBModule[]>('/api/mapa-intermodular', {
      params: { tab },
    });
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CursoNivel {
  curso: string;
  edad?: string;
}

/** Nivel educativo del catálogo del backend (`backend/src/data/niveles.ts`). */
export interface NivelEducativo {
  id: string;
  etapa: 'FPB' | 'CFGM' | 'CFGS' | 'ESO';
  nombre_es: string;
  nombre_ca: string;
  unidad: 'RA' | 'CE';
  cursos: CursoNivel[];
}

/** Catálogo de niveles educativos: fuente única de titulaciones, nombres y cursos. */
@Injectable({ providedIn: 'root' })
export class NivelesService {
  private http = inject(HttpClient);

  niveles = signal<NivelEducativo[]>([]);

  load() {
    this.http.get<NivelEducativo[]>('/api/niveles').subscribe({
      next: (res) => this.niveles.set(res),
      error: (err) => console.error('Error al cargar el catálogo de niveles', err),
    });
  }

  find(id: string): NivelEducativo | undefined {
    return this.niveles().find((n) => n.id === id);
  }

  nombre(nivel: NivelEducativo, isCa: boolean): string {
    return isCa ? nivel.nombre_ca : nivel.nombre_es;
  }
}

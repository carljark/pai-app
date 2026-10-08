import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_TIPO_NIVEL, normalizeTipoNivel } from '../features/projects/models/project.model';

/** Mapa intermodular de un nivel: pestaña del mapa y selección inicial. */
export interface MapaNivel {
  /** Identificador histórico de la pestaña del mapa (`MapaModule.tab`). */
  tab: string;
  /** Curso que cubre el mapa; sin curso, el mapa abarca todo el ciclo. */
  curso?: string;
  /** `modulos` (FP, por defecto) o `afinidades` (ESO: fichas de afinidad entre materias). */
  formato?: 'modulos' | 'afinidades';
  /** Módulo (o materia, en las afinidades) seleccionado al abrir el mapa. */
  moduleCode: string;
  raId: string;
}

export interface CursoNivel {
  curso: string;
  edad?: string;
  /** Códigos de los módulos del curso en su orden oficial (FP). */
  modulos?: string[];
}

/** Nivel educativo del catálogo del backend (`backend/src/data/niveles.ts`). */
export interface NivelEducativo {
  id: string;
  etapa: 'FPB' | 'CFGM' | 'CFGS' | 'ESO';
  nombre_es: string;
  nombre_ca: string;
  unidad: 'RA' | 'CE';
  cursos: CursoNivel[];
  mapas?: MapaNivel[];
}

/** Pestaña del mapa intermodular con el nivel al que pertenece. */
export interface MapaTabInfo extends MapaNivel {
  nivel: NivelEducativo;
}

/** Sigla con la que se muestra cada etapa (la FP Básica es hoy «CFGB»). */
const ETAPA_SIGLA: Record<NivelEducativo['etapa'], string> = {
  FPB: 'CFGB',
  CFGM: 'CFGM',
  CFGS: 'CFGS',
  ESO: 'ESO',
};

/** Catálogo de niveles educativos: fuente única de titulaciones, nombres, cursos y mapas. */
@Injectable({ providedIn: 'root' })
export class NivelesService {
  private http = inject(HttpClient);

  niveles = signal<NivelEducativo[]>([]);
  /** La última carga del catálogo falló. */
  error = signal(false);

  /** Pestañas del mapa intermodular en el orden del catálogo. */
  mapaTabs = computed<MapaTabInfo[]>(() =>
    this.niveles().flatMap((nivel) => (nivel.mapas ?? []).map((mapa) => ({ ...mapa, nivel }))),
  );

  load() {
    this.http.get<NivelEducativo[]>('/api/niveles').subscribe({
      next: (res) => {
        this.niveles.set(res);
        this.error.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el catálogo de niveles', err);
        this.error.set(true);
      },
    });
  }

  /** Nivel del catálogo; admite los valores antiguos (vacío o `ESO`). */
  find(id: string | null | undefined): NivelEducativo | undefined {
    const normalized = normalizeTipoNivel(id);
    return this.niveles().find((n) => n.id === normalized);
  }

  nombre(nivel: NivelEducativo, isCa: boolean): string {
    return isCa ? nivel.nombre_ca : nivel.nombre_es;
  }

  /** Nombre de un nivel por su id; si no está en el catálogo, el propio id. */
  nombreDe(id: string | null | undefined, isCa: boolean): string {
    const nivel = this.find(id);
    return nivel ? this.nombre(nivel, isCa) : normalizeTipoNivel(id);
  }

  cursos(id: string): string[] {
    return this.find(id)?.cursos.map((c) => c.curso) ?? [];
  }

  /** Curso por defecto de un nivel: el primero de su lista. */
  cursoPorDefecto(id: string): string {
    return this.cursos(id)[0] ?? '1º';
  }

  /** Módulos del curso en su orden oficial, o `null` si el nivel no los fija. */
  modulos(id: string, curso: string): string[] | null {
    const cursos = this.find(id)?.cursos ?? [];
    return cursos.find((c) => c.curso === curso)?.modulos ?? null;
  }

  /** ¿El nivel se trabaja con RA (FP)? Los niveles de ESO usan CE. */
  usaRa(id: string): boolean {
    return (this.find(id)?.unidad ?? 'RA') === 'RA';
  }

  /** Nivel por defecto: el de los proyectos antiguos si existe, si no el primero del catálogo. */
  nivelPorDefecto(): string {
    return this.find(DEFAULT_TIPO_NIVEL)?.id ?? this.niveles()[0]?.id ?? DEFAULT_TIPO_NIVEL;
  }

  mapaTab(tab: string): MapaTabInfo | undefined {
    return this.mapaTabs().find((t) => t.tab === tab);
  }

  /** Sigla de la etapa del nivel («CFGB», «CFGM», «CFGS», «ESO»). */
  sigla(nivel: NivelEducativo): string {
    return ETAPA_SIGLA[nivel.etapa] ?? nivel.etapa;
  }
}

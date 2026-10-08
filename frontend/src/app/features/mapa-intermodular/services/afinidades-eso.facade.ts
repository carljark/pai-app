import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AfinidadEso, AfinidadesCurso, MateriaAfinidades } from '../models/afinidad-eso.model';
import { AfinidadesEsoService } from './afinidades-eso.service';
import { MapaTab } from '../utils/mapa-labels';

/** Estado del mapa de afinidades de la ESO: curso cargado, materia activa y sus fichas. */
@Injectable({ providedIn: 'root' })
export class AfinidadesEsoFacade {
  private service = inject(AfinidadesEsoService);
  private cache: Partial<Record<MapaTab, AfinidadesCurso>> = {};
  private requestedTab = '';

  data = signal<AfinidadesCurso | null>(null);
  isLoading = signal(false);
  hasError = signal(false);
  selectedMateria = signal('');

  materias = computed<MateriaAfinidades[]>(() => this.data()?.materias ?? []);

  /** Fichas en las que participa la materia seleccionada. */
  fichas = computed<AfinidadEso[]>(() => {
    const materia = this.selectedMateria();
    return (this.data()?.afinidades ?? []).filter((a) => a.materias.includes(materia));
  });

  totalFichas = computed(() => this.data()?.afinidades.length ?? 0);

  /** Carga (o recupera de la caché) las fichas de la pestaña y selecciona la materia inicial. */
  async load(tab: MapaTab, materiaInicial: string): Promise<void> {
    this.requestedTab = tab;
    const cached = this.cache[tab];
    if (cached) return this.apply(cached, materiaInicial);
    this.isLoading.set(true);
    this.hasError.set(false);
    try {
      const data = await firstValueFrom(this.service.getAfinidades(tab));
      this.cache[tab] = data;
      if (this.requestedTab === tab) this.apply(data, materiaInicial);
    } catch (err) {
      console.error('Error al cargar las afinidades de ' + tab, err);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectMateria(code: string): void {
    this.selectedMateria.set(code);
  }

  /** Nombre de una materia del curso en el idioma activo (o su código si no se conoce). */
  materiaName(code: string, isCa: boolean): string {
    const m = this.materias().find((x) => x.code === code);
    if (!m) return code;
    return isCa ? m.name_ca : m.name_es;
  }

  private apply(data: AfinidadesCurso, materiaInicial: string): void {
    this.data.set(data);
    const existe = data.materias.some((m) => m.code === materiaInicial);
    this.selectedMateria.set(existe ? materiaInicial : (data.materias[0]?.code ?? ''));
  }
}

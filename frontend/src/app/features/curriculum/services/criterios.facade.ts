import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { CriterioItem, CriterioSeleccionado } from '../models/curriculum.model';
import { CurriculumFacade } from './curriculum.facade';

/**
 * Criterios de evaluación elegidos dentro de cada CE seleccionada (ESO y PDC).
 *
 * Solo se guardan las elecciones parciales: una CE seleccionada sin entrada tiene todos sus
 * criterios marcados. Así seleccionar una CE equivale a «seleccionar todos» sin tocar este estado.
 */
@Injectable({ providedIn: 'root' })
export class CriteriosFacade {
  private curriculum = inject(CurriculumFacade);
  private parciales = signal<Record<string, string[]>>({});

  constructor() {
    effect(() => {
      const selected = this.curriculum.selectedRas();
      untracked(() => this.descartarDeseleccionadas(selected));
    });
  }

  private descartarDeseleccionadas(selected: string[]): void {
    const stale = Object.keys(this.parciales()).filter((key) => !selected.includes(key));
    if (stale.length === 0) return;
    this.parciales.update((map) => {
      const copy = { ...map };
      stale.forEach((key) => delete copy[key]);
      return copy;
    });
  }

  /** Ids de los criterios marcados de una CE (ninguno si la CE no está seleccionada). */
  elegidos(key: string, todos: CriterioItem[]): string[] {
    if (!this.curriculum.selectedRas().includes(key)) return [];
    return this.parciales()[key] ?? todos.map((c) => c.id);
  }

  isChecked(key: string, id: string, todos: CriterioItem[]): boolean {
    return this.elegidos(key, todos).includes(id);
  }

  allChecked(key: string, todos: CriterioItem[]): boolean {
    return todos.length > 0 && this.elegidos(key, todos).length === todos.length;
  }

  /** Nº de criterios marcados de una CE seleccionada con `total` criterios. */
  selectedCount(key: string, total: number): number {
    return this.parciales()[key]?.length ?? total;
  }

  toggle(key: string, id: string, todos: CriterioItem[]): void {
    const actuales = this.elegidos(key, todos);
    const nuevos = actuales.includes(id) ? actuales.filter((i) => i !== id) : [...actuales, id];
    if (nuevos.length === 0) return this.deseleccionar(key);
    this.seleccionar(key);
    this.guardar(key, nuevos, todos);
  }

  toggleAll(key: string, todos: CriterioItem[]): void {
    if (this.allChecked(key, todos)) return this.deseleccionar(key);
    this.seleccionar(key);
    this.guardar(
      key,
      todos.map((c) => c.id),
      todos,
    );
  }

  /** Elecciones parciales para la petición de generación; vacío si todas las CE están completas. */
  payload(): CriterioSeleccionado[] {
    const selected = this.curriculum.selectedRas();
    return Object.entries(this.parciales())
      .filter(([ce]) => selected.includes(ce))
      .map(([ce, ids]) => ({ ce, ids }));
  }

  private seleccionar(key: string): void {
    if (!this.curriculum.selectedRas().includes(key)) this.curriculum.toggleRa(key);
  }

  private deseleccionar(key: string): void {
    if (this.curriculum.selectedRas().includes(key)) this.curriculum.toggleRa(key);
  }

  private guardar(key: string, ids: string[], todos: CriterioItem[]): void {
    const ordenados = todos.map((c) => c.id).filter((id) => ids.includes(id));
    this.parciales.update((map) => {
      const copy = { ...map };
      if (ordenados.length === todos.length) delete copy[key];
      else copy[key] = ordenados;
      return copy;
    });
  }
}

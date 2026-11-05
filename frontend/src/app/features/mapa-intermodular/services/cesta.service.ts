import { Injectable, signal } from '@angular/core';
import { CESTA_VACIA, type CestaEstado } from '../models/cesta.model';
import type { MapaTab } from '../utils/mapa-labels';

/** Prefijo de las claves de `sessionStorage`, una por pestaña del mapa. */
export const CESTA_STORAGE_PREFIX = 'plappin.cesta.';

function esEstado(valor: unknown): valor is CestaEstado {
  const e = valor as CestaEstado | null;
  return !!e && Array.isArray(e.unidades) && !!e.extras && !!e.excluidas;
}

/**
 * Contenido de la cesta de cada pestaña del mapa. Se copia en `sessionStorage` para que
 * sobreviva a una recarga; si el almacenamiento no está disponible, la cesta vive en memoria.
 */
@Injectable({ providedIn: 'root' })
export class CestaService {
  private estados = signal<Record<MapaTab, CestaEstado>>(this.leerTodo());

  estado(tab: MapaTab): CestaEstado {
    return this.estados()[tab] ?? CESTA_VACIA;
  }

  actualizar(tab: MapaTab, cambio: (estado: CestaEstado) => CestaEstado): void {
    const siguiente = cambio(this.estado(tab));
    this.estados.update((todos) => ({ ...todos, [tab]: siguiente }));
    this.guardar(tab, siguiente);
  }

  private guardar(tab: MapaTab, estado: CestaEstado): void {
    try {
      sessionStorage.setItem(CESTA_STORAGE_PREFIX + tab, JSON.stringify(estado));
    } catch {
      // Sin almacenamiento (modo privado, cuota llena): la cesta sigue en memoria.
    }
  }

  private leerTodo(): Record<MapaTab, CestaEstado> {
    const estados: Record<MapaTab, CestaEstado> = {};
    try {
      for (const clave of Object.keys(sessionStorage)) {
        if (!clave.startsWith(CESTA_STORAGE_PREFIX)) continue;
        const valor: unknown = JSON.parse(sessionStorage.getItem(clave)!);
        if (esEstado(valor)) estados[clave.slice(CESTA_STORAGE_PREFIX.length)] = valor;
      }
    } catch {
      // Almacenamiento inaccesible o dañado: se empieza con la cesta vacía.
    }
    return estados;
  }
}

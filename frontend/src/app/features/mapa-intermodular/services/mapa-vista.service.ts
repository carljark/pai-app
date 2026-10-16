import { Injectable, computed, signal } from '@angular/core';

/** Forma de explorar el mapa: acordeones clásicos, mapa mental o panorámica (estas dos, beta). */
export type MapaVista = 'clasica' | 'mental' | 'panoramica';

/** RA que el mapa mental debe abrir al llegar desde la panorámica. */
export interface RaPendiente {
  moduleCode: string;
  raId: string;
}

const STORAGE_KEY = 'pai_mapa_vista';
const VISTAS: MapaVista[] = ['clasica', 'mental', 'panoramica'];

/** Vista elegida para el mapa intermodular, recordada en el navegador. */
@Injectable({ providedIn: 'root' })
export class MapaVistaService {
  readonly vista = signal<MapaVista>(readSaved());

  /** En la ESO no hay panorámica: se muestra el mapa mental. */
  readonly vistaEso = computed<MapaVista>(() =>
    this.vista() === 'panoramica' ? 'mental' : this.vista(),
  );

  private raPendiente: RaPendiente | null = null;

  setVista(vista: MapaVista): void {
    this.vista.set(vista);
    try {
      localStorage.setItem(STORAGE_KEY, vista);
    } catch {
      // Sin almacenamiento (modo privado o bloqueado): la elección dura solo esta sesión.
    }
  }

  /** Cambia al mapa mental y le deja encargado abrir ese RA. */
  abrirEnMapaMental(ra: RaPendiente): void {
    this.raPendiente = ra;
    this.setVista('mental');
  }

  /** Devuelve (una sola vez) el RA pendiente de abrir. */
  tomarRaPendiente(): RaPendiente | null {
    const ra = this.raPendiente;
    this.raPendiente = null;
    return ra;
  }
}

function readSaved(): MapaVista {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as MapaVista | null;
    return saved && VISTAS.includes(saved) ? saved : 'clasica';
  } catch {
    return 'clasica';
  }
}

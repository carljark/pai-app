import { Injectable, signal } from '@angular/core';

/** Forma de explorar el mapa intermodular: acordeones clásicos o mapa mental (beta). */
export type MapaVista = 'clasica' | 'mental';

const STORAGE_KEY = 'pai_mapa_vista';

/** Vista elegida para el mapa intermodular, recordada en el navegador. */
@Injectable({ providedIn: 'root' })
export class MapaVistaService {
  readonly vista = signal<MapaVista>(readSaved());

  setVista(vista: MapaVista): void {
    this.vista.set(vista);
    try {
      localStorage.setItem(STORAGE_KEY, vista);
    } catch {
      // Sin almacenamiento (modo privado o bloqueado): la elección dura solo esta sesión.
    }
  }
}

function readSaved(): MapaVista {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'mental' ? 'mental' : 'clasica';
  } catch {
    return 'clasica';
  }
}

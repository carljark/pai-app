import { Injectable, signal } from '@angular/core';
import type { DragGhost, MindmapDropTarget } from '../models/mindmap.model';

/**
 * Zona de la cesta donde se sueltan las bolas del mapa mental. El lienzo le comunica la bola
 * que se arrastra y le pregunta si el puntero está sobre la cesta; la cesta pinta la bola
 * fantasma y se resalta.
 */
@Injectable({ providedIn: 'root' })
export class CestaDropService implements MindmapDropTarget {
  private zona: HTMLElement | null = null;

  ghost = signal<DragGhost | null>(null);
  over = signal(false);
  /** Aumenta cada vez que entra una bola, para que la cesta haga su animación. */
  recibidas = signal(0);

  registrar(zona: HTMLElement): void {
    this.zona = zona;
  }

  liberar(zona: HTMLElement): void {
    if (this.zona === zona) this.zona = null;
  }

  contains(x: number, y: number): boolean {
    const r = this.zona?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return false;
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  track(ghost: DragGhost | null): void {
    this.ghost.set(ghost);
    this.over.set(!!ghost && this.contains(ghost.x, ghost.y));
  }

  recibir(): void {
    this.recibidas.update((n) => n + 1);
  }
}

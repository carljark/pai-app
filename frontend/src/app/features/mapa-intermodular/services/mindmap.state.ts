import { Injectable, InjectionToken, effect, inject, signal, untracked } from '@angular/core';
import type { MindmapNode, MindmapPath } from '../models/mindmap.model';
import { EMPTY_PATH } from '../utils/mindmap-tree';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { MapaVistaService } from './mapa-vista.service';

/** Qué hacer al elegir una hoja (en FP, apuntar la fachada a su RA de origen). */
export const MINDMAP_SELECTION = new InjectionToken<(node: MindmapNode) => void>(
  'MINDMAP_SELECTION',
);

/**
 * Rama abierta del mapa mental y filtro de la leyenda. Se provee en cada vista de mapa mental
 * (FP y ESO), así que cada visita empieza plegada salvo que la panorámica pida abrir un RA.
 */
@Injectable()
export class MindmapState {
  private facade = inject(MapaIntermodularFacade);
  private vistas = inject(MapaVistaService);
  private onSelect = inject(MINDMAP_SELECTION, { optional: true });

  readonly path = signal<MindmapPath>(EMPTY_PATH);
  readonly relationFilter = signal<string>('all');

  /** Al cambiar de curso el mapa vuelve a mostrarse plegado. */
  constructor() {
    effect(() => {
      this.facade.activeTab();
      untracked(() => this.restart());
    });
  }

  /** Despliega o pliega el nodo; al elegir una hoja avisa a la estrategia de selección. */
  activate(node: MindmapNode): void {
    const p = this.path();
    switch (node.kind) {
      case 'module':
        return this.toggleModule(p, node.moduleCode!);
      case 'ra':
        return this.path.set({
          ...EMPTY_PATH,
          moduleCode: p.moduleCode,
          raId: toggle(p.raId, node.raId!),
        });
      case 'group':
        return this.path.set({
          ...p,
          groupCode: toggle(p.groupCode, node.targetModuleCode!),
          connectionIndex: null,
        });
      case 'connection':
        return this.toggleConnection(p, node);
      default:
        return this.reset();
    }
  }

  closeConnection(): void {
    this.path.update((p) => ({ ...p, connectionIndex: null }));
  }

  /** Elegir de nuevo el tipo activo de la leyenda lo desactiva. */
  toggleRelationFilter(type: string): void {
    this.relationFilter.update((current) => (current === type ? 'all' : type));
  }

  reset(): void {
    this.path.set(EMPTY_PATH);
  }

  /** Plegado, o con el RA que dejó pendiente la panorámica ya abierto. */
  private restart(): void {
    const ra = this.vistas.tomarRaPendiente();
    this.path.set(ra ? { ...EMPTY_PATH, ...ra } : EMPTY_PATH);
  }

  private toggleModule(p: MindmapPath, code: string): void {
    this.path.set({ ...EMPTY_PATH, moduleCode: toggle(p.moduleCode, code) });
  }

  private toggleConnection(p: MindmapPath, node: MindmapNode): void {
    const index = node.connectionIndex!;
    const next = p.connectionIndex === index ? null : index;
    this.path.set({ ...p, connectionIndex: next });
    if (next !== null) this.onSelect?.(node);
  }
}

/** El mismo valor pliega (vacío); otro distinto lo sustituye. */
function toggle(current: string, value: string): string {
  return current === value ? '' : value;
}

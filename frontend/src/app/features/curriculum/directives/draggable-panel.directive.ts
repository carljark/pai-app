import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/** Desplazamiento mínimo (px) para considerar que el gesto es un arrastre y no un clic. */
const DRAG_THRESHOLD = 5;

/** Distancias del panel a los bordes derecho (x) e inferior (y) de la ventana. */
interface Offset {
  x: number;
  y: number;
}

const clamp = (value: number, max: number): number => Math.max(0, Math.min(value, max));

/**
 * Permite mover un panel `position: fixed` arrastrando el elemento que coincide con el selector
 * indicado. El panel se ancla abajo a la derecha, de modo que al desplegarse crece hacia arriba,
 * y su posición se guarda en `localStorage` si se indica `storageKey`.
 */
@Directive({
  selector: '[appDraggablePanel]',
  standalone: true,
  exportAs: 'draggablePanel',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(window:resize)': 'clampToViewport()',
  },
})
export class DraggablePanelDirective implements OnDestroy {
  handleSelector = input.required<string>({ alias: 'appDraggablePanel' });
  storageKey = input<string>('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private start: { pointer: Offset; offset: Offset } | null = null;
  private offset: Offset | null = null;
  private moved = false;

  constructor() {
    afterNextRender(() => this.restore());
  }

  /** Indica si el último gesto fue un arrastre, para no interpretarlo como clic. */
  wasDragged(): boolean {
    return this.moved;
  }

  onPointerDown(event: PointerEvent): void {
    const target = event.target as Element | null;
    if (event.button !== 0 || !target?.closest(this.handleSelector())) return;
    this.start = { pointer: { x: event.clientX, y: event.clientY }, offset: this.currentOffset() };
    this.moved = false;
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  clampToViewport(): void {
    if (this.offset) this.apply(this.offset);
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.start) return;
    const dx = event.clientX - this.start.pointer.x;
    const dy = event.clientY - this.start.pointer.y;
    if (!this.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    this.moved = true;
    event.preventDefault();
    this.apply({ x: this.start.offset.x - dx, y: this.start.offset.y - dy });
  };

  private readonly onPointerUp = (): void => {
    this.stopListening();
    this.start = null;
    if (!this.moved) return;
    this.save();
    // El clic que sigue al arrastre ya ha consultado wasDragged(); después se vuelve a aceptar.
    setTimeout(() => (this.moved = false));
  };

  private stopListening(): void {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  private currentOffset(): Offset {
    const rect = this.host.getBoundingClientRect();
    return { x: window.innerWidth - rect.right, y: window.innerHeight - rect.bottom };
  }

  private apply(offset: Offset): void {
    const maxX = window.innerWidth - this.host.offsetWidth;
    const maxY = window.innerHeight - this.host.offsetHeight;
    this.offset = { x: clamp(offset.x, maxX), y: clamp(offset.y, maxY) };
    this.host.style.right = `${this.offset.x}px`;
    this.host.style.bottom = `${this.offset.y}px`;
  }

  private save(): void {
    if (!this.storageKey() || !this.offset) return;
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(this.offset));
    } catch {
      // Sin almacenamiento disponible: la posición solo dura la sesión actual.
    }
  }

  private restore(): void {
    if (!this.storageKey()) return;
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey()) ?? 'null') as Offset | null;
      if (typeof saved?.x === 'number' && typeof saved.y === 'number') this.apply(saved);
    } catch {
      // Valor ausente o corrupto: se mantiene la posición por defecto del CSS.
    }
  }
}

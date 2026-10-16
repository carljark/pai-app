import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { MindmapNode, RenderedLink, RenderedNode } from '../../../models/mindmap.model';
import {
  RING_GAP,
  fitTransform,
  focusTransform,
  type ViewTransform,
} from '../../../utils/mindmap-layout';
import { attachZoom, type ZoomController } from '../../../utils/mindmap-zoom';
import { MindmapControlsComponent } from '../mindmap-controls/mindmap-controls.component';

/** Escala mínima al centrar la cámara en una rama recién abierta. */
const FOCUS_SCALE = 0.8;

/** Lienzo SVG del mapa mental: trazos, nodos pulsables, arco de la conexión y zoom. */
@Component({
  selector: 'app-mindmap-canvas',
  standalone: true,
  imports: [MindmapControlsComponent],
  templateUrl: './mindmap-canvas.component.html',
  styleUrl: './mindmap-canvas.component.scss',
})
export class MindmapCanvasComponent {
  nodes = input.required<RenderedNode[]>();
  links = input.required<RenderedLink[]>();
  /** Arcos de la hoja elegida hacia sus destinos (uno en FP; uno o dos en la ESO). */
  arcs = input<string[]>([]);
  radius = input.required<number>();
  focusId = input<string>('root');
  isCa = input.required<boolean>();

  nodeActivate = output<MindmapNode>();

  private svgRef = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private zoom: ZoomController | null = null;

  transform = signal<ViewTransform>({ x: 400, y: 300, k: 1 });
  groupTransform = computed(() => {
    const { x, y, k } = this.transform();
    return `translate(${x},${y}) scale(${k})`;
  });

  constructor() {
    afterNextRender(() => {
      this.zoom = attachZoom(this.svgRef().nativeElement, (t) => this.transform.set(t));
      this.recenter(false);
    });
    effect(() => {
      this.focusId();
      this.radius();
      untracked(() => this.recenter(true));
    });
    inject(DestroyRef).onDestroy(() => this.zoom?.destroy());
  }

  activate(item: RenderedNode, event?: Event): void {
    event?.preventDefault();
    this.nodeActivate.emit(item.node);
  }

  /** Muestra el mapa completo. */
  fit(animate = true): void {
    if (!this.zoom) return;
    const { width, height } = this.zoom.size();
    this.zoom.apply(fitTransform(this.radius(), width, height), animate);
  }

  /** Acerca (`factor` > 1) o aleja manteniendo fijo el centro del lienzo. */
  zoomBy(factor: number): void {
    if (!this.zoom) return;
    const { width, height } = this.zoom.size();
    const { x, y, k } = this.transform();
    const cx = width / 2;
    const cy = height / 2;
    const next = { x: cx - (cx - x) * factor, y: cy - (cy - y) * factor, k: k * factor };
    this.zoom.apply(next, true);
  }

  /** Centra la cámara en la rama abierta, desplazada hacia fuera para que se vean sus hijos. */
  private recenter(animate: boolean): void {
    const target = this.nodes().find((n) => n.node.id === this.focusId());
    if (!this.zoom) return;
    if (!target || target.depth === 0) return this.fit(animate);
    const scale = Math.max(this.zoom.scale(), FOCUS_SCALE);
    const { width, height } = this.zoom.size();
    const [x, y] = outward(target.x, target.y, RING_GAP / 2);
    this.zoom.apply(focusTransform(x, y, scale, width, height), animate);
  }
}

/** Punto desplazado `distance` unidades alejándose del centro. */
function outward(x: number, y: number, distance: number): [number, number] {
  const r = Math.hypot(x, y) || 1;
  return [x + (x / r) * distance, y + (y / r) * distance];
}

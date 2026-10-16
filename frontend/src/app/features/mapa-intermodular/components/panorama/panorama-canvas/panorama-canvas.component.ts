import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type {
  PanoramaArc,
  PanoramaFocus,
  RenderedEdge,
  RenderedLeaf,
} from '../../../models/panorama.model';
import { fitTransform, type ViewTransform } from '../../../utils/mindmap-layout';
import { attachZoom, type ZoomController } from '../../../utils/mindmap-zoom';
import { MindmapControlsComponent } from '../../mindmap/mindmap-controls/mindmap-controls.component';

/** Lienzo SVG de la panorámica: arcos de módulo, curvas agrupadas y RA pulsables. */
@Component({
  selector: 'app-panorama-canvas',
  standalone: true,
  imports: [MindmapControlsComponent],
  templateUrl: './panorama-canvas.component.html',
  styleUrl: './panorama-canvas.component.scss',
})
export class PanoramaCanvasComponent {
  leaves = input.required<RenderedLeaf[]>();
  edges = input.required<RenderedEdge[]>();
  arcs = input.required<PanoramaArc[]>();
  radius = input.required<number>();
  focus = input<PanoramaFocus>(null);
  isCa = input.required<boolean>();

  focusChange = output<PanoramaFocus>();
  leafActivate = output<RenderedLeaf>();

  private svgRef = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private zoom: ZoomController | null = null;
  /** Tipo del último puntero: en pantallas táctiles el primer toque solo resalta. */
  private pointerType = 'mouse';

  /** Módulo resaltado (por su arco), para marcar el arco. */
  activeModule = computed(() => {
    const focus = this.focus();
    return focus?.kind === 'module' ? focus.code : '';
  });

  transform = signal<ViewTransform>({ x: 400, y: 300, k: 1 });
  groupTransform = computed(() => {
    const { x, y, k } = this.transform();
    return `translate(${x},${y}) scale(${k})`;
  });

  constructor() {
    afterNextRender(() => {
      this.zoom = attachZoom(this.svgRef().nativeElement, (t) => this.transform.set(t));
      this.fit(false);
    });
    inject(DestroyRef).onDestroy(() => this.zoom?.destroy());
  }

  fit(animate = true): void {
    if (!this.zoom) return;
    const { width, height } = this.zoom.size();
    this.zoom.apply(fitTransform(this.radius() - 100, width, height), animate);
  }

  zoomBy(factor: number): void {
    if (!this.zoom) return;
    const { width, height } = this.zoom.size();
    const { x, y, k } = this.transform();
    const cx = width / 2;
    const cy = height / 2;
    this.zoom.apply({ x: cx - (cx - x) * factor, y: cy - (cy - y) * factor, k: k * factor }, true);
  }

  rememberPointer(event: PointerEvent): void {
    this.pointerType = event.pointerType;
  }

  /** Con ratón o teclado abre el RA; con el dedo, el primer toque lo resalta y el segundo lo abre. */
  activate(leaf: RenderedLeaf, event?: Event): void {
    event?.preventDefault();
    const focus = this.focus();
    const isFocused = focus?.kind === 'ra' && focus.id === leaf.id;
    if (this.pointerType === 'touch' && !isFocused) {
      this.focusChange.emit({ kind: 'ra', id: leaf.id });
      return;
    }
    this.leafActivate.emit(leaf);
  }

  leafClasses(leaf: RenderedLeaf): string {
    const block = 'panorama-canvas__leaf';
    return `${block} ${block}--${leaf.state}${leaf.flipped ? ` ${block}--flipped` : ''}`;
  }

  ariaLabel(leaf: RenderedLeaf): string {
    return `${leaf.moduleCode} ${leaf.raCode}: ${leaf.text}`;
  }
}

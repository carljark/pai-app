import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import type { PanoramaFocus, RenderedLeaf } from '../../../models/panorama.model';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { MapaVistaService } from '../../../services/mapa-vista.service';
import { normalizeQuery } from '../../../utils/mindmap-match';
import { renderEdges, renderLeaves, type PanoramaFilter } from '../../../utils/panorama-highlight';
import { layoutPanorama } from '../../../utils/panorama-layout';
import { buildLegend } from '../../../utils/relation-labels';
import { MindmapLegendComponent } from '../../mindmap/mindmap-legend/mindmap-legend.component';
import { PanoramaCanvasComponent } from '../panorama-canvas/panorama-canvas.component';
import { PanoramaInfoComponent } from '../panorama-info/panorama-info.component';

/** Vista panorámica (beta): todas las conexiones del curso como curvas agrupadas entre RA. */
@Component({
  selector: 'app-panorama-view',
  standalone: true,
  imports: [PanoramaCanvasComponent, PanoramaInfoComponent, MindmapLegendComponent],
  templateUrl: './panorama-view.component.html',
  styleUrl: './panorama-view.component.scss',
})
export class PanoramaViewComponent {
  facade = inject(MapaIntermodularFacade);
  private layout = inject(LayoutService);
  private vistas = inject(MapaVistaService);

  isCa = computed(() => this.layout.language() === 'catalan');
  focus = signal<PanoramaFocus>(null);
  relationFilter = signal('all');

  panorama = computed(() => layoutPanorama(this.facade.modules(), this.isCa()));
  private filter = computed<PanoramaFilter>(() => ({
    query: normalizeQuery(this.facade.searchQuery()),
    moduleType: this.facade.selectedTypeFilter(),
    relationType: this.relationFilter(),
  }));

  edges = computed(() =>
    renderEdges(this.panorama().edges, this.panorama().leaves, this.focus(), this.filter()),
  );
  leaves = computed(() =>
    renderLeaves(this.panorama().leaves, this.edges(), this.focus(), this.filter()),
  );

  legend = computed(() =>
    buildLegend(
      this.panorama().edges.map((e) => e.relationType),
      this.relationFilter(),
      this.isCa(),
    ),
  );

  focusedLeaf = computed(() => {
    const focus = this.focus();
    return focus?.kind === 'ra' ? (this.leaves().find((l) => l.id === focus.id) ?? null) : null;
  });
  focusedArc = computed(() => {
    const focus = this.focus();
    return focus?.kind === 'module'
      ? (this.panorama().arcs.find((a) => a.code === focus.code) ?? null)
      : null;
  });
  totals = computed(() => ({
    ras: this.panorama().leaves.length,
    connections: this.panorama().edges.length,
    outside: this.panorama().outside,
  }));

  /** Al cambiar de curso se quita el resaltado. */
  constructor() {
    effect(() => {
      this.facade.activeTab();
      untracked(() => this.focus.set(null));
    });
  }

  toggleRelationFilter(type: string): void {
    this.relationFilter.update((current) => (current === type ? 'all' : type));
  }

  /** Salta al mapa mental con el módulo y el RA ya desplegados. */
  openInMindmap(leaf: RenderedLeaf): void {
    this.vistas.abrirEnMapaMental({ moduleCode: leaf.moduleCode, raId: leaf.id });
  }
}

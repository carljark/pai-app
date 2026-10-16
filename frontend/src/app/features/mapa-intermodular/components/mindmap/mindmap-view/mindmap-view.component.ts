import { Component, computed, inject, output } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { NivelesService } from '../../../../../services/niveles.service';
import type { IntermodularConnection } from '../../../models/mapa-intermodular.model';
import type { MindmapPath } from '../../../models/mindmap.model';
import { MapaIntermodularFacade } from '../../../services/mapa-intermodular.facade';
import { MindmapState } from '../../../services/mindmap.state';
import { mapaTabLabel } from '../../../utils/mapa-labels';
import { connectionArc, layoutMindmap } from '../../../utils/mindmap-layout';
import { normalizeQuery, type VisualContext } from '../../../utils/mindmap-match';
import { focusNodeId, renderLinks, renderNodes } from '../../../utils/mindmap-render';
import { buildMindmapTree } from '../../../utils/mindmap-tree';
import { RELATION_COLORS, RELATION_TYPES, relationLabel } from '../../../utils/relation-labels';
import { ConnectionDrawerComponent } from '../connection-drawer/connection-drawer.component';
import { MindmapCanvasComponent } from '../mindmap-canvas/mindmap-canvas.component';

/** Indicación de qué pulsar a continuación, según lo que haya desplegado. */
const HINTS: Record<'module' | 'ra' | 'group' | 'connection', { es: string; ca: string }> = {
  module: {
    es: 'Pulsa un módulo para ver sus resultados de aprendizaje.',
    ca: 'Prem un mòdul per veure’n els resultats d’aprenentatge.',
  },
  ra: {
    es: 'Pulsa un RA para ver con qué módulos conecta.',
    ca: 'Prem un RA per veure amb quins mòduls connecta.',
  },
  group: {
    es: 'Pulsa un módulo de destino para ver sus conexiones.',
    ca: 'Prem un mòdul de destinació per veure’n les connexions.',
  },
  connection: {
    es: 'Pulsa una conexión para ver su justificación y sus actividades.',
    ca: 'Prem una connexió per veure’n la justificació i les activitats.',
  },
};

function hintStep(path: MindmapPath): keyof typeof HINTS {
  if (path.groupCode) return 'connection';
  if (path.raId) return 'group';
  return path.moduleCode ? 'ra' : 'module';
}

/** Mapa mental del mapa intermodular (beta): árbol radial desplegable y panel de la conexión. */
@Component({
  selector: 'app-mindmap-view',
  standalone: true,
  imports: [MindmapCanvasComponent, ConnectionDrawerComponent],
  providers: [MindmapState],
  templateUrl: './mindmap-view.component.html',
  styleUrl: './mindmap-view.component.scss',
  host: { '(keydown.escape)': 'state.closeConnection()' },
})
export class MindmapViewComponent {
  facade = inject(MapaIntermodularFacade);
  state = inject(MindmapState);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  createProject = output<IntermodularConnection>();

  isCa = computed(() => this.layout.language() === 'catalan');
  private tab = computed(() => this.niveles.mapaTab(this.facade.activeTab()));

  private tree = computed(() =>
    buildMindmapTree({
      modules: this.facade.modules(),
      path: this.state.path(),
      isCa: this.isCa(),
      rootBadge: this.rootBadge(),
      rootLabel: mapaTabLabel(this.tab(), this.isCa()),
    }),
  );
  private positioned = computed(() => layoutMindmap(this.tree()));
  private visualContext = computed<VisualContext>(() => ({
    query: normalizeQuery(this.facade.searchQuery()),
    moduleType: this.facade.selectedTypeFilter(),
    relationType: this.state.relationFilter(),
    path: this.state.path(),
  }));

  nodes = computed(() => renderNodes(this.positioned().nodes, this.visualContext()));
  links = computed(() => renderLinks(this.positioned().links, this.nodes()));
  radius = computed(() => this.positioned().radius);
  focusId = computed(() => focusNodeId(this.state.path()));
  hint = computed(() => HINTS[hintStep(this.state.path())][this.isCa() ? 'ca' : 'es']);

  /** Sigla de la etapa en el nodo central («CFGS»). */
  rootBadge = computed(() => {
    const tab = this.tab();
    return tab ? this.niveles.sigla(tab.nivel) : '';
  });

  /** Arco desde la conexión elegida hasta su módulo de destino. */
  arc = computed(() => {
    const selection = this.state.selection();
    if (!selection) return null;
    const { raId, connectionIndex } = this.state.path();
    const id = `c:${raId}:${connectionIndex}`;
    return connectionArc(this.positioned().nodes, id, selection.connection.targetModuleCode);
  });

  /** Tipos de competencia presentes en el mapa, para la leyenda que filtra. */
  legend = computed(() => {
    const present = new Set(this.tree().children.flatMap((m) => m.relationTypes));
    const active = this.state.relationFilter();
    return RELATION_TYPES.filter((t) => present.has(t)).map((type) => ({
      type,
      label: relationLabel(type, this.isCa()),
      color: RELATION_COLORS[type],
      active: active === type,
    }));
  });
}

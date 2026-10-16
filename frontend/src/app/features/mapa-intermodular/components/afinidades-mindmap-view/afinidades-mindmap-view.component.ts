import { Component, computed, inject, input } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { NivelesService } from '../../../../services/niveles.service';
import type { AfinidadEso, AfinidadesCurso } from '../../models/afinidad-eso.model';
import type { MindmapPath } from '../../models/mindmap.model';
import { AfinidadProyectoService } from '../../services/afinidad-proyecto.service';
import { AfinidadesEsoFacade } from '../../services/afinidades-eso.facade';
import { MindmapState } from '../../services/mindmap.state';
import { buildAfinidadesTree, findSelectedFicha } from '../../utils/afinidades-mindmap-tree';
import { MapaTab, mapaTabLabel } from '../../utils/mapa-labels';
import { connectionArc, layoutMindmap } from '../../utils/mindmap-layout';
import { focusNodeId, renderLinks, renderNodes } from '../../utils/mindmap-render';
import { MindmapCanvasComponent } from '../mindmap/mindmap-canvas/mindmap-canvas.component';
import { MindmapDrawerComponent } from '../mindmap/mindmap-drawer/mindmap-drawer.component';
import { AfinidadCardComponent } from '../ui/afinidad-card/afinidad-card.component';

/** Indicación de qué pulsar a continuación, según lo que haya desplegado. */
const HINTS = {
  materia: {
    es: 'Pulsa una materia para ver con qué materias comparte fichas.',
    ca: 'Prem una matèria per veure amb quines matèries comparteix fitxes.',
  },
  afin: {
    es: 'Pulsa una materia afín para ver sus fichas.',
    ca: 'Prem una matèria afí per veure’n les fitxes.',
  },
  ficha: {
    es: 'Pulsa una ficha para verla completa.',
    ca: 'Prem una fitxa per veure-la completa.',
  },
};

/** Curso aún sin cargar: el mapa solo muestra el centro. */
const SIN_FICHAS: AfinidadesCurso = { curso: '', materias: [], afinidades: [] };

function hintStep(path: MindmapPath): keyof typeof HINTS {
  if (path.groupCode) return 'ficha';
  return path.moduleCode ? 'afin' : 'materia';
}

/** Mapa mental (beta) de las afinidades de la ESO: materias → materias afines → fichas. */
@Component({
  selector: 'app-afinidades-mindmap-view',
  standalone: true,
  imports: [MindmapCanvasComponent, MindmapDrawerComponent, AfinidadCardComponent],
  providers: [MindmapState],
  templateUrl: './afinidades-mindmap-view.component.html',
  styleUrl: './afinidades-mindmap-view.component.scss',
  host: { '(keydown.escape)': 'state.closeConnection()' },
})
export class AfinidadesMindmapViewComponent {
  facade = inject(AfinidadesEsoFacade);
  state = inject(MindmapState);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);
  private proyecto = inject(AfinidadProyectoService);

  tab = input.required<MapaTab>();

  isCa = computed(() => this.layout.language() === 'catalan');

  private tree = computed(() =>
    buildAfinidadesTree({
      data: this.facade.data() ?? SIN_FICHAS,
      path: this.state.path(),
      isCa: this.isCa(),
      rootBadge: 'ESO',
      rootLabel: mapaTabLabel(this.niveles.mapaTab(this.tab()), this.isCa()),
    }),
  );
  private positioned = computed(() => layoutMindmap(this.tree()));

  nodes = computed(() =>
    renderNodes(this.positioned().nodes, {
      query: '',
      moduleType: 'all',
      relationType: 'all',
      path: this.state.path(),
    }),
  );
  links = computed(() => renderLinks(this.positioned().links, this.nodes()));
  radius = computed(() => this.positioned().radius);
  focusId = computed(() => focusNodeId(this.tree()));
  hint = computed(() => HINTS[hintStep(this.state.path())][this.isCa() ? 'ca' : 'es']);

  selection = computed(() => findSelectedFicha(this.facade.data(), this.state.path()));

  /** Arcos desde la ficha elegida hasta las otras materias que la comparten. */
  arcs = computed(() => {
    const selection = this.selection();
    if (!selection) return [];
    const id = `c:${selection.materia}:${this.state.path().connectionIndex}`;
    return this.otrasMaterias(selection.ficha, selection.materia)
      .map((code) => connectionArc(this.positioned().nodes, id, code))
      .filter((arc): arc is string => !!arc);
  });

  /** Nombres de las otras materias de la ficha, para la cabecera del panel. */
  destino(ficha: AfinidadEso, materia: string): string {
    return this.otrasMaterias(ficha, materia)
      .map((code) => this.facade.materiaName(code, this.isCa()))
      .join(' · ');
  }

  crearProyecto(ficha: AfinidadEso, materia: string): void {
    void this.proyecto.crearProyecto(ficha, materia, this.tab());
  }

  private otrasMaterias(ficha: AfinidadEso, materia: string): string[] {
    return ficha.materias.filter((code) => code !== materia);
  }
}

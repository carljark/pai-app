import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { MapaTab, cursoCorto, mapaCicloLabel } from '../../../utils/mapa-labels';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaTabInfo, NivelesService } from '../../../../../services/niveles.service';

/** Ciclo del mapa con sus pestañas (una por curso, o una sola si el mapa abarca el ciclo). */
interface MapaCiclo {
  tipoNivel: string;
  tabs: MapaTabInfo[];
}

/** Selector del mapa en dos pasos: ciclo (desplegable) y curso (solo si el ciclo tiene varios). */
@Component({
  selector: 'app-mapa-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class MapaTabsComponent {
  layout = inject(LayoutService);
  private niveles = inject(NivelesService);
  isCa = computed(() => this.layout.language() === 'catalan');

  /** Ciclos con mapa en el orden del catálogo, agrupando las pestañas de cada curso. */
  ciclos = computed<MapaCiclo[]>(() => {
    const ciclos: MapaCiclo[] = [];
    for (const tab of this.niveles.mapaTabs()) {
      const ciclo = ciclos.find((c) => c.tipoNivel === tab.nivel.id);
      if (ciclo) ciclo.tabs.push(tab);
      else ciclos.push({ tipoNivel: tab.nivel.id, tabs: [tab] });
    }
    return ciclos;
  });
  activeTab = input.required<MapaTab>();

  activeConfig = computed(() => this.niveles.mapaTab(this.activeTab()));
  cursos = computed(
    () => this.ciclos().find((c) => c.tipoNivel === this.activeConfig()?.nivel.id)?.tabs ?? [],
  );

  @Output() tabChange = new EventEmitter<MapaTab>();

  cicloLabel(tab: MapaTabInfo): string {
    return mapaCicloLabel(tab, this.isCa());
  }

  cursoLabel(tab: MapaTabInfo): string {
    return tab.curso ? cursoCorto(tab.curso, this.isCa()) : '';
  }

  /** Al cambiar de ciclo se mantiene el curso actual si el nuevo ciclo lo tiene. */
  selectCiclo(tipoNivel: string) {
    const tabs = this.ciclos().find((c) => c.tipoNivel === tipoNivel)?.tabs ?? [];
    const sameCurso = tabs.find((t) => t.curso === this.activeConfig()?.curso);
    const next = sameCurso ?? tabs[0];
    if (next) this.setTab(next.tab);
  }

  setTab(tab: MapaTab) {
    this.tabChange.emit(tab);
  }
}

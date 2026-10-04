import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import {
  MAPA_CICLOS,
  MapaTab,
  MapaTabConfig,
  mapaTabConfig,
} from '@mapa-intermodular/services/mapa-tabs.config';
import { LayoutService } from '../../../../../services/layout.service';

const CURSO_LABELS = {
  '1º': { es: '1.º', ca: '1r' },
  '2º': { es: '2.º', ca: '2n' },
} as const;

/** Selector del mapa en dos pasos: ciclo (desplegable) y curso (solo si el ciclo tiene dos). */
@Component({
  selector: 'app-mapa-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class MapaTabsComponent {
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  readonly ciclos = MAPA_CICLOS;
  activeTab = input.required<MapaTab>();

  activeConfig = computed(() => mapaTabConfig(this.activeTab()));
  cursos = computed(
    () => this.ciclos.find((c) => c.tipoNivel === this.activeConfig().tipoNivel)?.tabs ?? [],
  );

  @Output() tabChange = new EventEmitter<MapaTab>();

  cicloLabel(tab: MapaTabConfig): string {
    return this.isCa() ? tab.ciclo_ca : tab.ciclo_es;
  }

  cursoLabel(tab: MapaTabConfig): string {
    return tab.curso ? CURSO_LABELS[tab.curso][this.isCa() ? 'ca' : 'es'] : '';
  }

  /** Al cambiar de ciclo se mantiene el curso actual si el nuevo ciclo lo tiene. */
  selectCiclo(tipoNivel: string) {
    const tabs = this.ciclos.find((c) => c.tipoNivel === tipoNivel)?.tabs ?? [];
    const sameCurso = tabs.find((t) => t.curso === this.activeConfig().curso);
    const next = sameCurso ?? tabs[0];
    if (next) this.setTab(next.id);
  }

  setTab(tab: MapaTab) {
    this.tabChange.emit(tab);
  }
}

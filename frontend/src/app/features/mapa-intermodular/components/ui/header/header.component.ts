import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../../../services/layout.service';
import { CommonModule } from '@angular/common';
import { MapaStats } from '../../../models/mapa-intermodular.model';
import { MapaTab, cursoLargo, mapaCicloLabel, mapaTabLabel } from '../../../utils/mapa-labels';
import { NivelesService } from '../../../../../services/niveles.service';

@Component({
  selector: 'app-mapa-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class MapaHeaderComponent {
  layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  headerExpanded = input.required<boolean>();
  activeTab = input.required<MapaTab>();
  searchQuery = input.required<string>();
  typeFilter = input.required<string>();
  stats = input.required<MapaStats>();

  isCa = computed(() => this.layout.language() === 'catalan');

  /** Pestaña activa con su nivel del catálogo. */
  tab = computed(() => this.niveles.mapaTab(this.activeTab()));

  /** Título con el nombre del ciclo y el curso de la pestaña activa. */
  title = computed(() => `Mapa intermodular del ${mapaTabLabel(this.tab(), this.isCa())}`);

  /** Subtítulo: el curso del mapa (o el único del ciclo) o, si abarca varios, el ciclo. */
  subtitle = computed(() => {
    const tab = this.tab();
    if (!tab) return '';
    const isCa = this.isCa();
    const cursos = tab.nivel.cursos;
    const unico = cursos.length === 1 ? cursos[0]?.curso : undefined;
    const cursoMapa = tab.curso ?? unico;
    if (!cursoMapa) {
      const ciclo = mapaCicloLabel(tab, isCa);
      return isCa
        ? `Explorador interactiu de connexions curriculars, criteris i activitats del ${ciclo}.`
        : `Explorador interactivo de conexiones curriculares, criterios y actividades del ${ciclo}.`;
    }
    const curso = cursoLargo(cursoMapa, isCa);
    return isCa
      ? `Relacions entre mòduls, resultats d’aprenentatge i criteris d’avaluació de ${curso}.`
      : `Relaciones entre módulos, resultados de aprendizaje y criterios de evaluación de ${curso}.`;
  });

  /** Estadística de módulos con la sigla de la etapa («Módulos CFGS»). */
  modulesLabel = computed(() => {
    const tab = this.tab();
    const sigla = tab ? ` ${this.niveles.sigla(tab.nivel)}` : '';
    return `${this.isCa() ? 'Mòduls' : 'Módulos'}${sigla}`;
  });

  // Outputs for parent component
  @Output() headerToggle = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() typeFilterChange = new EventEmitter<string>();

  toggleHeaderStatsHandler() {
    this.headerToggle.emit();
  }

  onSearch(query: string) {
    this.searchChange.emit(query);
  }

  onSetTypeFilter(type: string) {
    this.typeFilterChange.emit(type);
  }
}

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectsFacade } from '../../projects/services/projects.facade';
import { AuthFacade } from '../../auth/services/auth.facade';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';
import { SelectOption } from '../../../components/app-select/app-select.component';
import { CurriculumResolver, FilterIndex } from '../utils/curriculum-resolver';
import {
  collectOptions,
  itemsOfModule,
  sortItems,
  sortModules,
  toSelectOptions,
} from '../utils/filter-options';
import {
  HistoryFilters,
  matchesProjectFilters,
  matchesScope,
  parseKeywords,
  sortByRelevance,
} from '../utils/history-filter';

const EMPTY_INDEX: FilterIndex = { modules: [], items: [] };

/**
 * Filtros del historial en cascada, como en el mapa: nivel → curso → módulo → RA. Cada filtro
 * acota las opciones del siguiente, y un módulo o RA guardado en castellano y en catalán es una
 * sola opción, con el nombre en el idioma de la interfaz.
 */
@Injectable({ providedIn: 'root' })
export class HistoryFiltersFacade {
  private http = inject(HttpClient);
  private projects = inject(ProjectsFacade);
  private auth = inject(AuthFacade);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  private index = signal<FilterIndex>(EMPTY_INDEX);
  private resolver = computed(() => new CurriculumResolver(this.index()));

  activeTab = this.projects.historyTab;
  private cursoFilter = signal<string | null>(null);
  private moduleFilter = signal<string | null>(null);
  private raFilter = signal<string | null>(null);
  onlyMine = signal(false);
  searchQuery = signal('');

  private isCa = computed(() => this.layout.language() === 'catalan');
  keywords = computed(() => parseKeywords(this.searchQuery()));
  /** Con texto en el buscador se busca en todos los niveles (nivel y curso no filtran). */
  isSearching = computed(() => this.keywords().length > 0);

  loadIndex() {
    this.http.get<FilterIndex>('/api/curriculum/filter-index').subscribe({
      next: (index) => this.index.set(index),
      error: (err) => console.error('Error al cargar el índice del currículo', err),
    });
  }

  /** Una opción del desplegable por nivel del catálogo, en su orden y en el idioma activo. */
  levelOptions = computed<SelectOption[]>(() =>
    this.niveles
      .niveles()
      .map((n) => ({ value: n.id, label: this.niveles.nombre(n, this.isCa()) })),
  );

  /** Cursos del nivel; el selector solo se muestra si hay más de uno. */
  cursoOptions = computed(() => this.niveles.cursos(this.activeTab()));
  /** Curso elegido si pertenece al nivel activo (el nivel puede cambiar desde fuera). */
  curso = computed(() => {
    const curso = this.cursoFilter();
    return curso && this.cursoOptions().includes(curso) ? curso : null;
  });

  private baseFilters = computed<HistoryFilters>(() => {
    const owner = this.auth.currentUser();
    return {
      tab: this.activeTab(),
      curso: this.curso(),
      onlyMine: this.onlyMine(),
      ownerId: owner ? owner._id || owner.id : undefined,
      keywords: [],
      module: null,
      ra: null,
    };
  });

  /** Proyectos del nivel y curso elegidos: de ellos salen las opciones de módulo y RA. */
  private scoped = computed(() =>
    (this.projects.projectsHistory() || []).filter((p) => matchesScope(p, this.baseFilters())),
  );

  private modules = computed(() => {
    const order = (this.niveles.find(this.activeTab())?.cursos ?? []).flatMap(
      (c) => c.modulos ?? [],
    );
    const options = collectOptions(this.scoped(), (p) => this.resolver().modulesOf(p));
    return sortModules(options, order, this.isCa());
  });
  moduleOptions = computed(() => toSelectOptions(this.modules(), this.isCa()));
  module = computed(() => {
    const key = this.moduleFilter();
    return key && this.modules().some((m) => m.key === key) ? key : null;
  });

  private items = computed(() => {
    const module = this.module();
    if (!module) return [];
    return sortItems(itemsOfModule(this.scoped(), this.resolver(), module), this.isCa());
  });
  raOptions = computed(() => toSelectOptions(this.items(), this.isCa()));
  ra = computed(() => {
    const key = this.raFilter();
    return key && this.items().some((r) => r.key === key) ? key : null;
  });

  filteredProjects = computed(() => {
    const keywords = this.keywords();
    const filters = { ...this.baseFilters(), keywords, module: this.module(), ra: this.ra() };
    const matches = (this.projects.projectsHistory() || []).filter((p) =>
      matchesProjectFilters(p, filters, this.resolver()),
    );
    return sortByRelevance(matches, keywords);
  });

  setLevel(id: string) {
    this.activeTab.set(id);
    this.setCurso(null);
  }

  setCurso(curso: string | null) {
    this.cursoFilter.set(curso);
    this.setModule(null);
  }

  setModule(key: string | null) {
    this.moduleFilter.set(key || null);
    this.raFilter.set(null);
  }

  setRa(key: string | null) {
    this.raFilter.set(key || null);
  }
}

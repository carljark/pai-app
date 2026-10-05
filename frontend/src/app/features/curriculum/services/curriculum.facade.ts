import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';
import { DEFAULT_TIPO_NIVEL } from '../../projects/models/project.model';
import {
  GroupedCurriculumItem,
  ItemInfo,
  TipoNivel,
  buildItemLookup,
  filterRasForNivel,
  fuzzyFindItem,
  groupCes,
  groupRasByModule,
  shortenDescription,
  sortGroupsByModuleOrder,
} from '../utils/curriculum-grouping';
import { groupEsoCes } from '../utils/eso-grouping';

export type { GroupedCurriculumItem } from '../utils/curriculum-grouping';

const SCIENCE_KEYWORDS = [
  'ciencia',
  'ciència',
  'científico',
  'científic',
  'biología',
  'biologia',
  'física',
  'matemática',
  'matemàtique',
  'tecnología',
  'tecnologia',
];
const LANGUAGE_KEYWORDS = [
  'lengua',
  'llengua',
  'lingüístico',
  'lingüístic',
  'comunicación',
  'comunicació',
  'geografía',
  'geografia',
  'social',
];

const storage = (): Storage | undefined =>
  typeof localStorage !== 'undefined' ? localStorage : undefined;

/** Nivel y curso guardados; se validan contra el catálogo cuando se carga. */
const getStoredTipoNivel = (): TipoNivel =>
  storage()?.getItem('pai_tipo_nivel') || DEFAULT_TIPO_NIVEL;
const getStoredCurso = (): string => storage()?.getItem('pai_curso') || '1º';

@Injectable({ providedIn: 'root' })
export class CurriculumFacade {
  private http = inject(HttpClient);
  private layoutService = inject(LayoutService, { optional: true });
  private niveles = inject(NivelesService);
  private apiUrl = '/api';

  ras = signal<LearningOutcome[]>([]);
  ces = signal<EvaluativeCriteria[]>([]);
  /** CE de la ESO ordinaria del curso activo. */
  esoCes = signal<EvaluativeCriteria[]>([]);

  // Configuración base que afecta al currículum
  tipoNivel = signal<TipoNivel>(getStoredTipoNivel());
  curso = signal<string>(getStoredCurso());
  /** ¿El nivel activo se trabaja con RA (FP) o con CE (ESO)? */
  usaRa = computed(() => this.niveles.usaRa(this.tipoNivel()));

  constructor() {
    effect(() => {
      if (this.niveles.niveles().length > 0) untracked(() => this.ajustarAlCatalogo());
    });
  }

  /** Corrige el nivel o el curso guardados que el catálogo no tiene (p. ej. 4.º en un ciclo). */
  private ajustarAlCatalogo() {
    if (!this.niveles.find(this.tipoNivel())) {
      this.setTipoNivel(this.niveles.nivelPorDefecto());
    } else if (!this.niveles.cursos(this.tipoNivel()).includes(this.curso())) {
      this.setCurso(this.niveles.cursoPorDefecto(this.tipoNivel()));
    }
  }

  setTipoNivel(nivel: TipoNivel) {
    if (this.tipoNivel() !== nivel) {
      this.tipoNivel.set(nivel);
      const defaultCurso = this.niveles.cursoPorDefecto(nivel);
      this.curso.set(defaultCurso);
      storage()?.setItem('pai_tipo_nivel', nivel);
      storage()?.setItem('pai_curso', defaultCurso);
      this.clearSelection();
    }
  }

  setCurso(c: string) {
    if (this.curso() !== c) {
      this.curso.set(c);
      storage()?.setItem('pai_curso', c);
      this.clearSelection();
    }
  }

  /** Módulos del curso activo en su orden oficial, o `null` si el nivel no los fija. */
  modulosDelCurso(): string[] | null {
    return this.niveles.modulos(this.tipoNivel(), this.curso());
  }

  // Estado UI de la selección (usamos selectedRas para ambos niveles temporalmente por legado)
  selectedRas = signal<string[]>([]);

  loadRas(language: string) {
    this.http
      .get<LearningOutcome[]>(`${this.apiUrl}/ras?lang=${language}`)
      .subscribe((res) => this.ras.set(res));
  }

  loadCes(language: string) {
    this.http
      .get<EvaluativeCriteria[]>(`${this.apiUrl}/ces?lang=${language}`)
      .subscribe((res) => this.ces.set(res));
  }

  loadEsoCes(language: string, curso: string) {
    const query = `lang=${language}&tipoNivel=ESO_ORDINARIA&curso=${encodeURIComponent(curso)}`;
    this.http
      .get<EvaluativeCriteria[]>(`${this.apiUrl}/ces?${query}`)
      .subscribe((res) => this.esoCes.set(res));
  }

  /** CE cargadas para el nivel activo (PDC o ESO ordinaria). */
  activeCes(): EvaluativeCriteria[] {
    return this.tipoNivel() === 'ESO_ORDINARIA' ? this.esoCes() : this.ces();
  }

  toggleRa(desc: string) {
    this.selectedRas.update((list) =>
      list.includes(desc) ? list.filter((i) => i !== desc) : [...list, desc],
    );
  }

  clearSelection() {
    this.selectedRas.set([]);
  }

  getCategoryStyle(category: string): { bg: string; text: string; icon: string } {
    const name = category.toLowerCase();
    const matches = (keywords: string[]) => keywords.some((k) => name.includes(k));
    if (matches(SCIENCE_KEYWORDS)) return { bg: '#e8f4f8', text: '#2c3e50', icon: '' };
    if (matches(LANGUAGE_KEYWORDS)) return { bg: '#fcf3cf', text: '#7d6608', icon: '' };
    return { bg: '#ebdef0', text: '#512e5f', icon: '' };
  }

  private isCatalan(): boolean {
    return (
      this.layoutService?.language() === 'catalan' || storage()?.getItem('pai_lang') === 'catalan'
    );
  }

  groupedItems = computed<GroupedCurriculumItem[]>(() => {
    const tipoNivel = this.tipoNivel();
    if (tipoNivel === 'ESO_ORDINARIA') return groupEsoCes(this.esoCes(), this.isCatalan());
    if (!this.usaRa()) return groupCes(this.ces());

    const modulos = this.modulosDelCurso();
    const list = filterRasForNivel(this.ras(), tipoNivel, modulos, this.isCatalan());
    return sortGroupsByModuleOrder(groupRasByModule(list), modulos);
  });

  selectedItemsDetails = computed(() => {
    const groups = this.groupedItems();
    const lookup = buildItemLookup(groups);
    const fallback: ItemInfo = {
      subject: this.niveles.nombreDe(this.tipoNivel(), this.isCatalan()),
      index: 1,
    };
    return this.selectedRas().map((desc) => {
      const info = lookup.get(desc) || fuzzyFindItem(desc, groups) || fallback;
      const text = info.text ?? desc;
      return {
        subject: info.subject,
        index: info.index,
        shortDesc: shortenDescription(text),
        fullDesc: text,
      };
    });
  });

  groupedSelectedItems = computed(() => {
    const list = this.selectedItemsDetails();
    const groups: Record<string, typeof list> = {};
    for (const item of list) {
      if (!groups[item.subject]) groups[item.subject] = [];
      groups[item.subject].push(item);
    }
    return Object.keys(groups)
      .map((key) => ({
        subject: key,
        items: groups[key].sort((a, b) => a.index - b.index),
      }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  });
}

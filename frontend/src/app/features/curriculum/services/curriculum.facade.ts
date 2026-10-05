import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';
import { LayoutService } from '../../../services/layout.service';
import {
  GroupedCurriculumItem,
  ItemInfo,
  TipoNivel,
  buildItemLookup,
  filterRasForNivel,
  fuzzyFindItem,
  groupCes,
  groupRasByModule,
  isFpCycle,
  shortenDescription,
  sortCfgmGroups,
} from '../utils/curriculum-grouping';
import { groupEsoCes } from '../utils/eso-grouping';

export type { GroupedCurriculumItem } from '../utils/curriculum-grouping';
export { courseModuleOrder } from '../utils/curriculum-grouping';

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

const CE_NIVELES: readonly string[] = ['DIVERSIFICACION_CURRICULAR', 'ESO_ORDINARIA'];

/** Cursos válidos de un nivel; el primero es el curso por defecto. */
function cursosValidos(nivel: TipoNivel): string[] {
  if (nivel === 'DIVERSIFICACION_CURRICULAR') return ['3º', '4º'];
  if (nivel === 'ESO_ORDINARIA') return ['1º', '2º', '3º', '4º'];
  return ['1º', '2º'];
}

function getStoredTipoNivel(): TipoNivel {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('pai_tipo_nivel') ?? '';
    if (saved === 'FP_BASICA' || CE_NIVELES.includes(saved) || isFpCycle(saved)) {
      return saved as TipoNivel;
    }
  }
  return 'FP_BASICA';
}

function getStoredCurso(nivel: TipoNivel): string {
  const valid = cursosValidos(nivel);
  if (typeof localStorage !== 'undefined') {
    const savedCurso = localStorage.getItem('pai_curso');
    if (savedCurso && valid.includes(savedCurso)) {
      return savedCurso;
    }
  }
  return valid[0];
}

@Injectable({ providedIn: 'root' })
export class CurriculumFacade {
  private http = inject(HttpClient);
  private layoutService = inject(LayoutService, { optional: true });
  private apiUrl = '/api';

  ras = signal<LearningOutcome[]>([]);
  ces = signal<EvaluativeCriteria[]>([]);
  /** CE de la ESO ordinaria del curso activo. */
  esoCes = signal<EvaluativeCriteria[]>([]);

  // Configuración base que afecta al currículum
  tipoNivel = signal<TipoNivel>(getStoredTipoNivel());
  curso = signal<string>(getStoredCurso(this.tipoNivel()));

  setTipoNivel(nivel: TipoNivel) {
    if (this.tipoNivel() !== nivel) {
      this.tipoNivel.set(nivel);
      const defaultCurso = cursosValidos(nivel)[0];
      this.curso.set(defaultCurso);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pai_tipo_nivel', nivel);
        localStorage.setItem('pai_curso', defaultCurso);
      }
      this.clearSelection();
    }
  }

  setCurso(c: string) {
    if (this.curso() !== c) {
      this.curso.set(c);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pai_curso', c);
      }
      this.clearSelection();
    }
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
      this.layoutService?.language() === 'catalan' ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('pai_lang') === 'catalan')
    );
  }

  groupedItems = computed<GroupedCurriculumItem[]>(() => {
    const tipoNivel = this.tipoNivel();
    const isRaNivel = tipoNivel === 'FP_BASICA' || isFpCycle(tipoNivel);
    if (tipoNivel === 'ESO_ORDINARIA') return groupEsoCes(this.esoCes(), this.isCatalan());
    if (!isRaNivel) return groupCes(this.ces());

    const list = filterRasForNivel(this.ras(), tipoNivel, this.curso(), this.isCatalan());
    return sortCfgmGroups(groupRasByModule(list), tipoNivel, this.curso());
  });

  selectedItemsDetails = computed(() => {
    const groups = this.groupedItems();
    const lookup = buildItemLookup(groups);
    const fallback: ItemInfo = {
      subject: this.isCatalan() ? 'CFGB Perruqueria i Estètica' : 'CFGB Peluquería y Estética',
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

import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  FPBModule,
  LearningOutcome,
  IntermodularConnection,
  IntermodularActivity,
  MapaStats,
} from '../models/mapa-intermodular.model';
import { MapaIntermodularService } from './mapa-intermodular.service';
import { formatConnection } from '../utils/connection-summary';

export type MapaTab = 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2';

const TAB_DEFAULT_SELECTION: Record<MapaTab, { moduleCode: string; raId: string }> = {
  FPB: { moduleCode: '3060', raId: '3060_RA1' },
  CFGM: { moduleCode: '0633', raId: '0633_RA1' },
  CFGM_PELUQUERIA: { moduleCode: '0845', raId: '0845_RA1' },
  CFGM_PELUQUERIA_2: { moduleCode: '0640', raId: '0640_RA1' },
};

function hasRelation(m: FPBModule, relationType: string): boolean {
  return m.learningOutcomes.some((ra) =>
    ra.connections.some((c) => c.relationType === relationType),
  );
}

/** Coincidencia de la búsqueda con el código o nombre del módulo o con alguno de sus RAs. */
function matchesModuleQuery(m: FPBModule, q: string): boolean {
  if (!q) return true;
  return (
    m.code.toLowerCase().includes(q) ||
    m.name_es.toLowerCase().includes(q) ||
    m.name_ca.toLowerCase().includes(q) ||
    m.learningOutcomes.some(
      (ra) =>
        ra.code.toLowerCase().includes(q) ||
        ra.text_es.toLowerCase().includes(q) ||
        ra.text_ca.toLowerCase().includes(q),
    )
  );
}

@Injectable({ providedIn: 'root' })
export class MapaIntermodularFacade {
  private mapaService = inject(MapaIntermodularService);

  activeTab = signal<MapaTab>('FPB');
  modules = signal<FPBModule[]>([]);
  isLoadingSeed = signal<boolean>(false);
  selectedModuleCode = signal<string>('3060');
  selectedRaId = signal<string>('3060_RA1');
  selectedCriterion = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedTypeFilter = signal<string>('all');
  selectedRelationFilter = signal<string>('all');

  private seedCache: Partial<Record<MapaTab, FPBModule[]>> = {};

  constructor() {
    this.setTab('FPB');
  }

  private sanitizeModules(mods: FPBModule[]): FPBModule[] {
    return (mods || []).map((m) => ({
      ...m,
      learningOutcomes: (m.learningOutcomes || []).map((ra) => ({
        ...ra,
        connections: (ra.connections || []).filter((c) => c.activities && c.activities.length > 0),
      })),
    }));
  }

  async loadSeed(tab: MapaTab): Promise<FPBModule[]> {
    if (this.seedCache[tab]) {
      return this.seedCache[tab]!;
    }
    const rawData = await firstValueFrom(this.mapaService.getModules(tab));
    const data = this.sanitizeModules(rawData);
    this.seedCache[tab] = data;
    return data;
  }

  selectedModule = computed<FPBModule | null>(() => {
    const code = this.selectedModuleCode();
    const list = this.modules();
    if (!list || list.length === 0 || !code) return null;
    return list.find((m) => m.code === code) || null;
  });

  selectedRa = computed<LearningOutcome | null>(() => {
    const mod = this.selectedModule();
    if (!mod || !mod.learningOutcomes) return null;
    const raId = this.selectedRaId();
    if (!raId) return null;
    return mod.learningOutcomes.find((r: LearningOutcome) => r.id === raId) || null;
  });

  filteredConnections = computed<IntermodularConnection[]>(() => {
    const ra = this.selectedRa();
    if (!ra) return [];
    const crit = this.selectedCriterion();
    if (!crit) return ra.connections;

    const targetCrit = crit.toLowerCase().trim();
    const letterMatch =
      targetCrit.match(/^[a-z0-9\-\s.]*?([a-z])[).\s]/) || targetCrit.match(/([a-z])/);
    const letter = letterMatch ? letterMatch[1] : targetCrit;

    const filtered = ra.connections.filter((c) => {
      if (
        c.criteriaKeys &&
        (c.criteriaKeys.includes(targetCrit) || c.criteriaKeys.includes(letter))
      ) {
        return true;
      }
      if (c.sourceCriteria) {
        const sc = c.sourceCriteria.toLowerCase();
        if (sc.includes(letter)) return true;
      }
      return false;
    });

    return filtered.length > 0 ? filtered : ra.connections;
  });

  /**
   * Actividades únicas (sin duplicados) de todas las conexiones filtradas.
   * Deduplicación por `title_es` para evitar que la misma actividad aparezca
   * repetida en decenas de conexiones (problema concreto en CFGM Peluquería).
   */
  uniqueActivities = computed<IntermodularActivity[]>(() => {
    const seen = new Set<string>();
    const result: IntermodularActivity[] = [];
    for (const conn of this.filteredConnections()) {
      for (const act of conn.activities) {
        const key = act.title_es || act.title_ca;
        if (key && !seen.has(key)) {
          seen.add(key);
          result.push(act);
        }
      }
    }
    return result;
  });

  filteredModules = computed(() => {
    const raw = this.searchQuery();
    const q = typeof raw === 'string' ? raw.toLowerCase().trim() : '';
    const type = this.selectedTypeFilter();
    const relFilter = this.selectedRelationFilter();

    return this.modules().filter(
      (m) =>
        (type === 'all' || m.type === type) &&
        (relFilter === 'all' || hasRelation(m, relFilter)) &&
        matchesModuleQuery(m, q),
    );
  });

  stats = computed<MapaStats>(() => {
    const mods = this.modules();
    let totalRas = 0;
    let totalConnections = 0;
    let totalActivities = 0;

    mods.forEach((m) => {
      totalRas += m.learningOutcomes.length;
      m.learningOutcomes.forEach((ra) => {
        totalConnections += ra.connections.length;
        ra.connections.forEach((c) => {
          totalActivities += c.activities.length;
        });
      });
    });

    return {
      totalModules: mods.length,
      totalRas,
      totalConnections,
      totalActivities,
    };
  });

  selectModule(code: string) {
    if (this.selectedModuleCode() === code) {
      this.selectedModuleCode.set('');
      this.selectedRaId.set('');
      this.selectedCriterion.set(null);
      return;
    }
    this.selectedModuleCode.set(code);
    this.selectedCriterion.set(null);
    const mod = this.modules().find((m) => m.code === code);
    if (mod && mod.learningOutcomes && mod.learningOutcomes.length > 0) {
      this.selectedRaId.set(mod.learningOutcomes[0].id);
    }
  }

  selectRa(raId: string) {
    this.selectedRaId.set(raId);
    this.selectedCriterion.set(null);
    const currentMod = this.selectedModule();
    if (!currentMod || !currentMod.learningOutcomes.some((r) => r.id === raId)) {
      const foundMod = this.modules().find((m) => m.learningOutcomes.some((r) => r.id === raId));
      if (foundMod) {
        this.selectedModuleCode.set(foundMod.code);
      }
    }
  }

  selectCriterion(criterion: string | null) {
    this.selectedCriterion.set(criterion);
  }

  getConnectionsCountForCriterion(critText: string): number {
    const ra = this.selectedRa();
    if (!ra || !ra.connections) return 0;
    const targetCrit = critText.toLowerCase().trim();
    const letterMatch =
      targetCrit.match(/^[a-z0-9\-\s.]*?([a-z])[).\s]/) || targetCrit.match(/([a-z])/);
    const letter = letterMatch ? letterMatch[1] : targetCrit;

    return ra.connections.filter((c) => {
      if (
        c.criteriaKeys &&
        (c.criteriaKeys.includes(targetCrit) || c.criteriaKeys.includes(letter))
      )
        return true;
      if (c.sourceCriteria && c.sourceCriteria.toLowerCase().includes(letter)) return true;
      return false;
    }).length;
  }

  /** Acepta el texto o directamente el evento `input` del buscador. */
  setSearch(query: string | Event) {
    const q =
      typeof query === 'string' ? query : ((query?.target as HTMLInputElement | null)?.value ?? '');
    this.searchQuery.set(q);
  }

  setTypeFilter(type: string) {
    this.selectedTypeFilter.set(type);
  }

  setRelationFilter(rel: string) {
    this.selectedRelationFilter.set(rel);
  }

  exportConnectionSummary(lang: 'castellano' | 'catalan' = 'castellano'): string {
    const mod = this.selectedModule();
    const ra = this.selectedRa();
    if (!mod || !ra) return '';

    const isCa = lang === 'catalan';
    const modName = isCa ? mod.name_ca : mod.name_es;
    const raText = isCa ? ra.text_ca : ra.text_es;

    const tabLabel = this.getMapaTabLabel(isCa);

    let summary = `=== MAPA INTERMODULAR ${tabLabel}: ${mod.code} - ${modName} ===\n\n`;
    summary += `${ra.code}: ${raText}\n\n`;
    summary += isCa ? `--- CONNEXIONS INTERMODULARS ---\n` : `--- CONEXIONES INTERMODULARES ---\n`;
    return summary + ra.connections.map((c, idx) => formatConnection(c, idx, isCa)).join('');
  }

  private getMapaTabLabel(isCa: boolean): string {
    const tab = this.activeTab();
    if (isCa) {
      if (tab === 'FPB') return 'CFGB Perruqueria i Estètica';
      if (tab === 'CFGM') return 'CFGM Estètica i Bellesa';
      if (tab === 'CFGM_PELUQUERIA') return 'CFGM Perruqueria i Cosmètica Capil·lar 1r';
      return 'CFGM Perruqueria i Cosmètica Capil·lar 2n';
    }
    if (tab === 'FPB') return 'CFGB Peluquería y Estética';
    if (tab === 'CFGM') return 'CFGM Estética y Belleza';
    if (tab === 'CFGM_PELUQUERIA') return 'CFGM Peluquería y Cosmética Capilar 1º';
    return 'CFGM Peluquería y Cosmética Capilar 2º';
  }

  setTab(tab: MapaTab, directData?: FPBModule[]): Promise<FPBModule[]> {
    this.activeTab.set(tab);
    const defaults = TAB_DEFAULT_SELECTION[tab];
    if (defaults) {
      this.selectedModuleCode.set(defaults.moduleCode);
      this.selectedRaId.set(defaults.raId);
    }
    this.selectedCriterion.set(null);

    if (directData) {
      this.seedCache[tab] = directData;
      this.modules.set(directData);
      return Promise.resolve(directData);
    }

    const cached = this.seedCache[tab];
    if (cached) {
      this.modules.set(cached);
      return Promise.resolve(cached);
    }
    return this.loadSeedIntoTab(tab);
  }

  private loadSeedIntoTab(tab: MapaTab): Promise<FPBModule[]> {
    this.isLoadingSeed.set(true);
    return this.loadSeed(tab)
      .then((data) => {
        if (this.activeTab() === tab) {
          this.modules.set(data);
        }
        this.isLoadingSeed.set(false);
        return data;
      })
      .catch((err) => {
        console.error('Error loading seed for tab ' + tab, err);
        this.isLoadingSeed.set(false);
        return [];
      });
  }
}

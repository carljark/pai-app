import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FPBModule, LearningOutcome, IntermodularConnection, IntermodularActivity, CompetenceType } from '../models/mapa-intermodular.model';
import { MapaIntermodularService } from './mapa-intermodular.service';

export type MapaTab = 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2';

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
    return (mods || []).map(m => ({
      ...m,
      learningOutcomes: (m.learningOutcomes || []).map(ra => ({
        ...ra,
        connections: (ra.connections || []).filter(c => c.activities && c.activities.length > 0)
      }))
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
    return list.find(m => m.code === code) || null;
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
    const letterMatch = targetCrit.match(/^[a-z0-9\-\s\.]*?([a-z])[\)\.\s]/) || targetCrit.match(/([a-z])/);
    const letter = letterMatch ? letterMatch[1] : targetCrit;

    const filtered = ra.connections.filter(c => {
      if (c.criteriaKeys && (c.criteriaKeys.includes(targetCrit) || c.criteriaKeys.includes(letter))) {
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

    return this.modules().filter(m => {
      // Type filter
      if (type !== 'all' && m.type !== type) return false;

      // Relation filter
      if (relFilter !== 'all') {
        const hasRelation = m.learningOutcomes.some(ra => 
          ra.connections.some(c => c.relationType === relFilter)
        );
        if (!hasRelation) return false;
      }

      // Search query
      if (!q) return true;
      const matchCode = m.code.toLowerCase().includes(q);
      const matchEs = m.name_es.toLowerCase().includes(q);
      const matchCa = m.name_ca.toLowerCase().includes(q);
      const matchRa = m.learningOutcomes.some(ra => 
        ra.code.toLowerCase().includes(q) || 
        ra.text_es.toLowerCase().includes(q) || 
        ra.text_ca.toLowerCase().includes(q)
      );
      return matchCode || matchEs || matchCa || matchRa;
    });
  });

  stats = computed(() => {
    const mods = this.modules();
    let totalRas = 0;
    let totalConnections = 0;
    let totalActivities = 0;

    mods.forEach(m => {
      totalRas += m.learningOutcomes.length;
      m.learningOutcomes.forEach(ra => {
        totalConnections += ra.connections.length;
        ra.connections.forEach(c => {
          totalActivities += c.activities.length;
        });
      });
    });

    return {
      totalModules: mods.length,
      totalRas,
      totalConnections,
      totalActivities
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
    const mod = this.modules().find(m => m.code === code);
    if (mod && mod.learningOutcomes && mod.learningOutcomes.length > 0) {
      this.selectedRaId.set(mod.learningOutcomes[0].id);
    }
  }

  selectRa(raId: string) {
    this.selectedRaId.set(raId);
    this.selectedCriterion.set(null);
    const currentMod = this.selectedModule();
    if (!currentMod || !currentMod.learningOutcomes.some(r => r.id === raId)) {
      const foundMod = this.modules().find(m => m.learningOutcomes.some(r => r.id === raId));
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
    const letterMatch = targetCrit.match(/^[a-z0-9\-\s\.]*?([a-z])[\)\.\s]/) || targetCrit.match(/([a-z])/);
    const letter = letterMatch ? letterMatch[1] : targetCrit;

    return ra.connections.filter(c => {
      if (c.criteriaKeys && (c.criteriaKeys.includes(targetCrit) || c.criteriaKeys.includes(letter))) return true;
      if (c.sourceCriteria && c.sourceCriteria.toLowerCase().includes(letter)) return true;
      return false;
    }).length;
  }

  setSearch(query: string | any) {
    const q = typeof query === 'string' ? query : (query?.target?.value ?? '');
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

    ra.connections.forEach((c: IntermodularConnection, idx: number) => {
      const targetName = isCa ? c.targetModuleName_ca : c.targetModuleName_es;
      const targetRa = isCa ? c.targetRaText_ca : c.targetRaText_es;
      const just = isCa ? c.justification_ca : c.justification_es;
      const title = isCa ? (c.title_ca || c.title_es) : c.title_es;

      summary += `\n[${idx + 1}] ${title || (c.targetModuleCode + ' - ' + targetName)}\n`;
      if (c.sourceCriteria) {
        summary += `    ${isCa ? 'Criteris propis:' : 'Criterios propios:'} ${c.sourceCriteria}\n`;
      }
      if (c.relatedCriteria && c.relatedCriteria.length > 0) {
        const relStr = c.relatedCriteria.map(r => `${r.moduleCode}: ${isCa ? (r.criteria_ca || r.criteria) : (r.criteria_es || r.criteria)}`).join(' | ');
        summary += `    ${isCa ? 'Criteris relacionats:' : 'Criterios relacionados:'} ${relStr}\n`;
      }
      summary += `    ${isCa ? 'Justificació:' : 'Justificación:'} ${just}\n`;

      c.activities.forEach((act: IntermodularActivity) => {
        const aTitle = isCa ? act.title_ca : act.title_es;
        const aDesc = isCa ? act.description_ca : act.description_es;
        const aDiv = isCa ? act.diversitySupport_ca : act.diversitySupport_es;
        summary += `    * ${isCa ? 'Activitat:' : 'Actividad:'} ${aTitle}\n      ${isCa ? 'Desenvolupament:' : 'Desarrollo:'} ${aDesc}\n      ${isCa ? 'Atenció Diversitat:' : 'Atención Diversidad:'} ${aDiv}\n`;
      });
    });

    return summary;
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
    if (tab === 'FPB') {
      this.selectedModuleCode.set('3060');
      this.selectedRaId.set('3060_RA1');
    } else if (tab === 'CFGM') {
      this.selectedModuleCode.set('0633');
      this.selectedRaId.set('0633_RA1');
    } else if (tab === 'CFGM_PELUQUERIA') {
      this.selectedModuleCode.set('0845');
      this.selectedRaId.set('0845_RA1');
    } else if (tab === 'CFGM_PELUQUERIA_2') {
      this.selectedModuleCode.set('0640');
      this.selectedRaId.set('0640_RA1');
    }
    this.selectedCriterion.set(null);

    if (directData) {
      this.seedCache[tab] = directData;
      this.modules.set(directData);
      return Promise.resolve(directData);
    }

    if (this.seedCache[tab]) {
      this.modules.set(this.seedCache[tab]!);
      return Promise.resolve(this.seedCache[tab]!);
    }

    this.isLoadingSeed.set(true);
    return this.loadSeed(tab).then(data => {
      if (this.activeTab() === tab) {
        this.modules.set(data);
      }
      this.isLoadingSeed.set(false);
      return data;
    }).catch(err => {
      console.error('Error loading seed for tab ' + tab, err);
      this.isLoadingSeed.set(false);
      return [];
    });
  }
}

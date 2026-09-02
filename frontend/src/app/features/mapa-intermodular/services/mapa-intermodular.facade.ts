import { Injectable, signal, computed } from '@angular/core';
import { FPBModule, LearningOutcome, IntermodularConnection, IntermodularActivity, CompetenceType } from '../models/mapa-intermodular.model';
import { FPB_MODULES_SEED } from '../data/mapa-intermodular.seed';

@Injectable({ providedIn: 'root' })
export class MapaIntermodularFacade {
  modules = signal<FPBModule[]>(FPB_MODULES_SEED);
  selectedModuleCode = signal<string>('3060');
  selectedRaId = signal<string>('3060_RA1');
  selectedCriterion = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedTypeFilter = signal<string>('all');
  selectedRelationFilter = signal<string>('all');

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
    
    let summary = isCa 
      ? `=== MAPA INTERMODULAR FPB: ${mod.code} - ${modName} ===\n\n`
      : `=== MAPA INTERMODULAR FPB: ${mod.code} - ${modName} ===\n\n`;

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
        const relStr = c.relatedCriteria.map(r => `${r.moduleCode}: ${r.criteria}`).join(' | ');
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
}

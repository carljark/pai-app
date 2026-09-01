import { Injectable, signal, computed } from '@angular/core';
import { FPBModule, LearningOutcome, IntermodularConnection, IntermodularActivity, CompetenceType } from '../models/mapa-intermodular.model';
import { FPB_MODULES_SEED } from '../data/mapa-intermodular.seed';

@Injectable({ providedIn: 'root' })
export class MapaIntermodularFacade {
  modules = signal<FPBModule[]>(FPB_MODULES_SEED);
  selectedModuleCode = signal<string>('3060');
  selectedRaId = signal<string>('3060_RA1');
  searchQuery = signal<string>('');
  selectedTypeFilter = signal<string>('all');
  selectedRelationFilter = signal<string>('all');

  selectedModule = computed<FPBModule | null>(() => {
    const code = this.selectedModuleCode();
    const list = this.modules();
    if (!list || list.length === 0) return null;
    return list.find(m => m.code === code) || list[0] || null;
  });

  selectedRa = computed<LearningOutcome | null>(() => {
    const mod = this.selectedModule();
    if (!mod || !mod.learningOutcomes) return null;
    const raId = this.selectedRaId();
    return mod.learningOutcomes.find((r: LearningOutcome) => r.id === raId) || mod.learningOutcomes[0] || null;
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
    this.selectedModuleCode.set(code);
    const mod = this.modules().find(m => m.code === code);
    if (mod && mod.learningOutcomes.length > 0) {
      this.selectedRaId.set(mod.learningOutcomes[0].id);
    }
  }

  selectRa(raId: string) {
    this.selectedRaId.set(raId);
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

      summary += `\n[${idx + 1}] Mòdul ${c.targetModuleCode}: ${targetName} (${c.targetRaCode})\n`;
      summary += `    ${targetRa}\n`;
      summary += `    Justificació: ${just}\n`;

      c.activities.forEach((act: IntermodularActivity) => {
        const title = isCa ? act.title_ca : act.title_es;
        const desc = isCa ? act.description_ca : act.description_es;
        const div = isCa ? act.diversitySupport_ca : act.diversitySupport_es;
        summary += `    * Activitat: ${title}\n      Descripció: ${desc}\n      Atenció Diversitat: ${div}\n`;
      });
    });

    return summary;
  }
}

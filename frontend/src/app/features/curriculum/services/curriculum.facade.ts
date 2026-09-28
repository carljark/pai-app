import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';
import { LayoutService } from '../../../services/layout.service';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';

export interface GroupedCurriculumItem {
  category: string;
  items: { index: number; text: string }[];
  totalItems: number;
  moduleCode?: string;
}

const CFGM_MODULE_ORDER = ['0633', '0635', '0636', '0638', '0640', '0641', '1664', '1709', '0156'];
export const CFGM_PELUQUERIA_1ST_ORDER = ['0845', '0842', '0844', '0846', '0849', '1664', '1709', '0156'];
export const CFGM_PELUQUERIA_2ND_ORDER = ['0640', '0643', '0843', '0848', '0636', '1708', '1710', '1713'];
const CFGM_PELUQUERIA_MODULE_ORDER = [...CFGM_PELUQUERIA_1ST_ORDER, ...CFGM_PELUQUERIA_2ND_ORDER];

function getStoredTipoNivel(): 'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA' {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('pai_tipo_nivel');
    if (saved === 'DIVERSIFICACION_CURRICULAR' || saved === 'FP_BASICA' || saved === 'CFGM_ESTETICA' || saved === 'CFGM_PELUQUERIA') {
      return saved;
    }
  }
  return 'FP_BASICA';
}

function getStoredCurso(nivel: 'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA'): string {
  if (typeof localStorage !== 'undefined') {
    const savedCurso = localStorage.getItem('pai_curso');
    const valid = nivel === 'DIVERSIFICACION_CURRICULAR' ? ['3º', '4º'] : ['1º', '2º'];
    if (savedCurso && valid.includes(savedCurso)) {
      return savedCurso;
    }
  }
  return nivel === 'DIVERSIFICACION_CURRICULAR' ? '3º' : '1º';
}

@Injectable({ providedIn: 'root' })
export class CurriculumFacade {
  private http = inject(HttpClient);
  private layoutService = inject(LayoutService, { optional: true });
  private apiUrl = '/api';

  ras = signal<LearningOutcome[]>([]);
  ces = signal<EvaluativeCriteria[]>([]);

  // Configuración base que afecta al currículum
  tipoNivel = signal<'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA'>(getStoredTipoNivel());
  curso = signal<string>(getStoredCurso(this.tipoNivel()));

  setTipoNivel(nivel: 'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA') {
    if (this.tipoNivel() !== nivel) {
      this.tipoNivel.set(nivel);
      const defaultCurso = nivel === 'DIVERSIFICACION_CURRICULAR' ? '3º' : '1º';
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
    this.http.get<LearningOutcome[]>(`${this.apiUrl}/ras?lang=${language}`).subscribe(res => this.ras.set(res));
  }

  loadCes(language: string) {
    this.http.get<EvaluativeCriteria[]>(`${this.apiUrl}/ces?lang=${language}`).subscribe(res => this.ces.set(res));
  }

  toggleRa(desc: string) {
    this.selectedRas.update(list => 
      list.includes(desc) ? list.filter(i => i !== desc) : [...list, desc]
    );
  }

  clearSelection() {
    this.selectedRas.set([]);
  }

  getCategoryStyle(category: string): { bg: string, text: string, icon: string } {
    const name = category.toLowerCase();
    if (name.includes('ciencia') || name.includes('ciència') || 
        name.includes('científico') || name.includes('científic') ||
        name.includes('biología') || name.includes('biologia') ||
        name.includes('física') || name.includes('matemática') || name.includes('matemàtique') ||
        name.includes('tecnología') || name.includes('tecnologia')) {
      return { bg: '#e8f4f8', text: '#2c3e50', icon: '' }; 
    } else if (name.includes('lengua') || name.includes('llengua') || 
               name.includes('lingüístico') || name.includes('lingüístic') ||
               name.includes('comunicación') || name.includes('comunicació') ||
               name.includes('geografía') || name.includes('geografia') ||
               name.includes('social')) {
      return { bg: '#fcf3cf', text: '#7d6608', icon: '' }; 
    } else {
      return { bg: '#ebdef0', text: '#512e5f', icon: '' }; 
    }
  }

  groupedItems = computed<GroupedCurriculumItem[]>(() => {
    const isCa = this.layoutService?.language() === 'catalan' ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('pai_lang') === 'catalan');

    if (this.tipoNivel() === 'FP_BASICA' || this.tipoNivel() === 'CFGM_ESTETICA' || this.tipoNivel() === 'CFGM_PELUQUERIA') {
      const rawList = this.ras();
      let list = rawList.filter(ra => (ra as any).tipoNivel === this.tipoNivel() || (!((ra as any).tipoNivel) && this.tipoNivel() === 'FP_BASICA'));
      
      // Fallback robusto para CFGM_ESTETICA si la API aún no los devuelve
      if (this.tipoNivel() === 'CFGM_ESTETICA' && list.length === 0) {
        list = CFGM_ESTETICA_RAS_DATA.map(r => ({
          id: r.id,
          module: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
          subject: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
          description: isCa ? r.description_ca : r.description_es,
          tipoNivel: 'CFGM_ESTETICA',
          moduleCode: r.moduleCode,
          criterios: isCa ? r.criterios_ca : r.criterios_es
        } as any));
      }

      // Fallback robusto para CFGM_PELUQUERIA
      if (this.tipoNivel() === 'CFGM_PELUQUERIA' && list.length === 0) {
        list = CFGM_PELUQUERIA_RAS_DATA.map(r => ({
          id: r.id,
          module: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
          subject: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
          description: isCa ? r.description_ca : r.description_es,
          tipoNivel: 'CFGM_PELUQUERIA',
          moduleCode: r.moduleCode,
          criterios: isCa ? r.criterios_ca : r.criterios_es
        } as any));
      }

      list = list.map(r => ({
        ...r,
        module: isCa ? ((r as any).module_ca || r.module) : ((r as any).module_es || r.module),
        subject: isCa ? ((r as any).module_ca || r.subject || r.module) : ((r as any).module_es || r.subject || r.module),
        description: isCa ? ((r as any).description_ca || r.description) : ((r as any).description_es || r.description),
        criterios: isCa ? ((r as any).criterios_ca || (r as any).criterios) : ((r as any).criterios_es || (r as any).criterios)
      } as any));

      // Filtrado de módulos según el curso para CFGM_PELUQUERIA
      if (this.tipoNivel() === 'CFGM_PELUQUERIA') {
        const allowedModules = this.curso() === '2º' ? CFGM_PELUQUERIA_2ND_ORDER : CFGM_PELUQUERIA_1ST_ORDER;
        list = list.filter(r => allowedModules.includes((r as any).moduleCode));
      }

      const groups: { [key: string]: any[] } = {};
      const moduleCodes: { [key: string]: string } = {};
      
      for (const ra of list) {
        let categoryName = ra.subject || (ra as any).module;
        const code = (ra as any).moduleCode;
        if (code && !categoryName.startsWith(code)) {
          categoryName = `${code}. ${categoryName}`;
        }
        if (!groups[categoryName]) {
          groups[categoryName] = [];
          if (code) moduleCodes[categoryName] = code;
        }
        groups[categoryName].push(ra);
      }
      
      const result = Object.keys(groups).map(key => {
        const uniqueTexts: string[] = [];
        for (const ra of groups[key]) {
          if (!uniqueTexts.includes(ra.description)) {
            uniqueTexts.push(ra.description);
          }
        }
        const items = uniqueTexts.map((text, idx) => ({ index: idx + 1, text }));
        return { category: key, items, totalItems: items.length, moduleCode: moduleCodes[key] };
      });

      if (this.tipoNivel() === 'CFGM_ESTETICA' || this.tipoNivel() === 'CFGM_PELUQUERIA') {
        result.sort((a, b) => {
          let order = CFGM_MODULE_ORDER;
          if (this.tipoNivel() === 'CFGM_PELUQUERIA') {
            order = this.curso() === '2º' ? CFGM_PELUQUERIA_2ND_ORDER : CFGM_PELUQUERIA_1ST_ORDER;
          }
          const idxA = order.indexOf(a.moduleCode || '');
          const idxB = order.indexOf(b.moduleCode || '');
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          return a.category.localeCompare(b.category);
        });
      }

      return result;
    } else {
      const list = this.ces();
      const groups: { [key: string]: any[] } = {};
      
      for (const ce of list) {
        const groupName = `${(ce as any).area || ce.subject} - ${ce.subject}`;
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(ce);
      }
      
      return Object.keys(groups).map(key => {
        const uniqueTexts = Array.from(new Set(groups[key].map((c: any) => c.description)));
        const items = uniqueTexts.map((text, idx) => ({ index: idx + 1, text }));
        return { category: key, items, totalItems: items.length };
      });
    }
  });

  selectedItemsDetails = computed(() => {
    const lookup = new Map<string, { subject: string, index: number }>();
    for (const group of this.groupedItems()) {
      for (const item of group.items) {
        lookup.set(item.text, { subject: group.category, index: item.index });
      }
    }
    
    return this.selectedRas().map(desc => {
      let info = lookup.get(desc);
      if (!info) {
        // Fallback: normalized substring match against available curriculum items
        const normDesc = desc.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const group of this.groupedItems()) {
          for (const item of group.items) {
            const normItem = item.text.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normItem === normDesc || 
                (normDesc.length > 20 && (normItem.includes(normDesc.substring(0, 30)) || normDesc.includes(normItem.substring(0, 30))))) {
              info = { subject: group.category, index: item.index };
              break;
            }
          }
          if (info) break;
        }
      }

      const isCa = this.layoutService?.language() === 'catalan' ||
        (typeof localStorage !== 'undefined' && localStorage.getItem('pai_lang') === 'catalan');
      const finalInfo = info || { subject: isCa ? 'FP Bàsica' : 'FP Básica', index: 1 };
      let shortDesc = desc.substring(0, 60);
      if (desc.length > 60) shortDesc += '...';
      return { subject: finalInfo.subject, index: finalInfo.index, shortDesc, fullDesc: desc };
    });
  });

  groupedSelectedItems = computed(() => {
    const list = this.selectedItemsDetails();
    const groups: { [key: string]: typeof list } = {};
    for (const item of list) {
      if (!groups[item.subject]) groups[item.subject] = [];
      groups[item.subject].push(item);
    }
    return Object.keys(groups).map(key => ({
      subject: key,
      items: groups[key].sort((a, b) => a.index - b.index)
    })).sort((a, b) => a.subject.localeCompare(b.subject));
  });
}

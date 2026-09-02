import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';

@Injectable({ providedIn: 'root' })
export class CurriculumFacade {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  ras = signal<LearningOutcome[]>([]);
  ces = signal<EvaluativeCriteria[]>([]);

  // Configuración base que afecta al currículum
  tipoNivel = signal<'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR'>('FP_BASICA');
  curso = signal<string>('1º');

  setTipoNivel(nivel: 'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR') {
    if (this.tipoNivel() !== nivel) {
      this.tipoNivel.set(nivel);
      this.curso.set(nivel === 'FP_BASICA' ? '1º' : '3º');
      this.clearSelection();
    }
  }

  setCurso(c: string) {
    this.curso.set(c);
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

  groupedItems = computed(() => {
    if (this.tipoNivel() === 'FP_BASICA') {
      const list = this.ras();
      const groups: { [key: string]: any[] } = {};
      
      for (const ra of list) {
        let categoryName = ra.subject || (ra as any).module;
        if (!groups[categoryName]) groups[categoryName] = [];
        groups[categoryName].push(ra);
      }
      
      return Object.keys(groups).map(key => {
        const uniqueTexts: string[] = [];
        for (const ra of groups[key]) {
          if (!uniqueTexts.includes(ra.description)) {
            uniqueTexts.push(ra.description);
          }
        }
        const items = uniqueTexts.map((text, idx) => ({ index: idx + 1, text }));
        return { category: key, items, totalItems: items.length };
      });
      
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

      const finalInfo = info || { subject: 'FP Básica', index: 1 };
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

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';
  
  // Dependencias cruzadas (opcional, pero útil si queremos leer datos de selección directamente)
  private curriculumFacade = inject(CurriculumFacade);

  // --- ESTADO GLOBAL DE PROYECTOS ---
  projectsHistory = signal<any[]>([]);
  historyTab = signal<'FP_BASICA' | 'ESO'>('FP_BASICA');
  searchQuery = signal<string>('');

  // --- ESTADO DEL GENERADOR ---
  methodology = signal<string>('ABP (Aprendizaje Basado en Proyectos)');

  isGenerating = signal<boolean>(false);

  // --- ESTADO DEL TALLER (Proyecto Activo) ---
  currentProjectId = signal<string | null>(null);
  generatedProject = signal<string>('');
  projectFiles = signal<any[]>([]);
  isEditMode = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  
  // --- ESTADO DEL ASISTENTE IA ---
  aiPrompt = signal<string>('');
  isThinking = signal<boolean>(false);

  // --- COMPUTADOS ---
  currentProject = computed(() => this.projectsHistory().find(p => p._id === this.currentProjectId()));
  
  formattedGeneratedProject = computed(() => {
    return this.generatedProject() || '';
  });
  
  fpProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = p.tipoNivel === 'FP_BASICA' || !p.tipoNivel;
      if (!matchLevel) return false;
      if (!q) return true;
      return (p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q));
    });
  });

  esoProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = p.tipoNivel === 'DIVERSIFICACION_CURRICULAR';
      if (!matchLevel) return false;
      if (!q) return true;
      return (p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q));
    });
  });

  // --- METODOS ---

  loadHistory() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.projectsHistory.set(data);
      },
      error: (err) => console.error('Error fetching history:', err),
    });
  }

  deleteProject(projectId: string) {
    return this.http.delete<any>(`${this.apiUrl}/${projectId}`);
  }

  generateProject(language: string, title?: string) {
    const selectedRas = this.curriculumFacade.selectedRas();
    const tipoNivel = this.curriculumFacade.tipoNivel();
    
    let involvedModules: string[] = [];
    if (tipoNivel === 'FP_BASICA') {
      const selected = this.curriculumFacade.ras().filter(ra => selectedRas.includes(ra.description));
      involvedModules = Array.from(new Set(selected.map((ra: any) => ra.module)));
    } else {
      const selected = this.curriculumFacade.ces().filter(ce => selectedRas.includes(ce.description));
      involvedModules = Array.from(new Set(selected.map((ce: any) => ce.subject || '')));
    }

    return this.http.post<any>(`${this.apiUrl}/generate`, {
      selectedRas,
      methodology: this.methodology(),
      modules: involvedModules,
      tipoNivel,
      language,
      courseLevel: this.curriculumFacade.curso(),
      title: title || (tipoNivel === 'FP_BASICA' ? 'Proyecto Integrador' : 'Proyecto de ESO')
    });
  }

  updateProjectStatus(status: 'borrador' | 'publicado') {
    const id = this.currentProjectId();
    if (!id) return;
    return this.http.put<any>(`${this.apiUrl}/${id}`, { rawText: this.generatedProject(), status });
  }

  rewriteSection(selectedText: string, instruction: string) {
    return this.http.post<any>(`${this.apiUrl}/rewrite`, {
      context: this.generatedProject(),
      selectedText,
      instruction
    });
  }

  // --- ARCHIVOS ---
  loadProjectFiles() {
    const id = this.currentProjectId();
    if (!id) return;
    this.http.get<any[]>(`${this.apiUrl}/${id}/files`).subscribe({
      next: (files) => this.projectFiles.set(files),
      error: (err) => console.error("Error al cargar archivos", err)
    });
  }

  uploadFile(file: File) {
    const id = this.currentProjectId();
    if (!id) return;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${id}/files`, formData);
  }

  deleteFile(filename: string) {
    const id = this.currentProjectId();
    if (!id) return null;
    return this.http.delete<any>(`${this.apiUrl}/${id}/files/${filename}`);
  }

  getDownloadUrl(filename: string): string {
    const id = this.currentProjectId();
    if (!id) return '';
    return `${this.apiUrl}/${id}/files/${filename}`;
  }

  exportDocx() {
    const id = this.currentProjectId();
    if (!id) return;
    return this.http.get(`${this.apiUrl}/${id}/export-docx`, { responseType: 'blob' });
  }

  importDocx(file: File) {
    const id = this.currentProjectId();
    if (!id) return;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${id}/import-docx`, formData);
  }
}

/**
 * Repara delimitadores LaTeX $ desbalanceados generados por la IA.
 *
 * Problemas comunes que corrige:
 *  1. Listas como `$\text{kg}, $\text{g}, \text{mg}$` → tres $ → el parser falla.
 *     Se corrige eliminando el $ "suelto" que empieza una nueva expresión dentro
 *     de un contexto de texto normal (no está al principio de un bloque math).
 *  2. `$ expr $` con espacios justo al lado del delimitador → se compactan.
 *  3. Un único $ que no tiene pareja al final de la línea → se elimina.
 */
function sanitizeMath(text: string): string {
  // Paso 1: normalizar "$ expr$" → "$expr$" sin usar lookbehinds
  // Reemplazar espacios después del $ de apertura
  text = text.replace(/(^|[^$])\$[^\S\n]+(?=[\\A-Za-z{])/g, '$1$');
  // Reemplazar espacios antes del $ de cierre
  text = text.replace(/[^\S\n]+\$(?![A-Za-z\\{])/g, '$');

  // Paso 2: separar las líneas para procesar cada una individualmente
  return text.split('\n').map(line => fixDollarDelimiters(line)).join('\n');
}

/**
 * En una línea, cuenta el número de $ (excluyendo $$).
 * Si el número es impar, el último $ huérfano se elimina.
 * También repara el patrón ",$\text" dentro de una expresión ya abierta,
 * que debería ser ",\text" (la coma va fuera del bloque math).
 */
function fixDollarDelimiters(line: string): string {
  // Reemplaza patrones del tipo: `$A, $B, C$` → `$A, B, C$`
  // Solo aplica cuando el $ aparece DESPUÉS de una coma o punto y coma
  // (nunca después de paréntesis abierto, porque "($..." es una apertura legítima).
  line = line.replace(/([,;]\s*)\$(?=[\\A-Za-z])/g, '$1');

  // Contar $ simples que no son $$ (bloques)
  // Eliminamos los $$ temporalmente para no contarlos
  const withoutDouble = line.replace(/\$\$/g, '');
  const count = (withoutDouble.match(/\$/g) || []).length;

  // Si hay número impar de $, el último $ suelto se elimina
  if (count % 2 !== 0) {
    const lastIdx = line.lastIndexOf('$');
    // Solo lo eliminamos si no forma parte de $$
    if (lastIdx >= 0 && line[lastIdx - 1] !== '$' && line[lastIdx + 1] !== '$') {
      line = line.slice(0, lastIdx) + line.slice(lastIdx + 1);
    }
  }

  return line;
}

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
  courseLevel = signal<string>('1º Curso');
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
      courseLevel: this.courseLevel(),
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

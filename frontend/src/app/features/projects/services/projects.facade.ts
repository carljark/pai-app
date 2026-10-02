/**
 * Projects Facade (Hexagonal Architecture - Application Layer)
 * Orchestrates use cases, manages UI state, delegates HTTP to ProjectsService.
 * No direct HTTP calls, no DTO handling.
 */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthFacade } from '../../auth/services/auth.facade';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { ProjectsService } from './projects.service';
import {
  Project,
  ProjectStatus,
  ProjectType,
  HistoryTab,
  CreateProjectPayload,
  UpdateProjectPayload,
  GenerateProjectResponse,
  ProjectFile,
  AIProvider,
  AIModelOption,
  AiModelOptionDto,
  MethodologyOption,
  getHistoryTabForTipoNivel,
  isFPProject,
  isESOProject,
  METHODOLOGY_OPTIONS,
  AI_PROVIDER_OPTIONS,
} from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private projectsService = inject(ProjectsService);
  private curriculumFacade = inject(CurriculumFacade);
  private authFacade = inject(AuthFacade);

  // ============================================
  // STATE - Historial
  // ============================================
  projectsHistory = signal<Project[]>([]);
  historyTab = signal<HistoryTab>('FPB');
  searchQuery = signal<string>('');

  // ============================================
  // STATE - Generador
  // ============================================
  methodology = signal<string>(METHODOLOGY_OPTIONS[0].value);
  selectedAi = signal<AIProvider>('gemini');
  selectedModel = signal<string>('');
  extraInstructions = signal<string>('');
  isGenerating = signal<boolean>(false);

  /** Catálogo de modelos recibido del backend. */
  private allModels = signal<AiModelOptionDto[]>([]);
  private defaultModels = signal<Record<AIProvider, string>>({ gemini: '', openrouter: '' });

  // ============================================
  // STATE - Taller (Proyecto Activo)
  // ============================================
  currentProjectId = signal<string | null>(null);
  generatedProject = signal<string>('');
  projectFiles = signal<ProjectFile[]>([]);
  isEditMode = signal<boolean>(false);
  isUploading = signal<boolean>(false);

  // ============================================
  // STATE - Asistente IA
  // ============================================
  aiPrompt = signal<string>('');
  isThinking = signal<boolean>(false);

  // ============================================
  // STATE - Undo Stacks (por proyecto)
  // ============================================
  undoStacksByProject = signal<Record<string, string[]>>({});
  undoStack = computed(() => {
    const id = this.currentProjectId() || '__temp__';
    return this.undoStacksByProject()[id] || [];
  });
  canUndo = computed(() => this.undoStack().length > 0);

  // ============================================
  // COMPUTED - Derivados
  // ============================================
  currentProject = computed(() => 
    this.projectsHistory().find(p => p._id === this.currentProjectId())
  );

  myProjects = computed(() => {
    const user = this.authFacade.currentUser();
    if (!user) return [];
    const uid = user._id || (user as any).id;
    return this.projectsHistory().filter(p => {
      const pAuthorId = (p.userId as any)?._id || p.userId;
      return pAuthorId?.toString() === uid?.toString();
    });
  });

  formattedGeneratedProject = computed(() => this.generatedProject() || '');

  fpProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = isFPProject(p.tipoNivel);
      if (!matchLevel) return false;
      if (!q) return true;
      return (p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q));
    });
  });

  esoProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = isESOProject(p.tipoNivel);
      if (!matchLevel) return false;
      if (!q) return true;
      return (p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q));
    });
  });

  // ============================================
  // OPTIONS - Para selects en UI
  // ============================================
  methodologyOptions = METHODOLOGY_OPTIONS;
  aiProviderOptions = AI_PROVIDER_OPTIONS;
  availableModels = computed<AIModelOption[]>(() =>
    this.allModels()
      .filter(m => m.provider === this.selectedAi())
      .map(({ value, label, provider }) => ({ value, label, provider }))
  );

  // ============================================
  // EFFECTS - Sincronización automática
  // ============================================
  constructor() {
    this.loadAiModels();

    // Auto-actualizar modelo cuando cambia el proveedor o carga el catálogo.
    effect(() => {
      const provider = this.selectedAi();
      const fallback = this.defaultModels()[provider];
      const currentValid = this.allModels().some(m => m.provider === provider && m.value === this.selectedModel());
      if (fallback && !currentValid) {
        this.selectedModel.set(fallback);
      }
    });

    // Auto-cargar historial cuando hay usuario autenticado
    effect(() => {
      const user = this.authFacade.currentUser();
      if (user) {
        this.loadHistory();
      }
    });
  }

  /** Carga el catálogo de modelos desde el backend (fuente única). */
  private loadAiModels(): void {
    this.projectsService.getAiModels().subscribe({
      next: (res) => {
        this.allModels.set(res?.models || []);
        const defaults: Record<AIProvider, string> = { gemini: '', openrouter: '' };
        (res?.providers || []).forEach(p => { defaults[p.value] = p.defaultModel; });
        this.defaultModels.set(defaults);
      },
      error: (err) => console.error('Error loading AI models', err),
    });
  }

  /** Modelo por defecto de un proveedor según el catálogo del backend. */
  defaultModelForProvider(provider: AIProvider): string {
    const configured = this.defaultModels()[provider];
    if (configured) return configured;
    return this.allModels().find(m => m.provider === provider)?.value || '';
  }

  // ============================================
  // USE CASES - Historial
  // ============================================

  /** Carga el historial de proyectos desde el backend */
  loadHistory(): void {
    this.projectsService.getHistory().subscribe({
      next: (projects) => this.projectsHistory.set(projects),
      error: (err) => console.error('Error fetching history:', err),
    });
  }

  /** Elimina un proyecto y limpia su undo stack */
  deleteProject(projectId: string) {
    this.undoStacksByProject.update(map => {
      const copy = { ...map };
      delete copy[projectId];
      return copy;
    });
    return this.projectsService.deleteProject(projectId);
  }

  /** Reintenta la generación de un proyecto fallido */
  retryProject(projectId: string) {
    return this.projectsService.retryProject(projectId).pipe(
      tap({
        next: (res) => {
          // Actualizar en historial
          this.projectsHistory.update(list => 
            list.map(p => p._id === projectId ? res.project : p)
          );
        },
        error: (err) => console.error('Error retrying project:', err),
      })
    );
  }

  // ============================================
  // USE CASES - Generación
  // ============================================

  /** Genera un nuevo proyecto con la IA */
  generateProject(language: string, title?: string) {
    const selectedRas = this.curriculumFacade.selectedRas();
    const tipoNivel = this.curriculumFacade.tipoNivel();
    
    // Actualizar pestaña de historial según tipo
    this.historyTab.set(getHistoryTabForTipoNivel(tipoNivel));

    // Resolver módulos implicados
    const modules = this.getInvolvedModules(tipoNivel, selectedRas);
    const defaultTitle = modules.length > 0 ? modules.join(' + ') : 'Proyecto Integrador';
    const extra = this.extraInstructions().trim();

    const payload: CreateProjectPayload = {
      selectedRas,
      methodology: this.methodology(),
      modules,
      tipoNivel,
      language,
      aiProvider: this.selectedAi(),
      aiModel: this.selectedModel(),
      courseLevel: this.curriculumFacade.curso(),
      title: title || defaultTitle,
      extraInstructions: extra || undefined,
    };

    this.isGenerating.set(true);
    return this.projectsService.generateProject(payload).pipe(
      tap({
        next: (res: GenerateProjectResponse) => {
          this.isGenerating.set(false);
          // Abrir el proyecto generado en el taller
          this.currentProjectId.set(res.project._id);
          this.generatedProject.set(res.project.generatedContent?.rawText || '');
          this.projectFiles.set([]);
          this.undoStacksByProject.update(map => ({ ...map, [res.project._id]: [] }));
          // Recargar historial para que aparezca
          this.loadHistory();
        },
        error: (err) => {
          this.isGenerating.set(false);
          console.error('Error generating project:', err);
        },
      })
    );
  }

  /** Resuelve los módulos implicados según tipo de nivel y RAs seleccionados */
  private getInvolvedModules(tipoNivel: ProjectType, selectedRas: string[]): string[] {
    const isCa = typeof localStorage !== 'undefined' && localStorage.getItem('pai_lang') === 'catalan';
    
    if (tipoNivel === 'DIVERSIFICACION_CURRICULAR') {
      const selected = this.curriculumFacade.ces().filter(ce => selectedRas.includes(ce.description));
      return Array.from(new Set(selected.map((ce: any) => ce.subject || '')));
    }
    
    const selected = this.curriculumFacade.ras().filter(ra => selectedRas.includes(ra.description));
    
    if (tipoNivel === 'CFGM_PELUQUERIA') {
      const order = this.curriculumFacade.curso() === '2º' ? 
        ['0640', '0643', '0843', '0848', '0636', '1708', '1710', '1713'] :
        ['0845', '0842', '0844', '0846', '0849', '1664', '1709', '0156'];
      
      const moduleNames: string[] = [];
      for (const modCode of order) {
        const module = selected.find(ra => (ra as any).moduleCode === modCode);
        if (module) {
          const fullName = isCa 
            ? (module as any).subject_ca || (module as any).subject || (module as any).module 
            : (module as any).subject_es || (module as any).subject || (module as any).module;
          moduleNames.push(fullName);
        }
      }
      return moduleNames.length > 0 
        ? moduleNames 
        : [isCa ? 'CFGM Peluqueria i Cosmètica Capilar' : 'CFGM Peluquería y Cosmética Capilar'];
    } else {
      return Array.from(new Set(selected.map((ra: any) => ra.subject || ra.module || '')));
    }
  }

  /** Actualiza el estado del proyecto actual (borrador/publicado) */
  updateProjectStatus(status: ProjectStatus) {
    const id = this.currentProjectId();
    if (!id) return;
    
    const payload: UpdateProjectPayload = {
      rawText: this.generatedProject(),
      status,
    };
    
    return this.projectsService.updateProjectStatus(id, payload).pipe(
      tap({
        next: (updatedProject) => {
          this.projectsHistory.update(list => 
            list.map(p => p._id === id ? updatedProject : p)
          );
          this.generatedProject.set(updatedProject.generatedContent?.rawText || '');
        },
        error: (err) => console.error('Error updating project status:', err),
      })
    );
  }

  /** Reescribe una sección del proyecto con IA */
  rewriteSection(instruction: string, aiProvider?: AIProvider, aiModel?: string) {
    const payload = {
      context: this.generatedProject(),
      instruction,
      aiProvider: aiProvider || this.selectedAi(),
      aiModel: aiModel || this.selectedModel(),
    };
    
    this.isThinking.set(true);
    return this.projectsService.rewriteSection(payload).pipe(
      tap({
        next: (newText: string) => {
          this.isThinking.set(false);
          this.generatedProject.set(newText);
        },
        error: (err) => {
          this.isThinking.set(false);
          console.error('Error rewriting section:', err);
        },
      })
    );
  }

  // ============================================
  // USE CASES - Undo/Redo
  // ============================================

  /** Guarda estado actual en pila de undo del proyecto activo */
  pushUndo(): void {
    const current = this.generatedProject();
    const id = this.currentProjectId() || '__temp__';
    if (current) {
      this.undoStacksByProject.update(map => ({
        ...map,
        [id]: [...(map[id] || []), current]
      }));
    }
  }

  /** Elimina último estado de la pila (ej. si falló la IA) */
  popUndo(): void {
    const id = this.currentProjectId() || '__temp__';
    const stack = this.undoStacksByProject()[id] || [];
    if (stack.length === 0) return;
    this.undoStacksByProject.update(map => ({
      ...map,
      [id]: stack.slice(0, -1)
    }));
  }

  /** Deshace último cambio IA */
  undoLastChange(): void {
    const id = this.currentProjectId() || '__temp__';
    const stack = this.undoStacksByProject()[id] || [];
    if (stack.length === 0) return;
    
    const previous = stack[stack.length - 1];
    this.generatedProject.set(previous);
    this.undoStacksByProject.update(map => ({
      ...map,
      [id]: stack.slice(0, -1)
    }));
    this.updateProjectStatus('borrador')?.subscribe();
  }

  // ============================================
  // USE CASES - Archivos
  // ============================================

  loadProjectFiles(): void {
    const id = this.currentProjectId();
    if (!id) return;
    this.projectsService.getProjectFiles(id).pipe(
      tap({
        next: (files) => this.projectFiles.set(files),
        error: (err) => console.error("Error al cargar archivos", err)
      })
    ).subscribe({ error: () => { /* error already logged above */ } });
  }

  uploadFile(file: File) {
    const id = this.currentProjectId();
    if (!id) return;
    this.isUploading.set(true);
    return this.projectsService.uploadFile(id, file).pipe(
      tap({
        next: (res) => {
          this.isUploading.set(false);
          this.projectFiles.update(list => [...list, res.file]);
        },
        error: (err) => {
          this.isUploading.set(false);
          console.error('Error uploading file:', err);
        },
      })
    );
  }

  deleteFile(filename: string) {
    const id = this.currentProjectId();
    if (!id) return null;
    return this.projectsService.deleteFile(id, filename).pipe(
      tap({
        next: () => {
          this.projectFiles.update(list => list.filter(f => f.filename !== filename));
        },
        error: (err) => console.error('Error deleting file:', err),
      })
    );
  }

  getDownloadUrl(filename: string): string {
    const id = this.currentProjectId();
    if (!id) return '';
    return this.projectsService.getDownloadUrl(id, filename);
  }

  exportDocx() {
    const id = this.currentProjectId();
    if (!id) return;
    return this.projectsService.exportDocx(id);
  }

  importDocx(file: File) {
    const id = this.currentProjectId();
    if (!id) return;
    this.isUploading.set(true);
    return this.projectsService.importDocx(id, file).pipe(
      tap({
        next: (res) => {
          this.isUploading.set(false);
          this.generatedProject.set(res.project.generatedContent?.rawText || '');
          this.projectFiles.set([]);
        },
        error: (err) => {
          this.isUploading.set(false);
          console.error('Error importing docx:', err);
        },
      })
    );
  }

  // ============================================
  // HELPERS PÚBLICOS
  // ============================================

  /** Limpia la selección de RAs del currículum */
  clearSelection(): void {
    this.curriculumFacade.clearSelection();
  }

  /** Establece el proyecto actual para edición en taller */
  setCurrentProject(project: Project): void {
    this.currentProjectId.set(project._id);
    this.generatedProject.set(project.generatedContent?.rawText || '');
    this.projectFiles.set([]);
    this.undoStacksByProject.update(map => ({ ...map, [project._id]: [] }));
  }

  /** Limpia el proyecto actual */
  clearCurrentProject(): void {
    this.currentProjectId.set(null);
    this.generatedProject.set('');
    this.projectFiles.set([]);
    this.isEditMode.set(false);
  }
}
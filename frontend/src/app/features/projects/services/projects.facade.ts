/**
 * Projects Facade (Hexagonal Architecture - Application Layer)
 * Orchestrates use cases, manages UI state, delegates HTTP to ProjectsService.
 * No direct HTTP calls, no DTO handling.
 */

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthFacade } from '../../auth/services/auth.facade';
import {
  CurriculumFacade,
  CFGM_PELUQUERIA_1ST_ORDER,
  CFGM_PELUQUERIA_2ND_ORDER,
} from '../../curriculum/services/curriculum.facade';
import { LearningOutcome } from '../../curriculum/models/curriculum.model';
import { ProjectsService } from './projects.service';
import { findProjectsWithSameSelection } from '../utils/selection-match';
import { RewriteSectionResponseDto, rewrittenText } from '../mappers/projects.mapper';
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
  DirectoryUser,
  getHistoryTabForTipoNivel,
  getOwnerId,
  ContentLanguage,
  projectLanguage,
  projectTextIn,
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
  /** Proveedores que ofrece el backend (p. ej. sin Gemini si está desactivado). */
  availableProviders = signal<AIProvider[]>([]);

  /** Colaboradores: directorio de usuarios y selección para el nuevo proyecto. */
  directory = signal<DirectoryUser[]>([]);
  selectedCollaborators = signal<string[]>([]);

  // ============================================
  // STATE - Taller (Proyecto Activo)
  // ============================================
  currentProjectId = signal<string | null>(null);
  generatedProject = signal<string>('');
  /** Idioma del texto de `generatedProject`: se usa al guardar y al exportar. */
  contentLanguage = signal<ContentLanguage>('castellano');
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
    this.projectsHistory().find((p) => p._id === this.currentProjectId()),
  );

  myProjects = computed(() => {
    const user = this.authFacade.currentUser();
    if (!user) return [];
    const uid = user._id || user.id;
    return this.projectsHistory().filter((p) => getOwnerId(p.userId) === uid);
  });

  formattedGeneratedProject = computed(() => this.generatedProject() || '');

  fpProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter((p) => {
      const matchLevel = isFPProject(p.tipoNivel);
      if (!matchLevel) return false;
      if (!q) return true;
      return (
        p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q)
      );
    });
  });

  esoProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter((p) => {
      const matchLevel = isESOProject(p.tipoNivel);
      if (!matchLevel) return false;
      if (!q) return true;
      return (
        p.title?.toLowerCase().includes(q) || p.generatedContent?.rawText?.toLowerCase().includes(q)
      );
    });
  });

  // ============================================
  // OPTIONS - Para selects en UI
  // ============================================
  methodologyOptions = METHODOLOGY_OPTIONS;
  aiProviderOptions = AI_PROVIDER_OPTIONS;
  availableModels = computed<AIModelOption[]>(() =>
    this.allModels()
      .filter((m) => m.provider === this.selectedAi())
      .map(({ value, label, provider }) => ({ value, label, provider })),
  );

  /** Proyectos generados cuya selección de RAs/CEs coincide exactamente con la actual. */
  matchingProjects = computed(() =>
    findProjectsWithSameSelection(this.projectsHistory(), this.curriculumFacade.selectedRas()),
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
      const currentValid = this.allModels().some(
        (m) => m.provider === provider && m.value === this.selectedModel(),
      );
      if (fallback && !currentValid) {
        this.selectedModel.set(fallback);
      }
    });

    // Auto-cargar historial cuando hay usuario autenticado
    effect(() => {
      const user = this.authFacade.currentUser();
      if (user) {
        this.loadHistory();
        this.loadDirectory();
      }
    });
  }

  /** Carga el directorio de usuarios para invitar como colaboradores. */
  private loadDirectory(): void {
    this.projectsService.getUserDirectory().subscribe({
      next: (users) => this.directory.set(users || []),
      error: (err) => console.error('Error loading user directory', err),
    });
  }

  /** Añade o quita un usuario de la selección de colaboradores del nuevo proyecto. */
  toggleCollaborator(userId: string): void {
    this.selectedCollaborators.update((list) =>
      list.includes(userId) ? list.filter((id) => id !== userId) : [...list, userId],
    );
  }

  /** Nombres de los colaboradores de un proyecto (para mostrar e invitar). */
  getCollaboratorNames(project: Project): string[] {
    return (project?.collaborators || [])
      .map((c) => (typeof c.userId === 'object' ? c.userId?.name : ''))
      .filter((name): name is string => Boolean(name));
  }

  getCollaboratorIds(project: Project): string[] {
    return (project?.collaborators || [])
      .map((c) => (typeof c.userId === 'string' ? c.userId : c.userId?._id))
      .filter((id): id is string => Boolean(id));
  }

  isShared(project: Project): boolean {
    return (project?.collaborators?.length || 0) > 0;
  }

  addCollaborator(projectId: string, userId: string) {
    return this.projectsService
      .addCollaborator(projectId, userId)
      .pipe(tap({ next: (updated) => this.replaceInHistory(updated) }));
  }

  removeCollaborator(projectId: string, userId: string) {
    return this.projectsService
      .removeCollaborator(projectId, userId)
      .pipe(tap({ next: (updated) => this.replaceInHistory(updated) }));
  }

  private replaceInHistory(updated: Project): void {
    this.projectsHistory.update((list) => list.map((p) => (p._id === updated._id ? updated : p)));
  }

  /** Carga el catálogo de modelos desde el backend (fuente única). */
  private loadAiModels(): void {
    this.projectsService.getAiModels().subscribe({
      next: (res) => {
        this.allModels.set(res?.models || []);
        const defaults: Record<AIProvider, string> = { gemini: '', openrouter: '' };
        (res?.providers || []).forEach((p) => {
          defaults[p.value] = p.defaultModel;
        });
        this.defaultModels.set(defaults);
        this.applyAvailableProviders((res?.providers || []).map((p) => p.value));
      },
      error: (err) => console.error('Error loading AI models', err),
    });
  }

  /** Si el proveedor seleccionado ya no se ofrece (Gemini desactivado), se pasa al primero disponible. */
  private applyAvailableProviders(providers: AIProvider[]): void {
    this.availableProviders.set(providers);
    if (providers.length > 0 && !providers.includes(this.selectedAi())) {
      this.selectedAi.set(providers[0]);
    }
  }

  /** Modelo por defecto de un proveedor según el catálogo del backend. */
  defaultModelForProvider(provider: AIProvider): string {
    const configured = this.defaultModels()[provider];
    if (configured) return configured;
    return this.allModels().find((m) => m.provider === provider)?.value || '';
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
    this.undoStacksByProject.update((map) => {
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
          this.projectsHistory.update((list) =>
            list.map((p) => (p._id === projectId ? res.project : p)),
          );
        },
        error: (err) => console.error('Error retrying project:', err),
      }),
    );
  }

  // ============================================
  // USE CASES - Generación
  // ============================================

  /** Genera un nuevo proyecto con la IA */
  generateProject(language: string, title?: string) {
    const tipoNivel = this.curriculumFacade.tipoNivel();
    // Actualizar pestaña de historial según tipo
    this.historyTab.set(getHistoryTabForTipoNivel(tipoNivel));
    const payload = this.buildCreatePayload(language, tipoNivel, title);

    this.isGenerating.set(true);
    return this.projectsService.generateProject(payload).pipe(
      tap({
        next: (res: GenerateProjectResponse) => this.onProjectGenerated(res),
        error: (err) => {
          this.isGenerating.set(false);
          console.error('Error generating project:', err);
        },
      }),
    );
  }

  private buildCreatePayload(
    language: string,
    tipoNivel: ProjectType,
    title?: string,
  ): CreateProjectPayload {
    const selectedRas = this.curriculumFacade.selectedRas();
    const modules = this.getInvolvedModules(tipoNivel, selectedRas);
    const defaultTitle = modules.length > 0 ? modules.join(' + ') : 'Proyecto Integrador';
    const extra = this.extraInstructions().trim();
    const collaborators = this.selectedCollaborators();
    return {
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
      collaboratorIds: collaborators.length > 0 ? collaborators : undefined,
    };
  }

  /** Abre el proyecto generado en el taller y recarga el historial para que aparezca. */
  private onProjectGenerated(res: GenerateProjectResponse): void {
    this.isGenerating.set(false);
    this.currentProjectId.set(res.project._id);
    this.generatedProject.set(res.project.generatedContent?.rawText || '');
    this.contentLanguage.set(projectLanguage(res.project));
    this.projectFiles.set([]);
    this.selectedCollaborators.set([]);
    this.undoStacksByProject.update((map) => ({ ...map, [res.project._id]: [] }));
    this.loadHistory();
  }

  /** Resuelve los módulos implicados según tipo de nivel y RAs seleccionados */
  private getInvolvedModules(tipoNivel: ProjectType, selectedRas: string[]): string[] {
    if (tipoNivel === 'DIVERSIFICACION_CURRICULAR') {
      const selected = this.curriculumFacade
        .ces()
        .filter((ce) => selectedRas.includes(ce.description));
      return Array.from(new Set(selected.map((ce) => ce.subject || '')));
    }

    const selected = this.curriculumFacade
      .ras()
      .filter((ra) => selectedRas.includes(ra.description));
    if (tipoNivel === 'CFGM_PELUQUERIA') return this.getPeluqueriaModules(selected);
    return Array.from(new Set(selected.map((ra) => ra.subject || ra.module || '')));
  }

  /** Módulos de Peluquería en el orden oficial del curso, con su nombre en el idioma activo. */
  private getPeluqueriaModules(selected: LearningOutcome[]): string[] {
    const isCa =
      typeof localStorage !== 'undefined' && localStorage.getItem('pai_lang') === 'catalan';
    const order =
      this.curriculumFacade.curso() === '2º'
        ? CFGM_PELUQUERIA_2ND_ORDER
        : CFGM_PELUQUERIA_1ST_ORDER;
    const moduleNames = order
      .map((code) => selected.find((ra) => ra.moduleCode === code))
      .filter((ra): ra is LearningOutcome => ra !== undefined)
      .map((ra) => (isCa ? ra.subject_ca : ra.subject_es) || ra.subject || ra.module || '');
    return moduleNames.length > 0
      ? moduleNames
      : [isCa ? 'CFGM Peluqueria i Cosmètica Capilar' : 'CFGM Peluquería y Cosmética Capilar'];
  }

  /** Actualiza el estado del proyecto actual (borrador/publicado) */
  updateProjectStatus(status: ProjectStatus) {
    const id = this.currentProjectId();
    if (!id) return;

    const payload: UpdateProjectPayload = {
      rawText: this.generatedProject(),
      status,
      language: this.contentLanguage(),
    };

    return this.projectsService.updateProjectStatus(id, payload).pipe(
      tap({
        next: (updatedProject) => {
          this.projectsHistory.update((list) =>
            list.map((p) => (p._id === id ? updatedProject : p)),
          );
          this.generatedProject.set(projectTextIn(updatedProject, this.contentLanguage()));
        },
        error: (err) => console.error('Error updating project status:', err),
      }),
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
        next: (result: RewriteSectionResponseDto) => {
          this.isThinking.set(false);
          this.generatedProject.set(rewrittenText(result));
        },
        error: (err) => {
          this.isThinking.set(false);
          console.error('Error rewriting section:', err);
        },
      }),
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
      this.undoStacksByProject.update((map) => ({
        ...map,
        [id]: [...(map[id] || []), current],
      }));
    }
  }

  /** Elimina último estado de la pila (ej. si falló la IA) */
  popUndo(): void {
    const id = this.currentProjectId() || '__temp__';
    const stack = this.undoStacksByProject()[id] || [];
    if (stack.length === 0) return;
    this.undoStacksByProject.update((map) => ({
      ...map,
      [id]: stack.slice(0, -1),
    }));
  }

  /** Deshace último cambio IA */
  undoLastChange(): void {
    const id = this.currentProjectId() || '__temp__';
    const stack = this.undoStacksByProject()[id] || [];
    if (stack.length === 0) return;

    const previous = stack[stack.length - 1];
    this.generatedProject.set(previous);
    this.undoStacksByProject.update((map) => ({
      ...map,
      [id]: stack.slice(0, -1),
    }));
    this.updateProjectStatus('borrador')?.subscribe();
  }

  // ============================================
  // USE CASES - Archivos
  // ============================================

  loadProjectFiles(): void {
    const id = this.currentProjectId();
    if (!id) return;
    this.projectsService
      .getProjectFiles(id)
      .pipe(
        tap({
          next: (files) => this.projectFiles.set(files),
          error: (err) => console.error('Error al cargar archivos', err),
        }),
      )
      .subscribe({
        error: () => {
          /* error already logged above */
        },
      });
  }

  uploadFile(file: File) {
    const id = this.currentProjectId();
    if (!id) return;
    this.isUploading.set(true);
    return this.projectsService.uploadFile(id, file).pipe(
      tap({
        next: (res) => {
          this.isUploading.set(false);
          this.projectFiles.update((list) => [...list, res.file]);
        },
        error: (err) => {
          this.isUploading.set(false);
          console.error('Error uploading file:', err);
        },
      }),
    );
  }

  deleteFile(filename: string) {
    const id = this.currentProjectId();
    if (!id) return null;
    return this.projectsService.deleteFile(id, filename).pipe(
      tap({
        next: () => {
          this.projectFiles.update((list) => list.filter((f) => f.filename !== filename));
        },
        error: (err) => console.error('Error deleting file:', err),
      }),
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
    return this.projectsService.exportDocx(id, this.contentLanguage());
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
          this.contentLanguage.set(projectLanguage(res.project));
          this.projectFiles.set([]);
        },
        error: (err) => {
          this.isUploading.set(false);
          console.error('Error importing docx:', err);
        },
      }),
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
    this.contentLanguage.set(projectLanguage(project));
    this.projectFiles.set([]);
    this.undoStacksByProject.update((map) => ({ ...map, [project._id]: [] }));
  }

  /** Limpia el proyecto actual */
  clearCurrentProject(): void {
    this.currentProjectId.set(null);
    this.generatedProject.set('');
    this.projectFiles.set([]);
    this.isEditMode.set(false);
  }
}

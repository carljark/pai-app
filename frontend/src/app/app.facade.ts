import { Injectable, inject, signal, untracked, effect } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LayoutService } from './services/layout.service';
import { buildViewUrl } from './services/view-route';
import { TranslationService } from './services/translation.service';
import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { PaiService } from './services/pai.service';
import { AuthFacade } from './features/auth/services/auth.facade';
import { TelemetryService } from './services/telemetry.service';
import { findProjectsWithSameSelection } from './features/projects/utils/selection-match';
import {
  Project,
  getHistoryTabForTipoNivel,
  resolveProjectContent,
} from './features/projects/models/project.model';
import { AppNotification } from './features/notifications/models/notification.model';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);
  projects = inject(ProjectsFacade);
  notifications = inject(NotificationsFacade);
  paiService = inject(PaiService);
  auth = inject(AuthFacade);
  telemetry = inject(TelemetryService);

  errorTitle = signal<string>('Ha ocurrido un error');
  errorMessage = signal<string>('');
  showErrorModal = signal<boolean>(false);

  infoMessage = signal<string>('');
  infoTitle = signal<string>('Información');
  infoType = signal<'info' | 'success'>('info');
  showInfoModal = signal<boolean>(false);

  showConfirmModal = signal<boolean>(false);
  confirmTitle = signal<string>('');
  confirmMessage = signal<string>('');
  confirmAction = signal<() => void>(() => {
    // Acción por defecto: no hacer nada hasta que se configure el modal
  });

  showDuplicateModal = signal<boolean>(false);
  duplicateProjects = signal<Project[]>([]);

  queueToastMessage = signal<string | null>(null);
  queueToastRestartToken = signal(0);

  private shownCompletedProjectIds = new Set<string>();
  private lastHistorySignature = '';

  constructor() {
    this.initAuthEffect();
    this.initViewEffect();
    this.initNotificationEffect();
    this.initHistoryRefreshEffect();
    this.initRequestedProjectEffect();
  }

  private initAuthEffect(): void {
    effect(() => {
      const user = this.auth.currentUser();
      const lang = this.layout.language();
      if (user) {
        this.telemetry.startTracking();
        this.curriculum.loadRas(lang);
        this.curriculum.loadCes(lang);
        untracked(() => this.projects.loadHistory());
      } else {
        this.telemetry.stopTracking();
      }
    });
  }

  private initViewEffect(): void {
    effect(() => {
      const view = this.layout.currentView();
      untracked(() => this.telemetry.setCurrentPage(view));
    });
  }

  private initNotificationEffect(): void {
    effect(() => {
      const notif = this.notifications.latestNotification();
      if (!notif) return;
      untracked(() => {
        if (notif.type === 'COMPLETED') {
          this.handleCompletedNotification(notif);
        } else if (notif.type === 'ERROR') {
          this.errorTitle.set('Error en la Generación');
          this.errorMessage.set(notif.message);
          this.showErrorModal.set(true);
        }
      });
    });
  }

  /**
   * Refresca el historial cuando cambia el estado de algún proyecto en la lista
   * de notificaciones, tanto si el cambio llega por SSE como por el sondeo de
   * respaldo del modal.
   */
  private initHistoryRefreshEffect(): void {
    effect(() => {
      const signature = this.notifications
        .notifications()
        .map((n) => `${n.projectId}:${n.status}:${n.generationTimeMs ?? ''}`)
        .sort()
        .join('|');
      if (!signature || signature === this.lastHistorySignature) return;
      this.lastHistorySignature = signature;
      untracked(() => this.projects.loadHistory());
    });
  }

  private handleCompletedNotification(notif: AppNotification): void {
    const key = notif.projectId || notif.id || notif.message;
    if (this.shownCompletedProjectIds.has(key)) return;
    this.shownCompletedProjectIds.add(key);
    setTimeout(() => {
      this.infoTitle.set(this.trans.t().modalProjectGenerated);
      this.infoMessage.set(notif.message);
      this.infoType.set('success');
      this.showInfoModal.set(true);
    }, 100);
  }

  closeInfoModal(): void {
    this.showInfoModal.set(false);
    this.infoTitle.set('Información');
    this.infoMessage.set('');
    this.infoType.set('info');
    this.notifications.clearLatestNotification?.();
  }

  generateProject(): void {
    if (this.curriculum.selectedRas().length === 0) {
      this.infoTitle.set(this.trans.t().modalAttention);
      this.infoMessage.set(this.trans.t().modalSelectAtLeastOne);
      this.infoType.set('info');
      this.showInfoModal.set(true);
      return;
    }

    // Aviso de duplicados: si ya hay proyectos con exactamente los mismos RAs/CEs.
    const duplicates = this.findProjectsWithSameSelection();
    if (duplicates.length > 0) {
      this.duplicateProjects.set(duplicates);
      this.showDuplicateModal.set(true);
      return;
    }

    this.enqueueGeneration();
  }

  private findProjectsWithSameSelection(): Project[] {
    return findProjectsWithSameSelection(
      this.projects.projectsHistory() || [],
      this.curriculum.selectedRas(),
    );
  }

  /** Abre el editor de un proyecto en una pestaña/ventana nueva mediante `?project=<id>`. */
  openProjectInNewWindow(project: Project): void {
    if (!project?._id) return;
    const path = buildViewUrl({ view: 'taller', project: project._id }, window.location.pathname);
    const url = `${window.location.origin}${path}`;
    window.open(url, '_blank');
  }

  /** Abre el proyecto indicado en la URL (`?project=<id>`) cuando el historial está disponible. */
  /**
   * Abre el proyecto que pide la URL (enlace, recarga o botones atrás/adelante) en cuanto el
   * historial está disponible. La URL ya indica la pantalla, así que no se añade otra entrada.
   */
  private initRequestedProjectEffect(): void {
    effect(() => {
      const id = this.layout.requestedProject();
      if (!id) return;
      const project = (this.projects.projectsHistory() || []).find((p) => p._id === id);
      if (!project) return;
      untracked(() => {
        this.layout.requestedProject.set(null);
        if (this.projects.currentProjectId() !== id) this.viewPastProject(project, false);
      });
    });
  }

  confirmDuplicates(): void {
    this.showDuplicateModal.set(false);
    this.enqueueGeneration();
  }

  cancelDuplicates(): void {
    this.showDuplicateModal.set(false);
  }

  openDuplicateProject(project: Project): void {
    this.showDuplicateModal.set(false);
    this.viewPastProject(project);
  }

  private enqueueGeneration(): void {
    this.notifications.clearLatestNotification?.();
    this.projects.historyTab.set(getHistoryTabForTipoNivel(this.curriculum.tipoNivel()));
    this.notifications.openRecentActivity();
    this.showToast(this.trans.t().toastProjectQueued);
    this.projects.isGenerating.set(true);
    this.projects.generateProject(this.layout.language()).subscribe({
      next: () => this.onGenerateSuccess(),
      error: (err) => this.onGenerateError(err),
    });
  }

  private onGenerateSuccess(): void {
    this.projects.isGenerating.set(false);
    this.curriculum.clearSelection();
    this.projects.extraInstructions?.set('');
    this.projects.loadHistory();
    // El proyecto ya existe en el backend: resincronizamos notificaciones para
    // que aparezca de inmediato en el modal de actividad reciente.
    this.notifications.loadNotifications();
    this.layout.switchView('history');
  }

  /** Muestra el toast temporal de la aplicación (cola de generación, traducciones…). */
  showToast(message: string): void {
    this.queueToastMessage.set(message);
    this.queueToastRestartToken.update((token) => token + 1);
  }

  dismissQueueToast(): void {
    this.queueToastMessage.set(null);
  }

  private onGenerateError(err: HttpErrorResponse): void {
    console.error('Error:', err);
    this.errorTitle.set(this.trans.t().modalGenerationError);
    const serverMsg = err.error?.error || err.error?.message || err.message || 'Error desconocido';
    this.errorMessage.set(serverMsg);
    this.showErrorModal.set(true);
    this.projects.isGenerating.set(false);
  }

  deleteProject(projectId: string): void {
    if (projectId) this.shownCompletedProjectIds.delete(projectId);
    this.confirmTitle.set(this.trans.t().modalDeleteProject);
    this.confirmMessage.set(this.trans.t().modalDeleteConfirm);
    this.confirmAction.set(() => {
      this.projects.deleteProject(projectId).subscribe({
        next: () => {
          this.projects.loadHistory();
          this.showConfirmModal.set(false);
        },
        error: (err) => {
          this.errorTitle.set(this.trans.t().modalDeleteError);
          this.errorMessage.set(err.error?.error || 'Error al borrar el proyecto');
          this.showErrorModal.set(true);
          this.showConfirmModal.set(false);
        },
      });
    });
    this.showConfirmModal.set(true);
  }

  retryProject(project: Project): void {
    if (project?._id) this.shownCompletedProjectIds.delete(project._id);
    this.projects.retryProject(project._id).subscribe({
      next: () => {
        this.infoTitle.set('Proyecto en Cola');
        this.infoMessage.set('El proyecto ha sido vuelto a poner en la cola de generación.');
        this.infoType.set('info');
        this.showInfoModal.set(true);
        this.projects.loadHistory();
      },
      error: (err) => {
        console.error('Error al reintentar proyecto:', err);
        this.errorTitle.set('Error al Reintentar');
        const serverMsg =
          err.error?.error || err.error?.message || err.message || 'Error desconocido';
        this.errorMessage.set(serverMsg);
        this.showErrorModal.set(true);
      },
    });
  }

  /** Abre un proyecto en el taller; `pushHistory: false` cuando ya lo indica la URL (atrás/adelante). */
  viewPastProject(project: Project, pushHistory = true): void {
    if (project.status === 'error') {
      const err = project.errorDetail || project.error || 'Error desconocido';
      this.errorTitle.set(this.trans.t().viewError || 'Error de Generación');
      this.errorMessage.set(err);
      this.showErrorModal.set(true);
      return;
    }
    this.projects.currentProjectId.set(project._id);
    // Muestra la traducción al idioma de la interfaz si existe; si no, el original
    const view = resolveProjectContent(project, this.layout.language());
    this.projects.contentLanguage.set(view.language);
    this.projects.generatedProject.set(view.text || 'Sin contenido');
    this.projects.loadProjectFiles();
    if (pushHistory) this.layout.switchView('taller', project._id);
  }
}

import { Injectable, inject, signal, untracked, effect } from '@angular/core';
import { LayoutService } from './services/layout.service';
import { TranslationService } from './services/translation.service';
import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { PaiService } from './services/pai.service';
import { AuthFacade } from './features/auth/services/auth.facade';
import { TelemetryService } from './services/telemetry.service';

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
  infoType = signal<'info'|'success'>('info');
  showInfoModal = signal<boolean>(false);
  
  showConfirmModal = signal<boolean>(false);
  confirmTitle = signal<string>('');
  confirmMessage = signal<string>('');
  confirmAction = signal<() => void>(() => {});

  private shownCompletedProjectIds = new Set<string>();

  constructor() {
    this.initAuthEffect();
    this.initViewEffect();
    this.initNotificationEffect();
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
        if (['COMPLETED', 'ERROR', 'STATUS'].includes(notif.type)) {
          this.projects.loadHistory();
        }
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

  private handleCompletedNotification(notif: any): void {
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
    this.notifications.clearLatestNotification?.();
    const nivel = this.curriculum.tipoNivel();
    this.projects.historyTab.set(nivel === 'DIVERSIFICACION_CURRICULAR' ? 'ESO' : 'FPB');
    this.projects.isGenerating.set(true);
    this.projects.generateProject(this.layout.language()).subscribe({
      next: () => this.onGenerateSuccess(),
      error: (err) => this.onGenerateError(err)
    });
  }

  private onGenerateSuccess(): void {
    this.projects.isGenerating.set(false);
    this.curriculum.clearSelection();
    this.projects.extraInstructions?.set('');
    this.infoTitle.set(this.trans.t().modalProjectQueued);
    this.infoMessage.set(this.trans.t().modalProjectQueuedDesc);
    this.infoType.set('info');
    this.showInfoModal.set(true);
    this.projects.loadHistory();
    this.layout.switchView('history');
  }

  private onGenerateError(err: any): void {
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
        }
      });
    });
    this.showConfirmModal.set(true);
  }

  retryProject(project: any): void {
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
        const serverMsg = err.error?.error || err.error?.message || err.message || 'Error desconocido';
        this.errorMessage.set(serverMsg);
        this.showErrorModal.set(true);
      }
    });
  }

  viewPastProject(project: any): void {
    this.projects.currentProjectId.set(project._id);
    const rawText = typeof project.generatedContent === 'string' 
      ? project.generatedContent 
      : project.generatedContent?.rawText;
    this.projects.generatedProject.set(rawText || 'Sin contenido');
    this.projects.loadProjectFiles();
    this.layout.switchView('taller');
  }
}

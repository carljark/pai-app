import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminFacade } from '../../services/admin.facade';
import { FeedbackService } from '../../../feedback/services/feedback.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { ActivityLog } from '../../models/admin.model';
import { AdminSolicitudesComponent } from '../admin-solicitudes/admin-solicitudes.component';
import { ProjectsTransferComponent } from '../projects-transfer/projects-transfer.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectsTransferComponent, AdminSolicitudesComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  adminFacade = inject(AdminFacade);
  feedbackService = inject(FeedbackService);
  projects = inject(ProjectsFacade);

  schoolSettings = signal({ schoolName: '', schoolCity: '', schoolContext: '' });
  isSavingSettings = signal(false);
  saveSuccess = signal<boolean>(false);

  pendingFeedbackCount = computed(
    () => this.feedbackService.feedbacks().filter((f) => f.status === 'pendiente').length,
  );

  constructor() {
    this.adminFacade.loadUsers();
    this.adminFacade.loadSettings();
    effect(() => {
      const s = this.adminFacade.settings();
      if (s)
        this.schoolSettings.set({
          schoolName: s.name,
          schoolCity: s.educationalLevel,
          schoolContext: s.context,
        });
    });
    this.adminFacade.loadLogs();
    this.adminFacade.loadAnalytics();
    this.feedbackService.loadFeedbacks().subscribe({
      error: () => {
        // El servicio ya resetea isLoading en su tap de error
      },
    });
  }

  updateFeedbackStatus(id: string, status: string) {
    this.feedbackService.updateFeedbackStatus(id, status).subscribe();
  }

  saveAdminNotes(id: string, event: Event) {
    const notes = (event.target as HTMLInputElement).value;
    const currentStatus =
      this.feedbackService.feedbacks().find((f) => f._id === id)?.status || 'pendiente';
    this.feedbackService.updateFeedbackStatus(id, currentStatus, notes).subscribe();
  }

  deleteFeedback(id: string) {
    this.feedbackService.deleteFeedback(id).subscribe();
  }

  saveSettings(e: Event) {
    e.preventDefault();
    this.isSavingSettings.set(true);
    this.adminFacade
      .saveSettings({
        name: this.schoolSettings().schoolName,
        educationalLevel: this.schoolSettings().schoolCity,
        context: this.schoolSettings().schoolContext,
      })
      .subscribe({
        next: () => {
          this.saveSuccess.set(true);
          setTimeout(() => this.saveSuccess.set(false), 3000);
          this.isSavingSettings.set(false);
        },
        error: () => {
          this.saveSuccess.set(false);
          this.isSavingSettings.set(false);
        },
      });
  }

  approveUser(userId: string) {
    this.adminFacade.updateUserRole(userId, 'teacher').subscribe();
  }

  changeRole(userId: string, newRole: string) {
    this.adminFacade.updateUserRole(userId, newRole).subscribe();
  }

  toggleAiAccess(userId: string, currentStatus: boolean) {
    this.adminFacade.updateUserAi(userId, !currentStatus).subscribe();
  }

  deleteUser(userId: string) {
    this.adminFacade.deleteUser(userId).subscribe();
  }

  getLogModel(log: ActivityLog): string | null {
    if (log.details?.model) return log.details.model;
    if (log.projectId?.usedModel) return log.projectId.usedModel;
    const provider = log.details?.provider || log.projectId?.usedAiProvider;
    return provider ? this.projects.defaultModelForProvider(provider) || null : null;
  }

  getLogProviderLabel(log: ActivityLog): string | null {
    const p = log.details?.provider || log.projectId?.usedAiProvider;
    if (p === 'openrouter') return 'Secundario';
    if (p === 'gemini') return 'Primario';
    return null;
  }

  getLogGenerationTime(log: ActivityLog): number | null {
    return log.details?.generationTimeMs || log.projectId?.generationTimeMs || null;
  }

  getLogPromptSize(log: ActivityLog): string | null {
    const prompt = log.details?.promptChars ?? log.projectId?.aiPromptChars;
    const instruction = log.details?.instructionChars ?? log.projectId?.aiInstructionChars;
    if (prompt == null && instruction == null) return null;
    const parts: string[] = [];
    if (prompt != null) parts.push(`prompt ${prompt} car.`);
    if (instruction != null) parts.push(`instrucción ${instruction} car.`);
    return parts.join(' · ');
  }

  getLogAttemptErrors(log: ActivityLog): string[] {
    const cascadeLog: unknown = log.details?.cascadeLog;
    if (!Array.isArray(cascadeLog)) return [];
    return cascadeLog.filter(
      (entry: unknown): entry is string =>
        typeof entry === 'string' && entry.trim().length > 0 && !entry.trim().endsWith(': OK'),
    );
  }
}

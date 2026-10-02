import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-history-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-project-card.component.html',
  styleUrls: ['./history-project-card.component.scss']
})
export class HistoryProjectCardComponent {
  appFacade = inject(AppFacade);
  projects = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  trans = inject(TranslationService);

  project = input.required<any>();
  shareOpen = signal(false);

  get collaborators(): string[] {
    return this.projects.getCollaboratorNames(this.project());
  }

  isShared(): boolean {
    return this.projects.isShared(this.project());
  }

  canManage(): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const owner = this.project().userId?._id || this.project().userId;
    return owner?.toString() === (user._id || (user as any).id)?.toString();
  }

  isCollaborator(userId: string): boolean {
    return this.projects.getCollaboratorIds(this.project()).includes(userId);
  }

  toggle(userId: string): void {
    const projectId = this.project()._id;
    const action = this.isCollaborator(userId)
      ? this.projects.removeCollaborator(projectId, userId)
      : this.projects.addCollaborator(projectId, userId);
    action.subscribe({ error: (err) => console.error('Error updating collaborators', err) });
  }

  getAuthorName(): string | null {
    return this.project().userId?.name || null;
  }

  isMyProject(): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    const uid = user._id || (user as any).id;
    const authorId = this.project().userId?._id || this.project().userId;
    return authorId?.toString() === uid?.toString();
  }

  getDisplayTitle(): string {
    const p = this.project();
    const isGeneric = !p.title || p.title === 'Proyecto Integrador' || p.title === 'Proyecto de ESO' || p.title === 'Proyecto Generado';
    if (isGeneric && p.modules && p.modules.length > 0) return p.modules.join(' + ');
    return p.title || this.trans.t().untitledProject;
  }

  modulesLabel(): string {
    const mods = this.project().modules?.length ? this.project().modules : this.project().generatedContent?.modules;
    return mods?.join(', ') || 'Varios';
  }

  getAiProviderLabel(): string | null {
    const p = this.project();
    const provider = p.usedAiProvider || p.aiProvider;
    if (provider === 'openrouter') return this.trans.t().aiOpenRouter;
    if (provider === 'gemini') return this.trans.t().aiGemini;
    if (p.usedModel) {
      return p.usedModel.toLowerCase().includes('gemini') ? this.trans.t().aiGemini : this.trans.t().aiOpenRouter;
    }
    return null;
  }
}

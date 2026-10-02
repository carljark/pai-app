import { TranslationService } from '../../../../services/translation.service';
import { Component, inject, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { Project } from '../../../projects/models/project.model';
import { AuthFacade } from '../../../auth/services/auth.facade';

type AppView = 'home' | 'generator' | 'history' | 'taller' | 'admin';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.scss',
})
export class HomeDashboardComponent {
  projectsFacade = inject(ProjectsFacade);
  translationService = inject(TranslationService);
  t = this.translationService.t;
  private authFacade = inject(AuthFacade);

  navigate = output<AppView>();
  openProject = output<Project>();

  userName = computed(() => this.authFacade.currentUser()?.name || this.t().defaultUser);

  recentProjects = computed(() =>
    [...this.projectsFacade.projectsHistory()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  );

  constructor() {
    effect(() => {
      this.projectsFacade.loadHistory();
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      publicado: this.t().statusPublished,
      borrador: this.t().statusDraft,
      en_cola: this.t().statusQueued,
      generando: this.t().statusGenerating,
      error: this.t().statusError,
    };
    return labels[status] ?? status;
  }
}

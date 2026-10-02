import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../features/projects/models/project.model';

@Component({
  selector: 'app-duplicate-projects-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duplicate-projects-modal.component.html',
  styleUrls: ['./duplicate-projects-modal.component.scss'],
})
export class DuplicateProjectsModalComponent {
  title = input<string>('');
  message = input<string>('');
  cancelLabel = input<string>('');
  proceedLabel = input<string>('');
  projects = input<Project[]>([]);

  proceed = output<void>();
  cancelled = output<void>();
  openProject = output<Project>();

  projectTitle(project: Project): string {
    return project?.title || project?.modules?.join(' + ') || 'Proyecto';
  }

  projectModules(project: Project): string {
    return project?.modules?.join(', ') || project?.generatedContent?.modules?.join(', ') || '';
  }
}

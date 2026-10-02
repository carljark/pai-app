import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-duplicate-projects-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duplicate-projects-modal.component.html',
  styleUrls: ['./duplicate-projects-modal.component.scss']
})
export class DuplicateProjectsModalComponent {
  title = input<string>('');
  message = input<string>('');
  cancelLabel = input<string>('');
  proceedLabel = input<string>('');
  projects = input<any[]>([]);

  proceed = output<void>();
  cancel = output<void>();
  openProject = output<any>();

  projectTitle(project: any): string {
    return project?.title || project?.modules?.join(' + ') || 'Proyecto';
  }

  projectModules(project: any): string {
    return project?.modules?.join(', ') || project?.generatedContent?.modules?.join(', ') || '';
  }
}

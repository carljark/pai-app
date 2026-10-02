import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../services/layout.service';
import { TranslationService } from '../../../services/translation.service';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { ProjectsFacade } from '../../../features/projects/services/projects.facade';
import { NotificationsBadgeComponent } from '../../../features/notifications/components/notifications-badge/notifications-badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NotificationsBadgeComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  auth = inject(AuthFacade);
  projects = inject(ProjectsFacade);

  toggleLanguage() {
    this.layout.language.set(this.layout.language() === 'castellano' ? 'catalan' : 'castellano');
  }
}

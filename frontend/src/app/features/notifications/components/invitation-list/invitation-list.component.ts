import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { NotificationsFacade } from '../../services/notifications.facade';
import { AppNotification } from '../../models/notification.model';

/** Invitaciones a colaborar recibidas; cada una abre su proyecto en el taller. */
@Component({
  selector: 'app-invitation-list',
  standalone: true,
  templateUrl: './invitation-list.component.html',
  styleUrl: './invitation-list.component.scss',
})
export class InvitationListComponent {
  notifications = inject(NotificationsFacade);
  trans = inject(TranslationService);
  private layout = inject(LayoutService);

  open(invitation: AppNotification): void {
    if (!invitation.projectId) return;
    this.notifications.closeRecentActivity();
    this.layout.switchView('taller', invitation.projectId);
    this.layout.requestedProject.set(invitation.projectId);
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-feedback-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './feedback-view.component.scss',
  templateUrl: './feedback-view.component.html',
})
export class FeedbackViewComponent implements OnInit {
  feedbackService = inject(FeedbackService);
  trans = inject(TranslationService);

  selectedType = signal<'sugerencia' | 'error'>('sugerencia');
  title = signal<string>('');
  description = signal<string>('');
  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  ngOnInit() {
    this.feedbackService.loadFeedbacks().subscribe({
      error: () => {
        // El servicio ya resetea isLoading en su tap de error
      },
    });
  }

  submitFeedback() {
    if (!this.title().trim() || !this.description().trim()) return;

    this.feedbackService
      .sendFeedback({
        type: this.selectedType(),
        title: this.title().trim(),
        description: this.description().trim(),
      })
      .subscribe({
        next: () => {
          this.title.set('');
          this.description.set('');
          this.alertType.set('success');
          this.alertMessage.set(this.trans.t().feedbackSuccess);
          setTimeout(() => this.alertMessage.set(null), 5000);
        },
        error: () => {
          this.alertType.set('error');
          this.alertMessage.set(this.trans.t().feedbackErrorSending);
        },
      });
  }

  deleteFeedback(id?: string) {
    if (!id) return;
    this.feedbackService.deleteFeedback(id).subscribe({
      error: () => {
        // Si falla, el elemento sigue en la lista (el servicio solo lo quita al confirmar)
      },
    });
  }

  onTitleInput(event: Event) {
    this.title.set((event.target as HTMLInputElement).value);
  }

  onDescriptionInput(event: Event) {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  getStatusLabel(status: string): string {
    const t = this.trans.t();
    switch (status) {
      case 'en_revision':
        return t.feedbackStatusReviewing;
      case 'resuelto':
        return t.feedbackStatusResolved;
      case 'descartado':
        return t.feedbackStatusDismissed;
      default:
        return t.feedbackStatusPending;
    }
  }
}

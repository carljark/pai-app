import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-feedback-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .feedback-container {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .type-selector {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
    }
    .type-btn {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid var(--c-border);
      border-radius: 8px;
      background: var(--c-surface);
      color: var(--c-text);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .type-btn.active-sugerencia {
      border-color: #3b82f6;
      background: #eff6ff;
      color: #1d4ed8;
    }
    .type-btn.active-error {
      border-color: #ef4444;
      background: #fef2f2;
      color: #b91c1c;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--c-text);
    }
    .form-input, .form-textarea {
      padding: 10px 14px;
      border: 1px solid var(--c-border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-textarea:focus {
      border-color: var(--c-primary);
    }
    .status-badge {
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-en_revision { background: #dbeafe; color: #1e40af; }
    .status-resuelto { background: #dcfce7; color: #166534; }
    .status-descartado { background: #f3f4f6; color: #6b7280; }
  `],
  template: `
    <div class="feedback-container">
      <!-- Encabezado -->
      <div class="app-header" style="flex-direction: column; align-items: flex-start; gap: 4px; padding-bottom: 12px;">
        <h2 class="app-header-title" style="margin: 0;">📬 {{ trans.t().feedbackTitle }}</h2>
        <p style="margin: 0; color: var(--c-text-muted); font-size: 0.95rem;">
          {{ trans.t().feedbackSubtitle }}
        </p>
      </div>

      <!-- Formulario de Envío -->
      <div class="card" style="padding: 24px;">
        <div class="type-selector">
          <button 
            type="button"
            class="type-btn"
            [class.active-sugerencia]="selectedType() === 'sugerencia'"
            (click)="selectedType.set('sugerencia')">
            {{ trans.t().feedbackTypeSuggestion }}
          </button>
          <button 
            type="button"
            class="type-btn"
            [class.active-error]="selectedType() === 'error'"
            (click)="selectedType.set('error')">
            {{ trans.t().feedbackTypeError }}
          </button>
        </div>

        <form (ngSubmit)="submitFeedback()" style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
          <div class="form-group">
            <label class="form-label">{{ trans.t().feedbackSubject }} *</label>
            <input 
              type="text" 
              class="form-input" 
              [value]="title()" 
              (input)="onTitleInput($event)"
              name="title" 
              required
              [placeholder]="trans.t().feedbackSubjectPlaceholder">
          </div>

          <div class="form-group">
            <label class="form-label">{{ trans.t().feedbackDesc }} *</label>
            <textarea 
              class="form-textarea" 
              rows="4" 
              [value]="description()" 
              (input)="onDescriptionInput($event)"
              name="description" 
              required
              [placeholder]="trans.t().feedbackDescPlaceholder"></textarea>
          </div>

          @if (alertMessage()) {
            <div [style.background]="alertType() === 'success' ? '#dcfce7' : '#fee2e2'"
                 [style.color]="alertType() === 'success' ? '#166534' : '#991b1b'"
                 style="padding: 12px; border-radius: 8px; font-size: 0.9rem; font-weight: 500;">
              {{ alertMessage() }}
            </div>
          }

          <div style="display: flex; justify-content: flex-end;">
            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="feedbackService.isSubmitting() || !title().trim() || !description().trim()"
              style="padding: 10px 20px; font-size: 0.95rem;">
              {{ feedbackService.isSubmitting() ? trans.t().feedbackSending : trans.t().feedbackSend }}
            </button>
          </div>
        </form>
      </div>

      <!-- Envíos anteriores del usuario -->
      <div style="margin-top: 8px;">
        <h3 style="font-size: 1.15rem; color: var(--c-text); margin-bottom: 12px;">
          {{ trans.t().feedbackMySubmissions }} ({{ feedbackService.feedbacks().length }})
        </h3>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (item of feedbackService.feedbacks(); track item._id) {
            <div class="card" style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 0.8rem; font-weight: 600; padding: 2px 8px; border-radius: 6px;"
                        [style.background]="item.type === 'error' ? '#fee2e2' : '#eff6ff'"
                        [style.color]="item.type === 'error' ? '#b91c1c' : '#1d4ed8'">
                    {{ item.type === 'error' ? trans.t().feedbackTypeError : trans.t().feedbackTypeSuggestion }}
                  </span>
                  <strong style="font-size: 1rem; color: var(--c-text);">{{ item.title }}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="status-badge status-{{ item.status }}">
                    {{ getStatusLabel(item.status) }}
                  </span>
                  @if (item.createdAt) {
                    <span style="font-size: 0.8rem; color: var(--c-text-muted);">
                      {{ item.createdAt | date:'short' }}
                    </span>
                  }
                  <button 
                    (click)="deleteFeedback(item._id)"
                    style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 2px 4px;"
                    [title]="trans.t().removeTooltip">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <p style="margin: 0; color: var(--c-text); font-size: 0.9rem; white-space: pre-wrap;">
                {{ item.description }}
              </p>
              @if (item.adminNotes) {
                <div style="background: #f8fafc; border-left: 3px solid var(--c-primary); padding: 8px 12px; border-radius: 4px; font-size: 0.85rem; color: #475569;">
                  <strong>Respuesta del administrador:</strong> {{ item.adminNotes }}
                </div>
              }
            </div>
          } @empty {
            <div class="card" style="text-align: center; padding: 24px; color: var(--c-text-muted); font-size: 0.9rem;">
              {{ trans.t().feedbackNoSubmissions }}
            </div>
          }
        </div>
      </div>
    </div>
  `
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
    this.feedbackService.loadFeedbacks().subscribe({ error: () => {} });
  }

  submitFeedback() {
    if (!this.title().trim() || !this.description().trim()) return;

    this.feedbackService.sendFeedback({
      type: this.selectedType(),
      title: this.title().trim(),
      description: this.description().trim()
    }).subscribe({
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
      }
    });
  }

  deleteFeedback(id?: string) {
    if (!id) return;
    this.feedbackService.deleteFeedback(id).subscribe({ error: () => {} });
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
      case 'en_revision': return t.feedbackStatusReviewing;
      case 'resuelto': return t.feedbackStatusResolved;
      case 'descartado': return t.feedbackStatusDismissed;
      default: return t.feedbackStatusPending;
    }
  }
}

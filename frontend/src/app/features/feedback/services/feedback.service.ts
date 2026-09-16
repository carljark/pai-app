import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { FeedbackItem, CreateFeedbackDto } from '../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private http = inject(HttpClient);
  private apiUrl = '/api/feedback';

  feedbacks = signal<FeedbackItem[]>([]);
  isSubmitting = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  sendFeedback(data: CreateFeedbackDto): Observable<FeedbackItem> {
    this.isSubmitting.set(true);
    return this.http.post<FeedbackItem>(this.apiUrl, data).pipe(
      tap({
        next: (created) => {
          this.isSubmitting.set(false);
          this.feedbacks.update(list => [created, ...list]);
        },
        error: () => this.isSubmitting.set(false)
      })
    );
  }

  loadFeedbacks(params?: { status?: string; type?: string }): Observable<FeedbackItem[]> {
    this.isLoading.set(true);
    let query = '';
    if (params) {
      const q = new URLSearchParams();
      if (params.status) q.append('status', params.status);
      if (params.type) q.append('type', params.type);
      query = q.toString() ? `?${q.toString()}` : '';
    }
    return this.http.get<FeedbackItem[]>(`${this.apiUrl}${query}`).pipe(
      tap({
        next: (items) => {
          this.isLoading.set(false);
          this.feedbacks.set(items);
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  updateFeedbackStatus(id: string, status: string, adminNotes?: string): Observable<FeedbackItem> {
    return this.http.patch<FeedbackItem>(`${this.apiUrl}/${id}`, { status, adminNotes }).pipe(
      tap((updated) => {
        this.feedbacks.update(list => list.map(item => item._id === id ? updated : item));
      })
    );
  }

  deleteFeedback(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.feedbacks.update(list => list.filter(item => item._id !== id));
      })
    );
  }
}

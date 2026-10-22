import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourId } from '../tours/tour.model';

export interface OnboardingState {
  welcomeDismissed: boolean;
  completedTours: TourId[];
}

export interface OnboardingUpdate {
  welcomeDismissed?: boolean;
  completedTour?: TourId;
}

/** Progreso de la bienvenida y las visitas guiadas, guardado en el usuario. */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users/me/onboarding';

  get(): Observable<OnboardingState> {
    return this.http.get<OnboardingState>(this.apiUrl);
  }

  update(changes: OnboardingUpdate): Observable<OnboardingState> {
    return this.http.patch<OnboardingState>(this.apiUrl, changes);
  }
}

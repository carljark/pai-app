import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  let service: OnboardingService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OnboardingService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lee y guarda el progreso del usuario', () => {
    let state: unknown;
    service.get().subscribe((s) => (state = s));
    http.expectOne({ method: 'GET', url: '/api/users/me/onboarding' }).flush({
      welcomeDismissed: false,
      completedTours: [],
    });
    expect(state).toEqual({ welcomeDismissed: false, completedTours: [] });

    service.update({ completedTour: 'mapa' }).subscribe();
    const req = http.expectOne({ method: 'PATCH', url: '/api/users/me/onboarding' });
    expect(req.request.body).toEqual({ completedTour: 'mapa' });
    req.flush({ welcomeDismissed: false, completedTours: ['mapa'] });
  });
});

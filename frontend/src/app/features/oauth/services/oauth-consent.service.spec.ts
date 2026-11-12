import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OAuthConsentService } from './oauth-consent.service';

describe('OAuthConsentService', () => {
  let service: OAuthConsentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OAuthConsentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('llama a las rutas del consentimiento y de las aplicaciones conectadas', () => {
    service.getRequest('r1').subscribe();
    httpMock.expectOne('/api/oauth/requests/r1').flush({});

    service.answer('r1', true).subscribe();
    const answer = httpMock.expectOne('/api/oauth/requests/r1');
    expect(answer.request.method).toBe('POST');
    expect(answer.request.body).toEqual({ approve: true });
    answer.flush({ redirectUrl: 'x' });

    service.listGrants().subscribe();
    httpMock.expectOne('/api/oauth/grants').flush([]);

    service.revokeGrant('g1').subscribe();
    const del = httpMock.expectOne('/api/oauth/grants/g1');
    expect(del.request.method).toBe('DELETE');
    del.flush({});
  });
});

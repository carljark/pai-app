import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiTokensService } from './api-tokens.service';

const token = {
  _id: 't1',
  name: 'Claude',
  prefix: 'plp_abcdef',
  createdAt: '2026-11-12',
  lastUsedAt: null,
};

describe('ApiTokensService', () => {
  let service: ApiTokensService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiTokensService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('carga, crea (sin guardar el token completo) y revoca', () => {
    service.load().subscribe();
    httpMock.expectOne('/api/users/me/tokens').flush([token]);
    expect(service.tokens()).toEqual([token]);

    service.create('Gemini').subscribe();
    const req = httpMock.expectOne('/api/users/me/tokens');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Gemini' });
    req.flush({ ...token, _id: 't2', name: 'Gemini', token: 'plp_secreto' });
    expect(service.tokens().map((t) => t._id)).toEqual(['t2', 't1']);
    expect(service.tokens()[0]).not.toHaveProperty('token');

    service.revoke('t1').subscribe();
    const del = httpMock.expectOne('/api/users/me/tokens/t1');
    expect(del.request.method).toBe('DELETE');
    del.flush({ message: 'Token revocado' });
    expect(service.tokens().map((t) => t._id)).toEqual(['t2']);
  });
});

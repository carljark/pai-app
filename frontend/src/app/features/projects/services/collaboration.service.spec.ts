import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CollaborationService } from './collaboration.service';

describe('CollaborationService', () => {
  let service: CollaborationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollaborationService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CollaborationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
    localStorage.removeItem('pai_token');
  });

  it('consulta, toma y libera el turno de edición', () => {
    service.getEditLock('p1').subscribe();
    http.expectOne({ method: 'GET', url: '/api/projects/p1/edit-lock' }).flush({ lock: null });

    service.takeEditLock('p1').subscribe();
    http.expectOne({ method: 'POST', url: '/api/projects/p1/edit-lock' }).flush({ lock: null });

    service.releaseEditLock('p1').subscribe();
    http.expectOne({ method: 'DELETE', url: '/api/projects/p1/edit-lock' }).flush({});
  });

  it('obtiene el registro de cambios', () => {
    let result: unknown;
    service.getChanges('p1').subscribe((changes) => (result = changes));
    http.expectOne('/api/projects/p1/changes').flush([{ id: 'c1' }]);
    expect(result).toEqual([{ id: 'c1' }]);
  });

  it('libera el turno al cerrar la pestaña con keepalive y el token', () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error('offline')));
    vi.stubGlobal('fetch', fetchMock);
    localStorage.setItem('pai_token', 'tok');

    service.releaseOnUnload('p1');
    expect(fetchMock).toHaveBeenCalledWith('/api/projects/p1/edit-lock', {
      method: 'DELETE',
      keepalive: true,
      headers: { Authorization: 'Bearer tok' },
    });

    localStorage.removeItem('pai_token');
    service.releaseOnUnload('p1');
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/projects/p1/edit-lock',
      expect.objectContaining({ headers: {} }),
    );
  });
});

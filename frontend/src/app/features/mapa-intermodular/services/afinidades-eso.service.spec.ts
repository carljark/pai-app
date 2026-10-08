import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AfinidadesEsoService } from './afinidades-eso.service';
import { AFINIDADES_1 } from '../../../testing/afinidades.mock';

describe('AfinidadesEsoService', () => {
  let service: AfinidadesEsoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AfinidadesEsoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('pide las afinidades de la pestaña con el parámetro tab', () => {
    let result: unknown;
    service.getAfinidades('ESO_1').subscribe((d) => (result = d));

    const req = httpMock.expectOne((r) => r.url === '/api/afinidades-eso');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('tab')).toBe('ESO_1');
    req.flush(AFINIDADES_1);
    expect(result).toEqual(AFINIDADES_1);
  });
});

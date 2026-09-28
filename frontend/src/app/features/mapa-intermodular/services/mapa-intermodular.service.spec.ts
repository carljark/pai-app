import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapaIntermodularService } from './mapa-intermodular.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MapaIntermodularService', () => {
  let service: MapaIntermodularService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MapaIntermodularService]
    });
    service = TestBed.inject(MapaIntermodularService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch modules for given tab', () => {
    const mockData = [
      {
        code: '3060',
        name_es: 'Preparación',
        name_ca: 'Preparació',
        type: 'especifico',
        color: '#e74c3c',
        icon: 'cut',
        learningOutcomes: []
      }
    ] as any;

    service.getModules('FPB').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/mapa-intermodular?tab=FPB');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});

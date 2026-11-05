import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CESTA_VACIA } from '../models/cesta.model';
import { CESTA_STORAGE_PREFIX, CestaService } from './cesta.service';

describe('CestaService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('cada pestaña tiene su propia cesta y no se mezclan', () => {
    const service = TestBed.inject(CestaService);
    service.actualizar('ESO_1', (e) => ({ ...e, unidades: ['MAT'] }));
    expect(service.estado('ESO_1').unidades).toEqual(['MAT']);
    expect(service.estado('ESO_2')).toBe(CESTA_VACIA);
  });

  it('la cesta sobrevive a recargar la página', () => {
    TestBed.inject(CestaService).actualizar('ESO_1', (e) => ({ ...e, unidades: ['MAT'] }));
    TestBed.resetTestingModule();
    expect(TestBed.inject(CestaService).estado('ESO_1').unidades).toEqual(['MAT']);
  });

  it('ignora entradas ajenas o dañadas del almacenamiento', () => {
    sessionStorage.setItem('otra.cosa', '{}');
    sessionStorage.setItem(CESTA_STORAGE_PREFIX + 'ESO_1', '{"unidades": 3}');
    sessionStorage.setItem(CESTA_STORAGE_PREFIX + 'ESO_2', 'no es json');
    const service = TestBed.inject(CestaService);
    expect(service.estado('ESO_1')).toBe(CESTA_VACIA);
    expect(service.estado('ESO_2')).toBe(CESTA_VACIA);
  });

  it('sin almacenamiento, la cesta sigue funcionando en memoria', () => {
    sessionStorage.setItem(CESTA_STORAGE_PREFIX + 'ESO_2', '{}');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const service = TestBed.inject(CestaService);
    service.actualizar('ESO_1', (e) => ({ ...e, unidades: ['MAT'] }));
    expect(service.estado('ESO_1').unidades).toEqual(['MAT']);
  });
});

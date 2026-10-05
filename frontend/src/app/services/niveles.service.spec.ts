import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NivelesService, NivelEducativo } from './niveles.service';

const ESO: NivelEducativo = {
  id: 'ESO_ORDINARIA',
  etapa: 'ESO',
  nombre_es: 'ESO',
  nombre_ca: 'ESO',
  unidad: 'CE',
  cursos: [{ curso: '1º', edad: '12-13 años' }],
};
const CFGS: NivelEducativo = { ...ESO, id: 'CFGS', nombre_es: 'Educación', nombre_ca: 'Educació' };

describe('NivelesService', () => {
  let service: NivelesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NivelesService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NivelesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the catalog and finds levels by id', () => {
    service.load();
    http.expectOne('/api/niveles').flush([ESO, CFGS]);
    expect(service.niveles()).toHaveLength(2);
    expect(service.find('CFGS')).toBe(service.niveles()[1]);
    expect(service.find('NADA')).toBeUndefined();
  });

  it('names a level in the active language', () => {
    expect(service.nombre(CFGS, true)).toBe('Educació');
    expect(service.nombre(CFGS, false)).toBe('Educación');
  });

  it('keeps the catalog empty and logs when the request fails', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service.load();
    http.expectOne('/api/niveles').flush('error', { status: 500, statusText: 'Error' });
    expect(service.niveles()).toEqual([]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

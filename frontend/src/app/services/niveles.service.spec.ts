import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NivelesService, NivelEducativo } from './niveles.service';
import { NIVELES_MOCK } from '../testing/niveles.mock';

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

  it('clears the error flag after a successful reload', () => {
    service.error.set(true);
    service.load();
    http.expectOne('/api/niveles').flush([ESO]);
    expect(service.error()).toBe(false);
  });

  describe('helpers over the catalog', () => {
    beforeEach(() => service.niveles.set(NIVELES_MOCK));

    it('finds legacy levels and names unknown ones by their id', () => {
      expect(service.find(undefined)?.id).toBe('FP_BASICA');
      expect(service.find('ESO')?.id).toBe('DIVERSIFICACION_CURRICULAR');
      expect(service.nombreDe('CFGS_EDUCACION_INFANTIL', true)).toBe('CFGS Educació Infantil');
      expect(service.nombreDe('NIVEL_NUEVO', false)).toBe('NIVEL_NUEVO');
    });

    it('gives the courses, the default course and the modules of each course', () => {
      expect(service.cursos('DIVERSIFICACION_CURRICULAR')).toEqual(['3º', '4º']);
      expect(service.cursos('NADA')).toEqual([]);
      expect(service.cursoPorDefecto('DIVERSIFICACION_CURRICULAR')).toBe('3º');
      expect(service.cursoPorDefecto('NADA')).toBe('1º');
      expect(service.modulos('CFGS_EDUCACION_INFANTIL', '1º')).toEqual([
        '0011',
        '0012',
        '0014',
        '0015',
        '1665',
        '1709',
      ]);
      expect(service.modulos('FP_BASICA', '1º')).toBeNull();
      expect(service.modulos('CFGM_ESTETICA', '2º')).toBeNull();
      expect(service.modulos('NADA', '1º')).toBeNull();
    });

    it('tells RA levels from CE levels (unknown levels work with RA)', () => {
      expect(service.usaRa('CFGM_PELUQUERIA')).toBe(true);
      expect(service.usaRa('ESO_ORDINARIA')).toBe(false);
      expect(service.usaRa('NADA')).toBe(true);
    });

    it('picks FP Básica as default level, or the first one when it is missing', () => {
      expect(service.nivelPorDefecto()).toBe('FP_BASICA');
      service.niveles.set([ESO, CFGS]);
      expect(service.nivelPorDefecto()).toBe('ESO_ORDINARIA');
      service.niveles.set([]);
      expect(service.nivelPorDefecto()).toBe('FP_BASICA');
    });

    it('lists the map tabs of the catalog with their level and stage', () => {
      expect(service.mapaTabs().map((t) => t.tab)).toEqual([
        'FPB',
        'CFGM',
        'CFGM_PELUQUERIA',
        'CFGM_PELUQUERIA_2',
        'CFGS_EDUCACION_INFANTIL',
        'CFGS_EDUCACION_INFANTIL_2',
      ]);
      const infantil2 = service.mapaTab('CFGS_EDUCACION_INFANTIL_2')!;
      expect(infantil2.curso).toBe('2º');
      expect(service.sigla(infantil2.nivel)).toBe('CFGS');
      expect(service.sigla(service.mapaTab('FPB')!.nivel)).toBe('CFGB');
      expect(service.mapaTab('NADA')).toBeUndefined();
      expect(service.sigla({ ...ESO, etapa: 'OTRA' as never })).toBe('OTRA');
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NivelNombrePipe } from './nivel-nombre.pipe';
import { LayoutService } from '../../../services/layout.service';
import { loadNivelesMock } from '../../../testing/niveles.mock';

describe('NivelNombrePipe', () => {
  let pipe: NivelNombrePipe;
  let layout: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    loadNivelesMock();
    layout = TestBed.inject(LayoutService);
    layout.language.set('castellano');
    pipe = TestBed.runInInjectionContext(() => new NivelNombrePipe());
  });

  afterEach(() => {
    layout.language.set('castellano');
    localStorage.removeItem('pai_lang');
  });

  it('names each level from the catalog in Spanish and Catalan', () => {
    expect(pipe.transform('CFGS_EDUCACION_INFANTIL')).toBe('CFGS Educación Infantil');
    layout.language.set('catalan');
    expect(pipe.transform('CFGS_EDUCACION_INFANTIL')).toBe('CFGS Educació Infantil');
    expect(pipe.transform('CFGM_PELUQUERIA')).toBe('CFGM Perruqueria i Cosmètica Capil·lar');
  });

  it('normalizes legacy levels and falls back to the id when the catalog lacks it', () => {
    expect(pipe.transform(undefined)).toBe('CFGB Peluquería y Estética');
    expect(pipe.transform('ESO')).toBe('ESO (PDC)');
    expect(pipe.transform('NIVEL_DESCONOCIDO')).toBe('NIVEL_DESCONOCIDO');
  });
});

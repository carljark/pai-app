import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapaVistaService } from './mapa-vista.service';

describe('MapaVistaService', () => {
  beforeEach(() => {
    localStorage.removeItem('pai_mapa_vista');
    TestBed.resetTestingModule();
  });

  afterEach(() => vi.restoreAllMocks());

  it('empieza en la vista clásica', () => {
    expect(TestBed.inject(MapaVistaService).vista()).toBe('clasica');
  });

  it('recuerda la vista elegida', () => {
    TestBed.inject(MapaVistaService).setVista('mental');
    expect(localStorage.getItem('pai_mapa_vista')).toBe('mental');
    TestBed.resetTestingModule();
    expect(TestBed.inject(MapaVistaService).vista()).toBe('mental');
  });

  it('funciona sin almacenamiento disponible', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const service = TestBed.inject(MapaVistaService);
    expect(service.vista()).toBe('clasica');
    service.setVista('mental');
    expect(service.vista()).toBe('mental');
  });
});

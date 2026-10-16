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

  it('recuerda la panorámica y en la ESO la sustituye por el mapa mental', () => {
    const service = TestBed.inject(MapaVistaService);
    service.setVista('panoramica');
    expect(service.vistaEso()).toBe('mental');
    TestBed.resetTestingModule();
    const reloaded = TestBed.inject(MapaVistaService);
    expect(reloaded.vista()).toBe('panoramica');
    reloaded.setVista('clasica');
    expect(reloaded.vistaEso()).toBe('clasica');
  });

  it('ignora valores guardados desconocidos', () => {
    localStorage.setItem('pai_mapa_vista', 'otra');
    expect(TestBed.inject(MapaVistaService).vista()).toBe('clasica');
  });

  it('abre un RA en el mapa mental y lo entrega una sola vez', () => {
    const service = TestBed.inject(MapaVistaService);
    service.abrirEnMapaMental({ moduleCode: '0001', raId: '0001_RA1' });
    expect(service.vista()).toBe('mental');
    expect(service.tomarRaPendiente()).toEqual({ moduleCode: '0001', raId: '0001_RA1' });
    expect(service.tomarRaPendiente()).toBeNull();
  });
});

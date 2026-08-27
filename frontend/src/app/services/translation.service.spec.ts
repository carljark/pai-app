import { describe, it, expect, beforeEach, vi } from "vitest";
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { LayoutService } from './layout.service';
import { signal } from '@angular/core';

describe('TranslationService', () => {
  let service: TranslationService;
  let layoutServiceMock: any;

  beforeEach(() => {
    layoutServiceMock = {
      language: signal<'castellano' | 'catalan'>('castellano')
    };

    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        { provide: LayoutService, useValue: layoutServiceMock }
      ]
    });
    
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return castellano translations by default', () => {
    expect(service.t().logout).toBe('Salir');
    expect(service.t().downloadWord).toBe('Bajar como Word');
    expect(service.t().homeTitle).toBe('Plataforma de Proyectos Interdisciplinares');
  });

  it('should return catalan translations when language is set to catalan', () => {
    layoutServiceMock.language.set('catalan');
    
    expect(service.t().logout).toBe('Sortir');
    expect(service.t().downloadWord).toBe('Descarregar com a Word');
    expect(service.t().homeTitle).toBe('Plataforma de Projectes Interdisciplinaris');
  });
});

import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { MapaHeaderComponent } from './header.component';
import { NIVELES_MOCK, loadNivelesMock } from '../../../../../testing/niveles.mock';
import type { NivelEducativo } from '../../../../../services/niveles.service';

/** Ciclo de dos cursos con un único mapa que los abarca (sin `curso`). */
const SIN_CURSO: NivelEducativo = {
  id: 'CFGS_DOS_CURSOS',
  etapa: 'CFGS',
  nombre_es: 'CFGS Dos Cursos',
  nombre_ca: 'CFGS Dos Cursos',
  unidad: 'RA',
  cursos: [{ curso: '1º' }, { curso: '2º' }],
  mapas: [{ tab: 'DOS_CURSOS', moduleCode: '0001', raId: '0001_RA1' }],
};

describe('MapaHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    loadNivelesMock([...NIVELES_MOCK, SIN_CURSO]);
  });

  const crear = (tab: string) => {
    const fixture = TestBed.createComponent(MapaHeaderComponent);
    fixture.componentRef.setInput('activeTab', tab);
    return fixture.componentInstance;
  };

  it('describe el ciclo cuando el mapa abarca varios cursos', () => {
    const header = crear('DOS_CURSOS');
    expect(header.subtitle()).toContain('actividades del CFGS Dos Cursos');
    header.layout.language.set('catalan');
    expect(header.subtitle()).toContain('activitats del CFGS Dos Cursos');
    header.layout.language.set('castellano');
  });

  it('describe el curso del mapa y no muestra nada para pestañas desconocidas', () => {
    expect(crear('FPB_2').subtitle()).toContain('de 2.º curso');
    expect(crear('NADA').subtitle()).toBe('');
    expect(crear('NADA').modulesLabel()).toBe('Módulos');
  });
});

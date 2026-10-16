import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { loadNivelesMock } from '../../../../../testing/niveles.mock';
import { mockConnection } from '../../../../../testing/mindmap.mock';
import type { IntermodularConnection } from '../../../models/mapa-intermodular.model';
import { ConnectionCardComponent } from './connection-card.component';

describe('ConnectionCardComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');

  beforeEach(async () => {
    language.set('castellano');
    await TestBed.configureTestingModule({
      imports: [ConnectionCardComponent],
      providers: [{ provide: LayoutService, useValue: { language } }],
    }).compileComponents();
    loadNivelesMock();
  });

  function render(connection: IntermodularConnection) {
    const fixture = TestBed.createComponent(ConnectionCardComponent);
    fixture.componentRef.setInput('connection', connection);
    fixture.componentRef.setInput('activeTab', 'FPB');
    fixture.detectChanges();
    return fixture;
  }

  const full: IntermodularConnection = {
    ...mockConnection('0002', 'RA1', 'tecnica', 'Muestras compartidas'),
    sourceCriteria: 'a), b)',
    relatedCriteria: [
      {
        moduleCode: '0003',
        moduleName_es: 'Biología',
        moduleName_ca: 'Biologia',
        criteria: 'c)',
        criteria_es: 'c) es',
        criteria_ca: 'c) ca',
      },
      { moduleCode: '0004', moduleName_es: 'Química', moduleName_ca: '', criteria: 'd)' },
    ],
  };

  it('muestra destino, criterios, justificación y actividades en castellano', () => {
    const text = render(full).nativeElement.textContent;
    expect(text).toContain('Módulo 0002');
    expect(text).toContain('Muestras compartidas');
    expect(text).toContain('Técnica Práctica');
    expect(text).toContain('Criterios propios implicados:');
    expect(text).toContain('c) es');
    expect(text).toContain('Química');
    expect(text).toContain('Justificación 0002 RA1');
    expect(text).toContain('Actividad 0002 RA1');
  });

  it('muestra los textos en catalán', () => {
    language.set('catalan');
    const text = render(full).nativeElement.textContent;
    expect(text).toContain('Mòdul 0002');
    expect(text).toContain('Muestras compartidas (ca)');
    expect(text).toContain('Tècnica Pràctica');
    expect(text).toContain('c) ca');
    expect(text).toContain('Justificació 0002 RA1');
    expect(text).toContain('Crear Projecte');
  });

  it('omite título y criterios cuando la conexión no los tiene', () => {
    const el: HTMLElement = render(mockConnection('0002', 'RA2', 'digital')).nativeElement;
    expect(el.querySelector('.mapa-conn-coincidence-subtitle')).toBeNull();
    expect(el.querySelector('.mapa-crit-row')).toBeNull();
  });

  it('emite la conexión al pulsar «Crear proyecto»', () => {
    const fixture = render(full);
    const emitted = vi.fn();
    fixture.componentInstance.createProject.subscribe(emitted);
    (fixture.nativeElement.querySelector('.mapa-btn-action') as HTMLButtonElement).click();
    expect(emitted).toHaveBeenCalledWith(full);
  });
});

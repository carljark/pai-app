import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, afterEach } from 'vitest';
import { MisSolicitudesComponent } from './mis-solicitudes.component';
import { SolicitudesService } from '../../services/solicitudes.service';
import { LayoutService } from '../../../../services/layout.service';

const SOLICITUD = {
  _id: 's1',
  centro: { nombre: 'IES Joan Ramis', municipio: '', web: '' },
  status: 'en_curso',
  createdAt: '2026-10-09T10:00:00.000Z',
  ciclos: [
    {
      _id: 'c1',
      codigo: 'SAN36',
      etapa: 'CFGS',
      nombre_es: 'Laboratorio Clínico y Biomédico',
      nombre_ca: 'Laboratori clínic i biomèdic',
      estado: 'pendiente',
    },
    {
      _id: 'c2',
      nombre: 'Ciclo raro',
      nombre_es: 'Ciclo raro',
      nombre_ca: 'Ciclo raro',
      estado: 'descartado',
    },
  ],
};

describe('MisSolicitudesComponent', () => {
  afterEach(() => {
    TestBed.inject(LayoutService).language.set('castellano');
    localStorage.removeItem('pai_lang');
  });

  let fixture: ComponentFixture<MisSolicitudesComponent>;
  let el: HTMLElement;

  const crear = async (
    respuesta: Observable<unknown>,
    idioma: 'castellano' | 'catalan' = 'castellano',
  ) => {
    const service = { misSolicitudes: signal<any[]>([SOLICITUD]), loadMias: () => respuesta };
    await TestBed.configureTestingModule({
      imports: [MisSolicitudesComponent],
      providers: [{ provide: SolicitudesService, useValue: service }],
    }).compileComponents();
    TestBed.inject(LayoutService).language.set(idioma);
    fixture = TestBed.createComponent(MisSolicitudesComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('muestra cada solicitud con su estado y el de sus ciclos', async () => {
    await crear(of([SOLICITUD]));
    const texto = el.textContent ?? '';
    expect(texto).toContain('IES Joan Ramis');
    expect(texto).toContain('En curso');
    expect(texto).toContain('CFGS Laboratorio Clínico y Biomédico');
    expect(texto).toContain('Otro ciclo: Ciclo raro');
    expect(texto).toContain('09/10/2026');
    expect(el.querySelector('.mis-solicitudes__estado--descartado')).toBeTruthy();
  });

  it('usa los nombres en catalán', async () => {
    await crear(of([SOLICITUD]), 'catalan');
    expect(el.textContent).toContain('CFGS Laboratori clínic i biomèdic');
    expect(el.textContent).toContain('Pendent');
  });

  it('muestra la lista vacía si falla la carga', async () => {
    await crear(throwError(() => new Error('x')));
    expect(el.querySelector('.mis-solicitudes__vacio')).toBeTruthy();
  });
});

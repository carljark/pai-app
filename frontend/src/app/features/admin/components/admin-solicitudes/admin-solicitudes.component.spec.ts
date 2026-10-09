import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminSolicitudesComponent } from './admin-solicitudes.component';
import { SolicitudesService } from '../../../solicitudes/services/solicitudes.service';

const SOLICITUD = {
  _id: 's1',
  userName: 'Docente',
  userEmail: 'docente@test.com',
  centro: { nombre: 'IES Joan Ramis', municipio: 'Maó', web: 'https://ies.example' },
  comentario: 'Para el curso que viene',
  status: 'pendiente',
  adminNotes: '',
  createdAt: '2026-10-09T10:00:00.000Z',
  ciclos: [
    {
      _id: 'c1',
      codigo: 'SAN36',
      etapa: 'CFGS',
      nombre_es: 'Laboratorio Clínico y Biomédico',
      estado: 'pendiente',
    },
    { _id: 'c2', nombre: 'Ciclo raro', estado: 'pendiente', tarea: '' },
  ],
};

describe('AdminSolicitudesComponent', () => {
  let fixture: ComponentFixture<AdminSolicitudesComponent>;
  let el: HTMLElement;
  let service: any;

  const cambiar = (selector: string, valor: string, evento = 'change') => {
    const campo = el.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
    campo.value = valor;
    campo.dispatchEvent(new Event(evento));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    service = {
      todas: signal([SOLICITUD]),
      loadTodas: vi.fn().mockReturnValue(of([SOLICITUD])),
      actualizar: vi.fn().mockReturnValue(of(SOLICITUD)),
    };
    await TestBed.configureTestingModule({
      imports: [AdminSolicitudesComponent],
      providers: [{ provide: SolicitudesService, useValue: service }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminSolicitudesComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('lista las solicitudes con el centro, el docente y los ciclos', () => {
    const texto = el.textContent ?? '';
    expect(texto).toContain('IES Joan Ramis');
    expect(texto).toContain('Maó');
    expect(texto).toContain('docente@test.com');
    expect(texto).toContain('Para el curso que viene');
    expect(texto).toContain('CFGS Laboratorio Clínico y Biomédico (SAN36)');
    expect(texto).toContain('Otro: Ciclo raro');
    expect((el.querySelector('.admin-solicitudes__estado') as HTMLSelectElement).value).toBe(
      'pendiente',
    );
  });

  it('guarda el estado, las notas y el estado y la tarea de cada ciclo', () => {
    cambiar('.admin-solicitudes__estado', 'completada');
    expect(service.actualizar).toHaveBeenLastCalledWith('s1', { status: 'completada' });
    cambiar('.admin-solicitudes__notas', 'Hecho');
    expect(service.actualizar).toHaveBeenLastCalledWith('s1', { adminNotes: 'Hecho' });
    cambiar('.admin-solicitudes__estado-ciclo', 'incorporado');
    expect(service.actualizar).toHaveBeenLastCalledWith('s1', {
      ciclos: [{ _id: 'c1', estado: 'incorporado' }],
    });
    cambiar('.admin-solicitudes__tarea', '219');
    expect(service.actualizar).toHaveBeenLastCalledWith('s1', {
      ciclos: [{ _id: 'c1', tarea: '219' }],
    });
    expect(el.querySelector('.admin-solicitudes__error')).toBeNull();
  });

  it('avisa si falla un cambio o la carga, y recarga la lista', () => {
    service.actualizar.mockReturnValueOnce(throwError(() => new Error('x')));
    cambiar('.admin-solicitudes__estado', 'descartada');
    expect(el.querySelector('.admin-solicitudes__error')?.textContent).toContain(
      'No se pudo guardar',
    );

    service.loadTodas.mockReturnValueOnce(throwError(() => new Error('x')));
    (el.querySelector('.admin-solicitudes__recargar') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.admin-solicitudes__error')?.textContent).toContain(
      'No se pudieron cargar',
    );

    (el.querySelector('.admin-solicitudes__recargar') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.admin-solicitudes__error')).toBeNull();
  });

  it('omite el municipio, la web y el comentario si faltan', () => {
    service.todas.set([
      { ...SOLICITUD, centro: { nombre: 'CEPA', municipio: '', web: '' }, comentario: '' },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('.admin-solicitudes__comentario')).toBeNull();
    expect(el.querySelector('a')).toBeNull();
    expect(el.textContent).not.toContain('Maó');
  });

  it('muestra un mensaje si no hay solicitudes', () => {
    service.todas.set([]);
    fixture.detectChanges();
    expect(el.querySelector('.admin-solicitudes__vacio')).toBeTruthy();
  });
});

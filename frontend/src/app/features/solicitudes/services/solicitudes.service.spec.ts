import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SolicitudesService } from './solicitudes.service';

const solicitud = (id: string, extra: object = {}) =>
  ({ _id: id, centro: { nombre: `IES ${id}` }, ciclos: [], status: 'pendiente', ...extra }) as any;

describe('SolicitudesService', () => {
  let service: SolicitudesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SolicitudesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('carga la oferta y las solicitudes del docente', () => {
    service.loadOferta().subscribe();
    http.expectOne('/api/solicitudes/oferta').flush([{ codigo: 'SSC33' }]);
    service.loadMias().subscribe();
    http.expectOne('/api/solicitudes/mias').flush([solicitud('a')]);
    expect(service.oferta()).toEqual([{ codigo: 'SSC33' }]);
    expect(service.misSolicitudes()).toHaveLength(1);
  });

  it('envía una solicitud y la añade al principio de «Mis solicitudes»', () => {
    service.misSolicitudes.set([solicitud('a')]);
    service.enviar({} as any).subscribe();
    expect(service.isSubmitting()).toBe(true);
    const req = http.expectOne('/api/solicitudes');
    expect(req.request.method).toBe('POST');
    req.flush(solicitud('b'));
    expect(service.isSubmitting()).toBe(false);
    expect(service.misSolicitudes().map((s) => s._id)).toEqual(['b', 'a']);
  });

  it('deja de enviar si el backend responde con error', () => {
    service.enviar({} as any).subscribe({ error: () => {} });
    http.expectOne('/api/solicitudes').flush({ error: 'x' }, { status: 400, statusText: 'Bad' });
    expect(service.isSubmitting()).toBe(false);
  });

  it('carga todas las solicitudes y sustituye la que actualiza el administrador', () => {
    service.loadTodas().subscribe();
    http.expectOne('/api/admin/solicitudes').flush([solicitud('a'), solicitud('b')]);
    service.actualizar('b', { status: 'completada' }).subscribe();
    const req = http.expectOne('/api/admin/solicitudes/b');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'completada' });
    req.flush(solicitud('b', { status: 'completada' }));
    expect(service.todas().map((s) => s.status)).toEqual(['pendiente', 'completada']);
  });
});

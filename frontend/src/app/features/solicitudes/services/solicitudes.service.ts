import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  ActualizarSolicitudDto,
  CicloOferta,
  CrearSolicitudDto,
  Solicitud,
} from '../models/solicitud.model';

/** Solicitudes de centros: oferta de ciclos, solicitudes propias y gestión del administrador. */
@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private http = inject(HttpClient);

  oferta = signal<CicloOferta[]>([]);
  misSolicitudes = signal<Solicitud[]>([]);
  todas = signal<Solicitud[]>([]);
  isSubmitting = signal(false);

  loadOferta(): Observable<CicloOferta[]> {
    return this.http
      .get<CicloOferta[]>('/api/solicitudes/oferta')
      .pipe(tap((oferta) => this.oferta.set(oferta)));
  }

  loadMias(): Observable<Solicitud[]> {
    return this.http
      .get<Solicitud[]>('/api/solicitudes/mias')
      .pipe(tap((lista) => this.misSolicitudes.set(lista)));
  }

  enviar(dto: CrearSolicitudDto): Observable<Solicitud> {
    this.isSubmitting.set(true);
    return this.http.post<Solicitud>('/api/solicitudes', dto).pipe(
      tap({
        next: (creada) => {
          this.isSubmitting.set(false);
          this.misSolicitudes.update((lista) => [creada, ...lista]);
        },
        error: () => this.isSubmitting.set(false),
      }),
    );
  }

  loadTodas(): Observable<Solicitud[]> {
    return this.http
      .get<Solicitud[]>('/api/admin/solicitudes')
      .pipe(tap((lista) => this.todas.set(lista)));
  }

  actualizar(id: string, dto: ActualizarSolicitudDto): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`/api/admin/solicitudes/${id}`, dto).pipe(
      tap((actualizada) => {
        this.todas.update((lista) => lista.map((s) => (s._id === id ? actualizada : s)));
      }),
    );
  }
}

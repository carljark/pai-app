import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudesService } from '../../../solicitudes/services/solicitudes.service';
import {
  ActualizarSolicitudDto,
  CicloSolicitado,
  ESTADOS_CICLO,
  ESTADOS_SOLICITUD,
  EstadoCiclo,
  EstadoSolicitud,
} from '../../../solicitudes/models/solicitud.model';

/**
 * Solicitudes de centros para el administrador: estado de cada solicitud y de cada ciclo,
 * número de tarea y notas. Cada cambio se guarda al momento y avisa al docente si cambia el estado.
 */
@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-solicitudes.component.html',
  styleUrl: './admin-solicitudes.component.scss',
})
export class AdminSolicitudesComponent {
  service = inject(SolicitudesService);

  readonly estados = ESTADOS_SOLICITUD;
  readonly estadosCiclo = ESTADOS_CICLO;
  error = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  cargar() {
    this.service.loadTodas().subscribe({
      next: () => this.error.set(null),
      error: () => this.error.set('No se pudieron cargar las solicitudes.'),
    });
  }

  cambiarEstado(id: string, event: Event) {
    this.guardar(id, { status: this.valor(event) as EstadoSolicitud });
  }

  cambiarNotas(id: string, event: Event) {
    this.guardar(id, { adminNotes: this.valor(event) });
  }

  cambiarEstadoCiclo(id: string, ciclo: CicloSolicitado, event: Event) {
    this.guardar(id, { ciclos: [{ _id: ciclo._id, estado: this.valor(event) as EstadoCiclo }] });
  }

  cambiarTarea(id: string, ciclo: CicloSolicitado, event: Event) {
    this.guardar(id, { ciclos: [{ _id: ciclo._id, tarea: this.valor(event) }] });
  }

  nombreCiclo(ciclo: CicloSolicitado): string {
    return ciclo.codigo
      ? `${ciclo.etapa} ${ciclo.nombre_es} (${ciclo.codigo})`
      : `Otro: ${ciclo.nombre}`;
  }

  private guardar(id: string, dto: ActualizarSolicitudDto) {
    this.service.actualizar(id, dto).subscribe({
      next: () => this.error.set(null),
      error: () => this.error.set('No se pudo guardar el cambio.'),
    });
  }

  private valor(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }
}

import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CicloSolicitado } from '../../models/solicitud.model';

/** Solicitudes del docente con el estado de cada una y de cada ciclo. */
@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss',
})
export class MisSolicitudesComponent {
  private layout = inject(LayoutService);
  service = inject(SolicitudesService);
  trans = inject(TranslationService);

  private catalan = computed(() => this.layout.language() === 'catalan');

  constructor() {
    this.service.loadMias().subscribe({ error: () => this.service.misSolicitudes.set([]) });
  }

  nombreCiclo(ciclo: CicloSolicitado): string {
    const nombre = this.catalan() ? ciclo.nombre_ca : ciclo.nombre_es;
    return ciclo.etapa ? `${ciclo.etapa} ${nombre}` : `${this.trans.t().solOtroCiclo}: ${nombre}`;
  }
}

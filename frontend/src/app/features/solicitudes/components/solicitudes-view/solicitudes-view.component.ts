import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { SolicitudFormComponent } from '../solicitud-form/solicitud-form.component';
import { MisSolicitudesComponent } from '../mis-solicitudes/mis-solicitudes.component';

/** Pantalla «Solicitar centro»: formulario y solicitudes del docente. */
@Component({
  selector: 'app-solicitudes-view',
  standalone: true,
  imports: [SolicitudFormComponent, MisSolicitudesComponent],
  templateUrl: './solicitudes-view.component.html',
  styleUrl: './solicitudes-view.component.scss',
})
export class SolicitudesViewComponent {
  trans = inject(TranslationService);
}

import { Component, computed, inject, signal } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CrearSolicitudDto } from '../../models/solicitud.model';
import { OfertaSelectorComponent } from '../oferta-selector/oferta-selector.component';

type Campo = 'nombre' | 'municipio' | 'web' | 'otros' | 'comentario';

/** Formulario para pedir un centro y sus ciclos. */
@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  imports: [OfertaSelectorComponent],
  templateUrl: './solicitud-form.component.html',
  styleUrl: './solicitud-form.component.scss',
})
export class SolicitudFormComponent {
  private layout = inject(LayoutService);
  service = inject(SolicitudesService);
  trans = inject(TranslationService);

  campos = signal<Record<Campo, string>>(this.camposVacios());
  seleccionados = signal<string[]>([]);
  enviada = signal(false);
  error = signal<string | null>(null);

  private otros = computed(() =>
    this.campos()
      .otros.split('\n')
      .map((linea) => linea.trim())
      .filter(Boolean),
  );

  puedeEnviar = computed(
    () =>
      !!this.campos().nombre.trim() &&
      (this.seleccionados().length > 0 || this.otros().length > 0) &&
      !this.service.isSubmitting(),
  );

  constructor() {
    this.service.loadOferta().subscribe({
      error: () => this.error.set(this.trans.t().solErrorOferta),
    });
  }

  actualizar(campo: Campo, event: Event) {
    const valor = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.campos.update((c) => ({ ...c, [campo]: valor }));
  }

  enviar() {
    if (!this.puedeEnviar()) return;
    this.error.set(null);
    this.enviada.set(false);
    this.service.enviar(this.dto()).subscribe({
      next: () => {
        this.campos.set(this.camposVacios());
        this.seleccionados.set([]);
        this.enviada.set(true);
      },
      error: (err) => this.error.set(err?.error?.error || this.trans.t().solErrorEnvio),
    });
  }

  private dto(): CrearSolicitudDto {
    const { nombre, municipio, web, comentario } = this.campos();
    return {
      centro: { nombre: nombre.trim(), municipio: municipio.trim(), web: web.trim() },
      ciclos: this.seleccionados(),
      otros: this.otros(),
      comentario: comentario.trim(),
      idioma: this.layout.language() === 'catalan' ? 'ca' : 'es',
    };
  }

  private camposVacios(): Record<Campo, string> {
    return { nombre: '', municipio: '', web: '', otros: '', comentario: '' };
  }
}

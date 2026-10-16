import { Component, computed, inject, input } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaVistaService, type MapaVista } from '../../../services/mapa-vista.service';

/** Selector entre la vista clásica del mapa, el mapa mental y la panorámica (beta). */
@Component({
  selector: 'app-mapa-vista-toggle',
  standalone: true,
  templateUrl: './vista-toggle.component.html',
  styleUrl: './vista-toggle.component.scss',
})
export class VistaToggleComponent {
  private layout = inject(LayoutService);
  private vistas = inject(MapaVistaService);

  /** La panorámica solo existe en los mapas de FP; en la ESO se ofrece el mapa mental. */
  conPanoramica = input(true);

  isCa = computed(() => this.layout.language() === 'catalan');
  vista = computed(() => (this.conPanoramica() ? this.vistas.vista() : this.vistas.vistaEso()));

  select(vista: MapaVista): void {
    this.vistas.setVista(vista);
  }
}

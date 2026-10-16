import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaVistaService, type MapaVista } from '../../../services/mapa-vista.service';

/** Selector entre la vista clásica del mapa y el mapa mental (beta). */
@Component({
  selector: 'app-mapa-vista-toggle',
  standalone: true,
  templateUrl: './vista-toggle.component.html',
  styleUrl: './vista-toggle.component.scss',
})
export class VistaToggleComponent {
  private layout = inject(LayoutService);
  private vistas = inject(MapaVistaService);

  isCa = computed(() => this.layout.language() === 'catalan');
  vista = this.vistas.vista;

  select(vista: MapaVista): void {
    this.vistas.setVista(vista);
  }
}

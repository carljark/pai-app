import { Component, computed, inject, input, output } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';

/** Clases de cada aspecto: botón general (fichas de la ESO) o de las tarjetas del mapa de FP. */
const CLASES = {
  general: 'btn-secondary cesta-boton',
  mapa: 'mapa-btn-action mapa-btn-action--secondary cesta-boton',
  'mapa-sm': 'mapa-btn-action mapa-btn-action--secondary mapa-btn-action--sm cesta-boton',
};

/** «Añadir a la cesta», que pasa a «En la cesta ✓» cuando ya está todo dentro. */
@Component({
  selector: 'app-cesta-boton',
  standalone: true,
  templateUrl: './cesta-boton.component.html',
  styleUrl: './cesta-boton.component.scss',
})
export class CestaBotonComponent {
  private layout = inject(LayoutService);

  enCesta = input.required<boolean>();
  aspecto = input<keyof typeof CLASES>('general');

  anadir = output<void>();

  isCa = computed(() => this.layout.language() === 'catalan');
  clases = computed(() => CLASES[this.aspecto()]);
}

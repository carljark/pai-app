import { Component, input, output } from '@angular/core';

/**
 * Panel lateral del mapa mental: cabecera con el recorrido (origen → destino), botón de cerrar
 * y el contenido proyectado (ficha de conexión en FP, ficha de afinidad en la ESO).
 */
@Component({
  selector: 'app-mindmap-drawer',
  standalone: true,
  templateUrl: './mindmap-drawer.component.html',
  styleUrl: './mindmap-drawer.component.scss',
})
export class MindmapDrawerComponent {
  eyebrow = input.required<string>();
  from = input.required<string>();
  to = input.required<string>();
  isCa = input.required<boolean>();

  closed = output<void>();
}

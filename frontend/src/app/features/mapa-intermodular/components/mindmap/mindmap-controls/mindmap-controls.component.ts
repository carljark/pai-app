import { Component, input, output } from '@angular/core';

/** Botones de zoom y reencuadre del lienzo del mapa mental. */
@Component({
  selector: 'app-mindmap-controls',
  standalone: true,
  templateUrl: './mindmap-controls.component.html',
  styleUrl: './mindmap-controls.component.scss',
})
export class MindmapControlsComponent {
  isCa = input.required<boolean>();

  zoomIn = output<void>();
  zoomOut = output<void>();
  fit = output<void>();
}

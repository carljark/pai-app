import { Component, input, output } from '@angular/core';
import type { LegendItem } from '../../../utils/relation-labels';

/** Leyenda de tipos de competencia que, al pulsarla, filtra el mapa mental o la panorámica. */
@Component({
  selector: 'app-mindmap-legend',
  standalone: true,
  templateUrl: './mindmap-legend.component.html',
  styleUrl: './mindmap-legend.component.scss',
})
export class MindmapLegendComponent {
  items = input.required<LegendItem[]>();
  isCa = input.required<boolean>();

  toggled = output<string>();
}

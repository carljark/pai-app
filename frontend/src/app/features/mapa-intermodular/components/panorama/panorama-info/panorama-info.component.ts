import { Component, input } from '@angular/core';
import type { PanoramaArc, PanoramaLeaf } from '../../../models/panorama.model';

/** Totales del curso en la panorámica. */
export interface PanoramaTotals {
  ras: number;
  connections: number;
  outside: number;
}

/** Ficha flotante de la panorámica: el RA o módulo resaltado o, si no hay, los totales del curso. */
@Component({
  selector: 'app-panorama-info',
  standalone: true,
  templateUrl: './panorama-info.component.html',
  styleUrl: './panorama-info.component.scss',
})
export class PanoramaInfoComponent {
  leaf = input<PanoramaLeaf | null>(null);
  arc = input<PanoramaArc | null>(null);
  totals = input.required<PanoramaTotals>();
  isCa = input.required<boolean>();
}

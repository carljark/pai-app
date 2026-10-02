import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SkeletonLoaderComponent
 *
 * Componente reutilizable de loading skeleton con efecto shimmer.
 * Se puede usar en cualquier sección de la app que cargue datos
 * de forma asíncrona: Mapa Intermodular, Generador, Historial, etc.
 *
 * @example
 * <app-skeleton-loader [lines]="5" [text]="'Carregant dades...'" />
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent {
  /** Número de líneas placeholder a mostrar (default: 4) */
  lines = input<number>(4);

  /** Texto descriptivo bajo las líneas skeleton (default: '') */
  text = input<string>('');

  /** Devuelve un array del tamaño `lines` para usar con @for */
  get lineArray(): number[] {
    return Array.from({ length: this.lines() }, (_, i) => i);
  }
}

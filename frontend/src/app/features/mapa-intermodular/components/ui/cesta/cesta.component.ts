import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CestaDropService } from '../../../services/cesta-drop.service';
import { CestaFacade } from '../../../services/cesta.facade';
import { CestaPanelComponent } from '../cesta-panel/cesta-panel.component';

/** Duración de la animación al recibir una bola (ms); coincide con la del SCSS. */
const RECIBIR_MS = 450;

/**
 * Cesta flotante del mapa: botón con el número de materias o módulos, panel con su contenido y
 * zona donde se sueltan las bolas del mapa mental (con la bola fantasma que se arrastra).
 */
@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CestaPanelComponent],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.scss',
})
export class CestaComponent {
  cesta = inject(CestaFacade);
  drop = inject(CestaDropService);

  abierta = signal(false);
  recibiendo = signal(false);
  total = computed(() => this.cesta.grupos().length);

  private zona = viewChild.required<ElementRef<HTMLElement>>('zona');
  private vistas = this.drop.recibidas();
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => this.drop.registrar(this.zona().nativeElement));
    effect(() => {
      const recibidas = this.drop.recibidas();
      if (recibidas !== this.vistas) untracked(() => this.animar(recibidas));
    });
    inject(DestroyRef).onDestroy(() => {
      this.drop.liberar(this.zona().nativeElement);
      clearTimeout(this.temporizador);
    });
  }

  alternar(): void {
    this.abierta.update((v) => !v);
  }

  private animar(recibidas: number): void {
    this.vistas = recibidas;
    this.recibiendo.set(true);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.recibiendo.set(false), RECIBIR_MS);
  }
}

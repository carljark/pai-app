import { Component, computed, inject, input, model, signal } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CicloOferta, EtapaFp } from '../../models/solicitud.model';

const ETAPAS: readonly EtapaFp[] = ['FPB', 'CFGM', 'CFGS'];

const normalizar = (texto: string) => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Lista de ciclos de la oferta con buscador y filtro por grado; marca los ya disponibles. */
@Component({
  selector: 'app-oferta-selector',
  standalone: true,
  templateUrl: './oferta-selector.component.html',
  styleUrl: './oferta-selector.component.scss',
})
export class OfertaSelectorComponent {
  private layout = inject(LayoutService);
  trans = inject(TranslationService);

  oferta = input<CicloOferta[]>([]);
  seleccionados = model<string[]>([]);

  readonly etapas = ETAPAS;
  busqueda = signal('');
  etapa = signal<EtapaFp | ''>('');

  private catalan = computed(() => this.layout.language() === 'catalan');

  filtrados = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const etapa = this.etapa();
    return this.oferta().filter(
      (c) =>
        (!etapa || c.etapa === etapa) &&
        (!termino ||
          normalizar(`${c.codigo} ${this.nombre(c)} ${this.familia(c)}`).includes(termino)),
    );
  });

  nombre(c: CicloOferta): string {
    return this.catalan() ? c.nombre_ca : c.nombre_es;
  }

  familia(c: CicloOferta): string {
    return this.catalan() ? c.familia_ca : c.familia_es;
  }

  estaSeleccionado(codigo: string): boolean {
    return this.seleccionados().includes(codigo);
  }

  alternar(codigo: string) {
    this.seleccionados.update((lista) =>
      lista.includes(codigo) ? lista.filter((c) => c !== codigo) : [...lista, codigo],
    );
  }

  buscar(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  filtrarEtapa(event: Event) {
    this.etapa.set((event.target as HTMLSelectElement).value as EtapaFp | '');
  }
}

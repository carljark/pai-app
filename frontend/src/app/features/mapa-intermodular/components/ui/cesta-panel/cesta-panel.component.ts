import { Component, computed, inject, output } from '@angular/core';
import { CestaFacade } from '../../../services/cesta.facade';

/** Textos del panel que cambian entre la ESO (materias y criterios) y la FP (módulos y RA). */
const TEXTOS = {
  eso: {
    es: {
      vacia:
        'Añade fichas con «Añadir a la cesta» o arrastra materias del mapa mental hasta la cesta.',
      sinComun: 'Sin criterios en común con el resto de la cesta.',
      unaSola: 'Añade otra materia para ver los criterios en común.',
    },
    ca: {
      vacia:
        'Afegeix fitxes amb «Afegeix a la cistella» o arrossega matèries del mapa mental fins a la cistella.',
      sinComun: 'Sense criteris en comú amb la resta de la cistella.',
      unaSola: 'Afegeix una altra matèria per veure els criteris en comú.',
    },
  },
  fp: {
    es: {
      vacia:
        'Añade conexiones con «Añadir a la cesta» o arrastra módulos del mapa mental hasta la cesta.',
      sinComun: 'Sin RA en común con el resto de la cesta.',
      unaSola: 'Añade otro módulo para ver los RA en común.',
    },
    ca: {
      vacia:
        'Afegeix connexions amb «Afegeix a la cistella» o arrossega mòduls del mapa mental fins a la cistella.',
      sinComun: 'Sense RA en comú amb la resta de la cistella.',
      unaSola: 'Afegeix un altre mòdul per veure els RA en comú.',
    },
  },
};

/** Contenido de la cesta: materias o módulos con sus criterios o RA, y crear el proyecto. */
@Component({
  selector: 'app-cesta-panel',
  standalone: true,
  templateUrl: './cesta-panel.component.html',
  styleUrl: './cesta-panel.component.scss',
})
export class CestaPanelComponent {
  cesta = inject(CestaFacade);

  cerrar = output<void>();

  textos = computed(
    () => TEXTOS[this.cesta.esEso() ? 'eso' : 'fp'][this.cesta.isCa() ? 'ca' : 'es'],
  );

  /** Aviso de un grupo sin claves: falta otra unidad o no comparte nada con las demás. */
  sinClaves(): string {
    return this.cesta.grupos().length < 2 ? this.textos().unaSola : this.textos().sinComun;
  }

  crear(): void {
    this.cesta.crearProyecto();
    this.cerrar.emit();
  }
}

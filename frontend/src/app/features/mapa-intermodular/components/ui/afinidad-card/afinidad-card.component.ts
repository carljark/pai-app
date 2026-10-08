import { Component, computed, inject, input } from '@angular/core';
import { AfinidadEso, CriterioTexto, VinculoAfinidad } from '../../../models/afinidad-eso.model';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { LayoutService } from '../../../../../services/layout.service';

/** Ficha de afinidad con el formato del documento de centro: ámbito, criterios, saberes y conceptos. */
@Component({
  selector: 'app-afinidad-card',
  standalone: true,
  templateUrl: './afinidad-card.component.html',
  styleUrl: './afinidad-card.component.scss',
})
export class AfinidadCardComponent {
  private layout = inject(LayoutService);
  private facade = inject(AfinidadesEsoFacade);

  afinidad = input.required<AfinidadEso>();
  /** Materia desde la que se consulta la ficha: va primero y fija el nombre del ámbito. */
  materia = input.required<string>();

  isCa = computed(() => this.layout.language() === 'catalan');

  /** Materias de la ficha con la materia consultada en primer lugar. */
  materias = computed(() => {
    const actual = this.materia();
    const resto = this.afinidad().materias.filter((m) => m !== actual);
    return this.afinidad().materias.includes(actual) ? [actual, ...resto] : resto;
  });

  fuente = computed(() => this.afinidad().fuentes.find((f) => f.materia === this.materia()));

  /** Nombre del ámbito tal como lo da el documento desde la materia consultada. */
  ambito = computed(() => {
    const f = this.fuente() ?? this.afinidad();
    return this.isCa() ? f.ambito_ca : f.ambito_es;
  });

  conceptos = computed(() =>
    this.isCa() ? this.afinidad().conceptos_ca : this.afinidad().conceptos_es,
  );

  nombre(code: string): string {
    return this.facade.materiaName(code, this.isCa());
  }

  criterios(v: VinculoAfinidad, materia: string): CriterioTexto[] {
    return (
      v.criteriosTexto?.[materia] ?? (v.criterios[materia] ?? []).map((id) => this.sinTexto(id))
    );
  }

  textoCriterio(c: CriterioTexto): string {
    return this.isCa() ? c.text_ca : c.text_es;
  }

  resumen(v: VinculoAfinidad, materia: string): string {
    return (this.isCa() ? v.resumen_ca : v.resumen_es)[materia] ?? '';
  }

  relacion(v: VinculoAfinidad): string {
    return this.isCa() ? v.relacion_ca : v.relacion_es;
  }

  saberes(materia: string): string[] {
    const s = this.afinidad().saberes[materia];
    if (!s) return [];
    return this.isCa() ? s.ca : s.es;
  }

  private sinTexto(id: string): CriterioTexto {
    return { id, text_es: '', text_ca: '' };
  }
}

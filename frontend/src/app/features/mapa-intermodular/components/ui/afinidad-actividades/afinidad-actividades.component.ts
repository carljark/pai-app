import { Component, computed, inject, input } from '@angular/core';
import { ActividadAfinidad, VinculoAfinidad } from '../../../models/afinidad-eso.model';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { LayoutService } from '../../../../../services/layout.service';

type CampoTexto = 'title' | 'motivatingFactor' | 'description' | 'evidence' | 'diversitySupport';

/** Criterio que trabaja una actividad, con su sigla y su texto oficial en el idioma activo. */
export interface CriterioActividad {
  id: string;
  texto: string;
}

/** Actividades conjuntas de una ficha de afinidad de la ESO (tarea 247). */
@Component({
  selector: 'app-afinidad-actividades',
  standalone: true,
  templateUrl: './afinidad-actividades.component.html',
  styleUrl: './afinidad-actividades.component.scss',
})
export class AfinidadActividadesComponent {
  private layout = inject(LayoutService);
  private facade = inject(AfinidadesEsoFacade);

  actividades = input.required<ActividadAfinidad[]>();
  /** Materias de la ficha en el orden en que se muestran (la consultada primero). */
  materias = input.required<string[]>();
  /** Vínculos de la ficha, de donde salen los textos oficiales de los criterios. */
  vinculos = input<VinculoAfinidad[]>([]);

  isCa = computed(() => this.layout.language() === 'catalan');
  sigla = computed(() => (this.isCa() ? 'CA' : 'CE'));

  /** Texto oficial de cada criterio por materia e id, en el idioma activo. */
  private textos = computed(() => {
    const mapa = new Map<string, string>();
    for (const v of this.vinculos()) {
      for (const [m, cs] of Object.entries(v.criteriosTexto ?? {})) {
        for (const c of cs) mapa.set(`${m}|${c.id}`, this.isCa() ? c.text_ca : c.text_es);
      }
    }
    return mapa;
  });

  texto(a: ActividadAfinidad, campo: CampoTexto): string {
    return this.isCa() ? a[`${campo}_ca`] : a[`${campo}_es`];
  }

  /** Materias que cita la actividad, en el orden de la ficha. */
  materiasDe(a: ActividadAfinidad): string[] {
    return this.materias().filter((m) => a.criterios[m]?.length);
  }

  criterios(a: ActividadAfinidad, materia: string): CriterioActividad[] {
    return (a.criterios[materia] ?? []).map((id) => ({
      id,
      texto: this.textos().get(`${materia}|${id}`) ?? '',
    }));
  }

  nombre(code: string): string {
    return this.facade.materiaName(code, this.isCa());
  }
}

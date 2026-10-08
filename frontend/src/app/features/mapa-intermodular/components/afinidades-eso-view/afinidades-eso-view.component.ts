import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { AfinidadesEsoFacade } from '../../services/afinidades-eso.facade';
import { MapaTab, cursoLargo } from '../../utils/mapa-labels';
import { LayoutService } from '../../../../services/layout.service';
import { NivelesService } from '../../../../services/niveles.service';
import { SkeletonLoaderComponent } from '../../../../components/skeleton-loader/skeleton-loader.component';
import { AfinidadCardComponent } from '../ui/afinidad-card/afinidad-card.component';

/** Mapa de afinidades curriculares de un curso de la ESO: materias del curso y sus fichas. */
@Component({
  selector: 'app-afinidades-eso-view',
  standalone: true,
  imports: [SkeletonLoaderComponent, AfinidadCardComponent],
  templateUrl: './afinidades-eso-view.component.html',
  styleUrl: './afinidades-eso-view.component.scss',
})
export class AfinidadesEsoViewComponent {
  facade = inject(AfinidadesEsoFacade);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  tab = input.required<MapaTab>();

  isCa = computed(() => this.layout.language() === 'catalan');
  curso = computed(() => cursoLargo(this.niveles.mapaTab(this.tab())?.curso ?? '', this.isCa()));
  materiaActual = computed(() =>
    this.facade.materiaName(this.facade.selectedMateria(), this.isCa()),
  );

  constructor() {
    effect(() => {
      const tab = this.tab();
      const inicial = this.niveles.mapaTab(tab)?.moduleCode ?? '';
      untracked(() => this.facade.load(tab, inicial));
    });
  }

  selectMateria(code: string): void {
    this.facade.selectMateria(code);
  }
}

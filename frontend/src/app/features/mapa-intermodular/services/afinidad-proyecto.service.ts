import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AfinidadEso } from '../models/afinidad-eso.model';
import { MapaTab } from '../utils/mapa-labels';
import { seleccionDeAfinidad } from '../utils/afinidad-seleccion';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { CriteriosFacade } from '../../curriculum/services/criterios.facade';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';

/**
 * Abre el generador con la ESO y el curso de la pestaña y las CE de una ficha de afinidad
 * seleccionadas, marcando solo los criterios de evaluación que cita la ficha.
 */
@Injectable({ providedIn: 'root' })
export class AfinidadProyectoService {
  private curriculum = inject(CurriculumFacade);
  private criterios = inject(CriteriosFacade);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  async crearProyecto(afinidad: AfinidadEso, materia: string, tab: MapaTab): Promise<void> {
    const config = this.niveles.mapaTab(tab);
    if (config) {
      this.curriculum.setTipoNivel(config.nivel.id);
      if (config.curso) this.curriculum.setCurso(config.curso);
    }
    try {
      await this.seleccionar(afinidad, materia);
    } catch (err) {
      console.error('Error al cargar las CE de la ficha ' + afinidad.id, err);
    }
    this.layout.switchView('generator');
  }

  /** Carga las CE del curso (pueden no estar aún en el estado) y selecciona las de la ficha. */
  private async seleccionar(afinidad: AfinidadEso, materia: string): Promise<void> {
    const ces = await firstValueFrom(
      this.curriculum.fetchEsoCes(this.layout.language(), this.curriculum.curso()),
    );
    this.curriculum.esoCes.set(ces);
    this.curriculum.clearSelection();
    for (const s of seleccionDeAfinidad(afinidad, materia, ces)) {
      this.criterios.fijar(s.key, s.ids, s.todos);
    }
  }
}

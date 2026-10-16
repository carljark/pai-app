import { Injectable, computed, inject } from '@angular/core';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';
import type { IntermodularConnection } from '../models/mapa-intermodular.model';
import { RaReference, connectionTargetRef, findCurriculumMatch } from '../utils/curriculum-match';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';

/**
 * Abre el generador desde el mapa intermodular (vista clásica o mapa mental) con el nivel y el
 * curso de la pestaña y el RA de origen seguido de los RA destino seleccionados.
 */
@Injectable({ providedIn: 'root' })
export class MapaProyectoService {
  private facade = inject(MapaIntermodularFacade);
  private curriculum = inject(CurriculumFacade);
  private layout = inject(LayoutService);
  private niveles = inject(NivelesService);

  private isCa = computed(() => this.layout.language() === 'catalan');

  /** Con `connection`, su RA destino; sin ella, los de todas las conexiones filtradas. */
  crearDesdeConexion(connection?: IntermodularConnection): void {
    this.syncCurriculumLevel();
    const selected = this.collectSelectedRas(connection);
    if (selected.length > 0) this.curriculum.selectedRas.set(selected);
    this.layout.switchView('generator');
  }

  /** Alinea nivel y curso del generador con la pestaña activa del mapa. */
  private syncCurriculumLevel(): void {
    const config = this.niveles.mapaTab(this.facade.activeTab());
    if (!config) return;
    this.curriculum.setTipoNivel(config.nivel.id);
    if (config.curso) this.curriculum.setCurso(config.curso);
  }

  /** RA de origen seguido de los RAs destino de la conexión (o de todas las filtradas). */
  private collectSelectedRas(connection?: IntermodularConnection): string[] {
    const activeRa = this.facade.selectedRa();
    const activeModule = this.facade.selectedModule();
    if (!activeRa || !activeModule) return [];

    const conns = connection ? [connection] : this.facade.filteredConnections();
    const refs: RaReference[] = [
      {
        moduleCode: activeModule.code,
        moduleName: activeModule.name_es,
        raCode: activeRa.code,
        textEs: activeRa.text_es,
        textCa: activeRa.text_ca,
      },
      ...conns.map(connectionTargetRef),
    ];
    const allRas = this.curriculum.ras();
    const selected: string[] = [];
    for (const ref of refs) {
      const desc = findCurriculumMatch(allRas, this.isCa(), ref);
      if (desc && !selected.includes(desc)) selected.push(desc);
    }
    return selected;
  }
}

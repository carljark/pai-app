import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { MapaTab } from '@mapa-intermodular/utils/mapa-labels';
import { NivelesService } from '../../../../services/niveles.service';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { IntermodularConnection } from '../../models/mapa-intermodular.model';
import { SkeletonLoaderComponent } from '../../../../components/skeleton-loader/skeleton-loader.component';

// UI Components
import { MapaTabsComponent } from '../ui/tabs/tabs.component';
import { MapaHeaderComponent } from '../ui/header/header.component';
import { ModuloListComponent } from '../ui/modulo-list/modulo-list.component';
import { RaDetailComponent } from '../ui/ra-detail/ra-detail.component';
import { ConnectionsListComponent } from '../ui/connections-list/connections-list.component';
import { AfinidadesEsoViewComponent } from '../afinidades-eso-view/afinidades-eso-view.component';
import { VistaToggleComponent } from '../ui/vista-toggle/vista-toggle.component';
import { MindmapViewComponent } from '../mindmap/mindmap-view/mindmap-view.component';
import { PanoramaViewComponent } from '../panorama/panorama-view/panorama-view.component';
import { MapaVistaService } from '../../services/mapa-vista.service';
import { MapaProyectoService } from '../../services/mapa-proyecto.service';

@Component({
  selector: 'app-mapa-intermodular-view',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonLoaderComponent,
    MapaTabsComponent,
    MapaHeaderComponent,
    ModuloListComponent,
    RaDetailComponent,
    ConnectionsListComponent,
    AfinidadesEsoViewComponent,
    VistaToggleComponent,
    MindmapViewComponent,
    PanoramaViewComponent,
  ],
  templateUrl: './mapa-intermodular-view.component.html',
  styleUrl: './mapa-intermodular-view.component.scss',
})
export class MapaIntermodularViewComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  vistas = inject(MapaVistaService);
  private proyecto = inject(MapaProyectoService);
  private niveles = inject(NivelesService);

  headerExpanded = signal(false);
  /** Los tres pasos se muestran plegados al abrir el mapa; se despliegan al elegir. */
  step1Open = signal(false);
  step2Open = signal(false);
  step3Open = signal(false);

  isCa = computed(() => this.layout.language() === 'catalan');
  /** La pestaña activa es un mapa de afinidades (ESO) y no de módulos (FP). */
  isAfinidades = computed(
    () => this.niveles.mapaTab(this.facade.activeTab())?.formato === 'afinidades',
  );

  toggleHeaderStats() {
    this.headerExpanded.update((v) => !v);
  }

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    if (step === 1) this.step1Open.update((v) => !v);
    if (step === 2) this.step2Open.update((v) => !v);
    if (step === 3) this.step3Open.update((v) => !v);
  }

  activateStep(step: number) {
    if (step === 1) this.step1Open.set(true);
    if (step === 2) this.step2Open.set(true);
    if (step === 3) this.step3Open.set(true);

    setTimeout(() => {
      const target = document.querySelector(`.mapa-step-body--${step}`) as HTMLElement | null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus?.();
      }
    }, 50);
  }

  onSelectModule(code: string) {
    this.facade.selectModule(code);
    this.step2Open.set(true);
  }

  onSelectRa(raId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.facade.selectRa(raId);
    this.step2Open.set(true);
    this.step3Open.set(true);
  }

  onSetTypeFilter(type: string) {
    this.facade.setTypeFilter(type);
  }

  onSearch(query: string) {
    this.facade.setSearch(query);
  }

  onSelectCriterion(criterion: string | null) {
    this.facade.selectCriterion(criterion);
  }

  getCriterionCode(critText: string): string {
    const m =
      critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[).\s]/i) ||
      critText.match(/(?:^|\b|-)(\d*[a-z])[).\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }

  createProjectFromConnection(connection?: IntermodularConnection) {
    this.proyecto.crearDesdeConexion(connection);
  }

  /** Al entrar en otro curso, los tres pasos vuelven a mostrarse plegados. */
  setTab(tab: MapaTab) {
    this.facade.setTab(tab);
    this.step1Open.set(false);
    this.step2Open.set(false);
    this.step3Open.set(false);
  }
}

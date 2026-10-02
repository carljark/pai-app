import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { IntermodularConnection } from '../../models/mapa-intermodular.model';
import { SkeletonLoaderComponent } from '../../../../components/skeleton-loader/skeleton-loader.component';

// UI Components
import { MapaTabsComponent } from '../ui/tabs/tabs.component';
import { MapaHeaderComponent } from '../ui/header/header.component';
import { ModuloListComponent } from '../ui/modulo-list/modulo-list.component';
import { RaDetailComponent } from '../ui/ra-detail/ra-detail.component';
import { ConnectionsListComponent } from '../ui/connections-list/connections-list.component';
import {
  RaReference,
  connectionTargetRef,
  findCurriculumMatch,
} from '../../utils/curriculum-match';

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
  ],
  templateUrl: './mapa-intermodular-view.component.html',
  styleUrl: './mapa-intermodular-view.component.scss',
})
export class MapaIntermodularViewComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);

  headerExpanded = signal(false);
  step1Open = signal(true);
  step2Open = signal(true);
  step3Open = signal(true);

  isCa = computed(() => this.layout.language() === 'catalan');

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
    this.syncCurriculumLevel();
    const selected = this.collectSelectedRas(connection);
    if (selected.length > 0) this.curriculum.selectedRas.set(selected);
    this.layout.switchView('generator');
  }

  /** Alinea nivel y curso del generador con la pestaña activa del mapa. */
  private syncCurriculumLevel(): void {
    const tab = this.facade.activeTab();
    const isPeluqueria = tab === 'CFGM_PELUQUERIA' || tab === 'CFGM_PELUQUERIA_2';
    this.curriculum.setTipoNivel(
      tab === 'CFGM' ? 'CFGM_ESTETICA' : isPeluqueria ? 'CFGM_PELUQUERIA' : 'FP_BASICA',
    );
    if (tab === 'CFGM_PELUQUERIA_2') {
      this.curriculum.setCurso('2º');
    } else if (tab === 'CFGM_PELUQUERIA') {
      this.curriculum.setCurso('1º');
    }
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

  setTab(tab: 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2') {
    this.facade.setTab(tab);
  }
}

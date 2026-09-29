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

function findCurriculumMatch(
  allRas: any[],
  isCa: boolean,
  modCode: string,
  modName: string,
  raCode: string,
  raTextEs: string,
  raTextCa: string
): string | null {
  const exact = allRas.find(r => r.description === raTextEs || r.description === raTextCa);
  if (exact) return exact.description;

  const normEs = raTextEs.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
  const normCa = raTextCa.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
  const textMatch = allRas.find(r => {
    const normDesc = (r.description || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (normEs && normDesc.includes(normEs)) || (normCa && normDesc.includes(normCa)) ||
           (normDesc && normEs.includes(normDesc.substring(0, 25)));
  });
  if (textMatch) return textMatch.description;

  const raIdx = raCode.replace(/\D/g, '');
  const modMatch = allRas.find(r => {
    const modStr = ((r.module || (r as any).subject || '') + ' ' + (r.id || '')).toLowerCase();
    return (modStr.includes(modCode.toLowerCase()) || modStr.includes(modName.toLowerCase().substring(0, 8))) &&
           ((r.id && r.id.toLowerCase().includes(raCode.toLowerCase())) || (r.id && r.id.replace(/\D/g, '') === raIdx));
  });
  if (modMatch) return modMatch.description;

  return isCa ? (raTextCa || raTextEs) : (raTextEs || raTextCa);
}

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
    ConnectionsListComponent
  ],
  template: `
    <app-mapa-tabs 
      [activeTab]="facade.activeTab()" 
      (tabChange)="setTab($event)">
    </app-mapa-tabs>

    @if (!facade.isLoadingSeed()) {
      <app-mapa-header
        [headerExpanded]="headerExpanded()"
        [activeTab]="facade.activeTab()"
        [searchQuery]="facade.searchQuery()"
        [typeFilter]="facade.selectedTypeFilter()"
        [stats]="facade.stats()"
        (headerToggle)="toggleHeaderStats()"
        (searchChange)="onSearch($event)"
        (typeFilterChange)="onSetTypeFilter($event)">
      </app-mapa-header>

      <div class="mapa-vertical-accordions">
        <app-modulo-list
          [modules]="facade.filteredModules()"
          [selectedModuleCode]="facade.selectedModuleCode()"
          [selectedRaId]="facade.selectedRaId()"
          [step1Open]="step1Open()"
          (onSelectModule)="onSelectModule($event)"
          (onSelectRa)="onSelectRa($event)"
          (toggleStepEvent)="toggleStep($event)"
          (activateStepEvent)="activateStep($event)">
        </app-modulo-list>

        <app-ra-detail
          [step2Open]="step2Open()"
          [selectedCriterion]="facade.selectedCriterion()"
          (onSelectCriterion)="onSelectCriterion($event)"
          (createProject)="createProjectFromConnection()"
          (toggleStepEvent)="toggleStep($event)"
          (activateStepEvent)="activateStep($event)">
        </app-ra-detail>

        <app-connections-list
          [connections]="facade.filteredConnections()"
          [selectedCriterion]="facade.selectedCriterion()"
          [step3Open]="step3Open()"
          [activeTab]="facade.activeTab()"
          (createProject)="createProjectFromConnection($event)"
          (toggleStepEvent)="toggleStep($event)"
          (activateStepEvent)="activateStep($event)">
        </app-connections-list>
      </div>
    } @else {
      <div class="mapa-loading-skeleton">
        <app-skeleton-loader
          [lines]="6"
          [text]="trans.t().loadingData"
        />
      </div>
    }
  `,
  styleUrl: './mapa-intermodular-view.component.scss'
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
    this.headerExpanded.update(v => !v);
  }

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    if (step === 1) this.step1Open.update(v => !v);
    if (step === 2) this.step2Open.update(v => !v);
    if (step === 3) this.step3Open.update(v => !v);
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
    const m = critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[\)\.\s]/i) || critText.match(/(?:^|\b|\-)(\d*[a-z])[\)\.\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }

  createProjectFromConnection(connection?: IntermodularConnection) {
    const isPeluqueria = this.facade.activeTab() === 'CFGM_PELUQUERIA' || this.facade.activeTab() === 'CFGM_PELUQUERIA_2';
    this.curriculum.setTipoNivel(this.facade.activeTab() === 'CFGM' ? 'CFGM_ESTETICA' : (isPeluqueria ? 'CFGM_PELUQUERIA' : 'FP_BASICA'));
    if (this.facade.activeTab() === 'CFGM_PELUQUERIA_2') {
      this.curriculum.setCurso('2º');
    } else if (this.facade.activeTab() === 'CFGM_PELUQUERIA') {
      this.curriculum.setCurso('1º');
    }
    const allRas = this.curriculum.ras();
    const activeRa = this.facade.selectedRa();
    const activeModule = this.facade.selectedModule();
    const selected: string[] = [];

    if (activeRa && activeModule) {
      const srcDesc = findCurriculumMatch(allRas, this.isCa(), activeModule.code, activeModule.name_es, activeRa.code, activeRa.text_es, activeRa.text_ca);
      if (srcDesc) selected.push(srcDesc);

      const conns = connection ? [connection] : this.facade.filteredConnections();
      for (const c of conns) {
        const tgtDesc = findCurriculumMatch(allRas, this.isCa(), c.targetModuleCode, c.targetModuleName_es, c.targetRaCode, c.targetRaText_es, c.targetRaText_ca);
        if (tgtDesc && !selected.includes(tgtDesc)) selected.push(tgtDesc);
      }
    }
    if (selected.length > 0) this.curriculum.selectedRas.set(selected);
    this.layout.switchView('generator');
  }

  setTab(tab: 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2') {
    this.facade.setTab(tab);
  }
}
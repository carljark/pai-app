import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { IntermodularConnection } from '../../models/mapa-intermodular.model';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-intermodular-view.component.html',
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

  toggleStep(step: 1 | 2 | 3) {
    if (step === 1) this.step1Open.update(v => !v);
    if (step === 2) this.step2Open.update(v => !v);
    if (step === 3) this.step3Open.update(v => !v);
  }

  getRelationLabel(type: string): string {
    const labels: Record<string, { es: string; ca: string }> = {
      ciencias: { es: 'Ciencias Aplicadas', ca: 'Ciències Aplicades' },
      comunicacion: { es: 'Comunicación', ca: 'Comunicació' },
      empleabilidad: { es: 'Empleabilidad / FOL', ca: 'Ocupabilitat / FOL' },
      cliente: { es: 'Atención al Cliente', ca: 'Atenció al Client' },
      sostenibilidad: { es: 'Sostenibilidad', ca: 'Sostenibilitat' },
      digital: { es: 'Digital / Redes', ca: 'Digital / Xarxes' },
      tecnica: { es: 'Técnica Práctica', ca: 'Tècnica Pràctica' }
    };
    return this.isCa() ? (labels[type]?.ca || type) : (labels[type]?.es || type);
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
    this.curriculum.setTipoNivel('FP_BASICA');
    const allRas = this.curriculum.ras();
    const activeRa = this.facade.selectedRa();
    const activeModule = this.facade.selectedModule();
    const selected: string[] = [];

    if (activeRa && activeModule) {
      const sourceDesc = findCurriculumMatch(allRas, this.isCa(), activeModule.code, activeModule.name_es, activeRa.code, activeRa.text_es, activeRa.text_ca);
      if (sourceDesc) selected.push(sourceDesc);

      const conns = connection ? [connection] : this.facade.filteredConnections();
      for (const c of conns) {
        const targetDesc = findCurriculumMatch(allRas, this.isCa(), c.targetModuleCode, c.targetModuleName_es, c.targetRaCode, c.targetRaText_es, c.targetRaText_ca);
        if (targetDesc && !selected.includes(targetDesc)) {
          selected.push(targetDesc);
        }
      }
    }

    if (selected.length > 0) {
      this.curriculum.selectedRas.set(selected);
    }

    this.layout.switchView('generator');
  }
}

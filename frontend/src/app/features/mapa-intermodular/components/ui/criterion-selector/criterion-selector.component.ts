import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { LayoutService } from '../../../../../services/layout.service';
import { LearningOutcome } from '../../../models/mapa-intermodular.model';

@Component({
  selector: 'app-criterion-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './criterion-selector.component.html',
  styleUrl: './criterion-selector.component.scss',
})
export class CriterionSelectorComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  ra = input.required<LearningOutcome>();
  selectedCriterion = input.required<string | null>();

  @Output() criterionSelected = new EventEmitter<string | null>();

  selectCriterion(criterion: string | null) {
    this.criterionSelected.emit(criterion);
  }
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number) {
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }

  getCriterionCode(critText: string): string {
    const m =
      critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[).\s]/i) ||
      critText.match(/(?:^|\b|-)(\d*[a-z])[).\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }
}

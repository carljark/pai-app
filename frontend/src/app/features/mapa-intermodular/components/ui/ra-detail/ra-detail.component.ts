import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';

@Component({
  selector: 'app-ra-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ra-detail.component.html',
  styleUrl: './ra-detail.component.scss',
})
export class RaDetailComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  step2Open = input.required<boolean>();
  selectedCriterion = input.required<string | null>();

  @Output() criterionSelected = new EventEmitter<string | null>();
  @Output() createProject = new EventEmitter<void>();
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }

  selectCriterion(criterion: string | null) {
    this.criterionSelected.emit(criterion);
  }

  getCriterionCode(critText: string): string {
    const m =
      critText.match(/^(?:(?:\d+-)?(\d*[a-z])|[a-z])[).\s]/i) ||
      critText.match(/(?:^|\b|-)(\d*[a-z])[).\s]/i);
    return m ? m[1].toLowerCase() : 'CE';
  }
}

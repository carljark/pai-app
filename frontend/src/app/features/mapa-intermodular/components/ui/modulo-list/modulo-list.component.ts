import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { FPBModule } from '@mapa-intermodular/models/mapa-intermodular.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modulo-list.component.html',
  styleUrl: './modulo-list.component.scss',
})
export class ModuloListComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);

  step1Open = input.required<boolean>();
  modules = input.required<FPBModule[]>();
  selectedModuleCode = input.required<string>();
  selectedRaId = input.required<string>();

  isCa = computed(() => this.layout.language() === 'catalan');

  @Output() moduleSelected = new EventEmitter<string>();
  @Output() raSelected = new EventEmitter<string>();
  @Output() toggleStepEvent = new EventEmitter<number>();
  @Output() activateStepEvent = new EventEmitter<number>();

  toggleStep(step: number, event?: Event) {
    if (event) event.stopPropagation();
    this.toggleStepEvent.emit(step);
  }

  activateStep(step: number) {
    this.activateStepEvent.emit(step);
  }
}

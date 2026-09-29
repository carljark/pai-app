import { Component, inject, computed, input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from '@mapa-intermodular/services/layout.service';
import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modulo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapa-step-header mapa-step-header--1" 
      [class.open]="step1Open()"
      (click)="activateStep(1)"
      [attr.aria-expanded]="step1Open()"
      [title]="isCa() ? 'Activar i desplaçar al Pas 1' : 'Activar y desplazar al Paso 1'">
      <div class="mapa-step-header__left">
        <button 
          type="button" 
          class="mapa-step-toggle-btn"
          (click)="toggleStep(1, $event)"
          [attr.aria-label]="step1Open() ? (isCa() ? 'Col·lapsar Pas 1' : 'Colapsar Paso 1') : (isCa() ? 'Expandir Pas 1' : 'Expandir Paso 1')"
          [title]="step1Open() ? (isCa() ? 'Col·lapsar Pas 1' : 'Colapsar Paso 1') : (isCa() ? 'Expandir Pas 1' : 'Expandir Paso 1')">
          <span class="mapa-step-chevron" [class.rotated]="step1Open()">▼</span>
        </button>
        <h2 class="mapa-step-title">
          {{ isCa() ? '1. Mòduls i Resultats d'Aprenentatge' : '1. Módulos y Resultados de Aprendizaje' }}
        </h2>
      </div>
      <div class="mapa-step-header__right">
        @if (facade.selectedModule(); as sm) {
          <span class="mapa-badge-code" [style.background]="sm.color">{{ sm.code }}</span>
          <span class="mapa-step-subtitle-hint">{{ isCa() ? sm.name_ca : sm.name_es }}</span>
        }
      </div>
    </div>

    <div tabindex="-1" class="mapa-step-body mapa-step-body--1" [class.collapsed]="!step1Open()">
      <div class="mapa-modules-list">
        @for (mod of facade.filteredModules(); track mod.code) {
          <div 
            class="mapa-module-card" 
            [class.selected]="facade.selectedModuleCode() === mod.code"
            (click)="onSelectModule.emit(mod.code)">
            <div class="mapa-module-header">
              <div class="mapa-module-header__title">
                <span class="mapa-module-chevron">{{ facade.selectedModuleCode() === mod.code ? '▼' : '▶' }}</span>
                <span class="mapa-badge-code" [style.background]="mod.color">{{ mod.code }}</span>
                <strong class="mapa-module-name">{{ isCa() ? mod.name_ca : mod.name_es }}</strong>
              </div>
              <span class="mapa-module-count-badge">{{ mod.learningOutcomes.length }} RAs</span>
            </div>

            @if (facade.selectedModuleCode() === mod.code) {
              <div class="mapa-ra-list">
                @for (ra of mod.learningOutcomes; track ra.id) {
                  <button 
                    class="mapa-ra-item" 
                    [class.active]="facade.selectedRaId() === ra.id"
                    (click)="onSelectRa.emit(ra.id); $event.stopPropagation()">
                    <span class="mapa-ra-code">{{ ra.code }}</span>
                    <span class="mapa-ra-text">{{ isCa() ? ra.text_ca : ra.text_es }}</span>
                    <span class="mapa-ra-count" [title]="isCa() ? 'Connexions' : 'Conexiones'">{{ ra.connections.length }}</span>
                  </button>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="mapa-empty-state">
            {{ isCa() ? "No s'ha trobat cap mòdul amb aquest filtre." : 'No se encontró ningún módulo con este filtro.' }}
          </div>
        }
      </div>
    </div>
  `
})
export class ModuloListComponent {
  facade = inject(MapaIntermodularFacade);
  layout = inject(LayoutService);

  step1Open = input.required<boolean>();
  isCa = computed(() => this.layout.language() === 'catalan');

  @Output() onSelectModule = new EventEmitter<string>();
  @Output() onSelectRa = new EventEmitter<string>();
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
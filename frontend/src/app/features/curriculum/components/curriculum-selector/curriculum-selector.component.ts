import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Lado Izquierdo: Acordeones de Selección -->
    <div style="display: grid; gap: 15px; position: sticky; top: 20px; align-self: start;">
      @for (group of facade.groupedItems(); track group.category) {
        <details style="background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <summary [style.background]="facade.getCategoryStyle(group.category).bg" [style.color]="facade.getCategoryStyle(group.category).text" style="padding: 15px; font-weight: bold; cursor: pointer; user-select: none;">
            {{ facade.getCategoryStyle(group.category).icon }} {{ group.category }} ({{ group.totalItems }})
          </summary>
          <div style="padding: 15px;">
            @for (item of group.items; track item.text) {
              <label style="display: flex; margin-bottom: 12px; cursor: pointer; padding: 8px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f1f2f6'" onmouseout="this.style.background='transparent'">
                <input type="checkbox" 
                      [checked]="facade.selectedRas().includes(item.text)"
                      (change)="facade.toggleRa(item.text)"
                      style="margin-right: 10px; margin-top: 5px; transform: scale(1.2);">
                <span style="font-size: 0.95rem; line-height: 1.4;">
                  <span style="font-weight: bold; color: #2980b9; margin-right: 5px;">{{ item.index }}. </span>
                  {{ item.text }}
                </span>
              </label>
            }
          </div>
        </details>
      }
    </div>

    <!-- Lado Derecho: Carrito Flotante (Floating Action Box) -->
    <div class="floating-cart" style="position: fixed; bottom: 20px; right: 20px; width: 420px; max-width: calc(100vw - 40px); background: white; border: 1px solid #bdc3c7; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 9999; overflow: hidden; display: flex; flex-direction: column;">
      <div class="floating-cart__header" (click)="isOpen.set(!isOpen())" style="padding: 15px 20px; background: #2c3e50; color: white; font-weight: bold; font-size: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; user-select: none; line-height: 1.4;">
        <span style="flex: 1;"> {{ title() }} ({{ facade.selectedItemsDetails().length }})</span>
        <span style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px; flex-shrink: 0;">{{ isOpen() ? '▼' : '▲' }}</span>
      </div>

      <div style="display: flex; flex-direction: column; background: white;">
        @if (isOpen()) {
          <div class="floating-cart__body" style="padding: 20px 20px 0 20px; max-height: 40vh; overflow-y: auto;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              @for (group of facade.groupedSelectedItems(); track group.subject) {
                <li style="margin-bottom: 15px; background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                  <div [style.background]="facade.getCategoryStyle(group.subject).bg" [style.color]="facade.getCategoryStyle(group.subject).text" style="padding: 8px 12px; font-size: 0.85rem; font-weight: bold; border-bottom: 1px solid #e0e0e0;">
                    {{ group.subject }} ({{ group.items.length }})
                  </div>
                  <ul style="list-style: none; padding: 10px; margin: 0;">
                    @for (item of group.items; track item.fullDesc) {
                      <li style="margin-bottom: 8px; font-size: 0.85rem; display: flex; align-items: flex-start; justify-content: space-between;">
                        <div>
                          <strong style="color: #2980b9;">{{ item.index }}.</strong> {{ item.shortDesc }}
                        </div>
                        <button (click)="facade.toggleRa(item.fullDesc)" style="background: none; border: none; color: #e74c3c; cursor: pointer; padding: 0 5px;" [title]="trans.t().removeTooltip">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </li>
                    }
                  </ul>
                </li>
              }
            </ul>
          </div>
        }

        @if (facade.selectedItemsDetails().length > 0) {
          <div class="floating-cart__footer" style="padding: 20px; border-top: 1px solid #ecf0f1;">
            <button (click)="generate.emit()" 
                    [disabled]="isGenerating()" 
                    class="btn-primary"
                    style="width: 100%; padding: 15px; font-size: 1.1rem; font-weight: bold; border-radius: 8px;">
              @if (isGenerating()) {
                <span style="display: flex; justify-content: center; align-items: center; gap: 8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 2s linear infinite;">
                    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
                  </svg>
                  {{ generatingText() }}
                </span>
              } @else {
                {{ generateText() }}
              }
            </button>
            
            <style>
              @keyframes spin { 100% { transform: rotate(360deg); } }
            </style>
          </div>
        }
      </div>
    </div>
  `
})
export class CurriculumSelectorComponent {
  facade = inject(CurriculumFacade);
  trans = inject(TranslationService);
  title = input.required<string>();
  isOpen = signal(true);
  
  // Novedades para el botón
  isGenerating = input<boolean>(false);
  generateText = input.required<string>();
  generatingText = input.required<string>();
  generate = output<void>();
}

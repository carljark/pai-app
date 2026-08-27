import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px);">
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 450px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
        
        <div style="color: #e67e22; margin-bottom: 20px;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h2 style="color: #2c3e50; margin-top: 0; font-size: 1.5rem;">{{ title() }}</h2>
        
        <p style="color: #7f8c8d; font-size: 1.05rem; line-height: 1.6; padding: 10px 0 20px;">
          {{ message() }}
        </p>
        
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button (click)="cancel.emit()" style="flex: 1; background: #ecf0f1; color: #7f8c8d; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.3s;">
            Cancelar
          </button>
          <button (click)="confirm.emit()" style="flex: 1; background: #e74c3c; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.3s;">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  title = input<string>('¿Estás seguro?');
  message = input<string>('Esta acción no se puede deshacer.');
  confirm = output<void>();
  cancel = output<void>();
}

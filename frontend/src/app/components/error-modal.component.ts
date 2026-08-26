import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px);">
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
        <div style="color: #e74c3c; margin-bottom: 20px;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 style="color: #2c3e50; margin-top: 0; font-size: 1.5rem;">Error de Generación</h2>
        <p style="color: #7f8c8d; font-size: 1rem; line-height: 1.5; white-space: pre-wrap; text-align: left; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #e74c3c;">{{ message() }}</p>
        <button (click)="close.emit()" style="margin-top: 25px; background: #2c3e50; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background 0.3s;">
          Entendido
        </button>
      </div>
    </div>
  `
})
export class ErrorModalComponent {
  message = input<string>('');
  close = output<void>();
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px);">
      <div style="background: white; padding: 28px; border-radius: 16px; max-width: 480px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; border: 1px solid #f1f5f9;">
        
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 style="color: #1e293b; margin: 0 0 12px 0; font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em;">
          {{ title() }}
        </h2>

        <div style="color: #475569; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 8px; max-height: 250px; overflow-y: auto;">
          {{ message() }}
        </div>

        <button (click)="close.emit()" style="margin-top: 20px; background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%;">
          Entendido
        </button>
      </div>
    </div>
  `
})
export class ErrorModalComponent {
  title = input<string>('Ha ocurrido un error');
  message = input<string>('');
  close = output<void>();
}

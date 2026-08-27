import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px);">
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
        
        <div [style.color]="type() === 'success' ? '#27ae60' : '#3498db'" style="margin-bottom: 20px;">
          @if (type() === 'success') {
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          } @else {
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          }
        </div>
        
        <h2 style="color: #2c3e50; margin-top: 0; font-size: 1.5rem;">{{ title() }}</h2>
        
        <p style="color: #7f8c8d; font-size: 1.05rem; line-height: 1.6; white-space: pre-wrap; text-align: left; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid; [border-left-color]: type() === 'success' ? '#27ae60' : '#3498db'">
          {{ message() }}
        </p>
        
        <button (click)="close.emit()" style="margin-top: 25px; background: #2c3e50; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background 0.3s; width: 100%;">
          Entendido
        </button>
      </div>
    </div>
  `
})
export class InfoModalComponent {
  title = input<string>('Información');
  message = input<string>('');
  type = input<'info'|'success'>('info');
  close = output<void>();
}

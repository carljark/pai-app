import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #2c3e50; margin-top: 0;">Plataforma PAI</h2>
      <p style="text-align: center; color: #7f8c8d; margin-bottom: 25px;">
        {{ authMode() === 'login' ? 'Inicia sesión para continuar' : 'Crea una cuenta' }}
      </p>

      @if (authError()) {
        <div style="background: #fde5e5; color: #c0392b; padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 0.9rem; text-align: center;">
          {{ authError() }}
        </div>
      }

      <div style="display: flex; flex-direction: column; gap: 15px;">
        @if (authMode() === 'register') {
          <input type="text" [ngModel]="authForm().name" (ngModelChange)="authForm.set({ ...authForm(), name: $event })" placeholder="Nombre completo" style="padding: 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 1rem;">
        }
        <input type="email" [ngModel]="authForm().email" (ngModelChange)="authForm.set({ ...authForm(), email: $event })" placeholder="Correo electrónico" style="padding: 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 1rem;">
        <input type="password" [ngModel]="authForm().password" (ngModelChange)="authForm.set({ ...authForm(), password: $event })" placeholder="Contraseña" style="padding: 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 1rem;">
        
        <button (click)="authMode() === 'login' ? login() : register()" style="background: #2980b9; color: white; border: none; padding: 12px; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background 0.2s;">
          {{ authMode() === 'login' ? 'Entrar' : 'Registrarse' }}
        </button>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <button (click)="authMode.set(authMode() === 'login' ? 'register' : 'login')" style="background: none; border: none; color: #2980b9; text-decoration: underline; cursor: pointer; font-size: 0.95rem;">
          {{ authMode() === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>
    </div>
  `
})
export class AuthFormComponent {
  private authFacade = inject(AuthFacade);

  authMode = signal<'login' | 'register'>('login');
  authForm = signal({ email: '', password: '', name: '' });
  authError = signal('');
  successMessage = signal('');

  login() {
    this.authError.set('');
    this.authFacade.login({ email: this.authForm().email, password: this.authForm().password }).subscribe({
      next: () => {},
      error: (err) => this.authError.set(err.error?.error || 'Error al iniciar sesión')
    });
  }

  register() {
    this.authError.set('');
    this.authFacade.register(this.authForm()).subscribe({
      next: () => {
        this.successMessage.set('Registro exitoso. Espera a que un administrador apruebe tu cuenta.');
        this.authMode.set('login');
      },
      error: (err) => this.authError.set(err.error?.error || 'Error al registrarse')
    });
  }
}

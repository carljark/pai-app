import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../services/auth.facade';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {
  private authFacade = inject(AuthFacade);

  authMode = signal<'login' | 'register'>('login');
  authForm = signal({ email: '', password: '', name: '' });
  authError = signal('');
  successMessage = signal('');

  login() {
    this.authError.set('');
    this.authFacade
      .login({ email: this.authForm().email, password: this.authForm().password })
      .subscribe({
        error: (err) => this.authError.set(err.error?.error || 'Error al iniciar sesión'),
      });
  }

  register() {
    this.authError.set('');
    this.authFacade.register(this.authForm()).subscribe({
      next: () => {
        this.successMessage.set(
          'Registro exitoso. Espera a que un administrador apruebe tu cuenta.',
        );
        this.authMode.set('login');
      },
      error: (err) => this.authError.set(err.error?.error || 'Error al registrarse'),
    });
  }
}

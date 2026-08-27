import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFormComponent } from './auth-form.component';
import { AuthFacade } from '../../services/auth.facade';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  let authFacadeMock: any;

  beforeEach(async () => {
    authFacadeMock = {
      login: vi.fn(),
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AuthFormComponent, FormsModule],
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to login mode', () => {
    expect(component.authMode()).toBe('login');
  });

  it('should call login on facade when login is triggered', () => {
    authFacadeMock.login.mockReturnValue(of({}));
    component.authForm.set({ email: 'e', password: 'p', name: '' });
    component.login();
    
    expect(authFacadeMock.login).toHaveBeenCalledWith({ email: 'e', password: 'p' });
    expect(component.authError()).toBe('');
  });

  it('should set authError when login fails', () => {
    authFacadeMock.login.mockReturnValue(throwError(() => ({ error: { error: 'Bad login' } })));
    component.login();
    expect(component.authError()).toBe('Bad login');
  });

  it('should set authError fallback when login fails without specific error', () => {
    authFacadeMock.login.mockReturnValue(throwError(() => ({ })));
    component.login();
    expect(component.authError()).toBe('Error al iniciar sesión');
  });

  it('should call register on facade when register is triggered', () => {
    authFacadeMock.register.mockReturnValue(of({}));
    component.authForm.set({ email: 'e', password: 'p', name: 'n' });
    component.register();
    
    expect(authFacadeMock.register).toHaveBeenCalledWith({ email: 'e', password: 'p', name: 'n' });
    expect(component.successMessage()).toContain('Registro exitoso');
    expect(component.authMode()).toBe('login');
  });

  it('should set authError when register fails', () => {
    authFacadeMock.register.mockReturnValue(throwError(() => ({ error: { error: 'Bad register' } })));
    component.register();
    expect(component.authError()).toBe('Bad register');
  });

  it('should set authError fallback when register fails without specific error', () => {
    authFacadeMock.register.mockReturnValue(throwError(() => ({ })));
    component.register();
    expect(component.authError()).toBe('Error al registrarse');
  });
});

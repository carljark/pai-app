import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OnboardingFacade, WELCOME_LATER_KEY } from './onboarding.facade';
import { AuthFacade } from '../../auth/services/auth.facade';

const URL = '/api/users/me/onboarding';

describe('OnboardingFacade', () => {
  let facade: OnboardingFacade;
  let http: HttpTestingController;
  let currentUser: ReturnType<typeof signal<any>>;

  const setup = (user: any) => {
    currentUser = signal<any>(user);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthFacade, useValue: { currentUser } },
      ],
    });
    facade = TestBed.inject(OnboardingFacade);
    http = TestBed.inject(HttpTestingController);
    TestBed.tick();
  };

  beforeEach(() => sessionStorage.removeItem(WELCOME_LATER_KEY));

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('un docente que no la ha cerrado ve la bienvenida', () => {
    setup({ _id: 'u1', role: 'teacher' });
    http.expectOne(URL).flush({ welcomeDismissed: false, completedTours: ['mapa'] });
    expect(facade.welcomeVisible()).toBe(true);
    expect(facade.completedTours()).toEqual(['mapa']);
  });

  it('no la ve si ya la cerró, si la pospuso en esta sesión o si falla la carga', () => {
    setup({ _id: 'u1', role: 'teacher' });
    http.expectOne(URL).flush({ welcomeDismissed: true, completedTours: [] });
    expect(facade.welcomeVisible()).toBe(false);

    sessionStorage.setItem(WELCOME_LATER_KEY, '1');
    facade.load();
    http.expectOne(URL).flush({ welcomeDismissed: false, completedTours: [] });
    expect(facade.welcomeVisible()).toBe(false);

    facade.welcomeVisible.set(true);
    facade.load();
    http.expectOne(URL).flush('x', { status: 500, statusText: 'Error' });
    expect(facade.welcomeVisible()).toBe(false);
  });

  it('los usuarios pendientes y sin sesión no la cargan; al salir se reinicia', () => {
    setup({ _id: 'u1', role: 'pending' });
    http.expectNone(URL);

    currentUser.set({ _id: 'u2', role: 'admin' });
    TestBed.tick();
    http.expectOne(URL).flush({ welcomeDismissed: false, completedTours: ['intro'] });
    facade.helpOpen.set(true);

    currentUser.set(null);
    TestBed.tick();
    expect(facade.welcomeVisible()).toBe(false);
    expect(facade.helpOpen()).toBe(false);
    expect(facade.completedTours()).toEqual([]);
  });

  it('«Más tarde» la cierra en esta sesión sin guardar nada', () => {
    setup(null);
    facade.welcomeVisible.set(true);
    facade.later();
    expect(facade.welcomeVisible()).toBe(false);
    expect(sessionStorage.getItem(WELCOME_LATER_KEY)).toBe('1');
  });

  it('«Más tarde» no falla si el navegador bloquea sessionStorage', () => {
    setup(null);
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(() => facade.later()).not.toThrow();
  });

  it('cerrar la bienvenida la guarda en el servidor', () => {
    setup(null);
    facade.welcomeVisible.set(true);
    facade.dismissWelcome();
    const req = http.expectOne({ method: 'PATCH', url: URL });
    expect(req.request.body).toEqual({ welcomeDismissed: true });
    req.flush({ welcomeDismissed: true, completedTours: [] });
    expect(facade.welcomeVisible()).toBe(false);
  });

  it('marca una visita completada una sola vez y tolera errores al guardar', () => {
    setup(null);
    facade.markCompleted('generator');
    expect(facade.completedTours()).toEqual(['generator']);
    const req = http.expectOne({ method: 'PATCH', url: URL });
    expect(req.request.body).toEqual({ completedTour: 'generator' });
    req.flush('x', { status: 500, statusText: 'Error' });

    facade.markCompleted('generator');
    http.expectNone(URL);
    expect(facade.completedTours()).toEqual(['generator']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WelcomeModalComponent } from './welcome-modal.component';
import { OnboardingFacade } from '../../services/onboarding.facade';
import { TourService } from '../../services/tour.service';
import { LayoutService } from '../../../../services/layout.service';
import { HELP_ES } from '../../i18n/help.es';
import { HELP_CA } from '../../i18n/help.ca';

describe('WelcomeModalComponent', () => {
  let fixture: ComponentFixture<WelcomeModalComponent>;
  let onboarding: any;
  let tours: any;
  let language: ReturnType<typeof signal<'castellano' | 'catalan'>>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent || '';
  const button = (label: string) =>
    Array.from(el().querySelectorAll('button')).find((b) => b.textContent?.trim() === label)!;

  beforeEach(async () => {
    onboarding = {
      welcomeVisible: signal(true),
      later: vi.fn(),
      dismissWelcome: vi.fn(),
    };
    tours = { start: vi.fn(async () => undefined) };
    language = signal<'castellano' | 'catalan'>('castellano');
    await TestBed.configureTestingModule({
      imports: [WelcomeModalComponent],
      providers: [
        { provide: OnboardingFacade, useValue: onboarding },
        { provide: TourService, useValue: tours },
        { provide: LayoutService, useValue: { language } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WelcomeModalComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('da la bienvenida y pone el foco en «Empezar la visita»', () => {
    expect(el().querySelector('[role="dialog"]')).not.toBeNull();
    expect(text()).toContain(HELP_ES.welcome.title);
    expect(document.activeElement).toBe(button(HELP_ES.welcome.start));
  });

  it('cambia el idioma de toda la interfaz desde la bienvenida', () => {
    button('Català').click();
    fixture.detectChanges();
    expect(language()).toBe('catalan');
    expect(text()).toContain(HELP_CA.welcome.title);
    expect(button('Català').getAttribute('aria-pressed')).toBe('true');

    button('Castellano').click();
    fixture.detectChanges();
    expect(language()).toBe('castellano');
    expect(text()).toContain(HELP_ES.welcome.title);
  });

  it('«Empezar la visita» la cierra y lanza la visita del menú', () => {
    button(HELP_ES.welcome.start).click();
    expect(onboarding.dismissWelcome).toHaveBeenCalled();
    expect(tours.start).toHaveBeenCalledWith('intro');
  });

  it('«Más tarde» y Esc la posponen; «No volver a mostrar» la descarta', () => {
    button(HELP_ES.welcome.later).click();
    el()
      .querySelector('[role="dialog"]')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onboarding.later).toHaveBeenCalledTimes(2);

    button(HELP_ES.welcome.never).click();
    expect(onboarding.dismissWelcome).toHaveBeenCalled();
    expect(tours.start).not.toHaveBeenCalled();
  });

  it('no muestra nada si no toca', () => {
    onboarding.welcomeVisible.set(false);
    fixture.detectChanges();
    expect(el().querySelector('[role="dialog"]')).toBeNull();
  });
});

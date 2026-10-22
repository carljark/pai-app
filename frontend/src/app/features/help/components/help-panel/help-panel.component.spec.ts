import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HelpPanelComponent } from './help-panel.component';
import { OnboardingFacade } from '../../services/onboarding.facade';
import { TourService } from '../../services/tour.service';
import { LayoutService } from '../../../../services/layout.service';
import { HELP_ES } from '../../i18n/help.es';
import { HELP_CA } from '../../i18n/help.ca';

describe('HelpPanelComponent', () => {
  let fixture: ComponentFixture<HelpPanelComponent>;
  let onboarding: any;
  let tours: any;
  let layout: any;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent || '';
  const tourItems = () => Array.from(el().querySelectorAll('.help-panel__tour'));

  beforeEach(async () => {
    onboarding = { helpOpen: signal(true), completedTours: signal(['intro']) };
    tours = { start: vi.fn(async () => undefined) };
    layout = { language: signal('castellano'), switchView: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [HelpPanelComponent],
      providers: [
        { provide: OnboardingFacade, useValue: onboarding },
        { provide: TourService, useValue: tours },
        { provide: LayoutService, useValue: layout },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HelpPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('lista las cuatro visitas, marca las hechas y pone el foco en el panel', () => {
    expect(tourItems()).toHaveLength(4);
    expect(tourItems()[0]!.classList).toContain('help-panel__tour--completed');
    expect(tourItems()[1]!.classList).not.toContain('help-panel__tour--completed');
    expect(text()).toContain(HELP_ES.tours.taller.title);
    expect(document.activeElement?.classList).toContain('help-panel__close');
  });

  it('lanza la visita elegida', () => {
    (tourItems()[2]!.querySelector('button') as HTMLButtonElement).click();
    expect(tours.start).toHaveBeenCalledWith('taller');
  });

  it('muestra las preguntas frecuentes en el idioma de la interfaz', () => {
    expect(el().querySelectorAll('.help-panel__faq')).toHaveLength(HELP_ES.faq.length);
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(text()).toContain(HELP_CA.faq[0]!.question);
    expect(text()).toContain(HELP_CA.panel.toursTitle);
  });

  it('«Escríbenos» cierra el panel y abre Sugerencias', () => {
    (el().querySelector('.help-panel__contact-button') as HTMLButtonElement).click();
    expect(onboarding.helpOpen()).toBe(false);
    expect(layout.switchView).toHaveBeenCalledWith('feedback');
  });

  it('se cierra con la X, con el fondo y con Esc', () => {
    (el().querySelector('.help-panel__close') as HTMLButtonElement).click();
    expect(onboarding.helpOpen()).toBe(false);

    onboarding.helpOpen.set(true);
    fixture.detectChanges();
    (el().querySelector('.help-panel__backdrop') as HTMLButtonElement).click();
    expect(onboarding.helpOpen()).toBe(false);

    onboarding.helpOpen.set(true);
    fixture.detectChanges();
    el()
      .querySelector('.help-panel__drawer')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onboarding.helpOpen()).toBe(false);
    fixture.detectChanges();
    expect(el().querySelector('.help-panel')).toBeNull();
  });
});

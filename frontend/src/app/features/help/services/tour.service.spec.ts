import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TOUR_DRIVER, TourService, anchorSelector } from './tour.service';
import { LayoutService } from '../../../services/layout.service';
import { TelemetryService } from '../../../services/telemetry.service';
import { OnboardingFacade } from './onboarding.facade';
import { ExampleProjectService } from './example-project.service';
import { TOURS } from '../tours/tours';
import { HELP_ES } from '../i18n/help.es';
import { HELP_CA } from '../i18n/help.ca';

describe('TourService', () => {
  let service: TourService;
  let layout: any;
  let telemetry: any;
  let onboarding: any;
  let example: any;
  let config: any;
  let fakeDriver: any;

  const addAnchors = (...anchors: string[]) =>
    anchors.forEach((anchor) => {
      const el = document.createElement('div');
      el.setAttribute('data-tour', anchor);
      el.className = 'tour-test-anchor';
      document.body.appendChild(el);
    });

  const addAllAnchors = (id: keyof typeof TOURS) =>
    addAnchors(...TOURS[id].steps.flatMap((s) => (s.anchor ? [s.anchor] : [])));

  /** Lanza la visita avanzando los renders que espera `afterNextRender`. */
  const run = async (id: Parameters<TourService['start']>[0]) => {
    const done = service.start(id);
    for (let i = 0; i < 5; i++) {
      await Promise.resolve();
      TestBed.tick();
    }
    await done;
  };

  const endTour = (lastStep: boolean, index = 0) => {
    fakeDriver.isLastStep.mockReturnValue(lastStep);
    fakeDriver.getActiveIndex.mockReturnValue(index);
    config.onDestroyStarted(undefined, {}, { driver: fakeDriver });
  };

  beforeEach(() => {
    fakeDriver = {
      drive: vi.fn(),
      destroy: vi.fn(),
      isLastStep: vi.fn(),
      getActiveIndex: vi.fn(),
    };
    layout = {
      currentView: signal('home'),
      switchView: vi.fn((view: string) => layout.currentView.set(view)),
      isSidebarCollapsed: signal(true),
      language: signal('castellano'),
    };
    telemetry = { logEvent: vi.fn(() => of({ ok: true })) };
    onboarding = { helpOpen: signal(true), markCompleted: vi.fn() };
    example = { open: vi.fn(async () => true) };
    TestBed.configureTestingModule({
      providers: [
        { provide: LayoutService, useValue: layout },
        { provide: TelemetryService, useValue: telemetry },
        { provide: OnboardingFacade, useValue: onboarding },
        { provide: ExampleProjectService, useValue: example },
        {
          provide: TOUR_DRIVER,
          useValue: (c: any) => {
            config = c;
            return fakeDriver;
          },
        },
      ],
    });
    service = TestBed.inject(TourService);
  });

  afterEach(() => {
    document.querySelectorAll('.tour-test-anchor').forEach((el) => el.remove());
  });

  it('va a la pantalla, cierra la ayuda y resalta los pasos con sus textos', async () => {
    addAnchors(...TOURS.generator.steps.map((s) => s.anchor!));
    await run('generator');

    expect(layout.switchView).toHaveBeenCalledWith('generator');
    expect(onboarding.helpOpen()).toBe(false);
    expect(fakeDriver.drive).toHaveBeenCalled();
    expect(config.steps).toHaveLength(6);
    expect(config.steps[0].popover.title).toBe(HELP_ES.tours.generator.steps[0]!.title);
    expect(config.steps[0].element).toBe(document.querySelector(anchorSelector('generator-level')));
    expect(config.nextBtnText).toBe(HELP_ES.nav.next);
    expect(config.showProgress).toBe(true);
    expect(telemetry.logEvent).toHaveBeenCalledWith('TOUR_STARTED', undefined, {
      tour: 'generator',
    });
  });

  it('omite los pasos cuyo elemento no está en pantalla y usa el idioma de la interfaz', async () => {
    layout.language.set('catalan');
    layout.currentView.set('mapa');
    addAnchors('mapa-tabs', 'mapa-vista');
    await run('mapa');

    expect(layout.switchView).not.toHaveBeenCalled();
    expect(config.steps.map((s: any) => s.popover.title)).toEqual([
      HELP_CA.tours.mapa.steps[0]!.title,
      HELP_CA.tours.mapa.steps[1]!.title,
    ]);
  }, 5000);

  it('la visita del menú despliega la barra lateral', async () => {
    addAllAnchors('intro');
    await run('intro');
    expect(layout.isSidebarCollapsed()).toBe(false);
    expect(config.steps).toHaveLength(7);
  });

  it('la visita del taller abre el proyecto de ejemplo e incluye el paso final sin elemento', async () => {
    await run('taller');
    expect(example.open).toHaveBeenCalled();
    expect(config.steps).toHaveLength(1);
    expect(config.steps[0].element).toBeUndefined();
    expect(config.showProgress).toBe(false);
  });

  it('no empieza si no se puede abrir el proyecto de ejemplo', async () => {
    example.open.mockResolvedValue(false);
    await run('taller');
    expect(fakeDriver.drive).not.toHaveBeenCalled();
  });

  it('espera a que aparezcan los elementos que llegan más tarde', async () => {
    addAnchors('mapa-tabs');
    setTimeout(() => addAllAnchors('mapa'), 150);
    const started = Date.now();
    await run('mapa');
    expect(config.steps).toHaveLength(5);
    expect(Date.now() - started).toBeLessThan(1500);
  });

  it('si no aparece ningún elemento, no empieza', async () => {
    await run('generator');
    expect(fakeDriver.drive).not.toHaveBeenCalled();
  }, 5000);

  it('terminar en el último paso la marca como completada', async () => {
    addAllAnchors('mapa');
    await run('mapa');
    endTour(true, 4);
    expect(onboarding.markCompleted).toHaveBeenCalledWith('mapa');
    expect(telemetry.logEvent).toHaveBeenCalledWith('TOUR_COMPLETED', undefined, { tour: 'mapa' });
    expect(fakeDriver.destroy).toHaveBeenCalled();
  });

  it('cerrar antes del final cuenta como abandonada, con el paso', async () => {
    addAllAnchors('mapa');
    await run('mapa');
    endTour(false, 1);
    expect(onboarding.markCompleted).not.toHaveBeenCalled();
    expect(telemetry.logEvent).toHaveBeenCalledWith('TOUR_ABANDONED', undefined, {
      tour: 'mapa',
      step: 2,
    });
    fakeDriver.getActiveIndex.mockReturnValue(undefined);
    config.onDestroyStarted(undefined, {}, { driver: fakeDriver });
    expect(telemetry.logEvent).toHaveBeenLastCalledWith('TOUR_ABANDONED', undefined, {
      tour: 'mapa',
      step: 1,
    });
  });

  it('empezar otra visita cierra la que estaba en marcha', async () => {
    addAllAnchors('mapa');
    await run('mapa');
    await run('mapa');
    expect(fakeDriver.destroy).toHaveBeenCalledTimes(1);
  });
});

describe('TOUR_DRIVER', () => {
  it('usa driver.js por defecto', async () => {
    const { driver } = await import('driver.js');
    expect(TestBed.inject(TOUR_DRIVER)).toBe(driver);
  });
});

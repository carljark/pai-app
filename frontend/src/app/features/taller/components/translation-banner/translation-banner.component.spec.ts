import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslationBannerComponent } from './translation-banner.component';
import { ProjectTranslationFacade } from '../../../projects/services/project-translation.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';

const view = (overrides: object = {}) => ({
  text: 'Texto',
  language: 'castellano',
  isTranslation: false,
  stale: false,
  missingTranslation: false,
  ...overrides,
});

describe('TranslationBannerComponent', () => {
  let fixture: ComponentFixture<TranslationBannerComponent>;
  let translation: any;
  let language: ReturnType<typeof signal<string>>;
  let currentUser: ReturnType<typeof signal<any>>;
  let blocked: ReturnType<typeof signal<boolean>>;

  const text = () => (fixture.nativeElement as HTMLElement).textContent || '';
  const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;

  beforeEach(async () => {
    language = signal('castellano');
    currentUser = signal<any>({ role: 'teacher', canUseAi: true });
    blocked = signal(false);
    translation = {
      view: signal<any>(null),
      isTranslating: signal(false),
      translationError: signal(false),
      showCurrentProject: vi.fn(),
      translateCurrentProject: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [TranslationBannerComponent],
      providers: [
        { provide: ProjectTranslationFacade, useValue: translation },
        { provide: LayoutService, useValue: { language } },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
        { provide: AuthFacade, useValue: { currentUser } },
        { provide: EditLockFacade, useValue: { blocked } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TranslationBannerComponent);
    fixture.detectChanges();
  });

  it('no muestra nada sin proyecto ni cuando el original está en el idioma de la interfaz', () => {
    expect(text().trim()).toBe('');
    translation.view.set(view());
    fixture.detectChanges();
    expect(text().trim()).toBe('');
  });

  it('ofrece traducir cuando falta la traducción y lanza la traducción al pulsar', () => {
    translation.view.set(view({ missingTranslation: true }));
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.translationMissing);
    button()!.click();
    expect(translation.translateCurrentProject).toHaveBeenCalledTimes(1);
  });

  it('oculta el botón a usuarios sin acceso a la IA', () => {
    currentUser.set({ role: 'teacher', canUseAi: false });
    translation.view.set(view({ missingTranslation: true }));
    fixture.detectChanges();
    expect(button()).toBeNull();

    currentUser.set({ role: 'admin', canUseAi: false });
    fixture.detectChanges();
    expect(button()).not.toBeNull();

    currentUser.set(null);
    fixture.detectChanges();
    expect(button()).toBeNull();
  });

  it('oculta el botón si otra persona edita o el proyecto es de solo lectura', () => {
    translation.view.set(view({ missingTranslation: true }));
    fixture.detectChanges();
    expect(button()).not.toBeNull();

    blocked.set(true);
    fixture.detectChanges();
    expect(button()).toBeNull();
  });

  it('avisa de traducción desactualizada y permite volver a traducir', () => {
    translation.view.set(view({ isTranslation: true, stale: true }));
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.translationStale);
    button()!.click();
    expect(translation.translateCurrentProject).toHaveBeenCalled();

    currentUser.set({ role: 'teacher', canUseAi: false });
    fixture.detectChanges();
    expect(button()).toBeNull();
  });

  it('indica que se está viendo la traducción', () => {
    translation.view.set(view({ isTranslation: true }));
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.translationShowing);
    expect(button()).toBeNull();
  });

  it('muestra el progreso y el error de la traducción', () => {
    translation.view.set(view({ missingTranslation: true }));
    translation.isTranslating.set(true);
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.translationInProgress);
    expect(button()).toBeNull();

    translation.isTranslating.set(false);
    translation.translationError.set(true);
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.translationError);
  });

  it('muestra la versión del nuevo idioma solo cuando cambia el idioma', async () => {
    await fixture.whenStable();
    expect(translation.showCurrentProject).not.toHaveBeenCalled();

    language.set('catalan');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(translation.showCurrentProject).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    await fixture.whenStable();
    expect(translation.showCurrentProject).toHaveBeenCalledTimes(1);
  });
});

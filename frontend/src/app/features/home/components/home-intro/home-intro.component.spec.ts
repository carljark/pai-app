import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomeIntroComponent } from './home-intro.component';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

describe('HomeIntroComponent', () => {
  let fixture: ComponentFixture<HomeIntroComponent>;
  const t = signal<typeof TRANSLATIONS_ES>(TRANSLATIONS_ES);

  const texts = (selector: string) =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll(selector)).map((el) =>
      el.textContent?.trim(),
    );

  beforeEach(async () => {
    t.set(TRANSLATIONS_ES);
    await TestBed.configureTestingModule({
      imports: [HomeIntroComponent],
      providers: [{ provide: TranslationService, useValue: { t } }],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeIntroComponent);
    fixture.detectChanges();
  });

  it('muestra los tres pasos numerados en orden', () => {
    expect(texts('.home-intro__node')).toEqual(['1', '2', '3']);
    expect(texts('.home-intro__step-title')).toEqual([
      TRANSLATIONS_ES.homeStep1Title,
      TRANSLATIONS_ES.homeStep2Title,
      TRANSLATIONS_ES.homeStep3Title,
    ]);
    expect(texts('.home-intro__step-text')[1]).toBe(TRANSLATIONS_ES.homeStep2Text);
  });

  it('muestra las tres ventajas con su icono y la nota sobre la IA', () => {
    expect(texts('.home-intro__feature-title')).toEqual([
      TRANSLATIONS_ES.homeFeature1Title,
      TRANSLATIONS_ES.homeFeature2Title,
      TRANSLATIONS_ES.homeFeature3Title,
    ]);
    const icons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.home-intro__feature-icon',
    );
    expect(icons.length).toBe(3);
    expect(icons[1].querySelectorAll('path').length).toBe(4);
    expect(texts('.home-intro__ai-note')[0]).toContain(TRANSLATIONS_ES.homeAiTitle);
  });

  it('cambia todos los textos al catalán', () => {
    t.set(TRANSLATIONS_CA);
    fixture.detectChanges();
    expect(texts('.home-intro__title')).toEqual([TRANSLATIONS_CA.homeStepsTitle]);
    expect(texts('.home-intro__step-title')[0]).toBe(TRANSLATIONS_CA.homeStep1Title);
    expect(texts('.home-intro__feature-text')[2]).toBe(TRANSLATIONS_CA.homeFeature3Text);
    expect(texts('.home-intro__ai-note')[0]).toContain(TRANSLATIONS_CA.homeAiText);
  });
});

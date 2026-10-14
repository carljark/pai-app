import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { HomeCreditsComponent } from './home-credits.component';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

describe('HomeCreditsComponent', () => {
  let fixture: ComponentFixture<HomeCreditsComponent>;
  const t = signal<typeof TRANSLATIONS_ES>(TRANSLATIONS_ES);

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    t.set(TRANSLATIONS_ES);
    await TestBed.configureTestingModule({
      imports: [HomeCreditsComponent],
      providers: [{ provide: TranslationService, useValue: { t } }],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeCreditsComponent);
    fixture.detectChanges();
  });

  it('muestra el logo de las universidades y el texto del proyecto', () => {
    const img = el().querySelector<HTMLImageElement>('.home-credits__logos');
    expect(img?.getAttribute('src')).toBe('logo-universidades.png');
    expect(img?.alt).toBe(TRANSLATIONS_ES.homeCreditsLogoAlt);
    expect(el().querySelector('.home-credits__text')?.textContent?.trim()).toBe(
      TRANSLATIONS_ES.homeCreditsText,
    );
  });

  it('cambia los textos al catalán', () => {
    t.set(TRANSLATIONS_CA);
    fixture.detectChanges();
    expect(el().querySelector<HTMLImageElement>('.home-credits__logos')?.alt).toBe(
      TRANSLATIONS_CA.homeCreditsLogoAlt,
    );
    expect(el().querySelector('.home-credits__text')?.textContent?.trim()).toBe(
      TRANSLATIONS_CA.homeCreditsText,
    );
  });
});

import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { HelpTextsService } from './help-texts.service';
import { LayoutService } from '../../../services/layout.service';
import { HELP_ES } from '../i18n/help.es';
import { HELP_CA } from '../i18n/help.ca';

describe('HelpTextsService', () => {
  it('sigue el idioma de la interfaz', () => {
    const language = signal<'castellano' | 'catalan'>('castellano');
    TestBed.configureTestingModule({
      providers: [{ provide: LayoutService, useValue: { language } }],
    });
    const service = TestBed.inject(HelpTextsService);
    expect(service.t()).toBe(HELP_ES);
    language.set('catalan');
    expect(service.t()).toBe(HELP_CA);
  });
});

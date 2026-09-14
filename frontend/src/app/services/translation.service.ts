import { Injectable, computed, inject } from '@angular/core';
import { LayoutService } from './layout.service';
import { TRANSLATIONS_CA } from './translations.ca';
import { TRANSLATIONS_ES } from './translations.es';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  layout = inject(LayoutService);

  t = computed(() => {
    return this.layout.language() === 'catalan' ? TRANSLATIONS_CA : TRANSLATIONS_ES;
  });
}

import { Injectable, computed, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { HELP_CA } from '../i18n/help.ca';
import { HELP_ES } from '../i18n/help.es';

/** Textos de la ayuda y las visitas en el idioma de la interfaz. */
@Injectable({ providedIn: 'root' })
export class HelpTextsService {
  private layout = inject(LayoutService);

  t = computed(() => (this.layout.language() === 'catalan' ? HELP_CA : HELP_ES));
}

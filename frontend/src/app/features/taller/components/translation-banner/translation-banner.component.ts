import { Component, computed, effect, inject, untracked } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { ProjectTranslationFacade } from '../../../projects/services/project-translation.facade';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';

/**
 * Aviso del taller cuando el proyecto no está en el idioma de la interfaz: ofrece traducirlo,
 * indica si se está viendo una traducción y si esta ha quedado desactualizada.
 */
@Component({
  selector: 'app-translation-banner',
  standalone: true,
  templateUrl: './translation-banner.component.html',
  styleUrl: './translation-banner.component.scss',
})
export class TranslationBannerComponent {
  translation = inject(ProjectTranslationFacade);
  trans = inject(TranslationService);
  private layout = inject(LayoutService);
  private auth = inject(AuthFacade);
  private lastLanguage = this.layout.language();

  private editLock = inject(EditLockFacade);

  /** Traducir usa la IA y cambia el proyecto: mismos permisos y turno que el asistente. */
  canTranslate = computed(() => {
    const user = this.auth.currentUser();
    return Boolean(user?.canUseAi || user?.role === 'admin') && !this.editLock.blocked();
  });

  constructor() {
    // Al cambiar el idioma con el taller abierto se muestra la versión de ese idioma
    effect(() => {
      const language = this.layout.language();
      untracked(() => {
        if (language === this.lastLanguage) return;
        this.lastLanguage = language;
        this.translation.showCurrentProject();
      });
    });
  }
}

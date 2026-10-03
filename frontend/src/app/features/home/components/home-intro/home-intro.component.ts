import { Component, computed, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';

interface HomeStep {
  title: string;
  text: string;
}

interface HomeFeature extends HomeStep {
  /** Trazos del icono (rutas SVG de 24×24). */
  paths: string[];
}

/** Iconos de trazo (24×24): enlace = cruce curricular, diana = retos, check = evaluación. */
const FEATURE_ICONS = {
  link: [
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  ],
  target: ['M12 2a10 10 0 1 0 10 10', 'M12 6a6 6 0 1 0 6 6', 'M12 10a2 2 0 1 0 2 2', 'M22 2 12 12'],
  check: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
};

/**
 * Presentación breve de la home: cómo funciona (3 pasos conectados, la metáfora de unir módulos),
 * qué ofrece en tres líneas y el recordatorio de que la IA propone y el docente decide.
 */
@Component({
  selector: 'app-home-intro',
  standalone: true,
  templateUrl: './home-intro.component.html',
  styleUrl: './home-intro.component.scss',
})
export class HomeIntroComponent {
  t = inject(TranslationService).t;

  steps = computed<HomeStep[]>(() => {
    const t = this.t();
    return [
      { title: t.homeStep1Title, text: t.homeStep1Text },
      { title: t.homeStep2Title, text: t.homeStep2Text },
      { title: t.homeStep3Title, text: t.homeStep3Text },
    ];
  });

  features = computed<HomeFeature[]>(() => {
    const t = this.t();
    return [
      { title: t.homeFeature1Title, text: t.homeFeature1Text, paths: FEATURE_ICONS.link },
      { title: t.homeFeature2Title, text: t.homeFeature2Text, paths: FEATURE_ICONS.target },
      { title: t.homeFeature3Title, text: t.homeFeature3Text, paths: FEATURE_ICONS.check },
    ];
  });
}

import { describe, it, expect } from 'vitest';
import { TOURS } from './tours';
import { TOUR_IDS } from './tour.model';
import { HELP_ES } from '../i18n/help.es';
import { HELP_CA } from '../i18n/help.ca';
import sidebar from '../../../layout/components/sidebar/sidebar.component.html' with {
  loader: 'text',
};
import generator from '../../generator/components/generator-view/generator-view.component.html' with {
  loader: 'text',
};
import selector from '../../curriculum/components/curriculum-selector/curriculum-selector.component.html' with {
  loader: 'text',
};
import taller from '../../taller/components/taller-view/taller-view.component.html' with {
  loader: 'text',
};
import banner from '../../taller/components/edit-lock-banner/edit-lock-banner.component.html' with {
  loader: 'text',
};
import mapa from '../../mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html' with {
  loader: 'text',
};
import tabs from '../../mapa-intermodular/components/ui/tabs/tabs.component.html' with {
  loader: 'text',
};
import vista from '../../mapa-intermodular/components/ui/vista-toggle/vista-toggle.component.html' with {
  loader: 'text',
};

/** Plantillas en las que están las anclas `data-tour` de las visitas. */
const TEMPLATES = [sidebar, generator, selector, taller, banner, mapa, tabs, vista];

const anchorsInTemplates = (): Set<string> =>
  new Set(
    TEMPLATES.flatMap((html) => [...html.matchAll(/data-tour="([^"]+)"/g)].map((m) => m[1]!)),
  );

describe('Integridad de las visitas guiadas', () => {
  it('cada elemento que señala una visita existe en las plantillas', () => {
    const found = anchorsInTemplates();
    const missing = TOUR_IDS.flatMap((id) => TOURS[id].steps.map((s) => s.anchor))
      .filter((anchor): anchor is string => anchor !== null)
      .filter((anchor) => !found.has(anchor));
    expect(missing).toEqual([]);
  });

  it('cada visita tiene un texto por paso en castellano y en catalán', () => {
    for (const id of TOUR_IDS) {
      expect(HELP_ES.tours[id].steps).toHaveLength(TOURS[id].steps.length);
      expect(HELP_CA.tours[id].steps).toHaveLength(TOURS[id].steps.length);
    }
    expect(HELP_CA.faq).toHaveLength(HELP_ES.faq.length);
  });

  it('los textos catalanes no repiten los castellanos', () => {
    for (const id of TOUR_IDS) {
      HELP_ES.tours[id].steps.forEach((step, i) => {
        expect(HELP_CA.tours[id].steps[i]!.text).not.toBe(step.text);
      });
    }
  });
});

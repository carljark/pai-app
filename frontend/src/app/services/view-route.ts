export type AppView =
  | 'home'
  | 'generator'
  | 'history'
  | 'taller'
  | 'admin'
  | 'mapa'
  | 'personal'
  | 'feedback'
  | 'solicitudes'
  | 'oauth-consent';

export const APP_VIEWS: readonly AppView[] = [
  'home',
  'generator',
  'history',
  'taller',
  'admin',
  'mapa',
  'personal',
  'feedback',
  'solicitudes',
  'oauth-consent',
];

/** Pantallas de un solo uso: no se recuerdan como última vista al volver a abrir la aplicación. */
export const TRANSIENT_VIEWS: readonly AppView[] = ['oauth-consent'];

/**
 * Pantalla reflejada en la URL; en el taller incluye el proyecto abierto y, en el consentimiento
 * OAuth, la petición de autorización.
 */
export interface ViewRoute {
  view: AppView;
  project?: string;
  request?: string;
}

const isAppView = (value: string | null): value is AppView => APP_VIEWS.includes(value as AppView);

/**
 * Lee la pantalla de la URL (`?view=taller&project=<id>`, `?view=oauth-consent&request=<id>`).
 * Los enlaces antiguos `?project=<id>` (abrir en otra pestaña) llevan al taller.
 * Devuelve `null` si la URL no indica ninguna pantalla.
 */
export function parseViewRoute(search: string): ViewRoute | null {
  const params = new URLSearchParams(search);
  const view = params.get('view');
  const project = params.get('project');
  const request = params.get('request');
  if (view === 'oauth-consent') return request ? { view, request } : { view };
  if (isAppView(view)) return view === 'taller' && project ? { view, project } : { view };
  return project ? { view: 'taller', project } : null;
}

export function buildViewUrl(route: ViewRoute, pathname: string): string {
  const params = new URLSearchParams({ view: route.view });
  if (route.project) params.set('project', route.project);
  if (route.request) params.set('request', route.request);
  return `${pathname}?${params.toString()}`;
}

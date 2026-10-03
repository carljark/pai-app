# Tarea 178: Botones atrás/adelante del navegador

## Propósito
La aplicación cambiaba de pantalla con un signal (`LayoutService.switchView`) sin tocar la URL, y el router de Angular no tenía rutas. Por eso la flecha "atrás" del navegador sacaba de la aplicación en lugar de volver a la pantalla anterior; por ejemplo, del Taller al Archivo.

## Arquitectura y flujo
Se usa la API de historial del navegador sin migrar al router de Angular (opción elegida por el usuario):
- **URL de cada pantalla**: `?view=<vista>` y, en el taller, `?view=taller&project=<id>`.
- **`services/view-route.ts`** (nuevo, funciones puras):
  - `AppView` y `APP_VIEWS`;
  - `parseViewRoute(search)`: los enlaces antiguos `?project=<id>` llevan al taller; las vistas desconocidas se ignoran;
  - `buildViewUrl(route, pathname)`.
- **`LayoutService`**:
  - al arrancar, la URL manda sobre la vista guardada en `localStorage` (enlaces y recargas) y la entrada actual se normaliza con `replaceState`;
  - `switchView(view, project?)` hace `pushState`, sin duplicar si la URL ya es la misma;
  - escucha `popstate` (atrás/adelante): aplica la vista de la entrada y publica el proyecto en `requestedProject`.
- **`AppFacade`**:
  - `viewPastProject(project, pushHistory = true)` llama a `switchView('taller', project._id)`;
  - el efecto `initRequestedProjectEffect` abre el proyecto pedido por la URL o el historial en cuanto está en el historial de proyectos, sin añadir otra entrada y sin recargarlo si ya está abierto (no se pierden cambios en curso);
  - sustituye la lógica anterior de `pendingProjectId`;
  - `openProjectInNewWindow` usa el nuevo formato de URL.

## Archivos modificados
- Nuevos: `frontend/src/app/services/view-route.ts` (+ spec).
- `frontend/src/app/services/layout.service.ts` (+ spec), `frontend/src/app/app.facade.ts` (+ spec).

## Decisiones técnicas
- **API de historial frente a router de Angular**: cambio acotado, sin reescribir las vistas en `router-outlet` ni configurar el nginx de producción para rutas profundas, porque la URL siempre es la raíz con parámetros.
- Las URLs usan los nombres internos de las vistas (`history`, `taller`…) para no depender del idioma de la interfaz.
- Ventajas añadidas: al recargar se conserva la pantalla y el proyecto, y el enlace del taller se puede compartir.

## Verificación
- Prueba real con Playwright en local:
  - Inicio → Archivo → Taller, y atrás/adelante en ambos sentidos;
  - recarga en el taller, que conserva el proyecto;
  - cambio entre dos proyectos, donde atrás restaura el primero.
- `ngc`, `tsc` de specs y ESLint sin errores.
- Pendiente (usuario): `cd frontend && npm test`.

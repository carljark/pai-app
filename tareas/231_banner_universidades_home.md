# Tarea 231: banner de universidades en la página principal

## Propósito

Mostrar al pie de la página principal los logotipos de las universidades del Máster Interuniversitario en Tecnología Educativa (URV, UIB, UdL y UM) y el aviso de que Plappin forma parte de un proyecto de investigación del máster y está en fase beta.

## Arquitectura y flujo

- Nuevo componente standalone `HomeCreditsComponent` (`app-home-credits`), insertado al final de `HomeDashboardComponent`, tras los proyectos recientes. Se separa en su propio componente para no hacer crecer el dashboard, que ya ronda las 200 líneas (AGENTS.md §4).
- La imagen procede del archivo «LOGO UNIVERSIDADES» de Drive (PNG 1319×153 con transparencia) y se sirve como recurso estático desde `frontend/public/logo-universidades.png`.
- El texto y el `alt` de la imagen se traducen con `TranslationService` (claves `homeCreditsText` y `homeCreditsLogoAlt`), con paridad ES/CA.

## Archivos modificados

- `frontend/public/logo-universidades.png` (nuevo).
- `frontend/src/app/features/home/components/home-credits/` (componente, plantilla, estilos BEM y spec, nuevos).
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.{ts,html}`: importa y coloca el banner.
- `frontend/src/app/services/translations.{es,ca}.ts`: nuevas claves.

## Decisiones técnicas

- La imagen declara `width`/`height` intrínsecos y `loading="lazy"` para evitar saltos de maquetación; con `width: 100%` y `max-width` se adapta a móvil.
- Estilos con las variables de `_variables.scss` (superficie, borde y texto atenuado), sin colores nuevos.

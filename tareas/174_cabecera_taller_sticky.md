# Tarea 174: Cabecera "Taller de Proyectos" siempre visible

## Propósito
Al abrir un proyecto desde el archivo (historial), la fila con el título "Taller de Proyectos" y los botones de acción (exportar, guardar, etc.) desaparecía al desplazarse por el documento. Debe verse siempre.

## Arquitectura y flujo
- La página hace scroll en la ventana (la barra lateral ya es `position: sticky; top: 0`) y ningún contenedor entre `app-main` y el taller define `overflow`, así que basta con `position: sticky`.
- Se añade el modificador BEM `.app-header--sticky` en `frontend/src/styles/_layout.scss`:
  - `position: sticky; top: 0`;
  - fondo `$color-background`, para que el contenido no se vea por detrás;
  - `padding-block: $spacing-2`;
  - `z-index: 50`, por debajo del menú lateral (100) y del panel IA móvil (1000).
- La cabecera del taller (`taller-view.component.html`) usa `class="app-header app-header--sticky"`.

## Archivos modificados
1. `frontend/src/styles/_layout.scss`: modificador `app-header--sticky`.
2. `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`: clase aplicada a la cabecera.

## Decisiones técnicas
- Modificador en lugar de cambiar `.app-header`, porque esa clase global la usan otras vistas (generador, etc.) y no se quiere cambiar su comportamiento.
- Solo CSS: no afecta a tests ni a la cobertura.

## Verificación
- ESLint y Prettier correctos.
- Pendiente (usuario): abrir un proyecto largo desde el archivo y comprobar que la cabecera queda fija al hacer scroll, en escritorio y en móvil.

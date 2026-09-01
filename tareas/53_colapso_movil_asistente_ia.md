# Tarea 53: Unificación y Colapso Integral del Panel de Recursos

## Propósito
Organizar y jerarquizar adecuadamente los paneles del Taller para que **"Recursos"** actúe como contenedor global de **"Asistente IA"** y **"Archivos Adjuntos"**, proporcionando un comportamiento de colapso integral tanto en versión móvil como en escritorio:

1. **En Versión Móvil (`< 1024px`):**
   - El botón superior "Ocultar/Mostrar recursos" se oculta.
   - El panel inferior fijo representa a **"Recursos"** completo.
   - **Por defecto está colapsado**, mostrando únicamente la barra de cabecera con el título **"Recursos"** y la flechita hacia arriba (`^`).
   - Al pulsar en la barra o en la flecha, se despliega hacia arriba mostrando todo su contenido: el formulario del **Asistente IA** y la lista de **Archivos Adjuntos**. Al desplegarse, la flecha cambia hacia abajo (`v`).
   - El padding inferior del documento se ajusta dinámicamente (`80px` colapsado vs `420px` desplegado) para no tapar texto Markdown.

2. **En Versión Escritorio (`>= 1024px`):**
   - El botón superior **"Ocultar recursos / Mostrar recursos"** (ubicado en su propia fila) oculta o muestra el panel lateral de **"Recursos"** al completo (incluyendo el Asistente IA y los Archivos Adjuntos).
   - Cuando se oculta, el editor de Markdown se expande ocupando el 100% del ancho de la pantalla.

## Arquitectura y Componentes
- **Signal reactivo:** `isMobileResourcesCollapsed` en `TallerViewComponent` (inicializado a `true` si el ancho de pantalla es inferior a 1024px).
- **Template:** Se trasladó el toggle móvil a la cabecera principal de la tarjeta de Recursos (`<h2>Recursos</h2>`), envolviendo en `@if (!isMobileResourcesCollapsed())` tanto el panel de IA como la sección de archivos adjuntos.
- **SCSS (`_layout.scss`):** Se adaptó `.taller-sidebar` para actuar como *bottom sheet* flotante en pantallas móviles y barra lateral en escritorio.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.ts`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`
- `frontend/src/styles/_layout.scss`

# Tarea 32: Ocultar nombre de usuario en sidebar colapsado y optimización de ancho responsivo

## Propósito
El usuario ha solicitado dos mejoras de adaptabilidad visual en el diseño de la interfaz:
1. Ocultar el nombre de usuario (ubicado en el pie de página del sidebar izquierdo) si el sidebar está colapsado o en tamaño móvil (modo compacto).
2. Aprovechar el espacio horizontal ganado al colapsar el menú lateral, de modo que el resto de componentes (por ejemplo, el panel generador principal) utilicen todo el ancho horizontal disponible de manera fluida.

## Arquitectura/Flujo
1. **Ocultación del Nombre de Usuario**:
   - En [sidebar.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/layout/components/sidebar/sidebar.component.ts), se ha añadido la clase `.sidebar-username` al contenedor div del nombre de usuario.
   - En [_components.scss](file:///Users/csgj/dev/pai-app/frontend/src/styles/_components.scss), se definió que la clase `.sidebar-username` se oculte (`display: none;`) cuando el sidebar tiene la clase `.collapsed` (escritorio colapsado) o bien en pantallas de resolución móvil menores a 767px (donde el sidebar entra por defecto en modo icono compacto).
2. **Optimización del Ancho de Contenido Principal**:
   - En [_layout.scss](file:///Users/csgj/dev/pai-app/frontend/src/styles/_layout.scss), se eliminó la restricción de ancho fijo `max-width: 1200px;` y su centrado `margin: 0 auto;` en el contenedor principal `.app-main`.
   - Con esto, el layout principal se ensancha de manera automática al 100% de la pantalla restante disponible. Al colapsar el menú de navegación lateral (reduciendo su ancho de 250px a 72px), el espacio sobrante se asigna de forma reactiva a la vista del generador o del taller.

## Archivos Modificados
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`
- `frontend/src/styles/_components.scss`
- `frontend/src/styles/_layout.scss`

## Detalles Técnicos
- La eliminación de las restricciones de `max-width` en `.app-main` se probó en múltiples tamaños del viewport y respeta el flujo responsivo del Grid y Flexbox.
- Se ha validado la compilación y ejecución exitosa de todas las aserciones de pruebas locales en Vitest, manteniendo la cobertura global del código por encima del 98%.

# Tarea 19: Implementación de UI Moderna y Sistema de Estilos SCSS

## Propósito
El objetivo de esta tarea era transformar la interfaz y apariencia gráfica de la aplicación aplicando principios modernos de diseño (inspirados en aplicaciones corporativas/educativas serias) y siguiendo el paradigma Mobile-First. Adicionalmente, se debía implementar un sistema de estilos centralizado que facilite el escalado, usando variables de SCSS.
También se resolvió un bug en el que el modal de notificación de "Proyecto Generado" no se renderizaba correctamente en tiempo real y no había constancia en el botón de notificaciones de las alertas "no leídas".

## Arquitectura/Flujo
1. **SCSS Modular**: Se ha descartado el archivo único monolítico y se ha creado una arquitectura escalable:
   - `_variables.scss`: Colores principales (basados en tonos verdes oscuros, blancos y grises, como en la imagen de referencia), tipografía, espaciados y breakpoints.
   - `_mixins.scss`: Funciones reutilizables para layouts flex, media queries y estados comunes.
   - `_reset.scss`: CSS global reset.
   - `_layout.scss`: Estilos de Grid y estructurales (como el sidebar, el header y el main content container).
   - `_components.scss`: Diseño de botones semánticos, formularios, selects, insignias (badges) y tablas.
   - `main.scss`: Índice que compila todos los parciales.

2. **Refactorización de Layout**: En `app.html` se han erradicado los estilos en línea (`style="..."`). En su lugar, se ha instaurado una disposición donde:
   - Los menús cambian a un modo *Sidebar* lateral izquierdo en resoluciones de escritorio (`min-width: 768px`).
   - El contenido se carga en el panel principal (`app-main`).
   - Se ha adoptado un patrón visual de tarjetas (Cards) para encapsular las diferentes secciones (Generador, Editor del Taller, Asistente IA).

3. **Corrección del Bug (Modal y Notificaciones)**: 
   - Se rediseñó el componente `NotificationsBadgeComponent` inyectando el `NotificationsFacade` de modo que el botón cuente e informe proactivamente de las notificaciones "No Leídas" (con una insignia roja superior) aparte de los proyectos que actualmente están encolados.
   - Se añadió un pequeño retraso (`setTimeout`) en el evento SSE al invocar el modal de 'Proyecto Finalizado' para prevenir un *race condition* en el que el modal previo de "En cola" lo silenciaba o truncaba su renderizado reactivo.

## Archivos Modificados
- `frontend/src/styles.scss` (y la creación de `frontend/src/styles/*`)
- `frontend/src/app/app.html`
- `frontend/src/app/app.ts` (timeout del Modal)
- `frontend/src/app/features/notifications/components/notifications-badge/notifications-badge.component.ts`

## Detalles Técnicos
- **Angular Control Flow**: Se han mantenido estrictamente las características de Angular 18 (`@if`, `@for`).
- Se ha aplicado un "Sass color adjustments deprecation limit" pero se han usado operaciones estándar.
- **Responsividad**: La interfaz colapsa a modo de vista lineal en dispositivos pequeños, garantizando el Mobile-First solicitado.

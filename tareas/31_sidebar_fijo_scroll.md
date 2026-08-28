# Tarea 31: Menú lateral (Sidebar) fijo al hacer scroll

## Propósito
El usuario ha solicitado que el menú lateral izquierdo (sidebar) permanezca fijo en la pantalla y no se desplace hacia arriba ni desaparezca cuando se realiza scroll vertical hacia abajo en la aplicación.

## Arquitectura/Flujo
1. **Posicionamiento Sticky**:
   - En lugar de recurrir a un posicionamiento absoluto/fijo (`position: fixed`) que rompería el flujo flexbox del contenedor principal (`.app-layout`) y desplazaría la sección de contenido principal (`.app-main`), se ha optado por un comportamiento de adhesión controlado mediante `position: sticky`.
   - Se ha configurado el selector `.app-sidebar` en el archivo de estilos [_layout.scss](file:///Users/csgj/dev/pai-app/frontend/src/styles/_layout.scss) para tener:
     ```scss
     position: sticky;
     top: 0;
     height: 100vh;
     ```
   - Esto ancla el componente lateral de navegación al límite superior del viewport de la ventana, forzándolo a ocupar el 100% de la altura de pantalla y manteniéndolo visible continuamente durante el scroll de la página de forma nativa e integrada en el flujo.

## Archivos Modificados
- `frontend/src/styles/_layout.scss`

## Detalles Técnicos
- El comportamiento `sticky` respeta el ancho de reserva asignado dinámicamente al sidebar tanto en su estado expandido (250px) como colapsado (72px), garantizando que no se solape con el contenedor `.app-main`.
- La compilación del SCSS y las pruebas unitarias pasaron satisfactoriamente sin regresiones.

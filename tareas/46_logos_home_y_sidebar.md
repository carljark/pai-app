# Tarea 46: Incorporación de imágenes tipográficas y logo en Home y Sidebar

## Propósito
El usuario solicitó que en la cabecera (hero) de la pantalla inicial se mostrase la palabra "Plappin" (extraída del archivo provisto `Palabra plappin.jpeg`) junto al logo gráfico. Además, se pidió añadir el logo gráfico solitario en la parte superior del menú lateral (sidebar).

## Arquitectura/Flujo
1. **Procesamiento de imagen adicional:**
   - Se ha tomado el archivo `Palabra plappin.jpeg` y procesado vía Python (usando la librería Pillow) de manera similar a como se hizo con el logo gráfico. Se le eliminó el fondo blanco transformándolo a un PNG transparente llamado `word-transparent.png`.
   - Este nuevo asset se colocó en la carpeta pública del frontend (`frontend/public/`).

2. **Modificación del Componente HomeDashboardComponent:**
   - **HTML**: Se creó un contenedor flexbox (`.home-hero__logo-container`) para agrupar las dos imágenes de manera alineada horizontalmente.
   - **Orden**: Primero se inyectó la imagen de la palabra ("Plappin") y seguidamente el logo a su derecha.
   - **CSS**: Se han adaptado los tamaños relativos para que guarden proporción. A la palabra se le ha asignado una altura (`height`) de `64px` y al logo de `96px`.

3. **Modificación del Componente SidebarComponent:**
   - En el archivo `frontend/src/app/layout/components/sidebar/sidebar.component.ts` se modificó la cabecera del menú lateral.
   - Se introdujo un condicional visual `@if / @else` atado al estado del sidebar (`layout.isSidebarCollapsed()`).
   - Cuando el panel está expandido, se muestra el logo a la izquierda con tamaño estándar (`36px`), alineado con el botón de colapsar a su derecha.
   - Cuando el panel está colapsado, el logo reduce su tamaño (`24px`) para encajar en la versión miniatura de la barra lateral.

## Archivos Modificados
- `frontend/public/word-transparent.png` (Archivo nuevo).
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`: Inserción del logotipo tipográfico e imagen gráfica.
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`: Adición del logo en la zona superior, controlado por el estado responsivo del panel.

## Detalles Técnicos
La inyección de los logos directamente en el HTML de la barra lateral aprovechando el Signal `layout.isSidebarCollapsed()` permite renderizar de manera reactiva y con transiciones CSS fluidas el cambio de tamaño del icono superior, lo que mantiene el Look & Feel de una SPA moderna. Las imágenes se sirven directo desde el `/` público al compilarse mediante Angular / Docker.

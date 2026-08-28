# Tarea 39: Posicionamiento del asistente IA en el lateral derecho (Sticky) y fijo abajo en móviles

## Propósito
El usuario ha solicitado mejorar la visualización del panel de asistencia de IA en el Editor de Proyectos (Taller) para optimizar el uso del espacio de pantalla:
1. En pantallas de escritorio: Colocar el asistente de IA a la derecha del editor de texto del proyecto, fijándolo verticalmente como sticky al hacer scroll.
2. En pantallas móviles: Visualizarlo en el extremo inferior de forma fija, garantizando que el usuario pueda interactuar con él sin importar su posición de scroll.

## Arquitectura/Flujo
1. **Definición de Clases Responsivas**:
   - En [_layout.scss](file:///Users/csgj/dev/pai-app/frontend/src/styles/_layout.scss), se crearon e integraron las clases de rejilla:
     - `.taller-layout`: Aplica `flex-direction: column` por defecto y conmuta a `flex-direction: row` a partir de `1024px` de resolución. También aplica un `padding-bottom: 320px` en móvil para evitar que el panel de IA fijo tape el final del proyecto.
     - `.taller-content`: Ocupa el 66.6% del espacio (proporción flex 2).
     - `.taller-sidebar`: Ocupa el 33.3% del espacio (proporción flex 1).
2. **Estilo del Asistente de IA (`.ai-assistant-panel`)**:
   - **Escritorio (`min-width: 1024px`)**: Se le otorga `position: sticky; top: 20px; align-self: start;` de modo que acompaña al usuario al deslizarse por proyectos largos.
   - **Móvil/Tablet (`max-width: 1023px`)**: Se reconfigura a `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;`. Se le añade un borde superior leve y esquinas redondeadas en la cabecera, junto con un color de fondo sólido para que se sobreponga limpiamente sobre el texto del proyecto que corre por debajo.
3. **Maquetación del Componente**:
   - Se removieron los estilos flex y media-queries en línea no estándar de [taller-view.component.html](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.html) y se enlazaron las clases declaradas.
   - Se asignó la clase `ai-assistant-panel` tanto al contenedor del asistente activo como al panel de error/aviso en caso de que la IA esté desactivada.

## Archivos Modificados
- `frontend/src/styles/_layout.scss`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`

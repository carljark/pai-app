# Tarea 50: Reparación de Renderizado de Markdown en el Taller

## Propósito
El usuario reportó que "ahora no se ve el contenido del proyecto seleccionado en el markdown". Tras inspeccionar las ramas del código, se comprobó que el flujo de obtención de datos desde el Historial hasta el Taller funcionaba correctamente y que el objeto `project.generatedContent.rawText` llegaba bien.

El problema era de renderizado CSS. En una tarea anterior orientada a dar más espacio horizontal al editor colapsando el asistente lateral, se había inyectado el estilo `width: max-content;` sobre el contenedor principal del componente de Markdown (`ngx-markdown`).

En combinación con los estilos globales de Flexbox de esa capa padre y la propiedad `overflow-x: auto`, el cálculo del tamaño `max-content` dentro de bloques que hacen un ajuste de línea interno o *word wrap* estaba forzando el contenedor a achicarse u ocultarse en determinadas pantallas o motores de renderizado.

## Arquitectura/Flujo
- Se ha eliminado la instrucción de ancho forzado `width: max-content; max-width: 100%;` en el nodo intermedio de `taller-view.component.html`.
- Se ha delegado en el motor Flex del padre el cálculo fluido del ancho `min-width: 0;` (que previene flex-blowout) para que el markdown retome su tamaño natural al 100% de la ventana, solucionando la invisibilidad del texto.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`

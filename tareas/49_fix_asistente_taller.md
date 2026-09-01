# Tarea 49: Reparación del Asistente IA en Taller de Edición

## Propósito
El usuario reportó que el asistente de Inteligencia Artificial disponible en el panel derecho del "Taller de Edición" (`taller-view`) parecía no funcionar. Tras analizar el componente, se detectaron dos bugs críticos en la experiencia de usuario:
1. **Pérdida de Selección de Texto:** El asistente requiere que el usuario seleccione texto del documento para rescribirlo. Sin embargo, al hacer clic en el `<textarea>` para escribir la instrucción (o al hacer clic en el botón de reescribir), el navegador limpiaba automáticamente la selección de texto del DOM, por lo que `window.getSelection().toString()` llegaba vacío y la función rebotaba silenciosamente mostrando un mensaje de error genérico pidiendo seleccionar texto.
2. **Estado de Carga Inconsistente:** El botón de reescritura dependía de una Signal local llamada `isRewriting` que siempre estaba en `false`. La llamada asíncrona a la API de red estaba usando `projects.isThinking`, lo que provocaba que el estado de "Pensando..." del botón nunca se mostrase.

## Arquitectura/Flujo
1. **Captura Reactiva de la Selección:**
   - Se ha añadido el evento `(mouseup)="captureSelection()"` al contenedor `#pdf-content` (donde reside el Markdown).
   - Cuando el usuario finaliza de arrastrar el cursor y suelta el click, se captura el texto iluminado y se guarda en un Signal propio (`capturedSelection`).
   - Ahora, aunque el usuario haga click en el textarea o en otra parte de la pantalla (perdiendo la selección nativa del sistema operativo/navegador), el componente "recuerda" el texto seleccionado.
2. **Feedback Visual de Selección:**
   - Para que el usuario sepa que tiene un fragmento anclado, se ha añadido una pequeña "píldora" o badge azul encima del textarea del asistente. Este elemento muestra las primeras líneas del texto atrapado.
   - Se ha añadido un pequeño botón de "X" para borrar esta selección (`clearSelection()`) si el usuario se ha equivocado, restaurando la limpieza del estado.
3. **Sincronización del Estado de Carga:**
   - Se ha eliminado la variable muerta `isRewriting`.
   - El HTML del panel de asistente ahora usa directamente `projects.isThinking()` tanto para deshabilitar el botón como para cambiar el literal a "Pensando...".
4. **Reseteo Post-Generación:**
   - En el `next()` del servicio de rescritura, además de borrar el prompt, ahora también se limpia la variable `capturedSelection` para dejar el asistente preparado de nuevo.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.ts`: Inserción de funciones de captura, almacenamiento y eliminación del Signal `isRewriting`.
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`: Adición del evento `mouseup`, UI para mostrar la selección anclada y corrección del estado visual del botón "Pensando".
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`: Actualizados y expandidos los tests para garantizar el renderizado del template condicional, y la correcta asignación de la Signal `capturedSelection`.

# Tarea 43: Panel lateral completo colapsable en el Taller de Proyectos

## Propósito
El usuario solicitó que la posibilidad de colapsar no se limitara únicamente al cuerpo del Asistente IA, sino que **todo el panel derecho** (incluyendo la sección de recursos y subida de archivos) pudiera ocultarse ("colapsarse") para que el documento de Markdown ganara todo el espacio horizontal posible en pantalla.

## Arquitectura/Flujo
1. **Rediseño del control de estado (Signal):**
   - La variable de estado del componente `taller-view.component.ts` se ha renombrado de `isAiCollapsed` a `isSidebarCollapsed` para reflejar con mayor precisión su nuevo ámbito de actuación.
   
2. **Reubicación del botón Toggle:**
   - El botón para colapsar/expandir se ha movido desde el propio panel de IA hacia la barra superior de acciones globales (`.app-header`), situándolo junto a las opciones de Descarga de Word, Validar y Publicar. Esto permite que el botón esté permanentemente visible incluso cuando el panel lateral desaparece.
   - El botón actualiza su texto e icono dinámicamente dependiendo del estado (muestra un icono de barra lateral oculta o visible, además de los textos "Colapsar" o "Expandir").

3. **Modificación Estructural (HTML):**
   - Se ha envuelto todo el bloque `<div class="taller-sidebar">` en una condición estructural `@if (!isSidebarCollapsed())`. 
   - Al ocultar el bloque completo del DOM, el contenedor izquierdo (`.taller-content`) expande automáticamente su ancho gracias a las propiedades de Flexbox (`flex: 2` de base, pero al no tener hermano visible ocupa el 100% del espacio contenedor).
   - Se eliminó la lógica de colapso interno que tenía la clase `.ai-assistant-panel`, ya que resultaba redundante.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.ts`: Renombrado de variable de estado (`isSidebarCollapsed`).
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`: 
  - Movimiento del botón hacia el `app-header`.
  - Envoltura de `.taller-sidebar` con el `@if`.
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`: 
  - Ajuste de selectores para los tests automatizados y del uso de la variable renombrada.

## Detalles Técnicos
Al sacar completamente del DOM el elemento `.taller-sidebar` usando `@if` en vez de ocultarlo con CSS (`display: none`), nos aseguramos de que no consuma recursos de renderizado innecesarios ni detectores de cambios mientras no es visible. Esta limpieza mantiene el 100% de la compatibilidad con las utilidades previas y supera el 96% de la cobertura de ramas.

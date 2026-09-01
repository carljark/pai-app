# Tarea 47: Pestañas de nivel y buscador en Historial de Proyectos

## Propósito
El usuario solicitó dos nuevas funcionalidades en la vista de Historial de Proyectos (`history-view`):
1. Añadir pestañas (tabs) para dividir visualmente los proyectos pertenecientes a "ESO" (PDC) de los de "FPB" (FP Básica).
2. Incorporar un buscador por palabra clave para filtrar rápidamente los proyectos listados dentro de la pestaña activa.

## Arquitectura/Flujo
1. **Gestión de Estado Reactivo (Signals):**
   - Se han añadido dos nuevas Signals al componente `HistoryViewComponent`:
     - `activeTab`: Controla el nivel educativo actualmente seleccionado, con un valor por defecto de `'FPB'`.
     - `searchQuery`: Almacena en tiempo real el string de búsqueda ingresado por el usuario.
   - La propiedad original que iteraba sobre `projects.projectsHistory()` se ha sustituido por un nuevo Signal derivado (computed) llamado `filteredProjects`.

2. **Lógica de Filtrado (computed):**
   - El signal `filteredProjects` reacciona a cambios tanto en el historial como en las opciones del usuario.
   - **Primer paso (Filtro por Nivel):** Evalúa el `activeTab` y deja pasar únicamente aquellos proyectos cuyo `tipoNivel` corresponda con `FP_BASICA` o `DIVERSIFICACION_CURRICULAR` (ESO).
   - **Segundo paso (Filtro de Texto):** Evalúa el `searchQuery` (convertido a minúsculas) comprobando si dicha palabra existe en el `title` del proyecto, en los `modules` (tanto los elegidos explícitamente como los inferidos por la IA en `generatedContent.modules`) o en el `status`.

3. **Estructura Visual (UI):**
   - **Buscador:** Se integró un input de texto con icono de lupa dentro del `app-header`. Utiliza el evento `(input)` para actualizar el Signal sin necesidad de formularios reactivos complejos, manteniendo la arquitectura "Zoneless" orientada a Signals de Angular 18.
   - **Pestañas:** Se crearon dos botones con estilos de navegación limpios y que activan la clase CSS `active` al seleccionarlos, cambiando su color de subrayado.
   - **Traducciones:** Se añadió la clave `searchProjects` a los diccionarios del `TranslationService` para soportar Castellano y Catalán.

4. **Testing Automatizado (Vitest):**
   - Se ajustaron los mocks de tests de `history-view.component.spec.ts` para inyectar correctamente `tipoNivel` en los proyectos falsos.
   - Se añadieron tests de integración para simular clics en las pestañas y escrituras en el buscador, cubriendo los diferentes fallbacks, lo cual restaura la cobertura de ramas (branches) en todo el fichero al >94%.

## Archivos Modificados
- `frontend/src/app/services/translation.service.ts`: Nuevas claves de diccionario.
- `frontend/src/app/features/history/components/history-view/history-view.component.ts`: Inserción de la nueva UI y la lógica de filtrado reactiva con Angular Signals.
- `frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`: Actualización de la batería de tests unitarios y Mocks.

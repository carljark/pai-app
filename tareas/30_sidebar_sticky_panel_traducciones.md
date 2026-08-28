# Tarea 30: Menú lateral traducido, panel de acordeón sticky y localización del generador

## Propósito
El usuario ha solicitado las siguientes mejoras en la UX del generador y en la internacionalización de la plataforma:
1. Hacer que el panel izquierdo de acordeones de selección curricular en la vista de generación sea `sticky` o `fixed`, de modo que no se mueva hacia arriba ni desaparezca al hacer scroll vertical.
2. Traducir al catalán las etiquetas "Nivel Educativo" y "FP Básica" de la vista de generación.
3. Traducir al catalán todas las acciones y tooltips del menú lateral izquierdo (sidebar).

## Arquitectura/Flujo
1. **Panel Izquierdo Sticky**:
   - En [curriculum-selector.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts), se ha actualizado el estilo en línea del contenedor izquierdo de acordeones agregándole `position: sticky; top: 20px; align-self: start;`. Esto permite que flote de manera fluida al hacer scroll vertical dentro de la tarjeta de generación.
2. **Localización de la Vista de Generación**:
   - Se añadió la clave de traducción `generatorLevelLabel` en [translation.service.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/services/translation.service.ts) tanto en catalán ("Nivell Educatiu") como en castellano ("Nivel Educativo").
   - Se actualizó [generator-view.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/generator/components/generator-view/generator-view.component.ts) para renderizar dinámicamente la etiqueta de nivel con `trans.t().generatorLevelLabel` y la pestaña de FP Básica con `trans.t().courseLevelFP`.
3. **Localización del Sidebar**:
   - Se crearon múltiples claves de traducción en el servicio de traducción correspondientes a las opciones de navegación del menú lateral (`sidebarExpand`, `sidebarCollapse`, `sidebarHome`, `sidebarNewProject`, `sidebarHistory`, `sidebarTaller`, `sidebarAdmin`, `sidebarLangTooltip`, `sidebarLangLabel`, `sidebarLogoutTooltip`).
   - Se actualizó [sidebar.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/layout/components/sidebar/sidebar.component.ts) vinculando de forma reactiva las directivas de atributos `[attr.data-tooltip]` y los textos de navegación a los valores dinámicos proporcionados por `trans.t()`.
   - Se adecuó el mock de traducciones del componente de pruebas unitarias (`sidebar.component.spec.ts`) para evitar fallos de cobertura.

## Archivos Modificados
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`
- `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts`
- `frontend/src/app/services/translation.service.ts`

## Detalles Técnicos
- El comportamiento `sticky` se limitó con `align-self: start` dentro del contenedor Flex/Grid para asegurar que no desborde el contenedor padre al scrollear a pie de página.
- El uso de `[attr.data-tooltip]` solucionó la inyección de atributos no estándares en JSDOM durante las pruebas de integración en Vitest.
- Se comprobó mediante la suite completa de pruebas unitarias locales que la cobertura global y por archivo cumple holgadamente con los límites requeridos (>90%).

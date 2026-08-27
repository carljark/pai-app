# 22. Refactorización del Monolito (app.ts y app.html)

## Propósito
Cumplir con las directivas establecidas en `.agents/rules/02_refactor_y_limites.md`, desgranando los archivos `app.ts` (que excedía las 500 líneas) y `app.html` (más de 300 líneas) para que ningún archivo supere el límite estricto de 200 líneas de código y las funciones se mantengan por debajo de 25 líneas.

## Arquitectura / Flujo
El monolito original actuaba como contenedor de todas las vistas, lógica de estado global (navegación y responsive layout), traducciones y dependencias. Se ha aplicado un patrón *Feature-Sliced Design* aislando componentes de layout y vistas específicas:
- **Gestión de Layout:** El menú lateral y el estado responsive han sido extraídos a un `SidebarComponent` y a un `LayoutService`.
- **Traducciones:** Todo el diccionario y lógica multilingüe han pasado al `TranslationService`.
- **Enrutamiento/Vistas (SwitchView):** Se ha delegado a componentes Standalone independientes: `GeneratorViewComponent`, `HistoryViewComponent`, `TallerViewComponent` (este último también extrayendo su propio HTML).
- **Lógica Centralizada:** Lo que restaba de lógica estructural pesada se ha llevado a un `AppFacade`.

## Archivos Modificados / Creados
- `frontend/src/app/app.ts` (Reducido de 521 a 53 líneas)
- `frontend/src/app/app.html` (Reducido de 314 a 49 líneas)
- `frontend/src/app/app.facade.ts` (Nuevo - 126 líneas)
- `frontend/src/app/services/layout.service.ts` (Nuevo - 34 líneas)
- `frontend/src/app/services/translation.service.ts` (Nuevo - 121 líneas)
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts` (Nuevo - 84 líneas)
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts` (Nuevo - 48 líneas)
- `frontend/src/app/features/history/components/history-view/history-view.component.ts` (Nuevo - 49 líneas)
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.ts` (Nuevo - 174 líneas)
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html` (Nuevo - 134 líneas)

## Detalles Técnicos
- Se ha respetado escrupulosamente el uso de **Angular 18 Signals** (`signal`, `computed`, `effect`, `input`, `output`) para toda la reactividad de estados (vistas activas, colapso del menú lateral y selección de idiomas).
- Los métodos que sobrepasaban las 25 líneas fueron divididos en flujos funcionales atómicos.
- Se ha verificado que la aplicación compila correctamente (`npm run build`) después de la reestructuración completa.

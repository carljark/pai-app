# Tarea 221: carrito de selección arrastrable

## Propósito

El panel flotante «Selección actual» del generador (`app-curriculum-selector`) estaba fijo abajo a la derecha, con 420 px de ancho, y tapaba el texto de los RA/CE mientras el docente los leía. Se valoraron dos alternativas (barra fija en el pie con modal y botón de carrito en la cabecera); finalmente se mantiene flotante, pero el docente puede moverlo a donde no estorbe, además de contraerlo como antes.

## Comportamiento

- La cabecera del carrito (con un asa `⠿` y cursor de mover) es el asa de arrastre. Un clic sin desplazamiento sigue contrayendo o desplegando el carrito; si el gesto supera 5 px se trata como arrastre y el clic posterior no lo pliega.
- El panel se ancla abajo a la derecha (`right`/`bottom`): al desplegarse crece hacia arriba, como antes, y nunca sale de la ventana (también al redimensionarla).
- La posición se guarda en `localStorage` (`plappin.floatingCartPosition`) y se restaura en la siguiente visita. Si el almacenamiento no está disponible o el valor está corrupto, se usa la posición por defecto del CSS.
- Funciona con ratón y pantalla táctil (Pointer Events y `touch-action: none` en la cabecera).

## Arquitectura

- **`DraggablePanelDirective`** (`features/curriculum/directives/draggable-panel.directive.ts`), reutilizable: `appDraggablePanel="<selector del asa>"`, `storageKey` opcional y `exportAs: 'draggablePanel'`. Escucha `pointerdown` en el host y, solo durante el arrastre, `pointermove`/`pointerup` en `document`; los retira al soltar y en `ngOnDestroy`. Modifica directamente el estilo del host, por lo que no necesita detección de cambios (compatible zoneless). La posición guardada se aplica en `afterNextRender`, cuando el panel ya tiene tamaño.
- **`CurriculumSelectorComponent`**: aplica la directiva al `.floating-cart` y sustituye el conmutador inline por `toggleCart(drag)`, que ignora el clic que cierra un arrastre (`drag.wasDragged()`).
- Traducción nueva `dragToMoveTooltip` (ES/CA) como `title` de la cabecera.

## Archivos

- `frontend/src/app/features/curriculum/directives/draggable-panel.directive.ts` (+ spec)
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.{ts,html,scss,spec.ts}`
- `frontend/src/app/services/translations.{es,ca}.ts`

## Decisiones

- Directiva propia en lugar de `@angular/cdk/drag-drop`: el proyecto no usa CDK y el caso (mover un único panel fijo) cabe en ~100 líneas sin dependencias nuevas.
- Anclaje inferior derecho en vez de `left`/`top`: evita que al desplegar el carrito su cuerpo quede fuera de la ventana.
- `localStorage` solo como comodidad por usuario y navegador; no hace falta persistirlo en el backend.

## Verificación

- Frontend: lint, typecheck y `npm test` (865 tests, umbrales de cobertura cumplidos).
- Backend: `npm test` 423/423. En una primera ejecución falló de forma intermitente `admin.test.ts` (DELETE del propio admin devolvió 401 en vez de 400); no se reprodujo en tres ejecuciones aisladas ni en dos completas posteriores y no está relacionado con este cambio.

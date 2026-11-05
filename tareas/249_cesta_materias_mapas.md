# Tarea 249: Cesta de materias y módulos en los mapas (ESO y FP)

> **Plan:** [249 — Cesta de materias y módulos en los mapas (ESO y FP)](../planes/249_plan_cesta_de_materias_mapas.md)

## Propósito

Desde los mapas solo se podía crear un proyecto con **una** ficha de afinidad (ESO) o **una** conexión o RA (FP). Los docentes necesitan reunir, después de ver el mapa, varias materias o módulos en un único proyecto. Se añade una **cesta** en todos los mapas, de la ESO y de los ciclos de FP:

- **Vista clásica:** «Añadir a la cesta» junto a cada «Crear Proyecto…».
- **Mapa mental:** las bolas de materia o módulo se arrastran a la cesta, con un «PLAPP» grave al soltarlas.
- **Panel:** muestra el contenido de la cesta y crea el proyecto.

Las materias o módulos arrastrados aportan **lo que tienen en común** con el resto de la cesta, como pidió el usuario al revisar el plan.

## Arquitectura y flujo

Solo frontend, sin backend, datos ni migraciones. El detalle está en `documentation/cesta_mapas.md`.

1. **Estado** (`CestaService`): un signal con una cesta por pestaña del mapa, copiada en `sessionStorage`. Cada cesta tiene tres partes:
   - `unidades` arrastradas;
   - `extras` añadidos con botón;
   - `excluidas` quitadas a mano.
2. **Composición** (`CestaFacade`, de la pestaña activa): los grupos mostrados son `extras ∪ comunes − excluidas`. Los «comunes» se calculan con el mapa cargado:
   - **ESO** (`comunesEso`): fichas con ≥ 2 materias en la cesta, alguna arrastrada; entran los criterios de las materias que están en la cesta.
   - **FP** (`comunesFp`): conexiones entre dos módulos de la cesta, alguno arrastrado; entran los RA de origen y de destino.
3. **Crear proyecto:** en la ESO, `AfinidadProyectoService.crearDesdeCriterios` (criterios por materia → CE y criterios parciales del generador). En la FP, `MapaProyectoService.crearDesdeReferencias` (RA → descripciones del currículum). Los dos métodos salen de refactorizar el flujo existente de «Crear Proyecto», que ahora los usa.
4. **Arrastre:** `app-mindmap-canvas` recibe `[dropTarget]` (la `CestaDropService`) y emite `(unitDrop)`.
   - `attachZoom` enlaza primero `d3-drag`, que detiene el gesto con `stopImmediatePropagation`, y filtra d3-zoom sobre las bolas arrastrables.
   - El arrastre informa de la bola fantasma al destino y, al soltar, comprueba el rectángulo del botón de la cesta.
   - Las vistas llaman a `cesta.meterUnidad`, que añade la unidad, cuenta la bola recibida (la cesta anima) y reproduce el sonido.

## Archivos modificados

**Nuevos**
1. `frontend/src/app/features/mapa-intermodular/models/cesta.model.ts`: `CestaEstado`, `GrupoCesta` y `ClavesPorUnidad`.
2. `.../utils/cesta.ts`, `cesta-eso.ts` y `cesta-fp.ts`: operaciones puras y cálculo de lo que hay en común en la ESO y en la FP.
3. `.../utils/mindmap-drag.ts`: `attachDrag` (d3-drag), `subjectFor`, `dragUnit`, `nodeIdOf` y `clientPoint`.
4. `.../services/cesta.service.ts`, `cesta.facade.ts`, `cesta-drop.service.ts` y `plapp-sound.service.ts`.
5. `.../components/ui/cesta/`: botón flotante, zona donde soltar y bola fantasma.
6. `.../components/ui/cesta-panel/`: contenido de la cesta, quitar, vaciar y crear.
7. `.../components/ui/cesta-boton/`: botón «Añadir a la cesta» / «En la cesta ✓», reutilizable.
8. Specs de todo lo anterior.
9. `documentation/cesta_mapas.md`.

**Modificados**
1. `.../components/ui/afinidad-card/*`, `connection-card/*` y `ra-detail/*`: botón de la cesta junto a «Crear Proyecto…»; los dos botones se separan con un `gap`.
2. `.../components/ui/_step-shared.scss`: variante `mapa-btn-action--secondary` y estado `:disabled`.
3. `.../components/mindmap/mindmap-canvas/*`: input `dropTarget`, output `unitDrop` y `data-node-id` en cada nodo. `zoomAroundCenter` y `outward` pasan a `mindmap-layout.ts` para que el componente siga por debajo de 200 líneas (195).
4. `.../utils/mindmap-zoom.ts`: parámetro `drag` en `attachZoom`, `zoomFilter` y helper `applyTransform`.
5. `.../components/mindmap/mindmap-view/*` y `afinidades-mindmap-view/*`: conectan el arrastre y el soltar; la indicación inicial menciona la cesta.
6. `.../components/mapa-intermodular-view/*`: monta `<app-cesta />` una sola vez para todas las pestañas y vistas.
7. `.../services/afinidad-proyecto.service.ts` y `mapa-proyecto.service.ts`: `crearDesdeCriterios` y `crearDesdeReferencias`.
8. `.../utils/afinidad-seleccion.ts`: extrae `seleccionDeCriterios` y exporta `criteriosDeMateria`.
9. `frontend/src/app/features/help/*`: paso «La cesta» / «La cistella» en la visita del mapa (ancla `mapa-cesta`) y tests de integridad.
10. Specs existentes: los selectores `.mapa-btn-action` pasan a `.mapa-btn-action--primary`, porque el primer botón de la tarjeta ahora es el de la cesta.
11. `frontend/package.json` y `package-lock.json`: `d3-drag` fijado en `3.0.0` y `@types/d3-drag` `^3.0.7`.
12. `documentation/mapa_afinidades_eso.md` y `mapa_mental_intermodular.md`: enlace a la cesta.

## Decisiones técnicas

- **Lo que hay en común se calcula y no se guarda:** al meter o quitar una materia, sus vínculos con las demás aparecen o desaparecen. Las quitadas a mano se guardan aparte, como `excluidas`, para que no vuelvan al recalcular.
- **Solo cuentan fichas o conexiones con alguna unidad arrastrada:** así «Añadir a la cesta» en una ficha añade exactamente esa ficha, como «Crear Proyecto con estos criterios», y no todas las de esas materias.
- **`d3-drag` y no drag and drop de HTML5:** la API nativa funciona mal con SVG y en pantallas táctiles, y d3-drag ya venía como dependencia transitiva. Se fija en la 3.0.0 porque la 3.0.1 apareció en npm el 3-11-2026, dos días antes de esta tarea.
- **Sonido sintetizado con Web Audio:** sin archivos ni licencias. Sin `AudioContext` no suena y no da error.
- **Un único `<app-cesta>` flotante:** está en `mapa-intermodular-view`, sirve a las dos vistas y es también la zona donde se sueltan las bolas, para no duplicarlo en cada lienzo.
- **`CestaBotonComponent` común:** evita repetir el botón en tres plantillas y mantiene `ra-detail` lejos de las 200 líneas.
- **Accesibilidad:** el arrastre no tiene equivalente de teclado. Los botones «Añadir a la cesta» (también en el panel lateral del mapa mental) son la alternativa. No se añadió un atajo de teclado sobre la bola.

## Verificación

Ejecutado en la sesión:

- `npx ng lint` (dentro de `npm test`): «All files pass linting».
- `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npm test`: 124 archivos y 1175 tests en verde (1 omitido, ya existente). «All coverage thresholds met». «Zoneless check passed».
  - En una ejecución anterior falló el umbral de funciones de `afinidades-mindmap-view.component.html`; se corrigió con un test del soltar.
  - También falló el test de la visita guiada, que esperaba 5 pasos; ahora toma el número de `TOURS`.
- `cd backend && npm test`: 41 archivos y 491 tests en verde.
- `npx ng build`: compila sin errores ni avisos.
- Los tests simulan gestos reales de ratón con d3-drag sobre el SVG en jsdom:
  - arrastrar y soltar dentro de la cesta;
  - soltar fuera;
  - clic sin movimiento;
  - arrastrar el fondo;
  - lienzo sin destino.

**No verificado:**

- No se probó a mano en el navegador: la herramienta de navegador (Playwright) no estaba conectada en la sesión.
- Quedan sin comprobar el timbre real del «PLAPP», la sensación del arrastre con ratón y en pantalla táctil, y el encaje visual del botón flotante sobre el mapa.

## Desviaciones respecto al plan

- Componentes: en lugar de `cesta-icono` hay `cesta` (botón flotante, zona donde soltar y bola fantasma), y se añadió `cesta-boton`.
- Servicios: el estado se reparte entre `CestaService` y `CestaFacade`, y la zona donde soltar va en `CestaDropService`.
- Grupos arrastrables: también se arrastran las bolas de materia o módulo **de destino** (nodos `group`), no solo las del primer anillo, porque representan igualmente una materia o un módulo.
- El orden de los grupos en el panel es: primero los arrastrados y después los añadidos con botón.
- La prueba manual en Docker prevista no se hizo (ver Verificación).

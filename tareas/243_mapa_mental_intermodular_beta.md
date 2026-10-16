# Tarea 243: Mapa mental intermodular (beta)

> **Plan:** [243 — Mapa mental intermodular (beta)](../planes/243_plan_mapa_mental_intermodular_beta.md)

## Propósito
Para recorrer la página del mapa intermodular de FP había que pasar por tres acordeones con listas: módulo → RA → conexiones. Esta tarea añade una vista alternativa más visual, el **mapa mental**: un lienzo SVG con nodos que se despliegan, zoom y arrastre, y un arco que une la conexión elegida con su módulo de destino.

Se publica para todos los usuarios con la etiqueta **«beta»**. Convive con la vista clásica, que sigue siendo la predeterminada, para recoger opiniones antes de decidir si la sustituye.

## Arquitectura y flujo
- **Selector de vista:** `MapaIntermodularViewComponent` muestra `app-mapa-vista-toggle` encima de la cabecera en las pestañas de FP; las de afinidades de la ESO no lo muestran. Según `MapaVistaService.vista()` pinta los acordeones o `app-mindmap-view`. La elección se guarda en `localStorage` (`pai_mapa_vista`) con `try/catch`.
- **`MindmapViewComponent`** provee su propio `MindmapState` (rama abierta y filtro de la leyenda) y deriva con `computed` la siguiente cadena:
  - `buildMindmapTree` construye el árbol visible a partir de los módulos de la fachada, la rama abierta y el idioma.
  - `layoutMindmap` lo convierte en un árbol radial (`d3-hierarchy`) con curvas (`d3-shape`).
  - `renderNodes` y `renderLinks` añaden el estado visual (apagado, atenuado o resaltado, según la búsqueda y el tipo de módulo de la cabecera y la leyenda) y los atributos SVG.
  - `connectionArc` calcula el arco de la conexión elegida.
- **`MindmapCanvasComponent`** pinta el SVG con `@for` y enlaza `d3-zoom` en `afterNextRender`. Cada cambio de zoom actualiza un signal con la transformación. Un `effect` centra la cámara en la rama abierta, con animación de `d3-transition`.
- **Al elegir una conexión,** `MindmapState` llama a `facade.selectRa()` y se abre `ConnectionDrawerComponent` con la ficha `ConnectionCardComponent`. «Crear proyecto» llega a `MapaProyectoService.crearDesdeConexion()`, el mismo flujo que la vista clásica: nivel y curso de la pestaña, RA de origen y de destino, y salto al generador.
- Sin cambios en el backend ni migraciones.

## Archivos modificados
1. `frontend/package.json`, `frontend/package-lock.json`: dependencias `d3-hierarchy`, `d3-shape`, `d3-zoom`, `d3-selection` y `d3-transition`, con sus `@types/*`.
2. `frontend/src/app/features/mapa-intermodular/models/mindmap.model.ts` (nuevo): tipos del árbol, posiciones, estado visual, trazos y rama abierta.
3. `.../utils/mindmap-tree.ts` (nuevo): árbol visible, agrupación de conexiones por módulo de destino y conexión elegida.
4. `.../utils/mindmap-layout.ts` (nuevo): árbol radial, curvas, arco de la conexión, encuadre y centrado, y partición de etiquetas en líneas.
5. `.../utils/mindmap-match.ts` (nuevo): estado visual de cada nodo (rama abierta, búsqueda y filtros).
6. `.../utils/mindmap-node-view.ts` y `.../utils/mindmap-render.ts` (nuevos): atributos SVG y clases BEM de cada nodo; nodos y trazos listos para pintar; nodo en el que centrar la cámara.
7. `.../utils/mindmap-zoom.ts` (nuevo): enlace de `d3-zoom` y `d3-transition` con el `<svg>`.
8. `.../utils/relation-labels.ts` (nuevo): nombres ES/CA y colores de los tipos de competencia. Antes los nombres estaban dentro de `ConnectionsListComponent`.
9. `.../services/mapa-vista.service.ts`, `.../services/mindmap.state.ts` y `.../services/mapa-proyecto.service.ts` (nuevos): vista elegida, estado del mapa mental y «Crear proyecto» compartido. Esta última lógica sale de `MapaIntermodularViewComponent`.
10. `.../components/mindmap/` (nuevo): `mindmap-view`, `mindmap-canvas`, `mindmap-controls` y `connection-drawer`, cada uno con su `.html` y `.scss` (BEM y variables de `_variables.scss`).
11. `.../components/ui/vista-toggle/` (nuevo): selector «Vista clásica / Mapa mental» con la insignia «beta».
12. `.../components/ui/connection-card/` (nuevo): ficha de una conexión extraída de `connections-list`, con sus estilos, para reutilizarla en las dos vistas.
13. `.../components/ui/connections-list/*`: usa `app-connection-card`; pierde el marcado, los estilos y `getRelationLabel` que se movieron a la ficha.
14. `.../components/mapa-intermodular-view/*`: selector de vista, alternancia entre acordeones y mapa mental, y delegación de «Crear proyecto» en `MapaProyectoService`.
15. `frontend/src/app/testing/mindmap.mock.ts` (nuevo): datos mínimos de dos módulos para las specs.
16. Specs nuevas junto a cada pieza, más dos tests nuevos en `mapa-intermodular-view.component.spec.ts`: alternancia de vistas y «Crear proyecto» desde el mapa mental.
17. `documentation/mapa_mental_intermodular.md` (nuevo): interacción, arquitectura, decisiones y pendientes.

## Decisiones técnicas
- **d3 solo calcula; Angular pinta.** d3 no manipula el DOM: la plantilla renderiza el SVG con signals. Así se mantienen la compatibilidad zoneless, el idioma reactivo y BEM, y los tests pueden pulsar nodos reales. Se usan los módulos sueltos de d3, no el paquete `d3` completo.
- **Alternativas descartadas** (ver el plan):
  - three.js: legibilidad, accesibilidad y tests.
  - d3 manipulando el DOM: queda fuera de Angular.
  - Librerías de grafos: peso, estilo y zone.js.
- **Una rama abierta por nivel y conexiones agrupadas por módulo de destino,** para que el árbol radial siga legible con RA de más de diez conexiones. Se comprobó con Laboratorio Clínico 2.º, donde `1373_RA5` tiene 12 conexiones en 6 grupos.
- **La etiqueta de la conexión es el texto del RA de destino**, no su título: muchos títulos de los datos son genéricos («Conexión curricular: 1373-5g ↔ …»). El título completo aparece en el panel.
- **La búsqueda y los filtros atenúan, no ocultan:** ocultar nodos movería las posiciones del resto del árbol.
- **El selector de vista va encima de la cabecera** y no dentro de ella. Así funciona igual con la cabecera plegada y no hace falta tocar `MapaHeaderComponent`.
- Los componentes quedan por debajo de 200 líneas entre lógica y plantilla, y las funciones por debajo de 25. Por eso existen `mindmap-controls`, `mindmap-node-view` y `MapaProyectoService`. Con este último, `mapa-intermodular-view` baja de 220 a 190 líneas.

## Verificación
- `npx eslint` sobre los archivos tocados: 0 hallazgos.
- `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npm test`: lint, 94 archivos de test, 993 tests en verde (1 omitido, ya existente) y umbrales de cobertura cumplidos. Todos los archivos nuevos tienen al menos un 93 % por métrica. `check-zoneless` también pasa.
- `cd backend && npm test`: 39 archivos y 461 tests en verde.
- `npx ng build`: compila. El bundle inicial transfiere unos 431 kB estimados.
- **Revisión visual:** no se pudo levantar el entorno Docker (el daemon no estaba arrancado) ni conectar el navegador de Playwright. En su lugar se generó un SVG con las mismas funciones de árbol, layout y render y los datos reales de `mapa_cfgs_laboratorio_clinico_2.json`, y se revisó como imagen. De esa revisión salieron los dos ajustes de etiquetas descritos arriba. La comprobación interactiva queda pendiente de hacerse en producción.
- **Despliegue** con `./scripts/deploy-prod.sh` (commit `22528f8`):
  - copia de seguridad previa `pai_db_20261016_152729.archive.gz`;
  - contenedores `pai_frontend_prod` y `pai_backend_prod` levantados y migraciones al día;
  - la API del mapa y el frontend responden 200;
  - el bundle servido (`main-HMNHZIOC.js`) incluye el mapa mental.

## Desviaciones respecto al plan
- **Filtro de la leyenda:** el plan hablaba de filtrar por tipo de competencia. Se implementó como leyenda pulsable en el propio mapa mental, y además se respetan la búsqueda y el filtro por tipo de módulo de la cabecera.
- **Selector de vista:** va encima de la cabecera en lugar de en un hueco `ng-content` dentro de ella.
- **Extracciones no previstas:**
  - `ConnectionCardComponent`, para no duplicar la ficha entre la vista clásica y el panel.
  - `MapaProyectoService`, porque `mapa-intermodular-view` ya pasaba de 200 líneas.
  - `mindmap-controls` y `mindmap-node-view`, para que el lienzo no pasara de 200 líneas.
- **Dependencias:** se añadió `d3-transition`, que `d3-zoom` ya instalaba como dependencia, para animar el centrado de la cámara.
- **Etiquetas:** las conexiones se etiquetan con el texto del RA de destino y no con su título.

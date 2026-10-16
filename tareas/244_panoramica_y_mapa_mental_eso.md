# Tarea 244: Vista panorámica de conexiones y mapa mental de la ESO (beta)

> **Plan:** [244 — Vista panorámica de conexiones y mapa mental de la ESO (beta)](../planes/244_plan_panoramica_y_mapa_mental_eso.md)

## Propósito
Amplía la beta del mapa de la tarea 243 en dos direcciones:
- **Panorámica de FP.** Una tercera vista del mapa de FP muestra a la vez todas las conexiones del curso, para ver qué módulos y RA están más conectados y saltar desde ahí al detalle.
- **Mapa mental de la ESO.** El mapa de afinidades de la ESO también se puede explorar como mapa mental: materias → materias afines → fichas.

## Arquitectura y flujo
**Selector de vista**
- `MapaVistaService` admite `panoramica`.
- `vistaEso()` sustituye la panorámica por el mapa mental en la ESO.
- `abrirEnMapaMental()` y `tomarRaPendiente()` permiten saltar de la panorámica al mapa mental con un RA abierto.
- `VistaToggleComponent` tiene la entrada `conPanoramica`, que es `false` en la ESO.

**Panorámica (FP)**
- `layoutPanorama()` hace todos los cálculos:
  - `cluster()` de `d3-hierarchy` sobre raíz → módulo → RA;
  - curvas con `lineRadial().curve(curveBundle.beta(0.85))` sobre `source.path(target)`;
  - arcos de módulo con `arc()` de `d3-shape`;
  - recuento de las conexiones sin destino en el curso.
- `renderEdges()` y `renderLeaves()` (`panorama-highlight.ts`) calculan, para cada curva y cada RA, el estado según el RA o módulo resaltado, la búsqueda y los filtros.
- Componentes:
  - `PanoramaViewComponent` guarda el resaltado y el filtro de la leyenda en signals y orquesta la vista;
  - `PanoramaCanvasComponent` pinta el SVG y reutiliza `attachZoom` y `MindmapControlsComponent`;
  - `PanoramaInfoComponent` es la ficha flotante.
- Al pulsar un RA se llama a `MapaVistaService.abrirEnMapaMental()`. Al crearse, `MindmapState` recoge ese RA en su efecto de arranque y lo abre.

**Mapa mental de la ESO**
- `buildAfinidadesTree()` construye el árbol materias → afines → fichas con los mismos tipos de nodo que FP: `module`, `group` y `connection`.
- `AfinidadesMindmapViewComponent` reutiliza:
  - el lienzo, el layout y el render de FP;
  - `MindmapState`, sin estrategia de selección;
  - el panel genérico `MindmapDrawerComponent`, con `app-afinidad-card`.
- `AfinidadesEsoViewComponent` alterna entre las fichas clásicas y el mapa mental. Los datos siguen cargándose en `AfinidadesEsoFacade`.

**Generalizaciones del mapa mental**
- Estrategia `MINDMAP_SELECTION` en `MindmapState`. La selección de la conexión pasa a calcularse en la vista de FP.
- `focusNodeId(tree)` recorre el árbol desplegado.
- El lienzo acepta varios arcos.
- `MindmapLegendComponent` es una leyenda compartida.
- `MindmapDrawerComponent` es el panel genérico; `ConnectionDrawerComponent` pasa a usarlo.
- Anillos adaptativos con `ringRadii()`.

No hay cambios en el backend, migraciones ni dependencias nuevas.

## Archivos modificados
1. `frontend/src/app/features/mapa-intermodular/services/mapa-vista.service.ts` (+ spec): vista `panoramica`, `vistaEso` y RA pendiente.
2. `.../services/mindmap.state.ts` (+ spec):
   - token `MINDMAP_SELECTION`;
   - arranque con el RA pendiente;
   - sin dependencia de los módulos de FP.
3. `.../models/panorama.model.ts` (nuevo): tipos de RA, curvas, arcos, resaltado y estados.
4. `.../utils/panorama-layout.ts`, `.../utils/panorama-highlight.ts` (nuevos, + specs): cálculo y resaltado de la panorámica.
5. `.../utils/afinidades-mindmap-tree.ts` (nuevo, + spec): árbol de la ESO, sigla de materia y ficha elegida.
6. `.../utils/mindmap-layout.ts` (+ spec): `ringRadii()`, que agranda cada anillo por separado (mínimo 84 px entre vecinos, hasta ×2,5).
7. `.../utils/mindmap-render.ts` (+ spec): `focusNodeId()` basado en el árbol.
8. `.../utils/relation-labels.ts`: `buildLegend()` y el tipo `LegendItem`.
9. `.../components/panorama/{panorama-view,panorama-canvas,panorama-info}/` (nuevos, + specs).
10. `.../components/afinidades-mindmap-view/` (nuevo, + spec).
11. `.../components/mindmap/mindmap-drawer/`, `.../components/mindmap/mindmap-legend/` (nuevos, + specs).
12. `.../components/mindmap/connection-drawer/*`: usa `mindmap-drawer` y conserva solo el bloque del RA de origen.
13. `.../components/mindmap/mindmap-view/*`:
    - provee `MINDMAP_SELECTION` y calcula la selección y los arcos;
    - usa la leyenda compartida.
14. `.../components/mindmap/mindmap-canvas/*`: entrada `arcs` (lista) en lugar de `arc`.
15. `.../components/ui/vista-toggle/*`: tercera opción «Panorámica» con insignia «beta» y entrada `conPanoramica`.
16. `.../components/afinidades-eso-view/*` (+ spec): alternancia con el mapa mental de la ESO.
17. `.../components/mapa-intermodular-view/*` (+ spec):
    - vista panorámica;
    - selector de vista también en la ESO;
    - test del salto de la panorámica al mapa mental.
18. `documentation/mapa_mental_intermodular.md`: secciones de panorámica, ESO y anillos adaptativos.

## Decisiones técnicas
- ***Hierarchical edge bundling* para la panorámica**, frente a un diagrama de cuerdas (pierde el detalle por RA), una matriz (poco visual) o un grafo de fuerzas (enmarañado con unas 350 aristas). Con datos reales de Laboratorio Clínico 2.º (44 RA y 348 conexiones) los haces se leen y el resaltado de un RA destaca claramente sobre el resto.
- **Ficha flotante en una esquina del lienzo** en vez de un tooltip junto al cursor: es más simple con zoom y arrastre y funciona en pantallas táctiles.
- **Doble toque en móvil:** el primero resalta y el segundo abre, porque sin `hover` no habría forma de ver las conexiones antes de saltar.
- **ESO con los mismos tipos de nodo que FP**, en lugar de un lienzo y un estado propios. Así se reutiliza todo y solo cambian el constructor del árbol y el contenido del panel.
- **Anillos adaptativos:** con 17 materias en 3.º de ESO el primer anillo se saturaba. Escalar todos los anillos por igual no sirve, porque el encuadre automático lo deshace; por eso cada anillo crece por separado.
- **Sigla de materia:** se calcula con las iniciales de las palabras con contenido, porque los códigos reales son *slugs* largos (`tecnologia_digitalizacion`).

## Verificación
- `npx eslint` sobre los archivos tocados: 0 hallazgos.
- `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npm test`: 103 archivos y 1054 tests en verde (1 omitido, ya existente), umbrales de cobertura cumplidos por archivo y `check-zoneless` correcto.
- Componentes por debajo de 200 líneas entre lógica y plantilla; el mayor, `mapa-intermodular-view`, tiene 196.
- **Revisión visual:** sin Docker ni navegador disponibles, se generaron imágenes con las mismas funciones de layout y datos reales:
  - panorámica de Laboratorio Clínico 2.º, sin resaltado y con `1373_RA5` resaltado;
  - panorámica de FP Básica: 65 RA, 435 curvas y 50 conexiones fuera del curso;
  - mapa mental de 3.º de ESO con una ficha de tres materias abierta.
- **Pendiente:** la interacción real (ratón, toque y zoom) queda por comprobar en producción.
- **`cd backend && npm test`:** 461 tests en verde, ejecutados por el hook de push.
- **Despliegue** con `./scripts/deploy-prod.sh` (commit `4e392f6`):
  - copia de seguridad previa;
  - migraciones al día;
  - la API y el frontend responden;
  - el bundle servido incluye la panorámica y el mapa mental de la ESO.

## Desviaciones respecto al plan
- **Ficha flotante y leyenda compartida:** se añadieron `PanoramaInfoComponent` (ficha flotante en lugar de tooltip) y `MindmapLegendComponent` (leyenda extraída para compartirla), para respetar los límites de tamaño.
- **Panel de FP:** `connection-drawer` se mantiene como envoltorio de FP sobre el nuevo `mindmap-drawer`, en lugar de renombrarlo.
- **Anillos adaptativos (`ringRadii`):** no estaban previstos; se añadieron al ver el mapa de la ESO con datos reales.
- **Panorámica en la ESO:** no se incluyó, como preveía el plan.

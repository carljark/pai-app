# Mapa mental y panorámica del mapa intermodular (beta)

Vista alternativa del mapa intermodular de FP que sustituye los tres acordeones (módulo → RA → conexiones) por un lienzo SVG con nodos que se despliegan. Convive con la vista clásica, que sigue siendo la predeterminada; cualquier usuario puede elegirla con el selector «Vista clásica / Mapa mental (beta)» de la página del mapa. Se introdujo en la tarea 243 (`planes/243_plan_mapa_mental_intermodular_beta.md`).

## Interacción

- **Nodo central:** ciclo y curso de la pestaña, con la sigla de la etapa.
- **Módulos** (primer anillo), con su color. Al pulsar uno se despliegan sus **RA**; los demás módulos se apagan.
- **RA:** al pulsarlo se despliegan sus conexiones **agrupadas por módulo de destino**, un nodo por módulo con el número de conexiones.
- **Grupo:** al pulsarlo aparece un nodo por conexión (RA de destino), coloreado por tipo de competencia.
- **Conexión:** se dibuja un arco discontinuo hasta el módulo de destino (si forma parte del mapa) y se abre el panel lateral con la ficha completa (`app-connection-card`, la misma de la vista clásica) y «Crear proyecto».
- Solo hay una rama abierta por nivel; volver a pulsar un nodo lo pliega con sus descendientes. Pulsar el centro pliega todo.
- La cámara se centra en el nodo abierto (desplazada hacia fuera para que se vean sus hijos). Zoom con rueda o pellizco, arrastre, botones «+», «−» y «Reencuadrar».
- **Búsqueda y filtros de la cabecera** (texto y tipo de módulo) y **leyenda de tipos de competencia**: resaltan lo que coincide y atenúan el resto, sin ocultar nodos.
- Teclado: los nodos son `role="button"` con `tabindex="0"`; Intro o Espacio los despliegan y Esc cierra el panel.

## Arquitectura

d3 se usa **solo para el cálculo**; el SVG lo pinta Angular con signals. Así se mantienen el cambio de idioma reactivo, BEM, la compatibilidad zoneless y los tests que pulsan nodos reales.

| Pieza | Responsabilidad |
|---|---|
| `models/mindmap.model.ts` | Tipos del árbol, posiciones, estados visuales y rama abierta (`MindmapPath`). |
| `utils/mindmap-tree.ts` | Árbol visible a partir de los módulos y la rama abierta; agrupación por destino; conexión elegida. |
| `utils/mindmap-layout.ts` | Árbol radial con `d3-hierarchy` (`tree().size([2π, 1])` y radios fijos por nivel), curvas con `d3-shape` (`linkRadial`), arco de la conexión y transformaciones de encuadre y centrado. |
| `utils/mindmap-match.ts` | Estado visual de cada nodo: apagado (otra rama abierta), atenuado (filtros) o resaltado (búsqueda). |
| `utils/mindmap-node-view.ts`, `utils/mindmap-render.ts` | Atributos SVG de cada nodo (clases BEM, posición y alineación de la etiqueta, burbuja de hijos) y etiquetas partidas en líneas. |
| `utils/mindmap-zoom.ts` | Enlaza `d3-zoom` al `<svg>`; cada cambio actualiza un signal con la transformación. Las animaciones usan `d3-transition`. |
| `services/mindmap.state.ts` | Rama abierta y filtro de la leyenda. Se provee en `MindmapViewComponent` y se pliega al cambiar de pestaña. Al elegir una conexión llama a `facade.selectRa()` para que «Crear proyecto» funcione igual que en la vista clásica. |
| `services/mapa-vista.service.ts` | Vista elegida, guardada en `localStorage` (`pai_mapa_vista`) con `try/catch`. |
| `services/mapa-proyecto.service.ts` | «Crear proyecto» compartido por las dos vistas (antes vivía en `MapaIntermodularViewComponent`). |
| `components/mindmap/*` | `mindmap-view` (orquesta y leyenda), `mindmap-canvas` (SVG y zoom), `mindmap-controls` (botones) y `connection-drawer` (panel). |
| `components/ui/vista-toggle`, `components/ui/connection-card` | Selector de vista con la insignia «beta» y ficha de conexión reutilizada por las dos vistas. |

Dependencias añadidas al frontend: `d3-hierarchy`, `d3-shape`, `d3-zoom`, `d3-selection` y `d3-transition` (módulos sueltos, sin el paquete `d3` completo), con sus `@types/*`.

## Decisiones

- **Descartados three.js, d3 manipulando el DOM y librerías de grafos** (Cytoscape, vis-network, ngx-graph): legibilidad, accesibilidad, peso, compatibilidad zoneless y cobertura de tests (ver el plan 243).
- **Conexiones agrupadas por módulo de destino:** un RA puede tener más de diez conexiones; los grupos mantienen el número de hojas visibles manejable.
- **Etiqueta de la conexión = texto del RA de destino:** muchos títulos de conexión son genéricos («Conexión curricular: 1373-5g ↔ …»); el título completo sigue en el panel.
- **El arco apunta al módulo de destino** del primer anillo, que siempre está visible; si el destino no pertenece al mapa del curso, no se dibuja arco.
- **La búsqueda no oculta nodos** (a diferencia de la vista clásica, que filtra la lista): en un mapa mental ocultar nodos movería el resto de posiciones.

## Vista panorámica (FP, tarea 244)

Tercera opción del selector («Panorámica», beta). Muestra a la vez todas las conexiones del curso.

**Disposición**
- Los RA forman un círculo, agrupados y coloreados por módulo.
- Fuera del círculo va un arco por módulo con su código.
- Cada conexión es una curva agrupada (*hierarchical edge bundling*) desde el RA de origen hasta el de destino. El id del destino es `<módulo>_<RA>`, igual que el `id` del RA.
- Las conexiones cuyo destino no pertenece al curso se cuentan en la ficha flotante en lugar de dibujarse. En FP Básica son 50 de 485.

**Interacción**
- Al pasar el ratón por un RA o darle el foco se resaltan sus conexiones salientes (ámbar) y entrantes (azul) y sus RA vecinos; el resto se atenúa. Con el arco de un módulo se resaltan las conexiones de todos sus RA.
- Al pulsar un RA (o Intro) se cambia al mapa mental con su módulo y su RA ya desplegados (`MapaVistaService.abrirEnMapaMental` → `MindmapState`).
- En pantallas táctiles, el primer toque resalta y el segundo abre.
- La búsqueda y el tipo de módulo de la cabecera y la leyenda de tipos de competencia atenúan lo que no coincide.

**Implementación**
- `utils/panorama-layout.ts` hace los cálculos:
  - `cluster()` de `d3-hierarchy` sobre raíz → módulo → RA;
  - `lineRadial().curve(curveBundle.beta(0.85))` y `arc()` de `d3-shape`.
- `utils/panorama-highlight.ts` calcula el estado de cada RA y cada curva. Las curvas resaltadas se pintan las últimas.
- Componentes:
  - `components/panorama/panorama-view` orquesta la vista;
  - `panorama-canvas` es el SVG y reutiliza `attachZoom` y `mindmap-controls`;
  - `panorama-info` es la ficha flotante con el RA o módulo resaltado o los totales.

## Mapa mental de la ESO (tarea 244)

En las pestañas de afinidades, el selector ofrece «Vista clásica» y «Mapa mental». No hay panorámica: si la preferencia guardada es esa, se muestra el mapa mental (`MapaVistaService.vistaEso`).

**Disposición**
- **Centro:** «ESO» y el curso.
- **Primer anillo, materias:** con sigla de iniciales y número de fichas.
- **Segundo anillo, materias afines:** las materias con las que la materia abierta comparte fichas.
- **Hojas, fichas:** numeradas según su orden en el curso y etiquetadas con el ámbito desde la materia abierta.
- Al elegir una ficha se dibujan arcos hacia las otras materias de la ficha. El panel lateral muestra `app-afinidad-card` con su «Crear proyecto» (`AfinidadProyectoService`).
- Las fichas de tres materias aparecen bajo cada una de sus dos materias afines.

**Reutilización:** se aprovechan el lienzo, el layout radial, el render y el estado del mapa mental de FP. Los niveles se reutilizan así:
- materia: `module`;
- materia afín: `group`;
- ficha: `connection`.

**Generalizaciones introducidas**
- `MindmapState` ya no depende de los datos de FP. Al elegir una hoja llama a la estrategia `MINDMAP_SELECTION`: en FP apunta la fachada al RA de origen; en la ESO no hace nada.
- `focusNodeId` recorre el árbol desplegado en lugar de reconstruir ids desde la rama abierta.
- El lienzo acepta varios arcos (`arcs`).
- El panel genérico `mindmap-drawer` recibe el contenido proyectado: en FP, `connection-drawer` con la ficha de conexión; en la ESO, la ficha de afinidad.
- La leyenda (`mindmap-legend`) es compartida por el mapa mental y la panorámica.

## Anillos adaptativos del mapa mental

`ringRadii` agranda cada anillo por separado (hasta ×2,5 de su radio base) cuando dos nodos vecinos del mismo nivel quedarían a menos de 84 px. Un escalado uniforme no serviría, porque el encuadre automático lo deshace. Es necesario con 17 materias en 3.º de ESO y con cursos de FP con muchos módulos.

## Pendiente

- Adaptación específica a móvil (hoy el lienzo admite pellizco y el panel pasa debajo en pantallas estrechas).
- Panorámica de la ESO (materias en círculo y fichas como curvas), si se pide.
- Decidir, con las opiniones de la beta, si el mapa mental sustituye a la vista clásica.

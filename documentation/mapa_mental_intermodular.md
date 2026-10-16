# Mapa mental del mapa intermodular (beta)

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

## Pendiente (fuera de la fase 1)

- Vista panorámica con todas las conexiones del curso (*hierarchical edge bundling*).
- Adaptación específica a móvil (hoy el lienzo admite pellizco y el panel pasa debajo en pantallas estrechas).
- Mapa de afinidades de la ESO con el mismo componente.
- Decidir, con las opiniones de la beta, si el mapa mental sustituye a la vista clásica.

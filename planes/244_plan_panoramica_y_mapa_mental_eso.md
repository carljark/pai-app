# Plan 244: Vista panorámica de conexiones y mapa mental de la ESO (beta)

> **Fecha:** 16 de octubre de 2026
> **Estado:** Implementado (tarea 244)
> **Partes afectadas:** frontend / despliegue

---

## 1. Objetivo
Ampliar la beta del mapa (tarea 243) en dos direcciones:
1. **Vista panorámica de FP.** Muestra de un vistazo todas las conexiones del curso: los RA en círculo, agrupados por módulo, y cada conexión como una curva agrupada (*hierarchical edge bundling*). Sirve para ver qué módulos están más conectados y saltar desde ahí al detalle.
2. **Mapa mental de la ESO (beta).** La misma exploración por nodos para el mapa de afinidades: materias → materias afines → fichas, con la ficha en el panel lateral.

## 2. Escenarios
**Selector de vista**
- **Escenario: tres vistas en FP**
  - **Dado** una pestaña de FP
  - **Cuando** se mira la cabecera
  - **Entonces** el selector ofrece «Vista clásica», «Mapa mental» y «Panorámica», las dos últimas con la insignia «beta», y recuerda la elección
- **Escenario: selector en la ESO**
  - **Dado** una pestaña de afinidades de la ESO
  - **Cuando** se muestra
  - **Entonces** el selector ofrece «Vista clásica» y «Mapa mental» (sin panorámica; si la preferencia guardada es «Panorámica», se muestra el mapa mental)

**Panorámica (FP)**
- **Escenario: todas las conexiones del curso**
  - **Dado** la vista panorámica de un curso
  - **Cuando** se abre
  - **Entonces** hay un nodo por RA en un círculo, agrupado y coloreado por módulo, con el código del módulo en un arco exterior, y una curva agrupada por cada conexión cuyo RA de destino está en el mapa
- **Escenario: conexiones con destino fuera del curso**
  - **Dado** conexiones cuyo RA de destino no pertenece al curso
  - **Cuando** se dibuja la panorámica
  - **Entonces** no se pintan como curva y la cabecera de la vista indica cuántas quedan fuera
- **Escenario: resaltar un RA**
  - **Dado** la panorámica
  - **Cuando** se pasa el ratón por un RA o se le da el foco
  - **Entonces** se resaltan sus conexiones salientes y entrantes en colores distintos, sus RA vecinos y la información en el tooltip; el resto se atenúa
- **Escenario: resaltar un módulo**
  - **Dado** la panorámica
  - **Cuando** se pasa el ratón por el arco de un módulo
  - **Entonces** se resaltan todas las conexiones de sus RA
- **Escenario: saltar al mapa mental**
  - **Dado** la panorámica
  - **Cuando** se pulsa un RA (o Intro con el foco)
  - **Entonces** se cambia al mapa mental con su módulo y su RA ya desplegados
- **Escenario: filtros en la panorámica**
  - **Dado** la búsqueda, el tipo de módulo de la cabecera o la leyenda de tipos de competencia
  - **Cuando** se aplican
  - **Entonces** los RA y las curvas que no coinciden se atenúan, igual que en el mapa mental

**Mapa mental de la ESO**
- **Escenario: arranque**
  - **Dado** el mapa mental de un curso de la ESO
  - **Cuando** se abre
  - **Entonces** el centro muestra «ESO» y el curso, y alrededor hay un nodo por materia con el número de fichas
- **Escenario: materias afines**
  - **Dado** el mapa mental de la ESO
  - **Cuando** se pulsa una materia
  - **Entonces** aparecen las materias con las que comparte fichas, cada una con su número de fichas
- **Escenario: fichas**
  - **Dado** una materia afín abierta
  - **Cuando** se pulsa
  - **Entonces** aparece un nodo por ficha, etiquetado con su ámbito
- **Escenario: ficha en el panel**
  - **Dado** una ficha
  - **Cuando** se pulsa
  - **Entonces** se dibuja el arco a las otras materias de la ficha y se abre el panel con la ficha (`app-afinidad-card`) y «Crear proyecto», que hace lo mismo que en la vista clásica
- **Escenario: ESO bilingüe y por curso**
  - **Dado** el mapa mental de la ESO
  - **Cuando** se cambia de idioma o de curso
  - **Entonces** las etiquetas se traducen sin plegar la rama, y al cambiar de curso el mapa se reinicia

## 3. Alternativas
**Panorámica**
- **Diagrama de cuerdas por módulos** (`d3-chord`): muy claro para el volumen entre módulos, pero pierde el detalle por RA.
- **Matriz de adyacencia** módulo × módulo o RA × RA: precisa y legible con muchos datos, pero poco «visual» y menos coherente con el mapa mental.
- **Grafo de fuerzas:** con 300-600 aristas por curso se vuelve una maraña y las posiciones no son estables.
- **Recomendada: *hierarchical edge bundling*** con `d3-hierarchy` (`cluster`) y `d3-shape` (`curveBundle`), que ya están instalados.
  - Muestra el detalle por RA sin enredo y conserva los colores de los módulos.
  - El layout es estable y se calcula con funciones puras, el mismo patrón de la tarea 243.

**Mapa mental de la ESO**
- **Reutilizar el lienzo, el zoom, el layout y el panel de la tarea 243**, con un constructor de árbol propio. Los niveles se reutilizan así:
  - materia: nivel 1 (`module`);
  - materia afín: nivel 2 (`group`);
  - ficha: hoja (`connection`).
  - Sin nivel RA.
- **Recomendada:** generalizar lo justo.
  - `MindmapState` pasa a recibir una estrategia de selección: FP llama a `selectRa`; la ESO no necesita sincronizar fachada.
  - El panel acepta contenido proyectado: ficha de conexión en FP y ficha de afinidad en la ESO.
  - Se descarta duplicar el lienzo o el estado para la ESO.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `.../services/mapa-vista.service.ts` | Valor `panoramica`; `vistaEfectiva(esEso)` devuelve `mental` en la ESO | application |
| `.../components/ui/vista-toggle/*` | Tres opciones, con «Panorámica» oculta en la ESO (entrada `conPanoramica`) | presentation |
| `.../models/panorama.model.ts` (nuevo) | Tipos `PanoramaLeaf`, `PanoramaEdge`, `PanoramaModuleArc` | domain |
| `.../utils/panorama-layout.ts` (nuevo) | Jerarquía raíz → módulo → RA, `cluster().size([2π, r])`, curvas `lineRadial().curve(curveBundle.beta(0.85))`, arcos de módulo y conexiones fuera del curso | domain |
| `.../utils/panorama-highlight.ts` (nuevo) | Estado de cada RA y curva según el RA o módulo resaltado, la búsqueda y los filtros | domain |
| `.../components/panorama/panorama-view/*` (nuevo) | Orquesta la panorámica: leyenda, aviso de conexiones fuera del curso y salto al mapa mental | presentation |
| `.../components/panorama/panorama-canvas/*` (nuevo) | SVG con arcos de módulo, curvas y RA; tooltip; reutiliza `attachZoom` y `mindmap-controls` | presentation |
| `.../services/mindmap.state.ts` | Estrategia de selección inyectable (`MINDMAP_SELECTION`) y `openRa(moduleCode, raId)` para el salto desde la panorámica | application |
| `.../utils/afinidades-mindmap-tree.ts` (nuevo) | Árbol de la ESO: materias → afines → fichas, con búsqueda y etiquetas ES/CA | domain |
| `.../components/mindmap/mindmap-drawer/*` (renombre de `connection-drawer`) | Panel genérico con cabecera (origen → destino) y contenido proyectado | presentation |
| `.../components/mindmap/mindmap-view/*` | Usa `mindmap-drawer` con `app-connection-card` | presentation |
| `.../components/afinidades-mindmap-view/*` (nuevo) | Mapa mental de la ESO: lienzo y panel con `app-afinidad-card` y «Crear proyecto» (`AfinidadProyectoService`) | presentation |
| `.../components/afinidades-eso-view/*` | Selector de vista en su cabecera y alternancia entre las fichas clásicas y el mapa mental | presentation |
| `.../components/mapa-intermodular-view/*` | Tercera vista (`app-panorama-view`) | presentation |
| `frontend/src/app/testing/*` | Datos de prueba de panorámica y ESO, reutilizando `mindmap.mock.ts` y `afinidades.mock.ts` | tests |
| Specs junto a cada archivo nuevo o modificado | Escenarios de la §2, con cobertura del 90 % por archivo | tests |
| `documentation/mapa_mental_intermodular.md` | Secciones de panorámica y ESO | docs |
| `tareas/244_*.md` | Registro de la tarea | docs |

Sin dependencias nuevas, ni cambios en el backend, ni migraciones.

## 5. Tareas
- [ ] Crear la rama `feature/244_panoramica_y_mapa_mental_eso` desde la rama de la tarea 243.
- [ ] Panorámica:
  - [ ] Funciones puras de layout y resaltado, con sus tests (datos reales de Laboratorio Clínico 2.º en una revisión visual).
  - [ ] Lienzo y vista de la panorámica, con tooltip, foco con teclado y salto al mapa mental.
  - [ ] Selector de vista con tres opciones; `MapaVistaService` con `panoramica`.
- [ ] Mapa mental de la ESO:
  - [ ] Generalizar `MindmapState` (estrategia de selección) y el panel (`mindmap-drawer` con contenido proyectado).
  - [ ] Árbol de la ESO y su vista, con `app-afinidad-card` y «Crear proyecto».
  - [ ] Selector de vista en `afinidades-eso-view`.
- [ ] Lint y typecheck; `npm test` en `frontend/` y `backend/`.
- [ ] Documentación en `documentation/` y registro en `tareas/`; plan marcado como implementado.
- [ ] Commit, push y despliegue con `./scripts/deploy-prod.sh`.

## 6. Riesgos y verificación prevista
- **Legibilidad de la panorámica:** con 44 RA y unas 350 conexiones (Laboratorio Clínico 2.º) el *bundling* y el resaltado al pasar el ratón son imprescindibles. Se revisará la imagen con los datos reales de varios cursos. Los cursos de FP Básica, con más RA, son el caso límite.
- **Interacción en móvil:** no hay `hover`. El primer toque resalta el RA y el segundo salta al mapa mental; se probará con eventos táctiles simulados.
- **Generalizar el mapa mental:** no debe romper la vista FP de la tarea 243. Sus specs actuales deben seguir pasando sin cambios de comportamiento.
- **ESO:** en las fichas de tres materias, la ficha aparece bajo cada materia afín. Se acepta la repetición, y el arco señala todas las materias de la ficha.
- **Paridad ES/CA** en etiquetas, tooltips, avisos y el selector.
- **Límites de código:** componentes de menos de 200 líneas y funciones de menos de 25, con la lógica en utilidades puras.
- **Zoneless:** el resaltado se guarda en signals y no se manipula el DOM con d3.
- **Despliegue:** solo frontend y sin migraciones.
- **Verificación:**
  - `npx eslint`, `ngc` y `tsc` de specs;
  - `npm test` en `frontend/` y `backend/`;
  - imágenes de revisión con datos reales;
  - comprobación en producción.

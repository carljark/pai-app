# Plan 243: Mapa mental intermodular (beta)

> **Fecha:** 16 de octubre de 2026
> **Estado:** Implementado (tarea 243)
> **Partes afectadas:** frontend / despliegue

---

## 1. Objetivo
La página del mapa intermodular de FP obliga a recorrer tres acordeones (módulo → RA → conexiones) con listas y desplegables. Se añade una **vista alternativa de mapa mental**: un lienzo SVG con nodos que se abren dinámicamente, zoom y arrastre, y arcos que dibujan la conexión entre un RA y el RA de destino. Se publica en producción **para todos los usuarios con la etiqueta «beta»**, conviviendo con la vista clásica, para recoger opiniones antes de decidir si la sustituye.

## 2. Escenarios
- **Escenario: selector de vista visible para cualquier usuario**
  - **Dado** un docente (no administrador) en una pestaña FP del mapa
  - **Cuando** se carga la página
  - **Entonces** la cabecera muestra «Vista clásica» y «Mapa mental» con la insignia «beta» («Vista clàssica» / «Mapa mental» en catalán)
- **Escenario: la preferencia de vista se recuerda**
  - **Dado** que el usuario eligió «Mapa mental»
  - **Cuando** recarga la aplicación
  - **Entonces** se abre de nuevo el mapa mental (clave `pai_mapa_vista` en `localStorage`, con `try/catch`)
- **Escenario: la vista clásica no cambia**
  - **Dado** «Vista clásica» seleccionada (valor por defecto)
  - **Cuando** el usuario navega por módulos, RA y conexiones
  - **Entonces** se comporta exactamente como ahora
- **Escenario: el mapa de afinidades de la ESO no muestra el selector**
  - **Dado** una pestaña con formato `afinidades`
  - **Cuando** se muestra
  - **Entonces** no aparece el selector y se ve `app-afinidades-eso-view` como hasta ahora
- **Escenario: el mapa mental arranca con los módulos**
  - **Dado** el mapa mental de un curso
  - **Cuando** se abre
  - **Entonces** se ve un nodo central con el ciclo y el curso y un nodo por módulo, con su color e icono
- **Escenario: abrir un módulo despliega sus RA**
  - **Dado** el mapa mental con los módulos
  - **Cuando** se pulsa un módulo
  - **Entonces** aparecen sus RA como hijos, el resto de módulos se atenúa y la fachada queda con ese `selectedModuleCode`
- **Escenario: abrir un RA despliega sus conexiones agrupadas por módulo de destino**
  - **Dado** un módulo abierto
  - **Cuando** se pulsa un RA
  - **Entonces** aparece un nodo por módulo de destino con el número de conexiones, y la fachada queda con ese `selectedRaId`
- **Escenario: abrir un grupo muestra las conexiones**
  - **Dado** un RA abierto
  - **Cuando** se pulsa un grupo de módulo de destino
  - **Entonces** aparece un nodo por conexión (RA de destino), coloreado según su tipo de competencia
- **Escenario: seleccionar una conexión dibuja el arco y abre el panel**
  - **Dado** un grupo abierto
  - **Cuando** se pulsa una conexión
  - **Entonces** se dibuja un arco curvo desde el RA de origen hasta el nodo del módulo de destino, y se abre el panel lateral con el título, la justificación, los criterios relacionados, las actividades (`app-mapa-activities-grid`) y el botón «Crear proyecto»
- **Escenario: crear proyecto desde el panel**
  - **Dado** el panel de una conexión abierto
  - **Cuando** se pulsa «Crear proyecto»
  - **Entonces** se cambia a la vista del generador con el RA de origen y el de destino seleccionados (misma lógica que la vista clásica)
- **Escenario: plegar un nodo**
  - **Dado** un nodo abierto
  - **Cuando** se vuelve a pulsar
  - **Entonces** se pliegan él y sus descendientes, y se cierra el panel si mostraba una conexión de esa rama
- **Escenario: buscar resalta sin ocultar**
  - **Dado** el mapa mental con módulos
  - **Cuando** se escribe un texto en el buscador o se elige un tipo de competencia
  - **Entonces** los nodos que coinciden se resaltan, los demás se atenúan y ninguno desaparece
- **Escenario: zoom, arrastre y centrado**
  - **Dado** el lienzo
  - **Cuando** se usa la rueda, se arrastra o se abre un nodo
  - **Entonces** cambia la transformación del lienzo y la cámara se centra en el nodo abierto; «Reencuadrar» vuelve a la vista completa
- **Escenario: navegación con teclado**
  - **Dado** un nodo con el foco
  - **Cuando** se pulsa Intro o Espacio
  - **Entonces** se abre o se pliega igual que con el ratón; con Esc se cierra el panel
- **Escenario: cambio de idioma reactivo**
  - **Dado** el mapa mental abierto con nodos desplegados
  - **Cuando** se cambia a catalán
  - **Entonces** las etiquetas de los nodos y el panel se muestran en catalán sin perder lo desplegado
- **Escenario: cambio de curso**
  - **Dado** el mapa mental con nodos abiertos
  - **Cuando** se cambia de pestaña
  - **Entonces** el mapa se reinicia con los módulos del nuevo curso y el panel se cierra

## 3. Alternativas
- **three.js (3D):** muy vistoso, pero el texto se lee mal, cuesta seleccionar nodos, la accesibilidad es casi nula y no es razonable alcanzar el 90 % de cobertura por archivo. Descartada.
- **d3 manipulando el DOM (`d3-selection`):** es lo habitual con d3, pero queda fuera del ciclo de Angular (signals e idioma reactivo), choca con BEM y con las plantillas en archivos propios, y los tests no cubrirían plantillas. Descartada.
- **Librería de grafos (Cytoscape, vis-network, ngx-graph):** dan la interacción hecha, pero pesan más (150-400 KB), su estilo se adapta mal a la paleta corporativa y algunas dependen de zone.js o de su propio DOM. Descartada.
- **Recomendada: d3 solo para el cálculo y Angular para el dibujo.**
  - `d3-hierarchy` calcula las posiciones con su layout de árbol radial, `d3-shape` las curvas de los enlaces y `d3-zoom` el zoom y el arrastre.
  - El SVG lo pinta la plantilla con `@for` y signals.
  - Pesa unos 40 KB y es compatible con zoneless, BEM y paridad ES/CA. Los tests pulsan nodos reales del DOM.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `frontend/package.json` y `package-lock.json` | Dependencias `d3-hierarchy`, `d3-shape`, `d3-zoom` y `d3-selection` (solo la necesita `d3-zoom` para enlazarse al `<svg>`), con sus `@types/*` en `devDependencies` | config |
| `frontend/src/app/features/mapa-intermodular/models/mindmap.model.ts` (nuevo) | Tipos `MindmapNodeKind` (`root`, `module`, `ra`, `group`, `connection`), `MindmapNode`, `PositionedNode` y `MindmapLink` | domain |
| `.../utils/mindmap-tree.ts` (nuevo) | Funciones puras: construir el árbol visible a partir de los módulos y de los ids expandidos, agrupar las conexiones por módulo de destino y calcular las etiquetas ES/CA | domain |
| `.../utils/mindmap-layout.ts` (nuevo) | Funciones puras sobre `d3-hierarchy` (`tree().size([2π, r])`) y `d3-shape` (`linkRadial`): posiciones polares a cartesianas, enlaces padre-hijo y arco de la conexión seleccionada | domain |
| `.../utils/mindmap-match.ts` (nuevo) | Coincidencia de un nodo con la búsqueda y el filtro por tipo, reutilizando `matchesModuleQuery` cuando proceda | domain |
| `.../services/mindmap.state.ts` (nuevo) | Estado de la vista (ids expandidos, conexión seleccionada, foco) con signals; sincroniza `selectModule`/`selectRa` con `MapaIntermodularFacade` | application |
| `.../services/mapa-vista.service.ts` (nuevo) | Signal `vista` (`clasica`/`mental`) persistida en `localStorage` (`pai_mapa_vista`), con `try/catch` | application |
| `.../components/ui/vista-toggle/` (nuevo: `.ts`, `.html`, `.scss`) | Selector segmentado «Vista clásica / Mapa mental» con insignia «beta» | presentation |
| `.../components/mindmap/mindmap-canvas/` (nuevo) | `<svg>` con grupo transformable, `@for` de enlaces y nodos, botón «Reencuadrar»; directiva o helper con `d3-zoom` | presentation |
| `.../components/mindmap/mindmap-node/` (nuevo) | Nodo SVG (`<g role="button" tabindex="0">`) con círculo, icono y etiqueta recortada, y estados `--expanded`, `--dimmed`, `--match` y `--selected` | presentation |
| `.../components/mindmap/connection-drawer/` (nuevo) | Panel lateral con los datos de la conexión, `app-mapa-activities-grid` y el CTA `btn-primary` «Crear proyecto» | presentation |
| `.../components/mindmap/mindmap-view/` (nuevo) | Orquesta el lienzo y el panel; emite `createProject(connection)` | presentation |
| `.../components/mapa-intermodular-view/mapa-intermodular-view.component.{ts,html,scss}` | Añade el selector y renderiza `app-mindmap-view` o los tres acordeones según la vista; reutiliza `createProjectFromConnection` | presentation |
| `.../components/ui/header/header.component.html` | Hueco (`ng-content`) para el selector, si encaja mejor ahí que en la vista | presentation |
| Specs `*.spec.ts` junto a cada archivo nuevo o modificado | Escenarios de la §2 y cobertura del 90 % por archivo (80 % de funciones en `.html`) | tests |
| `documentation/mapa_mental_intermodular.md` (nuevo) | Arquitectura (d3 como cálculo, Angular como render), interacción y criterios para retirar la vista clásica | docs |
| `tareas/243_mapa_mental_intermodular_beta.md` | Registro de la tarea (skill `registrar-tarea`) | docs |

No hay cambios en el backend ni migraciones.

## 5. Tareas
- [ ] Crear la rama `feature/243_mapa_mental_intermodular_beta`.
- [ ] Instalar las dependencias de d3 (`npm install --legacy-peer-deps`) y comprobar el tamaño del bundle.
- [ ] Modelo y funciones puras (`mindmap-tree`, `mindmap-layout`, `mindmap-match`) con sus tests.
- [ ] `MapaVistaService` y el componente `vista-toggle`, con textos ES/CA.
- [ ] `MindmapState` sincronizado con la fachada.
- [ ] Componentes `mindmap-node`, `mindmap-canvas` (zoom y centrado con transición) y `connection-drawer`.
- [ ] `mindmap-view` e integración en `mapa-intermodular-view`, manteniendo la vista clásica.
- [ ] Accesibilidad con teclado (Intro, Espacio y Esc) y atributos `aria-*`.
- [ ] Pulido visual con la paleta de `_variables.scss` (skill `frontend-design`).
- [ ] Lint y typecheck; después `npm test` en `frontend/` y en `backend/`.
- [ ] Documentación en `documentation/` y registro en `tareas/`; plan marcado como implementado.
- [ ] Commit, push y despliegue con `./scripts/deploy-prod.sh`; comprobar en producción, con un ciclo grande, que la vista funciona en ambos idiomas.

## 6. Riesgos y verificación prevista
- **Legibilidad con muchos nodos:** un RA puede tener hasta unas 15 conexiones. Por eso se agrupan por módulo de destino y solo se abre una rama a la vez por nivel (acordeón radial). Se probará con el curso que tenga más conexiones.
- **d3-zoom en jsdom:** los eventos de rueda y arrastre no se reproducen bien en los tests. La lógica de transformación irá aislada en funciones puras testeadas, y el enlace con `d3-zoom` en un helper mínimo que se pueda simular.
- **Cobertura por archivo y de plantillas:** como hay muchas ramas `@if`/`@for` en los SVG, los tests pulsarán nodos reales en cada estado.
- **Límites de código:** componentes de menos de 200 líneas y funciones de menos de 25. Por eso el layout y el estado van fuera de los componentes. `mapa-intermodular-view.component.ts` (164 líneas) solo gana el selector; si se acerca al límite, se extrae la lógica de «Crear proyecto» a un helper.
- **Zoneless:** las transiciones de `d3-zoom` actualizan un signal de transformación, no el DOM directamente. Sin `NgZone`, `fakeAsync` ni `zone.js`.
- **Paridad ES/CA:** todas las etiquetas de nodos, el panel, el selector y la insignia en los dos idiomas, con un test de cambio de idioma.
- **Móvil:** fuera de alcance, pero el lienzo admite zoom con los dedos y el panel ocupará el ancho completo en pantallas estrechas. La vista clásica sigue disponible.
- **Despliegue:** el cambio es solo de frontend y no tiene migraciones. Si falla, se vuelve al commit anterior.
- **Verificación:**
  - `cd frontend && npx eslint <archivos>`, `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`;
  - `cd frontend && npm test` y `cd backend && npm test`;
  - comprobación manual en producción.

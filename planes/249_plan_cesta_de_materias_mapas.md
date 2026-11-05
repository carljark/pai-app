# Plan 249: Cesta de materias y módulos en los mapas (ESO y FP)

> **Fecha:** 5 de noviembre de 2026
> **Estado:** Implementado (tarea 249)
> **Partes afectadas:** frontend (mapa de afinidades de la ESO, mapa intermodular de la FP, mapa mental, generador, ayuda)

---

## 1. Objetivo

Hoy, desde los mapas, «Crear Proyecto» abre el generador con los criterios de **una sola** ficha (ESO, `AfinidadProyectoService.crearProyecto`) o con los RA de **una sola** conexión o RA (FP, `MapaProyectoService.crearDesdeConexion`). Los docentes necesitan reunir, después de ver el mapa, **varias materias o módulos** y crear con ellos un único proyecto. Para eso se añade una **cesta** en todos los mapas, de la ESO y de los ciclos de FP:

- **Vista clásica:** junto a los botones «Crear Proyecto…» actuales, un botón «Añadir a la cesta» / «Afegeix a la cistella» que guarda exactamente lo que crearía ese botón: los criterios de la ficha en la ESO y los RA de la conexión o del RA en la FP.
- **Mapa mental:** un icono de cesta en el lienzo al que se arrastran las bolas de materias (ESO) o de módulos (FP). Al soltar una bola dentro, suena un «PLAPP» grave.
- **Criterios en común:** las materias o módulos que entran por arrastre aportan **lo que tienen en común con los demás de la cesta**, según el mapa:
  - **ESO:** los criterios de las fichas que unen al menos dos materias de la cesta, tomando solo los de las materias que están en ella.
  - **FP:** los RA de las conexiones entre módulos de la cesta, tanto el RA de origen como el de destino.
- Un panel de cesta lista lo recogido, permite quitar elementos y vaciarla, y tiene «Crear proyecto con la cesta».

Es solo frontend: no hay cambios de backend, datos ni migraciones.

## 2. Escenarios

**Cesta ESO (estado y cálculo)**
- **Escenario: una sola materia arrastrada no aporta criterios todavía**
  - **Dado** una cesta vacía de 1.º de ESO
  - **Cuando** se mete Matemáticas
  - **Entonces** la cesta tiene la materia sin criterios y el panel indica «Añade otra materia para ver los criterios en común» / «Afegeix una altra matèria per veure els criteris en comú».
- **Escenario: dos materias arrastradas aportan los criterios de sus fichas comunes**
  - **Dado** una cesta con Matemáticas
  - **Cuando** se mete Física y Química
  - **Entonces** aparecen los criterios de ambas materias en todas las fichas que las unen, sin repetir.
- **Escenario: de una ficha de tres materias solo cuentan las de la cesta**
  - **Dado** una ficha Matemáticas + Tecnología + Música y una cesta con Matemáticas y Tecnología
  - **Cuando** se calculan los criterios
  - **Entonces** entran los de Matemáticas y Tecnología de esa ficha, y ninguno de Música.
- **Escenario: dos materias sin ficha común**
  - **Dado** dos materias sin ninguna ficha que las una
  - **Cuando** se meten en la cesta
  - **Entonces** no aportan criterios y el panel lo indica en cada una.
- **Escenario: el botón de la ficha añade sus criterios exactos**
  - **Dado** una cesta vacía
  - **Cuando** se pulsa «Añadir a la cesta» en una ficha
  - **Entonces** entran sus materias con los criterios que cita la ficha, igual que «Crear Proyecto con estos criterios».
- **Escenario: ficha y materias arrastradas se combinan**
  - **Dado** una ficha añadida con su botón
  - **Cuando** se arrastra una materia más
  - **Entonces** la cesta une los criterios de la ficha y los criterios en común de la materia nueva, sin repetir.

**Cesta FP**
- **Escenario: dos módulos arrastrados aportan los RA de sus conexiones**
  - **Dado** un ciclo con mapa y una cesta con el módulo A
  - **Cuando** se mete el módulo B
  - **Entonces** entran los RA de A con conexiones hacia B y los RA de B que son destino de esas conexiones (y viceversa), sin repetir.
- **Escenario: el botón de una conexión o un RA añade sus RA**
  - **Dado** la vista clásica de un ciclo
  - **Cuando** se pulsa «Añadir a la cesta» en una conexión o en el detalle de un RA
  - **Entonces** entran los mismos RA que usaría su botón «Crear Proyecto».
- **Escenario: ciclo sin mapa**
  - **Dado** un ciclo sin mapa intermodular
  - **Cuando** se abre
  - **Entonces** no hay cesta, como hoy no hay mapa.

**Comunes**
- **Escenario: quitar y vaciar**
  - **Dado** una cesta con 3 elementos
  - **Cuando** se quita uno y después se pulsa «Vaciar»
  - **Entonces** quedan 2 y después 0, los criterios se recalculan y el contador del icono se actualiza.
- **Escenario: una cesta por pestaña**
  - **Dado** una cesta llena en 1.º de ESO
  - **Cuando** se cambia a 2.º de ESO o a un ciclo de FP
  - **Entonces** cada pestaña tiene su propia cesta y no se mezclan.
- **Escenario: la cesta sobrevive a recargar la página**
  - **Dado** una cesta con contenido
  - **Cuando** se recarga la página
  - **Entonces** se recupera desde `sessionStorage`; si el almacenamiento falla, empieza vacía sin errores.
- **Escenario: el botón indica lo ya añadido**
  - **Dado** una ficha o conexión que ya está en la cesta
  - **Cuando** se renderiza
  - **Entonces** el botón muestra «En la cesta ✓» / «A la cistella ✓» y queda desactivado.
- **Escenario: textos en los dos idiomas**
  - **Dado** la cesta, sus botones y su panel
  - **Cuando** se renderizan en castellano y en catalán
  - **Entonces** todos los textos están en el idioma activo; las siglas son «CE x.y» / «CA x.y» en la ESO y los códigos de RA en la FP.

**Mapa mental**
- **Escenario: arrastrar una bola a la cesta la añade y suena PLAPP**
  - **Dado** el mapa mental (ESO o FP)
  - **Cuando** se arrastra la bola de una materia o módulo y se suelta sobre el icono de la cesta
  - **Entonces** entra en la cesta, el icono hace una animación breve y suena el «PLAPP».
- **Escenario: soltar fuera de la cesta no añade nada**
  - **Dado** una bola arrastrada
  - **Cuando** se suelta fuera del icono
  - **Entonces** la cesta no cambia, no suena nada y la bola vuelve a su sitio.
- **Escenario: un clic sigue desplegando**
  - **Dado** una bola de materia o módulo
  - **Cuando** se pulsa sin moverla (menos de 5 px)
  - **Entonces** se despliega como hasta ahora.
- **Escenario: arrastrar el fondo sigue moviendo el mapa**
  - **Dado** el lienzo
  - **Cuando** se arrastra un hueco sin bola
  - **Entonces** el mapa se desplaza como hasta ahora (d3-zoom).
- **Escenario: solo se arrastran materias y módulos**
  - **Dado** las bolas de RA, grupos, fichas o conexiones
  - **Cuando** se intentan arrastrar
  - **Entonces** no se mueven y el gesto desplaza el mapa.
- **Escenario: sin Web Audio no hay error**
  - **Dado** un navegador sin `AudioContext` (o jsdom)
  - **Cuando** se suelta una bola en la cesta
  - **Entonces** se añade igualmente y no se lanza ninguna excepción.

**Crear proyecto**
- **Escenario: crear proyecto de la ESO con la cesta**
  - **Dado** una cesta de 1.º de ESO con tres materias y sus criterios en común
  - **Cuando** se pulsa «Crear proyecto con la cesta»
  - **Entonces** el generador abre la ESO y el curso, con las CE de esas materias seleccionadas y marcados solo los criterios de la cesta.
- **Escenario: crear proyecto de la FP con la cesta**
  - **Dado** una cesta de un ciclo con dos módulos y sus RA en común
  - **Cuando** se pulsa «Crear proyecto con la cesta»
  - **Entonces** el generador abre el ciclo y el curso con esos RA seleccionados.
- **Escenario: sin criterios no se puede crear**
  - **Dado** una cesta vacía o con una sola materia arrastrada
  - **Cuando** se muestra el panel
  - **Entonces** el botón de crear está desactivado y se indica cómo completarla.

## 3. Alternativas

**Qué aporta una materia o módulo arrastrado**
- **A. Lo que tiene en común con el resto de la cesta (elegida por el usuario).** Las materias o módulos se guardan como elementos y los criterios o RA se **calculan** a partir del mapa cada vez que cambia la cesta. Así, meter una tercera materia añade sus vínculos con las otras dos, y quitar una retira los suyos.
- B. La materia completa (todas sus CE). Descartada: la selección es demasiado amplia y no aprovecha el mapa.

**Cálculo de «en común»**
- **ESO:** una ficha cuenta si al menos 2 de sus materias están en la cesta; de esa ficha entran los criterios de las materias de la cesta, en todos sus vínculos. Se reutiliza `criteriosDeMateria` de `afinidad-seleccion.ts`.
- **FP:** una conexión cuenta si su módulo de origen y su módulo de destino están en la cesta; entran el RA de origen y el de destino. Se reutilizan `connectionTargetRef` y `findCurriculumMatch` de `curriculum-match.ts` para traducirlos a la selección del generador.
- Riesgo: en la FP, dos módulos muy relacionados pueden compartir muchas conexiones (hay entre 6 y 15 por RA). El panel muestra el recuento y el docente puede quitar RA concretos antes de crear el proyecto.

**Modelo único para ESO y FP**
- **Recomendado: una cesta genérica con dos «adaptadores».** El modelo guarda `unidades` (materias o módulos) y `extras` (fichas, conexiones o RA añadidos con botón). Cada adaptador calcula lo que hay en común y lo traduce a la selección del generador. El panel, el icono, el arrastre y el sonido son comunes.
- Alternativa: dos cestas separadas. Duplica componentes y tests sin ninguna ventaja.

**Arrastre dentro del SVG**
- **`d3-drag` sobre las bolas de materia o módulo (recomendado).** Ya llega como dependencia transitiva de d3-zoom; se añade explícitamente a `package.json`. Se filtra d3-zoom para que no arranque sobre una bola arrastrable, una «bola fantasma» en una capa HTML sigue al puntero y, al soltar, se comprueba si el puntero cae dentro del rectángulo del icono. La API nativa de drag and drop de HTML5 se descarta porque no funciona bien con SVG ni en pantallas táctiles.

**Sonido «PLAPP»**
- **Sintetizado con Web Audio (recomendado):** un golpe de ruido filtrado muy corto («PL») y un seno grave que baja de unos 160 a 55 Hz en unos 0,25 s («APP»). No hay archivo que licenciar ni cargar. Suena tras un gesto del usuario, así que no le afecta la política de autoplay.

**Dónde vive el estado**
- **Servicio con signals, una cesta por pestaña (`MapaTab`) y copia en `sessionStorage`.** No se guarda en el servidor: es una herramienta de sesión.

## 4. Cambios por archivo

Rutas relativas a `frontend/src/app/features/mapa-intermodular/` salvo que se indique otra.

| Archivo | Cambio | Capa |
|---|---|---|
| `models/cesta.model.ts` | **Nuevo.** `CestaEstado { unidades: string[]; extras: ExtraCesta[] }` y `SeleccionCesta` (criterios o RA resultantes por unidad). | domain |
| `utils/cesta.ts` | **Nuevo.** Funciones puras: añadir/quitar unidad o extra, vaciar, comprobar si ya está. | domain |
| `utils/cesta-eso.ts` | **Nuevo.** Criterios en común entre materias a partir de las fichas, más los extras; conversión a `SeleccionCe[]`. | domain |
| `utils/cesta-fp.ts` | **Nuevo.** RA en común entre módulos a partir de las conexiones, más los extras; conversión a descripciones de RA del generador. | domain |
| `utils/afinidad-seleccion.ts` | Extraer el helper común (criterios por materia → `SeleccionCe[]`) que reutilizan la ficha y la cesta, sin cambiar el comportamiento actual. | domain |
| `services/cesta.service.ts` | **Nuevo.** Signals por pestaña, `estado`, `total`, `contiene`, `añadir*`, `quitar`, `vaciar`; persistencia en `sessionStorage` con try/catch. | application |
| `services/afinidad-proyecto.service.ts` | `crearDesdeCesta(tab)`: nivel y curso, carga de CE y aplicación de la selección; se reutiliza el flujo de `crearProyecto`. | application |
| `services/mapa-proyecto.service.ts` | `crearDesdeCesta(tab)` para la FP: nivel y curso y `selectedRas` con los RA de la cesta. | application |
| `services/plapp-sound.service.ts` | **Nuevo.** Síntesis del «PLAPP»; `AudioContext` perezoso y protegido si no existe. | infrastructure |
| `components/ui/afinidad-card/*` | Output `anadirCesta` e input `enCesta`; segundo botón (`btn-secondary`) en `__acciones`. | presentation |
| `components/ui/connection-card/*` y `components/ui/ra-detail/*` | El mismo botón junto a «Crear Proyecto» / «Crear Proyecto con estas conexiones». | presentation |
| `components/ui/cesta-panel/` | **Nuevo.** Lista por materia o módulo, con sus criterios («CE x.y» / «CA x.y») o RA, avisos «sin nada en común», quitar, vaciar y «Crear proyecto con la cesta» (`btn-primary`). | presentation |
| `components/ui/cesta-icono/` | **Nuevo.** Icono con contador, zona donde soltar y animación al recibir; abre el panel. | presentation |
| `components/afinidades-eso-view/*` y `components/mapa-intermodular-view/*` | Conectan los botones nuevos y muestran el icono y el panel en la vista clásica. `mapa-intermodular-view` (132 + 67 líneas) no admite más: la integración de la cesta va en un componente contenedor pequeño o en el servicio. | presentation |
| `utils/mindmap-drag.ts` | **Nuevo.** Enlaza `d3-drag` a las bolas arrastrables, con umbral de 5 px, posición de la bola fantasma y comprobación del destino. | infrastructure |
| `utils/mindmap-zoom.ts` | Filtro para que d3-zoom no arranque sobre una bola arrastrable. | infrastructure |
| `components/mindmap/mindmap-canvas/*` | Input `draggableKind` (por defecto ninguno), output `nodeDrop` y capa de la bola fantasma. La lógica va en `mindmap-drag.ts` para no pasar de 200 líneas (hoy tiene 189). | presentation |
| `components/afinidades-mindmap-view/*` y `components/mindmap/mindmap-view/*` | Icono de cesta sobre el lienzo y `draggableKind="module"`. Al soltar: añadir la unidad, sonido y animación. También conectan los botones de los paneles laterales. | presentation |
| `frontend/package.json` y `package-lock.json` | `d3-drag` y `@types/d3-drag` explícitos, en la versión que ya usa d3-zoom. | config |
| `frontend/src/app/features/help/i18n/help.{es,ca}.ts` y `help/tours/tours.ts` | Explicar la cesta en la ayuda y añadir un paso a las visitas guiadas de los mapas (tarea 246). | presentation |
| Specs `*.spec.ts` de cada archivo nuevo o tocado | Escenarios de la sección 2, con clics en los botones reales y arrastre simulado con eventos de puntero. | tests |
| `documentation/mapa_afinidades_eso.md` y la documentación del mapa intermodular de FP | Sección «Cesta»: modelo, cálculo de lo que hay en común, persistencia, arrastre y sonido. | docs |

## 5. Tareas

- [ ] Crear la rama `feature/249_cesta_materias_mapas` desde `main`.
- [ ] Modelo, funciones puras y adaptadores ESO y FP de la cesta, con sus tests.
- [ ] Extraer el helper común de `afinidad-seleccion.ts` (sus tests actuales siguen en verde).
- [ ] `CestaService` con persistencia por pestaña.
- [ ] `crearDesdeCesta` en `AfinidadProyectoService` y `MapaProyectoService`.
- [ ] Botones «Añadir a la cesta» en `afinidad-card`, `connection-card` y `ra-detail`.
- [ ] Componentes `cesta-icono` y `cesta-panel`, integrados en las dos vistas clásicas.
- [ ] `mindmap-drag.ts`, filtro de d3-zoom e inputs/outputs del lienzo; integrarlo en los mapas mentales de la ESO y la FP.
- [ ] Servicio de sonido «PLAPP», con el timbre ajustado en el navegador.
- [ ] Ayuda y visitas guiadas en ES/CA.
- [ ] `npx eslint` de los archivos tocados, `ngc` y `tsc` de las specs, `npm test` en frontend (90 % por archivo) y en backend.
- [ ] Prueba manual en Docker: ESO 1.º y un ciclo de FP con mapa, en vista clásica y mapa mental, con ratón y táctil (DevTools), cambio de idioma y de pestaña, y crear el proyecto.
- [ ] Commit, push, CI en verde, integración en `main`, seguimiento del despliegue y `/registrar-tarea`.

## 6. Riesgos y verificación prevista

- **Conflicto entre arrastre, zoom y clic:** es el riesgo principal. Se controla con el filtro de d3-zoom, el umbral de 5 px y la restricción a bolas de materia o módulo. Se verifica con tests de eventos de puntero y una prueba manual con ratón y táctil.
- **Volumen en la FP:** dos módulos pueden compartir decenas de RA. El panel muestra el recuento y permite quitar RA. Se comprobará que el generador y su prompt admiten la selección resultante y, si hay un límite, se avisará en el panel.
- **Límites de tamaño:** `mindmap-canvas` (189 líneas), `mapa-intermodular-view` (199), `afinidad-card` (161) y `mindmap-view` (165) están cerca de 200. El arrastre irá en un util y la cesta en componentes y servicios propios. Ninguna función pasará de 25 líneas.
- **Zoneless:** la cesta, la bola fantasma y la animación van en signals. Los callbacks de d3-drag actualizan signals, como ya hace d3-zoom.
- **Paridad ES/CA:** todos los textos nuevos irán en los dos idiomas. En la FP, el emparejamiento de RA usa el idioma activo, igual que `crearDesdeConexion`. Se probará en los dos idiomas.
- **Regresiones en «Crear Proyecto» actual:** sus tests (`afinidad-proyecto.service.spec.ts` y `mapa-intermodular-view.component.spec.ts`) deben seguir en verde sin cambios.
- **Audio:** sin `AudioContext`, el sonido se omite en silencio. Un spy comprobará que suena al soltar dentro y no al soltar fuera.
- **Cobertura por archivo y de plantillas (80 % de funciones en `.html`):** los tests pulsarán los botones reales y simularán el arrastre completo.
- **Accesibilidad:** el arrastre no es accesible con teclado. La alternativa son los botones «Añadir a la cesta» de las fichas y conexiones. Si cabe sin pasar los límites de tamaño, se añadirá un atajo de teclado sobre la bola enfocada.
- **Despliegue:** solo frontend y sin migraciones, así que el despliegue automático desde `main` no tiene riesgo de datos.

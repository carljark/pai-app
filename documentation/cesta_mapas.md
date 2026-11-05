# Cesta de materias y módulos en los mapas

La cesta permite crear **un proyecto con varias materias (ESO) o módulos (FP)** después de explorar un mapa. Está en todos los mapas, el de afinidades de la ESO y los intermodulares de FP, y en todas sus vistas. Es solo frontend: no hay endpoint ni colección.

## Cómo se usa

- **Vista clásica:** cada ficha de afinidad, cada conexión y el detalle del RA tienen «Añadir a la cesta» / «Afegeix a la cistella» junto a su «Crear Proyecto…». Añade **exactamente** lo que crearía ese botón:
  - en una ficha, los criterios que cita de cada materia;
  - en una conexión, el RA de origen activo y el RA de destino;
  - en el detalle del RA, el RA y los destinos de sus conexiones filtradas.

  Si todo ya está en la cesta, el botón pasa a «En la cesta ✓» y queda desactivado.
- **Mapa mental:** las bolas de materia o módulo, y también las de materia o módulo de destino, se arrastran hasta el botón flotante de la cesta. Al soltarlas dentro suena un «PLAPP» grave y la cesta hace una animación breve.
  - Un clic (menos de 5 px de movimiento) sigue desplegando la bola.
  - Arrastrar el fondo sigue moviendo el mapa.
  - Las bolas de RA, ficha o conexión no se arrastran.
- **Panel:** lista cada materia o módulo con sus criterios («CE x.y» / «CA x.y») o RA. Permite quitar claves o unidades, vaciar la cesta y «Crear Proyecto con la cesta (N)», que abre el generador con todo seleccionado.

## Qué aporta una materia o módulo arrastrado

Lo arrastrado aporta **lo que tiene en común con el resto de la cesta**, según el mapa. Se recalcula cada vez que cambia el contenido.

- **ESO** (`utils/cesta-eso.ts`):
  - Cuenta cada ficha con al menos dos materias en la cesta y al menos una de ellas arrastrada.
  - De esa ficha entran los criterios de las materias que están en la cesta, en todos sus vínculos. En una ficha de tres materias con dos en la cesta, la tercera no aporta nada.
- **FP** (`utils/cesta-fp.ts`):
  - Cuenta cada conexión entre dos módulos de la cesta, con alguno de los dos arrastrado.
  - Entran el RA de origen y el de destino.

Con una sola materia o módulo todavía no hay nada en común, y el panel lo indica. Las unidades añadidas solo con botón no suman fichas ni conexiones por sí solas: así, «Añadir a la cesta» en una ficha no arrastra las demás fichas de esas materias.

## Arquitectura

| Pieza | Responsabilidad |
|---|---|
| `models/cesta.model.ts` | `CestaEstado`: `unidades` arrastradas, `extras` añadidos con botón y `excluidas` quitadas a mano; `GrupoCesta` para pintar. |
| `utils/cesta.ts` | Operaciones puras: añadir, quitar, agrupar (extras ∪ comunes − excluidas, con orden numérico) y `contieneClaves`. |
| `services/cesta.service.ts` | Estado por pestaña (`MapaTab`) en un signal, con copia en `sessionStorage` (`plappin.cesta.<tab>`) protegida con try/catch. |
| `services/cesta.facade.ts` | Cesta de la pestaña activa: grupos, nombres, siglas, acciones y `crearProyecto()`. Delega en `AfinidadProyectoService.crearDesdeCriterios` (ESO) o en `MapaProyectoService.crearDesdeReferencias` (FP), que reutilizan el flujo de «Crear Proyecto». |
| `services/cesta-drop.service.ts` | Zona donde se suelta: rectángulo del botón, bola fantasma, resaltado y contador de bolas recibidas. Implementa `MindmapDropTarget`. |
| `services/plapp-sound.service.ts` | «PLAPP» sintetizado con Web Audio. |
| `utils/mindmap-drag.ts` | `d3-drag` sobre el `<svg>`: sujeto por `data-node-id`, umbral de 5 px y comprobación del destino al soltar. |
| `utils/mindmap-zoom.ts` | Enlaza el arrastre **antes** que d3-zoom, que d3-drag detiene con `stopImmediatePropagation`, y filtra el zoom para que no arranque sobre una bola arrastrable. |
| `components/ui/cesta`, `cesta-panel`, `cesta-boton` | Botón flotante y bola fantasma, panel, y botón «Añadir a la cesta» reutilizable. |

`app-mindmap-canvas` es común a la ESO y a la FP. El arrastre solo se activa si recibe `[dropTarget]`, y emite `(unitDrop)` con el código de la materia o del módulo.

## Sonido

El sonido no usa archivos, así que no hay nada que licenciar ni descargar. Se sintetiza en tres capas:

1. un chasquido de ruido filtrado de 35 ms («PL»);
2. un seno que cae de 170 a 55 Hz en 0,2 s con envolvente percusiva («A»);
3. un segundo chasquido corto («PP»).

Solo suena tras soltar la bola, que es un gesto del usuario, así que no le afecta la política de autoplay. Sin `AudioContext` (jsdom, navegadores antiguos) no suena y no da error. Los valores están en `plapp-sound.service.ts` por si hay que ajustar el timbre.

## Decisiones

- **`d3-drag` y no drag and drop de HTML5:** la API nativa funciona mal con SVG y en pantallas táctiles. `d3-drag` ya llegaba como dependencia de d3-zoom; se declara fijado en la 3.0.0, porque la 3.0.1 se publicó días antes de esta tarea.
- **Estado de sesión:** la cesta sirve para preparar un proyecto y no se guarda en el servidor.
- **Accesibilidad:** el arrastre no tiene equivalente de teclado. La alternativa accesible son los botones «Añadir a la cesta» de las fichas y conexiones, también en el panel lateral del mapa mental.

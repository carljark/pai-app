# Tarea 254: Mapa en el menú lateral, cesta visible en el móvil y selector de vista responsive

## Propósito

Tres ajustes de la interfaz del mapa intermodular, pedidos de forma encadenada:

1. **Menú lateral:** el mapa intermodular pasa a estar justo debajo de «Inicio» y encima de «Nuevo proyecto», para darle más visibilidad.
2. **Cesta cortada en el móvil:** la cesta flotante del mapa se veía cortada por la derecha y por abajo.
3. **Selector de vista apelotonado:** al estrechar la ventana, las opciones «Vista clásica», «Mapa mental» y «Panorámica» saltaban de línea dentro de una píldora y sus bordes redondeados se montaban sobre los del contenedor. Se pidió una solución responsive mobile-first.

## Arquitectura y flujo

Solo cambian plantillas y estilos del frontend; no hay cambios de datos, API ni lógica.

- **Menú lateral** (`app-sidebar`): se reordena el botón `switchView('mapa')`. La visita guiada de introducción (`tours.ts`) no cambia de orden: su primer paso («Empieza aquí») sigue señalando «Nuevo proyecto».
- **Cesta** (`app-cesta`, `position: fixed` abajo a la derecha): el problema no estaba en la cesta, sino en la cabecera del mapa. El selector de vista (`app-mapa-vista-toggle`, proyectado en `.mapa-tabs__extra`) tenía `flex-shrink: 0` y no cabía en pantallas estrechas (411 px en un móvil de 390 px). La página se ensanchaba a 512 px y el navegador móvil ampliaba el viewport de diseño, al que se ancla el elemento fijo. Con emulación de iPhone, el botón de la cesta quedaba en `right = 496` y `bottom = 1035` en una pantalla de 390 × 800.
- **Selector de vista:** pasa a ser un control segmentado de una sola fila, mobile-first:
  - **Móvil y tableta (< 1024 px):** ocupa todo el ancho en su propia fila (`flex: 1 1 100%`). Cada opción puede partir su propio texto (la insignia «BETA» baja de línea), pero las opciones nunca saltan a otra fila.
  - **Escritorio (≥ 1024 px):** ocupa solo lo que necesita (`flex: 0 1 auto`). La cabecera (`.mapa-tabs--inline`) ya no fuerza `nowrap`: si todo cabe va en una fila, como pedía la tarea 243; si no, el selector baja a una segunda fila alineado a la derecha.
  - **Selector de curso:** ya no se encoge (`flex-shrink: 0`), así que el de vista no puede taparlo.

## Archivos modificados

1. `frontend/src/app/layout/components/sidebar/sidebar.component.html`: el botón del mapa se mueve entre «Inicio» y «Nuevo proyecto».
2. `frontend/src/app/features/mapa-intermodular/components/ui/tabs/tabs.component.scss`:
   - `__extra` puede encogerse (`min-width: 0`, `max-width: 100%`); en móvil ocupa toda la fila y desde `lg` solo lo necesario.
   - El campo de curso no se encoge.
   - Se elimina el `nowrap` de `--inline` en `lg`, y la base del selector de ciclo baja de 22rem a 14rem para que la fila única quepa más a menudo.
3. `frontend/src/app/features/mapa-intermodular/components/ui/vista-toggle/vista-toggle.component.scss`:
   - El control segmentado usa `display: flex` sin `wrap`, con opciones `flex: 1 1 auto`, `min-width: 0` y texto centrado que puede partirse.
   - Las esquinas pasan a `$border-radius-lg` en el contenedor y `$border-radius-md` en las opciones, como el selector de curso.
   - El `:host` ocupa todo el ancho en móvil y solo el necesario desde `lg`.
4. `frontend/src/app/features/mapa-intermodular/components/mindmap/mindmap-view/mindmap-view.component.spec.ts`: el `beforeEach` limpia `sessionStorage` antes de crear el componente. La cesta se restaura de `sessionStorage` al construirse, y las unidades que dejaban otros specs (3005, 3060…) hacían fallar el test de soltar un módulo en la cesta según el orden de ejecución.
5. `backend/src/migrations/03_sync_ras_excel.ts`: se define `__dirname` con `fileURLToPath(import.meta.url)`, igual que en el resto de migraciones ESM. Antes lanzaba `ReferenceError: __dirname is not defined` y rompía cualquier instalación desde cero (apareció al levantar el entorno local con la base vacía). En producción ya está registrada en `migrations` y no se reejecuta.

## Decisiones técnicas

- **Corregir el desbordamiento en origen y no tocar la cesta:** se descartaron alternativas como `overflow-x: hidden` en el layout o compensar con `env(safe-area-inset-*)`. Ocultar el desbordamiento habría cortado el selector, y los insets no resuelven la ampliación del viewport. La causa real era un elemento que no podía encogerse.
- **Control segmentado de una fila en vez de píldora que salta de línea:** una píldora (`border-radius: full`) con varias filas siempre choca con sus esquinas. Con una fila y esquinas moderadas, una opción puede crecer en altura sin que nada se solape. Además es coherente con el selector de curso contiguo (AGENTS.md §5).
- **Fila única en escritorio solo si cabe:** se mantiene el objetivo de la tarea 243 (título, ciclo, curso, vista y filtros en una fila) cuando hay espacio. Cuando no lo hay, es mejor una segunda fila que aplastar el selector en tres líneas o que tape el curso.
- **Sin cambios de comportamiento ni de plantillas en el selector:** solo estilos, así que los specs existentes siguen siendo válidos sin cambios.

## Verificación

- `npm test` en `frontend/` (ESLint, Vitest, cobertura global y por archivo, comprobación zoneless): en verde tras cada uno de los tres cambios. La primera ejecución falló por el test de la cesta del mapa mental, que dependía del orden de ejecución; se corrigió (archivo 4).
- `npm test` en `backend/` con `MONGOMS_VERSION=4.4.29 MONGOMS_DISTRO=ubuntu-20.04` (equipo sin AVX): 496/496 en verde. Además, `npm run typecheck` sin errores tras corregir la migración 03.
- **Revisión visual:** entorno Docker local y Chromium headless con `puppeteer-core` (script temporal, eliminado después).
  - **Cesta:** con emulación de iPhone, el ancho del documento pasa de 512 a 390 px en las tres vistas, y la cesta queda a 16 px del borde.
  - **Selector:** medido a 360, 480, 700, 900, 1024, 1180, 1366 y 1920 px. Ninguna opción sale del contenedor y no hay desbordamiento horizontal. Las capturas confirman una fila única a 1920 px, segunda fila a 1024–1366 px y ancho completo en móvil.
  - **No revisado:** la variante de la ESO (mapa de afinidades, sin panorámica y con botón de ayuda) no se revisó visualmente; comparte los mismos estilos.
- **Despliegue:** commits `1a3e22f`, `fc47f22` y `bc80244` directamente en `main`. El CI y el workflow `Deploy` terminaron en verde en los tres casos, y la API de producción responde (401 sin sesión, lo esperado).

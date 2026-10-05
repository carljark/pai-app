# 196 · Selector de titulación y curso en el generador

## Propósito

La vista «Nuevo proyecto» mostraba CFGB, CFGM Estética, CFGM Peluquería, CFGS Educación Infantil y ESO como pestañas, y el curso en un desplegable aparte de la fila siguiente. Se unifica con el patrón del mapa intermodular (tarea 194): titulación en un desplegable y curso en un control segmentado que solo aparece si la titulación tiene más de un curso.

## Diseño

- **Titulación:** `app-select` (`#generator-level-select`) con las cinco titulaciones de `levelTabs`, traducidas con las mismas claves (`HISTORY_TAB_LABEL_KEYS`).
- **Curso:** botones segmentados (1.º/2.º en FP; 3.º/4.º en ESO) con `aria-pressed` y grupo etiquetado con `aria-labelledby`. En CFGM Estética, de un solo curso, no se muestra.
- **Distribución:** titulación y curso en la primera fila (se apilan en el móvil); metodología e IA/modelo pasan a la segunda.
- **Estilos:** clases BEM `generator-view__*` con las mismas variables que `.mapa-tabs`.
- Al cambiar de titulación, `CurriculumFacade.setTipoNivel` ya fija el curso por defecto (3.º en ESO, 1.º en el resto); no cambia.

## Corrección en `app-select`

Las opciones de `app-select` se renderizan después de aplicar `[value]` al `<select>`, así que el navegador mostraba la primera opción aunque el valor fuera otro (se veía «CFGB» con el currículo de CFGS cargado desde `localStorage`). Cada `<option>` lleva ahora `[selected]="option.value === value()"`. Afecta a todos los usos de `app-select`, que antes solo funcionaban cuando el valor coincidía con la primera opción o cambiaba después del primer render.

## Archivos

- `frontend/src/app/features/generator/components/generator-view/generator-view.component.{ts,html,scss,spec.ts}`: `levelOptions`, `onLevelChange`, plantilla y estilos nuevos; tests del desplegable real, de los botones de curso y de la ocultación del curso.
- `frontend/src/app/components/app-select/app-select.component.{html,spec.ts}`: `[selected]` en las opciones y test.

## Verificación

- ESLint, `ngc` y `tsc` del spec sin errores.
- `npm test` en frontend (723 tests, cobertura y zoneless) y backend (250 tests) en verde.
- Revisión visual con Playwright a 1200 px (CFGS, curso 2n) y 390 px (CFGM Estética, sin curso).

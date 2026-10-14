# Tarea 229: Filtros del historial en cascada y sin duplicados por idioma

## Propósito

Los filtros del historial («Archivo») no ayudaban a acotar: el desplegable de módulos mezclaba los de todos los niveles, el de RA listaba todos los RA si no se elegía módulo, el nivel estaba debajo de ambos y un mismo módulo o RA aparecía dos veces cuando había proyectos generados en castellano y en catalán (los proyectos guardan `modules` y `ras` como texto en el idioma en que se crearon).

El objetivo es filtrar como en el mapa intermodular, de lo general a lo específico (**nivel → curso → módulo → RA**), con una única opción por módulo o RA, nombrada en el idioma de la interfaz.

## Arquitectura y flujo

### Backend: índice del currículo para los filtros

`GET /api/curriculum/filter-index` (protegido) devuelve `{ modules, items }`:

- **Módulo** (`FilterModule`): `key`, `tipoNivel`, `es`, `ca` y `aliases` (los textos con los que lo guardan los proyectos: castellano, catalán y el `module` antiguo).
- **RA/CE** (`FilterItem`): lo mismo más `moduleKey` y `order` (número del RA o CE). Las etiquetas llevan el código delante («RA2. …», «CE3. …»).

Claves estables: FP `NIVEL|códigoMódulo|idRA`; ESO ordinaria `ESO_ORDINARIA|códigoMateria|CEn`; PDC `DIVERSIFICACION_CURRICULAR|materia|ce_id`. Los nombres en cada idioma se calculan con los mismos mapeadores que `GET /api/ras` y `GET /api/ces` (`mapRa`, `mapCe`, ahora exportados), y en la ESO los alias son el valor de selección «Materia · CEn. Descripción» en ambos idiomas.

Para no enviar todo el currículo, el índice solo incluye los módulos y RA/CE que aparecen en algún proyecto (`Project.distinct('modules' | 'ras')`), sin criterios, y `aliases` solo lleva los textos que no coinciden ya con `es` o `ca` (el frontend busca también por estos).

Los textos se comparan normalizados (`normalizeText`, la misma regla en backend y frontend): sin tildes, mayúsculas ni puntuación, y sin la numeración inicial («1. », «RA2) ») con la que los proyectos antiguos de FP Básica guardaban los RA.

### Frontend

- `history/utils/curriculum-resolver.ts`: `CurriculumResolver` traduce los textos de cada proyecto a opciones (`FilterOption`) buscando la etiqueta o el alias normalizados **dentro del nivel del proyecto**. Un texto que no está en el índice se convierte en una opción propia (`txt|…`), agrupada por texto normalizado. Cachea el resultado por proyecto (`WeakMap`).
- `history/utils/filter-options.ts`: recopilar opciones únicas, ordenar módulos según el orden oficial del catálogo (`cursos[].modulos`) y RA por número, y pasar a `SelectOption` en el idioma activo.
- `history/services/history-filters.facade.ts` (nuevo, `providedIn: 'root'`): todo el estado de filtros con signals. Las opciones de cada nivel salen de los proyectos que pasan los filtros anteriores (nivel, curso y «Solo mis proyectos»). Cambiar un filtro reinicia los posteriores; además, curso, módulo y RA solo cuentan si siguen siendo opciones válidas (el nivel puede cambiar desde fuera, p. ej. al generar un proyecto). Al seguir en la fachada raíz, los filtros se conservan al volver al historial.
- `history/components/history-filters/` (nuevo): barra de filtros. Nivel (desplegable), curso (botones segmentados como en el mapa, con «Todos», solo si el nivel tiene más de un curso), módulo y RA. El de RA está desactivado hasta elegir módulo («Elige antes un módulo»). En la ESO las etiquetas pasan a «Materia» y «CE».
- `history-view`: queda como contenedor (pestañas de autoría, buscador, contador y lista) y recarga el índice al abrirse para incluir los proyectos nuevos.
- `history-filter.ts`: el filtro de módulo/RA compara claves con el resolvedor (`matchesCurriculum`); `matchesScope` agrupa nivel, curso y autoría. Se añade `projectCurso` (curso del proyecto o de su contenido generado). Se eliminan `collectModuleOptions`/`collectRaOptions`.

La búsqueda por palabras sigue abarcando todos los niveles y cursos (nivel y curso se atenúan), pero las opciones de módulo y RA siguen siendo las del nivel elegido, para que no reaparezcan módulos con el mismo nombre de otros ciclos.

## Archivos modificados

1. `backend/src/controllers/curriculum-index.controller.ts` (nuevo): construcción del índice y endpoint.
2. `backend/src/controllers/curriculum.controller.ts`: exporta `mapRa` y `mapCe`.
3. `backend/src/routes/curriculum.routes.ts`: ruta `/curriculum/filter-index`.
4. `backend/src/tests/curriculum-index.test.ts` (nuevo): agrupación ES/CA, CE de ESO y PDC, RA antiguos numerados o sin nivel ni código, alias extra y error 500.
5. `frontend/src/app/features/history/utils/curriculum-resolver.ts` y `filter-options.ts` (nuevos) con su spec `curriculum-resolver.spec.ts`.
6. `frontend/src/app/features/history/services/history-filters.facade.ts` (nuevo) y su spec.
7. `frontend/src/app/features/history/components/history-filters/` (nuevo: ts, html, scss y spec).
8. `frontend/src/app/features/history/components/history-view/`: usa la fachada y el nuevo componente; se retiran los estilos de los filtros antiguos.
9. `frontend/src/app/features/history/utils/history-filter.ts` y su spec: filtros por clave y por curso.
10. `frontend/src/app/services/translations.es.ts` / `translations.ca.ts`: claves `historyFilterCourse`, `historyFilterAllCourses`, `historyFilterSubject`, `historyFilterCe`, `historyFilterAllSubjects`, `historyFilterAllCes`, `historyFilterPickModule`, `historyFilterPickSubject`; el aviso de búsqueda habla de «nivel» en vez de «pestaña».
11. `frontend/src/app/testing/filter-index.mock.ts` (nuevo): índice de prueba compartido por las specs.
12. `documentation/niveles_educativos_y_catalogo.md`: menciona los filtros en cascada.

## Decisiones técnicas

- **Índice en el backend en lugar de cargar `GET /api/ras` en los dos idiomas:** esa respuesta incluye los criterios de todos los ciclos (varios cientos de KB por idioma) y no cubre las CE de la ESO y el PDC. El índice limitado a lo que usan los proyectos es pequeño y reúne todos los niveles en una sola petición.
- **Sin migración de datos:** no se reescriben `modules`/`ras` de los proyectos; la agrupación se resuelve al leer, de modo que también funciona con proyectos antiguos o importados.
- **Búsqueda del alias por nivel:** módulos transversales (FOL, Inglés profesional…) o RA con el mismo texto en varios ciclos no se mezclan.
- **Textos fuera del índice:** se muestran tal cual en lugar de ocultarse, para no perder proyectos con currículos retirados o nombres antiguos. En producción quedan así 56 textos de RA (51 de proyectos antiguos de FP Básica con redacciones que ya no están en el currículo, p. ej. de Comunicación y sociedad o traducciones antiguas al catalán, y 5 de CFGM Estética) y 4 de módulo; esos sí pueden aparecer una vez por idioma. Corregirlo exigiría una migración que reescriba `ras`/`modules` de esos proyectos, que no se ha hecho.
- **Fachada raíz en vez de estado en el componente:** el componente de la vista ya rondaba las 200 líneas (ts + html); separar estado (fachada) y presentación (`history-filters`) los deja pequeños y permite reutilizar los filtros.

## Verificación

- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 38 archivos, 442 tests en verde.
- `cd frontend && npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npm test` (lint, tests, cobertura global y por archivo, zoneless): 76 archivos en verde (1 test omitido, preexistente).
- Despliegue con `./scripts/deploy-prod.sh` (copia de seguridad previa, migraciones al día).
- Comprobación de solo lectura contra los datos de producción (script temporal en el contenedor del backend, eliminado después): 81 proyectos; 67 textos de módulo distintos quedan en 49 opciones y 252 textos de RA/CE en 206.

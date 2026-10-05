# Tarea 198: Niveles educativos desde el catálogo

> **Plan:** [002 — Niveles educativos desde el catálogo](../planes/002_plan_niveles_desde_el_catalogo.md)

## Propósito

Tras la tarea 197, el catálogo `backend/src/data/niveles.ts` alimentaba el generador, pero los niveles seguían escritos a mano en unos 20 archivos: historial, «Mis proyectos», inicio, Taller, exportación, fachada curricular, mapa intermodular, modelos de Mongo, palabras clave de la IA y nombre del curso en el prompt. Con cada ciclo nuevo había que tocarlos todos, y ya había fallos por eso (el mapa de CFGS decía «Retos CFGM»).

Ahora **añadir un nivel es añadir su entrada al catálogo y sus datos**; el frontend no se toca. Además se retiran del bundle los RA de respaldo (`curriculum/data/ras_*.data.ts`, ~600 KB).

## Arquitectura y flujo

```
backend/src/data/niveles.ts ──► GET /api/niveles ──► NivelesService (signal)
        │                                                  │
        ├─ NIVEL_IDS ─► Project.tipoNivel, RA.tipoNivel    ├─ generador (titulación, cursos)
        ├─ MAPA_TABS ─► MapaModule.tab, GET /api/mapa…     ├─ CurriculumFacade (módulos y orden por curso)
        ├─ nombrePrompt ─► describeTargetCourse            ├─ historial (pestañas), «Mis proyectos» (filtros)
        └─ palabrasClave ─► LEVEL_KEYWORDS (INTEF)         ├─ inicio, Taller (pipe nivelNombre), exportación
                                                           └─ mapa (selector, selección inicial, títulos)
```

- **Catálogo (backend):** campos nuevos `nombrePrompt_es/ca`, `palabrasClave`, `cursos[].modulos` (orden oficial de los módulos de cada curso) y `mapas` (pestaña histórica, curso y selección inicial). Exporta `DEFAULT_TIPO_NIVEL`, `MAPA_TABS` y `nombrePrompt()`.
- **Backend:** `describeTargetCourse` es genérico; `LEVEL_KEYWORDS` sale de `palabrasClave`; `MapaModule` y `mapa.controller` validan contra `MAPA_TABS`; `RA.tipoNivel` se valida contra `NIVEL_IDS`. Las reglas propias de FP Básica y de la ESO siguen como lógica con nombre propio.
- **Frontend:** `NivelesService` ofrece `find`, `nombreDe`, `cursos`, `cursoPorDefecto`, `modulos`, `usaRa`, `nivelPorDefecto`, `mapaTabs`, `mapaTab` y `sigla`. `HistoryTab` y `ProjectType` pasan a ser el `tipoNivel` (string); `normalizeTipoNivel` trata los valores antiguos (vacío → `FP_BASICA`, `ESO` → `DIVERSIFICACION_CURRICULAR`).
- **Ajuste al cargar el catálogo:** `CurriculumFacade` lee nivel y curso de `localStorage` sin validarlos y, con un `effect`, los corrige cuando llega el catálogo (p. ej. 4.º guardado en CFGM Estética → 1.º).
- **Mapa:** `MapaIntermodularFacade` abre el primer mapa del catálogo cuando este llega; el selector agrupa las pestañas por nivel; cabecera y actividades usan el nombre y la sigla de la etapa.
- **Migración 24:** recarga los RA de CFGM Estética (ver «Decisiones técnicas»).

## Archivos modificados

### Backend
1. `backend/src/data/niveles.ts`: campos nuevos con los valores que antes estaban en el frontend (orden de módulos de `curriculum-grouping.ts`, ids y selección inicial de `mapa-tabs.config.ts`), `DEFAULT_TIPO_NIVEL`, `MAPA_TABS`, `nombrePrompt`.
2. `backend/src/controllers/project.controller.ts`: `describeTargetCourse` genérico; `DEFAULT_TIPO_NIVEL` en lugar de `'FP_BASICA'` literal.
3. `backend/src/services/ai.service.ts`: `LEVEL_KEYWORDS` desde el catálogo.
4. `backend/src/models/MapaModule.ts`, `controllers/mapa.controller.ts`: enum y validación con `MAPA_TABS`.
5. `backend/src/models/RA.ts`, `models/Project.ts`: validación y valor por defecto desde el catálogo.
6. `backend/src/migrations/24_reingest_cfgm_estetica_ras.ts` (nueva): recarga idempotente de los RA de Estética.
7. `backend/src/tests/niveles-catalogo.test.ts` (nuevo) y `tests/migrations.test.ts`: coherencia del catálogo (pestañas y selección del mapa idénticas a las de antes, módulos que cubren exactamente los RA de cada ciclo, `tipoNivel`/`tab` de datos y migraciones presentes en el catálogo), prompt, palabras clave, validación de modelos y migración 24.

### Frontend
1. `services/niveles.service.ts`: helpers del catálogo, `mapaTabs`, `error`.
2. `features/projects/models/project.model.ts`: `ProjectType`/`HistoryTab` como string, `DEFAULT_TIPO_NIVEL`, `normalizeTipoNivel`; fuera `getHistoryTabForTipoNivel`, `HISTORY_TAB_LABEL_KEYS`, `courseLevelLabelKey`, `isFPProject`, `isESOProject`.
3. `features/projects/mappers/projects.mapper.ts`: `mapTipoNivel` acepta cualquier id.
4. `features/projects/pipes/course-level-key.pipe.ts` → `nivel-nombre.pipe.ts`: nombre del nivel desde el catálogo (impuro, por los signals).
5. `features/projects/services/projects.facade.ts`: fuera `fpProjects`, `esoProjects` y `searchQuery` (sin uso); módulos y nombre por defecto desde el catálogo.
6. `features/history/utils/history-filter.ts`, `history-view.component.{ts,html,scss}`: pestañas del catálogo, `matchesTab` por nivel normalizado, aviso si el catálogo no carga.
7. `features/personal/.../personal-view.component.{ts,html}`, `features/home/.../home-dashboard.component.ts`, `features/admin/.../export-selection.component.ts`, `features/taller/.../taller-view.component.{ts,html}`, `app.facade.ts`: filtros y etiquetas desde el catálogo.
8. `features/curriculum/services/curriculum.facade.ts`, `utils/curriculum-grouping.ts`: fuera `FP_CYCLES`, `COURSE_ORDERS`, `CFGM_*_ORDER`, `cursosValidos`, `isFpCycle` y los RA de respaldo; ajuste del nivel/curso al cargar el catálogo.
9. `features/curriculum/data/ras_*.data.ts`: **eliminados**.
10. `features/mapa-intermodular/services/mapa-tabs.config.ts`: **eliminado**; nuevo `utils/mapa-labels.ts` (nombres de pestaña y cursos ES/CA). Facade, servicio, `tabs`, `header`, `activities-grid`, `connections-list` y la vista usan el catálogo.
11. `services/translations.{es,ca}.ts`: fuera las claves `courseLevel{FP,CFGM,CFGMPeluqueria,CFGSEducacionInfantil,ESO,PDC}`; nueva `levelsLoadError`.
12. `testing/niveles.mock.ts` (nuevo): copia del catálogo y `NIVEL_FICTICIO` para las specs; specs actualizadas y nuevas (`curriculum-grouping.spec.ts`, `nivel-nombre.pipe.spec.ts`, nivel ficticio en generador, historial y «Mis proyectos», mapa de Infantil 2.º en catalán con clicks reales).

### Documentación
- `documentation/niveles_educativos_y_catalogo.md`: campos, consumidores y «Cómo añadir un nivel» (catálogo + datos + migración).
- Skill `agregar-fp` (`SKILL.md`, `references/checklist_archivos.md`, `scripts/scaffold_cfgm.py`, `scripts/verify_cfgm_integration.sh`): el frontend ya no se toca; el script de verificación comprueba la entrada del catálogo y avisa si el frontend nombra el nivel.

## Decisiones técnicas

- **Catálogo por HTTP** (`GET /api/niveles`), cargado al iniciar sesión junto a los RA, en lugar de copiarlo al frontend. Mientras carga, las listas están vacías un instante.
- **Ids de pestaña del mapa conservados** (`FPB`, `CFGM`, `CFGM_PELUQUERIA_2`…) y declarados en el catálogo: sin migrar `MapaModule.tab`. En el historial la pestaña es directamente el `tipoNivel` (solo existía en memoria).
- **Mapa sin curso:** el mapa de FP Básica abarca los dos cursos y el de Estética no fijaba curso; por eso los mapas van en `mapas` del nivel con `curso` opcional (ver desviaciones). El subtítulo usa el curso del mapa o, si el nivel tiene un único curso, ese curso.
- **`modulos` también en Estética:** antes solo ordenaba; ahora además filtra y ordena los módulos del proyecto generado, igual que en los ciclos de dos cursos. Cubren todos los RA (lo comprueba un test).
- **Título del mapa homogéneo:** «Mapa intermodular del …» para todos los niveles (antes FP Básica decía «Mapa Intermodular CFGB …»).
- **RA de Estética en producción:** al revisar los datos reales, la colección `ras` de producción no tenía ningún RA de `CFGM_ESTETICA` (sí la local, 47). El generador los tomaba de la copia de respaldo del bundle, que esta tarea elimina. No se ha podido identificar qué los borró (la migración 03, que vacía la colección, se ejecutó antes que la 04). La migración 24 los recarga desde `ras_cfgm_estetica.data.ts` (que ya incluye el catalán corregido de la 17); solo toca ese nivel y es idempotente.
- **Exportación (admin):** muestra el nombre oficial del catálogo en lugar de los nombres cortos («FP Básica», «Diversificación»); un proyecto sin nivel se muestra como FP Básica.

## Verificación

- **Backend:** `npm test` → 24 archivos, 283 tests en verde. En una de las ejecuciones fallaron 2 tests de `feedback.test.ts` (no relacionados); pasan aislados y en la ejecución completa siguiente. El `tsc --noEmit` del backend ya fallaba antes por la resolución de módulos `nodenext` en todos los imports relativos (problema previo, no de esta tarea).
- **Frontend:** `npm test` (ESLint, 54 archivos y 745 tests, cobertura global y por archivo, comprobación zoneless) en verde; `ngc -p tsconfig.app.json --noEmit` y `tsc -p tsconfig.spec.json --noEmit` sin errores.
- **Bundle** (`ng build --configuration production`): inicial **2,25 MB → 1,69 MB** (transferencia estimada 466 kB → 395 kB).
- **Revisión con Playwright** (entorno Docker local): desplegable y pestañas del historial con los 6 niveles del catálogo; un curso 4.º guardado en Estética pasa a 1.º al cargar; CFGS Educación Infantil 2.º muestra solo sus 9 módulos en orden oficial; mapa de Infantil 2.º en catalán con título «Mapa intermodular del CFGS Educació Infantil 2n», subtítulo «… de 2n curs», «Mòduls CFGS» y «Propostes d’Activitats i Reptes CFGS». En móvil (390 px) la cabecera y el selector se ven bien; hay desbordamiento horizontal por los chips de criterios relacionados de `connections-list`, previo y fuera del alcance de esta tarea.
- **Producción:** despliegue con `./scripts/deploy-prod.sh` (copia de seguridad previa). `GET /api/mapa-intermodular?tab=CFGS_EDUCACION_INFANTIL_2` devuelve sus 9 módulos y una pestaña inexistente da 400. Los `tipoNivel` de `ras` y `projects` y los `tab` de `mapamodules` de producción están todos en el catálogo.

## Desviaciones respecto al plan

- **`mapas` en el nivel, no `cursos[].mapa`:** el mapa de FP Básica cubre los dos cursos, así que no puede colgar de uno. Cada entrada de `mapas` lleva un `curso` opcional.
- **`nombrePrompt_es/ca` opcional:** si falta, se usa el nombre oficial (CFGM y CFGS no lo necesitan).
- **Migración nueva (24):** el plan no preveía escrituras de datos. Se añadió al descubrir que producción no tenía los RA de Estética y que, sin el respaldo del bundle, su selector quedaría vacío.
- **Spec del nivel ficticio:** en lugar de un único spec, el `NIVEL_FICTICIO` del catálogo de prueba se cubre en los specs del generador, el historial y «Mis proyectos».

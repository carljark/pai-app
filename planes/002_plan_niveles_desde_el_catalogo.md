# Plan 002: Niveles educativos desde el catálogo (sin listas escritas a mano)

> **Fecha:** 5 de octubre de 2026
> **Estado:** Implementado (tarea 198)
> **Partes afectadas:** backend / frontend / despliegue (sin migraciones de datos)

---

## 1. Objetivo

Tras el plan 001, el catálogo `backend/src/data/niveles.ts` ya alimenta el generador, pero los niveles siguen escritos a mano en unos **20 archivos**: historial, «Mis proyectos», inicio, Taller, exportación, la fachada curricular (cursos válidos y orden de módulos), el mapa intermodular, los modelos de Mongo, las palabras clave de la IA y el nombre del curso en el prompt. Con cada ciclo FP nuevo hay que tocarlos todos, y ya hay fallos por eso:
- **Mapa:** en CFGS aparece «Propuestas de Actividades y Retos **CFGM**».
- **Taller:** mostraba «FP Básica» para cualquier ciclo hasta la tarea 197.

El objetivo es que **añadir un nivel sea añadir una entrada al catálogo y sus datos**, sin tocar el frontend.

Además se retiran del bundle del frontend los **600 KB de RA de respaldo** (`curriculum/data/ras_*.data.ts`). Con todos los FP de Baleares harían crecer el bundle sin límite (AGENTS.md §8 avisa del riesgo de OOM al compilar en el EC2). Los RA ya están en MongoDB.

## 2. Escenarios

- **Escenario: un nivel nuevo aparece en todas partes sin tocar el frontend**
  - **Dado** un nivel añadido solo al catálogo (en el test, uno ficticio)
  - **Cuando** se cargan el generador, el historial, «Mis proyectos» y el inicio
  - **Entonces** el nivel aparece con su nombre ES/CA en el desplegable, en las pestañas, en los filtros y en las tarjetas de proyecto.
- **Escenario: las pestañas del historial siguen el orden del catálogo**
  - **Dados** proyectos de FP, ESO y PDC
  - **Cuando** se abre el historial
  - **Entonces** hay una pestaña por nivel del catálogo y cada proyecto sale en la de su `tipoNivel`.
- **Escenario: proyectos antiguos sin nivel o con `ESO`**
  - **Dado** un proyecto sin `tipoNivel` o con el alias antiguo `ESO`
  - **Cuando** se muestra
  - **Entonces** va a la pestaña de FP Básica o a la del PDC, como ahora.
- **Escenario: cursos y curso por defecto desde el catálogo**
  - **Dado** un curso guardado en `localStorage` que el nivel no tiene (p. ej. 4.º en CFGM Estética)
  - **Cuando** se carga el catálogo
  - **Entonces** el curso pasa al primero del nivel.
- **Escenario: módulos de cada curso desde el catálogo**
  - **Dado** CFGS Educación Infantil 2.º
  - **Cuando** se carga el selector curricular
  - **Entonces** aparecen solo los módulos de 2.º y en el orden oficial, tomados de `cursos[].modulos` del catálogo.
- **Escenario: sin RA de respaldo en el bundle**
  - **Dado** que la API de RA responde
  - **Cuando** se compila el frontend
  - **Entonces** `ras_*.data.ts` ya no existen y el bundle inicial baja de tamaño (se mide antes y después).
- **Escenario: mapa intermodular desde el catálogo**
  - **Dado** un curso con `mapa` en el catálogo
  - **Cuando** se abre el mapa
  - **Entonces** el desplegable de ciclo y los botones de curso salen del catálogo, y el título y los textos usan su nombre y su etapa («Retos CFGS» en Educación Infantil).
- **Escenario: el backend valida contra el catálogo**
  - **Dado** un `tab` de mapa o un `tipoNivel` que no está en el catálogo
  - **Cuando** se pide el mapa o se guarda un proyecto
  - **Entonces** se rechaza; los valores del catálogo se aceptan.
- **Escenario: el prompt usa el nombre del catálogo**
  - **Dado** cualquier nivel
  - **Cuando** se describe el curso destino
  - **Entonces** sale de `nombrePrompt_es/ca` del catálogo, con los mismos textos que hoy (los tests actuales de `describeTargetCourse` no cambian).

## 3. Alternativas

**A. Cómo llega el catálogo al frontend**
- Copiarlo en un archivo TypeScript del frontend: funciona sin red, pero vuelve a duplicar la fuente.
- **Recomendada: `GET /api/niveles`, que ya existe, y `NivelesService`.** Se carga al iniciar sesión, igual que los RA. Mientras carga, las vistas muestran listas vacías un instante.

**B. Identificadores de pestaña (historial y mapa)**
- Renombrar los ids antiguos (`FPB`, `CFGM`, `ESO` para PDC, `CFGM_PELUQUERIA_2`…) a `tipoNivel`: exige migrar `MapaModule.tab` en producción.
- **Recomendada:**
  - **Historial:** usar directamente el `tipoNivel` (no hay nada guardado con los ids antiguos; solo existen en memoria).
  - **Mapa:** conservar sus ids y declararlos en el catálogo (`cursos[].mapa`). Así no hay migración de datos.

**C. RA de respaldo del frontend**
- Mantenerlos: hay respaldo si falla la API, pero el bundle crece con cada ciclo.
- **Recomendada: eliminarlos.** MongoDB es la fuente; si la API falla, el selector muestra el error, como ya pasa con la ESO.

**D. Reglas específicas de un nivel en el prompt** (Carpeta de Aprendizaje de FPB, reglas de la ESO)
- **Recomendada:** dejarlas como comportamiento con nombre propio en el backend. Son lógica, no datos. El catálogo solo sustituye listas y nombres.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/niveles.ts` | Campos nuevos: `nombrePrompt_es/ca`, `palabrasClave`, `cursos[].modulos` (orden oficial de módulos FP) y `cursos[].mapa` (id del mapa, módulo y RA iniciales) | domain |
| `backend/src/controllers/project.controller.ts` | `describeTargetCourse` genérico con `nombrePrompt` | application |
| `backend/src/services/ai.service.ts` | `LEVEL_KEYWORDS` sale del catálogo | application |
| `backend/src/models/MapaModule.ts`, `controllers/mapa.controller.ts` | Enum y `ALLOWED_TABS` derivados del catálogo (`MAPA_TABS`) | domain / presentation |
| `backend/src/models/RA.ts` | Validación de `tipoNivel` contra el catálogo | domain |
| `frontend/src/app/services/niveles.service.ts` | Helpers: `cursos(id)`, `cursoPorDefecto(id)`, `modulos(id, curso)`, `usaRa(id)`, `mapaTabs()`, `nombre(id, isCa)` | frontend |
| `frontend/.../projects/models/project.model.ts` | `HistoryTab` pasa a ser el `tipoNivel`; `normalizeTipoNivel` para legacy (vacío → FPB, `ESO` → PDC); fuera `HISTORY_TAB_LABEL_KEYS`, `isFPProject`, `isESOProject` | frontend |
| `frontend/.../projects/pipes/course-level-key.pipe.ts` → `nivel-nombre.pipe.ts` | Nombre del nivel desde el catálogo (para Taller, inicio y «Mis proyectos») | frontend |
| `frontend/.../history/utils/history-filter.ts`, `history-view.component.ts` | Pestañas desde el catálogo; `matchesTab` = mismo nivel normalizado | frontend |
| `frontend/.../personal/.../personal-view.component.ts`, `home/.../home-dashboard.component.ts` | Filtros y etiquetas desde el catálogo | frontend |
| `frontend/.../admin/.../export-selection.component.ts` | Etiqueta desde el catálogo | frontend |
| `frontend/.../projects/mappers/projects.mapper.ts` | `mapTipoNivel` acepta cualquier id; solo normaliza vacío y alias | frontend |
| `frontend/.../projects/services/projects.facade.ts` | Fuera `fpProjects`/`esoProjects` (sin uso); módulos y nombre por defecto desde el catálogo | frontend |
| `frontend/.../curriculum/services/curriculum.facade.ts`, `utils/curriculum-grouping.ts` | Fuera `FP_CYCLES`, `COURSE_ORDERS`, `CFGM_*_ORDER`, `cursosValidos` y fallbacks; ajuste del curso al cargar el catálogo | frontend |
| `frontend/.../curriculum/data/ras_*.data.ts` | **Eliminados** (600 KB) | frontend |
| `frontend/.../mapa-intermodular/services/mapa-tabs.config.ts` | Sustituido por `mapaTabs()` del catálogo | frontend |
| `frontend/.../mapa-intermodular/components/ui/{header,activities-grid,tabs}` | Textos con nombre y etapa del nivel, no `=== 'FPB'` | frontend |
| `frontend/src/app/services/translations.{es,ca}.ts` | Fuera las claves `courseLevel*` que dejen de usarse | frontend |
| `documentation/niveles_educativos_y_catalogo.md`, skill `agregar-fp` | «Cómo añadir un nivel» queda en: catálogo + datos + migración | docs |

## 5. Tareas

- [ ] Rama `feature/007_niveles_desde_catalogo` desde `feature/006_eso_ordinaria`.
- [ ] Medir el tamaño del bundle actual (`ng build`, sin desplegar) como referencia.
- [ ] Backend: campos nuevos del catálogo con los valores actuales (orden de módulos de `curriculum-grouping.ts`, ids y selección inicial de `mapa-tabs.config.ts`), y tests.
- [ ] Backend: `describeTargetCourse`, `LEVEL_KEYWORDS`, `MapaModule`/`mapa.controller` y `RA` desde el catálogo. Los tests actuales siguen pasando sin cambiar sus expectativas.
- [ ] Frontend: helpers de `NivelesService` y pipe `nivelNombre`, con specs.
- [ ] Frontend: historial, «Mis proyectos», inicio, Taller, exportación y mapper.
- [ ] Frontend: fachada curricular y agrupado (cursos, módulos, eliminar fallbacks y datos `ras_*`).
- [ ] Frontend: mapa intermodular (selector, cabecera y actividades) con clicks reales en el DOM y textos ES/CA.
- [ ] Spec con un nivel ficticio de catálogo que atraviesa generador, historial y «Mis proyectos».
- [ ] Limpiar traducciones sin uso y actualizar la documentación y la skill `agregar-fp`.
- [ ] Lint, typecheck y `npm test` en backend y frontend; revisión con Playwright (generador, historial, mapa de Infantil 2.º en catalán, móvil).
- [ ] Commit, push y `./scripts/deploy-prod.sh`; comprobar `GET /api/mapa-intermodular?tab=CFGS_EDUCACION_INFANTIL_2` y el historial.
- [ ] `/registrar-tarea`.

## 6. Riesgos y verificación prevista

- **Arranque sin catálogo:** las vistas dependen de `GET /api/niveles`. Si falla, el historial no tendría pestañas. Se mitiga mostrando un mensaje de error y cubriéndolo con un test, y la carga va junto a la de los RA, que ya es imprescindible.
- **Sin RA de respaldo:** si la API de RA falla, el selector queda vacío. Hoy ya pasa con la ESO y el PDC.
- **Mapa:** al conservar los ids de pestaña no hay migración. La selección inicial pasa al catálogo y un test compara cada valor con el actual.
- **Datos y migraciones:** ninguna escritura; solo cambian validaciones. Un test comprueba que todos los `tipoNivel` y `tab` existentes en los JSON de datos están en el catálogo.
- **Paridad ES/CA:** nombres del catálogo en los dos idiomas; specs en castellano y catalán.
- **Cobertura y límites:** cobertura por archivo del 90 % (80 % de funciones en `.html`). Los componentes tocados que ya superan 200 líneas (Taller, `personal-view`) no crecen, y la lógica nueva va a servicios y pipes.
- **Zoneless:** signals y `computed`; las specs usan `await fixture.whenStable()`.
- **Despliegue:** sin migraciones. La reconstrucción del frontend en el EC2 debería ser más ligera sin los `ras_*`.

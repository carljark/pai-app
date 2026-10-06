# Tarea 200: Selección de criterios de evaluación en la ESO y el PDC

> **Plan:** [003 — Selección de criterios de evaluación en la ESO y el PDC](../planes/003_plan_seleccion_criterios_evaluacion_eso.md)

## Propósito

Hasta ahora, al elegir una competencia específica (CE) de la ESO o del PDC, el prompt recibía todos sus criterios de evaluación del curso. Ahora cada CE muestra sus criterios, el docente puede marcarlos uno a uno o con «Seleccionar todos los criterios», y el proyecto se crea y se evalúa a partir de los criterios elegidos. Funciona en castellano y catalán.

## Arquitectura y flujo

1. `GET /api/ces` devuelve en cada CE `criteriosDetalle: [{ id, text }]` del curso pedido (ESO ordinaria y PDC; el PDC acepta ahora `curso`).
2. El selector despliega los criterios de cada CE (`CeCriteriosListComponent`). `CriteriosFacade` guarda solo las elecciones **parciales**: una CE seleccionada sin entrada equivale a todos sus criterios.
3. La petición de generación añade `criteriosSeleccionados: [{ ce, ids[] }]` solo si hay elecciones parciales.
4. El backend (`criterios.service.ts`) valida la selección y construye el prompt:
   - 400 si la lista está mal formada, la CE no está seleccionada, no tiene criterios o un id no existe en esa CE y curso;
   - la CE lista solo los criterios elegidos con su numeración oficial y el prompt añade la regla de cobertura (`COBERTURA_CRITERIOS`);
   - sin selección, comportamiento anterior (todos los criterios del curso).
5. El proyecto guarda `criteriosSeleccionados`; el reintento reutiliza el prompt ya guardado.

## Contraste con la CAIB

Se descargaron los 53 documentos oficiales de la web LOMLOE de la CAIB y se comprobó que los textos catalanes de los datos aparecen literalmente en ellos: 922/922 en la ESO ordinaria y 255/256 en el PDC. La única diferencia es una coma corregida en Física y Química 4.º (criterio 3.1), que el original escribe con punto. Por eso **no hay migración nueva**: los datos ya eran correctos.

## Archivos modificados

1. `backend/src/services/criterios.service.ts` (nuevo): normalización de criterios del PDC, validación, filtrado y regla de cobertura.
2. `backend/src/services/eso-curriculum.service.ts`: `criteriosDetalle` en la API y filtrado por ids en el prompt.
3. `backend/src/controllers/curriculum.controller.ts`: `GET /api/ces` del PDC con `curso` y `criteriosDetalle`.
4. `backend/src/controllers/project.controller.ts`: lectura y validación de `criteriosSeleccionados` (400 si es inválida) y extracción de `describeSelection`/`describeRaSelection`.
5. `backend/src/models/Project.ts`: campo `criteriosSeleccionados`.
6. `backend/src/tests/criterios.test.ts` (nuevo, 14 tests); `eso.test.ts` y `projects.test.ts` actualizados al formato normalizado de los criterios del PDC («1.1: texto»).
7. `frontend/.../curriculum/services/criterios.facade.ts` (nuevo) y `components/ce-criterios-list/` (nuevo, con plantilla, estilos BEM y spec).
8. `frontend/.../curriculum/`: modelo (`CriterioItem`, `CriterioSeleccionado`), agrupación (`groupCes`, `groupEsoCes`, `buildItemLookup`), fachada (`loadCes(lang, curso)`, `key` y `criteriosTotal` en el carrito) y selector.
9. `frontend/src/app/app.facade.ts`: las CE del PDC se recargan al cambiar de curso o idioma (ya no se cargan al iniciar sesión).
10. `frontend/.../projects/`: `CreateProjectPayload`, `projects.facade.ts` y `projects.mapper.ts` envían `criteriosSeleccionados`.
11. `translations.es.ts` / `translations.ca.ts`: `criteriaTitle`, `selectAllCriteria`, `criteriaShort`.
12. `documentation/niveles_educativos_y_catalogo.md`: sección «Selección de criterios de evaluación».

## Decisiones técnicas

- **Elección parcial en lugar de lista completa.** Seleccionar una CE equivale a «todos»; así `toggleRa` y el carrito no cambian y no hay estados a sincronizar. Las entradas de CE deseleccionadas se descartan con un `effect`.
- **Sin migración de datos.** Los criterios del PDC (formatos «3º ESO - 1.1», «1.1 (4º ESO)», «CA 1.1», «1.1») se normalizan al vuelo. Los de la ESO ordinaria ya estaban por curso.
- **Ids inexistentes y CE sin criterios: 400**, decisión del plan.
- **Corrección colateral:** el botón de quitar del carrito usaba el texto de la CE y no su valor de selección, por lo que en la ESO ordinaria no la quitaba. Ahora usa `key`.
- **Mapper:** `toCreateProjectPayload` descartaba el campo nuevo; lo detectó el test de `ProjectsFacade`.
- **Fuera de alcance:** RA de FP; el glosario de traducción no cambia (la CE se identifica igual).

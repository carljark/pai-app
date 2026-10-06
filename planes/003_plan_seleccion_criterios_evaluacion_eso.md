# Plan 003: Selección de criterios de evaluación en la ESO y el PDC

> **Fecha:** 6 de octubre de 2026
> **Estado:** Aprobado
> **Partes afectadas:** backend / frontend / migraciones (solo si el contraste con la CAIB detecta diferencias) / despliegue

---

## 1. Objetivo

En «Crear proyecto», las CE de la ESO (ordinaria) y del PDC se seleccionan hoy como una unidad: el prompt recibe **todos** los criterios de la CE para el curso y el docente no puede elegir. Se quiere que cada CE muestre sus criterios de evaluación, que cada criterio se pueda marcar por separado, y que haya una opción **«Seleccionar todos los criterios»** por CE. El proyecto generado se crea y se evalúa **a partir de los criterios seleccionados**. Todo en castellano y catalán, con los textos oficiales de la web LOMLOE de la CAIB (<https://www.caib.es/sites/lomloe/ca/eso_materies/>).

Estado actual (investigado):
- **ESO ordinaria:** ya hay 189 CE y 733 criterios ES/CA en `backend/src/data/curriculo-eso/*.json` (Decreto 42/2025, tarea 197), con `criteriosPorCurso`. La API los devuelve como `criterios: string[]` pero el selector no los muestra.
- **PDC:** las 65 CE vienen de `backend/ces_eso_bilingual.json` (migración 06), con criterios `{criterio_id: "3º ESO - 1.1", description}` y sin variante ES/CA diferenciada por campo en el JSON de origen (hay que comprobarlo). Cubre 8 materias en 3.º y 4.º.

## 2. Escenarios

- **Escenario: ver los criterios de una CE**
  - **Dado** ESO ordinaria 2.º con la API cargada
  - **Cuando** el docente despliega una CE de una materia
  - **Entonces** ve sus criterios del curso con numeración oficial (1.1, 1.2…), en el idioma activo.
- **Escenario: seleccionar todos los criterios de una CE**
  - **Dada** una CE desplegada
  - **Cuando** marca «Seleccionar todos los criterios»
  - **Entonces** la CE y todos sus criterios quedan marcados; al desmarcarlo, se desmarca todo.
- **Escenario: seleccionar criterios sueltos**
  - **Dada** una CE sin seleccionar
  - **Cuando** marca el criterio 1.2
  - **Entonces** la CE pasa a seleccionada con solo el 1.2; si desmarca el último criterio, la CE se deselecciona.
- **Escenario: el carrito muestra los criterios elegidos**
  - **Dados** criterios marcados
  - **Cuando** se abre el carrito
  - **Entonces** cada CE indica «n de m criterios» y se pueden quitar criterios o la CE entera.
- **Escenario: el proyecto se genera solo con los criterios elegidos**
  - **Dada** una generación con la CE1 y sus criterios 1.1 y 1.3
  - **Cuando** el backend construye el prompt
  - **Entonces** el prompt lista únicamente 1.1 y 1.3 (numeración oficial) y ordena que el proyecto y la rúbrica los cubran todos y no evalúen otros.
- **Escenario: compatibilidad con CE sin criterios elegidos**
  - **Dada** una petición antigua o de FP, con CE y sin `criteriosSeleccionados`
  - **Cuando** se genera
  - **Entonces** se usan todos los criterios del curso, como hasta ahora.
- **Escenario: PDC**
  - **Dado** el PDC 3.º
  - **Cuando** se despliega una CE de Matemáticas
  - **Entonces** salen sus criterios de 3.º (no los de 4.º) y funcionan igual que en la ESO ordinaria.
- **Escenario: paridad ES/CA**
  - **Dado** cualquier CE de ESO o PDC
  - **Cuando** se pide en `es` y en `ca`
  - **Entonces** devuelve los mismos ids de criterio, en el mismo orden, con texto en su idioma (test sobre todos los datos).
- **Escenario: reintento y regeneración**
  - **Dado** un proyecto con criterios seleccionados que falla o se reintenta
  - **Cuando** se reencola
  - **Entonces** conserva los mismos criterios.
- **Escenario: criterio inexistente**
  - **Dado** un id de criterio que no pertenece a la CE o al curso
  - **Cuando** se genera
  - **Entonces** se rechaza con 400 (o se ignora y se avisa; ver decisión abierta).

## 3. Alternativas

**A. Modelo de selección**
- Meter los criterios en `selectedRas` (strings sueltos): no obliga a tocar el modelo, pero mezcla CE y criterios y rompe `matchingProjects`, el glosario de traducción y el historial.
- **Recomendada:** mantener `selectedRas` (CE) y añadir `criteriosSeleccionados: { ce: string; ids: string[] }[]` en la petición y en `Project`. Es aditivo: sin él, se usan todos los criterios (retrocompatible, sin migración de proyectos existentes).

**B. Origen de los datos**
- Recargar todo desde la web de la CAIB: lento y frágil (HTML).
- **Recomendada:** los JSON de la ESO ya extraídos del decreto son la fuente. Se **contrastan** con la web LOMLOE de la CAIB (conteo de CE y criterios por materia y curso, y textos) y, si hay diferencias, se corrigen con una migración nueva (25) idempotente. Para el PDC se normalizan sus criterios al mismo formato `criteriosPorCurso` (ids y cursos) y se verifica ES/CA; si el PDC tiene más materias/ámbitos en la CAIB, se amplían.

**C. UI**
- **Recomendada:** CE con `<details>`; dentro, un checkbox «Seleccionar todos los criterios» y la lista de criterios. Nuevo componente standalone `ce-criterios-list` para respetar el límite de 200 líneas del selector.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/services/eso-curriculum.service.ts` | `mapEsoCes` devuelve `criteriosDetalle: {id, text}[]`; `describeEsoCeForPrompt` acepta ids elegidos y añade la regla de cobertura; validación de ids | application |
| `backend/src/controllers/curriculum.controller.ts` | `GET /api/ces` para PDC con curso y criterios `{id, text}`; mismo formato que la ESO | presentation |
| `backend/src/controllers/project.controller.ts` | Lee `criteriosSeleccionados`, filtra criterios del prompt (ESO y PDC), valida ids, lo guarda en el proyecto y lo conserva en el reintento (el método de enriquecimiento se extrae a helper por el límite de 25 líneas) | presentation |
| `backend/src/models/Project.ts`, `CE.ts` | Campo `criteriosSeleccionados`; PDC con `criteriosPorCurso` | domain |
| `backend/src/migrations/25_*.ts` | Normaliza criterios del PDC a `criteriosPorCurso` y corrige diferencias con la CAIB (solo `tipoNivel` ESO/PDC; idempotente) | migraciones |
| `backend/src/data/curriculo-eso/*.json`, `backend/ces_eso_bilingual.json` | Correcciones tras el contraste con la CAIB (si las hay) | data |
| `backend/src/services/translation.service.ts` | El glosario reconoce los criterios elegidos | application |
| `frontend/.../curriculum/models/curriculum.model.ts` | `CriterioItem`, `criteriosSeleccionados` | frontend |
| `frontend/.../curriculum/services/curriculum.facade.ts` | Estado `selectedCriterios` (signal), `toggleCriterio`, `toggleAllCriterios`, sincronía CE↔criterios, limpieza al cambiar de nivel/curso/idioma | frontend |
| `frontend/.../curriculum/components/ce-criterios-list/` (nuevo) | Lista de criterios con «Seleccionar todos» (html, scss BEM, ts, spec) | frontend |
| `curriculum-selector.component.html/ts` | Integra la lista y el resumen «n de m criterios» en el carrito | frontend |
| `projects` (modelo, mapper, facade), `app.facade.ts` | Envía y recupera `criteriosSeleccionados`; `matchingProjects` sigue por CE | frontend |
| `translations.es.ts` / `translations.ca.ts` | Textos nuevos en ambos idiomas | frontend |
| `backend/src/tests/eso.test.ts`, `curriculum.test.ts`, `projects.test.ts` y specs | Un test por escenario, incluida paridad ES/CA sobre los datos | tests |
| `documentation/niveles_educativos_y_catalogo.md` | Sección de selección de criterios | docs |

## 5. Tareas

- [ ] Contrastar con la web LOMLOE de la CAIB (materias ESO y PDC): CE, criterios, cursos y texto en ES/CA; listar diferencias en un informe temporal.
- [ ] Decidir y aplicar correcciones (migración 25 si afectan a datos; rama `feature/NNN_seleccion_criterios_eso`).
- [ ] Backend: formato `criteriosDetalle`, PDC por curso, `criteriosSeleccionados` en petición/modelo/prompt/reintento/traducción.
- [ ] Frontend: fachada, componente `ce-criterios-list`, carrito, traducciones ES/CA.
- [ ] Tests por escenario; cobertura ≥ 90 % global y por archivo (frontend), `.html` ≥ 80 % de funciones; clics reales en el DOM.
- [ ] Lint, typecheck, `npm test` en backend y frontend; commit, push, backup y despliegue con `./scripts/deploy-prod.sh`.
- [ ] `/registrar-tarea` y actualización del README de planes.

## 6. Riesgos y verificación prevista

- **Datos:** divergencia entre decreto y web CAIB, o entre ES y CA; se detecta con el contraste y un test de paridad. La migración solo toca CE de ESO/PDC y es idempotente; backup previo en producción.
- **Prompt:** si hay pocos criterios elegidos, el proyecto puede quedar corto; el prompt exige cubrirlos todos y se avisa de la regla de numeración oficial.
- **Retrocompatibilidad:** proyectos antiguos sin `criteriosSeleccionados` siguen igual (sin migración de proyectos).
- **Frontend:** componente zoneless con signals, BEM, plantilla/estilos en archivos propios, funciones ≤ 25 líneas, selector ≤ 200 líneas (por eso el componente nuevo).
- **Verificación:** `cd backend && npm test`, `cd frontend && npm test` (incluye ESLint, cobertura por archivo y `check-zoneless.js`), `npx ngc -p tsconfig.app.json --noEmit`, comprobación manual en local de ESO 2.º y PDC 3.º, y de contenedores/migraciones/API tras el despliegue.

## 7. Decisiones (resueltas el 6 de octubre de 2026)

1. Ids de criterio inexistentes: **se rechazan** (400).
2. Se exige **al menos un criterio** por CE seleccionada.
3. Los RA de FP quedan **fuera** de este plan.

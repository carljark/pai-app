# Plan 255: Revisión automática del proyecto con IA

> **Fecha:** 12 de noviembre de 2026
> **Estado:** Implementado (tarea 255)
> **Partes afectadas:** backend / frontend

---

## 1. Objetivo
Añadir al taller un botón **«Revisar con IA»** que evalúe el proyecto generado (o editado) según unas dimensiones fijas. La revisión da a cada dimensión una nota de 1 a 5, una justificación breve y sugerencias concretas de mejora, además de un resumen global. La idea viene del módulo de evaluación de TriQuest (arXiv 2510.03369), adaptado a Plappin: RA/CE oficiales, FP y ESO, castellano y catalán. Así el docente tiene una segunda mirada crítica antes de llevar el proyecto al aula, sin que la IA cambie el texto por su cuenta.

## 2. Escenarios
- **Escenario: revisión de un proyecto propio**
  - **Dado** un docente con permiso de IA y un proyecto con contenido
  - **Cuando** pulsa «Revisar con IA»
  - **Entonces** el backend responde 202, marca `review.status = 'revisando'` y, al terminar, guarda `status = 'completada'` con 9 dimensiones (nota de 1 a 5, justificación y sugerencias), una nota global y un resumen; el panel se actualiza por SSE.
- **Escenario: revisión en el idioma del proyecto**
  - **Dado** un proyecto en catalán
  - **Cuando** se revisa
  - **Entonces** justificaciones, sugerencias y resumen están en catalán, y los nombres de las dimensiones salen de las traducciones de la interfaz (no del texto de la IA).
- **Escenario: revisión desactualizada**
  - **Dado** un proyecto revisado cuyo contenido se edita después (`contentVersion` aumenta)
  - **Cuando** se abre el taller
  - **Entonces** el panel muestra la revisión con el aviso «El proyecto ha cambiado desde esta revisión» y el botón «Volver a revisar».
- **Escenario: dos revisiones a la vez**
  - **Dado** una revisión en curso
  - **Cuando** se pide otra
  - **Entonces** responde 409, salvo que la anterior lleve más de 15 minutos (bloqueo caducado, como en la traducción).
- **Escenario: sin permiso de IA**
  - **Dado** un usuario `pending` o con `canUseAi = false`
  - **Cuando** pide una revisión
  - **Entonces** responde 403.
- **Escenario: proyecto ajeno**
  - **Dado** un usuario que no es propietario, colaborador ni administrador
  - **Cuando** pide la revisión
  - **Entonces** responde 404.
- **Escenario: respuesta de la IA no válida**
  - **Dado** que la IA devuelve un JSON mal formado o notas fuera de rango tras toda la cascada
  - **Cuando** termina la revisión
  - **Entonces** queda `status = 'error'` con un mensaje legible, y el panel ofrece reintentar.
- **Escenario: proyecto sin contenido**
  - **Dado** un proyecto en cola o con error de generación
  - **Cuando** se pide la revisión
  - **Entonces** responde 400.

## 3. Alternativas
1. **Revisión síncrona** (la petición espera la respuesta de la IA). Es simple, pero la IA tarda de 30 s a varios minutos: hay riesgo de timeouts y se bloquea la pestaña.
2. **Revisión asíncrona con estado en el proyecto y aviso por SSE** (**recomendada**). Es el mismo patrón que la traducción (`translation.controller.ts`): bloqueo con un `updateOne` condicional, estado en Mongo y notificación por SSE. Sobrevive a recargas y a cambios de pestaña, y reutiliza código probado.
3. **Revisión + «Aplicar sugerencia»** (reescribir la sección con `/rewrite`). Es muy útil, pero duplica el alcance. Se deja para una tarea posterior: las sugerencias ya llevan la sección a la que se refieren, para poder enlazarlo después.

Se guarda **solo la última revisión** (no un historial): da el valor necesario con menos datos. Las notas son **de 1 a 5 y enteras**, que son más estables entre modelos que una escala de 0 a 100.

**Dimensiones propuestas** (ids estables en inglés y textos en las traducciones):
`curricularAlignment` (RA/CE y numeración oficial), `coherence` (esqueleto, fases y producto final), `drivingQuestion` (pregunta motriz y autenticidad), `activities` (reto y adecuación al nivel), `assessment` (instrumentos, criterios y rúbricas), `integration` (intermodularidad o interdisciplinariedad real), `inclusion` (DUA y atención a la diversidad), `timing` (temporización realista) y `clarity` (redacción y formato).

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/models/Project.ts` | Subesquema `review`: `status` (`revisando`/`completada`/`error`), `startedAt`, `finishedAt`, `contentVersion`, `language`, `usedModel`, `overall`, `summary`, `dimensions[]` (`id`, `score`, `justification`, `suggestions[]`, `section?`) y `error` | domain |
| `backend/src/services/project-review.service.ts` (nuevo) | Lista `REVIEW_DIMENSIONS`, `buildReviewPrompt(project, language)` (contexto curricular: nivel, módulos y RA/CE seleccionados), `parseReview(text)` (extrae el JSON, valida ids, notas enteras de 1 a 5 y listas no vacías) y cálculo de la nota global | application |
| `backend/src/controllers/project-review.controller.ts` (nuevo) | `POST /:id/review` (validación, bloqueo, 202 y ejecución en segundo plano con `generateAiContentWithFallback`, guardado, SSE y `ActivityLog`), `GET /:id/review` y `failInterruptedReviews()` al arrancar | presentation |
| `backend/src/routes/project.routes.ts` | Dos rutas nuevas con `requireApproved` y `requireAiAccess` (solo en el POST) | presentation |
| `backend/src/server.ts` | Llamar a `failInterruptedReviews()` junto a `failInterruptedTranslations()` | config |
| `backend/src/tests/project-review.test.ts` (nuevo) | Escenarios de §2, con la IA simulada | test |
| `frontend/src/app/features/taller/components/project-review/` (nuevo: `.ts`, `.html`, `.scss`, `.spec.ts`) | Panel BEM `.project-review`: botón, estado en curso, nota global, tarjetas por dimensión (nota, justificación y sugerencias), aviso de desactualizada y reintento | presentation |
| `frontend/src/app/features/taller/services/project-review.service.ts` (nuevo) | Llamadas HTTP y signal con la revisión, que se actualiza con el evento SSE | application |
| `frontend/src/app/features/taller/components/taller-view/taller-view.component.html` | `<app-project-review>` junto a `<app-translation-banner>` (sin añadir lógica al componente, que ya tiene 309 líneas) | presentation |
| `frontend/src/app/services/translations.es.ts` / `translations.ca.ts` | Textos del panel y nombres de las 9 dimensiones con paridad ES/CA | presentation |
| `frontend/src/app/features/help/tours/…` | Paso nuevo de la visita guiada del taller | presentation |
| `documentation/revision_automatica_proyectos.md` (nuevo) | Flujo, dimensiones, prompt, proveedor y modelo, y límites | docs |

## 5. Tareas
- [ ] Crear la rama `feature/255_revision_automatica_proyecto`.
- [ ] Añadir el subesquema `review` al modelo (sin migración: es opcional).
- [ ] `project-review.service.ts` con prompt, parser y tests unitarios del parser (JSON en bloque de código, notas fuera de rango, dimensiones que faltan).
- [ ] Controlador, rutas y recuperación al arrancar, más los tests de integración de §2.
- [ ] Servicio y componente del frontend, traducciones ES/CA, paso de la visita guiada y specs con clicks reales en el DOM.
- [ ] Lint y typecheck, suites completas, documentación y registro de la tarea 255.
- [ ] Commit, push, CI en verde, integración en `main` y seguimiento del despliegue.

## 6. Riesgos y verificación prevista
- **Coste y tiempo de IA:** se envía el proyecto entero (de 35.000 a 85.000 caracteres). Se usa el proveedor y modelo del proyecto con la cascada habitual, **sin razonamiento** por defecto (el proyecto ya está diseñado), y una salida JSON corta.
- **JSON poco fiable:** el parser tolera bloques ```json``` y texto alrededor; si la validación falla, se pide una corrección una vez antes de marcar el error.
- **Paridad ES/CA:** las dimensiones van por id y sus textos en las traducciones; los tests comprueban ambos idiomas.
- **Cobertura por archivo (90 %, y 80 % de funciones en `.html`):** specs del panel en todos sus estados.
- **Límites:** el componente del panel se queda por debajo de 200 líneas y las funciones por debajo de 25; `taller-view` no crece en TypeScript.
- **Zoneless:** el estado en signals; los tests con `await fixture.whenStable()`.
- **Sin migraciones ni riesgo de datos:** un campo nuevo opcional.
- **Verificación:** `cd backend && npm run typecheck && npm test`; `cd frontend && npx eslint <archivos> && npm test`; prueba manual en Docker con un proyecto de FP y otro de ESO en catalán.

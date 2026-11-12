# Tarea 255: Revisión automática del proyecto con IA

> **Plan:** [255 — Revisión automática del proyecto con IA](../planes/255_plan_revision_automatica_proyecto.md)

## Propósito
Dar al docente una segunda mirada crítica sobre el proyecto generado o editado, sin que la IA toque el texto. El botón «Revisar con IA» del taller valora el proyecto en nueve aspectos (alineación curricular, coherencia, pregunta motriz, actividades, evaluación, integración, inclusión/DUA, temporización y claridad). Cada aspecto recibe una nota entera de 1 a 5, una justificación y sugerencias concretas, y hay además un resumen global. La idea procede del módulo de evaluación de TriQuest (arXiv 2510.03369), adaptado a los RA/CE oficiales, a FP y ESO y al castellano y el catalán.

## Arquitectura y flujo
- **Modelo:** subdocumento `review` en `Project`: `status` (`revisando`/`completada`/`error`), `startedAt`, `finishedAt`, `contentVersion` revisada, `language`, `usedModel`, `overall`, `summary`, `dimensions[]` (`id`, `score`, `justification`, `suggestions`, `section?`) y `error`. Es opcional, así que no hace falta migración.
- **Servicio** (`project-review.service.ts`):
  - prompt con el contexto curricular (nombre oficial del nivel, curso, módulos y RA/CE) y el formato JSON esperado;
  - instrucción de sistema en el idioma del proyecto;
  - `parseReview`, que valida estrictamente la respuesta y calcula la nota global como media;
  - `requestProjectReview`, que llama a `generateAiContentWithFallback` sin razonamiento y, si la respuesta no es válida, repite una vez con el proveedor y modelo que respondieron.
- **Controlador** (`project-review.controller.ts`):
  - `POST /api/projects/:id/review` (`requireApproved`, `requireAiAccess`, `requireProjectEditor`): toma el bloqueo con un `updateOne` condicional (caduca a los 15 min), responde 202 y revisa en segundo plano;
  - `GET /api/projects/:id/review` devuelve `{ review, stale }`;
  - `failInterruptedReviews` se ejecuta al arrancar el servidor;
  - registra `REVIEW_PROJECT` en `ActivityLog`.
- **Frontend:**
  - `ProjectReviewFacade` lanza la revisión y la sigue por sondeo cada 4 s, como la traducción, con toast al terminar y reanudación tras recargar;
  - `app-project-review`, bajo el aviso de traducción del taller, es un panel plegable con la nota global, avisos (en curso, error, desactualizada) y tarjetas por aspecto en orden fijo;
  - quien no puede editar ve la última revisión sin botón.

## Archivos modificados
1. `backend/src/models/Project.ts`: esquemas `ReviewDimensionSchema` y `ReviewSchema`, y campo `review`.
2. `backend/src/services/project-review.service.ts` (nuevo): aspectos, prompt, validación y petición a la IA.
3. `backend/src/controllers/project-review.controller.ts` (nuevo): endpoints, bloqueo, ejecución en segundo plano y recuperación al arrancar.
4. `backend/src/routes/project.routes.ts`: rutas `POST` y `GET` `/:id/review`.
5. `backend/src/server.ts`: llamada a `failInterruptedReviews()` al arrancar.
6. `backend/src/tests/project-review.test.ts` (nuevo): 25 tests (prompt, parser, reintento, permisos, 409, 400, error de la IA, reinicio y GET).
7. `backend/src/tests/mapa.test.ts`: límite de 30 s en el test de la migración 49, que superaba los 5 s con cobertura en equipos lentos (fallo previo, ajeno a la tarea).
8. `frontend/src/app/features/projects/models/project-review.model.ts` (nuevo) + spec: tipos, `REVIEW_DIMENSIONS`, `isReviewInProgress` e `isReviewStale`.
9. `frontend/src/app/features/projects/models/project.model.ts`, `mappers/projects.mapper.ts` (+ spec) y `services/projects.service.ts`: campo `review`, su mapeo y `reviewProject()`.
10. `frontend/src/app/features/projects/services/project-review.facade.ts` (nuevo) + spec.
11. `frontend/src/app/features/taller/components/project-review/` (nuevo: `.ts`, `.html`, `.scss` con BEM y variables corporativas, `.spec.ts`).
12. `frontend/src/app/features/taller/components/taller-view/taller-view.component.{ts,html}`: se importa y coloca `<app-project-review>`, sin lógica nueva en el componente.
13. `frontend/src/app/services/translations.{es,ca}.ts`: textos del panel y nombres de los aspectos con paridad ES/CA.
14. `frontend/src/app/features/help/i18n/help.{es,ca}.ts`: pregunta frecuente sobre la revisión.
15. `documentation/revision_automatica_proyectos.md` (nuevo).

## Decisiones técnicas
- **Asíncrona con estado en Mongo y sondeo**, igual que la traducción: una revisión puede tardar minutos con proyectos de 35.000 a 85.000 caracteres; así sobrevive a recargas y no bloquea la petición.
- **Sin razonamiento**: el proyecto ya está diseñado y la salida es un JSON corto; el razonamiento multiplicaría el tiempo.
- **Nota global calculada en el backend** (media), no pedida a la IA, para que sea coherente con las notas parciales.
- **Validación estricta y un solo reintento**: es mejor un error claro que una revisión incompleta.
- **Permiso de editor, sin turno de edición**: la revisión se guarda en el proyecto, pero no cambia su contenido.
- **Solo la última revisión**: es suficiente y evita crecer el documento.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npx vitest run --coverage`: 42 archivos y 521 tests en verde; cobertura del 98,9 % en instrucciones, 93,8 % en ramas, 100 % en funciones y 99 % en líneas. Los archivos nuevos superan el 98 %.
- `cd frontend`: `npx eslint` sobre los archivos tocados (0 hallazgos), `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit` (sin errores).
- `cd frontend && npm test`: lint, tests, cobertura global y por archivo (99,4 % en instrucciones y 97,7 % en ramas) y comprobación zoneless, todo en verde.
- No se ha probado a mano en Docker contra una IA real; se verificará en producción tras el despliegue.

## Desviaciones respecto al plan
- **Seguimiento por sondeo en lugar de SSE:** la traducción, que era el modelo a seguir, ya funciona así.
- **Facade en `features/projects/services/`** (junto a la de traducción), no en `features/taller/services/`.
- **Sin paso nuevo en la visita guiada:** se recorre sobre el proyecto de ejemplo, que es de solo lectura, así que el panel no aparecería. En su lugar hay una pregunta frecuente en la ayuda.
- **Sin petición de corrección:** en lugar de pedir a la IA que corrija su respuesta, se repite la petición una vez.
- **Proyecto ajeno:** responde 403 (lo hace el middleware existente `requireProjectEditor`), no 404.
- **Fuera de la tarea:** se ajustó el límite de tiempo de un test pesado de `mapa.test.ts`.

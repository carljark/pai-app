# Revisión automática de proyectos con IA

El taller ofrece **«Revisar con IA»**: la IA valora el proyecto en nueve aspectos con una nota entera de 1 a 5, una justificación y sugerencias concretas, además de un resumen global. **No modifica el texto**: es una segunda mirada crítica para el docente. Idea inspirada en el módulo de evaluación de TriQuest (arXiv 2510.03369), adaptada a los RA/CE oficiales y a FP y ESO.

## Aspectos
Los ids son estables y los comparten el backend (`services/project-review.service.ts`) y el frontend (`features/projects/models/project-review.model.ts`). Los nombres visibles salen de las traducciones (`reviewDimensions`), nunca del texto de la IA.

| Id | Qué valora |
|---|---|
| `curricularAlignment` | RA/CE con numeración oficial, trabajados y evaluados |
| `coherence` | Hilo lógico de fases, sesiones y actividades hasta el producto final |
| `drivingQuestion` | Pregunta motriz y producto final auténticos |
| `activities` | Reto adecuado al nivel, actividades concretas y realizables |
| `assessment` | Instrumentos, criterios y rúbricas coherentes |
| `integration` | Intermodularidad o interdisciplinariedad real |
| `inclusion` | DUA y atención a la diversidad |
| `timing` | Temporización realista |
| `clarity` | Redacción, estructura y formato |

La **nota global** la calcula el backend como media de las nueve, con un decimal; no se pide a la IA.

## Flujo
1. `POST /api/projects/:id/review` (requiere cuenta aprobada, permiso de IA y ser autor, colaborador o administrador; no exige el turno de edición porque no cambia el contenido).
   - 400 si el proyecto aún no tiene contenido; 409 si ya hay una revisión en curso.
   - Toma el bloqueo con un `updateOne` condicional sobre `review.status` (caduca a los 15 min, `REVIEW_LOCK_MS`) y responde 202 con el proyecto en `revisando`. La revisión anterior se conserva hasta que termina la nueva.
2. `runProjectReview` (en segundo plano, mismo patrón que la traducción):
   - revisa el **original** (`generatedContent.rawText`) y responde en el idioma del proyecto;
   - usa el proveedor y modelo elegidos en el taller (o los de la generación), con la cascada habitual y **sin razonamiento**: el proyecto ya está diseñado y la salida es un JSON corto;
   - si la respuesta no es válida (JSON roto, falta un aspecto, nota fuera de 1-5 o no entera, sin sugerencias) repite **una vez** con el proveedor y modelo que respondieron; si vuelve a fallar, `review.status = 'error'`;
   - al terminar guarda `review` con `contentVersion`, `language`, `usedModel`, `startedAt` y `finishedAt`, y registra `REVIEW_PROJECT` en `ActivityLog`.
3. `GET /api/projects/:id/review` devuelve `{ review, stale }` (lo usará el servidor MCP).
4. Al arrancar el servidor, `failInterruptedReviews` marca como fallidas las revisiones que quedaron en `revisando`.

## Frontend
- `ProjectReviewFacade` sigue la revisión por sondeo cada 4 s (como `ProjectTranslationFacade`), reanuda el seguimiento tras recargar y avisa con un toast al terminar.
- `app-project-review` (bajo el aviso de traducción del taller) muestra el botón, el estado en curso, los avisos de error y de revisión desactualizada (`review.contentVersion` distinto del actual) y, al desplegar, el resumen y una tarjeta por aspecto con la nota coloreada (≥ 4 bien, 3 media, ≤ 2 floja).
- Quien puede ver el proyecto pero no editarlo ve la última revisión, sin botón.

## Límites y siguientes pasos
- Se guarda solo la última revisión, no un historial.
- No hay «Aplicar sugerencia»: las sugerencias indican el apartado (`section`) para poder enlazarlas en el futuro con la reescritura de secciones (`/api/projects/rewrite`).

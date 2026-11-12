# Tarea 260: Aplicar las sugerencias de la revisión con IA

> **Plan:** [260 — Aplicar las sugerencias de la revisión con IA](../planes/260_plan_aplicar_sugerencias_revision.md)

## Propósito
Completar la revisión con IA de la tarea 255: además de ver qué mejorar, el docente puede **aplicar** cada sugerencia (o todas las pendientes de un aspecto) con un clic. La IA reescribe solo el apartado afectado y el cambio entra en el editor del taller, desde donde se puede deshacer. Además, a petición del usuario, el modelo de IA de la revisión solo lo ven los administradores.

## Arquitectura y flujo
- **Frontend:**
  - en cada aspecto, `app-review-suggestions` muestra las sugerencias con «Aplicar», «Aplicar todas» (si quedan dos o más pendientes), «Aplicando…» y «✓ Aplicada»;
  - los botones solo aparecen con permiso de IA y de edición y con el turno de edición propio, y se desactivan mientras la IA trabaja;
  - `ReviewApplyFacade` repite el flujo del asistente: `pushUndo` → petición → texto en el editor → guardar como borrador (`updateProjectStatus('borrador')`) → marcar las sugerencias en la copia local; si falla, `popUndo` y aviso (con el 409 del turno, el aviso de siempre).
- **Backend:**
  - `POST /api/projects/:id/review/apply` (`{ context, dimension, index?, aiProvider, aiModel }`);
  - las sugerencias se leen de la revisión guardada;
  - `review-apply.service.ts` localiza el apartado con `markdown-sections.ts`, reescribe solo ese fragmento y lo valida (si no lo encuentra, reescribe el documento completo con el prompt del asistente y comprueba que la respuesta no llegue cortada);
  - responde el documento nuevo sin guardarlo y añade las claves a `review.applied`.
- **Marcas:** se conservan al recargar. Una revisión nueva sustituye el subdocumento `review` y empieza sin marcas.

## Archivos modificados
1. `backend/src/services/markdown-sections.ts` (nuevo): `normalizeHeading`, `findSection`, `sectionText`, `replaceSection` y `extractSection`.
2. `backend/src/services/review-apply.service.ts` (nuevo): selección de sugerencias, instrucción, prompt del apartado, validación y `applySuggestions`.
3. `backend/src/controllers/review-apply.controller.ts` (nuevo) y `routes/project.routes.ts`: el endpoint.
4. `backend/src/controllers/project-review.controller.ts`: se exporta `resolveAiChoice`.
5. `backend/src/controllers/project.controller.ts`: se exporta `buildRewritePrompt`.
6. `backend/src/services/project-review.service.ts`: se exporta `dimensionCriterion`.
7. `backend/src/models/Project.ts`: `review.applied`.
8. `backend/src/mcp/tools/project.tools.ts`: `extractSection` pasa a `markdown-sections.ts` (lectura por apartados del MCP, ahora sin tildes ni numeración).
9. `backend/src/tests/review-apply.test.ts` (nuevo): 18 tests.
10. `frontend/src/app/features/projects/models/project-review.model.ts` (+ spec): `applied`, `ApplySuggestionResponse`, `suggestionKey` e `isSuggestionApplied`.
11. `frontend/src/app/features/projects/services/projects.service.ts`: `applyReviewSuggestion`.
12. `frontend/src/app/features/projects/services/review-apply.facade.ts` (nuevo, con spec).
13. `frontend/src/app/features/taller/components/review-suggestions/` (nuevo, con spec).
14. `frontend/src/app/features/taller/components/project-review/` (`.ts`, `.html`, `.scss`, spec): usa el subcomponente, añade `canApply` e `isAdmin` y solo muestra el modelo a los administradores.
15. `frontend/src/app/services/translations.{es,ca}.ts`: textos nuevos.
16. `documentation/revision_automatica_proyectos.md`: sección «Aplicar sugerencias».

## Decisiones técnicas
- **Reescribir solo el apartado:** reescribir el documento entero sería lento y la respuesta podría cortarse con proyectos de 35.000 a 85.000 caracteres; también podría tocar lo que no debe. La reescritura completa queda solo como alternativa cuando no se encuentra el apartado.
- **Sin guardar en el servidor:** el cambio pasa por el editor, para que el docente lo vea y pueda deshacerlo; se guarda como borrador igual que con el asistente.
- **Sugerencias leídas de la revisión guardada:** el cliente solo indica el aspecto y el índice, así que no puede colar instrucciones arbitrarias por este camino.
- **Sin razonamiento** en la llamada: el cambio está definido por la sugerencia.
- **Subcomponente `review-suggestions`:** evita que `project-review` crezca por encima del límite.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npx vitest run --coverage`: 46 archivos y 590 tests en verde; cobertura del 99,1 % en instrucciones, 94 % en ramas, 100 % en funciones y 99,2 % en líneas.
- `cd frontend`: `npx eslint` y `npx tsc -p tsconfig.spec.json --noEmit` sin errores. `npm test`: 137 archivos y 1235 tests en verde, con la cobertura por archivo y la comprobación zoneless cumplidas.
- No se ha probado todavía con una IA real; queda para producción, con un proyecto revisado.

## Desviaciones respecto al plan
- **El endpoint no recibe `language`:** la IA conserva el idioma del texto que se edita.
- **«Aplicar todas»** solo aparece con dos o más sugerencias pendientes.
- **Endpoint en un controlador propio** (`review-apply.controller.ts`) en lugar de ampliar `project-review.controller.ts`.
- **Además del plan:** el modelo de IA de la revisión solo lo ven los administradores (petición del usuario durante la tarea).

# Plan 260: Aplicar las sugerencias de la revisión con IA

> **Fecha:** 13 de noviembre de 2026
> **Estado:** Implementado (tarea 260)
> **Partes afectadas:** backend / frontend

---

## 1. Objetivo
Completar la revisión con IA (tarea 255): cada sugerencia de la revisión tendrá un botón **«Aplicar»**, y cada aspecto, **«Aplicar todas»**. La IA reescribe **solo el apartado afectado** con esa mejora, el cambio entra en el editor del taller como cualquier cambio del asistente (se puede deshacer) y la sugerencia queda marcada como aplicada. Así el docente pasa de «qué mejorar» a «mejorado» sin redactar la instrucción a mano.

## 2. Escenarios
- **Escenario: aplicar una sugerencia en su apartado**
  - **Dado** una revisión completada con la sugerencia «Añadir instrumentos de autoevaluación» en el apartado «Evaluación»
  - **Cuando** el docente pulsa «Aplicar»
  - **Entonces** la IA reescribe solo el apartado «Evaluación», el resto del documento queda idéntico, el editor muestra el texto nuevo, se guarda como borrador y la sugerencia aparece como «Aplicada».
- **Escenario: deshacer**
  - **Dado** una sugerencia recién aplicada
  - **Cuando** el docente pulsa «Deshacer» en el taller
  - **Entonces** vuelve el texto anterior, como con el asistente.
- **Escenario: aplicar todas las de un aspecto**
  - **Cuando** el docente pulsa «Aplicar todas» en un aspecto
  - **Entonces** se aplican en una sola petición las sugerencias pendientes de ese aspecto sobre su apartado.
- **Escenario: apartado no encontrado**
  - **Dado** una sugerencia sin apartado, o con un apartado que ya no existe
  - **Cuando** se aplica
  - **Entonces** se reescribe el documento completo con la instrucción, como hace el asistente.
- **Escenario: respuesta truncada o vacía**
  - **Dado** que la IA devuelve un apartado vacío o sin su encabezado
  - **Cuando** se aplica
  - **Entonces** responde 502 «No se pudo aplicar la sugerencia» y el texto no cambia.
- **Escenario: permisos y turno**
  - **Dado** un usuario sin permiso de IA, que no es editor del proyecto o con el turno de edición de otra persona
  - **Cuando** aplica una sugerencia
  - **Entonces** recibe 403 o 409, igual que con el asistente.
- **Escenario: sugerencia inexistente**
  - **Cuando** se pide aplicar un aspecto o un índice que no existe en la revisión guardada
  - **Entonces** responde 400.
- **Escenario: marca persistente**
  - **Dado** una sugerencia aplicada
  - **Cuando** se recarga el taller
  - **Entonces** sigue marcada como aplicada.
  - **Y si** se vuelve a revisar el proyecto, la revisión nueva empieza sin marcas.
- **Escenario: revisión desactualizada**
  - **Dado** una revisión marcada como desactualizada porque el proyecto cambió
  - **Entonces** las sugerencias se pueden seguir aplicando; el aviso de «desactualizada» se mantiene.

## 3. Alternativas
1. **Reutilizar tal cual el asistente del taller (`/rewrite`)**, componiendo la instrucción desde la sugerencia. No requiere backend nuevo, pero reescribe el documento entero en una llamada: es lento y, con proyectos largos, se arriesga a que la respuesta se corte. Además puede tocar partes que no debía.
2. **Endpoint nuevo que reescribe solo el apartado de la sugerencia** (**recomendada**). El backend localiza el apartado por su encabezado, pide a la IA solo ese fragmento con la mejora, valida la respuesta y devuelve el documento recompuesto. Es más rápido, más barato, no toca el resto y la respuesta no se corta. Si no encuentra el apartado, recurre a la reescritura completa del asistente.
3. **Aplicar en segundo plano y guardar en el servidor**, como la revisión. Es más robusto con proyectos enormes, pero el cambio no pasaría por el editor ni por «Deshacer». Descartada: el docente debe ver el cambio y poder revertirlo.

El texto que se modifica es el que muestra el editor (puede ser la traducción o tener cambios sin guardar), igual que con el asistente.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/services/markdown-sections.ts` (nuevo) | `findSection(text, heading)` (coincidencia flexible: sin mayúsculas, tildes ni numeración) y `replaceSection(text, range, newSection)`. Lo reutiliza el MCP (`extractSection` pasa aquí) | application |
| `backend/src/services/review-apply.service.ts` (nuevo) | Instrucción a partir de una o varias sugerencias, prompt de reescritura del apartado, validación de la respuesta y recomposición; si no hay apartado, recurre a `buildRewritePrompt` | application |
| `backend/src/controllers/project-review.controller.ts` | `POST /:id/review/apply` (`{ context, dimension, index?, language, aiProvider, aiModel }`; sin `index`, todas las pendientes del aspecto): responde `{ newText, section }`, marca `review.applied` y registra `APPLY_REVIEW_SUGGESTION` | presentation |
| `backend/src/models/Project.ts` | `review.applied: [String]` (claves `aspecto:índice`); al lanzar una revisión nueva se vacía | domain |
| `backend/src/routes/project.routes.ts` | Ruta con `requireApproved`, `requireAiAccess` y `projectEditGuards` | presentation |
| `backend/src/mcp/tools/project.tools.ts` | Usa `markdown-sections.ts` | presentation |
| `backend/src/tests/review-apply.test.ts` (nuevo) | Escenarios de §2 | test |
| `frontend/src/app/features/projects/models/project-review.model.ts` | `applied` y `isSuggestionApplied` | domain |
| `frontend/src/app/features/projects/services/projects.service.ts` | `applyReviewSuggestion()` | infrastructure |
| `frontend/src/app/features/projects/services/project-review.facade.ts` | `applySuggestion(dimension, index?)`: deshacer → petición → editor → guardar como borrador → marcar; estado `applying` por sugerencia y error | application |
| `frontend/src/app/features/taller/components/project-review/` | Botones «Aplicar» por sugerencia y «Aplicar todas» por aspecto, estado «Aplicando…» y marca «✓ Aplicada»; desactivados sin permiso, con el turno de otra persona o mientras la IA trabaja | presentation |
| `frontend/src/app/services/translations.{es,ca}.ts` | Textos nuevos | presentation |
| `documentation/revision_automatica_proyectos.md` | Sección «Aplicar sugerencias» | docs |

## 5. Tareas
- [ ] Crear la rama `feature/260_aplicar_sugerencias_revision`.
- [ ] `markdown-sections.ts` con tests unitarios (encabezados con numeración, tildes, apartados anidados, último apartado) y adaptación del MCP.
- [ ] `review-apply.service.ts` y el endpoint, con tests de los escenarios de §2 (IA simulada).
- [ ] Frontend: modelo, servicio, facade y botones del panel, con ES/CA y specs que pulsen los botones reales.
- [ ] Documentación, lint y typecheck, suites completas y registro de la tarea 260.
- [ ] Commit, push, CI en verde, integración en `main` y seguimiento del despliegue.

## 6. Riesgos y verificación prevista
- **Localizar el apartado:** la IA de la revisión nombra el apartado libremente (p. ej. «Evaluación» frente a «## 5. Evaluación y rúbricas»). Se usa una coincidencia flexible por inclusión, sin tildes ni numeración, eligiendo el encabezado más específico. Si no hay coincidencia clara, se reescribe el documento completo.
- **Respuesta de la IA:** debe empezar por un encabezado del mismo nivel y no estar vacía; si no, no se toca el texto. Se reutiliza la limpieza de bloques de código del asistente.
- **Paridad ES/CA:** la instrucción a la IA pide redactar en el idioma del texto que se edita; los textos de la interfaz están en ambos idiomas.
- **Límites de código:** el componente `project-review` ya tiene unas 70 líneas de TypeScript y 80 de plantilla; si la lista de sugerencias crece, se extrae `review-suggestion-list` como subcomponente para no pasar de 200. Funciones de menos de 25 líneas.
- **Zoneless y cobertura:** estado en signals y specs con clicks reales en el DOM; 90 % por archivo.
- **Sin migraciones:** `review.applied` es opcional.
- **Verificación:** `cd backend && npm run typecheck && npm test`; `cd frontend && npx eslint … && npm test`; prueba manual en producción con un proyecto revisado.

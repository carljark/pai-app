# Plan 220: Clonar proyectos y desplegable de ciclos

> **Fecha:** 9 de octubre de 2026
> **Estado:** Implementado (tarea 220)
> **Partes afectadas:** backend / frontend / despliegue

---

## 1. Objetivo
Permitir copiar un proyecto existente desde el historial de proyectos y desde el área personal: la copia queda a nombre de quien la hace, con el título «Copia de …» («Còpia de …» en catalán), y se puede editar sin tocar el original. Además, el selector de ciclo educativo del historial (pestañas) y del área personal (pills) pasa a ser un menú desplegable, que con más de veinte niveles se ve mucho mejor, sobre todo en el móvil.

## 2. Escenarios
- **Escenario: clonar un proyecto terminado**
  - **Dado** un proyecto en `borrador` o `publicado` de cualquier usuario
  - **Cuando** un usuario aprobado hace `POST /api/projects/:id/clone` con `language`
  - **Entonces** se crea un proyecto nuevo con su `userId`, sin colaboradores ni turno de edición, estado `borrador`, `clonedFrom` = id original, mismo nivel, curso, módulos, RA, criterios, contenido y traducciones, y título «Copia de <título>» / «Còpia de <título>».
- **Escenario: título genérico** — si el original se titula «Proyecto Integrador» (u otro genérico) o no tiene título, la copia usa los módulos unidos con « + », igual que el historial.
- **Escenario: archivos adjuntos** — los archivos de `uploads/<idOriginal>` se copian a `uploads/<idCopia>`.
- **Escenario: proyecto no clonable** — en cola, generándose o con error → 409; id inválido → 400; inexistente → 404; usuario no aprobado → 403.
- **Escenario: el original no cambia** tras clonar.
- **Escenario: botón «Copiar» en el historial y en el área personal** — solo en proyectos terminados; al pulsarlo se crea la copia, se recarga el historial y se muestra un toast «Proyecto copiado».
- **Escenario: desplegable de ciclos en el historial** — un `app-select` con un nivel por opción (idioma activo) sustituye a las pestañas; al elegir uno cambia `historyTab`.
- **Escenario: desplegable de ciclos en el área personal** — `app-select` con «Todos» + niveles sustituye a las pills de nivel (las de estado se quedan).

## 3. Alternativas
- **A (recomendada): endpoint de backend `POST /:id/clone`.** Una sola petición, copia contenido, traducciones y archivos en el servidor y registra `CLONE_PROJECT` en `ActivityLog`.
- **B: clonar en el frontend** leyendo el proyecto y llamando a crear: no existe endpoint para crear sin generar con IA y no podría copiar archivos. Descartada.
- Desplegable: reutilizar `app-select` (ya usado en los filtros de módulo/RA) frente a un componente nuevo; se reutiliza por homogeneidad.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/models/Project.ts` | Campo `clonedFrom` (ObjectId, opcional). Sin migración: es opcional. | domain |
| `backend/src/services/project-clone.service.ts` (nuevo) | Título de la copia, campos copiados, copia de `uploads/`. | application |
| `backend/src/controllers/project-clone.controller.ts` (nuevo) | Validaciones (400/404/409), crea la copia, `ActivityLog`. | presentation |
| `backend/src/routes/project.routes.ts` | `router.post('/:id/clone', requireApproved, cloneProject)`. | presentation |
| `backend/src/tests/project-clone.test.ts` (nuevo) | Escenarios anteriores. | test |
| `frontend/.../projects.service.ts` y `projects.facade.ts` | `cloneProject(id, language)`. | infrastructure |
| `frontend/src/app/app.facade.ts` | `cloneProject(project)`: llama, recarga historial, toast o modal de error. | application |
| `history-project-card.component.html/.ts` | Botón «Copiar» (`btn-secondary`) para proyectos terminados. | presentation |
| `personal-view.component.html/.ts` | Botón «Copiar»; pills de nivel → `app-select`. | presentation |
| `history-view.component.html/.ts/.scss` | Pestañas → `app-select`; se eliminan estilos de pestañas. | presentation |
| `translations.es.ts` / `translations.ca.ts` | `cloneProject`, `toastProjectCloned`, `modalCloneError`, `historyLevelLabel`. | i18n |
| Specs correspondientes | Clicks reales en botones y cambios del `select`. | test |
| `documentation/` | Nota sobre la clonación (`clonar_proyectos.md`). | docs |

## 5. Tareas
- [x] Backend: modelo, servicio, controlador, ruta y tests.
- [x] Frontend: servicio, facades, botón Copiar en tarjeta del historial y área personal, traducciones ES/CA.
- [x] Frontend: desplegables de nivel en historial y área personal; limpiar SCSS de pestañas/pills de nivel.
- [x] Lint, typecheck y suites completas en verde (cobertura por archivo).
- [x] Documentación, registro de tarea, commit, push y despliegue.

## 6. Riesgos y verificación prevista
- **Datos:** no hay migración; `clonedFrom` es opcional. La copia no altera el original (test explícito).
- **Permisos:** clonar crea un proyecto propio, así que basta con estar aprobado; no se copian colaboradores para no compartir sin permiso.
- **Archivos:** si `uploads/<id>` no existe, no se copia nada; un fallo al copiar archivos no anula la copia (se registra en consola).
- **Límites:** `app.facade.ts` (336 líneas) y `projects.facade.ts` crecen poco (un método cada uno); el controlador nuevo va aparte para no engordar `project.controller.ts`. Funciones ≤ 25 líneas.
- **Paridad ES/CA** en textos y título de la copia; cobertura por archivo ≥ 90 % y plantillas ≥ 80 % de funciones.
- **Verificación:** `cd backend && npm run typecheck && npm test`; `cd frontend && npx eslint <archivos> && npm test`; despliegue con `./scripts/deploy-prod.sh` y comprobación de la API.

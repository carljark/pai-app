# Tarea 220: clonar proyectos y desplegable de ciclos

Plan: [`planes/220_plan_clonar_proyectos_y_desplegable_de_ciclos.md`](../planes/220_plan_clonar_proyectos_y_desplegable_de_ciclos.md). Rama: `feature/220_clonar_proyectos_y_desplegable_de_ciclos`.

## Propósito

1. Permitir copiar un proyecto terminado, propio o ajeno, para editarlo sin tocar el original. La copia queda a nombre de quien la hace y se titula «Copia de …» / «Còpia de …».
2. Sustituir el selector de ciclo educativo del historial (pestañas) y del área personal (pills) por un menú desplegable: con más de veinte niveles, las pestañas y pills desbordaban la pantalla, sobre todo en el móvil.

## Arquitectura y flujo

### Clonación

```
Botón «Copiar» (history-project-card / personal-view)
  → AppFacade.cloneProject(project)            idioma de la interfaz
  → ProjectsFacade.cloneProject(id, language)
  → ProjectsService: POST /api/projects/:id/clone { language }
      → project-clone.controller: 400 / 404 / 409, crea la copia, copia uploads/, ActivityLog CLONE_PROJECT
      → project-clone.service: título, campos copiados, traducciones terminadas, archivos
  ← 201 proyecto poblado
  → recarga del historial + toast «Proyecto copiado» (o modal de error)
```

Detalles de qué se copia y por qué: `documentation/clonar_proyectos.md`.

### Desplegables de nivel

- **Historial:** `history-view` sustituye las pestañas por un `app-select` («Ciclo o nivel») con un nivel del catálogo por opción, en el idioma activo; al elegir uno cambia `ProjectsFacade.historyTab`. Mientras hay texto en el buscador (que busca en todos los niveles), el desplegable se atenúa como antes las pestañas (`history-view__level--searching`). Se eliminan los estilos de pestañas.
- **Área personal:** `personal-view` sustituye las pills de nivel por un `app-select` con «Todos» (`ALL`) más los niveles. Las pills de estado se mantienen.

## Archivos

**Backend**
- `src/models/Project.ts`: campo opcional `clonedFrom`.
- `src/services/project-clone.service.ts` (nuevo): título, documento de la copia y copia de adjuntos.
- `src/controllers/project-clone.controller.ts` (nuevo): validaciones, creación, adjuntos y `ActivityLog`.
- `src/routes/project.routes.ts`: `POST /:id/clone` con `requireApproved`.
- `src/tests/project-clone.test.ts` (nuevo): 13 tests (copia completa sin tocar el original, título en catalán y genérico, adjuntos, fallo de adjuntos, 409 por estado, 400/404/403/500).

**Frontend**
- `projects.service.ts`, `projects.facade.ts`, `app.facade.ts`: `cloneProject`.
- `history-project-card.component.html`: botón «Copiar» (`btn-secondary`) en proyectos terminados.
- `history-view.component.{html,ts,scss}`: desplegable de nivel.
- `personal-view.component.{html,ts,scss}`: botón «Copiar» y desplegable de nivel.
- `translations.{es,ca}.ts`: `cloneProject`, `cloneProjectTooltip`, `toastProjectCloned`, `modalCloneError`, `historyLevelLabel`.
- Specs: clics reales en «Copiar» y cambios del `<select>`; `cloneProject` en ambas facades (éxito, error del servidor, sin red y genérico).

**Documentación:** `documentation/clonar_proyectos.md`.

## Decisiones

- Endpoint de backend (alternativa A del plan): una sola petición que copia contenido, traducciones y archivos en el servidor.
- Se reutiliza `app-select`, ya usado en los filtros de módulo y RA del historial, para que los desplegables sean homogéneos.
- El controlador va en un archivo propio para no engordar `project.controller.ts`.
- `personal-view.component.html` y `app.facade.ts` ya superaban las 200 líneas antes de esta tarea; aquí apenas crecen (el desplegable incluso reduce la plantilla del área personal).

## Verificación

- Backend: `npm run typecheck` a 0 errores y `npm run test:cov` 436/436.
- Frontend: ESLint, `ngc` y `tsc` de specs sin errores; `npm test` 874 tests con los umbrales de cobertura (global y por archivo) cumplidos.

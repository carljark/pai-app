# Tarea 190: Exportar proyectos seleccionados e importarlos en el usuario activo

## Propósito
Ampliación de la tarea 188, pedida por el usuario:
- desde el panel de administración se pueden exportar los proyectos **seleccionados** de cualquier usuario, además de todos;
- al importarlos, los proyectos quedan **a nombre del usuario activo**.

## Cambios
### Backend (`project-transfer.service.ts`, controlador y rutas)
- **Nuevo `GET /api/admin/projects/exportable`** (`listExportableProjects`): lista ligera, sin contenido, de los proyectos `borrador` y `publicado` de todos los usuarios, del más reciente al más antiguo. Incluye título (o el de por defecto de los proyectos antiguos), nivel, curso, estado, idioma, fecha y autor.
- **Exportación por `ids`:** ahora exige que los proyectos estén terminados (antes exportaba cualquier estado).
- **Importación:**
  - el proyecto se crea siempre con `userId` = quien importa y sin colaboradores;
  - desaparecen la búsqueda del autor por email (`usersByEmail`) y el contador `ownerFallback` del resumen.
- **Duplicados por usuario:** se omite un proyecto solo si el usuario activo ya tiene uno con el mismo origen (`importSourceId`), o si el original es suyo. Así se puede copiar a la cuenta propia un proyecto de otro usuario de la misma instalación, una sola vez.

### Frontend
- **`ProjectsTransferService`:**
  - `listExportable()`;
  - `exportProjects(ids)` con el parámetro `ids`;
  - `ImportSummary` sin `ownerFallback`;
  - tipo `ExportableProject`.
- **Nuevo `ExportSelectionComponent`** (`app-export-selection`):
  - lista con buscador por título, nombre o email del autor (sin distinguir acentos);
  - casillas y «Seleccionar todos los visibles», que no toca los proyectos ocultos por el filtro;
  - contador de seleccionados y etiqueta corta del nivel;
  - la selección se comparte con el componente padre mediante `model()` (`[(selectedIds)]`).
- **`ProjectsTransferComponent`:**
  - carga la lista al iniciarse y tiene los botones «Exportar seleccionados (N)» y «Exportar todos (N)»;
  - después de importar, recarga la lista y quita de la selección los proyectos que ya no existen;
  - el resumen indica «Importados a tu nombre» y «Ya los tenías».

## Decisiones técnicas
- **El selector va en un componente aparte** para que `ProjectsTransferComponent` no pase de 200 líneas (AGENTS.md §4).
- **La lista no lleva el contenido de los proyectos**, que pesa decenas de KB por proyecto: el contenido solo se descarga al exportar.
- **El export sigue incluyendo el autor de origen por email:** no se usa al importar, pero deja constancia de la procedencia en el fichero.

## Archivos
- Backend:
  - `services/project-transfer.service.ts`;
  - `controllers/project-transfer.controller.ts`;
  - `routes/admin.routes.ts`;
  - `tests/project-transfer.test.ts`: lista exportable, exportación por ids de proyectos terminados, importación a nombre del usuario activo, copia de proyectos de otro usuario y normalización.
- Frontend:
  - `features/admin/services/projects-transfer.service.ts` y su spec;
  - `features/admin/components/projects-transfer/`: `.ts`, `.html`, `.scss` y spec;
  - nuevo `features/admin/components/export-selection/`: `.ts`, `.html`, `.scss` y spec;
  - `admin-dashboard.component.spec.ts`: mock de `listExportable`.
- `documentation/exportacion_importacion_proyectos.md`.

## Verificación
- Backend: 247 tests, con un 98,5 % de cobertura.
- Frontend: 722 tests, lint, cobertura por archivo y comprobación zoneless, todo en verde.

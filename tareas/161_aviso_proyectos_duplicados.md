# Tarea 161: Aviso de proyectos duplicados al generar

## Propósito

Al pulsar «Generar proyecto», comprobar si ya existen proyectos con **exactamente los mismos RAs (FP) o CEs (ESO)**. Si los hay, mostrar un modal que lo indique y los liste; con botones «Cancelar» y «Continuar y generar». Los proyectos listados actúan como enlaces que abren ese proyecto.

## Cambios

### Datos
- `projects.mapper.ts`: se conserva `ras` en el modelo de dominio (antes se descartaba), necesario para comparar la selección.

### Lógica (`app.facade.ts`)
- `generateProject()`:
  1. Si no hay selección → modal de atención (sin cambios).
  2. Busca proyectos con la misma selección (`findProjectsWithSameSelection`): comparación por clave normalizada (trim + minúsculas + orden) del array `ras`, excluyendo los que están en estado `error`.
  3. Si hay coincidencias → abre el modal de duplicados (`showDuplicateModal`, `duplicateProjects`).
  4. Si no → `enqueueGeneration()` (genera directamente).
- Acciones: `confirmDuplicates()` (cierra y genera), `cancelDuplicates()` (cierra) y `openDuplicateProject(project)` (cierra y abre el proyecto).

### Modal
- Nuevo `DuplicateProjectsModalComponent` (`frontend/src/app/components/duplicate-projects-modal/`) con HTML/SCSS en ficheros propios y BEM:
  - inputs: `title`, `message`, `cancelLabel`, `proceedLabel`, `projects`.
  - outputs: `proceed`, `cancel`, `openProject`.
  - Lista de proyectos como enlaces (título + estado/fecha/módulos).
- Se renderiza en `app.html` cuando `appFacade.showDuplicateModal()`.

### Traducciones
- `duplicateTitle`, `duplicateIntro`, `duplicateCancel`, `duplicateProceed` en ES y CA (sustituyen a las antiguas `generateSummary*`).

## Decisión pendiente

`openDuplicateProject` abre el proyecto con `viewPastProject` (editor/taller), que es la acción equivalente a «Abrir Editor» del archivo. Si se prefiere, se puede cambiar para navegar a la vista de Historial en su lugar.

## Tests

- `duplicate-projects-modal.component.spec.ts` (**nuevo**): render, emisión de `openProject`, `cancel`/`proceed` y fallback de título.
- `app.facade.spec.ts`: mock con `projectsHistory`; tests de aviso de duplicados, continuar, cancelar y abrir el proyecto.

## Verificación

El dev server de Angular recompila correctamente. No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

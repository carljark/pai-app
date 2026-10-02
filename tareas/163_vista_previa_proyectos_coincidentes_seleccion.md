# Tarea 163: Vista previa de proyectos coincidentes en "Selección Actual"

## Propósito

Mostrar en la "Selección Actual" (carrito flotante del generador) una sección compacta/expandible con los proyectos ya generados cuya selección de RAs (FP) o CEs (ESO) coincide **exactamente** con la actual, y abrirlos en el editor en una **ventana nueva**. Se mantiene además el modal de aviso al pulsar "Generar".

## Cambios

### Lógica compartida
- `frontend/.../projects/utils/selection-match.ts` (**nuevo**): `selectionKey()` y `findProjectsWithSameSelection()` (normaliza trim/minúsculas/orden; descarta `error` y sin `ras`).
- `ProjectsFacade.matchingProjects`: computed reactivo a `projectsHistory()` y a `curriculumFacade.selectedRas()`, reutilizando el util.
- `AppFacade` usa ahora el util en `findProjectsWithSameSelection()` (sin duplicar la lógica).

### Selección Actual (`curriculum-selector`)
- Inyecta `ProjectsFacade` y `AppFacade`.
- Nueva sección `<details class="floating-cart__matches">` con resumen `📄 N proyectos con esta selección` (compacta por defecto; el `<details>` conserva su estado mientras se usa la página) y lista de proyectos como enlaces.
- Al pulsar un proyecto se abre en una pestaña nueva mediante `AppFacade.openProjectInNewWindow`.

### Apertura en ventana nueva
- `AppFacade.openProjectInNewWindow(project)` abre `${origin}${pathname}?project=<id>`, de modo que una pestaña nueva carga la SPA directamente en el proyecto.
- `AppFacade.initOpenProjectFromUrl()`: al cargar, si existe `?project=<id>`, espera a que el historial esté disponible y abre el proyecto en el editor (`viewPastProject`), limpiando el parámetro de la URL.

### Estilos y traducciones
- `curriculum-selector.component.scss`: clases BEM (`floating-cart__matches`, `__matches-summary`, `__matches-list`, `__match-link`, `__match-title`, `__match-meta`).
- `matchingProjectsTitle` (ES: "proyectos con esta selección"; CA: "projectes amb esta selecció").

## Tests
- `selection-match.spec.ts` (**nuevo**).
- `projects.facade.spec.ts`: `matchingProjects`.
- `curriculum-selector.component.spec.ts`: render de coincidencias, ocultado si no hay, y `openProjectInNewWindow` al pulsar.
- `app.facade.spec.ts`: `openProjectInNewWindow`.
- Mocks actualizados (`generator-view`, `app.spec`).

## Verificación

El frontend compila correctamente. No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

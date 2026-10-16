# 242 · Cambiar el nombre de los proyectos

## Propósito

Hasta ahora, el nombre de un proyecto se fijaba al generarlo y no se podía cambiar. Si no se escribía, el proyecto se llamaba como sus módulos o con un nombre genérico, como «Proyecto Generado». Esta tarea permite renombrarlo desde el historial y desde «Mis proyectos».

## Rama

`feature/242_renombrar_proyectos` sale de la 241, que es la desplegada. No tiene migraciones: el campo `title` ya existía.

## Flujo

1. Junto al nombre del proyecto aparece un botón ✏️. Solo lo ven quienes pueden editar el proyecto: el autor, los colaboradores y los administradores. Son las mismas reglas que `canEditProject`.
2. El botón cambia el nombre por un campo de texto con el nombre actual seleccionado y los botones «Guardar» y «Cancelar». Intro guarda y Escape cancela.
3. Al guardar, el frontend llama a `PATCH /api/projects/:id/title` y sustituye el proyecto en el historial con la respuesta. Las dos listas se actualizan solas, porque «Mis proyectos» se calcula a partir del historial.
4. Si falla, el editor sigue abierto y muestra un aviso en el idioma de la interfaz.

## Backend

- **Ruta:** `PATCH /api/projects/:id/title`, con `requireApproved` y `requireProjectEditor`.
  - Responde 403 a quien no participa en el proyecto y 404 si el proyecto no existe.
  - **No** exige el turno de edición: el nombre es un dato del proyecto, no de su contenido. Así se puede renombrar desde las listas aunque otra persona esté editando el documento.
- **Controlador** `project-title.controller.ts`:
  - `normalizeTitle` compacta los espacios y rechaza con 400 los nombres vacíos, los que no son texto y los que pasan de 150 caracteres (`MAX_TITLE_LENGTH`).
  - Solo actualiza `title`: no cambia `contentVersion`, así que las traducciones no quedan desactualizadas.
  - Devuelve el proyecto con autor y colaboradores, como las rutas de colaboradores.
- **Registro:** guarda la acción `RENAME_PROJECT` con el nombre nuevo y el anterior. Se ha añadido a `CHANGE_ACTIONS`, así que aparece en el registro de cambios del taller.

## Frontend

- `ProjectTitleComponent` (`features/projects/components/project-title/`) muestra el nombre y el editor. Lo usan `HistoryProjectCardComponent` y `PersonalViewComponent`. Cada uno le pasa el nombre que muestra (`displayTitle`), que sigue resolviendo el nombre genérico con los módulos.
- `ProjectsService.renameProject` y `ProjectsFacade.renameProject`; la fachada reutiliza `replaceInHistory`, como las de colaboradores.
- Traducciones ES/CA:
  - `renameProject`, `renameProjectLabel`, `renameProjectSave`, `renameProjectCancel` y `renameProjectError`;
  - `changeActions.RENAME_PROJECT`.

## Archivos

- **Backend:**
  - `controllers/project-title.controller.ts` (nuevo);
  - `routes/project.routes.ts`;
  - `controllers/project-changes.controller.ts`;
  - `tests/project-title.test.ts` (nuevo).
- **Frontend:**
  - `features/projects/components/project-title/` (componente, plantilla, estilos y spec);
  - `projects.service.ts`, `projects.facade.ts` y su spec;
  - `history-project-card.component.*`;
  - `personal-view.component.{ts,html}`;
  - `translations.es.ts` y `translations.ca.ts`.
- **Documentación:** `documentation/trabajo_colaborativo.md`.

## Tests

- **Backend:**
  - el autor, el colaborador y el administrador pueden renombrar, incluso con el turno de edición en manos de otro;
  - el resto recibe 403;
  - la validación responde 400;
  - el proyecto inexistente da 404 y un fallo de la base de datos, 500;
  - el contenido y `contentVersion` no cambian;
  - la acción aparece en el registro de cambios.
- **Frontend:**
  - el botón tiene el texto en los dos idiomas y solo aparece con permiso de edición;
  - se guarda con el botón y con Intro, y se cancela con Escape y con el botón;
  - no se envía nada si el nombre está vacío o no cambia;
  - aviso de error;
  - no se hace un doble envío mientras se guarda.

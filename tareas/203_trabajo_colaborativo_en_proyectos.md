# Tarea 203: Trabajo colaborativo en proyectos compartidos

> **Plan:** [005 — Trabajo colaborativo en proyectos compartidos](../planes/005_plan_trabajo_colaborativo_en_proyectos.md)

## Propósito

Instrucciones de voz del 9 de octubre de 2026 (`updates/instrucciones_20261009_compartir_proyecto.ogg`, transcritas en local con whisper.cpp):

> «Cuando se esté trabajando en un mismo proyecto, los invitados tienen que recibir una notificación y luego, durante el trabajo en el mismo proyecto, mientras que un usuario escribe, los otros tendrán bloqueado el uso de la IA y hacer cambios en el documento. Aparte, tiene que haber un registro con fecha y hora de qué personas han hecho cambios en el documento.»

Al aprobar el plan, el usuario añadió que **solo el autor y los colaboradores invitados pueden editar** un proyecto; para el resto debe ser de solo lectura.

Los proyectos ya admitían colaboradores, pero el invitado no recibía ningún aviso, dos personas podían pisarse los cambios y cualquier usuario podía modificar cualquier proyecto.

## Arquitectura y flujo

Detalle completo en `documentation/trabajo_colaborativo.md`.

1. **Permisos.** `requireProjectEditor` carga el proyecto y responde 403 si el usuario no es autor, colaborador ni administrador. Protege `PUT /:id`, la reescritura con IA (ahora con `projectId` en el cuerpo), la traducción, la importación de Word, los recursos y el turno de edición. En el frontend, `canEditProject` replica la regla.
2. **Turno de edición.** Se guarda en `Project.editLock` y se toma con un `findOneAndUpdate` condicional (atómico). `requireEditLock` lo toma o renueva en cada acción y responde 409 con el nombre de quien lo tiene. Caduca tras 2 minutos sin actividad. Cada cambio de turno se avisa por SSE (`PROJECT_EDIT_LOCK`) al autor y a los colaboradores.
3. **Turno en el frontend.** `EditLockFacade` vigila el proyecto abierto en el taller:
   - pide el turno al escribir en el asistente IA y lo renueva como mucho cada 30 s;
   - lo libera al salir del taller o al cerrar la pestaña (`fetch` con `keepalive`);
   - expone `blocked()`, que deshabilita la IA, deshacer, importar, guardar, publicar, traducir y los recursos;
   - `EditLockBannerComponent` muestra «X está editando…», «Solo lectura» o el turno propio.
4. **Invitaciones.**
   - **Backend:** las notificaciones tienen ahora `recipientId`. `notifyInvitations()` crea una `PROJECT_INVITATION` personal y la envía por SSE al generar con colaboradores y al añadir uno. Al quitar el colaborador se borran sus invitaciones pendientes. `GET /api/notifications` solo devuelve al usuario sus propias invitaciones.
   - **Frontend:** la invitación aparece en un listado nuevo arriba de la actividad reciente, que abre el proyecto en el taller. También se muestra un aviso al recibirla.
5. **Registro de cambios.** Se registran en `ActivityLog` (con índice nuevo) las acciones `AI_REWRITE`, `IMPORT_DOCX`, `UPLOAD_FILE`, `DELETE_FILE` y `REMOVE_COLLABORATOR`, además de las que ya existían. `GET /:id/changes` devuelve hasta 100 entradas con persona, acción, detalle y fecha. `ProjectChangeLogComponent` es un desplegable en el taller, en castellano y catalán.

## Archivos modificados

### Backend
1. `backend/src/models/Project.ts`: subdocumento `editLock`.
2. `backend/src/models/Notification.ts`: campo `recipientId` indexado.
3. `backend/src/models/ActivityLog.ts`: índice `{ projectId, createdAt }`.
4. `backend/src/services/project-access.service.ts` (nuevo): `canEditProject`, `participantIdsOf`, `canManageCollaborators`.
5. `backend/src/services/edit-lock.service.ts` (nuevo): `acquireEditLock`, `releaseEditLock`, `activeLockOf` y aviso SSE.
6. `backend/src/middlewares/project-access.middleware.ts` (nuevo): `requireProjectEditor`, `requireEditLock`, `projectEditGuards`.
7. `backend/src/controllers/collaboration.controller.ts` (nuevo): colaboradores (sacados de `project.controller.ts`, que ya tenía 664 líneas) y endpoints del turno.
8. `backend/src/controllers/project-changes.controller.ts` (nuevo): `GET /:id/changes`.
9. `backend/src/controllers/project.controller.ts`: invitación al generar, registro de `AI_REWRITE`; `updateProject` usa `req.project` y responde 404 si el proyecto no existe (antes devolvía `null`).
10. `backend/src/controllers/docx.controller.ts`: la importación la pueden hacer los colaboradores (antes solo el autor) y se registra.
11. `backend/src/controllers/files.controller.ts`: registra subidas y borrados; un fallo del registro no revierte la operación.
12. `backend/src/controllers/notification.controller.ts` y `services/notification.service.ts`: filtrado por destinatario, `notifyInvitations`, `deleteInvitation` y upsert de estado limitado a `recipientId: null`.
13. `backend/src/routes/project.routes.ts` y `routes/files.routes.ts`: rutas nuevas y guards (antes de multer).
14. `backend/src/tests/collaboration.test.ts` (nuevo, 18 tests). Además se adaptan `translation`, `projects`, `files`, `extra` y `coverage-branches`: sus proyectos de prueba ya tienen autor, la reescritura envía `projectId` y un id inexistente ahora responde 404.

### Frontend
1. `features/projects/models/collaboration.model.ts`, `services/collaboration.service.ts`, `services/edit-lock.facade.ts` y `utils/project-access.ts` (nuevos), con sus specs.
2. `features/taller/components/edit-lock-banner/` y `project-change-log/` (nuevos, con specs).
3. `features/notifications/components/invitation-list/` (nuevo, con spec).
4. `features/taller/components/taller-view/*`: controles deshabilitados con `editLock.blocked()`, `touch()` al escribir en el asistente y los dos componentes nuevos; el `.ts` solo crece en 6 líneas.
5. `features/taller/components/translation-banner/translation-banner.component.ts`: no ofrece traducir si el proyecto está bloqueado.
6. `features/notifications/**`: tipo `INVITATION`, evento `PROJECT_EDIT_LOCK` desviado a `editLockEvent`, `invitations()`/`activity()` y fusión que distingue invitación y estado.
7. `app.facade.ts`: aviso al recibir una invitación.
8. `features/projects/services/projects.facade.ts` y `projects.service.ts`: `projectId` en la reescritura.
9. `services/translations.es.ts` / `translations.ca.ts`: textos nuevos con paridad ES/CA.
10. Specs adaptados: `app`, `app.facade`, `sidebar`, `notifications-badge`, `notification.mapper`, `notifications.facade`, `projects.facade`, `taller-view` y `translation-banner`.

### Documentación
- `documentation/trabajo_colaborativo.md` (nuevo) y `planes/005_plan_trabajo_colaborativo_en_proyectos.md`.

## Decisiones técnicas

- **Turno al empezar a modificar, no al abrir el proyecto.** Así una pestaña olvidada no bloquea a nadie. La caducidad de 2 minutos evita turnos huérfanos sin necesidad de un proceso de limpieza.
- **El turno se guarda en Mongo, no en memoria.** Sobrevive a reinicios del servidor, y la operación condicional evita condiciones de carrera (probado con dos peticiones simultáneas).
- **`remainingMs` del servidor.** El navegador programa la caducidad con ese valor en vez de con `expiresAt`, para no depender de que los relojes coincidan.
- **Invitaciones en la colección `Notification`**, con `recipientId`, en vez de crear una colección nueva. Las notificaciones antiguas, sin destinatario, siguen siendo generales.
- **Se reutiliza `ActivityLog` para el registro de cambios**, con un índice nuevo. Las exportaciones quedan fuera del registro porque no cambian el proyecto.
- **No hace falta migración.** Los campos nuevos son opcionales e índices los crea Mongoose al arrancar.
- **Administradores.** Pueden editar cualquier proyecto, como ya podían borrarlo y gestionar sus colaboradores.

## Verificación

- `cd backend && npm test -- --coverage`: 28 archivos y 346 tests en verde; cobertura global del 98,75 % de sentencias y 93,95 % de ramas. El backend no tiene typecheck propio (se ejecuta con `tsx`; `tsc` sin configuración falla en todo el proyecto desde antes).
- `cd frontend && npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `npx eslint` sobre los archivos tocados: sin hallazgos.
- `cd frontend && npm test` (lint + tests + cobertura global y por archivo + zoneless): 66 archivos y 832 tests en verde, 1 omitido (ya lo estaba); cobertura global del 99,29 %; «All coverage thresholds met»; «Zoneless check passed».
- **No se probó a mano con dos usuarios en Docker** porque el demonio de Docker no estaba en marcha. Los flujos HTTP (permisos, 409, caducidad, liberación, invitaciones y registro) están cubiertos por supertest.

## Desviaciones respecto al plan

- **Permisos de solo lectura**: añadidos a petición del usuario al aprobar el plan.
- **Reintentar una generación** (`/:id/retry`) sigue limitado al autor y a los administradores; los colaboradores no pueden reintentar.
- **Ubicación de los archivos nuevos**: el registro de cambios va en `project-changes.controller.ts` y los colaboradores, junto con el turno, en `collaboration.controller.ts`. Las llamadas HTTP nuevas van en un `CollaborationService` aparte para no engordar `projects.service.ts`.

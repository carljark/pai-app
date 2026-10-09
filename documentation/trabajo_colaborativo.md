# Trabajo colaborativo en proyectos

Funcionamiento de los proyectos compartidos: quién puede modificarlos, cómo se avisa a los invitados, el turno de edición y el registro de cambios. Plan: `planes/005_plan_trabajo_colaborativo_en_proyectos.md`.

## Permisos

| Quién | Puede ver | Puede modificar |
|---|---|---|
| Autor (`Project.userId`) | Sí | Sí |
| Colaborador invitado (`Project.collaborators`) | Sí | Sí |
| Administrador | Sí | Sí |
| Resto de usuarios | Sí | No (solo lectura) |

- Backend: `services/project-access.service.ts` (`canEditProject`) y el middleware `requireProjectEditor` (`middlewares/project-access.middleware.ts`), que responde **403** a quien no puede editar y deja el proyecto cargado en `req.project`.
- Frontend: `features/projects/utils/project-access.ts` aplica las mismas reglas para ocultar o deshabilitar los controles y mostrar el aviso «Solo lectura».
- Gestionar colaboradores (`POST/DELETE /:id/collaborators`) sigue reservado al autor y a los administradores. Reintentar una generación (`/:id/retry`) también.

## Rutas protegidas

Todas las rutas que modifican el proyecto pasan por `projectEditGuards` = `requireProjectEditor` + `requireEditLock`:

- `PUT /api/projects/:id` (guardar, publicar, deshacer)
- `POST /api/projects/rewrite` (el cuerpo debe incluir `projectId`; sin él responde 400)
- `POST /api/projects/:id/translate`
- `POST /api/projects/:id/import-docx`
- `POST /api/projects/:id/files` y `DELETE /api/projects/:id/files/:filename` (los guards van **antes** de multer para no escribir en disco si se rechaza la petición)
- `POST /api/projects/:id/edit-lock`

## Turno de edición

Bloqueo con caducidad guardado en `Project.editLock = { userId, userName, expiresAt }`.

- **Toma y renovación** (`services/edit-lock.service.ts`, `acquireEditLock`): un único `findOneAndUpdate` condicional que solo tiene éxito si no hay turno, si ha caducado o si ya es de quien lo pide. Es atómico frente a peticiones simultáneas.
- **Caducidad**: `EDIT_LOCK_TTL_MS` = 2 minutos sin actividad. No hace falta limpiar los turnos caducados: la condición los trata como libres.
- **Conflicto**: si otra persona tiene el turno vigente, `requireEditLock` responde **409** con `{ error: "<nombre> está editando el proyecto", lock }` y el proyecto no cambia.
- **Aviso en tiempo real**: cada toma, renovación o liberación envía por SSE `{ type: 'PROJECT_EDIT_LOCK', projectId, lock }` al autor y a los colaboradores (`sendToUser`). `lock.remainingMs` se calcula con el reloj del servidor para evitar desfases con el del navegador.
- **Endpoints**: `GET /:id/edit-lock` (turno vigente o `null`), `POST /:id/edit-lock` (tomar o renovar) y `DELETE /:id/edit-lock` (liberar; solo surte efecto si el turno es de quien lo pide).

### Frontend (`EditLockFacade`)

- Vigila el proyecto abierto en el taller (efecto sobre `currentView === 'taller'` y `currentProjectId`).
- **Toma el turno al empezar a escribir** en el asistente IA (`touch()`), y lo renueva como mucho cada 30 s (`EDIT_LOCK_RENEW_MS`). Las acciones (IA, guardar, publicar, importar, traducir, recursos) lo toman o renuevan en el backend.
- Lo libera al salir del taller o cambiar de proyecto y, al cerrar la pestaña, con `fetch(..., { keepalive: true })` (no se usa `sendBeacon` porque no admite la cabecera `Authorization`).
- Programa la caducidad local con `remainingMs`; al vencer vuelve a consultar el turno por si se renovó y el evento SSE se perdió.
- `blocked()` = solo lectura o turno de otra persona: deshabilita el asistente IA, deshacer, importar Word, guardar, publicar, traducir y subir o borrar recursos. `EditLockBannerComponent` muestra el aviso correspondiente.
- Ante un 409, `handleConflict()` refleja el turno ajeno sin más intervención.

## Invitaciones

- `Notification.recipientId`: las notificaciones con destinatario son personales; sin él, son generales como hasta ahora.
- `notifyInvitations()` crea una `PROJECT_INVITATION` por colaborador (nunca para quien invita) y la envía por SSE. Se llama al generar un proyecto con `collaboratorIds` y al añadir un colaborador; añadir uno que ya estaba no duplica la invitación.
- Al quitar un colaborador se borran sus invitaciones pendientes (`deleteInvitation`).
- `GET /api/notifications` devuelve las generales y solo las invitaciones propias.
- `syncProjectNotification` hace upsert filtrando por `recipientId: null` para no sobrescribir las invitaciones con los cambios de estado.
- Frontend: tipo `INVITATION` en el mapper; `NotificationsFacade.invitations()` y `activity()` las separan, y la fusión de notificaciones distingue invitación y estado del mismo proyecto. `InvitationListComponent` las muestra al principio de la actividad reciente y abre el proyecto en el taller; `AppFacade` muestra un aviso al recibirlas.

## Registro de cambios

- Reutiliza `ActivityLog` con un índice `{ projectId: 1, createdAt: -1 }`.
- Acciones registradas: `GENERATE_PROJECT`, `UPDATE_PROJECT`, `UPDATE_STATUS_*`, `AI_REWRITE` (con los primeros 200 caracteres de la instrucción), `IMPORT_DOCX`, `TRANSLATE_PROJECT`, `UPLOAD_FILE`, `DELETE_FILE`, `ADD_COLLABORATOR` y `REMOVE_COLLABORATOR`. Las exportaciones no cuentan como cambio.
- `GET /api/projects/:id/changes` devuelve como mucho 100 entradas, de la más reciente a la más antigua, con nombre, email, acción, detalles y fecha.
- Si falla el registro de un recurso, la subida o el borrado no se revierten (se anota en el log del servidor).
- Frontend: `ProjectChangeLogComponent`, desplegable en el taller, con fecha y hora en el formato del idioma de la interfaz y etiquetas ES/CA (`changeActions`). Se recarga al editar, al cambiar el turno y con el botón «Actualizar».

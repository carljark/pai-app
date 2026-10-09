# Plan 005: Trabajo colaborativo en proyectos compartidos

> **Fecha:** 9 de octubre de 2026
> **Estado:** Implementado (tarea 203)
> **Partes afectadas:** backend / frontend / despliegue

Origen: instrucciones de voz `updates/instrucciones_20261009_compartir_proyecto.ogg` (transcripción):

> «Cuando se esté trabajando en un mismo proyecto, los invitados tienen que recibir una notificación y luego, durante el trabajo en el mismo proyecto, mientras que un usuario escribe, los otros tendrán bloqueado el uso de la IA y hacer cambios en el documento. Aparte, tiene que haber un registro con fecha y hora de qué personas han hecho cambios en el documento.»

---

## 1. Objetivo

Los proyectos ya admiten colaboradores (`Project.collaborators`, elegidos en el generador; endpoints `POST/DELETE /api/projects/:id/collaborators`), pero el invitado no se entera y nada impide que dos personas modifiquen el documento a la vez, pisándose los cambios. Se añaden tres piezas:

1. **Notificación de invitación** personal al colaborador (campana + aviso en tiempo real por SSE).
2. **Turno de edición** (bloqueo con caducidad): mientras una persona está modificando el proyecto, las demás no pueden usar la IA ni cambiar el documento, y ven quién lo tiene.
3. **Registro de cambios** con fecha, hora y autor de cada modificación del documento, visible en el taller.

## 2. Escenarios

- **Escenario: quien no es autor ni colaborador solo puede leer**
  - **Dado** un proyecto de A con colaborador B
  - **Cuando** C intenta `PUT /:id`, `/rewrite`, `/:id/translate`, `/:id/import-docx`, subir o borrar recursos, `/:id/retry` o `POST /:id/edit-lock`
  - **Entonces** recibe 403, puede seguir consultándolo con `GET /:id` y el taller le muestra el proyecto en solo lectura
- **Escenario: el colaborador invitado al generar recibe una notificación**
  - **Dado** un proyecto generado con `collaboratorIds = [B]`
  - **Cuando** B consulta `GET /api/notifications`
  - **Entonces** ve una notificación `PROJECT_INVITATION` con el título del proyecto y el nombre de quien le invita, y recibe el evento SSE correspondiente
- **Escenario: añadir un colaborador después también lo notifica**
  - **Dado** un proyecto existente de A
  - **Cuando** A llama a `POST /:id/collaborators` con B
  - **Entonces** B recibe la notificación; si ya era colaborador no se duplica
- **Escenario: la invitación solo la ve el invitado**
  - **Dado** una invitación para B
  - **Cuando** C consulta sus notificaciones
  - **Entonces** no la ve (las notificaciones de estado siguen siendo visibles para todos, como hasta ahora)
- **Escenario: tomar el turno de edición libre**
  - **Dado** un proyecto sin turno activo
  - **Cuando** A llama a `POST /:id/edit-lock`
  - **Entonces** responde 200 con `{ userId: A, userName, expiresAt }` y se avisa por SSE a autor y colaboradores
- **Escenario: el turno ocupado bloquea a los demás**
  - **Dado** que A tiene el turno vigente
  - **Cuando** B intenta `POST /:id/edit-lock`, `PUT /:id`, `POST /rewrite` (con `projectId`), `POST /:id/translate` o `POST /:id/import-docx`
  - **Entonces** recibe 409 con el nombre de A y el proyecto no cambia
- **Escenario: el turno caduca por inactividad**
  - **Dado** que el turno de A caducó (sin renovación en 2 min)
  - **Cuando** B pide el turno
  - **Entonces** lo obtiene
- **Escenario: liberar el turno**
  - **Dado** que A tiene el turno
  - **Cuando** A sale del taller o llama a `DELETE /:id/edit-lock`
  - **Entonces** el turno queda libre y los demás reciben el evento de desbloqueo
- **Escenario: el taller deshabilita IA y cambios si otro edita** (frontend)
  - **Dado** que B tiene abierto el proyecto y A tiene el turno
  - **Entonces** B ve el aviso «A está editando el proyecto» y quedan deshabilitados el asistente IA, deshacer, importar Word, guardar/publicar y traducir; al liberarse el turno se rehabilitan solos
- **Escenario: cada cambio queda registrado con autor y fecha**
  - **Dado** que A reescribe con IA y B, más tarde, importa un Word
  - **Cuando** se consulta `GET /:id/changes`
  - **Entonces** devuelve ambas entradas, de la más reciente a la más antigua, con nombre, acción y fecha-hora
- **Escenario: el taller muestra el registro de cambios** en ES y CA, actualizado al recibir un cambio por SSE

## 3. Alternativas

**Cuándo se toma el turno**
- A. Al abrir el proyecto en el taller (el primero que entra lo bloquea). Simple, pero quien deja la pestaña abierta bloquea a todos.
- **B. (Recomendada) Al empezar a modificar**: el turno se pide al escribir en el asistente IA o lanzar una acción que cambia el documento (IA, deshacer, importar, guardar, publicar, traducir), se renueva mientras hay actividad y caduca tras **2 minutos** sin ella. Encaja con «mientras que un usuario escribe» y nunca deja un bloqueo huérfano (si se cierra el navegador, caduca solo).
- C. Edición simultánea en tiempo real (CRDT/OT). Desproporcionado: el documento solo cambia por acciones completas (IA, importación), no por tecleo directo.

**Dónde guardar el turno**: campo `editLock` en `Project`, tomado con un `findOneAndUpdate` condicional (atómico, válido con varias peticiones a la vez). Se descarta guardarlo en memoria del servidor porque se perdería al reiniciar y no es atómico frente a Mongo.

**Registro de cambios**: reutilizar `ActivityLog` (ya guarda `userId`, `action`, `projectId` y `createdAt` en `PUT /:id`), añadiendo las acciones que faltan (reescritura IA, importación de Word, traducción, recursos) y un índice `{ projectId, createdAt }`. Una colección nueva duplicaría datos sin aportar nada.

**Invitaciones**: misma colección `Notification` con un campo nuevo `recipientId`. Las notificaciones de estado (sin `recipientId`) siguen igual; las invitaciones solo las devuelve `GET /api/notifications` a su destinatario.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/models/Project.ts` | Subdocumento `editLock { userId, userName, expiresAt }` | domain |
| `backend/src/models/Notification.ts` | Campo `recipientId` (índice) | domain |
| `backend/src/models/ActivityLog.ts` | Índice `{ projectId: 1, createdAt: -1 }` | domain |
| `backend/src/services/edit-lock.service.ts` (nuevo) | `acquireLock`, `releaseLock`, `assertCanEdit`, aviso SSE a autor y colaboradores | application |
| `backend/src/middlewares/edit-lock.middleware.ts` (nuevo) | `requireEditLock`: 409 si otro usuario tiene el turno vigente; si está libre lo toma para quien edita | presentation |
| `backend/src/services/notification.service.ts` | `notifyInvitation(project, inviter, collaboratorIds)`; `syncProjectNotification` filtra por `recipientId: null` para no pisar invitaciones | application |
| `backend/src/controllers/notification.controller.ts` | `GET` filtra invitaciones ajenas | presentation |
| `backend/src/controllers/project.controller.ts` | Invitación al generar y en `addCollaborator`; `rewriteSection` acepta `projectId` y registra `AI_REWRITE`. El archivo tiene 664 líneas: los colaboradores y el turno se extraen a `collaboration.controller.ts` (nuevo) | presentation |
| `backend/src/controllers/project-changes.controller.ts` (nuevo) | `GET /:id/changes` (autor poblado, orden descendente, límite 100) | presentation |
| `backend/src/controllers/docx.controller.ts`, `translation.controller.ts`, `files.controller` | Registrar la acción en `ActivityLog` | presentation |
| `backend/src/routes/project.routes.ts` | Rutas `edit-lock` y `changes`; `requireEditLock` en `PUT /:id`, `/rewrite`, `/:id/translate`, `/:id/import-docx` y subida/borrado de recursos | config |
| `backend/src/tests/collaboration.test.ts` (nuevo) | Escenarios de §2 del backend | test |
| `frontend/src/app/features/projects/services/edit-lock.facade.ts` (nuevo) | Signals `lock`, `lockedByOther`; pide/renueva el turno con la actividad (cada 30 s mientras haya actividad), lo libera al salir del taller y escucha el SSE `PROJECT_EDIT_LOCK` | application |
| `frontend/src/app/features/projects/services/projects.facade.ts`, `projects.service.ts`, `services/pai.service.ts` | `projectId` en la reescritura; llamadas `edit-lock` y `changes`; manejo del 409 | infrastructure |
| `frontend/src/app/features/taller/components/edit-lock-banner/` (nuevo) | Aviso «X está editando…» | presentation |
| `frontend/src/app/features/taller/components/project-change-log/` (nuevo) | Lista desplegable del registro de cambios (fecha-hora, persona, acción) | presentation |
| `frontend/src/app/features/taller/components/taller-view/*` | Deshabilitar controles con `editLock.lockedByOther()`, insertar los dos componentes; sin añadir lógica al `.ts` (ya ronda las 300 líneas) | presentation |
| `frontend/src/app/features/notifications/**` | Tipo `PROJECT_INVITATION` en modelo, mapper y modal (abre el proyecto al pulsarla) | presentation |
| `frontend/src/app/services/translations.es.ts` / `translations.ca.ts` | Textos nuevos con paridad ES/CA | config |
| `documentation/trabajo_colaborativo.md` (nuevo) | Funcionamiento del turno, invitaciones y registro | docs |

No hace falta migración de datos: los campos nuevos son opcionales y los índices los crea Mongoose.

## 5. Tareas

- [ ] Rama `feature/010_trabajo_colaborativo` desde `feature/009_mapa_afinidades_eso`.
- [ ] Backend: modelos, servicio y middleware del turno, rutas y extracción de `collaboration.controller.ts`.
- [ ] Backend: notificación de invitación y filtrado por destinatario.
- [ ] Backend: registro de acciones y `GET /:id/changes`.
- [ ] Tests backend de todos los escenarios; `npm test` ≥ 90 %.
- [ ] Frontend: `EditLockFacade`, servicios y manejo del 409.
- [ ] Frontend: banner, registro de cambios y deshabilitado de controles en el taller.
- [ ] Frontend: invitaciones en notificaciones; traducciones ES/CA.
- [ ] Specs frontend; eslint, typecheck y `npm test` (90 % global y por archivo).
- [ ] Documentación (`documentation/` y `tareas/` con `/registrar-tarea`), commit, push y despliegue en el EC2.

## 6. Riesgos y verificación prevista

- **Permisos** (añadido al aprobar el plan): solo el autor, los colaboradores invitados y los administradores pueden modificar un proyecto; para el resto es de solo lectura (403 en el backend; controles ocultos o deshabilitados y aviso «Solo lectura» en el taller). Afecta a todas las rutas que cambian el proyecto: `PUT /:id`, reescritura IA, traducción, importación de Word, recursos, reintento y turno de edición.
- **Concurrencia**: la toma del turno es una única operación condicional en Mongo; se probará con dos peticiones simultáneas.
- **Bloqueos huérfanos**: caducidad de 2 min; el frontend lo libera en `ngOnDestroy` y en `pagehide` (`navigator.sendBeacon`).
- **Notificaciones existentes**: `syncProjectNotification` hace upsert por `projectId`; con el filtro `recipientId: null` no tocará las invitaciones. Las notificaciones antiguas no tienen `recipientId` y siguen siendo globales.
- **Tamaño de archivos**: `project.controller.ts` (664 líneas) y `taller-view` (299 + 688 líneas) ya son grandes; la lógica nueva va en archivos propios y solo se añaden enlaces mínimos.
- **Zoneless**: el estado del turno y del registro va en signals; los temporizadores se limpian con `DestroyRef`.
- **Paridad ES/CA** en todos los textos nuevos, incluido el texto de la notificación.
- **Verificación**: `cd backend && npm test`; `cd frontend && npx eslint <archivos> && npx ngc -p tsconfig.app.json --noEmit && npm test`; prueba manual con dos usuarios en Docker (turno, 409, caducidad, invitación y registro); tras desplegar, `curl` a `/api/projects/:id/changes` y revisión de contenedores y migraciones.

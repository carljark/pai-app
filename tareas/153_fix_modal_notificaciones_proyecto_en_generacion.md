# Tarea 153: El proyecto en generación no aparecía en el modal de actividad

## Síntoma

Al pulsar "Generar proyecto" se abre el modal de actividad reciente, pero el proyecto recién creado no aparecía hasta cerrar y volver a abrir el modal.

## Diagnóstico

`NotificationsFacade.openRecentActivity()` lanza una petición asíncrona `GET /api/notifications`. Esa petición puede resolver **después** de que el backend haya creado el proyecto y emitido el evento SSE `PROJECT_STATUS` (o después de responder al `POST /generate`). Al resolver, `loadNotifications()` llamaba a `notifications.set(mapped)`, **reemplazando** la lista y borrando la notificación que ya se había añadido por SSE (o que se añadiría poco después). Resultado: el proyecto no aparecía hasta una nueva recarga completa del modal.

## Solución

### 1. Fusión en lugar de reemplazo (`notifications.facade.ts`)

`loadNotifications()` captura un contador de revisión de SSE al iniciar la petición:

- Si **no** llegaron eventos SSE mientras la petición estaba en vuelo, aplica el snapshot de la base de datos tal cual.
- Si llegaron eventos SSE, fusiona (`mergeFetched`) conservando las notificaciones que no vienen en el snapshot (el proyecto recién creado) y prefiriendo siempre la entrada más reciente por `updatedAt`.

Usar un contador de revisión evita depender de marcas de tiempo, que fallan cuando varias operaciones ocurren en el mismo milisegundo.

### 2. Resincronización tras generar (`app.facade.ts`)

`onGenerateSuccess()` llama a `notifications.loadNotifications()`. Como el `POST /generate` ya respondió, el proyecto existe en el backend y su notificación se recupera de inmediato, garantizando que aparezca en el modal aunque el SSE no se haya entregado.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/src/app/features/notifications/services/notifications.facade.ts` | `loadNotifications` fusiona con `reconcileNotifications`. |
| `frontend/src/app/app.facade.ts` | Resincronización de notificaciones al terminar la petición de generación. |
| `frontend/src/app/app.facade.spec.ts` | Mock de `loadNotifications`. |
| `frontend/src/app/features/notifications/services/notifications.facade.spec.ts` | Tests de conservación de notificaciones SSE en vuelo y de preferencia por la entrada más reciente. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

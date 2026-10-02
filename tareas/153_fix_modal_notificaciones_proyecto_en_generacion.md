# Tarea 153: El proyecto en generación no aparecía en el modal de actividad

## Síntoma

Al pulsar "Generar proyecto" se abre el modal de actividad reciente, pero el proyecto recién creado no aparecía hasta cerrar y volver a abrir el modal.

## Diagnóstico

`NotificationsFacade.openRecentActivity()` lanza una petición asíncrona `GET /api/notifications`. Esa petición puede resolver **después** de que el backend haya creado el proyecto y emitido el evento SSE `PROJECT_STATUS` (o después de responder al `POST /generate`). Al resolver, `loadNotifications()` llamaba a `notifications.set(mapped)`, **reemplazando** la lista y borrando la notificación que ya se había añadido por SSE (o que se añadiría poco después). Resultado: el proyecto no aparecía hasta una nueva recarga completa del modal.

## Solución

### 1. Fusión en lugar de reemplazo (`notifications.facade.ts`)

`loadNotifications()` ahora delega en `reconcileNotifications()`, que fusiona el snapshot de la base de datos con el estado en memoria:

- Las notificaciones presentes en el snapshot se aplican, pero **no pisan** una entrada en memoria más reciente.
- Las notificaciones que solo están en memoria se conservan únicamente si aparecieron **después** de iniciar la petición (eventos SSE en vuelo), evitando así tanto perder el proyecto recién creado como conservar elementos obsoletos o borrados.

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

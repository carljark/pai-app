# Tarea 151: Corrección de notificaciones de proyecto que quedaban en "generando"

## Propósito

Una generación que terminó correctamente (~132,8 s) seguía mostrándose en el panel de notificaciones como si la IA continuara trabajando ("Analizando…" con temporizador). El estado final (`borrador`) nunca llegaba a la tarjeta.

## Diagnóstico

El backend emite el fin de generación mediante dos eventos SSE: uno dirigido al usuario (`sendToUser`) y otro de difusión (`broadcast`) desde `syncProjectNotification`. Ambos son correctos y el documento `Notification` se persiste con `status: 'borrador'`.

El problema está en el cliente: el estado de las notificaciones solo se actualiza con esos eventos SSE. Si la conexión `EventSource` se interrumpe o la pestaña pasa a segundo plano durante una generación larga, el evento terminal se pierde y **no existe ningún mecanismo de resincronización**. El resultado es una tarjeta congelada en `generando` hasta recargar la página.

Agravantes detectados:
- La ruta SSE no enviaba *heartbeats*, lo que facilita que proxies/navegadores cierren conexiones inactivas.
- El payload SSE incluía el proyecto completo (`generatedContent.rawText`, prompts), innecesario para pintar la notificación y propenso a fallos de escritura.
- Si `res.write` lanzaba una excepción en `sendToUser`, esta se propagaba y podía marcar el proyecto como `error` aunque la generación hubiera ido bien.

## Solución

### Backend

- `backend/src/services/sse.service.ts`:
  - Heartbeat cada 25 s (`: ping\n\n`, `unref()` para no retener el proceso) para mantener viva la conexión.
  - `removeClient` limpia el intervalo.
  - Escrituras protegidas: si `res.write` falla, el cliente se elimina en lugar de propagar la excepción.
- `backend/src/services/notification.service.ts`: `toProjectSummary()` envía al SSE solo los campos necesarios del proyecto (sin `generatedContent`, `aiPrompt` ni `aiInstruction`).
- `backend/src/services/queue.service.ts`: los eventos de éxito/error usan el resumen ligero y añaden `status` explícito.

### Frontend

- `frontend/src/app/features/notifications/services/notifications.facade.ts`:
  - Al recibir `CONNECTED` (cada reconexión del `EventSource`) se recargan las notificaciones desde la base de datos, recuperando cualquier evento terminal perdido.
  - Se recargan las notificaciones al volver la pestaña a primer plano (`visibilitychange`).
  - `openRecentActivity()` resincroniza antes de abrir el modal.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/src/services/sse.service.ts` | Heartbeat, limpieza de clientes y escrituras seguras. |
| `backend/src/services/notification.service.ts` | Resumen ligero del proyecto en el payload SSE. |
| `backend/src/services/queue.service.ts` | Payload SSE ligero y `status` explícito. |
| `frontend/src/app/features/notifications/services/notifications.facade.ts` | Resincronización en `CONNECTED`, `visibilitychange` y apertura del modal. |
| `backend/src/tests/sse.service.test.ts` | Test de heartbeat y limpieza. |
| `frontend/src/app/features/notifications/services/notifications.facade.spec.ts` | Test de resincronización en `CONNECTED`. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

Resultado esperado: aunque se pierda un evento SSE, la tarjeta converge al estado real al abrir el panel, al volver a la pestaña o al reconectar el stream.

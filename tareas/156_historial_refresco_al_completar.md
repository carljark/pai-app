# Tarea 156: El historial no se refrescaba al completarse la generación

## Síntoma

En el archivo/historial de proyectos, un proyecto recién generado seguía mostrándose como `GENERANDO` aunque en el modal de notificaciones ya aparecía como completado.

## Causa

El refresco del historial estaba acoplado al evento SSE `latestNotification`: `AppFacade` llamaba a `projects.loadHistory()` únicamente cuando cambiaba `latestNotification` con tipo `STATUS`/`COMPLETED`/`ERROR`.

Sin embargo, con el sondeo de respaldo añadido al modal de actividad reciente, el estado puede actualizarse vía `loadNotifications()` **sin** pasar por `latestNotification`. En ese caso, las notificaciones mostraban "completado" pero el historial nunca se recargaba y permanecía con el estado antiguo.

## Solución

Se desacopla el refresco del historial de `latestNotification`:

- Nuevo efecto en `AppFacade` que observa la lista `notifications()` y calcula una firma con `projectId + status + generationTimeMs`.
- Cuando la firma cambia (es decir, algún proyecto cambia de estado), se llama a `projects.loadHistory()`.
- Funciona tanto si el cambio llega por SSE como por el sondeo de respaldo del modal.
- `initNotificationEffect` queda solo para los modales de éxito/error (ya no recarga el historial), evitando peticiones duplicadas.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/src/app/app.facade.ts` | Nuevo efecto `initHistoryRefreshEffect`; el efecto de `latestNotification` ya no recarga el historial. |
| `frontend/src/app/app.facade.spec.ts` | Mock con señal `notifications`; tests de refresco de historial por cambio de notificaciones y ajuste de los de ERROR/COMPLETED. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

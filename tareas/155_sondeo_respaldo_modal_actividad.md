# Tarea 155: Sondeo de respaldo en el modal de actividad reciente

## Síntoma

Tras generar un proyecto (unos 4-5 minutos), el modal de actividad reciente seguía mostrando el contador como si continuara generándose. Solo al cerrarlo y volverlo a abrir aparecía como generado.

## Diagnóstico de la comunicación con el backend

Se probó el stream SSE real (backend en Docker en `:3000`, frontend `ng serve` en `:4200`):

- `GET /api/projects/stream?token=…` entrega `CONNECTED` de inmediato **tanto directo como a través del proxy de Angular**.
- El heartbeat (`: ping`) llega cada 25 s a través del proxy, así que **el stream no está bufferizado y los eventos intermedios se envían**.
- El backend emite el evento de fin (`syncProjectNotification` → `broadcast`) y el proyecto queda en `borrador` en la base de datos (por eso al reabrir aparece generado).

Conclusión: el problema no es de red/proxy, sino de que el evento terminal no siempre llega a aplicarse en vivo en el cliente (conexión SSE caída/reconectada en el momento del fin, pestaña en segundo plano, etc.). No había ningún respaldo que garantizara la convergencia mientras el modal permanecía abierto.

## Solución

Se añade un **sondeo de respaldo** en `NotificationsFacade`: mientras el modal de actividad reciente está abierto, se recargan las notificaciones cada 5 s (`loadNotifications`).

- El efecto observa la señal `recentActivityOpen`; al abrir el modal inicia el intervalo y al cerrarlo lo limpia (`onCleanup`).
- La recarga usa la fusión con contador de revisión de SSE ya existente, por lo que no pisa notificaciones añadidas por SSE en vuelo.
- El intervalo se marca `unref()` para no retener procesos en tests.

Con esto, aunque se pierda el evento SSE, el modal converge al estado real de la base de datos en un máximo de ~5 s.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/src/app/features/notifications/services/notifications.facade.ts` | Efecto de sondeo mientras el modal está abierto. |
| `frontend/src/app/features/notifications/services/notifications.facade.spec.ts` | Test de sondeo al abrir y parada al cerrar. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio). Las pruebas de SSE se hicieron con `curl` y scripts temporales ya eliminados.

# Actualización del spec de NotificationsBadge

## Propósito
Corregir referencias obsoletas al estado local `isOpen` en las pruebas de `NotificationsBadgeComponent`, que ahora delega la apertura y el cierre del modal a `NotificationsFacade`.

## Cambio técnico
El mock de `NotificationsFacade` incorpora la señal `recentActivityOpen` y los métodos `openRecentActivity()` y `closeRecentActivity()`. Las pruebas verifican el estado y las operaciones expuestas por la fachada, manteniendo la comprobación de que abrir el modal marca las notificaciones como leídas.

## Archivos modificados
- `frontend/src/app/features/notifications/components/notifications-badge/notifications-badge.component.spec.ts`
- `tareas/144_actualizacion_spec_notifications_badge_estado_modal.md`

## Verificación
No se ejecutaron tests ni build, conforme a `AGENTS.md`.

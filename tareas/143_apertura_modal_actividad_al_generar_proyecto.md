# Apertura automática del modal de actividad al generar

## Propósito
Al completar correctamente la solicitud de generación de un proyecto, mostrar al usuario el modal de actividad reciente con el estado actualizado de sus proyectos.

## Arquitectura y flujo
`AppFacade` coordina el caso de uso de generación y, al recibir una respuesta satisfactoria, solicita la apertura de actividad reciente mediante `NotificationsFacade`. La fachada de notificaciones expone un estado signal y operaciones para abrir/cerrar la vista, sin depender de componentes Angular visuales. `NotificationsBadgeComponent`, como adaptador de presentación que contiene `RecentActivityModalComponent`, enlaza ese estado con el modal. La apertura también marca las notificaciones como leídas, igual que la acción manual existente.

El mensaje informativo independiente de proyecto en cola se sustituye por el modal de actividad, evitando mostrar dos modales superpuestos; se mantiene la recarga del historial y la navegación a la vista de historial.

## Archivos modificados
- `frontend/src/app/app.facade.ts`: solicita abrir el modal al completar correctamente la generación.
- `frontend/src/app/features/notifications/services/notifications.facade.ts`: estado y operaciones de apertura/cierre del modal; marca notificaciones como leídas al abrir.
- `frontend/src/app/features/notifications/components/notifications-badge/notifications-badge.component.ts`: conecta el estado de la fachada con el componente de presentación.
- `frontend/src/app/app.facade.spec.ts`: adapta el mock de notificaciones y verifica la solicitud de apertura tras el éxito.

## Decisiones técnicas
- `AppFacade` no importa ni manipula directamente componentes de UI.
- La visualización permanece en el adaptador de presentación ya existente; no se crea una segunda instancia del modal.
- No se ejecutaron tests ni build, conforme a `AGENTS.md`.

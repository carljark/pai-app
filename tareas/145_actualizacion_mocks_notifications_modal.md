# Actualización de mocks de notificaciones en tests de integración

## Propósito
Adaptar los mocks de `NotificationsFacade` al contrato de estado del modal de actividad reciente introducido para `NotificationsBadgeComponent`.

## Cambio técnico
Se añadió `recentActivityOpen` y las operaciones `openRecentActivity()`/`closeRecentActivity()` a los mocks compartidos por las pruebas de la barra lateral y la aplicación raíz. También se agregó `markAllAsRead()` al mock de la aplicación para mantener completo el contrato usado por la fachada de presentación.

## Archivos modificados
- `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts`
- `frontend/src/app/app.spec.ts`
- `tareas/145_actualizacion_mocks_notifications_modal.md`

## Verificación
No se ejecutaron tests ni build, conforme a `AGENTS.md`.

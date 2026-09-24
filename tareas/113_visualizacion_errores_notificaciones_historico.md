# Tarea 113: Visualización de Errores de Generación en Notificaciones e Histórico de Proyectos

## Propósito
Permitir a los usuarios visualizar el mensaje de error específico cuando falla la generación de un proyecto por IA, tanto en el panel de notificaciones / actividad reciente como en el historial de proyectos (vistas general y personal). Anteriormente, el detalle del error únicamente se registraba y visualizaba en el panel de administración (`AdminDashboardComponent`), dejando al usuario final únicamente con una indicación genérica de estado de error sin información diagnóstica.

## Arquitectura y Flujo de Datos

```
                                  ┌─────────────────────────────┐
                                  │       AI Generation         │
                                  │      (queue.service.ts)     │
                                  └──────────────┬──────────────┘
                                                 │ Error capturado
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Project.errorDetail     │
                                  │     (MongoDB Project Doc)   │
                                  └──────────────┬──────────────┘
                                                 │
                      ┌──────────────────────────┴──────────────────────────┐
                      ▼                                                     ▼
        ┌───────────────────────────┐                         ┌───────────────────────────┐
        │   syncProjectNotification │                         │       SSE Broadcast       │
        │    (Notification Doc:     │                         │   (type: PROJECT_ERROR /  │
        │     errorDetail, etc.)    │                         │    PROJECT_STATUS)        │
        └─────────────┬─────────────┘                         └─────────────┬─────────────┘
                      │                                                     │
                      └──────────────────────────┬──────────────────────────┘
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     NotificationMapper      │
                                  │ (errorDetail, error mapped) │
                                  └──────────────┬──────────────┘
                                                 │
                 ┌───────────────────────────────┴───────────────────────────────┐
                 ▼                                                               ▼
  ┌─────────────────────────────┐                                 ┌─────────────────────────────┐
  │ RecentActivityModalComponent│                                 │    HistoryViewComponent /   │
  │   - Error banner inline     │                                 │    PersonalViewComponent    │
  │     (getErrorMessage(p))    │                                 │   - Error banner en tarjeta │
  └─────────────────────────────┘                                 │   - Modal de error al pulsar│
                                                                  │     "Ver Error" (AppFacade) │
                                                                  └─────────────────────────────┘
```

1. **Backend (Persistencia y Difusión):**
   - Cuando la generación falla, `queue.service.ts` almacena el mensaje de error en `project.errorDetail`.
   - Se actualizó el esquema de `Notification` (`backend/src/models/Notification.ts`) agregando el campo `errorDetail: { type: String }`.
   - `notification.service.ts` propaga `errorDetail` en `buildUpdateData` y en la emisión SSE `broadcast({ ..., errorDetail, error })`.
   - `notification.controller.ts` incluye `errorDetail` al inicializar/backfillear notificaciones desde proyectos existentes.

2. **Frontend (Modelado y Mapeo):**
   - `AppNotification` y `RawNotificationEvent` (`notification.model.ts`) se extendieron con `errorDetail?: string;` y `error?: string;`.
   - `NotificationMapper` (`notification.mapper.ts`) mapea `errorDetail` y `error` tanto desde documentos de base de datos (`fromDbEntity`) como desde eventos reactivos SSE (`fromRawEvent`).

3. **Frontend (Componentes de Interfaz):**
   - `RecentActivityModalComponent`: Incorpora la función de resolución `getErrorMessage(p)` y renderiza un banner visual descriptivo con estilo idéntico al panel de administración (`#fee2e2`, borde `#fecaca`, texto `#b91c1c` con icono de alerta ⚠️).
   - `HistoryViewComponent` y `PersonalViewComponent`: Muestran el cuadro de error detallado en la tarjeta del proyecto con estado de error.
   - `AppFacade.viewPastProject(project)`: Al hacer clic en el botón "Ver Error", si el proyecto está en estado de error, levanta el modal interactivo de error del sistema (`showErrorModal`) mostrando el detalle completo en lugar de redirigir a un editor vacío sin contenido.

## Archivos Modificados

### Backend
- [`backend/src/models/Notification.ts`](file:///Users/csgj/dev/pai-app/backend/src/models/Notification.ts): Añadido el campo `errorDetail` en el esquema Mongoose de notificaciones.
- [`backend/src/services/notification.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/notification.service.ts): Soporte para `errorDetail` en `NotificationExtra`, actualización en base de datos y payload de SSE.
- [`backend/src/services/queue.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/queue.service.ts): Envío explícito de `errorDetail` a `syncProjectNotification`.
- [`backend/src/controllers/notification.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/notification.controller.ts): Poblado de `errorDetail` en la rutina de backfill de notificaciones.
- [`backend/src/tests/notifications.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/notifications.test.ts): Pruebas unitarias para validar la persistencia y emisión de `errorDetail`.

### Frontend
- [`frontend/src/app/features/notifications/models/notification.model.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/models/notification.model.ts): Tipos `errorDetail` y `error` en las interfaces `AppNotification` y `RawNotificationEvent`.
- [`frontend/src/app/features/notifications/mappers/notification.mapper.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/mappers/notification.mapper.ts): Mapeo robusto de campos de error con fallback al mensaje de la entidad.
- [`frontend/src/app/features/notifications/mappers/notification.mapper.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/mappers/notification.mapper.spec.ts): Pruebas unitarias del mapeo de errores.
- [`frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts): Banner de error en la lista de actividad reciente y método `getErrorMessage`.
- [`frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts): Pruebas unitarias de renderizado y lógica de extracción del error.
- [`frontend/src/app/features/history/components/history-view/history-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.ts): Banner de error dentro de cada tarjeta de proyecto fallido.
- [`frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.spec.ts): Prueba de renderizado de `errorDetail` en histórico.
- [`frontend/src/app/features/personal/components/personal-view/personal-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/personal/components/personal-view/personal-view.component.ts): Banner de error en vista personal de proyectos.
- [`frontend/src/app/features/personal/components/personal-view/personal-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/personal/components/personal-view/personal-view.component.spec.ts): Prueba de renderizado de `errorDetail` en vista personal.
- [`frontend/src/app/app.facade.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.facade.ts): Intercepción en `viewPastProject` para proyectos con error, abriendo el modal de error (`showErrorModal`).
- [`frontend/src/app/app.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.facade.spec.ts): Pruebas unitarias para `viewPastProject` con estado de error.

## Detalles Técnicos
1. **Consistencia Visual con Administración:** Se adoptó el mismo patrón cromático del panel de administración (`background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 6px;`) para que la experiencia sea coherente en toda la aplicación.
2. **Resiliencia en Extracción de Errores:** Tanto `RecentActivityModalComponent` como `NotificationMapper` manejan múltiples posibilidades de procedencia del error (`p.errorDetail`, `p.error` y `p.message` cuando no es un título genérico) garantizando retrocompatibilidad con registros antiguos en base de datos.
3. **Acción de Usuario Optimizada:** Cuando un usuario ve un error en su historial, tiene el detalle visible de inmediato en la tarjeta; si pulsa "Ver Error", en lugar de navegar a una pantalla en blanco de taller, se le abre la ventana modal con el error para una lectura cómoda.
4. **Cobertura de Pruebas:** Se mantiene el 100% de tests pasando (120/120 en backend, 388/388 en frontend) con >95% de cobertura de branches en frontend.

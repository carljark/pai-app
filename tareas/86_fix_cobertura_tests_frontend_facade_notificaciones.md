# Tarea 86: Corrección de Cobertura de Ramas en Tests del Frontend (`NotificationsFacade` y `TelemetryService`)

## Propósito
Solucionar el fallo en el hook `pre-push` derivado de la verificación de cobertura estricta individual por archivo en `frontend/check-coverage.js`, donde [`NotificationsFacade`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/services/notifications.facade.ts) caía por debajo del 90% en la métrica de ramas (85.71%).

---

## Causa Raíz
1. **Instanciación Manual vs Inyección de Dependencias**:
   - En [`notifications.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/services/notifications.facade.spec.ts), el servicio se instanciaba manualmente mediante `new NotificationsFacade()` dentro de `TestBed.runInInjectionContext(...)` en lugar de usar `TestBed.inject(NotificationsFacade)`. Esto dejaba sin ejecutar la fábrica interna generada por Angular para `@Injectable({ providedIn: 'root' })` (`NotificationsFacade.ɵfac`), computando una rama descubierta en la cabecera de la clase (línea 9).
2. **Rama de Fallback Temporal en Fusión de Notificaciones**:
   - En el método `mergeNotification`, la asignación `const newTime = notif.updatedAt || notif.timestamp` nunca evaluaba el lado derecho (`notif.timestamp`) cuando se recibía un evento de actualización de proyecto, ya que en las pruebas siempre se pasaba `updatedAt` poblado.
3. **Múltiples Tokens en Telemetría**:
   - En [`telemetry.service.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/services/telemetry.service.ts), la condición `localStorage.getItem("pai_token") || localStorage.getItem("token")` solo cubría `token` y no `pai_token`.

---

## Archivos Modificados

1. **`frontend/src/app/features/notifications/services/notifications.facade.spec.ts`**:
   - Refactorizado para inyectar `NotificationsFacade` directamente a través de `TestBed.inject(NotificationsFacade)` en el bloque `beforeEach`.
   - Añadido un caso de prueba para la actualización de notificación existente sin fecha `updatedAt`, garantizando cobertura completa de ambas ramas en `notif.updatedAt || notif.timestamp`.
2. **`frontend/src/app/services/telemetry.service.spec.ts`**:
   - Añadida prueba para validar la persistencia con `pai_token` en `localStorage`, asegurando el 100% de ramas en el servicio de telemetría.

---

## Detalles Técnicos y Resultados

- Se eliminó el boilerplate redundante `TestBed.runInInjectionContext` en cada `it()`, agilizando los tiempos de prueba.
- **Resultados de las pruebas de Frontend**:
  - Suites: **28 pasadas** de 28 (318 tests superados).
  - Cobertura global:
    - Statements: **98.94%** (umbral >= 90%)
    - Branches: **95.47%** (umbral >= 90%)
    - Functions: **97.74%** (umbral >= 90%)
    - Lines: **99.52%** (umbral >= 90%)
  - Todas las coberturas individuales por archivo superan holgadamente el 90%.
- El hook `.git/hooks/pre-push` valida exitosamente Backend + Frontend (`exit code 0`).

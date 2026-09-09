# Tarea 70: Corrección de ReferenceError: EventSource en Tests Unitarios y Sidebar Spec

## Propósito
Resolver el error emitido por `stderr` durante la ejecución de pruebas unitarias en `sidebar.component.spec.ts`:
```text
SSE Error in facade ReferenceError: EventSource is not defined
    at Observable._subscribe (pai.service.ts:31:27)
```
El propósito de esta corrección es proteger el servicio de eventos en tiempo real contra entornos donde la API del navegador `EventSource` no esté presente (entornos de pruebas Vitest/Node, SSR) y desacoplar adecuadamente los tests de componentes secundarios.

---

## Causa Raíz
1. **Instanciación no protegida de `EventSource`:**
   - En [frontend/src/app/services/pai.service.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/services/pai.service.ts), el método `listenToProjectUpdates()` invocaba directamente `new EventSource(...)` asumiendo su presencia global sin comprobar `(window as any)?.EventSource`.
   - En entornos como Vitest / Node.js / JSDOM, `EventSource` no forma parte del runtime global nativo a menos que se mockee explícitamente en ese test concreto.
2. **Falta de inyección de Mock en `sidebar.component.spec.ts`:**
   - El componente `SidebarComponent` incluye el componente hijo `<app-notifications-badge>`, el cual a su vez inyecta `NotificationsFacade`.
   - Al no proporcionarse un mock de `NotificationsFacade` en los `providers` del test `sidebar.component.spec.ts`, Angular instanciaba la fachada real.
   - El constructor de la fachada real ejecuta un `effect()` reactivo que detectaba al usuario autenticado de prueba (`mockAuth.currentUser`) e iniciaba la suscripción a `paiService.listenToProjectUpdates()`.
   - Al evaluarse la suscripción, se producía un `ReferenceError: EventSource is not defined`, el cual era capturado por el bloque de error del `subscribe` de la fachada e impreso por consola `stderr`.

---

## Arquitectura y Flujo de la Solución

```
[SidebarComponent Test]
       │
       ▼ (Mock en TestBed)
[NotificationsFacade Mock] ──x (Evita llamar a PaiService real ni disparar efectos SSE)
       │
       ▼
Sin efectos colaterales en Sidebar Tests

========================================================================

[PaiService : listenToProjectUpdates()]
       │
       ├─► ¿Existe (window as any)?.EventSource?
       │        │
       │        ├─► NO (Entorno Node/SSR sin polyfill) ──► Retorna no-op unsubscribe: () => {}
       │        │
       │        └─► SÍ (Navegador real o test con mock) ──► Conecta new EventSource(url)
```

---

## Archivos Modificados

1. [frontend/src/app/services/pai.service.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/services/pai.service.ts):
   - Se añadió una guarda de comprobación `const EventSourceImpl = (window as any)?.EventSource; if (!EventSourceImpl) return () => {};` para evitar el lanzamiento de excepciones de referencia si la API no está soportada en el entorno actual.

2. [frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts):
   - Se registró el provider `{ provide: NotificationsFacade, useValue: mockNotifications }` en la configuración de `TestBed`.
   - Se eliminó la clase mock huérfana `MockNotificationsBadgeComponent` que no estaba en uso.

3. [frontend/src/app/services/pai.service.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/services/pai.service.spec.ts):
   - Se agregó un caso de prueba para verificar que cuando `EventSource` no está disponible en `window`, el servicio retorna una suscripción inerte limpia sin arrojar errores.

4. [frontend/src/app/features/notifications/services/notifications.facade.spec.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/services/notifications.facade.spec.ts):
   - Se ampliaron las pruebas unitarias para cubrir de forma controlada el manejo de errores SSE mediante espía de consola (`console.error`), reconexiones y variantes en `markAsRead`.

---

## Verificación y Cobertura
- **Ejecución aislada del test de Sidebar:** `npx ng test --include=src/app/layout/components/sidebar/sidebar.component.spec.ts` se ejecuta en 1.6s con 10/10 tests pasados y **cero mensajes de error en stderr**.
- **Suite completa del Frontend:** `npm test` ejecuta los 27 archivos de pruebas con 289 tests pasando al 100% y una cobertura global de líneas del 99.71% y ramas del 94.70%, superando con éxito todos los umbrales de `check-coverage.js`.

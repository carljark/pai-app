# 74. Corrección de Test Flaky en TelemetryService y Paso Exitoso del Pre-Push Hook

## Propósito
Solucionar el fallo en el hook de `pre-push` (`.git/hooks/pre-push`) que impedía subir cambios mediante `git push` debido a un error intermitente en la suite de pruebas unitarias del frontend:
`FAIL src/app/services/telemetry.service.spec.ts > should handle beforeunload window event directly`.

---

## Diagnóstico del Error

- En `telemetry.service.spec.ts`, el test previo simulaba el cierre de ventana con `sendBeacon`:
  ```ts
  Object.defineProperty(navigator, "sendBeacon", { value: beaconSpy, configurable: true });
  ```
- Al no restaurar `navigator.sendBeacon` ni limpiar `localStorage` en `afterEach`, el siguiente test (`should handle beforeunload window event directly`) heredaba la definición de `navigator.sendBeacon` y posibles tokens residuales de otras suites en `localStorage`.
- Cuando se disparaba el evento `beforeunload`, `TelemetryService.flushHeartbeat(true)` detectaba que existía `navigator.sendBeacon` y un token, por lo que enviaba el beacon nativo del navegador y retornaba de inmediato en lugar de ejecutar la petición HTTP estándar `this.http.post`.
- Como consecuencia, la aserción `httpTestingController.expectOne('/api/telemetry/heartbeat')` fallaba esperando una petición HTTP que nunca llegaba a emitirse.

---

## Arquitectura y Solución

Se aisló el estado global del entorno de pruebas (`navigator.sendBeacon` y `localStorage`):
1. **Guardado y Restauración:** Se guarda la referencia original de `navigator.sendBeacon` antes de sobreescribirla en el test de `sendBeacon`, restaurándola de inmediato al finalizar.
2. **Aislamiento en el test directo:** En el test directo de `beforeunload`, se garantiza `localStorage.clear()` y se define explícitamente `sendBeacon` como `undefined`, forzando el camino HTTP probado por `HttpClientTestingBackend`.
3. **Limpieza completa:** Al finalizar el test, se restaura el objeto `navigator` original.

---

## Archivos Modificados

- `frontend/src/app/services/telemetry.service.spec.ts`: Implementado aislamiento riguroso de `localStorage` y `navigator.sendBeacon`.

---

## Verificación

Se ejecutó el hook completo de pre-push:
1. **Backend Tests:** 13 archivos pasados (69 tests), cobertura de 97.45% (umbral > 90% cumplido).
2. **Frontend Tests:** 27 archivos pasados (289 tests), cobertura de 99.03% (umbral > 90% cumplido).
3. **Resultado:** `./.git/hooks/pre-push` finaliza con código de salida `0` (`✅ Todos los tests pasaron. Subiendo a producción...`).

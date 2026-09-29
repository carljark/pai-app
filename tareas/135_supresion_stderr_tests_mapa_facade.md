# 135 – Supresión de Salida `stderr` en Pruebas Unitarias de `MapaIntermodularFacade` y `App`

## Propósito

Eliminar la salida ruidosa a `stderr` que se mostraba en la consola de Vitest durante la ejecución de los tests unitarios del frontend:
```text
stderr | src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts > MapaIntermodularFacade > should handle loadSeed error gracefully
Error loading seed for tab CFGM_PELUQUERIA Error: Network error
    at .../mapa-intermodular.facade.spec.ts:345:65
```
Dicha traza generaba confusión, simulando un fallo cuando en realidad se trataba de una prueba intencional de captura de error controlada (`catch`).

---

## Análisis Técnico y Diagnóstico

1. **Comportamiento en `MapaIntermodularFacade.setTab()`:**
   - La función `setTab()` gestiona la carga asíncrona de las semillas del mapa intermodular. Ante un fallo de red o respuesta HTTP errónea, captura la excepción y ejecuta:
     ```ts
     console.error('Error loading seed for tab ' + tab, err);
     ```
   - En [`mapa-intermodular.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts), el test `'should handle loadSeed error gracefully'` simulaba deliberadamente un fallo del servicio con `throwError(() => new Error('Network error'))`.
   - Dado que `console.error` no estaba siendo espiado ni interceptado con un mock (`vi.spyOn`), Vitest capturó la invocación a `console.error` y la emitió como bloque `stderr` en la terminal.

2. **Detección adicional en `App.spec.ts`:**
   - Durante la prueba de ramas del template en [`app.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.spec.ts), la inicialización del componente `App` instanciaba de forma implícita `MapaIntermodularFacade` (cuyo constructor invoca `this.setTab('FPB')`).
   - Al carecer de un mock explícito en el `TestBed`, intentaba una petición HTTP real no configurada, imprimiendo un `HttpErrorResponse` en `stderr`.

---

## Arquitectura y Solución Técnica

1. **Espiado y Aserción en `mapa-intermodular.facade.spec.ts`:**
   - Se aplicó el patrón estándar del proyecto (utilizado en `app.facade.spec.ts`, `projects.facade.spec.ts`, etc.):
     ```ts
     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
     // Ejecución de la acción que debe fallar
     expect(consoleSpy).toHaveBeenCalledWith(
       expect.stringContaining('Error loading seed for tab CFGM_PELUQUERIA'),
       expect.any(Error)
     );
     consoleSpy.mockRestore();
     ```
   - Esto silencia la salida innecesaria a `stderr` a la vez que comprueba activamente que el error fue registrado en el logger correspondiente.

2. **Aislamiento en `app.spec.ts`:**
   - Se incorporó `mockMapaFacade` con señales reactivas mockeadas en los `providers` del `TestBed` de [`app.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.spec.ts), evitando la ejecución de peticiones HTTP laterales durante las pruebas del componente raíz `App`.

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts) | **MODIFICADO** | Intercepción de `console.error` mediante `vi.spyOn` con aserción del mensaje de error y restauración posterior. |
| [`frontend/src/app/app.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.spec.ts) | **MODIFICADO** | Inclusión de `MapaIntermodularFacade` con `mockMapaFacade` en los providers de `TestBed`. |

---

## Verificación y Pruebas

- **Suite de Pruebas Frontend (`npm test`):**
  - **33 suites** ejecutadas.
  - **424 tests** aprobados (100%).
  - **0 advertencias ni errores en `stderr`** (salida totalmente limpia).
  - Cobertura global de ramas: **95.69%** (umbral de aceptación: >= 90%).

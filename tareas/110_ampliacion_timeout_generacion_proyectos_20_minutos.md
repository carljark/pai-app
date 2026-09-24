# 110. Ampliación del Timeout de Generación de Proyectos a 20 Minutos

## Propósito
Ampliar el tiempo máximo de espera (*timeout*) en el proceso de generación de nuevos proyectos mediante Inteligencia Artificial, pasando de 10 minutos (600.000 ms) a **20 minutos (1.200.000 ms)**. 

Esta ampliación permite que solicitudes complejas —como las que involucran múltiples Resultados de Aprendizaje (RAs) o Criterios de Evaluación extensos (por ejemplo, proyectos multidisciplinares de FP Básica o del nuevo Grado Medio de Estética y Belleza)— dispongan de tiempo suficiente para completarse sin ser abortadas prematuramente, adaptando además los avisos al usuario en la interfaz.

---

## Arquitectura y Flujo Técnico

El flujo de generación de proyectos involucra varias capas, todas calibradas de forma armónica para soportar la ventana de 20 minutos:

```text
[Cliente Web / Frontend]
   │
   ├─► Avisos informativos: "Tardará entre 2 y 20 minutos" (es/ca)
   │
[Proxy Inverso Nginx (EC2)]
   │
   ├─► proxy_read_timeout: 3600s (1 hora, holgadamente superior a 20 min)
   │
[Servidor HTTP Node.js / Express (server.ts)]
   │
   ├─► server.requestTimeout: 1.260.000 ms (21 min)
   ├─► server.headersTimeout: 1.270.000 ms (~21.1 min)
   │
[Cola de Proyectos (queue.service.ts)]
   │
   ├─► generateAiContentWithFallback
         │
         ├── Proveedor Primario (Gemini SDK):
         │     timeoutMs: 1.200.000 ms (20 min)
         │     httpOptions: { timeout: 1.200.000 }
         │     withTimeout: 20 min -> Error descriptivo "(20m)"
         │
         └── Proveedor Fallback (OpenRouter API):
               timeoutMs: 1.200.000 ms (20 min)
               fetch(..., { signal: AbortSignal.timeout(1.200.000) })
               AbortError / TimeoutError -> Error descriptivo "(20m)"
```

---

## Archivos Modificados

1. [`backend/src/services/ai.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/ai.service.ts):
   - `generateGeminiContent`: Se actualizó el valor por defecto `timeoutMs = 1_200_000` (20 minutos) y el mensaje de error `Timeout en Gemini (20m)`.
   - `requestOpenRouterApi`: Se actualizó el valor por defecto `timeoutMs = 1_200_000` con `AbortSignal.timeout(1_200_000)` y el mensaje de error `Timeout en OpenRouter (20m)`.
2. [`backend/src/server.ts`](file:///Users/csgj/dev/pai-app/backend/src/server.ts):
   - Se ajustó `server.requestTimeout = 1_260_000` (21 minutos) y `server.headersTimeout = 1_270_000` para tolerar respuestas de la IA sin que el socket HTTP de Node.js corte la conexión.
3. [`frontend/src/app/services/translations.es.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/services/translations.es.ts):
   - Actualización de los textos `longGenerationNotice` y `longGenerationNoticePlural` a 20 minutos en castellano.
4. [`frontend/src/app/services/translations.ca.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/services/translations.ca.ts):
   - Actualización de los textos `longGenerationNotice` y `longGenerationNoticePlural` a 20 minuts en catalán.
5. [`frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts):
   - Actualización de la expectativa de test al nuevo aviso de 20 minutos.

---

## Verificación y Pruebas

1. **Backend Tests (`npm run test`)**:
   - 15 suites de tests ejecutadas (100% pasadas).
   - 120 tests unitarios y de integración superados con éxito.
2. **Frontend Tests (`npm test`)**:
   - 31 suites de tests ejecutadas (100% pasadas).
   - 376 tests unitarios superados con éxito.
   - Cobertura de ramas (branch coverage): **95.23%** (superando el umbral de 90%).

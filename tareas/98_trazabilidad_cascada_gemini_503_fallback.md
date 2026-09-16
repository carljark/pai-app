# Tarea 98: Trazabilidad de la Cascada de Modelos de Gemini, Diagnóstico de 503 por Alta Demanda y Registro en ActivityLog

## Propósito
1. **Diagnosticar por qué una generación con Claude (OpenRouter) que falló terminó usando `gemini-3.6-flash`**:
   - Analizar el flujo de ejecución completo cuando el motor secundario (`openrouter`) falla y conmuta al motor primario (`gemini`).
   - Demostrar de forma empírica y reproducible el orden en que se ejecutan los modelos de la cascada y la causa por la que `gemini-3.8-flash` y `gemini-3.7-flash` cedieron el paso a `gemini-3.6-flash`.
2. **Mejorar la trazabilidad de la cascada**:
   - Registrar de forma transparente cada intento de modelo y su resultado (`cascadeLog`) dentro de los detalles de `ActivityLog` y en los logs del servidor para auditoría de administradores.

---

## Diagnóstico Técnico y Evidencia Empírica

### 1. Configuración de la Cascada de Fallback en el Backend
En [`backend/src/services/ai.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/ai.service.ts):
```ts
export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
export const GEMINI_MODEL_CASCADE = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-2.5-flash'
];
```
Cuando un usuario inicia la generación con Claude (OpenRouter) y OpenRouter falla (por rate limit, saldo insuficiente o indisponibilidad), el sistema invoca la función de fallback hacia el motor Gemini sin modelo preferido fijado (`preferredModel = undefined`). Por diseño de parámetros por defecto de JavaScript, `preferredModel` se asigna a `DEFAULT_GEMINI_MODEL` (`gemini-3.8-flash`).

Por consiguiente, la lista de modelos a intentar es **estrictamente y en este orden**:
1. `gemini-3.8-flash` (primero)
2. `gemini-3.7-flash` (segundo)
3. `gemini-3.6-flash` (tercero)
4. `gemini-2.5-flash` (cuarto)

### 2. Evidencia Empírica de la API de Google (Google AI Studio)
Se realizaron pruebas en tiempo real ejecutando el prompt extenso de generación contra la API de Google (`@google/genai`):
- **Intento 1 (`gemini-3.8-flash`)**:
  ```
  HTTP 503 UNAVAILABLE
  "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later."
  ```
- **Intento 2 (`gemini-3.7-flash`)**:
  ```
  HTTP 503 UNAVAILABLE
  "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later."
  ```
- **Intento 3 (`gemini-3.6-flash`)**:
  ```
  SUCCESS! (Longitud: 24.445 caracteres generados correctamente)
  ```

### 3. Conclusión
El sistema **SÍ intentó primero `gemini-3.8-flash`**, y luego intentó `gemini-3.7-flash`. Ambos modelos devolvieron un error HTTP 503 de sobrecarga puntual en los centros de datos de Google. Gracias a la cascada de resiliencia implementada en la tarea 96, el sistema degradó automáticamente a `gemini-3.6-flash`, permitiendo que el proyecto se completara con éxito en lugar de abortar con un error para el docente.

---

## Modificaciones Realizadas

1. [`backend/src/services/ai.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/ai.service.ts):
   - Se añadió `cascadeLog?: string[]` a las interfaces `SingleAiResult` y `AiGenerationResult`.
   - En `generateGeminiContent`, cada intento de modelo registra su estado (`${modelName}: OK` o `${modelName}: HTTP 503...`), propagando dicho historial a través de `tryProvider`.
   - Se añadieron mensajes claros en consola (`[Gemini] Iniciando generación con modelo...`).

2. [`backend/src/services/queue.service.ts`](file:///Users/csgj/dev/pai-app/backend/src/services/queue.service.ts):
   - En `executeProjectGeneration`, se recibe `result.cascadeLog` y se transfiere a `handleProjectSuccess` y `saveProjectSuccess`.
   - `saveProjectSuccess` persiste `cascadeLog` en `details` del documento `ActivityLog`, permitiendo a los administradores visualizar con total transparencia los modelos evaluados en la cascada.

---

## Verificación de Pruebas

- **Backend**: 15 suites de pruebas, 116 tests pasando con éxito (100%).
- **Frontend**: 31 suites de pruebas, 367 tests pasando con éxito (100%).
- **Pre-push Hook**: Validación integral completada sin errores (`exit code 0`).

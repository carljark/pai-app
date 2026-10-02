# Configuración del esfuerzo de razonamiento de los modelos de IA

**Fecha:** 1 de octubre de 2026  
**Ámbito:** generación de proyectos y reescritura de contenido con IA en Plappin.

## Resumen

Las peticiones a modelos compatibles se configuran para usar un esfuerzo de razonamiento **alto**. La aplicación respeta el formato específico de cada proveedor y no envía el ajuste a modelos que no anuncian soporte o a routers cuyo destino cambia dinámicamente.

El ajuste afecta al razonamiento interno del modelo; la aplicación sigue mostrando y almacenando el contenido final, no la traza de razonamiento.

## Gemini

En `backend/src/services/ai.service.ts`, las llamadas a Gemini incluyen:

```ts
thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
```

Se aplica a los modelos Gemini conocidos que admiten `thinkingLevel`: `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-2.5-pro` y `gemini-3.1-pro-preview`. La cascada interna de Gemini (`3.8`, `3.7`, `3.6 Flash`) conserva el nivel alto al cambiar de modelo.

## OpenRouter

El backend añade `reasoning_effort: "high"` únicamente para los modelos del catálogo cuya metadata anuncia ese parámetro:

| Modelo | Esfuerzo enviado |
|---|---|
| `deepseek/deepseek-v4.1-flash` | `high` |
| `thinkingmachines/inkling-small:free` | `high` |
| `dots-studio/dots-3-note-preview:free` | No se envía |
| `inclusionai/ling-3.0-flash-vl:free` | No se envía |
| `cohere/north-mini-code:free` | No se envía |
| `liquid/lfm-2.5-2.6b:free` | No se envía |
| `openrouter/free` | No se envía: el modelo destino es dinámico |

DeepSeek V4.1 Flash es el modelo por defecto de OpenRouter en el frontend y en el backend. Por tanto, también recibe `reasoning_effort: "high"` cuando OpenRouter se activa como proveedor de fallback tras un error del proveedor primario.

La lista de capacidades está en `OPENROUTER_MODELS_WITH_REASONING_EFFORT` dentro de `backend/src/services/ai.service.ts`. Debe actualizarse tras comprobar las capacidades actuales del modelo en OpenRouter; no basta con que el API acepte el nombre genérico del parámetro.

## Coste y latencia

El razonamiento alto puede consumir más tokens de salida y aumentar la latencia. OpenRouter cuenta los tokens de razonamiento como tokens de salida facturables. El esfuerzo alto tampoco aumenta por sí solo el límite de tokens de respuesta; cualquier ampliación de ese límite debe tratarse y probarse por separado para evitar respuestas truncadas.

## Reintentos ante errores transitorios (503)

El 3 de octubre de 2026 se comprobó contra la API real de Gemini que los modelos de la cascada (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`) **existen y responden**, y que admiten `thinkingLevel: HIGH`. Los errores `HTTP 503` observados en el registro de actividad corresponden a saturación de capacidad del proveedor (`"This model is currently experiencing high demand"`), no a nombres de modelo inválidos.

Para mitigarlo, `generateGeminiContent` reintenta errores transitorios antes de pasar al siguiente modelo:

- Se reintentan estados `500`, `502`, `503`, `504` y mensajes de `UNAVAILABLE`/`high demand`/`overloaded`/`try again later`.
- Hasta 3 intentos por modelo, con espera exponencial (1,5 s y 3 s) entre reintentos.
- Los errores no transitorios (por ejemplo `429` de cuota o errores de validación) siguen provocando el salto inmediato al siguiente modelo de la cascada.

Constantes en `backend/src/services/ai.service.ts`: `GEMINI_RETRYABLE_STATUS`, `GEMINI_MAX_ATTEMPTS_PER_MODEL`, `GEMINI_RETRY_BASE_MS`.

## Verificación

Los tests de `backend/src/tests/ai.service.test.ts` comprueban que:

- Gemini recibe `thinkingLevel: HIGH` en un modelo compatible.
- DeepSeek recibe `reasoning_effort: "high"` como modelo por defecto y al entrar como fallback.
- Inkling recibe el esfuerzo alto.
- `dots-studio/dots-3-note-preview:free` y el router dinámico `openrouter/free` no reciben ese parámetro.

Para ejecutar los tests del backend:

```bash
cd backend && npm run test:cov
```

## Referencias

- [Gemini API: Thinking](https://ai.google.dev/gemini-api/docs/thinking)
- [OpenRouter: Reasoning Tokens](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens)
- [OpenRouter: Parameters](https://openrouter.ai/docs/api_reference/parameters)

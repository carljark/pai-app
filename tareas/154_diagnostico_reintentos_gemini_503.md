# Tarea 154: Diagnóstico y reintentos de los modelos Gemini (HTTP 503)

## Síntoma

El registro de actividad mostraba fallos de todos los modelos de la cascada Gemini desde hacía días:

```
Errores en reintentos:
gemini-3.8-flash: HTTP 503
gemini-3.7-flash: HTTP 503
gemini-3.6-flash: HTTP 503
```

## Diagnóstico (pruebas contra la API real)

Se ejecutaron pruebas directas con la `GEMINI_API_KEY` del `.env` usando `@google/genai`:

1. **Catálogo de modelos:** la API lista `gemini-3.8-flash`, `gemini-3.7-flash` y `gemini-3.6-flash` como disponibles (con `generateContent`), junto a `gemini-3.5-flash`, `gemini-flash-latest`, `gemini-2.5-flash`, etc. `gemini-2.0-flash` ya no existe (404).
2. **Generación con la configuración real de la app** (`thinkingConfig.thinkingLevel = HIGH`):
   - `gemini-3.8-flash`: OK (un 503 aislado en 6 llamadas).
   - `gemini-3.7-flash`: OK.
   - `gemini-3.6-flash`: OK.
3. **Stress (4 intentos por modelo):** `3.8` 3/4, `3.7` 4/4, `3.6` 4/4; `gemini-3.5-flash` 2/4, `gemini-3.5-flash-lite` 4/4, `gemini-flash-lite-latest` 4/4.

**Conclusión:** los nombres de modelo son correctos y funcionan. El `HTTP 503` corresponde a saturación temporal de capacidad del proveedor (`"This model is currently experiencing high demand. Spikes in demand are usually temporary."`), que puede afectar simultáneamente a varios modelos `3.x` y, sin reintentos, agota la cascada y salta a OpenRouter.

## Solución

`generateGeminiContent` ahora reintenta los errores transitorios **en el mismo modelo** antes de pasar al siguiente:

- Estados reintentables: `500`, `502`, `503`, `504` y mensajes `UNAVAILABLE` / `high demand` / `overloaded` / `try again later`.
- Hasta 3 intentos por modelo, con backoff lineal (1,5 s → 3 s).
- Los errores no transitorios (`429` de cuota, validación, timeout de 20 min) siguen saltando de inmediato al siguiente modelo.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `backend/src/services/ai.service.ts` | Reintentos con backoff para errores transitorios en `generateGeminiContent`. |
| `backend/src/tests/ai.service.test.ts` | Test de reintento de 503 en el mismo modelo. |
| `documentation/configuracion_esfuerzo_razonamiento_ia.md` | Sección de reintentos y resultado del diagnóstico. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio). Las pruebas contra la API se hicieron desde un script temporal, ya eliminado.

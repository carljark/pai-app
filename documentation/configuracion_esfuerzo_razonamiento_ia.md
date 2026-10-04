# Configuración del esfuerzo de razonamiento de los modelos de IA

**Fecha:** 1 de octubre de 2026  
**Ámbito:** generación de proyectos y reescritura de contenido con IA en Plappin.

## Resumen

Las peticiones a modelos compatibles se configuran para usar un esfuerzo de razonamiento **alto**. La aplicación respeta el formato específico de cada proveedor y no envía el ajuste a modelos que no anuncian soporte o a routers cuyo destino cambia dinámicamente.

El ajuste afecta al razonamiento interno del modelo; la aplicación sigue mostrando y almacenando el contenido final, no la traza de razonamiento.

## Estado actual (3 de octubre de 2026): Gemini desactivado y cascada en OpenRouter

- **Gemini está desactivado por defecto** porque la cuenta está en el nivel gratuito: 20 peticiones al día por modelo, que se agotaban con dos o tres traducciones.
  - Con Gemini desactivado (`isGeminiEnabled()` en `backend/src/data/ai-models.ts`), `GET /api/ai/models` solo ofrece OpenRouter.
  - `resolveProvider()` convierte en `openrouter` cualquier petición o proyecto guardado con `gemini`, y `modelFitsProvider()` descarta los modelos de Gemini (los de OpenRouter llevan prefijo `organización/`).
  - El frontend solo muestra los proveedores del catálogo y cambia la selección si la actual no está disponible.
  - **Para reactivarlo**: `GEMINI_ENABLED=true` en el `.env` (raíz en producción) y `docker compose -f docker-compose.prod.yml up -d` para recrear el backend. Los dos `docker-compose` pasan la variable con valor por defecto `false`. No hay que tocar código.
- **Cascada de modelos en OpenRouter** (`OPENROUTER_MODEL_CASCADE`, en el orden del catálogo): `deepseek/deepseek-v4.1-flash` (por defecto) → `openai/gpt-6-luna` → modelos gratuitos. Si un modelo devuelve error o agota el tiempo, `generateOpenRouterContent` intenta el siguiente. `cascadeLog` registra cada intento y `requestedModel` indica el modelo que respondió.
- **Peticiones sin razonamiento** (`generateAiContentWithFallback(..., { reasoning: false })`, usado en las traducciones):
  - a los modelos con soporte confirmado (DeepSeek, GPT-6 Luna, Inkling: parámetro `reasoning` en `supported_parameters`) se envía `reasoning: { enabled: false }`; en Gemini se omite `thinking_level`;
  - **motivo**: DeepSeek V4.1 Flash razona por defecto aunque no se le envíe `reasoning_effort`. Medido con una sección de 6000 caracteres: 169 s y 9477 tokens de razonamiento frente a 34 s y 0 tokens con el razonamiento desactivado (coste 0,0046 $ frente a 0,0008 $);
  - la generación de proyectos y la reescritura mantienen `reasoning_effort: "high"`.

## Gemini (cuando está activado)

Desde el 2 de octubre de 2026, `backend/src/services/ai.service.ts` llama a Gemini mediante la **Interactions API** (`ai.interactions.create`, `POST /v1beta/interactions`) en lugar de `models.generateContent`. Con la clave actual, `generateContent` devuelve `404 NOT_FOUND` en todos los modelos Gemini 3.x (y en 2.5 indica "no longer available to new users"), aunque aparezcan en el listado de modelos. La Interactions API sí responde con los mismos modelos. El texto se lee de `output_text` y el modelo usado de `model`.

Las peticiones incluyen:

```ts
{ model, input, system_instruction, generation_config: { thinking_level: 'high' } }
```

`generation_config.thinking_level` se aplica a los modelos Gemini conocidos que admiten razonamiento. Actualmente el catálogo habilita únicamente `gemini-3.6-flash`, por lo que la cascada interna de Gemini usa ese único modelo. Los modelos `3.8` y `3.7` se retiraron al sufrir saturación de capacidad (HTTP 503) recurrente; el detalle está en `backend/src/data/ai-models.ts`.

## Catálogo único de modelos

Los modelos disponibles en la aplicación se definen en un único lugar: `backend/src/data/ai-models.ts`. De ahí se derivan `DEFAULT_GEMINI_MODEL`, `DEFAULT_OPENROUTER_MODEL`, `GEMINI_MODEL_CASCADE`, `GEMINI_MODELS_WITH_THINKING_LEVEL` y `OPENROUTER_MODELS_WITH_REASONING_EFFORT`.

El backend expone el catálogo en `GET /api/ai/models` (`backend/src/controllers/ai.controller.ts`), y el frontend lo consume mediante `ProjectsService.getAiModels()`. El generador y el taller ya no contienen nombres de modelo hardcodeados.

## OpenRouter

El backend añade `reasoning_effort: "high"` únicamente para los modelos del catálogo cuya metadata anuncia ese parámetro:

| Modelo | Esfuerzo enviado |
|---|---|
| `deepseek/deepseek-v4.1-flash` | `high` |
| `openai/gpt-6-luna` | `high` (de pago: 0,10 $/M entrada, 0,50 $/M salida) |
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

## Cuota y errores transitorios

El 2 de octubre de 2026 se comprobó que la clave de Gemini está en el **nivel gratuito**, con un límite de **5 peticiones por minuto y por modelo** (`GenerateRequestsPerMinutePerProjectPerModel-FreeTier`). Al superarlo la API responde `429 RESOURCE_EXHAUSTED`. Además, los modelos `3.8` y `3.7` devolvían `503 UNAVAILABLE` ("high demand") de forma recurrente.

Por eso se dejó solo `gemini-3.6-flash`, se eliminaron los reintentos sobre el mismo modelo (consumían la cuota de 5/min) y se centralizó el catálogo. Si se necesita más capacidad, la solución de fondo es activar la facturación del proyecto de Google Cloud.

## Tamaño del prompt y 503

Un prompt extremadamente largo o pesado también puede provocar `503` (el proveedor rechaza la petición "compleja"). La construcción del prompt inyecta ejemplos INTEF, proyectos aprobados y documentos de coincidencias; en producción se midió un `aiInstruction` de ~76.000 caracteres. Para acotarlo:

- `MAX_INTEF_EXAMPLES = 8` y cada ejemplo se recorta a `MAX_INTEF_EXAMPLE_CHARS = 1200` (`ai.service.ts`). De esos 8, como mucho `MAX_APS_EXAMPLES = 3` son fichas de aprendizaje-servicio (tarea 187).
- `MAX_COINCIDENCIA_INSTRUCTIONS_CHARS = 6000`, `MAX_FPB_MATCH_CHARS = 4000` y `MAX_FPB_MATCHES = 4` (`project.controller.ts`).
- Los proyectos aprobados se limitan a `MAX_APPROVED_PROJECTS = 5` × `APPROVED_PROJECT_TEXT_LIMIT = 4000`.
- Se registra `[Prompt] tipoNivel=... userPrompt=... chars, instruction=... chars` para vigilar el tamaño.

Si vuelven a aparecer 503, es el primer sitio donde mirar: conviene reducir estos límites antes de cambiar de modelo.

## Verificación

Los tests de `backend/src/tests/ai.service.test.ts` comprueban que:

- Gemini se llama por `interactions.create` con `system_instruction` y `generation_config.thinking_level: "high"` en un modelo compatible, y sin `generation_config` en uno desconocido.
- DeepSeek recibe `reasoning_effort: "high"` como modelo por defecto y al entrar como fallback.
- Inkling y GPT-6 Luna reciben el esfuerzo alto.
- `dots-studio/dots-3-note-preview:free` y el router dinámico `openrouter/free` no reciben ese parámetro.

Para ejecutar los tests del backend:

```bash
cd backend && npm run test:cov
```

## Referencias

- [Gemini API: Thinking](https://ai.google.dev/gemini-api/docs/thinking)
- [OpenRouter: Reasoning Tokens](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens)
- [OpenRouter: Parameters](https://openrouter.ai/docs/api_reference/parameters)

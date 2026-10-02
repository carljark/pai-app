# Tarea 170: Gemini por Interactions API y GPT-6 Luna en OpenRouter

## Propósito
1. Diagnosticar por qué el proveedor Gemini no funcionaba y, si no tenía arreglo, desactivarlo.
2. Añadir GPT-6 Luna a los modelos de OpenRouter.

## Diagnóstico de Gemini (2 de octubre de 2026)
- `GET /v1beta/models` con la clave del proyecto responde 200 y lista `gemini-3.6-flash`, `gemini-3.7-flash` y `gemini-3.8-flash`.
- `POST /v1beta/models/<modelo>:generateContent`, el método que usaba el backend, devuelve **404 NOT_FOUND** en todos ellos. En los 3.x el cuerpo llega vacío; en `gemini-2.5-flash` el mensaje dice: *"no longer available to new users… We recommend you to use the Interactions API"*.
- `POST /v1beta/interactions` (Interactions API) responde `completed` con `gemini-3.6-flash` y `gemini-3.8-flash`.

Conclusión: el problema no era el modelo sino el método de la API. No hace falta desactivar Gemini.

## Arquitectura y flujo
- `generateGeminiContent` (`backend/src/services/ai.service.ts`) usa `ai.interactions.create(...)` del SDK `@google/genai` 2.17.1, que ya lo incluye. El resto de la lógica se mantiene: cascada de modelos del catálogo, timeout, `cascadeLog` y fallback a OpenRouter.
- Nuevo helper `buildGeminiInteraction(model, input, systemInstruction)`:
  - envía `system_instruction`;
  - envía `generation_config.thinking_level: 'high'` solo en los modelos de `GEMINI_MODELS_WITH_THINKING_LEVEL`, de acuerdo con AGENTS.md §9.
- Respuesta: el texto se lee de `output_text` (cadena vacía si falta) y el modelo de `model`.
- GPT-6 Luna se añade a `OPENROUTER_AVAILABLE_MODELS` como `openai/gpt-6-luna` con `reasoningEffort: true`. Llega al frontend por `GET /api/ai/models` sin cambios en el cliente.

## Archivos modificados
1. `backend/src/services/ai.service.ts`: migración a la Interactions API.
2. `backend/src/data/ai-models.ts`: entrada `openai/gpt-6-luna`.
3. `backend/src/tests/ai.service.test.ts`:
   - mock de `interactions.create`;
   - expectativas `system_instruction`/`generation_config`;
   - test de respuesta sin `output_text` y modelo sin `thinking_level`;
   - GPT-6 Luna en el test de `reasoning_effort`.
4. `backend/src/tests/projects.test.ts`: mock de Gemini adaptado.
5. `documentation/configuracion_esfuerzo_razonamiento_ia.md`: nueva API, tabla de OpenRouter y verificación.

## Decisiones técnicas
- **Migrar en vez de desactivar**: la Interactions API funciona con la misma clave y los mismos modelos, y el SDK instalado ya la soporta.
- **Catálogo Gemini sin cambios**: solo `gemini-3.6-flash`. `gemini-3.8-flash` también respondió en la prueba, pero los 503 recurrentes que motivaron su retirada no se han vuelto a evaluar. Su reactivación es una decisión aparte.
- **GPT-6 Luna es de pago** (0,10 $/M tokens de entrada, 0,50 $/M de salida). La clave de OpenRouter ya no está en el nivel gratuito (`is_free_tier: false`), así que la llamada funciona. Admite `reasoning_effort`, comprobado en sus `supported_parameters` y con una petición real.
- **Scripts auxiliares de `backend/scripts/`** (traducción e ingesta) siguen usando `generateContent`. No forman parte del producto y no se migraron; fallarán si se ejecutan con esta clave.

## Verificación
- Prueba real con `generateGeminiContent`: `gemini-3.6-flash: OK`, unos 19 s con razonamiento alto.
- Prueba real de `openai/gpt-6-luna` por OpenRouter con `reasoning_effort: high`: responde correctamente.
- Pendiente (usuario): `cd backend && npm run test:cov` y una generación completa desde la aplicación con cada proveedor.

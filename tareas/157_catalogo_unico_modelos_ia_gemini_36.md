# Tarea 157: Catálogo único de modelos de IA y solo Gemini 3.6 Flash

## Propósito

- Dejar únicamente `gemini-3.6-flash` como modelo Gemini (los `3.8` y `3.7` sufren 503 de capacidad y la cuenta está en free tier con 5 peticiones/minuto por modelo).
- Centralizar la lista de modelos en el backend y que el frontend la obtenga de un endpoint.
- Eliminar los reintentos sobre el mismo modelo (consumían la cuota gratuita).

## Cambios

### Backend
- `backend/src/data/ai-models.ts` (**nuevo**): fuente única de verdad del catálogo. Define `GEMINI_AVAILABLE_MODELS` (solo `gemini-3.6-flash`), `OPENROUTER_AVAILABLE_MODELS`, `AI_AVAILABLE_MODELS`, `AI_PROVIDER_CATALOG` y deriva `DEFAULT_GEMINI_MODEL`, `DEFAULT_OPENROUTER_MODEL`, `GEMINI_MODEL_CASCADE`, `GEMINI_MODELS_WITH_THINKING_LEVEL` y `OPENROUTER_MODELS_WITH_REASONING_EFFORT`.
- `backend/src/services/ai.service.ts`: consume el catálogo (re-exporta las constantes por compatibilidad) y se eliminan los reintentos (`sleep`, `isRetryableGeminiError`, constantes de retry). El bucle de Gemini vuelve a ser una única pasada por modelo.
- `backend/src/controllers/ai.controller.ts` (**nuevo**) y `backend/src/routes/ai.routes.ts` (**nuevo**): `GET /api/ai/models` (autenticado) devuelve `{ providers, models }`.
- `backend/src/server.ts`: monta `/api/ai`.

### Frontend
- `frontend/src/app/features/projects/models/project.model.ts`: se eliminan `GEMINI_MODELS`, `OPENROUTER_MODELS`, `getModelsForProvider`, `getDefaultModelForProvider` y `DEFAULT_OPENROUTER_MODEL`. Se añade `AiModelsResponse`.
- `frontend/src/app/features/projects/services/projects.service.ts`: `getAiModels()`.
- `frontend/src/app/features/projects/services/projects.facade.ts`: carga el catálogo del backend, `availableModels` se filtra por proveedor y `defaultModelForProvider()` usa los valores por defecto recibidos.
- `generator-view.component.html`: las opciones del selector de modelo se generan con `@for` sobre `availableModels()` (se quitan los nombres hardcodeados).
- `generator-view.component.ts` y `taller-view.component.ts`: usan `projects.defaultModelForProvider()`.
- `admin-dashboard.component.ts`: el modelo de reserva para logs se obtiene de `ProjectsFacade.defaultModelForProvider()` (ya no hay IDs de modelo hardcodeados en el frontend).

### Tests y documentación
- `backend/src/tests/ai-models.test.ts` (**nuevo**): catálogo y controlador.
- `backend/src/tests/ai.service.test.ts`: modelo por defecto y cascada actualizados; eliminado el test de reintentos.
- Specs de frontend (`project.model`, `projects.facade`, `generator-view`, `taller-view`, `admin-dashboard`) adaptadas al catálogo y a `defaultModelForProvider`.
- `documentation/configuracion_esfuerzo_razonamiento_ia.md`: catálogo único, endpoint y motivo del 429/503.

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

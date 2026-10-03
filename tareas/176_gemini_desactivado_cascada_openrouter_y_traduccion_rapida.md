# Tarea 176: Gemini desactivado, cascada de modelos en OpenRouter y traducción rápida

## Propósito
1. Desactivar Gemini (sin borrar código) mientras la cuenta esté en el nivel gratuito: 20 peticiones al día que se agotan con dos o tres traducciones.
2. Con OpenRouter como único proveedor, reintentar con el siguiente modelo si uno falla: DeepSeek (por defecto) → GPT-6 Luna → modelos gratuitos.
3. Reducir el tiempo de traducción: un proyecto de 34.700 caracteres tardaba unos 40 min.

## Diagnóstico de la lentitud
Medido con peticiones reales:
- Las secciones se traducían en serie y cada una intentaba primero Gemini, que tardaba 34 s en responder 429 por cuota agotada.
- **DeepSeek V4.1 Flash razona por defecto** aunque no se le envíe `reasoning_effort`. Con una sección de 6000 caracteres:

| Petición | Tiempo | Tokens de razonamiento | Coste |
| --- | --- | --- | --- |
| DeepSeek por defecto | 169 s | 9477 | 0,0046 $ |
| DeepSeek con `reasoning: { enabled: false }` | 34 s | 0 | 0,0008 $ |
| GPT-6 Luna sin razonamiento | 18 s | 0 | 0,0018 $ |

## Arquitectura y flujo
- **`data/ai-models.ts`**:
  - `isGeminiEnabled()` (`GEMINI_ENABLED=true` en `.env` para reactivarlo);
  - `getEnabledProviderCatalog()` / `getEnabledModels()`;
  - `resolveProvider()` (todo pasa a `openrouter` sin Gemini);
  - `modelFitsProvider()`;
  - `OPENROUTER_MODEL_CASCADE` (orden del catálogo: DeepSeek, GPT-6 Luna, gratuitos).
- **`services/ai.service.ts`**:
  - `generateAiContentWithFallback(..., options)`: orden de proveedores según el interruptor; descarta modelos de otro proveedor; `options.reasoning`.
  - `generateOpenRouterContent`: cascada de modelos; `buildOpenRouterPayload` envía `reasoning_effort: high` o `reasoning: { enabled: false }`, solo en modelos con soporte confirmado; devuelve `requestedModel`.
  - `generateGeminiContent`: omite `thinking_level` si `reasoning` es `false`.
- **`services/translation.service.ts`**: `translateMarkdown` traduce 3 secciones a la vez (`TRANSLATION_CONCURRENCY`), sin razonamiento, con respaldo "pegajoso" de proveedor y modelo y parada si una sección falla.
- **Controladores**: `ai.controller` devuelve solo lo habilitado; `project.controller` y `translation.controller` usan `resolveProvider`.
- **Frontend**: `ProjectsFacade.availableProviders` y cambio automático de proveedor; los selectores de generador y taller filtran por el catálogo.

## Archivos modificados
- Backend: `data/ai-models.ts`, `services/ai.service.ts`, `services/translation.service.ts`, `controllers/ai.controller.ts`, `controllers/project.controller.ts`, `controllers/translation.controller.ts`, `vitest.config.ts` (`GEMINI_ENABLED=true` en tests), `tests/ai.service.test.ts`, `tests/translation.test.ts`.
- Frontend: `projects.facade.ts` (+ spec), `generator-view.component.ts`, `taller-view.component.ts`, mocks en `generator-view`, `taller-view` y `app` specs.
- Documentación: `documentation/configuracion_esfuerzo_razonamiento_ia.md`, `documentation/traduccion_proyectos.md`, `README.md`.

## Decisiones técnicas
- **Interruptor por variable de entorno, leída en cada llamada**: se reactiva sin tocar código y los tests pueden cambiarlo.
- **Traducción sin razonamiento; generación con razonamiento alto**: la calidad de la generación sí depende del razonamiento; la de una traducción, no.
- **Concurrencia 3**: equilibrio entre velocidad y riesgo de límites de OpenRouter.
- **Impacto en la generación**: sin Gemini, la generación usa DeepSeek con razonamiento alto, que es más lenta que Gemini Flash.

## Verificación
- Traducción real del proyecto "Ciencias aplicadas I + Comunicación y sociedad I" (34.700 caracteres): **155 s**, frente a unos 40 min antes.
- Los módulos cargan con `tsx`; frontend con `ngc`, `tsc` de specs y ESLint sin errores.
- Pendiente (usuario): `cd backend && npm run test:cov`, `cd frontend && npm test`, y desplegar en el EC2 sin `GEMINI_ENABLED` en el `.env`.

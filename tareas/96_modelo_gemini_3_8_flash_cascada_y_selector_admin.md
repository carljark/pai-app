# Tarea 96: Soporte para Gemini 3.8 Flash, Cascada Automática de Modelos y Selector de Modelos para Administradores

## Propósito
1. **Actualización al último modelo de Google Gemini**: Verificar la disponibilidad real de los modelos de Google con la clave de API configurada (`GEMINI_API_KEY`) y actualizar el modelo predeterminado del motor primario a `gemini-3.8-flash` (última versión disponible y compatible en Google AI Studio).
2. **Cascada de tolerancia a fallos interna por modelo**: Implementar un mecanismo de degradación paulatina (fallback cascade) dentro del motor Gemini: si el modelo preferido agota su cuota (error HTTP 429) o sufre indisponibilidad temporal (HTTP 503 / 500), el servicio desciende automáticamente a versiones anteriores estables (`gemini-3.8-flash` → `gemini-3.7-flash` → `gemini-3.6-flash` → `gemini-2.5-flash`) antes de recurrir al motor secundario (OpenRouter).
3. **Aclaración y soporte de Claude y modelos externos**: Constatar técnicamente que la `GEMINI_API_KEY` se autentica contra el endpoint `generativelanguage.googleapis.com` (propiedad de Google AI Studio, donde no se alojan modelos de Anthropic Claude). Para dar soporte a Claude (Claude 3.5 Sonnet, Claude 3.7 Sonnet) y Llama, se integran en las opciones del motor Secundario (OpenRouter).
4. **Selector de Modelos para Administradores**: Habilitar en la interfaz de usuario, tanto en el Generador de Proyectos como en el Asistente IA del Taller, un selector dinámico de modelos situado al lado o debajo del selector de motor IA (Primario / Secundario), visible de manera exclusiva para usuarios con rol `admin`.

---

## Arquitectura y Flujo

```
               [ Usuario / Admin ]
                        │
                        ▼
      ┌───────────────────────────────────┐
      │  UI Frontend (Angular 20 Standalone)│
      │  - Generador (generator-view)     │
      │  - Taller Asistente (taller-view) │
      │  - Selector IA (Primario/Secundario)│
      │  - @if(admin) Selector de Modelo   │
      └─────────────────┬─────────────────┘
                        │ HTTP POST /api/projects/generate (aiProvider, aiModel)
                        │ HTTP POST /api/projects/:id/rewrite-section (aiProvider, aiModel)
                        ▼
      ┌───────────────────────────────────┐
      │ Backend (Node/Express/TypeScript) │
      │  - project.controller.ts          │
      │  - Project.ts (persiste aiModel)  │
      │  - queue.service.ts               │
      └─────────────────┬─────────────────┘
                        │
                        ▼
      ┌─────────────────────────────────────────────────────────────┐
      │ ai.service.ts: generateAiContentWithFallback(..., aiModel)  │
      └──────┬──────────────────────────────────────────────┬───────┘
             │                                              │
      [Motor Primario: Gemini]                     [Motor Secundario: OpenRouter]
             │                                              │
    Intento con preferredModel                     Intento con modelo OpenRouter
             │                                     (Free / Claude / Llama)
      ¿Fallo 429/503?                                       │
             │                                              │
             ▼                                              ▼
   Cascada Gemini:                                Retorno de contenido
   - gemini-3.8-flash                             o Error
   - gemini-3.7-flash
   - gemini-3.6-flash
   - gemini-2.5-flash
             │
             ▼
   Si todos fallan: Fallback a OpenRouter
```

---

## Archivos Modificados

### Backend
1. `backend/src/models/Project.ts`:
   - Se añadió el campo `aiModel?: string` al esquema de Mongoose `ProjectSchema` e interfaz `IProject` para registrar el modelo exacto solicitado o utilizado.
2. `backend/src/services/ai.service.ts`:
   - `DEFAULT_GEMINI_MODEL`: Actualizado de `'gemini-3.6-flash'` a `'gemini-3.8-flash'`.
   - `GEMINI_MODEL_CASCADE`: Definida la lista secuencial de modelos de respaldo (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-2.5-flash`).
   - `generateGeminiContent`: Implementada la cascada interna. Intenta primero el modelo preferido (si fue especificado) y recorre la cascada de modelos en caso de errores de cuota (`RESOURCE_EXHAUSTED`, `429`) o fallo temporal (`503`).
   - `executeProvider`, `tryProvider`, `generateAiContentWithFallback`: Adaptados para recibir y propagar `preferredModel`.
3. `backend/src/controllers/project.controller.ts`:
   - En `generateProject`: Extrae `aiModel` del cuerpo de la petición y lo almacena en el documento `Project`.
   - En `rewriteSection`: Extrae `aiModel` y lo transmite a `generateAiContentWithFallback`.
4. `backend/src/services/queue.service.ts`:
   - Pasa `project.aiModel` a `generateAiContentWithFallback` durante el procesamiento en segundo plano.
5. `backend/src/tests/ai.service.test.ts`:
   - Nuevos tests para el uso predeterminado de `gemini-3.8-flash`, cascada interna de modelos y timeouts.
6. `backend/src/tests/projects.test.ts`:
   - Tests de integración para `aiModel` en endpoints de generación y reescritura de secciones.
7. `backend/src/tests/queue.service.test.ts`:
   - Actualización de expectativas para `gemini-3.8-flash`.

### Frontend
1. `frontend/src/app/services/translations.es.ts` y `frontend/src/app/services/translations.ca.ts`:
   - Se incorporó la clave de traducción `generatorModelLabel` ("Modelo de IA" / "Model d'IA").
2. `frontend/src/app/features/projects/services/projects.facade.ts`:
   - Añadido el signal `selectedModel = signal<string>('gemini-3.8-flash')`.
   - Se inyecta `aiModel` en el payload de `generateProject` y como parámetro opcional en `rewriteSection(instruction, aiProvider?, aiModel?)`.
3. `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`:
   - Añadido `#generator-model-select` en el bloque `@if (auth.currentUser()?.role === 'admin')`.
   - Opciones dinámicas según el motor seleccionado (`gemini` muestra modelos Gemini, `openrouter` muestra Llama, Mistral y Claude).
   - Métodos `onAiChange` y `onModelChange` para sincronizar señales y reiniciar a modelos por defecto coherentes.
4. `frontend/src/app/features/taller/components/taller-view/taller-view.component.html` y `.ts`:
   - Añadido `#taller-model-select` para administradores en el panel del Asistente IA.
   - Envío de `selectedModel` al ejecutar `rewriteWithAI()`.
5. `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts`:
   - Actualizado el fallback de inferencia de modelo en logs a `'gemini-3.8-flash'` si el proveedor registrado es Gemini.
6. Pruebas Unitarias Frontend (`*.spec.ts`):
   - `generator-view.component.spec.ts`: Test de visualización del selector solo para admin y eventos de cambio.
   - `taller-view.component.spec.ts`: Cobertura del selector de taller, cambio de modelo y propagación a `rewriteSection`.
   - `projects.facade.spec.ts`: Cobertura de inclusión de `aiModel` en peticiones POST.
   - `admin-dashboard.component.spec.ts`: Actualización de expectativas del modelo predeterminado en logs.
   - `app.spec.ts`: Integración de `selectedModel` en mock de `ProjectsFacade`.

---

## Detalles Técnicos y Decisiones de Diseño

1. **Verificación de la API de Google Gemini**:
   - Se ejecutó una consulta en vivo a `https://generativelanguage.googleapis.com/v1beta/models?key=...`.
   - Modelos confirmados: `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-3.1-pro-preview`.
   - Se validó la generación directa de texto con `gemini-3.8-flash`, resultando satisfactoria y con latencias mínimas.
   - Los modelos de nivel Pro (`gemini-2.5-pro`, `gemini-3.1-pro-preview`) en claves con capa gratuita devuelven error de cuota `429 (Resource Exhausted)`, lo que reafirmó la necesidad de implementar una cascada hacia modelos Flash.

2. **Modelos Claude y OpenRouter**:
   - Las claves de Google AI Studio (`GEMINI_API_KEY`) no son interoperables con la API de Anthropic. Google AI Studio rechaza cualquier llamada dirigida a modelos como `claude-3-5-sonnet` con error 404.
   - Por consiguiente, los modelos de Claude (`anthropic/claude-3.5-sonnet`, `anthropic/claude-3.7-sonnet`) se han dispuesto bajo el selector del motor Secundario (OpenRouter), donde la infraestructura del proyecto ya gestiona las llamadas vía API OpenRouter.

3. **Mapeo y Resiliencia en Cascada**:
   - Si un administrador selecciona expresamente un modelo (por ejemplo `gemini-3.1-pro-preview`) y este falla por límite de cuota o rate limit, el sistema no interrumpe abruptamente la generación: desciende ordenadamente por la cascada (`gemini-3.8-flash` → `gemini-3.7-flash` → ...), garantizando la entrega del proyecto docente al usuario final sin fricciones.

4. **Resultados de Cobertura y Calidad**:
   - Backend: 15 suites de pruebas, 116 tests pasando con éxito (100%).
   - Frontend: 31 suites de pruebas, 367 tests pasando con éxito (100%).
   - Cobertura global de código: > 95% en todas las métricas (Stmts: 99.19%, Branch: 95.74%, Funcs: 97.80%, Lines: 99.70%), superando holgadamente el umbral estricto del 90%.
   - Verificación ejecutada exitosamente mediante el hook `./.git/hooks/pre-push`.

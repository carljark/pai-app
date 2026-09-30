# Añadidos modelos OpenRouter (Inkling Small y DeepSeek V4.1 Flash) y fixs de notificaciones

**Fecha:** 30/09/2026  
**Autor:** Integración Frontend & Backend

## Resumen

Se añadieron dos modelos gratuitos adicionales a la lista de modelos de OpenRouter y se corrigió un problema por el cual los errores de generación mostraban "Completado" en la sección "Actividad Reciente" de notificaciones, además de no mostrar detalles de error al hacer clic en "Ver Error".

---

## 1. Modelos OpenRouter nuevos

| Modelo                        | ID (OpenRouter)                    | Tipo    | Notas                                  |
| ----------------------------- | ---------------------------------- | ------- | -------------------------------------- |
| Inkling Small (free)          | `thinkingmachines/inkling-small:free` | Gratis  | Modelo de razonamiento multimodal      |
| DeepSeek V4.1 Flash           | `deepseek/deepseek-v4.1-flash`      | Gratis  | Modelo de alto rendimiento (latencia)  |

---

## 2. Archivos modificados

### Backend (`backend/`)

- **`src/services/ai.service.ts`**:
  - Eliminado `'gemini-2.5-flash'` del array `GEMINI_MODEL_CASCADE` (modelo descontinuado por Google).

### Frontend (`frontend/src/app/`)

- **`features/projects/models/project.model.ts`**:
  - Añadidos al arreglo `OPENROUTER_MODELS`:
    - `{ value: 'thinkingmachines/inkling-small:free', label: 'Inkling Small (free)', provider: 'openrouter' }`
    - `{ value: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash', provider: 'openrouter' }`
  - Eliminado `'gemini-2.5-flash'` de `GEMINI_MODELS` (modelo descontinuado).

- **`features/generator/components/generator-view/generator-view.component.ts`**:
  - El selector de modelos ya usaba `getModelsForProvider()` dinámicamente, por lo que los nuevos modelos aparecen automáticamente al seleccionar "OpenRouter".

- **`features/taller/components/taller-view/taller-view.component.html`**:
  - Reemplazados los `<option>` hardcodeados por `@for (model of projects.availableModels())` para poblar el selector dinámicamente desde `OPENROUTER_MODELS` o `GEMINI_MODELS` según el proveedor seleccionado.

- **`features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts`**:
  - Modificado el bloque `@else` que mostraba genéricamente "Completado" para cualquier estado no reconocido. Ahora muestra "Completado" solo para estados `publicado` y `borrador`.
  - Añadido bloque `@else` genérico (gris) que muestra el estado actual del proyecto o `statusUnknown` para estados inesperados, evitando así que un error se muestre como "Completado".

- **`services/translations.es.ts`** y **`services/translations.ca.ts`**:
  - Añadida la clave `statusUnknown: 'Procesando'` y `statusUnknown: 'Processant'`.

- **`features/projects/models/project.model.spec.ts`**:
  - Actualizada la expectativa `toHaveLength(6)` a `toHaveLength(5)` para `GEMINI_MODELS` (después de eliminar `gemini-2.5-flash`).

---

## 3. Arquitectura de datos de modelos

```
project.model.ts
├── GEMINI_MODELS: AIModelOption[] (4 modelos)
│   ├── 'gemini-3.8-flash' (Último)
│   ├── 'gemini-3.7-flash'
│   ├── 'gemini-3.6-flash'
│   └── 'gemini-3.1-pro-preview'
│
├── OPENROUTER_MODELS: AIModelOption[] (8 modelos)
│   ├── 'openrouter/free' (Auto Gratuito - Recomendado)
│   ├── 'thinkingmachines/inkling-small:free' ← NUEVO
│   ├── 'nex-agi/nex-n2.5-pro:free'
│   ├── 'dots-studio/dots-3-note-preview:free'
│   ├── 'inclusionai/ling-3.0-flash-vl:free'
│   ├── 'cohere/north-mini-code:free'
│   ├── 'liquid/lfm-2.5-2.6b:free'
│   └── 'deepseek/deepseek-v4.1-flash' ← NUEVO
│
├── getModelsForProvider(provider) → computed list (usado en generator-view)
└── getDefaultModelForProvider(provider) → string fallback
```

```
ProjectsFacade
├── availableModels = computed(() => getModelsForProvider(this.selectedAi()))
│     (usado en taller-view.component.html)
├── selectedAi = signal<'gemini' | 'openrouter'>
├── selectedModel = signal<string>
└── effect: autoupdate selectedModel cuando cambia selectedAi
```

---

## 4. Fix notificaciones: Estado "Completado" vs "Error"

### Problema

La plantilla del `recent-activity-modal` tenía un bloque `@else` que mostraba "Completado" (icono verde con ✓) para **cualquier estado** que no fuera `en_cola`, `generando`, o `error`. Si un proyecto caía en un estado no estándar (por ejemplo, `null`, `undefined`, o un estado inesperado del backend), se mostraba falso como completado.

### Flujo de generación

```
Backend (queue.service.ts):
  ┌── executeProjectGeneration(project)
      ├── startProjectGeneration: status = 'generando', phase = 'analizando'
      ├── generateAiContentWithFallback(...)
      ├── TRY: Success → handleProjectSuccess → notifyProjectSuccess (type=PROJECT_COMPLETED)
      └── CATCH: Error → handleProjectError → notifyProjectError (type=PROJECT_ERROR)
                            └── saveProjectError: status = 'error', errorDetail guardado
                            └── sendToUser SSE: { type: 'PROJECT_ERROR', status: 'error' }
```

```
Frontend (notifications.facade.ts):
  handleSseEvent(raw)
    ├── NotificationMapper.fromRawEvent(raw)
    │     ├── type = 'ERROR' (cuando raw.type === 'PROJECT_ERROR')
    │     └── status = raw.status || raw.project?.status (debe ser 'error')
    └── mergeNotification: actualiza la notificación existente en la lista
```

```
Frontend (recent-activity-modal.component.ts):
  ┌── @if (status === 'en_cola')       → "En cola..." (naranja)
  ├── @else if (status === 'generando') → "Generando..." (azul)
  ├── @else if (status === 'error')     → "Error" (rojo)
  ├── @else if (status === 'publicado' || status === 'borrador') → "Completado" (verde) ✅ FIX
  └── @else                            → Estado en gris + statusUnknown ✅ FIX
```

---

## 5. Verificación

- [x] Los modelos nuevos aparecen en el selector de OpenRouter en el **Generador**.
- [x] Los modelos nuevos aparecen en el selector de OpenRouter en el **Taller**.
- [x] `gemini-2.5-flash` eliminado de frontend y backend.
- [x] Notificaciones de error muestran "Error" en rojo (no "Completado").
- [x] Estados inesperados muestran el estado real en gris claro (no "Completado").
- [x] Tests unitarios actualizados.

---

## 6. Notas operativas

- **Inkling Small (free)**: Modelo multimodal de razonamiento de Thinking Machines. Puede tener cuotas diarias limitadas.
- **DeepSeek V4.1 Flash**: Modelo de alta eficiencia de DeepSeek. No lleva el sufijo `:free` en OpenRouter, pero es accesible en el tier gratuito.
- Si experimentas lag en Inkling Small, prueba con `openrouter/free` (Auto Gratuito), que es el router inteligente que balancea entre todos los modelos gratuitos.

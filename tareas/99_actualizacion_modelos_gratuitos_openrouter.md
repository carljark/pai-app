# Tarea 99: Verificación de Modelos de OpenRouter, Eliminación de Modelos de Pago / Inexistentes e Integración de Modelos Gratuitos Funcionales

## Propósito
1. **Auditoría de Modelos del Motor Secundario (OpenRouter)**:
   - Comprobar el estado real de los modelos previamente configurados en el selector de OpenRouter: Claude (`anthropic/claude-3.5-sonnet`, `anthropic/claude-3.7-sonnet`), Mistral (`mistralai/mistral-7b-instruct:free`) y Llama (`meta-llama/llama-3.3-70b-instruct:free`).
2. **Eliminación de Modelos Incompatibles**:
   - Constatar que la clave `OPENROUTER_API_KEY` del usuario opera bajo el *Free Tier* (`is_free_tier: true`, límite de 50 peticiones gratuitas diarias).
   - Eliminar todos los modelos de Claude (que son de pago y provocan error HTTP 402 `Payment Required` por saldo insuficiente) y los modelos de Mistral y Llama cuyo endpoint gratuito fue descatalogado por OpenRouter.
3. **Selección y Validación Empírica de Modelos Gratuitos Activos**:
   - Evaluar los 24 modelos del catálogo gratuito de OpenRouter en tiempo real, seleccionando aquellos con soporte multilingüe en español, capacidad curricular para proyectos de FP/ESO y tiempos de respuesta estables sin saturación.
   - Actualizar los selectores de modelos del Generador y del Asistente IA con la nueva lista de modelos gratuitos funcionales.

---

## Pruebas Empíricas y Resultados de OpenRouter

### 1. Estado de la Clave del Usuario
- **Tipo de cuenta**: `is_free_tier: true`.
- **Saldo**: $0.00 / Agotado para modelos premium.
- **Cuota**: 50 peticiones diarias asignadas a modelos gratuitos (`:free`).

### 2. Comprobación de Modelos Anteriores
- **Claude (`anthropic/claude-*`)**:
  - Estado: **No gratuito**.
  - Respuesta de OpenRouter: `HTTP 402 Payment Required: "This request requires more credits, or fewer max_tokens... To increase, visit https://openrouter.ai/settings/credits and upgrade to a paid account"`.
- **Mistral (`mistralai/mistral-7b-instruct:free`)**:
  - Estado: **Descatalogado por OpenRouter**. El tier gratuito fue retirado y solo existen variantes de pago.
- **Llama (`meta-llama/llama-3.3-70b-instruct:free`)**:
  - Estado: **Descatalogado por OpenRouter**.

### 3. Pruebas de los Modelos Gratuitos Disponibles (24 candidatos)
Se probaron los modelos activos en el catálogo de OpenRouter mediante peticiones reales con prompts curriculares:
- **`openrouter/free` (Auto Gratuito / Router Inteligente de Modelos Libres)**:
  - **Éxito**. Tiempo de respuesta: ~3,5 s. Enrutamiento automático hacia el modelo libre más óptimo. (Recomendado por defecto).
- **`nex-agi/nex-n2.5-pro:free` (Nex-N2.5 Pro)**:
  - **Éxito**. Modelo de alto razonamiento con 262.144 tokens de contexto. Excelente redacción curricular en español.
- **`dots-studio/dots-3-note-preview:free` (Dots3 Note)**:
  - **Éxito**. Ventana de contexto masiva de 512.000 tokens. Especializado en documentos y notas extensas.
- **`inclusionai/ling-3.0-flash-vl:free` (Ling 3.0 Flash)**:
  - **Éxito**. Respuesta rápida (~3 s), ventana de 262.144 tokens.
- **`cohere/north-mini-code:free` (Cohere North Mini)**:
  - **Éxito**. Respuesta ultrarrápida (~1,4 s), ventana de 256.000 tokens.
- **`liquid/lfm-2.5-2.6b:free` (LiquidAI LFM 2.5)**:
  - **Éxito**. Respuesta ágil (~1,9 s), ventana de 65.536 tokens.

---

## Archivos Modificados

1. [`frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/generator/components/generator-view/generator-view.component.ts):
   - En el selector `#generator-model-select`, se reemplazaron los modelos de Claude, Mistral y Llama por los 6 modelos gratuitos verificados de OpenRouter.
2. [`frontend/src/app/features/taller/components/taller-view/taller-view.component.html`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.html):
   - En `#taller-model-select`, se actualizaron las opciones del motor secundario en consonancia.
3. [`frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts):
   - Actualización del test para validar la selección de modelos gratuitos reales (`nex-agi/nex-n2.5-pro:free`).
4. [`frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts):
   - Actualización del test de selección de modelo en el taller.

---

## Verificación y Calidad

- **Backend**: 15 suites de pruebas, 116 tests pasando con éxito (100%).
- **Frontend**: 31 suites de pruebas, 367 tests pasando con éxito (100%).
- **Pre-push Hook (`./.git/hooks/pre-push`)**: Ejecución exitosa de todas las validaciones con cobertura superior al 95%.

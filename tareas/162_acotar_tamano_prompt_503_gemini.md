# Tarea 162: Acotar el tamaño del prompt para reducir 503 de Gemini

## Contexto

Además de la saturación de capacidad (`503 UNAVAILABLE`), un prompt extremadamente largo o pesado puede hacer que el proveedor rechace la petición con 503. En producción se observó que el `aiInstruction` guardado de un proyecto FP Básica pesaba **~76.000 caracteres**, por la inyección de ejemplos INTEF, proyectos aprobados y documentos de coincidencias.

## Cambios

### `backend/src/services/ai.service.ts`
- `MAX_INTEF_EXAMPLES`: 20 → **8**.
- Nuevo `MAX_INTEF_EXAMPLE_CHARS = 1200`.
- `buildContexts` recorta `originalContent` de cada ejemplo y envía solo los campos relevantes (título, módulos, RAs, metodología y contenido recortado), en vez del objeto completo.

### `backend/src/controllers/project.controller.ts`
- Nuevos límites:
  - `MAX_COINCIDENCIA_INSTRUCTIONS_CHARS = 6000` (instrucciones generales de coincidencias).
  - `MAX_FPB_MATCH_CHARS = 4000` por documento de coincidencia.
  - `MAX_FPB_MATCHES = 2` documentos de coincidencia máximo (`.limit(...)`).
  - `MAX_APPROVED_PROJECTS = 2` proyectos publicados de referencia máximo.
- Se recorta el `rawText` de cada coincidencia y de las instrucciones generales.
- Log de diagnóstico: `[Prompt] tipoNivel=... userPrompt=... chars, instruction=... chars` para monitorizar el tamaño en producción.

### Tests
- `backend/src/tests/ai.test.ts`: nuevo test que verifica el recorte de `originalContent` a `MAX_INTEF_EXAMPLE_CHARS`.
- Los tests existentes siguen válidos (usan `MAX_INTEF_EXAMPLES` como constante y textos cortos en FpbMatch).

## Efecto esperado

Reducción estimada del `aiInstruction` de ~76 KB a ~45 KB o menos, y acotado en producción por los límites de coincidencias. El objetivo es no enviar prompts desproporcionados que el modelo pueda rechazar.

## Persistencia en base de datos

Para no depender de los logs del contenedor, el tamaño se guarda en MongoDB y se muestra en el Registro de Actividad del panel admin:

- `backend/src/models/Project.ts`: nuevos campos `aiPromptChars` y `aiInstructionChars`.
- `backend/src/controllers/project.controller.ts`: se rellenan al crear el proyecto (`userPrompt.length`, `baseInstruction.length`).
- `backend/src/services/queue.service.ts`: el `ActivityLog` de `GENERATE_PROJECT` incluye `promptChars` e `instructionChars`.
- `backend/src/controllers/admin.controller.ts`: `getLogs` puebla `aiPromptChars aiInstructionChars` del proyecto (fallback para logs antiguos).
- `frontend/.../admin-dashboard`: nueva fila `📏 Tamaño del prompt: prompt X car. · instrucción Y car.` y helper `getLogPromptSize`.

## Verificación

El backend (`tsx watch`) reinicia sin errores. No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio).

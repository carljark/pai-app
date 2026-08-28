# Tarea 36: Ingesta de plantillas de coincidencias FPB y enriquecimiento del prompt de la IA

## Propósito
El usuario ha solicitado integrar el contenido de los documentos de coincidencias de FP Básica (`Plantillas coincidencias FPB`) en el flujo de la aplicación.
Las metas logradas son:
1. Ingestar y almacenar de forma estructurada en la base de datos (MongoDB) todas las coincidencias y orientaciones pedagógicas de los 14 archivos `.docx` provistos.
2. Inyectar dinámicamente estas orientaciones y actividades de referencia en el prompt del sistema (`baseInstruction`) a la hora de generar un proyecto de FP Básica en función de las asignaturas seleccionadas.
3. Dejar el sistema preparado para que, en futuras tareas, se pueda consultar esta base de datos para mostrar las coincidencias directamente en la interfaz de usuario.
4. Mantener la suite de pruebas del backend en verde con cobertura global superior al 90%.

## Arquitectura/Flujo
1. **Modelado de Datos (`FpbMatch`)**:
   - Se ha creado el esquema de Mongoose en [FpbMatch.ts](file:///Users/csgj/dev/pai-app/backend/src/models/FpbMatch.ts) con propiedades para `fileName`, `title`, `code` (código del módulo, p. ej. 3060), `rawText` (texto extraído), y `type` (coincidencia, actividad ampliada, relación de criterios, o instrucciones generales del prompt).
2. **Ingesta Automática de Datos (Migración)**:
   - Se ha implementado el script de migración secuencial [03_ingest_fpb_matches.ts](file:///Users/csgj/dev/pai-app/backend/migrations/03_ingest_fpb_matches.ts).
   - Este script utiliza `mammoth` para extraer el texto de los 14 archivos `.docx` de `Plantillas coincidencias FPB/` y guardarlos en MongoDB.
3. **Enriquecimiento del Prompt en Caliente (`project.controller`)**:
   - En [project.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/project.controller.ts), si el tipo de nivel seleccionado es `FP_BASICA`:
     - Se parsean los códigos numéricos asociados a los Resultados de Aprendizaje (RAs) seleccionados por el usuario (extrayendo el prefijo de su identificador, p. ej. `3060` de `3060_RA1`).
     - Se realiza una búsqueda en MongoDB para recuperar las orientaciones de los módulos implicados y las instrucciones generales.
     - Ambos bloques de texto se inyectan en `baseInstruction` (System Instruction de Gemini).
4. **Corrección de Cobertura en Vitest**:
   - Tras añadir la consulta a `FpbMatch`, la cobertura global de ramas (Branches) del backend descendió brevemente a 87.15% (por debajo del límite del 90%).
   - Se implementaron pruebas específicas en [projects.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/projects.test.ts) que simulan la generación de proyectos bajo el nivel `FP_BASICA` y pueblan la base de datos en memoria con documentos `FpbMatch` de prueba, cubriendo todos los caminos condicionales nuevos.
   - Adicionalmente, se corrigieron desalineaciones de cobertura en `auth.controller.ts` y `curriculum.controller.ts` forzando retornos explícitos (`return res.json()`), y se añadieron casos de prueba a [sse.service.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/sse.service.test.ts) para cubrir escenarios multi-cliente.
   - Con estas mejoras, la cobertura global de ramas subió al **90.82%**, restableciendo el estado verde y exitoso del backend.

## Archivos Modificados/Creados
- `backend/src/models/FpbMatch.ts` (creado)
- `backend/migrations/03_ingest_fpb_matches.ts` (creado)
- `backend/src/controllers/project.controller.ts` (modificado)
- `backend/src/controllers/auth.controller.ts` (modificado)
- `backend/src/controllers/curriculum.controller.ts` (modificado)
- `backend/src/tests/projects.test.ts` (modificado)
- `backend/src/tests/sse.service.test.ts` (modificado)

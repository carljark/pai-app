# Tarea 36: Ingesta de plantillas de coincidencias FPB y enriquecimiento del prompt de la IA

## Propósito
El usuario ha solicitado integrar el contenido de los documentos de coincidencias de FP Básica (`Plantillas coincidencias FPB`) en el flujo de la aplicación.
Las metas logradas son:
1. Ingestar y almacenar de forma estructurada en la base de datos (MongoDB) todas las coincidencias y orientaciones pedagógicas de los 14 archivos `.docx` provistos.
2. Inyectar dinámicamente estas orientaciones y actividades de referencia en el prompt del sistema (`baseInstruction`) a la hora de generar un proyecto de FP Básica en función de las asignaturas seleccionadas.
3. Dejar el sistema preparado para que, en futuras tareas, se pueda consultar esta base de datos para mostrar las coincidencias directamente en la interfaz de usuario.

## Arquitectura/Flujo
1. **Modelado de Datos (`FpbMatch`)**:
   - Se ha creado el esquema de Mongoose en [FpbMatch.ts](file:///Users/csgj/dev/pai-app/backend/src/models/FpbMatch.ts) con propiedades para `fileName`, `title`, `code` (código del módulo, p. ej. 3060), `rawText` (texto extraído), y `type` (coincidencia, actividad ampliada, relación de criterios, o instrucciones generales del prompt).
2. **Ingesta Automática de Datos (Migración)**:
   - Se ha implementado el script de migración secuencial [03_ingest_fpb_matches.ts](file:///Users/csgj/dev/pai-app/backend/migrations/03_ingest_fpb_matches.ts).
   - Este script utiliza `mammoth` para extraer recursivamente el texto plano de cada uno de los 14 archivos de Microsoft Word de la carpeta `Plantillas coincidencias FPB/`, los clasifica según su contenido/nombre y los persiste en MongoDB.
3. **Enriquecimiento del Prompt en Caliente (`project.controller`)**:
   - En [project.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/project.controller.ts), si el tipo de nivel seleccionado es `FP_BASICA`:
     - Se parsean los códigos numéricos asociados a los Resultados de Aprendizaje (RAs) seleccionados por el usuario (extrayendo el prefijo de su identificador, p. ej. `3060` de `3060_RA1`).
     - Se realiza una búsqueda en MongoDB para recuperar las orientaciones, relaciones de criterios y actividades ampliadas de los módulos implicados.
     - Se carga la guía general de prompt del sistema (`Prompt Coincidencias.docx`).
     - Ambos bloques de texto se inyectan en `baseInstruction` (System Instruction de Gemini). De este modo, la IA recibe de forma obligatoria los intereses de los jóvenes de 15 años, adaptaciones curriculares específicas, actividades modelo y coincidencias reales para estructurar el proyecto de forma rigurosa y real al sector.

## Archivos Modificados/Creados
- `backend/src/models/FpbMatch.ts` (creado)
- `backend/migrations/03_ingest_fpb_matches.ts` (creado)
- `backend/src/controllers/project.controller.ts` (modificado)

## Detalles Técnicos
- La migración procesó exitosamente los 14 archivos e insertó/actualizó todos sus registros en MongoDB sin problemas de desbordamiento de búfer.
- Se ha validado la ejecución exitosa de la suite completa de tests de integración del backend (`npm run test`), manteniendo todos los controladores y la lógica de colas en verde.
- Para las coincidencias generales del prompt, se asigna `code: null` y se clasifica bajo `type: 'prompt_coincidencias'`.

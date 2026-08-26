# 16. Extracción de Criterios de Evaluación y Envío a la IA

**Propósito:** 
El usuario reportó que la IA estaba "alucinando" (inventando) la numeración y letras de los criterios de evaluación (CEs) en las rúbricas y actividades. Al analizar la base de datos se descubrió que el modelo `RA` solo almacenaba la descripción del resultado de aprendizaje, pero no sus criterios de evaluación. Por ende, la IA no tenía forma de adivinar la numeración oficial si no la llevaba explícita en su conocimiento base.

**Arquitectura/Flujo:**
1. Se ha modificado el esquema de Mongoose del modelo `RA` (`RA.ts`) para incluir dos arrays: `criterios_es` y `criterios_ca`.
2. Se ha creado una migración `002_add_criterios_to_ras.ts` que lee el archivo de texto extraído del Anexo VIII oficial (que se ha movido al contenedor de backend en `backend/migrations/data/anexo8.txt`), lo procesa y extrae todos los criterios `a), b), c)...` correspondientes a cada Resultado de Aprendizaje. También mapea explícitamente los criterios del *Proyecto intermodular de aprendizaje colaborativo*.
3. En la llamada a Gemini dentro de `project.controller.ts`, antes de lanzar el `prompt`, ahora se hace una intercepción: se buscan los RAs seleccionados por el usuario en la base de datos, se extraen sus `criterios_es` y se inyectan dinámicamente en el propio prompt bajo la etiqueta `CRITERIOS DE EVALUACIÓN OFICIALES (Utiliza EXACTAMENTE estas letras/números):`.

**Archivos Modificados:**
- `backend/src/models/RA.ts`: Añadidos los campos `criterios_es` y `criterios_ca`.
- `backend/migrations/002_add_criterios_to_ras.ts` (Nuevo): Script para alimentar la base de datos con los criterios extraídos del DOCX.
- `backend/src/controllers/project.controller.ts`: Lógica de inyección de los criterios en el `userPrompt`.
- `backend/migrations/data/anexo8.txt` (Nuevo): Archivo plano con el currículo parseado, incluido para que Docker lo pueda leer en Producción.

**Detalles Técnicos:**
El motor de inyección de Gemini es ahora dinámico. En vez de depender del entrenamiento previo del modelo LLM (el cual falla al ser un currículo autonómico/nacional muy específico), ahora funciona con **RAG** (Retrieval-Augmented Generation) básico: recupera el contexto de la base de datos y se lo fuerza en el prompt de sistema.

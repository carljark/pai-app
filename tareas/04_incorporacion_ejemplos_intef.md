# Diseño Técnico: Incorporación de Ejemplos SCORM del INTEF al Prompt

## 1. Propósito de la Tarea
- **Enriquecimiento del Motor Pedagógico:** Aprovechar el repositorio de proyectos modelo del INTEF (formato SCORM 1.2) para nutrir de ideas reales, estructuradas y probadas al modelo de lenguaje (Gemini) en el momento de generar un nuevo proyecto.
- **Dinamismo en la Generación:** En lugar de inyectar los 26 proyectos simultáneamente (lo que saturaría el contexto del LLM y aumentaría drásticamente los costes y la latencia), se elige una inyección dinámica (RAG aleatorio).

## 2. Arquitectura y Flujo de Datos

### 2.1. Ingesta de Datos (`ingest_intef.py`)
Se ha desarrollado un script en Python (`backend/scripts/ingest_intef.py`) que automatiza la extracción de conocimiento desde los archivos ZIP en bruto:
- Recorre la carpeta `Ejemplos proyectos FP y ESO`.
- Abre cada archivo `.zip` y localiza el archivo `contentv3.xml` (típico de los proyectos de eXeLearning usados por INTEF).
- Parsea el XML y mediante expresiones regulares extrae el título, la descripción y todo el texto disponible del proyecto (limitado a los primeros 1500 caracteres por proyecto para mantener la eficiencia).
- Limpia las etiquetas HTML incrustadas.
- Consolida todos los proyectos extraídos (24 proyectos viables encontrados) en un único archivo JSON unificado: `backend/src/data/intef_examples.json`.

### 2.2. Inyección Dinámica en el Prompt (`server.ts`)
En el endpoint generador (`POST /api/projects/generate`):
- Durante la construcción del prompt (variable `baseInstruction`), el servidor lee el archivo `intef_examples.json`.
- Para asegurar variedad en la inspiración, el array de proyectos se reordena aleatoriamente.
- Se seleccionan 2 proyectos distintos en cada invocación.
- Se concatenan sus títulos, descripciones y extractos de texto, inyectándolos bajo el encabezado `"EJEMPLOS INSPIRADORES DE PROYECTOS REALES (INTEF)"`.

## 3. Archivos Modificados / Creados
- `backend/scripts/ingest_intef.py` *(Nuevo)*: Script Python encargado de la extracción.
- `backend/src/data/intef_examples.json` *(Nuevo)*: Base de datos estática resultante con la información de los proyectos.
- `backend/src/server.ts`: Modificación en la ruta generativa para inyectar este conocimiento al vuelo.

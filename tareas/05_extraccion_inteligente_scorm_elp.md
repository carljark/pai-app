# Diseño Técnico: Extractor Inteligente de Proyectos (SCORM y ELP)

## 1. Propósito de la Tarea
- **Mejora Cualitativa de Datos:** Reemplazar la extracción "ciega" y superficial de los primeros 1500 caracteres de los SCORM por un motor de Ingesta Inteligente impulsado por IA.
- **Soporte Nativo para eXeLearning (.elp):** Ampliar la compatibilidad para extraer conocimiento de los archivos `.elp` (que técnicamente son archivos ZIP) sin requerir transformaciones previas.
- **Enriquecimiento del Prompt:** Al destilar exclusivamente el componente creativo de cada proyecto (actividades, productos finales y dinámicas), se garantiza que la IA de generación de la plataforma reciba estímulos metodológicos de altísimo valor.

## 2. Arquitectura y Flujo de Datos

### 2.1. El "Super Extractor" Node.js (`super_ingest.ts`)
Se ha migrado el antiguo script de Python a un robusto script de Node.js (`backend/scripts/super_ingest.ts`) aprovechando el SDK oficial de Gemini (`@google/genai`):
- **Lectura Profunda:** Empleando `adm-zip`, el script recorre recursivamente las carpetas, abriendo tanto `.zip` como `.elp` y localizando el archivo vital `contentv3.xml` (o `content.xml`).
- **Limpieza de Tags HTML (XML Decoding):** Como eXeLearning codifica el texto en formato CDATA o dentro de atributos `value=" "`, el script emplea expresiones regulares avanzadas para rescatar el texto íntegro, limpiando el ruido de HTML y limitando la cadena de texto a 60,000 caracteres para asegurar la estabilidad del modelo.
- **Procesamiento de IA (Map-Reduce Metodológico):** Cada texto en bruto se envía al modelo `gemini-3.6-flash`. A través de un prompt estricto, la IA actúa como un "evaluador instruccional", extrayendo exclusivamente el título, una descripción corta, y redactando una sinopsis hiperconcentrada (300-600 caracteres) destacando *solo* las actividades más creativas y el rol activo del alumno.
- **Actualización del JSON:** El resultado se guarda en el ya conocido `backend/src/data/intef_examples.json`. Como se devuelven resultados en JSON estricto, es 100% compatible con el motor RAG de la API de generación que desarrollamos en la tarea anterior.

## 3. Archivos Modificados / Creados
- `backend/package.json`: Se instaló la librería `adm-zip` y sus tipos.
- `backend/scripts/super_ingest.ts` *(Nuevo)*: Script maestro del proceso de extracción inteligente por IA.
- `backend/src/data/intef_examples.json`: Base de datos de conocimiento enriquecido actualizada por la IA.

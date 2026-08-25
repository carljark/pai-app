# Diseño Técnico: Inyección de Contexto Global (All-In)

## 1. Propósito de la Tarea
- **Maximización del Contexto Creativo:** Atendiendo a la solicitud explícita, se han eliminado las barreras artificiales de límite de proyectos (antes fijado en 2 ejemplos aleatorios). Ahora se persigue que el LLM disponga de un "pantallazo total" del conocimiento institucional.
- **Aprendizaje Continuo:** Se ha introducido un mecanismo dinámico mediante el cual el modelo no solo se inspira en el corpus del INTEF, sino también en el histórico local de proyectos generados en la propia plataforma que han sido marcados con el estado `aprobado`.

## 2. Arquitectura y Flujo de Datos

### 2.1. Carga Masiva de Ejemplos INTEF
En el endpoint `POST /api/projects/generate`, se ha modificado la lógica de carga de `intef_examples.json`.
- En lugar de mezclar y truncar el arreglo (`slice(0, 2)`), se itera sobre la totalidad del corpus extraído y resumido por la inteligencia artificial.
- Dado que el modelo empleado (`gemini-3.6-flash`) posee un contexto ultralargo (capacidad masiva de tokens), es perfectamente capaz de asimilar decenas de descripciones de proyectos simultáneamente sin comprometer su eficacia.

### 2.2. Query al Histórico de Proyectos Aprobados
Se ha añadido una nueva sección de inyección semántica (`approvedProjectsContext`):
- Antes de invocar a Gemini, el backend realiza una consulta asíncrona a MongoDB: `Project.find({ status: 'aprobado' })`.
- El contenido en crudo (`rawText`) de todos y cada uno de estos proyectos aprobados se concatena bajo el epígrafe: `"PROYECTOS APROBADOS DE LA PLATAFORMA (Usa esto para entender el tono y el éxito pasado)"`.
- Esto garantiza que el motor pedagógico no solo genere ideas creativas, sino que se auto-alinee progresivamente con el estilo, tono y expectativas específicas del centro educativo a medida que los administradores aprueban material.

## 3. Consideraciones de Latencia
- Dado que se está volcando un contexto de miles (o decenas de miles) de palabras por petición, el tiempo de inferencia del LLM (Time to First Token) aumentará naturalmente (tal y como se advirtió y consintió).
- La calidad instruccional compensará con creces el incremento de latencia.

## 4. Archivos Modificados
- `backend/src/server.ts`: Endpoint `/api/projects/generate` actualizado para volcar la integridad de ambos corpus en la instrucción del sistema (`baseInstruction`).

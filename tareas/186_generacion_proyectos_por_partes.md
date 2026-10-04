# Tarea 186: Generación de proyectos por partes

## Propósito
Evitar que la respuesta de la IA se corte al generar un proyecto largo y reducir el tiempo de generación. El proyecto ya no se pide en una sola llamada: primero se pide un esqueleto común y después cada parte, en llamadas paralelas.

## Situación de partida
- Los proyectos generados ocupaban entre 35.000 y 83.000 caracteres.
- Tardaban entre 30 y 320 s.
- En varios faltaban apartados obligatorios del prompt, como la rúbrica por módulo o los anexos.
- El backend no detectaba si la respuesta se había cortado por el límite de salida del modelo.

## Arquitectura
- **`backend/src/services/project-outline.ts`:**
  - `buildOutlinePrompt`: petición del esqueleto en JSON (título, producto final, fases con sesiones, RA/CE y actividades numeradas, y anexos con su actividad).
  - `parseOutline`: validación tolerante. Admite texto o bloques de código alrededor del JSON, numera por posición si faltan números, descarta elementos sin título y limita a 8 fases y 24 anexos.
  - `renderOutline`: esqueleto en texto plano para incluirlo en el prompt de cada parte.
- **`backend/src/services/sectioned-generation.service.ts`:**
  - `buildProjectParts`: partes en orden:
    - inicio;
    - una por fase;
    - evaluación (rúbrica global y una por módulo);
    - cierre (Carpeta de Aprendizaje en FPB, DUA, recursos);
    - anexos de 4 en 4.
  - Los encabezados que agrupan fases y anexos se insertan en el idioma del proyecto.
  - `buildPartPrompt`: prompt completo, esqueleto y orden de escribir solo esa parte.
  - `mapWithConcurrency`: ejecuta las partes de 4 en 4 y conserva el orden. Tras un fallo no lanza más.
  - `generateProjectBySections`:
    - esqueleto con razonamiento y aviso de fase;
    - partes sin razonamiento;
    - respaldo «pegajoso» de proveedor y modelo;
    - unión del documento;
    - `cascadeLog` con cada línea etiquetada por parte y su duración;
    - si el esqueleto no es válido, generación en una sola llamada.
- **`backend/src/services/queue.service.ts`:** `generateProjectContent` usa la generación por partes, con el idioma y el modelo del proyecto, salvo que `SECTIONED_GENERATION=false`.

## Decisiones técnicas
- **Esqueleto en JSON y partes en Markdown.** El JSON permite repartir el trabajo y fijar títulos y numeración. Si no se puede interpretar, se mantiene el comportamiento anterior en lugar de fallar.
- **Razonamiento solo en el esqueleto.** El diseño pedagógico se decide ahí. Las partes redactan sobre él, y razonar en cada una multiplicaría el tiempo, como ya se vio en la traducción (tarea 176).
- **Concurrencia de 4.** Es suficiente paralelismo para unas 9–11 partes sin chocar con los límites de peticiones simultáneas de los proveedores.
- **Mismas instrucciones del sistema en todas las llamadas.** Cada parte recibe las reglas completas (numeración oficial, estructura de actividades, rúbricas, anexos), y el prompt de la parte le indica que las de otras partes las cumplen otras llamadas.
- **Coste:** aumentan los tokens de entrada, porque el contexto se repite en cada parte; los de salida son similares.

## Archivos
- Nuevo: `backend/src/services/project-outline.ts`.
- Nuevo: `backend/src/services/sectioned-generation.service.ts`.
- Modificado: `backend/src/services/queue.service.ts`.
- Nuevo: `backend/src/tests/sectioned-generation.test.ts` (esqueleto, partes, concurrencia, respaldo de proveedor y modelo, generación en una sola llamada y errores).
- Modificado: `backend/src/tests/queue.service.test.ts` (generación por partes con idioma y modelo, y desactivación con la variable).
- Nuevo: `documentation/generacion_proyectos_por_partes.md`.

## Pendiente
- Ejecutar `cd backend && npm test`.
- Generar algún proyecto real y comparar tiempos y contenido con los anteriores: `generationTimeMs`, y la duración de cada parte en el `cascadeLog` del ActivityLog `GENERATE_PROJECT`.

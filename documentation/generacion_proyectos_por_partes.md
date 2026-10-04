# Generación de proyectos por partes

## Problema
Antes, un proyecto se generaba con una sola llamada a la IA: entraba un prompt de unos pocos miles de caracteres y salía un documento de 35.000 a 85.000 caracteres. Esa única respuesta:
- **tardaba mucho:** entre 30 s y más de 5 min, porque el modelo escribe todo el texto seguido;
- **se acercaba al límite de salida del modelo:** al llegar a él, la respuesta se corta sin aviso y el proyecto se guarda incompleto;
- **perdía apartados obligatorios:** en varios proyectos faltaban las rúbricas por módulo o los anexos que exige el prompt.

## Flujo
`queue.service.ts` → `generateProjectBySections` (`services/sectioned-generation.service.ts`):

1. **Esqueleto (1 llamada).**
   - Recibe el prompt del proyecto más la petición `buildOutlinePrompt` (`services/project-outline.ts`).
   - La IA devuelve un JSON con el título, el producto final, las fases (con sesiones, RA/CE y actividades numeradas) y los anexos previstos.
   - Va con razonamiento: es donde se diseña el proyecto.
   - Recibe el aviso de fase («Analizando…») para el panel de notificaciones.
2. **Partes (en paralelo, `SECTION_CONCURRENCY` = 4 a la vez).** Cada parte recibe el prompt completo, el esqueleto en texto (`renderOutline`) y la orden de escribir ÚNICAMENTE su parte (`buildPartPrompt`):
   - **inicio:** título (`#`), Identidad del Proyecto, justificación, pregunta motriz y producto final, elementos curriculares con numeración oficial, objetivos, metodología y temporización;
   - **una parte por fase:** `### Fase N. …`, con sus actividades como `#### Actividad n. …` y la estructura detallada obligatoria;
   - **evaluación:** tabla de RA/CE, criterios, actividades e instrumentos; rúbrica global; una rúbrica por módulo;
   - **cierre:** Carpeta de Aprendizaje si es FP Básica, DUA, recursos y conclusión;
   - **anexos:** en grupos de `ANNEXES_PER_PART` = 4.
   - Las partes van **sin razonamiento** (`SECTION_REASONING = false`): redactan sobre un diseño ya hecho, y así cada llamada tarda mucho menos.
3. **Unión.**
   - Las partes se unen en su orden.
   - El ensamblador inserta los encabezados que agrupan bloques: «Desarrollo de las fases y actividades» y «Anexos», en castellano o catalán según el idioma del proyecto.

## Proveedor, modelo y errores
- **Respaldo «pegajoso», como en la traducción:**
  - si una parte necesita el otro proveedor o un modelo de la cascada, las siguientes van directamente a él;
  - el modelo elegido por el docente se conserva mientras responda el mismo proveedor.
- **Modelo y registro de llamadas:**
  - `usedModel` guarda los modelos distintos usados, unidos por « + »;
  - `cascadeLog` antepone a cada línea la parte (`[esqueleto]`, `[fase-2]`, `[anexos-5]`…) y añade su duración en ms, para poder comparar tiempos.
- **Esqueleto que no es un JSON válido:** el proyecto se genera como antes, en una sola llamada.
- **Fallo de una parte tras toda la cascada:** no se lanzan más partes y el proyecto queda en `error`, igual que antes.

## Desactivarlo
`SECTIONED_GENERATION=false` en el entorno del backend vuelve a la generación en una sola llamada.

## Coste y tiempo
- **Más tokens de entrada:** cada parte vuelve a enviar las instrucciones, los RA con sus criterios y el esqueleto. La salida es parecida a la de una sola llamada.
- **Tiempo:** el esqueleto más la ronda de partes más lenta. Con 4 partes simultáneas y unas 9–11 partes, se esperan unas 3 rondas cortas en lugar de una respuesta larga.
- **Pendiente medirlo:** comparar `generationTimeMs` y los tiempos por parte de `cascadeLog` con proyectos generados en una sola llamada.

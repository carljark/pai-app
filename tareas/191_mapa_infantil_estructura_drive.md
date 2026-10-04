# 191 · Mapa intermodular de 1.º de Educación Infantil a partir de la estructura de Drive

## Propósito

En la carpeta de Drive *Educación Infantil Superior* (proyecto Plappin) hay mapas intermodulares en `.docx`, en castellano y en catalán, uno por módulo. Al revisarlos se vio lo siguiente:

- **La estructura es válida:**
  - hay paridad ES/CA (6.174 filas);
  - las referencias externas son correctas y siempre del mismo curso;
  - cubren casi todos los criterios oficiales.
- **El contenido no lo es:**
  - los nombres de actividad se repetían rotando entre criterios (194 nombres para miles de filas);
  - solo entre un 1 % y un 8 % compartía algún término significativo con su criterio;
  - el desarrollo, las evidencias y el DUA eran plantillas.

Por indicación del usuario, se aprovecha la **estructura de relaciones** RA↔RA de los documentos y se **redacta una actividad coherente por relación**. Esta tarea publica el **primer curso**; el segundo queda pendiente para una tarea posterior.

## Flujo

1. **Extracción.** Se leen los 30 `.docx`: módulo, RA, criterios propios y criterios externos de cada fila.
2. **Plan de relaciones.**
   - Se agrupan las combinaciones de los documentos en pares RA↔RA de módulos distintos.
   - Se recortan hasta dejar entre 6 y 15 por RA.
   - Se asignan como máximo 3 criterios por lado, de forma que queden cubiertos todos los criterios oficiales.
   - Se descarta el criterio 1665-3f, que no es oficial.
3. **Redacción.** Para cada uno de los 203 pares de 1.º se redacta una actividad bilingüe ES/CA:
   - título;
   - factor motivador;
   - desarrollo, que trabaja los criterios concretos de ambos lados;
   - evidencia;
   - medidas DUA;
   - metodología activa;
   - justificación de la conexión.
4. **Generación del JSON.**
   - Cada par se publica **en ambos RA** (relación bidireccional), así que hay 203 pares y 406 conexiones.
   - Los textos de los RA y de los criterios son los oficiales de la colección `ras`, en ES y CA.
   - Se conservan los metadatos de cada módulo (color, icono y tipo).
   - `criteriaKeys` incluye todas las claves de los criterios propios (`a`, `1a`, `0011-1a`…), para que funcione el filtrado por criterio del frontend.
   - `relatedCriteria` contiene solo criterios del módulo destino, con un máximo de 3.
   - `relationType` depende del módulo destino:

     | Módulo destino | `relationType` |
     |---|---|
     | 0011 y 0015 | técnica |
     | 0012 | ciencias |
     | 0014 | comunicación |
     | 1665 | digital |
     | 1709 | empleabilidad |

5. **Validación previa a la escritura.**
   - Hay entre 6 y 15 conexiones por RA (resultado real: entre 7 y 15).
   - El total es de 406 conexiones, dentro del rango de 300 a 600.
   - Ningún título de actividad se repite dentro de un RA.
   - Todos los criterios oficiales están cubiertos.
   - Una heurística no detecta castellano en los campos `_ca`.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_educacion_infantil.json`: regenerado con 6 módulos, 34 RA y 406 conexiones.
- `backend/src/migrations/19_reload_mapa_infantil_primer_curso.ts`: sustituye solo la pestaña `CFGS_EDUCACION_INFANTIL` y es reejecutable. La migración 15 ya estaba aplicada en producción, así que hace falta esta nueva para recargar.
- `backend/src/tests/mapa.test.ts`: un test nuevo comprueba que la migración 19 no toca 2.º, que no hay títulos duplicados por RA, que `relatedCriteria` solo apunta al módulo destino y que las 406 relaciones son bidireccionales. El test de la migración 15 sigue validando las reglas con el nuevo JSON.

## Decisiones

- **Una actividad por conexión.** Se prefiere una actividad propia y coherente por conexión antes que muchas genéricas. Así se cumple la regla de al menos una actividad y no se infla el mapa.
- **Los scripts de extracción, plan y generación son temporales.** Vivieron en el espacio temporal de la sesión y se han eliminado. El JSON resultante es la fuente de verdad.
- **El 2.º curso** (`mapa_cfgs_educacion_infantil_2.json`) no cambia en esta tarea. Ya existe el plan de 262 relaciones para él; falta redactar sus actividades.

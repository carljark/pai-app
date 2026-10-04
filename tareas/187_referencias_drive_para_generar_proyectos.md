# Tarea 187: Referencias de la carpeta de Drive para generar proyectos

## Propósito
Usar como referencia, al generar proyectos, los documentos de la carpeta de Google Drive «REFERENCIAS para hacer proyectos» (dentro de `Proyecto_PLAPPIN`), además de los ejemplos INTEF que ya tenía la aplicación.

## Documentos de la carpeta
| Documento | Contenido | Uso |
|---|---|---|
| `131_EEI_Taller-de-rap_2024.pdf` | Experiencia Educativa Inspiradora (INTEF) n.º 131: taller de rap inclusivo en ESO | Ficha `kind: 'eei'` |
| `118_EEI_REAccion-en-el-aula_2023-1.pdf` | EEI n.º 118: programación de Lengua e Historia con Recursos Educativos Abiertos | Ficha `eei` |
| `62_EEI_La-cadena-de-creatividad_2021.pdf` | EEI n.º 62: ideas de negocio entre ciclos de FP (Empresa e Iniciativa Emprendedora) | Ficha `eei` |
| `68_EEI_FOL-BreakOUT_EDU.pdf` | EEI n.º 68: BreakoutEDU de FOL | Ficha `eei` |
| `50_EEI_Historias-embotelladas_2021.pdf` | EEI n.º 50: reto emprendedor de Estética y Belleza y aprendizaje-servicio de Peluquería | Ficha `eei` |
| `100 buenas prácticas de aprendizaje-servicio 102342.pdf` | Inventario de la Red Española de Aprendizaje-Servicio (2019) | 76 fichas `aps` |

## Implementación
- **Datos** (`backend/src/data/intef_examples.json`), con el mismo formato que los 33 ejemplos INTEF existentes (`title`, `description`, `modules`, `ras`, `methodology`, `originalContent`) más `source` y `kind`:
  - **5 fichas `eei`**, redactadas a partir de los PDF:
    - fases o pasos como `modules`;
    - objetivos de aprendizaje como `ras`;
    - metodología;
    - resumen del desarrollo y de la evaluación.
  - **76 fichas `aps`**, una por práctica a partir de 12 años, extraídas automáticamente del inventario:
    - necesidad social, servicio, aprendizaje y trabajo en red;
    - los aprendizajes, separados, como `ras`;
    - edad y comunidad autónoma en la descripción.
    - Se excluyen las 24 prácticas de 3 a 12 años: el alumnado de primaria no corresponde a ningún nivel de la aplicación.
- **Selección** (`backend/src/services/ai.service.ts`, `selectRelevantExamples`), que sigue inyectando los 8 ejemplos más afines al proyecto:
  - **Ponderación IDF:** cada palabra de la consulta pesa según su rareza en el corpus. Antes, palabras frecuentes como «forma» o «manera» en los RA de los ejemplos de ESO pesaban igual que «peluquería».
  - **Palabras vacías nuevas:** genéricas como «básica», «profesional», «formación», «conocimientos», «forma» o «manera».
  - **Familia profesional del nivel** (`LEVEL_KEYWORDS`: peluquería y estética, belleza, cosmética capilar, educación infantil). Se añade a la consulta y pesa como una coincidencia en un RA, porque los nombres de los módulos no siempre la mencionan.
  - **Como mucho 3 fichas de aprendizaje-servicio** (`MAX_APS_EXAMPLES`) entre los 8. Son resúmenes breves y no deben desplazar a los proyectos completos.
- **Prompt:**
  - el bloque pasa a llamarse «EJEMPLOS DE REFERENCIA: INTEF Y BUENAS PRÁCTICAS DE APRENDIZAJE-SERVICIO»;
  - las fichas nuevas incluyen su `source` (publicación y número) para que la IA sepa de dónde procede cada referencia.

## Resultado de la selección (comprobado con los datos reales)
| Proyecto | Referencias nuevas elegidas |
|---|---|
| FP Básica, Lavado y Atención al cliente | Historias embotelladas, Tijeras que cortan barreras (ApS de FPB de Peluquería y Estética), La cadena de creatividad |
| CFGM Peluquería | Historias embotelladas, Tijeras que cortan barreras, La cadena de creatividad |
| FOL / Empresa | FOL BreakoutEDU, La cadena de creatividad, Historias embotelladas |
| CFGS Educación Infantil | Prácticas ApS afines y La cadena de creatividad |
| ESO Lengua | Siguen los ejemplos INTEF de Lengua; como mucho, una ficha ApS |

## Decisiones técnicas
- **Referencias versionadas, no leídas de Drive en cada generación:** el backend no tiene acceso a Drive, y leer PDF de 3–17 MB en cada petición sería lento y frágil. Si se añaden documentos a la carpeta, hay que repetir la extracción.
- **Mismo fichero y mismo mecanismo de selección** que los ejemplos INTEF, para no alargar el prompt: siguen siendo 8 ejemplos de hasta 1.200 caracteres.

## Archivos
- `backend/src/data/intef_examples.json`: pasa de 33 a 114 referencias.
- `backend/src/services/ai.service.ts`: ponderación IDF, familia profesional, límite de fichas ApS y fuente en el prompt.
- `backend/src/tests/ai.test.ts`: tests de los cambios anteriores y de la integridad de las referencias.
- `documentation/configuracion_esfuerzo_razonamiento_ia.md`: límite de fichas ApS.

## Pendiente
- Ejecutar `cd backend && npm test`.

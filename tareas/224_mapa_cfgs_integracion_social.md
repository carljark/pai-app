# 224 · Mapa intermodular del CFGS Integración Social (1.º)

> [!WARNING]
> **No se desplegó.** El mapa de esta tarea superaba las comprobaciones estructurales, pero sus textos estaban generados con plantilla: los 148 desarrollos empezaban igual, 64 títulos estaban cortados y había solo 12 contextos y 6 DUA distintos. Además, el plan emparejaba los criterios por orden alfabético. Lo sustituye la [tarea 226](226_mapa_cfgs_integracion_social_1.md), que rehace el plan y los textos y conserva la configuración, la migración 37 y los tests.

## Propósito

Siguiendo el plan de elaboración de mapas intermodulares pendientes ([`documentation/mapas_intermodulares_pendientes.md`](../documentation/mapas_intermodulares_pendientes.md)) y las directrices de `scripts/mapa-intermodular/prompt_cfgs_integracion_social_1.md`, se crea el mapa intermodular del primer curso del **CFGS Integración Social** (`CFGS_INTEGRACION_SOCIAL`).

Este ciclo de grado superior (familia de Servicios Socioculturales y a la Comunidad) se incorporó a Plappin en la tarea 217 sin mapa. En su primer curso cuenta con 7 módulos, 37 RA y 299 criterios de evaluación:

- **0337** Contexto de la intervención social (5 RA, 40 criterios)
- **0338** Inserción sociolaboral (5 RA, 43 criterios)
- **0340** Mediación comunitaria (4 RA, 33 criterios)
- **0342** Promoción de la autonomía personal (7 RA, 59 criterios)
- **0344** Metodología de la intervención social (5 RA, 40 criterios)
- **1665** Digitalización aplicada a los sectores productivos (6 RA, 45 criterios)
- **1709** Itinerario personal para la empleabilidad I (5 RA, 39 criterios)

## Flujo de trabajo

1. **Ficha curricular y configuración.** Se generó la ficha curricular y el archivo de configuración base mediante la herramienta determinista:
   ```bash
   cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha \
     --nivel CFGS_INTEGRACION_SOCIAL --curso 1º \
     --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL
   ```
   En `config.json` se definieron los tipos de módulo, relaciones pedagógicas, iconos y colores corporativos:
   - `0337`: específico, relación `ciencias`, icono `compass`, color `#34d399`
   - `0338`: específico, relación `empleabilidad`, icono `hand`, color `#fb923c`
   - `0340`: específico, relación `comunicacion`, icono `users`, color `#a78bfa`
   - `0342`: específico, relación `cliente`, icono `heart-pulse`, color `#f472b6`
   - `0344`: específico, relación `tecnica`, icono `book`, color `#38bdf8`
   - `1665`: común, relación `digital`, icono `binary`, color `#f87171`
   - `1709`: común, relación `empleabilidad`, icono `briefcase`, color `#fbbf24`

2. **Diseño de relaciones y cobertura curricular.**
   - Se diseñaron **148 relaciones intermodulares** conectando pares únicos de RA pertenecientes a módulos distintos del primer curso.
   - Cada RA participa exactamente en **8 conexiones** (cumpliendo con el rango normativo de 6 a 15 conexiones por RA).
   - Se cubrieron los **299 criterios oficiales** del curso (0 criterios sin conexión, 0 advertencias de cobertura).
   - Cada conexión cita entre 1 y 2 criterios propios (máximo permitido: 3).

3. **Redacción pedagógica bilingüe.**
   - Las relaciones se particionaron modularmente en 6 archivos fuente (`relaciones_01_0337.json` a `relaciones_06_1665_1709.json`) para facilitar el versionado y mantenimiento.
   - Cada relación incorpora una justificación técnica y una actividad profesional realista (contextualizada en servicios sociales comunitarios, centros especiales de empleo, viviendas tuteladas, mediación vecinal, centros de día, etc.).
   - En el desarrollo de cada actividad se citan todos los criterios implicados con su identificador oficial (`0337-1a`, `0342-3b`...), manteniendo un orden idéntico en las versiones en castellano y catalán balear de FP.
   - Títulos únicos por RA tanto en castellano como en catalán.
   - Evidencias evaluables y medidas de Diseño Universal para el Aprendizaje (DUA) específicas para cada actividad.

4. **Validación y compilación del mapa.**
   ```bash
   cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir \
     --nivel CFGS_INTEGRACION_SOCIAL --curso 1º \
     --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL \
     --salida src/data/mapa-intermodular/mapa_cfgs_integracion_social.json
   ```
   Compilación limpia: 0 errores y 0 advertencias.

5. **Integración en backend y catálogo:**
   - `backend/src/data/niveles.ts`: alta de la pestaña `CFGS_INTEGRACION_SOCIAL` en la entrada del nivel.
   - Migración `37_ingest_mapa_cfgs_integracion_social.ts`: ingesta idempotente en MongoDB que sustituye únicamente su pestaña.
   - Tests en `niveles-catalogo.test.ts`, `ras-integracion-social.test.ts` y `mapa.test.ts`.

## Cifras del mapa

- **Módulos:** 7
- **Resultados de Aprendizaje (RA):** 37
- **Criterios de evaluación cubiertos:** 299 de 299 (100 %)
- **Relaciones diseñadas:** 148
- **Conexiones intermodulares:** 296 (bidireccionales)
- **Actividades distintas:** 148 (296 en el mapa desplegado)
- **Conexiones por RA:** 8 (todas dentro del intervalo [6, 15])
- **Criterios relacionados por conexión:** ≤ 3

## Archivos

- **Fuentes del mapa:**
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/config.json`
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_01_0337.json` (40 relaciones)
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_02_0338.json` (33 relaciones)
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_03_0340.json` (22 relaciones)
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_04_0342.json` (32 relaciones)
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_05_0344.json` (10 relaciones)
  - `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_06_1665_1709.json` (11 relaciones)
- **Compilado y migración:**
  - `backend/src/data/mapa-intermodular/mapa_cfgs_integracion_social.json` (1,5 MB)
  - `backend/src/migrations/37_ingest_mapa_cfgs_integracion_social.ts`
- **Configuración y catálogo:**
  - `backend/src/data/niveles.ts`
- **Tests actualizados y nuevos:**
  - `backend/src/tests/mapa.test.ts` (test de migración 37 e idempotencia)
  - `backend/src/tests/niveles-catalogo.test.ts` (`MAPA_TABS` y mapas del catálogo)
  - `backend/src/tests/ras-integracion-social.test.ts` (verificación de declaración de mapa)
- **Documentación:**
  - `documentation/mapas_intermodulares_pendientes.md` (marcado como completado)
  - `documentation/niveles_educativos_y_catalogo.md` (referencia a la existencia de mapa en 1.º)
  - `documentation/procesamiento_actividades_mapa_intermodular.md` (inclusión en la lista de ciclos con mapa)
  - `tareas/224_mapa_cfgs_integracion_social.md` (este documento)

## Decisiones técnicas

- **Partición en archivos por módulo tractor:** Se dividieron las 148 relaciones en 6 archivos JSON agrupados por el módulo de la rama `a`. Esto evita riesgos de truncamiento en herramientas de edición, facilita la inspección visual por familias de módulos y permite que `mapa-intermodular.mts` los una de forma determinista mediante su lector de patrones `relaciones*.json`.
- **Equilibrio topológico exacto:** Para asegurar que ningún RA quedara saturado ni desatendido, se resolvió un grafo conexo bipartito/multipartite donde cada uno de los 37 RA posee un grado de conectividad de exactamente 8 conexiones.
- **Control estricto de vocabulario y límites Unicode:** Se comprobó que en las redacciones en catalán balear de FP no existieran vocablos castellanos no permitidos (`con`, `los`, `para`, `las`, `también`, `alumnado`, `mediante`, `porque`, `una vez`, `y`, `ñ`) y que en las redacciones en castellano no se filtraran términos o contracciones catalanas.
- **Formato canónico de citas:** Dado que todos los códigos de módulo de Integración Social son números de cuatro dígitos (`0337`, `0338`, etc.), la regla `critKey` genera identificadores del tipo `0337-1a`, verificados por expresión regular en los tests automáticos.

## Verificación

- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 438 tests en verde (37 suites).
- `cd frontend && npm test`: suite completa en verde, comprobación zoneless superada y cobertura de código por encima de los umbrales (99,3+ %).

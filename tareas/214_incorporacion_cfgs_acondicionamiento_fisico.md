# Tarea 214: Incorporación del CFGS Acondicionamiento Físico (AFD32)

## Propósito
Añadir a Plappin el ciclo de grado superior **Técnico Superior en Acondicionamiento Físico** (familia Actividades Físicas y Deportivas), que el IES Cap de Llevant ofrece desde el curso 2026-27 (`documentation/ciclos_ies_cap_de_llevant.md`), con `tipoNivel = 'CFGS_ACONDICIONAMIENTO_FISICO'`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres «CFGS Acondicionamiento Físico» (BOE/TodoFP) y «CFGS Condicionament físic» (CAIB).
  - Etapa `CFGS`, palabras clave de la familia, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 0017, 1136, 1148, 1149, 1151, 1665 y 1709.
    - 2.º: 1150, 1152, 1153, 1154, 0179, 1708 y 1710.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgs_acondicionamiento_fisico.data.ts` (tipo `CfgmRaData`), con 14 módulos, 78 RA y 569 criterios en castellano y catalán.
- **Migración `32_ingest_cfgs_acondicionamiento_fisico_ras.ts`:** `deleteMany` + `insertMany` solo de este `tipoNivel`; reejecutable y sin efecto en otros niveles.
- **Frontend:** sin cambios. Todo sale de `GET /api/niveles` y `GET /api/ras`.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/condicionament_fisic/>, tabla «Matriculats a partir del curs 2026/27». No se cargan el módulo optativo ni las horas del módulo impartido en inglés, que no tienen currículo propio.
- **Castellano:**
  - Módulos propios: anexo I del **RD 651/2017** (BOE-A-2017-7981, sin versión consolidada).
  - **RD 500/2024** (BOE-A-2024-10685): nombre «Proyecto intermodular de acondicionamiento físico» del 1154. No cambia RA ni criterios.
  - Transversales de grado superior (1665, 1709, 0179, 1708 y 1710): copiados del CFGS Educación Infantil (texto canónico, tarea 210).
- **Catalán:** sin texto oficial (currículo autonómico «en fase d'esborrany»). Traducción propia con el agente `traductor-es-ca` en dos lotes (193 y 147 textos). Los 84 textos castellanos idénticos a los de otros ciclos reutilizan su catalán ya revisado. Nombres de los módulos según la ficha de la CAIB.

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGS_ACONDICIONAMIENTO_FISICO`.
2. `backend/src/data/ras_cfgs_acondicionamiento_fisico.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/32_ingest_cfgs_acondicionamiento_fisico_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-acondicionamiento-fisico.test.ts` (nuevo): totales, numeración consecutiva, letras, paridad ES/CA, textos distintos entre idiomas, mezcla de idiomas, transversales iguales a los de Educación Infantil, nombre del 1154, errata de 1136 RA4 e), módulos por curso, nombre del nivel en el prompt y ausencia de mapa.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos y `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 32 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo.
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Extracción determinista** desde el HTML del BOE con un script temporal, borrado al terminar. Comprueba que cada descripción y criterio castellano aparece literalmente en el BOE, que RA y letras son consecutivos y que hay paridad ES/CA.
- **Erratas del BOE:** falta el punto final en la descripción de 1136 RA4 (se añade); 1136 RA4 e) acaba en coma (se cambia por punto); 1150 RA2 b) «series de coreografiadas» (se conserva); 1151 RA6 g) lleva una lista de pruebas con guiones, que se conserva en un único criterio.
- **Revisión del catalán:** «llitereres» → «lliteres». Otras equivalencias: «fitness» → «fitnes», «soporte musical» → «suport musical», «hidrocinesia» → «hidrocinèsia», «músculo-esquelético» → «musculoesquelètic».
- **Nombre catalán del 1154:** la CAIB solo pone «Projecte intermodular»; se usa «Projecte intermodular de condicionament físic», en paralelo al BOE y a «Projecte intermodular d'atenció a la infància».

## Verificación
- `cd backend && npm test`: 32 archivos y 381 tests en verde.
- `cd frontend && npm test`: lint, tests, cobertura global y por archivo (99,29 % de sentencias) y comprobación zoneless en verde.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGS_ACONDICIONAMIENTO_FISICO`: verificación completada.

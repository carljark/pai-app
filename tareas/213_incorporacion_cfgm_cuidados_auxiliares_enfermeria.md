# Tarea 213: Incorporación del CFGM Cuidados Auxiliares de Enfermería (SAN23)

## Propósito
Añadir a Plappin el ciclo de grado medio **Técnico en Cuidados Auxiliares de Enfermería** (familia Sanidad), que imparte el IES Cap de Llevant (`documentation/ciclos_ies_cap_de_llevant.md`), con `tipoNivel = 'CFGM_CUIDADOS_AUXILIARES_ENFERMERIA'`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

Es el primer título **LOGSE** del catálogo. La CAIB indica que en Baleares se aplica el currículo estatal, sin currículo autonómico.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres «CFGM Cuidados Auxiliares de Enfermería» (BOE) y «CFGM Cures auxiliars d'infermeria» (CAIB).
  - Palabras clave de la familia Sanidad, unidad `RA` y terminología `proyecto_intermodular`.
  - Un único curso (`1º`) con los módulos `CAE1`-`CAE7`: el ciclo dura 1.400 horas, con un curso en el centro más la FCT.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgm_cuidados_auxiliares_enfermeria.data.ts` (tipo `CfgmRaData`), con 7 módulos, 30 capacidades terminales y 173 criterios en castellano y catalán.
- **Migración `31_ingest_cfgm_cuidados_auxiliares_enfermeria_ras.ts`:** `deleteMany` + `insertMany` solo de este `tipoNivel`; reejecutable y sin efecto en otros niveles.
- **Frontend:** sin cambios.

## Fuentes
- **Castellano:** RD 546/1995 (BOE-A-1995-13533), apartados 3.2, 3.3 y 3.5: capacidades terminales y criterios de evaluación de los módulos 1-7. El RD 558/1995 (currículo) remite a él y solo añade contenidos.
- **Catalán:** no hay texto oficial. Traducción propia con el agente `traductor-es-ca` (dos lotes) y revisión posterior («persones velles» → «persones grans»).
- **Ficha de la CAIB:** <https://www.caib.es/sites/fp/ca/cures_auxiliars_dinfermeria/> (ordenación LOGSE, currículo estatal).

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGM_CUIDADOS_AUXILIARES_ENFERMERIA`.
2. `backend/src/data/ras_cfgm_cuidados_auxiliares_enfermeria.data.ts` (nuevo): capacidades y criterios ES/CA.
3. `backend/src/migrations/31_ingest_cfgm_cuidados_auxiliares_enfermeria_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-cuidados-auxiliares-enfermeria.test.ts` (nuevo): totales, numeración consecutiva, letras, paridad ES/CA, textos distintos entre idiomas, mezcla de idiomas, curso único y nombre del nivel en el prompt.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos y `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 31 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo (fuentes, adaptación LOGSE, extracción y traducción).
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Capacidades terminales como RA.** El modelo de datos y el prompt trabajan con RA, así que cada capacidad se guarda como `RA<n>` (capacidad N.n del módulo N). El prompt la llama «Resultado de Aprendizaje RAn». Alternativa descartada: un modelo propio para la LOGSE, desproporcionado para un título que se sustituirá.
- **Criterios con letra.** Los criterios LOGSE no van numerados en el RD. Se les añade `a)`, `b)`… en su orden para mantener el formato del resto de ciclos. El texto tras la letra es literal.
- **Códigos `CAE1`-`CAE7`.** Los módulos LOGSE no tienen código oficial. Se usa la numeración del RD con un prefijo del ciclo.
- **Sin FCT:** como en los demás ciclos.
- **Extracción determinista** desde el HTML del BOE con un script temporal, borrado al terminar. En la primera fila de cada capacidad, el BOE separa las dos columnas de la tabla con « / ». El script comprueba que cada texto castellano aparece literalmente en el BOE, que la numeración de capacidades coincide y que hay paridad ES/CA.
- **Sustitución prevista:** en junio de 2026 se sometió a consulta pública el proyecto de RD del título LOE «Técnico en Cuidados de enfermería». Cuando se implante, habrá que cargar sus RA.

## Verificación
- `cd backend && npm test`: 31 archivos y 372 tests en verde. En la primera ejecución falló una vez `projects.test.ts` («GET /api/projects … mine=true», 400 en vez de 200). Pasó al ejecutarlo aislado y en las dos ejecuciones completas siguientes: es intermitente y ajeno a la tarea.
- `cd frontend && npm test`: lint, 832 tests, cobertura global y por archivo, y comprobación zoneless en verde.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGM_CUIDADOS_AUXILIARES_ENFERMERIA`: verificación completada.

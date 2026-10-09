# Tarea 217: Incorporación del CFGS Integración Social

## Propósito
Añadir a Plappin el ciclo de grado superior **Técnico Superior en Integración Social** (SSC33, familia Servicios Socioculturales y a la Comunidad). Lo imparte el IES Cap de Llevant y estaba en la lista de pendientes de `documentation/ciclos_ies_cap_de_llevant.md`. Su `tipoNivel` es `CFGS_INTEGRACION_SOCIAL`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres «CFGS Integración Social» (BOE/TodoFP) y «CFGS Integració social» (CAIB).
  - Etapa `CFGS`, palabras clave de la familia, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 0337, 0338, 0340, 0342, 0344, 1665 y 1709.
    - 2.º: 0017, 0020, 0339, 0341, 0343, 0345, 0179, 1708 y 1710.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgs_integracion_social.data.ts` (tipo `CfgmRaData`), con 16 módulos, 81 RA y 645 criterios en castellano y catalán.
- **Migración `34_ingest_cfgs_integracion_social_ras.ts`:** hace `deleteMany` + `insertMany` solo de este `tipoNivel`. Se puede reejecutar y no afecta a otros niveles.
- **Frontend:** sin cambios. Todo sale de `GET /api/niveles` y `GET /api/ras`.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/integracio_social/>, tabla «Matriculats a partir del curs 2026/27». No se cargan el módulo optativo ni las horas del módulo impartido en inglés, que no tienen currículo propio.
- **Castellano:**
  - Anexo I del **RD 1074/2012** (BOE-A-2012-10866).
  - **RD 289/2023** (BOE-A-2023-10395): nueva redacción de los módulos 0017, 0337, 0338, 0339, 0340, 0341 y 0343, que se toman de él.
  - **RD 500/2024** (BOE-A-2024-10685): da al 0345 el nombre «Proyecto intermodular de integración social».
  - Transversales (1665, 1709, 0179, 1708 y 1710): copiados del CFGS Enseñanza y Animación Sociodeportiva (tarea 216).
- **Catalán:**
  - No hay texto oficial: el currículo autonómico está «en fase d'esborrany».
  - Traducción propia con el agente `traductor-es-ca`, en tres lotes (149, 144 y 87 textos).
  - Se reutiliza el catalán ya revisado de 123 textos que son idénticos en otros ciclos (sobre todo del 0017, 0020 y 0345).
  - Los nombres de los módulos son los de la ficha de la CAIB.

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGS_INTEGRACION_SOCIAL`.
2. `backend/src/data/ras_cfgs_integracion_social.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/34_ingest_cfgs_integracion_social_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-integracion-social.test.ts` (nuevo). Comprueba:
   - totales, numeración consecutiva de RA y letras de los criterios;
   - paridad ES/CA, textos distintos entre idiomas y que no se mezclan;
   - que los transversales coinciden con los de Animación Sociodeportiva;
   - un criterio con la redacción del RD 289/2023, el nombre del 0345 y la errata conservada de 0340 RA2 e);
   - los módulos por curso, el nombre del nivel en el prompt y que no hay mapa.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos y `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 34 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo.
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Extracción determinista** desde el HTML del BOE con un script temporal, borrado al terminar:
  - El BOE no ofrece el anexo I consolidado, así que se parte del texto de 2012 y se sustituyen los siete módulos que reescribe el apartado «Seis» del RD 289/2023.
  - El script comprueba que cada descripción y cada criterio en castellano aparecen literalmente en el BOE, que los RA y las letras son consecutivos y que hay paridad ES/CA.
- **0017 y 0020** tienen el mismo código que en Educación Infantil, pero no el mismo texto (comas añadidas por el RD 289/2023 en el 0017 y una redacción distinta en 0020 RA2). Por eso no se comparten con ese ciclo: solo se reutiliza el catalán de los textos idénticos.
- **Erratas del BOE**, que se conservan en castellano por ser el texto oficial:
  - 0340 RA2 e) «Se ha planificado actividades apropiadas en los procesos mediación…». En catalán se escribe correctamente («S'han planificat… processos de mediació…»).
  - 0343 RA2 e) «productos de apoyo adecuadas». En catalán, «productes de suport adequats».
- **Nombres catalanes:**
  - El 0341 es «Suport a la intervenció socioeducativa» en la CAIB y «Apoyo a la intervención educativa» en el BOE; se respeta el nombre oficial de cada idioma.
  - En la CAIB, el 0345 aparece solo como «Projecte intermodular». Se usa «Projecte intermodular d'integració social», en paralelo al nombre del BOE.
- **Revisión del catalán:**
  - «lloc de feina» se cambia por «lloc de treball», la forma de los demás ciclos.
  - En 0343 RA1 se quita el «(SAAC)» que añadió la traducción y no está en el original.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 34 archivos y 399 tests en verde.
- `cd frontend && npm test`: en verde.
  - Lint sin errores y 832 tests superados (1 omitido).
  - Cobertura: 99,28 % de sentencias; se cumplen los umbrales globales y por archivo.
  - La comprobación zoneless pasa.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGS_INTEGRACION_SOCIAL`: verificación completada.

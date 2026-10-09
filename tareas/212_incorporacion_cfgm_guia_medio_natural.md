# Tarea 212: Incorporación del CFGM Guía en el Medio Natural y de Tiempo Libre (AFD21)

## Propósito
Añadir a Plappin el ciclo de grado medio **Técnico en Guía en el Medio Natural y de Tiempo Libre** (familia Actividades Físicas y Deportivas), que imparte el IES Cap de Llevant (`documentation/ciclos_ies_cap_de_llevant.md`), con `tipoNivel = 'CFGM_GUIA_MEDIO_NATURAL'`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres oficiales: ES de TodoFP/BOE, «CFGM Guía en el Medio Natural y de Tiempo Libre»; CA de la CAIB, «CFGM Guia en el medi natural i de temps lliure».
  - Palabras clave de la familia, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 1325, 1327, 1329, 1333, 1334, 1335, 1336, 1664 y 1709.
    - 2.º: 1328, 1337, 1338, 1339, 0156, 1708, 1710 y 1713.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgm_guia_medio_natural.data.ts` (tipo `CfgmRaData`), con 17 módulos, 97 RA y 651 criterios en castellano y catalán.
- **Migración `30_ingest_cfgm_guia_medio_natural_ras.ts`:** `deleteMany` + `insertMany` solo de este `tipoNivel`; reejecutable y sin efecto en otros niveles. La aplica el runner al arrancar.
- **Frontend:** sin cambios. Generador, historial, «Mis proyectos», inicio, Taller y exportación toman el ciclo de `GET /api/niveles`, y los RA de `GET /api/ras`.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/guia_en_el_medi_natural_i_de_temps_lliure/>, tabla «Matriculats a partir del curs 2026/27», idéntica a la de 2024/25 y 2025/26.
  - No se carga el módulo optativo, que no tiene currículo propio.
  - El título no incluye Primeros auxilios (0020): su contenido va en Socorrismo en el medio natural (1337).
- **Castellano:**
  - Módulos propios (1325, 1327, 1328, 1329, 1333-1339): anexo I del **RD 402/2020, texto consolidado** (BOE-A-2020-2738, última actualización 28/5/2024).
  - Transversales (1664, 1709, 0156, 1708, 1710 y 1713): texto canónico compartido con los demás ciclos (tarea 210), copiado de Atención a la Dependencia.
- **Catalán:**
  - La CAIB aplica currículos autonómicos «en fase d'esborrany», sin texto publicado. La traducción de los módulos propios es propia, con el agente `traductor-es-ca` (dos lotes) y la terminología de FP balear.
  - Nombres de los módulos según la ficha de la CAIB (el 1338 es «Guia en el medi aquàtic»; el BOE dice «Guía en el medio natural acuático»).

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGM_GUIA_MEDIO_NATURAL`.
2. `backend/src/data/ras_cfgm_guia_medio_natural.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/30_ingest_cfgm_guia_medio_natural_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-guia-medio-natural.test.ts` (nuevo): totales, numeración consecutiva de RA y letras, paridad ES/CA, textos distintos entre idiomas, detección de mezcla de idiomas, transversales iguales a los de Atención a la Dependencia, módulos por curso, nombre del nivel en el prompt y ausencia de mapa.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos por curso y de `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 30 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo (fuentes, extracción, erratas y decisiones de traducción).
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Extracción determinista:** scripts temporales con `pypdf` sobre el PDF consolidado del BOE, borrados al terminar. Se comprueba automáticamente que cada descripción y criterio castellano aparece literalmente en el BOE (espacios normalizados), que RA y letras son consecutivos y que no se ha absorbido «Duración:» ni «Contenidos básicos».
- **Erratas del BOE:**
  - 1338 RA1: los criterios c) y d) están en el mismo párrafo; se separan.
  - Falta el punto final en 1334 RA1 b) y RA2 d), 1337 RA6 f), 1338 RA3 c) y RA5 e), y 1339 RA6 e); se añade.
  - 1336 RA5 d) empieza por «Se ejecutan…» y no por «Se ha»; el test lo admite expresamente.
  - 1337 RA6 g) contiene una lista de pruebas con guiones «−»; se conserva en un único criterio.
- **Revisión del catalán** tras la traducción:
  - «conducció de la mà» → «conducció de l'èquid de la mà» (conducción del diestro).
  - «salt de petits salts» → «franqueig de petits salts».
  - «se n'ha corregit als participants l'execució» → «se n'ha corregit l'execució als participants».
  - «S'han tengut» → «S'han tingut», la forma que usan los demás ciclos.
  - Otras equivalencias fijadas: «zafaduras» → «alliberament», «pozas» → «gorgs», «vías ferratas» → «vies ferrades», «patada» (natación) → «batuda», «zambullida» → «capbussada».

## Verificación
- `cd backend && npm test`: 30 archivos y 365 tests en verde.
- `cd frontend && npm test`: lint, tests, cobertura global y por archivo (99,29 % de sentencias) y comprobación zoneless en verde.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGM_GUIA_MEDIO_NATURAL`: verificación completada.
- Despliegue en producción con `./scripts/deploy-prod.sh` tras el commit.

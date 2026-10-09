# Tarea 216: Incorporación del CFGS Enseñanza y Animación Sociodeportiva

## Propósito
Añadir a Plappin el ciclo de grado superior **Técnico Superior en Enseñanza y Animación Sociodeportiva** (familia Actividades Físicas y Deportivas). Lo imparte el IES Cap de Llevant y estaba en la lista de pendientes de `documentation/ciclos_ies_cap_de_llevant.md`. Su `tipoNivel` es `CFGS_ANIMACION_SOCIODEPORTIVA`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres «CFGS Enseñanza y Animación Sociodeportiva» (BOE/TodoFP) y «CFGS Ensenyament i animació socioesportiva» (CAIB).
  - Etapa `CFGS`, palabras clave de la familia, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 1124, 1136, 1138, 1139, 1141, 1143, 1665 y 1709.
    - 2.º: 1123, 1137, 1140, 1142, 1144, 0179, 1708 y 1710.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgs_animacion_sociodeportiva.data.ts` (tipo `CfgmRaData`), con 16 módulos, 90 RA y 634 criterios en castellano y catalán.
- **Migración `33_ingest_cfgs_animacion_sociodeportiva_ras.ts`:** hace `deleteMany` + `insertMany` solo de este `tipoNivel`. Se puede reejecutar y no afecta a otros niveles.
- **Frontend:** sin cambios. Todo sale de `GET /api/niveles` y `GET /api/ras`.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/ensenyament_i_animacio_socioesportiva/>, tabla «Matriculats a partir del curs 2026/27». No se cargan el módulo optativo ni las horas del módulo impartido en inglés, que no tienen currículo propio.
- **Castellano:**
  - Módulos propios: anexo I del **RD 653/2017** (BOE-A-2017-8301).
  - **RD 500/2024** (BOE-A-2024-10685): da al 1144 el nombre «Proyecto intermodular de enseñanza y animación sociodeportiva».
  - 1136 y transversales (1665, 1709, 0179, 1708 y 1710): copiados del CFGS Acondicionamiento Físico (tarea 214). El 1136 del RD 653/2017 coincide con el del RD 651/2017, erratas incluidas.
- **Catalán:**
  - No hay texto oficial: el currículo autonómico está «en fase d'esborrany».
  - Traducción propia con el agente `traductor-es-ca`, en tres lotes (176, 134 y 84 textos).
  - Se reutiliza el catalán ya revisado de 41 textos que son idénticos en otros ciclos.
  - Los nombres de los módulos son los de la ficha de la CAIB.

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGS_ANIMACION_SOCIODEPORTIVA`.
2. `backend/src/data/ras_cfgs_animacion_sociodeportiva.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/33_ingest_cfgs_animacion_sociodeportiva_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-animacion-sociodeportiva.test.ts` (nuevo). Comprueba:
   - totales, numeración consecutiva de RA y letras de los criterios;
   - paridad ES/CA, textos distintos entre idiomas y que no se mezclan;
   - que el 1136 y los transversales coinciden con los de Acondicionamiento Físico;
   - el nombre del 1144 y la errata de 1137 RA4 b);
   - los módulos por curso, el nombre del nivel en el prompt y que no hay mapa.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos y `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 33 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo.
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Extracción determinista** desde el HTML del BOE con un script temporal, borrado al terminar. El script comprueba:
  - que cada descripción y cada criterio en castellano aparecen literalmente en el BOE;
  - que los RA y las letras de los criterios son consecutivos;
  - que hay paridad ES/CA.
- **Erratas del BOE:**
  - 1137 RA4 b) no tiene punto final; se añade.
  - 1139 RA3 g) lleva una lista de pruebas de socorrismo con guiones. Se conserva en un único criterio, como el 1151 RA6 g) de Acondicionamiento Físico.
- **Nombres catalanes:**
  - La CAIB escribe «animació sociesportiva» en el 1137; se corrige a «socioesportiva».
  - El 1141 se llama «amb objectes» en la CAIB y «de implementos» en el BOE. En los textos catalanes se usa «amb objectes» para que coincidan con el nombre del módulo.
  - En la CAIB, el 1144 aparece solo como «Projecte intermodular». Se usa «Projecte intermodular d'ensenyament i animació socioesportiva», en paralelo al nombre del BOE.
- **Revisión del catalán:** «persones majors» se cambia por «persones grans», que es la forma que usan los demás ciclos.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 33 archivos y 390 tests en verde.
- `cd frontend && npm test`: en verde.
  - Lint sin errores y 832 tests superados (1 omitido).
  - Cobertura: 99,28 % de sentencias; se cumplen los umbrales globales y por archivo.
  - La comprobación zoneless pasa.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGS_ANIMACION_SOCIODEPORTIVA`: verificación completada.

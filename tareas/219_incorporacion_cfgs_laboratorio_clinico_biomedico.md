# Tarea 219: Incorporación del CFGS Laboratorio Clínico y Biomédico

## Propósito
Añadir a Plappin el ciclo de grado superior **Técnico Superior en Laboratorio Clínico y Biomédico** (SAN36, familia Sanidad). Era el último ciclo pendiente de la lista del IES Cap de Llevant (`documentation/ciclos_ies_cap_de_llevant.md`). Su `tipoNivel` es `CFGS_LABORATORIO_CLINICO`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres «CFGS Laboratorio Clínico y Biomédico» (BOE/TodoFP) y «CFGS Laboratori clínic i biomèdic» (CAIB).
  - `codigoCaib: 'SAN36'`, de la oferta de la tarea 218. En las solicitudes de centros, el ciclo pasa a «Disponible».
  - Etapa `CFGS`, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 1367, 1368, 1369, 1370, 0179, 1665 y 1709;
    - 2.º: 1371, 1372, 1373, 1374, 1375, 1708 y 1710.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgs_laboratorio_clinico.data.ts` (tipo `CfgmRaData`), con 14 módulos y 89 RA en castellano y catalán.
- **Migración `35_ingest_cfgs_laboratorio_clinico_ras.ts`:** hace `deleteMany` + `insertMany` solo de este `tipoNivel`. Se puede reejecutar y no afecta a otros niveles.
- **Frontend:** sin cambios.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/laboratori_clinic_i_biomedic/>, tabla «Matriculats a partir del curs 2026/27». No se cargan el módulo optativo ni las horas del módulo impartido en inglés.
- **Castellano:**
  - Anexo I del **RD 771/2014** (BOE-A-2014-10068).
  - El **RD 500/2024** solo renombra el 1375 como «Proyecto intermodular de laboratorio clínico y biomédico».
  - Transversales copiados del CFGS Enseñanza y Animación Sociodeportiva (tarea 216).
- **Catalán:**
  - No hay texto oficial. El BOE no tiene traducción catalana de este real decreto, y el PDF que enlaza la CAIB es el BOE en castellano.
  - Traducción propia con el agente `traductor-es-ca`, en tres lotes (194, 207 y 123 textos).
  - Se reutiliza el catalán ya revisado de 37 textos que son idénticos en otros ciclos, sobre todo del proyecto.

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGS_LABORATORIO_CLINICO`.
2. `backend/src/data/ras_cfgs_laboratorio_clinico.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/35_ingest_cfgs_laboratorio_clinico_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-laboratorio-clinico.test.ts` (nuevo). Comprueba:
   - totales, numeración consecutiva y letras de los criterios;
   - paridad ES/CA y que los idiomas no se mezclan;
   - que los transversales coinciden con los de los demás CFGS;
   - el nombre del 1375 y las erratas corregidas;
   - los módulos por curso, `codigoCaib`, el prompt y que no hay mapa.
5. `backend/src/tests/niveles-catalogo.test.ts` y `migrations.test.ts`: el ciclo y la migración 35 entran en las comprobaciones comunes.
6. `backend/src/tests/solicitudes.test.ts`: los tests usaban SAN36 como ciclo que falta; ahora usan SAN34 (Higiene bucodental), porque SAN36 ya está disponible.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo.
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados» y no queda ninguno pendiente.
9. `documentation/solicitudes_de_centros.md`: `SAN36` en la tabla de `codigoCaib`.

## Decisiones técnicas
- **Extracción determinista** desde el HTML del BOE con un script temporal, borrado al terminar.
  - Comprueba que cada texto castellano aparece literalmente en el BOE, que los RA y las letras son consecutivos y que hay paridad ES/CA.
  - El BOE separa la letra del criterio con espacios duros. La comparación los normaliza, y en el texto cargado se sustituyen por espacios normales.
- **Erratas del BOE**, que también están en el PDF oficial:
  - 1371 RA1 j) termina en coma; se cambia por punto.
  - 1371 RA7 g) no tiene punto final; se añade.
  - 1370 RA8 c) empieza en minúscula; se pone mayúscula.
  - 1373 RA4 empieza con un sustantivo («Aplicación de técnicas…») en vez de un verbo; se conserva.
- **Nombres catalanes:**
  - 1374: la CAIB escribe «Tècniques d'anàlisi hematològic». Se usa «hematològica» por la concordancia con «anàlisi», que es femenino.
  - 1375: se usa «Projecte intermodular de laboratori clínic i biomèdic», en paralelo al BOE.
- **Revisión del catalán:** la traducción ya usa «lloc de treball», como los demás ciclos. Es terminología sanitaria propia: «extensió» (frotis), «femta», «floridures», «calibratge», «al capçal del pacient». Conviene que la revise alguien del departamento.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 36 archivos y 423 tests en verde.
- `cd frontend && npm test`: en verde.
  - Lint y 854 tests superados (1 omitido).
  - Se cumplen todos los umbrales de cobertura.
  - La comprobación zoneless pasa.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGS_LABORATORIO_CLINICO`: verificación completada.

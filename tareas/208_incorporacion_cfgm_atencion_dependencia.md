# Tarea 208: Incorporación del CFGM Atención a Personas en Situación de Dependencia (SSC21)

## Propósito
Añadir a Plappin el ciclo de grado medio **Técnico en Atención a Personas en Situación de Dependencia** (familia Servicios Socioculturales y a la Comunidad), que imparte el IES Cap de Llevant (`documentation/ciclos_ies_cap_de_llevant.md`), con `tipoNivel = 'CFGM_ATENCION_DEPENDENCIA'`. Se incorpora **sin mapa intermodular**, según la skill `agregar-ciclo-educativo`.

## Arquitectura y flujo
- **Catálogo (`backend/src/data/niveles.ts`):**
  - Nueva entrada con los nombres oficiales: ES del BOE, «CFGM Atención a Personas en Situación de Dependencia»; CA de la CAIB, «CFGM Atenció a persones en situació de dependència».
  - Palabras clave de la familia, unidad `RA` y terminología `proyecto_intermodular`.
  - Dos cursos con sus módulos en el orden de FP Illes Balears:
    - 1.º: 0020, 0210, 0212, 0213, 0215, 0217, 1664 y 1709.
    - 2.º: 0211, 0214, 0216, 0831, 0156, 1708, 1710 y 1713.
  - Sin `mapas`.
- **Datos:** `backend/src/data/ras_cfgm_atencion_dependencia.data.ts` (tipo `CfgmRaData`), con 16 módulos, 78 RA y 590 criterios en castellano y catalán.
- **Migración `26_ingest_cfgm_atencion_dependencia_ras.ts`:** hace `deleteMany` + `insertMany` solo de este `tipoNivel`, así que es reejecutable y no toca otros niveles. La aplica el runner al arrancar.
- **Frontend:** sin cambios. Generador, historial, «Mis proyectos», inicio, Taller y exportación toman el ciclo de `GET /api/niveles`, y los RA de `GET /api/ras`.

## Fuentes
- **Distribución por cursos:** ficha de la CAIB <https://www.caib.es/sites/fp/ca/atencia_a_persones_en_situacia_de_dependancia/>, tabla «Matriculats a partir del curs 2026/27», idéntica a la de 2024/25 y 2025/26.
  - No se carga el módulo optativo, que no tiene currículo propio.
  - FOL (0218), EIE (0219) y FCT (0220) del RD de 2011 ya no se imparten tras la reforma de 2024 (RD 659/2023 y RD 499/2024).
- **Castellano:**
  - 0020, 0210-0217 y 0831: anexo I del **RD 1593/2011** (BOE-A-2011-19542). El BOE no tiene versión consolidada, y el RD 499/2024 solo cambia del título el artículo 6 y los anexos III y V.
  - 1664, 1708, 1709, 1710 y 0156: **RD 659/2023, texto consolidado** (BOE-A-2023-16889, última modificación 6/5/2025).
  - 1713: anexo II del **RD 499/2024** (BOE-A-2024-10684).
- **Catalán:**
  - La CAIB aplica currículos autonómicos «en fase d'esborrany», sin texto publicado. Tampoco las orientaciones de pruebas libres de la CAIB recogen los RA.
  - La traducción es propia, con el agente `traductor-es-ca` y la terminología de FP balear, igual que en la tarea 180.
  - Se reutiliza el catalán ya revisado de Peluquería y Educación Infantil cuando el castellano coincide: todos los transversales y 27 textos del 0020.

## Archivos modificados
1. `backend/src/data/niveles.ts`: entrada `CFGM_ATENCION_DEPENDENCIA`.
2. `backend/src/data/ras_cfgm_atencion_dependencia.data.ts` (nuevo): RA y criterios ES/CA.
3. `backend/src/migrations/26_ingest_cfgm_atencion_dependencia_ras.ts` (nuevo): ingesta en `ras`.
4. `backend/src/tests/ras-atencion-dependencia.test.ts` (nuevo):
   - totales y numeración consecutiva de RA y letras;
   - paridad ES/CA y textos distintos entre idiomas;
   - detección de palabras del otro idioma, con límites Unicode para no confundir enclíticos como «adaptant-los»;
   - nombre del nivel en el prompt y ausencia de mapa.
5. `backend/src/tests/niveles-catalogo.test.ts`: el ciclo entra en las comprobaciones de módulos por curso y de `tipoNivel`.
6. `backend/src/tests/migrations.test.ts`: la migración 26 es idempotente y no toca otros niveles.
7. `documentation/niveles_educativos_y_catalogo.md`: sección del ciclo (fuentes, extracción y erratas).
8. `documentation/ciclos_ies_cap_de_llevant.md`: el ciclo pasa a «Ya incorporados».

## Decisiones técnicas
- **Extracción determinista:**
  - Scripts temporales con `pypdf` sobre los PDF oficiales del BOE, borrados al terminar.
  - Comprobaciones automáticas: cada descripción y criterio castellano aparece literalmente en su BOE, RA y letras son consecutivos, y no se ha absorbido ningún «Duración:» ni «Contenidos básicos».
- **Transversales extraídos de nuevo y no copiados de Peluquería.** Los datos de Peluquería no coinciden literalmente con el BOE:
  - espacios sobrantes («software ,», «cloud /nube») y un escape de markdown («2030\.»);
  - «de acuerdo con» donde el RD 499/2024 dice «de acuerdo a» (1713 RA1);
  - dos criterios h) e i) en 1709 RA3 que no están en ninguna versión del RD 659/2023.
  Aquí se usa el texto oficial consolidado. **Peluquería no se ha tocado:** queda pendiente revisarla si se quiere.
- **0020 Primeros auxilios:** se usa el texto del RD 1593/2011 («persona accidentada», «que hay que conseguir»), que difiere ligeramente del de Educación Infantil (RD 1394/2007).
- **Erratas del BOE:**
  - El RD 1593/2011 escribe «Código 0212» sin dos puntos.
  - En 0211 RA2 b) y 0215 RA2 b) falta el punto final; se añade.
  - El RD 499/2024 repite la letra «a)» en 1713 RA5; se renumera a)-d).
  - 0216 RA5 f) tiene una redacción poco clara en el BOE («para su comunicación responsable del plan de cuidados»); se conserva literal.
- **Revisión del catalán:**
  - Lote A: «higiene i neteja personal» en lugar de «serveis personals» y «cientificotecnològics».
  - Lote B: erratas de los textos reutilizados de 1664, 1709 y 1713 («Shan», «lexecució», «s'han de ser aplicades»…). Solo afectan a este ciclo.

## Verificación
- `cd backend && npm test`: 29 archivos y 353 tests en verde.
- `cd frontend && npm test`: lint, tests, cobertura global y por archivo (99,29 % de sentencias) y comprobación zoneless en verde.
- `.agents/skills/agregar-ciclo-educativo/scripts/verify_cfgm_integration.sh CFGM_ATENCION_DEPENDENCIA`: verificación completada.
- `tsc --noEmit` del backend: solo los avisos de extensión de import (TS2835) que arrastra todo el proyecto y sus derivados; ningún error propio de los archivos nuevos.
- Despliegue en producción: ver el commit de la tarea y `documentation/despliegue_produccion.md`.

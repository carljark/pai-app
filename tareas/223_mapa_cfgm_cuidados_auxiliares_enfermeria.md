# 223 · Mapa intermodular del CFGM Cuidados Auxiliares de Enfermería y herramienta de generación

## Propósito

Los 7 últimos ciclos de FP incorporados (tareas 208-219) no tienen mapa intermodular, porque se añaden sin él (AGENTS.md §8). El usuario pidió tres cosas:

- preparar la lista de mapas pendientes;
- hacer el mapa de uno de los ciclos;
- dejar un prompt reutilizable para encargar los demás a otro modelo (Gemini con antigravity-cli) y comparar resultados.

Se eligió el **CFGM Cuidados Auxiliares de Enfermería** porque es el más acotado: un solo curso, 7 módulos, 30 RA y 173 criterios.

Para que el prompt funcione igual con cualquier modelo, la tarea separa la parte pedagógica de la parte mecánica:

- el modelo solo redacta relaciones RA↔RA con su actividad;
- una herramienta determinista valida las reglas del mapa y compone el JSON con los textos oficiales.

## Flujo

1. **Ficha curricular.** `mapa-intermodular.mts ficha` vuelca los módulos, RA y criterios ES/CA del curso desde `ras_cfgm_cuidados_auxiliares_enfermeria.data.ts` y propone el `config.json` de los módulos. Tipos y familias de relación:

   | Módulos | `tipo` | `relationType` de las conexiones que llegan |
   |---|---|---|
   | CAE1 (documentación sanitaria) | específico | cliente |
   | CAE2 y CAE5 (técnicas de enfermería y odontológicas) | específico | técnica |
   | CAE3 (higiene hospitalaria) | específico | ciencias |
   | CAE4 (promoción de la salud y apoyo psicológico) | específico | comunicación |
   | CAE6 (relaciones en el equipo) | transversal | comunicación |
   | CAE7 (FOL) | común | empleabilidad |

2. **Plan de relaciones.** Se diseñaron 136 relaciones entre RA de módulos distintos, con 1-3 criterios por lado. Un script temporal comprobó:
   - que hay entre 6 y 14 relaciones por RA;
   - que ningún par de RA se repite (dos pares duplicados se fusionaron);
   - que se cubren los 173 criterios (los 9 que faltaban se añadieron a relaciones ya planteadas).

3. **Redacción.** Cada relación tiene una justificación y una actividad bilingüe con estas partes:
   - título;
   - contexto profesional;
   - desarrollo, que cita cada criterio con su código completo (`CAE2-3c`);
   - evidencia;
   - medidas DUA;
   - metodología activa.

   El catalán se redactó directamente en catalán balear de FP, no traducido palabra por palabra.

4. **Validación y generación.** `mapa-intermodular.mts construir` valida las reglas (ver más abajo) y escribe el JSON. Cada relación se publica en los dos RA. Resultado: 7 módulos, 30 RA, 272 conexiones y 136 actividades distintas (272 en el mapa).

5. **Integración.**
   - `mapas` en el catálogo, sin `curso` porque el ciclo tiene uno solo, como Estética;
   - migración 36;
   - tests.

## Archivos

- **Herramienta (nueva):**
  - `scripts/mapa-intermodular/mapa-intermodular.mts`: subcomandos `ficha` y `construir`. Se ejecuta con el `tsx` del backend: `cd backend && npx tsx ../scripts/mapa-intermodular/…`.
  - `scripts/mapa-intermodular/prompt.md`: prompt completo para otro modelo, con marcadores por ciclo y curso.
  - `scripts/mapa-intermodular/fuentes/CFGM_CUIDADOS_AUXILIARES_ENFERMERIA/`: `config.json` y `relaciones.json`, la fuente versionada del mapa. `ficha.md` se regenera y está en `.gitignore`.
- **Datos y migración:**
  - `backend/src/data/mapa-intermodular/mapa_cfgm_cuidados_auxiliares_enfermeria.json`: 1,3 MB.
  - `backend/src/migrations/36_ingest_mapa_cfgm_cuidados_auxiliares_enfermeria.ts`: sustituye solo su pestaña y es reejecutable.
  - `backend/src/data/niveles.ts`: entrada `mapas` del ciclo.
- **Tests:**
  - `mapa.test.ts`: migración 36. Comprueba que es idempotente y no toca otras pestañas, la bidireccionalidad (272 conexiones), las 6-15 conexiones por RA, como máximo 3 criterios externos, los textos de RA iguales a los del archivo de datos, el formato de `sourceCriteria` y el endpoint.
  - `niveles-catalogo.test.ts`: pestaña en `MAPA_TABS` y en la lista de mapas.
  - `ras-cuidados-auxiliares-enfermeria.test.ts`: el ciclo ya declara su mapa.
- **Documentación:**
  - `documentation/mapas_intermodulares_pendientes.md` (nuevo): los 13 cursos de los 7 ciclos, con sus datos, estado y orden sugerido.
  - `documentation/procesamiento_actividades_mapa_intermodular.md`: la sección 6, desfasada, se reescribe (las pestañas salen del catálogo y no de un `MAPA_TABS` del frontend) y se añade la sección 8, sobre la herramienta.
  - `documentation/niveles_educativos_y_catalogo.md`: el ciclo tiene mapa.
  - `.agents/skills/agregar-ciclo-educativo/SKILL.md`: la sección 7 remite a la herramienta como camino recomendado.

## Decisiones técnicas

- **El modelo redacta y el código compone.** Los textos de RA y criterios no pasan por el modelo: el generador los toma de los `ras_*.data.ts`. Así no hay abreviaturas ni traducciones distintas de las del generador de proyectos, el problema de las tareas 182-184 y 211. La bidireccionalidad, `criteriaKeys`, `relatedCriteria` y los identificadores de actividad también son mecánicos.
- **Validaciones que bloquean la escritura:**
  - los RA y las letras existen;
  - de 1 a 3 criterios por lado, en módulos distintos;
  - sin pares repetidos;
  - de 6 a 15 conexiones por RA;
  - al menos una actividad por relación;
  - títulos únicos por RA en ES y CA;
  - textos ES/CA presentes y distintos;
  - detección de mezcla de idiomas;
  - citas de criterios iguales en ES y CA y pertenecientes a la relación.

  Son avisos: los criterios del curso sin conexión y los criterios de la relación que el desarrollo no cita. Todos los errores se muestran a la vez para que el modelo los corrija en una pasada; se comprobó con una entrada estropeada a propósito.
- **Límites de palabra Unicode** en el detector de idiomas: `\b` de JavaScript no reconoce letras acentuadas y marcaba «con» dentro de «conèixer».
- **`sourceCriteria` sin prefijo cuando el código del módulo tiene letras** (`1a` en lugar de `CAE1-1a`). El filtro por criterio del frontend busca la letra dentro de `sourceCriteria` si `criteriaKeys` no coincide, y la «a», la «c» y la «e» de «CAE» darían coincidencias falsas. `criteriaKeys` mantiene las tres formas.
- **Una actividad por relación**, según la regla vigente (mínimo 1). El total de 272 conexiones queda por debajo de la orientación de 300-600, pensada para cursos de 8-11 módulos. Este curso tiene 7 módulos y 30 RA, y la media de 9 conexiones por RA está en el centro del rango.
- **Fuentes versionadas.** `relaciones.json` (250 KB) permite regenerar el mapa si se corrigen textos de RA. La generación es determinista: se comprobó que las fuentes versionadas reproducen el JSON byte a byte.
- **Riesgo conocido:** este título LOGSE se sustituirá por el LOE «Técnico en Cuidados de enfermería» (ver `niveles_educativos_y_catalogo.md`). Cuando se recargue con los RA nuevos, habrá que rehacer el mapa.

## Verificación

- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 437 tests en verde.
- `cd frontend && npm test`: lint, cobertura (99,3 % de sentencias) y comprobación zoneless en verde.

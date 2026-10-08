# Tarea 202: Mapa de afinidades curriculares de la ESO (1.º-4.º)

> **Plan:** [004 — Mapa de afinidades curriculares de la ESO (1.º-4.º)](../planes/004_plan_mapa_afinidades_curriculares_eso.md)

## Propósito

Crear el mapa intermodular de la ESO a partir del documento del IES Cap de Llevant *Afinitats curriculars · ESO 2027-2028* (`add_maps/Afinitats_curriculars_ESO_2027_28.PDF`, fuera de git).
- **Formato:** el del documento, **sin actividades**. Cada ficha recoge el ámbito propuesto, los criterios de evaluación relacionados de cada materia con «la relación que fundamenta el ámbito», los saberes básicos movilizados y los conceptos comunes.
- **Revisión y ampliación:** se revisa el documento contra el currículo oficial (Decreto 42/2025) y se amplían los cursos con pocas fichas.
- **4.º de ESO:** se añade el curso con sus 18 materias, incluidas Digitalización, Economía y Emprendimiento, Valores Cívicos y Éticos, Expresión Artística, FOPP, Latín y Tecnología.

## Arquitectura y flujo

- **Catálogo** (`niveles.ts`): `ESO_ORDINARIA` declara cuatro pestañas de mapa, `ESO_1`…`ESO_4`, con `formato: 'afinidades'`.
  - `MAPA_TABS` solo incluye ahora las pestañas de módulos (FP).
  - Nuevos `AFINIDADES_TABS` y `cursoDeTab`.
- **Datos:** `backend/src/data/afinidades-eso/afinidades_eso_{1..4}.json`, ingeridos por la migración `25_ingest_afinidades_eso` en la colección propia `AfinidadEso`.
- **API:** `GET /api/afinidades-eso?tab=ESO_n` (pública, como el mapa de FP) devuelve `{ curso, materias, afinidades }`.
  - `materias`: todas las materias del curso (según `subjectTipos` de las CE) con su número de fichas.
  - Cada vínculo añade `criteriosTexto` con el texto oficial ES/CA de cada criterio, resuelto desde la colección `CE` por id **y** curso, porque los ids se repiten entre 1.º-3.º y 4.º.
- **Frontend:**
  - `mapa-intermodular-view` muestra `app-afinidades-eso-view` cuando la pestaña es de afinidades, y `MapaIntermodularFacade.setTab` no pide módulos en ese caso.
  - `AfinidadesEsoFacade` guarda en signals los datos del curso, la materia activa, sus fichas, la caché por pestaña y el control de respuestas tardías.
  - `AfinidadCardComponent` reproduce la ficha del documento: insignias de curso, opción y origen, materias, ámbito, una tabla de criterios por materia con el texto oficial desplegable y la relación, los saberes y los conceptos.
  - El selector de pestañas existente muestra la ESO con los botones 1.º-4.º.

## Archivos modificados

1. `backend/src/data/niveles.ts`: `MapaNivel.formato`, mapas de la ESO, `MAPA_TABS`, `AFINIDADES_TABS` y `cursoDeTab`.
2. `backend/src/models/AfinidadEso.ts` (nuevo): modelo y tipos de la ficha.
3. `backend/src/migrations/25_ingest_afinidades_eso.ts` (nuevo): `loadAfinidades`, `afinidadDocs` y `up` idempotente.
4. `backend/src/controllers/afinidades.controller.ts` y `backend/src/routes/afinidades.routes.ts` (nuevos), y `backend/src/server.ts`: endpoint.
5. `backend/src/data/afinidades-eso/afinidades_eso_{1,2,3,4}.json` (nuevos): 21, 29, 37 y 38 fichas (125 en total).
6. `backend/src/tests/afinidades.test.ts` y `backend/src/tests/afinidades-datos.test.ts` (nuevos), y `backend/src/tests/niveles-catalogo.test.ts`.
7. `frontend/src/app/services/niveles.service.ts`: `MapaNivel.formato`.
8. `frontend/src/app/features/mapa-intermodular/`, piezas nuevas:
   - modelo `models/afinidad-eso.model.ts`;
   - `services/afinidades-eso.service.ts` y `services/afinidades-eso.facade.ts`;
   - `components/afinidades-eso-view/` y `components/ui/afinidad-card/`;
   - specs de todos ellos y `frontend/src/app/testing/afinidades.mock.ts`.
9. `frontend/src/app/features/mapa-intermodular/`, piezas modificadas: `mapa-intermodular-view.component.{ts,html}`, `mapa-intermodular.facade.ts` y sus specs.
10. `.claude/agents/traductor-es-ca.md` (nuevo): agente Sonnet con las reglas de paridad ES/CA del proyecto, para usarlo siempre en las traducciones.
11. `documentation/mapa_afinidades_eso.md` (nuevo) y plan 004.

## Decisiones técnicas

- **Colección propia en lugar de `MapaModule`.** El modelo de la FP gira en torno a las actividades: el controlador descarta las conexiones sin ellas y la vista tiene un paso de actividades. Además, obligaría a duplicar cada afinidad en cada materia. Aquí cada ficha se guarda una vez y se muestra desde cada materia implicada.
- **Revisión del PDF.**
  - Las 80 fichas (20 materias × 4 opciones) se extrajeron con un script determinista.
  - **Todos los criterios citados existen y son del curso de su ficha.** Una primera validación daba 232 errores falsos porque no tenía en cuenta que los ids se repiten entre bloques de cursos.
  - 13 parejas aparecen dos veces porque cada materia muestra la misma afinidad desde su lado:
    - 7 tienen las mismas relaciones y se fusionan: unión de criterios y conceptos, y los dos nombres de ámbito se conservan en `fuentes`, así que la vista muestra el nombre del documento según la materia consultada;
    - las otras 6 son propuestas distintas y quedan como fichas separadas.
  - Resultado: 73 fichas de `origen: "documento"`.
- **Ampliación.**
  - 14 fichas nuevas en 1.º-3.º cubren los huecos de menos de 3 fichas por materia y curso: Cultura Clásica I en 2.º, Cultura Clásica II, lenguas extranjeras, Igualdad de Género, Recursos Digitales, Castellano de 2.º y EF de 2.º y 3.º.
  - 38 fichas para 4.º, con 4 o 5 por materia.
  - Todas llevan `origen: "ampliacion"` y la vista las distingue con una insignia.
  - Sus criterios se validaron contra `curriculo-eso`.
  - Sus saberes se contrastaron con los saberes básicos oficiales extraídos de los decretos castellano y catalán (`Proyecto_FPB_PAI/ESO/`):
    - 33 etiquetas se reformularon para ajustarse a un saber real;
    - la ficha de Biología + EF de 4.º se rehízo porque Biología de 4.º no tiene bloques de salud ni de ecología.
- **Traducción.** El PDF solo está en catalán. El castellano lo hicieron subagentes Sonnet siguiendo las reglas de `traductor-es-ca`, con comprobaciones automáticas de paridad y de mezcla de idiomas.
- **Reparto de trabajo por coste.** Opus diseñó, revisó y redactó las fichas nuevas. Sonnet se encargó de las traducciones, la extracción de saberes, los tests del backend y los specs del frontend.
- **Pendiente para más adelante:** botón «Crear situación de aprendizaje» desde una ficha.

## Verificación

- `cd backend && npm test`: 27 archivos y 328 tests en verde. Incluye integridad de datos (criterios existentes en su curso, paridad ES/CA, heurística de idioma y al menos 3 fichas por materia y curso de 1.º a 4.º), API, migración y catálogo.
- `cd frontend && npm test`: ESLint, la suite completa, `check-coverage.js` y `check-zoneless.js`.
  - Cobertura global: 99,26 % de sentencias, 96,94 % de ramas, 98,64 % de funciones y 99,61 % de líneas.
  - Los archivos nuevos están al 100 %.
- `npx ngc -p tsconfig.app.json --noEmit` y `npx eslint` sobre los archivos tocados: sin errores.
- En el backend, `tsc --noEmit` no es representativo (el proyecto no resuelve las extensiones de los imports relativos con su configuración), así que no se usó como criterio.
- Despliegue en producción con `./scripts/deploy-prod.sh`:
  - copia de seguridad `pai_db_20261008_153811.archive.gz`;
  - commit `e30c162`;
  - migración `25_ingest_afinidades_eso` completada.
- `GET /api/afinidades-eso` en producción:
  - ESO_1: 12 materias, 21 fichas.
  - ESO_2: 15 materias, 29 fichas.
  - ESO_3: 17 materias, 37 fichas.
  - ESO_4: 18 materias, 38 fichas.
  - Ningún criterio queda sin texto oficial ES/CA. Cada materia tiene al menos 3 fichas (4 en 4.º).
  - El mapa de FP (`tab=FPB`) sigue respondiendo 200.
- **Revisión visual pendiente:**
  - en local Docker no estaba arrancado;
  - en producción la interfaz exige iniciar sesión y no se usaron credenciales sin autorización del usuario.

## Desviaciones respecto al plan

- **Fichas recíprocas.** Las de idéntica relación se fusionan conservando los dos nombres de ámbito por fuente; esto no estaba previsto en el plan.
- **Número de fichas.** Hay 73 del documento (no ~67 afinidades únicas), 14 de ampliación (no ~20) y 38 de 4.º (dentro de lo previsto).
- **Cabecera.** No se tocó la cabecera de estadísticas del mapa: en la ESO no se muestra y la vista de afinidades presenta su propio resumen (materias y fichas por materia).
- **Agente.** Además se creó el agente `traductor-es-ca`, a petición del usuario.

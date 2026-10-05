# Tarea 197: ESO ordinaria (1.º-4.º) y catálogo de niveles educativos

> **Plan:** [001 — ESO ordinaria (1.º-4.º) y catálogo de niveles educativos](../planes/001_plan_eso_ordinaria_y_catalogo_de_niveles.md)

## Propósito

Añadir el nivel **ESO** (ESO ordinaria, distinta de la ESO del PDC) con sus cuatro cursos y las competencias específicas (CE) y criterios de evaluación oficiales de todas sus materias, incluidas las optativas y las de opción. La generación debe tener en cuenta la edad del alumnado y la terminología LOMLOE. Además se da el primer paso hacia un catálogo único de niveles, para poder ir incorporando todos los ciclos FP de las Illes Balears y, más adelante, los de toda España.

## Arquitectura y flujo

1. **Catálogo** (`backend/src/data/niveles.ts`): cada nivel define id, etapa, comunidad, nombres ES/CA, unidad (RA/CE), terminología y cursos con edad. Se sirve en `GET /api/niveles` y valida `Project.tipoNivel`.
2. **Datos:** 31 materias en `backend/src/data/curriculo-eso/*.json`, extraídas del anexo 2 del Decreto 42/2025 (BOIB n.º 103, 4/8/2025) en castellano y catalán. Son 189 CE y 733 criterios; cada criterio lleva los cursos en que se aplica, y cada materia su tipo por curso (común, de opción u optativa).
3. **Migraciones:**
   - `22_ce_tipo_nivel_pdc` marca las 65 CE existentes como `DIVERSIFICACION_CURRICULAR`.
   - `23_ingest_ces_eso_ordinaria` carga los JSON con `tipoNivel: 'ESO_ORDINARIA'`. Solo reemplaza esas CE, así que es idempotente.
4. **API:** `GET /api/ces?tipoNivel=ESO_ORDINARIA&curso=…&lang=…` devuelve las CE de las materias del curso, con sus criterios de ese curso, el tipo de materia y un valor único de selección «Materia · CEn. Descripción». Sin `tipoNivel` devuelve las del PDC, como antes.
5. **Prompt** (`services/eso-curriculum.service.ts`):
   - cada CE se describe con su materia, número oficial, descriptores del perfil de salida y criterios del curso;
   - `buildEsoInstruction` añade terminología LOMLOE, edad del alumnado (12-13 a 15-16 años), perfil de salida, evaluación formativa, DUA y producto final cercano.
6. **Frontend:**
   - `NivelesService` carga el catálogo, y el generador construye con él el desplegable y los botones de curso;
   - `CurriculumFacade.loadEsoCes` carga las CE del curso, y `AppFacade` las recarga al cambiar de nivel, curso o idioma;
   - `groupEsoCes` agrupa por materia y marca «· De opción» / «· Optativa»;
   - el selector usa `item.value` cuando existe;
   - historial, «Mis proyectos», exportación y Taller reconocen la nueva titulación «ESO».

## Archivos modificados

1. `backend/src/data/niveles.ts` (nuevo): catálogo de niveles y helpers `findNivel`, `defaultCurso` y `edadDeCurso`.
2. `backend/src/data/curriculo-eso/*.json` (nuevo, 31 archivos): currículo de la ESO ES/CA.
3. `backend/src/models/CE.ts`: campos `tipoNivel`, `subjectCode`, `subject_es/ca`, `subjectTipos`, `ce_num`, `descriptores` y `criteriosPorCurso`.
4. `backend/src/models/Project.ts`: el enum de `tipoNivel` sale de `NIVEL_IDS`.
5. `backend/src/migrations/22_ce_tipo_nivel_pdc.ts` y `23_ingest_ces_eso_ordinaria.ts` (nuevos).
6. `backend/src/services/eso-curriculum.service.ts` (nuevo): selección, búsqueda, mapeo para la API, descripción para el prompt y reglas de la ESO.
7. `backend/src/controllers/curriculum.controller.ts` y `routes/curriculum.routes.ts`: `getCes` por nivel y curso; `GET /api/niveles`.
8. `backend/src/controllers/project.controller.ts`:
   - `describeTargetCourse` usa el catálogo (desaparece `CYCLE_NAMES`);
   - curso por defecto del catálogo;
   - CE de ESO en el prompt y reglas de la ESO;
   - las CE del PDC ya no pueden coincidir con las de la ESO.
9. `backend/src/services/ai.service.ts`: palabras clave de la ESO para elegir proyectos de referencia.
10. `backend/src/services/translation.service.ts`: el glosario reconoce las selecciones de la ESO y añade el nombre de la materia.
11. `backend/src/tests/eso.test.ts` (nuevo, 21 tests).
12. `frontend/src/app/services/niveles.service.ts` (nuevo) y `app.facade.ts`: carga del catálogo y de las CE de la ESO.
13. `frontend/.../curriculum/`:
    - `curriculum.facade.ts`: `esoCes`, `loadEsoCes`, `activeCes`, cursos válidos y texto de la selección;
    - `utils/eso-grouping.ts` (nuevo) y `utils/curriculum-grouping.ts`: `value` e `ItemInfo.text`;
    - `models/curriculum.model.ts`;
    - plantilla del selector.
14. `frontend/.../generator-view.component.ts`: titulaciones y cursos del catálogo.
15. Titulación «ESO» en historial, perfil y Taller:
    - `projects/models/project.model.ts`, `mappers/projects.mapper.ts` y `services/projects.facade.ts`;
    - `history/utils/history-filter.ts` y `history-view.component.ts`;
    - `personal-view.component.ts` y `export-selection.component.ts`;
    - `taller-view` con el pipe nuevo `projects/pipes/course-level-key.pipe.ts`;
    - `translations.{es,ca}.ts` (`courseLevelESO`).
16. Specs nuevas o ampliadas:
    - nuevas: niveles, agrupado de la ESO y pipe;
    - ampliadas: fachadas curricular, de proyectos y de la app, generador, selector, filtro de historial y perfil.
17. `documentation/niveles_educativos_y_catalogo.md` (nuevo) y `.agents/skills/agregar-fp/references/checklist_archivos.md`: el registro de un ciclo nuevo pasa por el catálogo.
18. `Proyecto_FPB_PAI/ESO/Decret ordenació i currículum ESO (ca).pdf`: versión catalana oficial, descargada de la web LOMLOE de la CAIB (carpeta fuera de git).

## Decisiones técnicas

- **Identificador `ESO_ORDINARIA`.** `ESO` ya se usaba en el frontend como alias heredado del PDC. Se comprobó en producción (solo lectura) que no hay proyectos con `tipoNivel: 'ESO'`.
- **Extracción determinista, sin IA.** Con validaciones automáticas:
  - paridad ES/CA de CE e ids de criterio;
  - numeración consecutiva;
  - longitudes acotadas;
  - **cada uno de los 6652 textos aparece literalmente en el decreto de su idioma**.

  Esto detectó y corrigió criterios con «CA 5.1.» (con punto) y bloques absorbidos en materias sin «Saberes básicos». Erratas del BOIB tratadas expresamente:
  - «CA 2.» sin número en Entornos Digitales (castellano);
  - «Segon curs» frente a «Curso segundo y tercero» en Plástica;
  - salto 2.1 → 2.3 en Igualdad de Género, que se conserva porque es oficial.
- **Materias con niveles separados.** Cultura Clásica I/II, Matemáticas A/B y Recursos Digitales I/II van como materias distintas. Se excluyen los talleres de Matemáticas y Lingüístico (currículo de centro) y Religión.
- **Selección «Materia · CEn. Descripción».** Matemáticas A y B (4.º) y Cultura Clásica I y II (2.º) tienen CE con el mismo texto. Ese valor es único, legible en el historial y en el glosario de traducción, y no obliga a cambiar el modelo de selección por texto de FP y PDC.
- **Tipos de materia.** Se distinguen «De opción» (materias a elegir del currículo común: las de 4.º y Plástica/Música en 3.º) y «Optativa»; las comunes no se marcan.
- **Fuera de este plan.** Se mantienen algunos niveles fijos en el frontend: pestañas del historial, `cursosValidos` y mapa. Están documentados en `documentation/niveles_educativos_y_catalogo.md` para migrarlos en tareas posteriores.

## Verificación

- **Backend:**
  - `npm test`: 23 archivos y 271 tests en verde;
  - `npm run test:cov`: 98,56 % de sentencias y 93,37 % de ramas;
  - `npx vitest run src/tests/eso.test.ts`: 21 tests.
  - `npx tsc --noEmit` del backend ya fallaba antes de la tarea (332 errores de configuración ESM en `src/`, con `git stash`), así que no sirve como verificación. El backend se ejecuta con `tsx`.
- **Frontend:**
  - `npx eslint src/app`: sin hallazgos;
  - `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores;
  - `npm test`: 53 archivos y 740 tests; cobertura global 99,23 % y por archivo cumplida; comprobación zoneless correcta.
- **Docker local:**
  - las migraciones 22 y 23 dejaron 189 CE de ESO y 65 del PDC;
  - revisión con Playwright del generador: ESO con 1.º-4.º, materias comunes de 2.º, y 4.º en catalán con las materias «D'opció»;
  - al seleccionar la CE1 de Matemàtiques B no se marca la de Matemàtiques A, y el carrito muestra la materia correcta.
- **Pendiente:** no se lanzó una generación real con IA en local. El prompt se verifica con los tests de `eso.test.ts`; queda generar un proyecto real en producción tras el despliegue.

## Desviaciones respecto al plan

- **`knowledge_base.md`:** no se modifica. Se inyecta en todos los prompts, también los de FP; las reglas de la ESO van en `buildEsoInstruction` y solo se aplican a la ESO.
- **Edad:** solo se define para la ESO ordinaria, en el catálogo. En FP y PDC la normativa no fija una edad ordinaria y se evita cambiar sus prompts actuales.
- **Valor de selección «Materia · CEn.»:** no estaba previsto en el plan. Hizo falta al ver que en un mismo curso hay CE de texto idéntico en materias distintas.
- **Pipe `courseLevelKey`:** nuevo para la vista Taller, que solo distinguía PDC y FP y ya supera el límite de tamaño de componente.
- **Nombre del decreto sustituido:** el Decreto 42/2025 sustituye al 32/2022, no al 107/2022 como decía el plan. El plan está corregido.

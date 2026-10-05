# Plan 001: ESO ordinaria (1.º-4.º) y catálogo de niveles educativos

> **Fecha:** 5 de octubre de 2026
> **Estado:** Implementado (tarea 197)
> **Partes afectadas:** backend / frontend / migraciones / despliegue

---

## 1. Objetivo

Añadir el nivel **ESO** (la ESO ordinaria, distinta de la ESO de Diversificación Curricular que ya existe) con sus cuatro cursos y sus **competencias específicas (CE) y criterios de evaluación** oficiales. La generación de proyectos tiene que adaptarse a la **edad del alumnado** de cada curso y usar la terminología LOMLOE: situación de aprendizaje, CE, criterios, saberes básicos y perfil de salida.

Al mismo tiempo se da un primer paso para que añadir un nivel nuevo (todos los ciclos FP de Baleares y, más adelante, los de toda España) consista en **cargar datos y registrar el nivel en un catálogo**, y no en tocar 15 archivos con `if (tipoNivel === …)`.

## 2. Marco normativo (fuentes oficiales)

| Norma | Uso en la app |
|---|---|
| **LOMLOE**: Ley Orgánica 3/2020, que modifica la LOE 2/2006 | Marco: competencias clave, perfil de salida y situaciones de aprendizaje. |
| **Real Decreto 217/2022**, de 29 de marzo: enseñanzas mínimas de la ESO | Referencia estatal; servirá para otras comunidades. |
| **Decreto 42/2025**, de 1 de agosto (BOIB n.º 103, de 4/8/2025): ordenación y currículo de la ESO en las Illes Balears | **Fuente principal.** Ya está en `Proyecto_FPB_PAI/ESO/Decreto ordenación y currículo ESO.pdf` (452 págs., versión castellana). Sustituye al Decreto 32/2022. |

Lo que importa del Decreto 42/2025:

- **Art. 11.** Materias de 1.º a 3.º:
  - **Comunes** de 1.º: Biología y Geología, Educación Física, Geografía e Historia, Lengua Castellana y Literatura, Lengua Catalana y Literatura, Lengua Extranjera, Música y Matemáticas.
  - **Comunes** de 2.º: entran Educación Plástica, Visual y Audiovisual, Física y Química y Tecnología y Digitalización; salen Biología y Geología y Música.
  - **Comunes** de 3.º: Biología y Geología, Educación Física, Física y Química, Geografía e Historia, las dos lenguas, Lengua Extranjera, Matemáticas, Tecnología y Digitalización, y Educación Plástica o Música a elegir.
  - **Optativas** de cada curso: Igualdad de Género, Entornos Digitales y Multimedia, Recursos Digitales I/II, Cultura Clásica I/II, Segunda Lengua Extranjera, Cooperación y Servicios a la Comunidad, Introducción a la Filosofía, Taller de Finanzas y Consumo Responsable, Introducción a las Técnicas Experimentales…
  - Permite **ámbitos** (Científico-Tecnológico y Sociolingüístico) en 1.º-3.º.
- **Art. 13.** Materias de 4.º:
  - **Comunes:** Educación en Valores Cívicos y Éticos, Educación Física, Geografía e Historia, las dos lenguas, Lengua Extranjera, y Matemáticas A o B.
  - **Tres a elegir** entre Biología y Geología, Digitalización, Economía y Emprendimiento, Expresión Artística, Física y Química, FOPP, Latín, Música, Segunda Lengua Extranjera y Tecnología.
- **Art. 10 y Anexo 2.** CE, criterios de evaluación (con aclaraciones orientativas) y saberes básicos de cada materia. **Los criterios se agrupan por bloques de cursos que cambian según la materia**: «Primer y tercer curso», «Cursos primero y segundo», «Cuarto curso», uno por curso… El modelo de datos tiene que permitir que un criterio se aplique a varios cursos.
- **Anexo 1.** Competencias clave y descriptores del perfil de salida, que cada CE enlaza (por ejemplo, STEM1, CD1, CCEC1).
- **Taller de Matemáticas y Taller Lingüístico** no tienen currículo oficial: lo diseña cada centro (art. 12). Se excluyen.

**Edad del alumnado:** 1.º, 12-13 años; 2.º, 13-14; 3.º, 14-15; 4.º, 15-16. La edad ordinaria de escolarización llega hasta los 18 en la ESO, por repeticiones.

**Catalán:** hace falta la **versión catalana del BOIB** del Decreto 42/2025. En el repo solo están en catalán 8 materias (`Proyecto_FPB_PAI/ESO/Curriculum Area */2025_ESO_Curriculum_*.pdf`). Según AGENTS.md §8, no vale traducir a máquina ni usar copias en un solo idioma: el resto se descarga de CAIB/BOIB.

## 3. Escenarios

- **Escenario: el generador ofrece ESO con cuatro cursos**
  - **Dado** un docente en «Nuevo proyecto»
  - **Cuando** elige «ESO» en el desplegable de titulación
  - **Entonces** aparecen los botones 1.º, 2.º, 3.º y 4.º, con 1.º marcado por defecto, y «ESO (PDC)» sigue con solo 3.º y 4.º.
- **Escenario: las materias dependen del curso**
  - **Dado** ESO y 2.º curso
  - **Cuando** se carga el selector curricular
  - **Entonces** aparecen las materias comunes y optativas de 2.º (incluidas Física y Química y Tecnología y Digitalización; no Biología y Geología), cada una con sus CE.
- **Escenario: solo los criterios del curso**
  - **Dada** la CE 1 de Biología y Geología en 3.º
  - **Cuando** se genera el proyecto
  - **Entonces** el prompt incluye solo los criterios del bloque «Primer y tercer curso», nunca los de 4.º.
- **Escenario: la edad entra en el prompt**
  - **Dado** un proyecto de ESO de 1.º
  - **Cuando** se construye el prompt
  - **Entonces** indica «alumnado de 12-13 años» e incluye las pautas de esa edad: lenguaje, autonomía, duración de las tareas y andamiaje.
- **Escenario: terminología LOMLOE**
  - **Dado** un proyecto de ESO
  - **Cuando** se genera
  - **Entonces** el prompt pide «Situación de aprendizaje», CE, criterios, saberes básicos y descriptores del perfil de salida, y prohíbe «Resultados de Aprendizaje» y «módulo profesional».
- **Escenario: la ESO y el PDC no se mezclan**
  - **Dada** una CE con el mismo texto en ESO y en PDC
  - **Cuando** se genera un proyecto de ESO
  - **Entonces** se usan la CE y los criterios de la ESO, no los del PDC.
- **Escenario: paridad ES/CA**
  - **Dado** el idioma catalán
  - **Cuando** se carga cualquier materia de ESO
  - **Entonces** materia, CE y criterios están en catalán oficial, con el mismo número de CE y criterios que en castellano.
- **Escenario: historial y filtros**
  - **Dados** proyectos de ESO y de PDC
  - **Cuando** se abre el historial
  - **Entonces** cada uno aparece en su propia titulación, y los proyectos antiguos de PDC siguen donde estaban.
- **Escenario: el catálogo es la fuente única**
  - **Dado** el catálogo de niveles del backend
  - **Cuando** el frontend pide `GET /api/niveles`
  - **Entonces** recibe nombres ES/CA, cursos, edades y tipo de unidad curricular (RA o CE), y el desplegable del generador se construye con esos datos.

## 4. Alternativas

**A. Identificador interno del nivel**
- `ESO`: ya existe en el frontend como valor heredado que se trata como PDC (`getHistoryTabForTipoNivel`, `history-filter.ts`). Si se reutiliza, los proyectos antiguos podrían cambiar de pestaña.
- **`ESO_ORDINARIA` (recomendada):** sin ambigüedad. El nombre que se ve sigue siendo «ESO». Antes de implementar se comprobará en producción si queda algún proyecto con `tipoNivel: 'ESO'`.

**B. Dónde guardar las CE de la ESO**
- Ampliar la colección `CE` actual con `tipoNivel`, `subjectCode`, `cursos` y criterios con sus cursos: no hace falta un modelo nuevo y el PDC se adapta con un *backfill*.
- Colección nueva `Competencia`: más limpia, pero duplica endpoints y lógica.
- **Recomendada: ampliar `CE`.** Se añaden `tipoNivel` y la estructura nueva, y una migración marca los 65 CE existentes como `DIVERSIFICACION_CURRICULAR`.

**C. Cómo extraer el currículo de los PDF**
- Con un LLM, como hacía `backend/scripts/extractESO.ts`: rápido, pero puede inventar o resumir texto oficial.
- **Recomendada: parser determinista** del texto del BOIB (`pypdf`): CE n → CA n.m → bloques de cursos. Después, validación automática (CE y criterios consecutivos, mismo número en ES y CA) y revisión por muestreo. El resultado se guarda en JSON en `backend/src/data/curriculo-eso/` y lo carga una migración (AGENTS.md §8: nada de semillas grandes en el bundle).

**D. Escalabilidad (catálogo de niveles)**
- Seguir añadiendo `case` en cada archivo: cada ciclo FP nuevo toca unos 15 archivos (los he contado con `grep CFGS_EDUCACION_INFANTIL`).
- Rehacerlo todo ahora con un modelo genérico de titulaciones: demasiado riesgo junto con la ESO.
- **Recomendada: catálogo incremental.** `backend/src/data/niveles.ts` será la fuente única, como `ai-models.ts` para los modelos. Cada nivel define:
  - `id`, `etapa` (`ESO` | `FPB` | `CFGM` | `CFGS`), `familia` y `codigoTitulo`;
  - `comunidad` (`IB` | `estatal`), nombre ES/CA y `unidad` (`RA` | `CE`);
  - `cursos` con su `edad`, y `terminologia` (proyecto intermodular o situación de aprendizaje).

  Se sirve en `GET /api/niveles`. En este plan lo usan el generador, el historial, el enum de `Project` (validado contra el catálogo) y `describeTargetCourse`. El resto de `switch` se migra en planes posteriores.

**E. Materias de ESO incluidas**
- **Recomendado:** todas las del Anexo 2 con currículo oficial (comunes y optativas), salvo Taller de Matemáticas, Taller Lingüístico y Religión.
- Lengua Extranjera y Segunda Lengua Extranjera: el Anexo 2 las trata como una sola materia por idioma, con apartados de francés y alemán. Se cargan como «Lengua Extranjera» genérica.

## 5. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/niveles.ts` (nuevo) | Catálogo de niveles: ids, nombres ES/CA, etapa, cursos con edad, unidad RA/CE y terminología | domain |
| `backend/src/routes/curriculum.routes.ts` y `controllers/curriculum.controller.ts` | `GET /api/niveles`; `GET /api/ces?tipoNivel=&curso=` filtra por nivel y curso y devuelve materias ES/CA | presentation |
| `backend/src/models/CE.ts` | Nuevos campos `tipoNivel`, `subjectCode`, `subject_es/ca`, `cursos[]` y `criterios[]`, cada criterio con `{ id, cursos, text_es, text_ca }`; se mantiene la compatibilidad con el PDC | domain |
| `backend/src/models/Project.ts` | `tipoNivel` se valida contra el catálogo, no con un `enum` fijo | domain |
| `backend/src/data/curriculo-eso/*.json` (nuevo) | CE y criterios de la ESO por materia, ES y CA | infrastructure |
| `backend/src/migrations/22_ce_tipo_nivel_pdc.ts` | *Backfill*: `tipoNivel: 'DIVERSIFICACION_CURRICULAR'` en los CE existentes | migraciones |
| `backend/src/migrations/23_ingest_ces_eso_ordinaria.ts` | Carga idempotente de los JSON de ESO, borrando y reinsertando solo `tipoNivel: 'ESO_ORDINARIA'` | migraciones |
| `backend/src/controllers/project.controller.ts` | Busca los CE filtrando por `tipoNivel`; filtra criterios por `cursos`; `describeTargetCourse` y la edad salen del catálogo; nuevo bloque de reglas ESO (terminología, edad, perfil de salida, evaluación formativa). Se extraen helpers para respetar las 25 líneas por función | application |
| `backend/src/services/ai.service.ts` | `LEVEL_KEYWORDS` para `ESO_ORDINARIA` (proyectos de referencia) | application |
| `backend/knowledge_base.md` | Resumen de la normativa ESO de Baleares y pautas por edad | config |
| `backend/scripts/` → espacio temporal | Parser del BOIB (script de un solo uso, que se borra al terminar) | — |
| `frontend/src/app/features/curriculum/utils/curriculum-grouping.ts` | `TipoNivel` incluye `ESO_ORDINARIA`; `groupCes` agrupa por materia | frontend |
| `frontend/src/app/features/curriculum/services/curriculum.facade.ts` | Cursos válidos y curso por defecto según el catálogo; carga los CE por nivel y curso | frontend |
| `frontend/src/app/services/niveles.service.ts` (nuevo) | Carga `GET /api/niveles` y expone signals | frontend |
| `frontend/.../generator-view.component.ts` | `levelOptions` y `courseOptions` salen del catálogo, no de listas fijas | frontend |
| `frontend/.../projects/models/project.model.ts`, `history/utils/history-filter.ts`, `history-view.component.ts`, `personal-view.component.ts`, `projects.mapper.ts`, `export-selection.component.ts` | Nueva titulación «ESO», separada de «ESO (PDC)» | frontend |
| `frontend/src/app/services/translations.{es,ca}.ts` | `courseLevelESO`: «ESO» / «ESO» | frontend |
| `documentation/niveles_educativos_y_catalogo.md` (nuevo) | Cómo se añade un nivel: datos, catálogo y migración | docs |
| `.agents/skills/agregar-fp/` | Referencia al catálogo como punto de registro de ciclos nuevos | docs |

## 6. Tareas

- [ ] Rama `feature/006_eso_ordinaria` desde la rama actual.
- [ ] Comprobar en producción (solo lectura) si hay proyectos con `tipoNivel: 'ESO'` y cuántos CE hay.
- [ ] Descargar la versión catalana del Decreto 42/2025 (BOIB) y guardarla junto a la castellana.
- [ ] Parser determinista del Anexo 2 (ES y CA) → `backend/src/data/curriculo-eso/<materia>.json`; validar el número de CE y criterios y los cursos de cada criterio. Revisar a mano al menos 3 materias completas.
- [ ] Catálogo `niveles.ts` y `GET /api/niveles`, con tests.
- [ ] Ampliar `CE`, migraciones 22 y 23, y tests de migración (idempotencia y que no se toque el PDC).
- [ ] `getCes` filtrado por nivel y curso, con tests.
- [ ] Prompt de ESO: edad, terminología, perfil de salida y criterios por curso. Tests de los escenarios 3-6.
- [ ] Frontend: servicio de niveles, generador, fachada curricular, historial, perfil y exportación, con specs.
- [ ] Traducciones ES/CA y documentación (`documentation/` y `knowledge_base.md`).
- [ ] Lint y typecheck; `npm test` en backend y frontend.
- [ ] Commit, push y `./scripts/deploy-prod.sh`; comprobar las migraciones 22 y 23 en el EC2 y `GET /api/ces?tipoNivel=ESO_ORDINARIA&curso=1º`.
- [ ] Generar un proyecto real de 1.º y otro de 4.º y revisar la edad, la terminología y los criterios.
- [ ] `/registrar-tarea`.

**Fuera de este plan** (planes posteriores para escalar):

1. Migrar los `switch` restantes (`isFPProject`, `CYCLE_NAMES`, `LEVEL_KEYWORDS`, `MAPA_TABS`…) al catálogo.
2. Retirar del bundle los RA de respaldo del frontend (`frontend/.../curriculum/data/ras_*.data.ts`). Con todos los FP de Baleares harían crecer el bundle y aumentarían el riesgo de OOM al compilar en el EC2. Mongo pasa a ser la única fuente.
3. Hacer que el frontend envíe **ids** de RA/CE en vez de su texto, para evitar colisiones entre niveles.
4. Ingesta genérica de ciclos FP desde TodoFP/BOE y CAIB, con la skill `agregar-fp` simplificada a «JSON + entrada en el catálogo».
5. Campo `comunidad` en el centro o el usuario, para servir currículos estatales o de otras comunidades.
6. Mapa intermodular de ESO, si se quiere.

## 7. Riesgos y verificación prevista

- **Fidelidad del currículo:** el riesgo principal. Se mitiga con el parser determinista, las validaciones de recuento y la revisión manual. Si la versión catalana del BOIB no tiene la misma estructura, se para y se consulta.
- **Paridad ES/CA:** test que recorre todos los JSON y exige el mismo número de CE y criterios, y textos no vacíos en ambos idiomas.
- **Datos y migraciones:** la 23 borra y reinserta solo `tipoNivel: 'ESO_ORDINARIA'`; la 22 solo rellena `tipoNivel` donde falta. Antes se hace copia de seguridad (`deploy-prod.sh`). Son migraciones nuevas y no sobrescriben datos ajenos, así que no hace falta aviso especial.
- **PDC:** tests de regresión que confirmen que los proyectos y CE del PDC (3.º/4.º) se comportan igual que hoy.
- **Tamaño del prompt:** con muchas materias el prompt crece. Se envían solo los CE seleccionados y los criterios del curso, y se comprueba la longitud con el log `[Prompt]` existente.
- **Cobertura:** 90 % global y por archivo en el frontend, y 80 % de funciones en `.html`; 90 % en el backend.
- **Límites de código:** `project.controller.ts` ya es largo. El bloque de ESO va en helpers (`buildEsoRules`, `describeAudience`) de menos de 25 líneas, y ningún componente pasa de 200 líneas.
- **Zoneless:** el servicio de niveles expone signals; las specs usan `await fixture.whenStable()`.
- **Verificación:** ESLint, `ngc` y `tsc` del spec; `npm test` en `backend/` y `frontend/`; Playwright en el generador (ESO, cuatro cursos, catalán) y en el historial; generación real tras el despliegue.

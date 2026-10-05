# Niveles educativos y catálogo de niveles

## Catálogo único

`backend/src/data/niveles.ts` es la fuente única de los niveles educativos (titulaciones). Cada entrada define:

| Campo | Uso |
|---|---|
| `id` | Valor de `tipoNivel` en proyectos, RA y CE (`FP_BASICA`, `CFGM_ESTETICA`, `ESO_ORDINARIA`…). |
| `etapa` | `FPB`, `CFGM`, `CFGS` o `ESO`. |
| `comunidad` | Currículo aplicado: `IB` (Illes Balears) o `estatal`. |
| `nombre_es` / `nombre_ca` | Nombre oficial en el desplegable del generador y en el prompt. |
| `unidad` | `RA` (FP) o `CE` (ESO): qué se selecciona al crear un proyecto. |
| `terminologia` | `proyecto_intermodular` o `situacion_aprendizaje`. |
| `cursos` | Cursos del nivel; el primero es el de por defecto. `edad` es opcional y llega al prompt. |

Quién lo usa:
- `GET /api/niveles` lo sirve al frontend.
- `NivelesService` (frontend) construye con él el desplegable de titulación y los botones de curso del generador.
- `Project.tipoNivel` se valida contra `NIVEL_IDS`.
- `describeTargetCourse` toma de él el nombre de los ciclos.
- `generateProject` toma de él el curso por defecto.

Otros puntos del frontend todavía tienen niveles fijos: pestañas del historial, filtros de «Mis proyectos», `getHistoryTabForTipoNivel`, `TipoNivel`, `cursosValidos` en `CurriculumFacade` y el mapa intermodular. Al añadir un nivel hay que revisarlos (`grep -rn "CFGS_EDUCACION_INFANTIL" frontend/src`). Se irán pasando al catálogo en tareas posteriores.

## Cómo añadir un nivel

1. Añadir la entrada en `backend/src/data/niveles.ts`.
2. Cargar sus datos curriculares en MongoDB con una migración nueva (`backend/src/migrations/NN_*.ts`), a partir de JSON en `backend/src/data/` (nunca como semillas en el bundle del frontend).
3. Ciclos FP: seguir la skill `agregar-fp`, que además cubre mapa intermodular, traducciones y tests.
4. Revisar los puntos con niveles fijos del apartado anterior y añadir el nombre a `translations.{es,ca}.ts` (`courseLevel…`).

## ESO ordinaria (`ESO_ORDINARIA`)

### Fuente normativa

- **LOMLOE** (LO 3/2020) y **RD 217/2022** (enseñanzas mínimas).
- **Decreto 42/2025**, de 1 de agosto, de ordenación y currículo de la ESO en las Illes Balears (BOIB n.º 103, de 4/8/2025), que sustituye al Decreto 32/2022. Artículos 11 y 13 para materias por curso; anexo 2 para CE, criterios y saberes.
- Versiones oficiales en `Proyecto_FPB_PAI/ESO/` (fuera de git):
  - `Decreto ordenación y currículo ESO.pdf` (castellano);
  - `Decret ordenació i currículum ESO (ca).pdf` (catalán, descargado de la web LOMLOE de la CAIB).

### Datos

`backend/src/data/curriculo-eso/<materia>.json` contiene un archivo por materia (31):

- `code`, `name_es`, `name_ca`.
- `cursos`: tipo de la materia en cada curso. `comun`; `opcion` (a elegir dentro del currículo común: las de 4.º y Plástica/Música en 3.º); `optativa`.
- `competencias[]`: `ce_id`, `ce_num`, `description_es/ca` y `descriptores` (perfil de salida, anexo 1).
- `criterios[]` de cada competencia: `id`, `cursos`, `text_es/ca` y `aclaraciones_es/ca`.

Decisiones:

- **Criterios con varios cursos.** Los criterios se agrupan por bloques de cursos distintos en cada materia: «Primer y tercer curso», «Cursos primero y segundo», «De primero a tercero», uno por curso… Por eso cada criterio guarda la lista de cursos en los que se aplica.
- **Materias con niveles separados.** Cultura Clásica I/II, Matemáticas A/B (4.º) y Recursos Digitales I/II son materias distintas. Recursos Digitales I y II comparten el mismo bloque de criterios del decreto.
- **Excluidas:** Taller de Matemáticas y Taller Lingüístico (su currículo lo diseña cada centro, art. 12) y Religión.
- **Lengua Extranjera y Segunda Lengua Extranjera** se cargan como materias genéricas: sus CE y criterios no dependen del idioma.

### Extracción

Se extrajeron con un parser determinista del texto del BOIB, sin IA, y con estas validaciones:

- **Paridad ES/CA:** mismas CE y criterios en el mismo orden.
- **Numeración:** criterios consecutivos en cada CE.
- **Texto literal:** cada texto aparece tal cual en el decreto de su idioma.
- **Sin absorciones:** ningún criterio absorbe otro bloque.

Erratas del BOIB tratadas expresamente:
- **Entornos Digitales y Multimedia (castellano):** «CA 2.» sin número; es el 2.2.
- **Educación Plástica:** el catalán pone «Segon curs» y el castellano «Curso segundo y tercero». Se aplica a 2.º y 3.º, como el art. 11.
- **Igualdad de Género:** el decreto salta del 2.1 al 2.3 en los dos idiomas. Se conserva la numeración oficial.

La migración `23_ingest_ces_eso_ordinaria` carga los JSON en la colección `ces` con `tipoNivel: 'ESO_ORDINARIA'`. Solo reemplaza esas CE, así que es idempotente. La `22_ce_tipo_nivel_pdc` marca las 65 CE previas como `DIVERSIFICACION_CURRICULAR`.

### API y selección

- `GET /api/ces?tipoNivel=ESO_ORDINARIA&curso=2º&lang=catalan` devuelve las CE de las materias del curso, solo con los criterios de ese curso. Van ordenadas por tipo (comunes, de opción y optativas), materia y número. Sin `tipoNivel` devuelve las del PDC, como antes.
- El valor seleccionado de una CE de ESO es «Materia · CEn. Descripción» (`esoSelection`). Hace falta porque algunas materias del mismo curso tienen CE con el mismo texto (Matemáticas A y B, Cultura Clásica I y II). Ese valor se guarda en `project.ras`. `findEsoCe` lo resuelve en cualquiera de los dos idiomas y el glosario de traducción también lo reconoce.
- En el selector curricular, las materias de opción y las optativas se marcan en la cabecera del grupo («· De opción», «· Optativa»).

### Prompt

`buildEsoInstruction` (`backend/src/services/eso-curriculum.service.ts`) añade a las instrucciones de los proyectos de ESO estas reglas:
- **Terminología:** situación de aprendizaje, CE, criterios y saberes básicos; nunca RA ni módulo profesional.
- **Edad del alumnado** del curso, según el catálogo: 12-13, 13-14, 14-15 y 15-16 años. Se pide adaptar vocabulario, autonomía, duración de las tareas y andamiaje.
- **Perfil de salida.**
- **Evaluación formativa y formadora.**
- **DUA.**
- **Producto final** en un contexto cercano al alumnado.

Cada CE seleccionada se describe con su materia, su número oficial, sus descriptores y los criterios del curso. Las reglas no se aplican a los proyectos del PDC ni de FP.

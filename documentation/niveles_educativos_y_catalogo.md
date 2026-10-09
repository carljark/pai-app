# Niveles educativos y catálogo de niveles

## Catálogo único

`backend/src/data/niveles.ts` es la fuente única de los niveles educativos (titulaciones). Cada entrada define:

| Campo | Uso |
|---|---|
| `id` | Valor de `tipoNivel` en proyectos, RA y CE (`FP_BASICA`, `CFGM_ESTETICA`, `ESO_ORDINARIA`…). |
| `etapa` | `FPB`, `CFGM`, `CFGS` o `ESO`. El frontend la muestra como sigla («CFGB» para la FPB) en el mapa. |
| `comunidad` | Currículo aplicado: `IB` (Illes Balears) o `estatal`. |
| `nombre_es` / `nombre_ca` | Nombre oficial: desplegable del generador, pestañas del historial, filtros, tarjetas de proyecto, exportación y mapa. |
| `nombrePrompt_es` / `nombrePrompt_ca` | Opcional. Nombre del nivel en el prompt («2º de …»); si falta, se usa el nombre oficial. |
| `palabrasClave` | Opcional. Familia profesional o etapa para elegir los ejemplos INTEF del prompt (`LEVEL_KEYWORDS`). |
| `unidad` | `RA` (FP) o `CE` (ESO): qué se selecciona al crear un proyecto. |
| `terminologia` | `proyecto_intermodular` o `situacion_aprendizaje`. |
| `cursos` | Cursos del nivel; el primero es el de por defecto. `edad` es opcional y llega al prompt. `modulos` (FP) son los códigos de los módulos del curso en su orden oficial: filtran y ordenan el selector curricular y los módulos del proyecto generado. |
| `mapas` | Pestañas del mapa intermodular del nivel: `tab` (id histórico de `MapaModule.tab`), `curso` (sin curso, el mapa abarca todo el ciclo) y la selección inicial (`moduleCode`, `raId`). |

### Backend

- `GET /api/niveles` sirve el catálogo al frontend.
- `Project.tipoNivel` y `RA.tipoNivel` se validan contra `NIVEL_IDS`; `DEFAULT_TIPO_NIVEL` (`FP_BASICA`) es el nivel de los proyectos y RA antiguos sin `tipoNivel`.
- `MapaModule.tab` y el parámetro `tab` de `GET /api/mapa-intermodular` se validan contra `MAPA_TABS`, derivado de `mapas`. Los ids de pestaña (`FPB`, `CFGM`, `CFGM_PELUQUERIA_2`…) se conservan para no migrar datos.
- `describeTargetCourse` describe el curso destino con `nombrePrompt` (o el nombre oficial) en el idioma del proyecto; `LEVEL_KEYWORDS` sale de `palabrasClave`.
- Las reglas propias de un nivel (Carpeta de Aprendizaje de FP Básica, instrucciones de la ESO) son lógica con nombre propio en el backend, no datos del catálogo.
- `backend/src/tests/niveles-catalogo.test.ts` comprueba que los `modulos` cubren exactamente los RA de cada ciclo y que todos los `tipoNivel` y `tab` de datos y migraciones están en el catálogo.

### Frontend

`NivelesService` carga el catálogo al iniciar sesión (junto a los RA) y ofrece `find`, `nombreDe`, `cursos`, `cursoPorDefecto`, `modulos`, `usaRa`, `nivelPorDefecto`, `mapaTabs`, `mapaTab` y `sigla`. De él salen:

- el desplegable de titulación y los cursos del generador;
- los módulos de cada curso y su orden (`CurriculumFacade`); al cargar el catálogo, un nivel o curso guardado en `localStorage` que ya no existe pasa al nivel por defecto o al primer curso;
- las pestañas del historial (una por nivel, con el `tipoNivel` como id) y los filtros de «Mis proyectos»;
- el nombre del nivel en tarjetas de inicio, «Mis proyectos», Taller (pipe `nivelNombre`) y exportación;
- el selector de ciclo y curso del mapa, su selección inicial, el título y los textos con la sigla de la etapa.

`normalizeTipoNivel` (modelo de proyectos) trata los valores antiguos: vacío → `FP_BASICA` y `ESO` → `DIVERSIFICACION_CURRICULAR`. Si el catálogo no carga, el historial muestra un aviso (`levelsLoadError`).

Los RA solo están en MongoDB (`GET /api/ras`): el frontend ya no incluye RA de respaldo (`curriculum/data/ras_*.data.ts`, unos 600 KB). Si la API falla, el selector curricular queda vacío, como ya pasaba con la ESO.

## Cómo añadir un nivel

1. Añadir la entrada en `backend/src/data/niveles.ts`: nombres oficiales ES/CA, cursos (con `modulos` en FP) y `mapas` si tiene mapa intermodular.
2. Cargar sus datos curriculares en MongoDB con una migración nueva (`backend/src/migrations/NN_*.ts`), a partir de datos en `backend/src/data/` (nunca como semillas en el bundle del frontend).
3. Ciclos FP o niveles de ESO: seguir la skill `agregar-ciclo-educativo` (RA bilingües, mapa intermodular y tests).

El frontend no se toca.

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

## Selección de criterios de evaluación (ESO y PDC)

Cada CE de la ESO ordinaria y del PDC se despliega en el selector con sus criterios del curso. El docente puede marcar criterios sueltos o usar «Seleccionar todos los criterios». El proyecto se genera a partir de los criterios elegidos (plan 003).

### Backend (`services/criterios.service.ts`)

- `GET /api/ces` devuelve en cada CE `criteriosDetalle: [{ id, text }]` (`id` oficial, como «1.1») del curso pedido. El PDC admite ahora `curso` (por defecto 3.º).
- Los criterios del PDC siguen en su formato heredado (`ces_eso_bilingual.json`, con el curso dentro del identificador: «3º ESO - 1.1», «1.1 (4º ESO)», «CA 1.1» o «1.1»). `criteriosDeCe` los normaliza al vuelo a `{ id, text }` y filtra por curso; no hay migración de datos.
- `POST /api/projects/generate` acepta `criteriosSeleccionados: [{ ce, ids[] }]`, donde `ce` es el valor con el que se selecciona la CE (el de `selectedRas`). Se rechaza con **400**: una lista mal formada, una CE que no está en `selectedRas`, una CE sin criterios y un id que no existe en esa CE para el curso.
- Sin `criteriosSeleccionados` (peticiones antiguas, FP, CE completas) se usan todos los criterios del curso, como antes.
- Con selección, el bloque de la CE se titula «CRITERIOS DE EVALUACIÓN SELECCIONADOS» con solo esos criterios, y el prompt añade `COBERTURA_CRITERIOS`: todos deben cubrirse y evaluarse con su numeración oficial, y no se incluyen otros de esas CE.
- `Project.criteriosSeleccionados` guarda la elección. El prompt ya se guarda en el proyecto, así que el reintento conserva los criterios.

### Frontend

- `CriteriosFacade` guarda solo las **elecciones parciales** por CE. Una CE seleccionada sin entrada tiene todos sus criterios marcados, así que seleccionar una CE equivale a «seleccionar todos». Marcar un criterio selecciona la CE; desmarcar el último la deselecciona; las entradas de CE deseleccionadas se descartan solas.
- `CeCriteriosListComponent` (`ce-criterios-list`) pinta la lista dentro de cada CE. El carrito muestra «(n/m criterios)».
- La petición solo incluye `criteriosSeleccionados` cuando alguna CE tiene una elección parcial.
- Las CE del PDC se recargan al cambiar de curso (sus criterios dependen de él), igual que las de la ESO ordinaria.

### Contraste con la web de la CAIB (6 de octubre de 2026)

Se descargaron los 53 documentos (PDF y Word) de <https://www.caib.es/sites/lomloe/ca/eso_materies/> y se comprobó que los textos en catalán aparecen literalmente en ellos:
- **ESO ordinaria:** los 922 textos (189 CE y 733 criterios) coinciden.
- **PDC (`ces_eso_bilingual.json`):** 255 de 256 coinciden. La única diferencia es la coma de Física y Química 4.º, criterio 3.1 («interpretar, organitzar»), que el original de la CAIB escribe con punto («interpretar. organitzar»); se mantiene la coma corregida.

No hizo falta ninguna migración de datos. La web de la CAIB devuelve muchos 502, por lo que la descarga necesitó varios reintentos.

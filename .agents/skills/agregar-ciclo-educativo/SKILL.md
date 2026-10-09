---
name: agregar-ciclo-educativo
description: >-
  Procedimiento y guía técnica para incorporar ciclos educativos a la plataforma Plappin con mínima información de entrada (nombre y fuentes oficiales). Cubre dos rutas: ciclos de Formación Profesional (Grado Básico / FP Básica, Grado Medio / CFGM y Grado Superior / CFGS), que se seleccionan por RA, y niveles de la ESO (ampliar o actualizar la ESO ordinaria o añadir otra ESO, p. ej. de otra comunidad o decreto), que se seleccionan por competencias específicas (CE) y criterios por curso. Gestiona la integración end-to-end en backend (catálogo de niveles, datos curriculares bilingües ES/CA extraídos de forma determinista, migraciones), los cursos y la suite de tests con cobertura >= 90%. El mapa NO forma parte de añadir un ciclo (es muy costoso): solo se hace si el usuario lo pide expresamente (mapa intermodular por módulos en FP, con al menos una actividad por conexión; mapa de afinidades por materias en ESO).
---

# Skill: Incorporación de ciclos educativos (FP de Grado Básico, Medio y Superior, y ESO)

Esta skill integra en Plappin, de forma sistemática y bilingüe estricta (castellano / catalán balear), cualquier nivel educativo nuevo de una de estas dos rutas:

| | **Ruta FP** | **Ruta ESO** |
|---|---|---|
| Niveles | FP Básica (FPB), CFGM, CFGS | ESO ordinaria (ampliación o actualización) u otra ESO (otra comunidad o decreto) |
| Unidad curricular | RA con criterios de evaluación (CE) `a), b)…` | Competencias específicas (CE) con criterios de evaluación (CA) `1.1, 1.2…` aplicables a uno o varios cursos |
| Agrupación | Módulos (`moduleCode`), ordenados por curso | Materias (`subjectCode`), comunes, de opción u optativas en cada curso |
| Colección MongoDB | `ras` (modelo `RA`) | `ces` (modelo `CE`) |
| Terminología del prompt | proyecto intermodular | situación de aprendizaje (LOMLOE) |
| Mapa opcional | Mapa intermodular por módulos (`MapaModule`, con actividades) | Mapa de afinidades por materias (`AfinidadEso`, sin actividades) |
| Referencia validada | FP Básica, CFGM Estética, CFGM Peluquería, CFGS Educación Infantil | ESO ordinaria, Decreto 42/2025 (tareas 197, 200 y 202) |

> [!IMPORTANT]
> **El mapa NO forma parte de añadir un ciclo: solo se hace si el usuario lo pide expresamente.** Es con diferencia la parte más costosa. Una petición como «añade el ciclo X» o «incorpora la ESO de Y» **no** incluye el mapa: no lo generes, no prepares su JSON ni su migración y no lo propongas como siguiente paso. Si el usuario lo pide más adelante, se añade sobre el nivel ya incorporado. Un nivel se considera incorporado cuando tiene su entrada en el catálogo, sus datos curriculares bilingües ES/CA en MongoDB y los tests en verde. Los pasos marcados **«solo con mapa»** se aplican únicamente si el usuario pide expresamente el mapa, ahora o más adelante. Sin mapa, la entrada del catálogo no lleva `mapas` y el nivel no aparece en la pantalla del mapa.

> [!IMPORTANT]
> **Regla de Oro Bilingüe (ambas rutas):** NUNCA introduzcas texto en catalán en los campos `_es` ni texto en castellano en los campos `_ca`. Ambos idiomas deben convivir de forma completa, rigurosa y simétrica. Para traducir o revisar la paridad usa el agente `traductor-es-ca` (`.claude/agents/traductor-es-ca.md`).

> [!NOTE]
> **El PDC (`DIVERSIFICACION_CURRICULAR`) queda fuera de esta skill** salvo que el usuario lo pida: usa un formato heredado (`backend/ces_eso_bilingual.json`) y está pendiente de completarse.

---

## 1. Fuentes Oficiales de Referencia

Para cualquier consulta curricular, verificación de RA, CE, criterios o denominaciones normativas oficiales, se debe recurrir a las fuentes gubernamentales:

### 1.1. Ruta FP
1. **Portal FP Illes Balears (CAIB):** [https://www.caib.es/sites/fp/ca/inici/](https://www.caib.es/sites/fp/ca/inici/). Denominaciones oficiales en catalán balear (`_ca`), currículos del BOIB, atribuciones docentes y distribución modular por cursos en las Illes Balears.
2. **TodoFP (Ministerio de Educación, FP y Deportes):** [https://www.todofp.es/inicio.html](https://www.todofp.es/inicio.html). Catálogo Nacional de Títulos, Reales Decretos del BOE, denominaciones en castellano (`_es`), RA y criterios estatales y códigos de módulo.

### 1.2. Ruta ESO
1. **Normativa estatal:** LOMLOE (LO 3/2020) y **RD 217/2022** de enseñanzas mínimas (BOE). Sirve de referencia común; los textos que se cargan son los del currículo autonómico.
2. **Currículo autonómico de las Illes Balears:** **Decreto 42/2025**, de 1 de agosto (BOIB n.º 103, de 4/8/2025), que sustituye al Decreto 32/2022. Artículos 11 y 13 para materias por curso; anexo 1 para el perfil de salida (descriptores); anexo 2 para CE, criterios y saberes básicos.
3. **Web LOMLOE de la CAIB:** [https://www.caib.es/sites/lomloe/ca/eso_materies/](https://www.caib.es/sites/lomloe/ca/eso_materies/). Documentos por materia en catalán (PDF y Word) para contrastar los textos `_ca`.
4. **Otra comunidad:** su decreto de currículo de la ESO en su boletín oficial, en castellano y, si la tiene, en su lengua cooficial. Si no hay versión oficial en catalán, no copiar el castellano en `_ca`: pararse y avisar.
5. Las versiones oficiales de la ESO de Baleares están en `Proyecto_FPB_PAI/ESO/` (fuera de git).

---

## 2. Información Mínima Requerida

### 2.1. Ruta FP
1. **Nivel del ciclo:**
   - **Grado Básico (FP Básica / FPB):** `tipoNivel = 'FP_BASICA'` (o subtipos específicos).
   - **Grado Medio (CFGM):** `tipoNivel = 'CFGM_<SLUG_MAYUSCULAS>'` (ej. `CFGM_PELUQUERIA`, `CFGM_ESTETICA`, `CFGM_COCINA`).
   - **Grado Superior (CFGS):** `tipoNivel = 'CFGS_<SLUG_MAYUSCULAS>'` y `etapa: 'CFGS'` (ej. `CFGS_EDUCACION_INFANTIL`).
2. **Denominaciones oficiales:** en castellano, la estatal del BOE / TodoFP (ej. *"Peluquería y Cosmética Capilar"*); en catalán, la autonómica de FP Illes Balears / CAIB (ej. *"Perruqueria i Cosmètica Capil·lar"*).
3. **Identificador / Slug:** palabra clave corta en minúsculas (ej. `peluqueria`, `cocina`).
4. **Fuentes curriculares:** una carpeta del ciclo (ej. `add_mid_grades/Grado medio <nombre>/` o `FPB/`) o los documentos oficiales de BOE/TodoFP (castellano) y BOIB/CAIB (catalán), con los RA y criterios en ambos idiomas. **Solo con mapa:** los archivos pareados `mapa_intermodular_*_ES_*.md` y `mapa_intermodular_*_CA_*.md`.
5. **Distribución por cursos y módulos:** códigos de módulo y su orden por curso en Illes Balears (portal de FP de la CAIB).

### 2.2. Ruta ESO
1. **Qué se incorpora**, porque determina la ruta (ver Paso E0):
   - **Ampliar o actualizar la ESO ordinaria** (`ESO_ORDINARIA`): materias nuevas o antes excluidas, corrección de textos o un decreto nuevo de Baleares que la sustituya.
   - **Otra ESO**, como otra comunidad, el currículo estatal o una variante con currículo propio: `tipoNivel = 'ESO_<SUFIJO>'` (ej. `ESO_ESTATAL`).
2. **Decreto de currículo** en castellano y en catalán, con sus anexos de CE, criterios y descriptores del perfil de salida.
3. **Materias por curso** y su tipo en cada curso (`comun`, `opcion` u `optativa`), según los artículos de organización del decreto.
4. **Edad ordinaria por curso** (12-13, 13-14, 14-15 y 15-16 años en la ESO).
5. **Exclusiones:** materias cuyo currículo diseña el centro (en Baleares, Taller de Matemáticas y Taller Lingüístico, art. 12) y Religión.

---

## 3. Ruta FP: Flujo de Ejecución Paso a Paso

### Paso 1: Andamiaje Inicial (Scaffold)
Ejecutar el script asistente para generar los archivos base y calcular automáticamente el siguiente número secuencial de migración:

```bash
python3 .agents/skills/agregar-ciclo-educativo/scripts/scaffold_cfgm.py \
  --slug <slug> \
  --name-es "<Nombre en Castellano>" \
  --name-ca "<Nombre en Catalán>" \
  [--etapa cfgs]      # grado superior (por defecto cfgm) \
  [--con-mapa]        # solo si se pide el mapa intermodular
```

Archivos generados (todos en el backend; el frontend no lleva datos curriculares ni listas de niveles):
- `backend/src/data/ras_<etapa>_<slug>.data.ts` (`<etapa>` = `cfgm` o `cfgs`)
- `backend/src/migrations/NN_ingest_<etapa>_<slug>_ras.ts`
- **Solo con `--con-mapa`:** `backend/src/data/mapa-intermodular/mapa_<etapa>_<slug>.json` (y `_2.json` si tiene 2.º curso) y su migración de ingesta en la colección `mapamodules`.

---

### Paso 2: Extracción e Ingesta de RAs y Criterios (Bilingüe Estricto)
1. Extraer los RAs y criterios oficiales desde los documentos normativos contrastando con **TodoFP** y **CAIB**:
   - **En castellano:** Extraer textualmente del BOE (`lista_RA_CE_..._ES_...md`). Criterios ordenados: `a) Se ha...`, `b) Se han...`.
   - **En catalán:** Extraer de las fuentes autonómicas o traducir siguiendo la terminología balear de FP (`a) S'ha...`, `b) S'han...`).
2. Rellenar `backend/src/data/ras_cfgm_<slug>.data.ts` con tipado `CfgmRaData` (solo en el backend: el frontend obtiene los RA de MongoDB vía `GET /api/ras` y no tiene RA de respaldo):
   ```typescript
   {
     id: "RA1",
     module: "<Nombre oficial en Catalán>",
     module_es: "<Denominación oficial BOE en Castellano>",
     module_ca: "<Nombre oficial en Catalán>",
     moduleCode: "0845",
     tipoNivel: "CFGM_<SLUG>", // o "FP_BASICA"
     description: "<Descripción en Catalán>",
     description_es: "<Descripción oficial BOE en Castellano>",
     description_ca: "<Descripción oficial en Catalán>",
     criterios_es: [ "a) Se ha...", "b) Se han..." ],
     criterios_ca: [ "a) S'ha...", "b) S'han..." ]
   }
   ```
3. **Validación de Criterios Completos:** Verificar minuciosamente que no se omitan letras de criterios de evaluación (ej. `h`, `i`, etc.). Si el ciclo tiene mapa, comprobar además la coherencia con sus referencias cruzadas.
4. **Extracción determinista, sin IA para el contenido** (ver sección 5): validar paridad ES/CA (mismos módulos, RA y número y orden de criterios), numeración consecutiva (`RA1…RAn`, `a), b), c)…`), texto literal en el documento oficial de su idioma y que todos los `moduleCode` coinciden con los módulos del título y con los cursos que declarará el catálogo.

---

### Paso 3: Entrada en el catálogo de niveles (backend)
Todo el frontend (generador, historial, «Mis proyectos», inicio, Taller, exportación y mapa) y las validaciones del backend salen de `backend/src/data/niveles.ts`. Añadir la entrada del ciclo:

```typescript
{
  id: 'CFGM_<SLUG>',
  etapa: 'CFGM',               // 'FPB' | 'CFGM' | 'CFGS' (CFGS para grado superior)
  comunidad: 'IB',
  nombre_es: 'CFGM <Nombre en Castellano>',   // TodoFP/BOE
  nombre_ca: 'CFGM <Nombre en Catalán>',      // CAIB/BOIB
  palabrasClave: 'formación profesional <familia profesional>', // ejemplos INTEF del prompt
  unidad: 'RA',
  terminologia: 'proyecto_intermodular',
  cursos: [
    { curso: '1º', modulos: ['cod1', 'cod2', ...] }, // orden oficial del 1.er curso
    { curso: '2º', modulos: ['codA', 'codB', ...] }, // orden oficial del 2.º curso
  ],
  // Solo con mapa intermodular (por defecto se omite):
  // mapas: [
  //   { tab: 'CFGM_<SLUG>', curso: '1º', moduleCode: 'cod1', raId: 'cod1_RA1' },
  //   { tab: 'CFGM_<SLUG>_2', curso: '2º', moduleCode: 'codA', raId: 'codA_RA1' },
  // ],
}
```

- `modulos` filtra y ordena los módulos de cada curso en el selector curricular y en el proyecto generado; debe cubrir exactamente los `moduleCode` de los RA del ciclo (lo comprueba `backend/src/tests/niveles-catalogo.test.ts`).
- `mapas` es opcional: declara las pestañas del mapa intermodular (`MapaModule.tab`) y su selección inicial. **Un ciclo sin `mapas` es válido**: no aparece en el mapa y todo lo demás funciona. Sin `curso`, el mapa abarca todo el ciclo.
- `nombrePrompt_es/ca` solo hace falta si el prompt debe nombrar el nivel de otra forma que `nombre_es/ca`.
- Con la entrada, el backend valida `Project.tipoNivel`, `RA.tipoNivel`, `MapaModule.tab` y el `tab` de `GET /api/mapa-intermodular`, y `describeTargetCourse` usa el nombre oficial en el prompt.
- Las reglas de prompt propias de un nivel (como la Carpeta de Aprendizaje de FP Básica) son lógica: van en un helper del backend, no en el catálogo.

---

### Paso 4: Frontend (sin cambios)
No se toca el frontend: `NivelesService` carga el catálogo con `GET /api/niveles` y de él salen el desplegable de titulación, los cursos, los módulos de cada curso, las pestañas del historial, los filtros, las etiquetas de los proyectos y el selector del mapa. No hay claves `courseLevel…` en las traducciones ni RA de respaldo en el bundle.

Si durante la incorporación aparece un `tipoNivel` de FP escrito a mano en `frontend/src`, es un error: debe salir del catálogo.

---

### Paso 5 (solo con mapa): Semilla y Vista del Mapa Intermodular (Reglas de Cantidad, Calidad y Deduplicación)

> [!NOTE]
> **Omitir este paso entero si no se ha pedido el mapa del ciclo.** Puede hacerse más adelante o bajo demanda, sobre un ciclo ya incorporado: basta añadir `mapas` al catálogo, el JSON y su migración.

> [!CAUTION]
> **REGLAS CRÍTICAS DE CONEXIONES Y ACTIVIDADES:**
> 1. **CERO Conexiones Huérfanas / Vacías (`activities: []`):** Cada conexión intermodular DEBE tener al menos una propuesta de actividad formativa (`activities.length >= 1`). Queda **terminantemente prohibido** crear conexiones sin actividad. Si un cruce de criterios no dispone de actividad asociada, NO debe generarse una conexión en el grafo.
> 2. **Rango Equilibrado y Educativo por RA (6 a 15 conexiones por RA):** Cada RA debe tener entre **6 y 15 conexiones intermodulares** (media de ~8 a 12). En un curso completo de 8-11 módulos, el mapa debe situarse entre **300 y 600 conexiones**. NUNCA generes miles de conexiones repetidas o artificiales.
> 3. **Deduplicación Rigurosa de Actividades:** Las actividades deben ser únicas dentro de cada módulo y RA. No repitas la misma actividad en múltiples conexiones del mismo RA.

1. **Persistencia en MongoDB y Servicio REST (Prevención de Out of Memory en Build):**
   - **NUNCA** incrustar semillas gigantes de mapas como archivos `.ts` en el frontend: el compilador agota la memoria en entornos limitados como EC2 (`ERR_WORKER_OUT_OF_MEMORY: JS heap out of memory`).
   - Guardar los módulos completos como JSON en `backend/src/data/mapa-intermodular/mapa_cfgm_<slug>.json` (y `_2.json` si tiene 2.º curso). El JSON no debe superar los 4-6 MB.
   - Ingestar los datos en MongoDB mediante una migración en el modelo `MapaModule` con los campos `{ tab, order, code, name_es, name_ca, type, color, icon, learningOutcomes }`.
   - El frontend consume los módulos mediante `MapaIntermodularService.getModules(tab)` (`GET /api/mapa-intermodular?tab=...`).
2. **Pestañas Separadas por Curso:**
   - Si el ciclo dispone de mapa para 1.er y 2.º curso, generar dos datasets independientes con tabs distintos (ej. `CFGM_<SLUG>` y `CFGM_<SLUG>_2`).
   - Declarar ambas pestañas en `mapas` del catálogo (paso 3). El selector de ciclo, los botones de curso, el título («Mapa intermodular del CFGM <Nombre> 2n») y los textos con la sigla de la etapa salen de ahí.

---

### Paso 6: Historial, inicio y perfil
Sin cambios: las pestañas del historial y los filtros de «Mis proyectos» son una por nivel del catálogo, y el nombre del nivel de cada proyecto sale del catálogo (pipe `nivelNombre` o `NivelesService.nombreDe`).

---

### Paso 7: Tests de la ruta FP
Además de las reglas comunes de la sección 6:

1. **Solo con mapa.** En `mapa-intermodular-view.component.spec.ts` (con el catálogo de prueba de `frontend/src/app/testing/niveles.mock.ts`, al que se añade el ciclo):
   - **OBLIGATORIO:** Simular la elección en el DOM: el ciclo en el desplegable y el curso con sus botones:
     ```typescript
     const select = el.querySelector('.mapa-tabs__select') as HTMLSelectElement;
     select.value = 'CFGM_<SLUG>';
     select.dispatchEvent(new Event('change'));
     fixture.detectChanges();
     (el.querySelectorAll('.mapa-tabs__curso')[1] as HTMLButtonElement).click();
     fixture.detectChanges();
     ```
   - Probar conmutación de idioma en el header (`headerExpanded.set(true)`): en castellano, el nombre en castellano; con `layout.language.set('catalan')`, el nombre en catalán.
   - En `app.spec.ts`: registrar `MapaIntermodularFacade` en los `providers` del `TestBed` con su mock para evitar llamadas HTTP accidentales.
2. Los specs de generador, historial y «Mis proyectos» ya cubren un nivel ficticio añadido solo al catálogo (`NIVEL_FICTICIO`); basta con añadir el ciclo a `NIVELES_MOCK`.
3. Backend: añadir el ciclo a `niveles-catalogo.test.ts` (módulos por curso y, con mapa, pestañas) y un test de datos que compruebe paridad ES/CA (mismos RA y criterios, textos distintos entre idiomas) y numeración consecutiva.
4. Si el ciclo no tiene mapa, `./scripts/verify_cfgm_integration.sh <TIPO_NIVEL>` lo detecta (no declara `mapas`) y omite su validación; con mapa, añadir `--con-mapa`.

---

## 4. Ruta ESO: Flujo de Ejecución Paso a Paso

No hay scaffold para la ESO: los archivos se crean a mano siguiendo los de la ESO ordinaria. Detalle de archivos en [checklist_archivos.md](./references/checklist_archivos.md) (sección «Ruta ESO») y documentación de referencia en `documentation/niveles_educativos_y_catalogo.md` y `documentation/mapa_afinidades_eso.md`.

> [!IMPORTANT]
> **Siglas de la ESO (LOMLOE), distintas de las de FP.** La jerarquía es saberes básicos ➡️ competencias específicas ➡️ criterios de evaluación:
> - **Competencia específica** (la categoría superior): «CE1», «CE2»… en los dos idiomas.
> - **Criterio de evaluación:** en castellano, «CE 1.1» (criterio de evaluación); en catalán, **«CA 1.1»** (criteri d'avaluació), nunca «CE 1.1». El formato distingue el criterio («CE 1.1», con número de criterio) de la competencia («CE1»).
> - En FP, «CE» es el criterio de evaluación de un RA en los dos idiomas.
> Aplica en datos, interfaz (selector, mapa de afinidades), prompts y documentación.

### Paso E0: Decidir el caso
- **Caso A: ampliar o actualizar `ESO_ORDINARIA`.** Solo cambian datos (`backend/src/data/curriculo-eso/`) y se añade una migración nueva. El código y el frontend no se tocan.
- **Caso B: otra ESO (`ESO_<SUFIJO>`).** El código de la ESO está atado hoy a la constante `ESO_ORDINARIA`, así que primero hay que generalizarlo (Paso E4). Es una tarea grande: proponer el plan con la skill `proponer-cambio` y trabajar en rama `feature/NNN_*` (AGENTS.md §1).

### Paso E1: Extracción de CE y criterios (determinista, bilingüe)
1. Un JSON por materia en `backend/src/data/curriculo-eso/<materia>.json` (caso A) o en una carpeta propia `backend/src/data/curriculo-eso-<sufijo>/` (caso B), con este formato:
   ```json
   {
     "code": "biologia_geologia",
     "name_es": "Biología y Geología",
     "name_ca": "Biologia i Geologia",
     "cursos": { "1º": "comun", "3º": "comun", "4º": "opcion" },
     "competencias": [
       {
         "ce_id": "CE1",
         "ce_num": 1,
         "description_es": "…",
         "description_ca": "…",
         "descriptores": ["CCL1", "STEM4"],
         "criterios": [
           {
             "id": "1.1",
             "cursos": ["1º", "3º"],
             "text_es": "…",
             "text_ca": "…",
             "aclaraciones_es": ["…"],
             "aclaraciones_ca": ["…"]
           }
         ]
       }
     ]
   }
   ```
2. **Cursos de cada criterio.** El decreto agrupa los criterios en bloques de cursos distintos según la materia («Primer y tercer curso», «De primero a tercero», uno por curso…). Cada criterio guarda la lista de cursos en los que se aplica; los ids pueden repetirse entre bloques (p. ej. el 3.2 de 1.º-3.º y el de 4.º).
3. **Tipo de materia por curso** (`cursos`): `comun`; `opcion` (a elegir dentro del currículo común, como las de 4.º y Plástica/Música en 3.º en Baleares); `optativa`. Una materia que no se imparte en un curso no aparece en `cursos`.
4. **Materias con niveles separados** (Cultura Clásica I/II, Matemáticas A/B, Recursos Digitales I/II) van como materias distintas. Las lenguas extranjeras se cargan como materias genéricas: sus CE no dependen del idioma.
5. **Validaciones automáticas** (además de las comunes de la sección 5): paridad ES/CA de materias, CE e ids de criterio; numeración consecutiva de CE y de criterios dentro de cada CE; **ningún criterio absorbe otro bloque** (comprobar longitudes acotadas y que no aparezcan encabezados como «Saberes básicos» o «Curso…» dentro de un texto).
6. **Contraste con la web LOMLOE de la CAIB:** descargar los documentos por materia y comprobar que los textos `_ca` aparecen literalmente en ellos (en la ESO ordinaria coinciden los 922 textos de CE y criterios).

### Paso E2: Entrada en el catálogo de niveles
- **Caso A:** la entrada `ESO_ORDINARIA` ya existe; solo se toca si cambian los cursos, las edades o el decreto citado en su comentario.
- **Caso B:** añadir la entrada en `backend/src/data/niveles.ts`:
  ```typescript
  {
    // ESO de <comunidad>: <decreto> (<boletín y fecha>).
    id: 'ESO_<SUFIJO>',
    etapa: 'ESO',
    comunidad: 'estatal',          // ampliar el tipo `comunidad` si es otra comunidad
    nombre_es: 'ESO (<comunidad>)',
    nombre_ca: 'ESO (<comunitat>)',
    nombrePrompt_es: 'ESO (Educación Secundaria Obligatoria)',
    nombrePrompt_ca: 'ESO (Educació Secundària Obligatòria)',
    palabrasClave: 'educación secundaria obligatoria situación aprendizaje',
    unidad: 'CE',
    terminologia: 'situacion_aprendizaje',
    cursos: [
      { curso: '1º', edad: '12-13 años' },
      { curso: '2º', edad: '13-14 años' },
      { curso: '3º', edad: '14-15 años' },
      { curso: '4º', edad: '15-16 años' },
    ],
    // Solo con mapa de afinidades (Paso E5): mapas: [{ tab: 'ESO_<SUFIJO>_1', curso: '1º', formato: 'afinidades', moduleCode: '<materia>', raId: '' }, …]
  }
  ```
- En la ESO los cursos **no** llevan `modulos`: las materias de cada curso salen de `cursos` de cada JSON. `edad` llega al prompt mediante `edadDeCurso`.

### Paso E3: Migración de ingesta
- Patrón de `backend/src/migrations/23_ingest_ces_eso_ordinaria.ts`: lee los JSON, genera un documento `CE` por competencia (`tipoNivel`, `subjectCode`, `subject_es/ca`, `subjectTipos`, `ce_id`, `ce_num`, `description_es/ca`, `descriptores`, `criteriosPorCurso`) y hace `CE.deleteMany({ tipoNivel })` + `insertMany`. Así es idempotente y no toca las CE de otros niveles (PDC incluido).
- **Caso A:** la 23 ya consta como aplicada en producción y no se reejecuta. Crear una migración **nueva** (`NN_reingest_ces_eso_ordinaria.ts`) que reutilice `ceDocsFromMateria` o vuelva a llamar a la ingesta, como hizo `24_reingest_cfgm_estetica_ras` en FP.
- **Caso B:** migración nueva con el `tipoNivel` del nivel y su carpeta de datos. Si se parametriza la 23, no cambiar su comportamiento para `ESO_ORDINARIA`.

### Paso E4 (solo caso B): Generalizar el código de la ESO
Hoy estos puntos comparan con `ESO_ORDINARIA` (o con el literal `'ESO_ORDINARIA'`) y deben pasar a decidir por el catálogo, con un helper único (p. ej. `usaCurriculoEso(tipoNivel)`: nivel con `etapa: 'ESO'` y `unidad: 'CE'` que no sea el PDC heredado). Comprobar con `grep -rn "ESO_ORDINARIA" backend/src frontend/src` que no queda ninguno fuera de datos, migraciones y tests:

| Archivo | Uso actual |
|---|---|
| `backend/src/services/eso-curriculum.service.ts` | constante `ESO_ORDINARIA`; `findEsoCe` filtra por ella; `buildEsoInstruction` pide la edad de `ESO_ORDINARIA` (debe recibir el `tipoNivel`) |
| `backend/src/controllers/curriculum.controller.ts` | `GET /api/ces?tipoNivel=…`: solo `ESO_ORDINARIA` usa `mapEsoCes`; el resto se trata como PDC (`$ne: ESO_ORDINARIA`) |
| `backend/src/controllers/project.controller.ts` | CE de ESO en el prompt (`findEsoCe`) y reglas `buildEsoInstruction` |
| `backend/src/services/criterios.service.ts` | criterios seleccionados de la CE |
| `backend/src/services/translation.service.ts` | glosario de traducción de selecciones de ESO |
| `backend/src/controllers/afinidades.controller.ts` | resolución de criterios del mapa de afinidades (solo si hay mapa) |
| `frontend/src/app/app.facade.ts` | elige `loadEsoCes` o `loadCes` al cambiar de nivel, curso o idioma |
| `frontend/src/app/features/curriculum/services/curriculum.facade.ts` | `loadEsoCes` (query fija `tipoNivel=ESO_ORDINARIA`), `activeCes` y `groupedItems` |

El frontend debe saber qué niveles usan el currículo de ESO a partir del catálogo (`NivelesService`), no por un literal. Añadir el nuevo nivel a `frontend/src/app/testing/niveles.mock.ts` y cubrir con tests que el nivel nuevo carga sus CE y no las de `ESO_ORDINARIA` (y al revés).

### Paso E5 (solo con mapa): Mapa de afinidades
El mapa de la ESO no sigue el modelo de la FP: son **fichas de afinidad entre materias, sin actividades** (`documentation/mapa_afinidades_eso.md`).
- Datos en `backend/src/data/afinidades-eso/afinidades_<nivel>_<curso>.json`, ingeridos por una migración nueva en la colección `AfinidadEso` (patrón de `25_ingest_afinidades_eso`; la 25 no se reejecuta).
- Pestañas en `mapas` del catálogo con `formato: 'afinidades'` (una por curso); `AFINIDADES_TABS` y `cursoDeTab` las recogen solas.
- Los criterios se muestran como «CE x.y» en castellano y «CA x.y» en catalán.
- Reglas: cada criterio citado existe en la materia y se imparte en el curso de la ficha (se resuelve por id **y** curso); paridad ES/CA de ámbitos, relaciones, saberes y conceptos; cada materia de cada curso aparece al menos en 3 fichas; las fichas nuevas llevan `origen: "ampliacion"` y sus saberes se contrastan con los saberes básicos del decreto.
- **Caso B:** `afinidades.controller.ts` resuelve hoy los textos con `tipoNivel: 'ESO_ORDINARIA'`; debe usar el nivel de la pestaña.

### Paso E6: Tests de la ruta ESO
Además de las reglas comunes de la sección 6:
1. `backend/src/tests/eso.test.ts` (o un archivo nuevo para el caso B): paridad ES/CA de materias, CE y criterios; tipo de materia por curso; migración idempotente que no toca las CE de otros niveles; `GET /api/ces` por curso (materias del curso, solo criterios del curso, orden comunes → de opción → optativas, catalán); generación de proyectos con edad, terminología LOMLOE y solo los criterios del curso.
2. Si se añaden materias, comprobar en un test alguna materia nueva en su curso.
3. `niveles-catalogo.test.ts`: el `tipoNivel` de los datos y migraciones está en el catálogo.
4. Solo con mapa: `afinidades-datos.test.ts` (criterios existentes y del curso, paridad, mínimo de fichas por materia) y `afinidades.test.ts` (endpoint).

---

## 5. Reglas comunes de extracción (ambas rutas)

- **Extracción determinista, sin IA para el contenido:** extraer los textos de los documentos oficiales con un script temporal (en el espacio temporal de la sesión, eliminado después) y validarlos automáticamente. **Cada texto debe aparecer literalmente en el documento oficial de su idioma.**
- La IA solo interviene para resolver erratas del BOE/BOIB (anotarlas en la tarea y en la documentación, como «CA 2.» sin número o un salto 2.1 → 2.3 que se conserva por ser oficial) o para traducir al catalán balear cuando no exista versión oficial; en ese caso, avisar al usuario y usar el agente `traductor-es-ca`.
- **Fuentes que fallan:** la web de la CAIB devuelve 502 con frecuencia; reintentar la descarga (en segundo plano, solo los ficheros fallidos) antes de dar una fuente por no disponible. Si no hay versión catalana oficial, no copiar el castellano en `_ca`: pararse y avisar.
- Datos grandes siempre como JSON o TS en `backend/src/data/` e ingeridos por migraciones; nunca como semillas en el bundle del frontend.

---

## 6. Tests, cobertura y verificación (ambas rutas)
Consultar [Lecciones Aprendidas de Cobertura](./references/lecciones_aprendidas_cobertura.md).

1. **Supresión limpia de errores en tests:** si un test prueba deliberadamente una captura de error (`catch` con `throwError`), interceptar `console.error` con `vi.spyOn(console, 'error').mockImplementation(() => {})` y restaurarlo al finalizar (`consoleSpy.mockRestore()`).
2. Ejecutar las suites completas:
   - Frontend: `npm test` (lint, cobertura global y por archivo >= 90 %, funciones en HTML >= 80 % y comprobación zoneless).
   - Backend: `npm test`.
3. Documentar la tarea en `tareas/` siguiendo `AGENTS.md` §2 con el número común de la tarea (§1.1: el mismo del plan y de la rama `feature/NNN_*`, si existen), por ejemplo `NNN_incorporacion_<etapa>_<slug>.md` o `NNN_eso_<sufijo>.md`, indicando si el nivel tiene o no mapa y las erratas encontradas.
4. Actualizar `documentation/niveles_educativos_y_catalogo.md` (sección del nivel: fuente normativa, datos, decisiones de extracción y erratas) y, en la ruta FP, la documentación del ciclo si procede.

---

## 7. Prompt para la Generación de Conexiones y Actividades del Mapa Intermodular (ruta FP, solo con mapa)

Solo si se ha pedido el mapa del ciclo. Cuando se encargue a la IA o a un subagente generar los documentos curriculares markdown del mapa intermodular a partir del currículo oficial, se debe utilizar exactamente la siguiente instrucción directriz:

```text
Quiero que para el "mapa intermodular" busques las conexiones entre los modulos de un mismo curso. Tiene que seguir el mismo esquema curricular, explicitando los criterios de evaluacion relacionados con otros modulos y justificando la conexión, explicitando el codigo y el nombre de los otros RAs y Criterios de Evaluacion (CE). 

REGLAS ESTRICTAS DE CANTIDAD Y CALIDAD:
1. Para cada RA, propón entre 6 y 15 conexiones intermodulares relevantes (media de 8 a 12 por RA).
2. Cada conexión DEBE incluir obligatoriamente al menos una propuesta de actividad formativa innovadora (metodologías activas: proyectos, retos, problemas, servicio). NUNCA generes conexiones vacías o sin actividad.
3. Las actividades deben ser ÚNICAS y diferenciadas. No repitas la misma actividad con diferente código de criterio.
4. En cada actividad no se pueden contemplar más de tres CE externos, aparte del propio del módulo.
5. Se han de especificar las medidas DUA adaptadas a cada actividad y evidencias evaluables.
6. La relación debe ser bidireccional entre los módulos conectados.
7. El documento ha de tener versión en catalán balear y en castellano, sin faltas ortográficas y sin mezclar ambas lenguas.
```

---

## 8. Plantillas de Prompt para Delegar la Integración Completa a un Subagente

### 8.1. Ruta FP (p. ej. subagente `fp-implementor` de Antigravity)
Plantilla base (sin mapa). Si se pide el mapa, añadir al final las reglas de mapa de la sección 7 y los requisitos marcados «solo con mapa».

```text
Implementa el ciclo formativo <Nivel: Grado Básico / Grado Medio / Grado Superior> <Nombre en Castellano> (<Nombre en Catalán>) con slug '<slug>' y tipoNivel '<TIPO_NIVEL>'.
Sigue estrictamente la ruta FP de la skill en .agents/skills/agregar-ciclo-educativo/SKILL.md (y, solo si hay mapa, la guía técnica en documentation/procesamiento_actividades_mapa_intermodular.md).
Los archivos fuente se encuentran en: <ruta_carpeta>.

Fuentes oficiales de contraste:
- TodoFP: https://www.todofp.es/inicio.html
- FP Illes Balears: https://www.caib.es/sites/fp/ca/inici/

REQUISITOS BILINGÜES Y TÉCNICOS ESTRICTOS:
1. Extrae los nombres, descripciones y criterios oficiales en castellano del BOE/TodoFP para los campos _es.
2. Extrae o traduce al catalán balear oficial de FP CAIB para los campos _ca. Nunca mezcles ambos idiomas.
3. Registra el ciclo en backend/src/data/niveles.ts (nombres oficiales ES/CA, unidad 'RA', cursos con sus modulos en orden oficial). El frontend no se toca.
4. NO generes el mapa intermodular (ni su JSON, ni su migración, ni `mapas` en el catálogo) salvo que se te pida expresamente. Aplica una extracción determinista de los RA y criterios y valida que cada texto aparece literalmente en la fuente oficial de su idioma.
5. Si hay 1.er y 2.º curso, separa los módulos por curso en `cursos[].modulos` del catálogo.
6. Silencia stderr en los tests espiando console.error en pruebas de error.
7. Solo con mapa: genera backend/src/data/mapa-intermodular/mapa_<etapa>_<slug>.json (y _2.json), cero conexiones vacías, 6-15 conexiones por RA con al menos 1 actividad, simula el click() del nuevo tab en mapa-intermodular-view.component.spec.ts y registra mockMapaFacade en app.spec.ts.

Al finalizar, ejecuta la suite de tests de frontend y backend, y documenta la tarea en tareas/.
```

### 8.2. Ruta ESO

```text
<Caso A: Amplía/actualiza la ESO ordinaria (ESO_ORDINARIA) con …> | <Caso B: Incorpora la ESO de <comunidad> con tipoNivel 'ESO_<SUFIJO>'>.
Sigue estrictamente la ruta ESO de la skill en .agents/skills/agregar-ciclo-educativo/SKILL.md (pasos E0-E6) y documentation/niveles_educativos_y_catalogo.md.
Fuentes: <decreto en castellano> y <decreto en catalán> (<rutas o URLs>); contraste del catalán en https://www.caib.es/sites/lomloe/ca/eso_materies/.

REQUISITOS ESTRICTOS:
1. Un JSON por materia con code, name_es/ca, cursos (comun/opcion/optativa) y competencias con descriptores y criterios (id, cursos, text_es/ca, aclaraciones_es/ca).
2. Extracción determinista con un script temporal: paridad ES/CA, numeración consecutiva, sin absorciones y texto literal en el decreto de su idioma. Anota las erratas oficiales.
3. Excluye las materias de currículo de centro y Religión. Las materias con niveles (I/II, A/B) van separadas.
4. Migración nueva e idempotente (deleteMany por tipoNivel + insertMany); no reejecutes ni modifiques migraciones ya aplicadas, y no toques las CE del PDC.
5. Caso B: generaliza antes los puntos que comparan con ESO_ORDINARIA (paso E4) para que salgan del catálogo, con tests de ambos niveles.
6. NO generes el mapa de afinidades salvo que se pida (paso E5).

Al finalizar, ejecuta la suite de tests de frontend y backend, y documenta la tarea en tareas/ y en documentation/.
```

---
name: agregar-fp
description: >-
  Procedimiento y guía técnica para incorporar nuevos ciclos formativos de Formación Profesional (Grado Básico / FP Básica, Grado Medio / CFGM y Grado Superior / CFGS) a la plataforma Plappin con mínima información de entrada (nombre del ciclo y fuentes oficiales). Gestiona la integración end-to-end en backend (catálogo de niveles, RA y criterios bilingües ES/CA, migraciones), la gestión de 1.er y 2.º curso y la suite de tests con cobertura >= 90%. El mapa intermodular es OPCIONAL: por defecto los ciclos se incorporan SIN mapa (se añade más adelante o bajo demanda; entonces rigen sus reglas de conexiones y actividades).
---

# Skill: Incorporación de Ciclos Formativos de Formación Profesional (Grado Básico, Medio y Superior)

Esta skill permite integrar cualquier nuevo ciclo de Formación Profesional —de **Grado Básico (FP Básica / FPB)**, **Grado Medio (CFGM)** o **Grado Superior (CFGS)**— en Plappin de forma sistemática, bilingüe estricta (Castellano / Catalán) y sin fricción, aprovechando el estándar validado en **FP Básica**, **CFGM Estética y Belleza**, **CFGM Peluquería y Cosmética Capilar** y **CFGS Educación Infantil**.

> [!IMPORTANT]
> **El mapa intermodular es opcional y, por defecto, NO se hace.** Un ciclo se considera incorporado cuando tiene su entrada en el catálogo, sus RA y criterios bilingües ES/CA en MongoDB y los tests en verde. Los pasos y secciones marcados **«solo con mapa»** (Paso 5, parte del Paso 7 y los prompts de las secciones 4 y 5) se aplican únicamente si el usuario pide expresamente el mapa del ciclo, ahora o más adelante. Sin mapa, la entrada del catálogo no lleva `mapas` y el ciclo no aparece en la pantalla del mapa.

---

## 1. Fuentes Oficiales de Referencia y Portales de FP

Para cualquier consulta curricular, verificación de Resultados de Aprendizaje (RA), Criterios de Evaluación (CE) o denominaciones normativas oficiales, se debe recurrir a las fuentes gubernamentales de referencia:

1. **Portal FP Illes Balears (Govern de les Illes Balears - CAIB):**
   - **URL Oficial:** [https://www.caib.es/sites/fp/ca/inici/](https://www.caib.es/sites/fp/ca/inici/)
   - **Uso:** Denominaciones oficiales autonómicas en catalán balear (`_ca`), currículos oficiales publicados en el BOIB, atribuciones docentes y distribución modular por cursos en las Islas Baleares.
2. **TodoFP (Ministerio de Educación, Formación Profesional y Deportes de España):**
   - **URL Oficial:** [https://www.todofp.es/inicio.html](https://www.todofp.es/inicio.html)
   - **Uso:** Catálogo Nacional de Títulos de FP, Reales Decretos estatales del BOE, denominaciones oficiales en castellano (`_es`), Resultados de Aprendizaje (RA), Criterios de Evaluación (CE) estatales y códigos numéricos de los módulos.

---

## 2. Información Mínima Requerida y Niveles Educativos

Para iniciar la integración, el asistente solo necesita:

1. **Nivel del Ciclo:**
   - **Grado Básico (FP Básica / FPB):** `tipoNivel = 'FP_BASICA'` (o subtipos específicos).
   - **Grado Medio (CFGM):** `tipoNivel = 'CFGM_<SLUG_MAYUSCULAS>'` (ej. `CFGM_PELUQUERIA`, `CFGM_ESTETICA`, `CFGM_COCINA`).
   - **Grado Superior (CFGS):** `tipoNivel = 'CFGS_<SLUG_MAYUSCULAS>'` y `etapa: 'CFGS'` (ej. `CFGS_EDUCACION_INFANTIL`, `CFGS_INTEGRACION_SOCIAL`).
2. **Denominaciones oficiales del ciclo:**
   - **En castellano:** Denominación oficial estatal del BOE / TodoFP (ej. *"Peluquería y Cosmética Capilar"*, *"Cocina y Gastronomía"*, *"Servicios Administrativos"*).
   - **En catalán:** Denominación autonómica oficial de FP Illes Balears / CAIB (ej. *"Perruqueria i Cosmètica Capil·lar"*, *"Cuina i Gastronomia"*, *"Serveis Administratius"*).
3. **Identificador / Slug:** Una palabra clave corta en minúsculas (ej. `peluqueria`, `cocina`, `automocion`, `servicios_admin`).
4. **Fuentes curriculares:** una carpeta del ciclo (ej. `add_mid_grades/Grado medio <nombre>/` o `FPB/`) o, si no hay carpeta, los documentos oficiales descargados de BOE/TodoFP (castellano) y BOIB/CAIB (catalán). Deben aportar:
   - RAs y Criterios oficiales en castellano (`lista_RA_CE_..._ES_...md` o `RA_CE_..._curso_ES.md`, o el Real Decreto del título).
   - RAs y Criterios en catalán balear (`lista_RA_CE_..._CA_...md` o el decreto autonómico del BOIB).
   - **Solo con mapa:** carpeta del Mapa Intermodular con los archivos pareados `mapa_intermodular_*_ES_*.md` y `mapa_intermodular_*_CA_*.md`.
5. **Distribución por cursos y módulos:** códigos de módulo y su orden por curso en Illes Balears (portal de FP de la CAIB).

> [!IMPORTANT]
> **Regla de Oro Bilingüe:** NUNCA introduzcas texto en catalán en los campos `_es` (como `module_es`, `description_es` o `criterios_es`) ni texto en castellano en los campos `_ca`. Ambos idiomas deben convivir de forma completa, rigurosa y simétrica.

---

## 3. Flujo de Ejecución Paso a Paso

### Paso 1: Andamiaje Inicial (Scaffold)
Ejecutar el script asistente para generar los archivos base y calcular automáticamente el siguiente número secuencial de migración:

```bash
python3 .agents/skills/agregar-fp/scripts/scaffold_cfgm.py \
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
4. **Extracción determinista, sin IA para el contenido (como en la ESO, tarea 197):** extraer los textos de los documentos oficiales con un script temporal (en el espacio temporal de la sesión, eliminado después) y validarlos automáticamente:
   - paridad ES/CA: mismos módulos, mismos RA y mismo número y orden de criterios;
   - numeración consecutiva de RA (`RA1…RAn`) y de criterios (`a), b), c)…`);
   - **cada texto aparece literalmente en el documento oficial de su idioma**;
   - todos los `moduleCode` coinciden con los módulos del título y con los cursos que declarará el catálogo.
   La IA solo interviene para resolver erratas del BOE/BOIB (anótalas en la tarea) o para traducir al catalán balear cuando no exista versión oficial; en ese caso, avisar al usuario.
5. **Fuentes que fallan:** la web de la CAIB devuelve 502 con frecuencia; reintentar la descarga (en segundo plano, solo los ficheros fallidos) antes de dar una fuente por no disponible. Si no hay versión catalana oficial, no copiar el castellano en `_ca`: pararse y avisar.

---

### Paso 3: Entrada en el catálogo de niveles (backend)
Todo el frontend (generador, historial, «Mis proyectos», inicio, Taller, exportación y mapa) y las validaciones del backend salen de `backend/src/data/niveles.ts`. Añadir la entrada del ciclo:

```typescript
{
  id: 'CFGM_<SLUG>',
  etapa: 'CFGM',               // 'FPB' | 'CFGM' | 'CFGS' | 'ESO' (CFGS para grado superior)
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

Si durante la incorporación aparece un `tipoNivel` escrito a mano en `frontend/src` (fuera de las reglas propias de la ESO), es un error: debe salir del catálogo.

---

### Paso 5 (solo con mapa): Semilla y Vista del Mapa Intermodular (Reglas de Cantidad, Calidad y Deduplicación)

> [!NOTE]
> **Omitir este paso entero si no se ha pedido el mapa del ciclo.** Puede hacerse más adelante o bajo demanda, sobre un ciclo ya incorporado: basta añadir `mapas` al catálogo, el JSON y su migración.

> [!CAUTION]
> **REGLAS CRÍTICAS DE CONEXIONES Y ACTIVIDADES:**
> 1. **CERO Conexiones Huérfanas / Vacías (`activities: []`):** Cada conexión intermodular DEBE tener obligatoriamente al menos una propuesta de actividad formativa (`activities.length >= 1`). Queda **terminantemente prohibido** crear conexiones sin actividad (`activities: []`). Si un cruce de criterios no dispone de actividad asociada, NO debe generarse una conexión en el grafo.
> 2. **Rango Equilibrado y Educativo por RA (6 a 15 conexiones por RA):** Cada Resultado de Aprendizaje (RA) debe tener entre **6 y 15 conexiones intermodulares** (media de ~8 a 12 conexiones por RA). En un curso completo de 8-11 módulos, el volumen total del mapa debe situarse entre **300 y 600 conexiones**. NUNCA generes miles de conexiones repetidas o artificiales.
> 3. **Deduplicación Rigurosa de Actividades:** Las actividades deben ser únicas dentro de cada módulo y RA. No repitas la misma actividad en múltiples conexiones del mismo RA.

1. **Persistencia en MongoDB y Servicio REST (Prevención de Out of Memory en Build):**
   - **NUNCA** incrustar semillas gigantes de mapas intermodulares como archivos `.ts` en el frontend, ya que el compilador de TypeScript/esbuild agota la memoria del sistema en entornos limitados como EC2 (`ERR_WORKER_OUT_OF_MEMORY: JS heap out of memory`).
   - Guardar los módulos completos como JSON en `backend/src/data/mapa-intermodular/mapa_cfgm_<slug>.json` (y `_2.json` si tiene 2.º curso). El tamaño del archivo JSON no debe superar los 4-6 MB.
   - Ingestar los datos en MongoDB mediante una migración (ej. `08_ingest_mapa_intermodular.ts` y `09_deduplicate_mapa_peluqueria.ts`) en el modelo `MapaModule` con los campos `{ tab, order, code, name_es, name_ca, type, color, icon, learningOutcomes }`.
   - El frontend consume los módulos mediante `MapaIntermodularService.getModules(tab)` apuntando al endpoint `GET /api/mapa-intermodular?tab=...`.
2. **Pestañas Separadas por Curso:**
   - Si el ciclo dispone de mapa para 1.er y 2.º curso, generar dos datasets independientes en MongoDB con tabs distintos (ej. `CFGM_<SLUG>` y `CFGM_<SLUG>_2`).
   - Declarar ambas pestañas en `mapas` del catálogo (paso 3). El selector de ciclo, los botones de curso, el título («Mapa intermodular del CFGM <Nombre> 2n») y los textos con la sigla de la etapa salen de ahí.

---

### Paso 6: Historial, inicio y perfil
Sin cambios: las pestañas del historial y los filtros de «Mis proyectos» son una por nivel del catálogo, y el nombre del nivel de cada proyecto sale del catálogo (pipe `nivelNombre` o `NivelesService.nombreDe`).

---

### Paso 7: Blindaje de Tests, Cobertura y Supresión de `stderr`
Consultar [Lecciones Aprendidas de Cobertura](./references/lecciones_aprendidas_cobertura.md).

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
   - Probar conmutación de idioma en el header (`headerExpanded.set(true)`):
     - En Castellano: comprobar que contiene el nombre en castellano.
     - En Catalán: cambiar a `layout.language.set('catalan')` y comprobar el nombre en catalán.
2. **Supresión Limpia de Errores en Tests** (siempre que se añadan tests con errores esperados):
   - Si un test prueba deliberadamente una captura de error (`catch` con `throwError`), interceptar siempre `console.error` con `vi.spyOn(console, 'error').mockImplementation(() => {})` y restaurarlo al finalizar (`consoleSpy.mockRestore()`), evitando ensuciar la salida estándar de errores (`stderr`) de Vitest.
   - En `app.spec.ts` (solo con mapa): Asegurar que `MapaIntermodularFacade` esté registrado en los `providers` del `TestBed` con su mock para evitar llamadas HTTP accidentales en segundo plano.
3. Los specs de generador, historial y «Mis proyectos» ya cubren un nivel ficticio añadido solo al catálogo (`NIVEL_FICTICIO`); basta con añadir el ciclo a `NIVELES_MOCK` y, en el backend, comprobar que `niveles-catalogo.test.ts` sigue en verde (módulos por curso y, con mapa, pestañas del mapa).
4. Backend: añadir el ciclo al test del catálogo y un test de datos que compruebe paridad ES/CA (mismos RA y criterios, textos distintos entre idiomas) y numeración consecutiva.

---

### Paso 8: Verificación y Documentación
1. Ejecutar el script de verificación integral o la suite completa:
   - Frontend: `npm test` con umbral de funciones en HTML >= 80% (o 100%) y branch coverage >= 90%.
   - Backend: `npm test`.
2. Si el ciclo no tiene mapa, `./scripts/verify_cfgm_integration.sh <TIPO_NIVEL>` lo detecta (no declara `mapas`) y omite su validación; con mapa, añadir `--con-mapa`.
3. Documentar la tarea en `tareas/` siguiendo `AGENTS.md` §2 con el siguiente número secuencial (ej. `NNN_incorporacion_<etapa>_<slug>.md`), indicando si el ciclo tiene o no mapa.

---

## 4. Prompt para la Generación de Conexiones y Actividades del Mapa Intermodular (solo con mapa)

Solo si se ha pedido el mapa del ciclo. Cuando se encargue a la IA o a un subagente generar los documentos curriculares markdown del mapa intermodular a partir del currículo oficial, se debe utilizar exactamente la siguiente instrucción directriz:

```text
Quiero que para el "mapa intermodular" busques las conexiones entre los modulos de un mismo curso. Tiene que seguir el mismo esquema curricular, explicitando los criterios de evaluacion relacionados con otros modulos y justificando la conexión, explicitando el codigo y el nombre de los otros RAs y Criterios de Evaluacion (CE). 

REGLAS ESTRICTAS DE CANTIDAD Y CALIDAD:
1. Para cada RA, propón entre 6 y 15 conexiones intermodulares relevantes (media de 8 a 12 por RA).
2. Cada conexión DEBE incluir obligatoriamente al menos tres propuestas de actividad formativa innovadoras (como en CFGM Estética) (metodologías activas: proyectos, retos, problemas, servicio). NUNCA generes conexiones vacías o sin actividad.
3. Las actividades deben ser ÚNICAS y diferenciadas. No repitas la misma actividad con diferente código de criterio.
4. En cada actividad no se pueden contemplar más de tres CE externos, aparte del propio del módulo.
5. Se han de especificar las medidas DUA adaptadas a cada actividad y evidencias evaluables.
6. La relación debe ser bidireccional entre los módulos conectados.
7. El documento ha de tener versión en catalán balear y en castellano, sin faltas ortográficas y sin mezclar ambas lenguas.
```

---

## 5. Plantilla de Prompt para Delegar la Integración Completa al Subagente `fp-implementor`

Plantilla base (sin mapa). Si se pide el mapa, añadir al final las reglas de mapa de la sección 4 y los requisitos marcados «solo con mapa».

```text
Implementa el ciclo formativo <Nivel: Grado Básico / Grado Medio / Grado Superior> <Nombre en Castellano> (<Nombre en Catalán>) con slug '<slug>' y tipoNivel '<TIPO_NIVEL>'.
Sigue estrictamente la skill en .agents/skills/agregar-fp/SKILL.md (y, solo si hay mapa, la guía técnica en documentation/procesamiento_actividades_mapa_intermodular.md).
Los archivos fuente se encuentran en: <ruta_carpeta>.

Fuentes oficiales de contraste:
- TodoFP: https://www.todofp.es/inicio.html
- FP Illes Balears: https://www.caib.es/sites/fp/ca/inici/

REQUISITOS BILINGÜES Y TÉCNICOS ESTRICTOS:
1. Extrae los nombres, descripciones y criterios oficiales en castellano del BOE/TodoFP para los campos _es.
2. Extrae o traduce al catalán balear oficial de FP CAIB para los campos _ca. Nunca mezcles ambos idiomas.
3. Asegura el mapeo reactivo isCa en curriculum.facade.ts y la condición de idioma en targetCourseDescription en project.controller.ts.
4. NO generes el mapa intermodular (ni su JSON, ni su migración, ni `mapas` en el catálogo) salvo que se te pida expresamente. Aplica una extracción determinista de los RA y criterios y valida que cada texto aparece literalmente en la fuente oficial de su idioma.
5. Si hay 1.er y 2.º curso, separa los módulos por curso en `cursos[].modulos` del catálogo.
6. Silencia stderr en los tests espiando console.error en pruebas de error.
7. Solo con mapa: genera backend/src/data/mapa-intermodular/mapa_<etapa>_<slug>.json (y _2.json), cero conexiones vacías, 6-15 conexiones por RA con al menos 3 actividades, simula el click() del nuevo tab en mapa-intermodular-view.component.spec.ts y registra mockMapaFacade en app.spec.ts.

Al finalizar, ejecuta la suite de tests de frontend y backend, y documenta la tarea en tareas/.
```

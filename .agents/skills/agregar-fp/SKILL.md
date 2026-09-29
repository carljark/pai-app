---
name: agregar-fp
description: >-
  Procedimiento y guía técnica para incorporar nuevos ciclos formativos de Formación Profesional (tanto Grado Básico / FP Básica como Grado Medio / CFGM) a la plataforma Plappin con mínima información de entrada (nombre del ciclo y carpeta de archivos curriculares). Gestiona la integración end-to-end en backend, frontend, mapa intermodular con bidireccionalidad completa, gestión de 1.er y 2.º curso, control estricto de conexiones (todas con actividad, sin conexiones vacías, 6-15 por RA), deduplicación rigurosa, migraciones, traducciones y suite de tests con cobertura >= 90%.
---

# Skill: Incorporación de Ciclos Formativos de Formación Profesional (Grado Básico y Grado Medio)

Esta skill permite integrar cualquier nuevo ciclo de Formación Profesional —tanto de **Grado Básico (FP Básica / FPB)** como de **Grado Medio (CFGM)**— en Plappin de forma sistemática, bilingüe estricta (Castellano / Catalán) y sin fricción, aprovechando el estándar validado en **FP Básica**, **CFGM Estética y Belleza** y **CFGM Peluquería y Cosmética Capilar**.

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
2. **Denominaciones oficiales del ciclo:**
   - **En castellano:** Denominación oficial estatal del BOE / TodoFP (ej. *"Peluquería y Cosmética Capilar"*, *"Cocina y Gastronomía"*, *"Servicios Administrativos"*).
   - **En catalán:** Denominación autonómica oficial de FP Illes Balears / CAIB (ej. *"Perruqueria i Cosmètica Capil·lar"*, *"Cuina i Gastronomia"*, *"Serveis Administratius"*).
3. **Identificador / Slug:** Una palabra clave corta en minúsculas (ej. `peluqueria`, `cocina`, `automocion`, `servicios_admin`).
4. **Carpeta de archivos curriculares:** Carpeta del ciclo formativo (ej. `add_mid_grades/Grado medio <nombre>/` o `FPB/`). Debe contener:
   - Archivos de RAs y Criterios oficiales del BOE en castellano (`lista_RA_CE_..._ES_...md` o `RA_CE_..._curso_ES.md`).
   - Archivos o traducciones normativas en catalán balear (`lista_RA_CE_..._CA_...md`).
   - Carpeta del Mapa Intermodular con los archivos pareados: `mapa_intermodular_*_ES_*.md` y `mapa_intermodular_*_CA_*.md`.

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
  --name-ca "<Nombre en Catalán>"
```

Archivos generados:
- `backend/src/data/ras_cfgm_<slug>.data.ts`
- `backend/src/migrations/0X_ingest_cfgm_<slug>_ras.ts`
- `frontend/src/app/features/curriculum/data/ras_cfgm_<slug>.data.ts`
- `backend/src/data/mapa-intermodular/mapa_cfgm_<slug>.json` (y `mapa_cfgm_<slug>_2.json` si tiene 2.º curso)
- `backend/src/migrations/0X_ingest_mapa_intermodular.ts` (ingesta en MongoDB collection `mapamodules`)

---

### Paso 2: Extracción e Ingesta de RAs y Criterios (Bilingüe Estricto)
1. Extraer los RAs y criterios oficiales desde los documentos normativos contrastando con **TodoFP** y **CAIB**:
   - **En castellano:** Extraer textualmente del BOE (`lista_RA_CE_..._ES_...md`). Criterios ordenados: `a) Se ha...`, `b) Se han...`.
   - **En catalán:** Extraer de las fuentes autonómicas o traducir siguiendo la terminología balear de FP (`a) S'ha...`, `b) S'han...`).
2. Rellenar `backend/src/data/ras_cfgm_<slug>.data.ts` y sincronizar en `frontend/src/app/features/curriculum/data/ras_cfgm_<slug>.data.ts` con tipado `CfgmRaData`:
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
3. **Validación de Criterios Completos:** Verificar minuciosamente que no se omitan letras de criterios de evaluación (ej. `h`, `i`, etc.), asegurando coherencia total con las referencias cruzadas del mapa intermodular.

---

### Paso 3: Configuración en Backend y Prompt IA Bilingüe
1. **`backend/src/models/Project.ts`**: Añadir `'CFGM_<SLUG>'` al enum de `tipoNivel` (si es un nuevo grado medio).
2. **`backend/src/controllers/project.controller.ts`**: En `targetCourseDescription`, respetar el idioma del proyecto para la IA:
   ```typescript
   : (tipoNivel === 'CFGM_<SLUG>'
     ? (language === 'catalan' 
         ? `${effectiveCourse} de CFGM <Nombre en Catalán>` 
         : `${effectiveCourse} de CFGM <Nombre en Castellano>`)
     : ...)
   ```

---

### Paso 4: Configuración en Frontend (Curriculum & Generator)
1. **`frontend/src/app/features/curriculum/services/curriculum.facade.ts`**:
   - Importar `CFGM_<SLUG>_RAS_DATA`.
   - Definir la ordenación de módulos por cursos:
     ```typescript
     const CFGM_<SLUG>_MODULE_ORDER = ['cod1', 'cod2', ...]; // 1.er curso
     const CFGM_<SLUG>_MODULE_ORDER_2 = ['codA', 'codB', ...]; // 2.º curso
     ```
   - Añadir `'CFGM_<SLUG>'` al tipo de unión de `tipoNivel`.
   - Actualizar `getStoredTipoNivel()` y el fallback estático en `loadRas()`.
   - **CRÍTICO:** Asegurar que `groupedItems` mapea reactivamente los campos según `isCa` para los RAs cargados desde la API:
     ```typescript
     list = list.map(r => ({
       ...r,
       module: isCa ? ((r as any).module_ca || r.module) : ((r as any).module_es || r.module),
       subject: isCa ? ((r as any).module_ca || r.subject || r.module) : ((r as any).module_es || r.subject || r.module),
       description: isCa ? ((r as any).description_ca || r.description) : ((r as any).description_es || r.description),
       criterios: isCa ? ((r as any).criterios_ca || (r as any).criterios) : ((r as any).criterios_es || (r as any).criterios)
     } as any));
     ```
2. **Traducciones (`translations.es.ts` y `translations.ca.ts`)**:
   - `courseLevelCFGM<CapitalizedSlug>` en ES: `'CFGM <Nombre en Castellano>'`.
   - `courseLevelCFGM<CapitalizedSlug>` en CA: `'CFGM <Nombre en Catalán>'`.
3. **`generator-view.component.ts`**:
   - Añadir el tab de nivel en la vista del formulario de generación.
   - **Filtrado por Curso:** Asegurar que al seleccionar 1.er curso o 2.º curso, solo se muestren los módulos correspondientes a ese año.

---

### Paso 5: Semilla y Vista del Mapa Intermodular (Reglas de Cantidad, Calidad y Deduplicación)

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
   - Configurar dos pestañas en `mapa-intermodular-view.component.html` (ej. `CFGM <Nombre>` y `CFGM <Nombre> 2n`).

---

### Paso 6: Ajuste de Vistas de Historial, Home y Perfil
Verificar que se emplee la clave de traducción correspondiente en:
- `history-view.component.ts`
- `home-dashboard.component.ts`
- `personal-view.component.ts`
- `projects.facade.ts`

---

### Paso 7: Blindaje de Tests, Cobertura y Supresión de `stderr`
Consultar [Lecciones Aprendidas de Cobertura](./references/lecciones_aprendidas_cobertura.md).

1. En `mapa-intermodular-view.component.spec.ts`:
   - **OBLIGATORIO:** Simular el clic en el botón del DOM:
     ```typescript
     const tabBtns = fixture.nativeElement.querySelectorAll('.mapa-tab-btn') as NodeListOf<HTMLButtonElement>;
     tabBtns[nuevoIndice].click();
     fixture.detectChanges();
     ```
   - Probar conmutación de idioma en el header (`headerExpanded.set(true)`):
     - En Castellano: comprobar que contiene el nombre en castellano.
     - En Catalán: cambiar a `layout.language.set('catalan')` y comprobar el nombre en catalán.
2. **Supresión Limpia de Errores en Tests:**
   - Si un test prueba deliberadamente una captura de error (`catch` con `throwError`), interceptar siempre `console.error` con `vi.spyOn(console, 'error').mockImplementation(() => {})` y restaurarlo al finalizar (`consoleSpy.mockRestore()`), evitando ensuciar la salida estándar de errores (`stderr`) de Vitest.
   - En `app.spec.ts`: Asegurar que `MapaIntermodularFacade` esté registrado en los `providers` del `TestBed` con su mock para evitar llamadas HTTP accidentales en segundo plano.
3. En los demás spec (`generator-view`, `curriculum.facade`, `history-view`, `personal-view`), añadir assertions para el nuevo ciclo tanto en ES como en CA.

---

### Paso 8: Verificación y Documentación
1. Ejecutar el script de verificación integral o la suite completa:
   - Frontend: `npm test` con umbral de funciones en HTML >= 80% (o 100%) y branch coverage >= 90%.
   - Backend: `npm test`.
2. Documentar la tarea en `tareas/` siguiendo la regla global de `GEMINI.md` con el siguiente número secuencial (ej. `12X_incorporacion_cfgm_<slug>.md`).

---

## 4. Prompt para la Generación de Conexiones y Actividades del Mapa Intermodular

Cuando se encargue a la IA o a un subagente generar los documentos curriculares markdown del mapa intermodular a partir del currículo oficial, se debe utilizar exactamente la siguiente instrucción directriz:

```text
Quiero que para el "mapa intermodular" busques las conexiones entre los modulos de un mismo curso. Tiene que seguir el mismo esquema curricular, explicitando los criterios de evaluacion relacionados con otros modulos y justificando la conexión, explicitando el codigo y el nombre de los otros RAs y Criterios de Evaluacion (CE). 

REGLAS ESTRICTAS DE CANTIDAD Y CALIDAD:
1. Para cada RA, propón entre 6 y 15 conexiones intermodulares relevantes (media de 8 a 12 por RA).
2. Cada conexión DEBE incluir obligatoriamente su correspondiente propuesta de actividad formativa innovadora (metodologías activas: proyectos, retos, problemas, servicio). NUNCA generes conexiones vacías o sin actividad.
3. Las actividades deben ser ÚNICAS y diferenciadas. No repitas la misma actividad con diferente código de criterio.
4. En cada actividad no se pueden contemplar más de tres CE externos, aparte del propio del módulo.
5. Se han de especificar las medidas DUA adaptadas a cada actividad y evidencias evaluables.
6. La relación debe ser bidireccional entre los módulos conectados.
7. El documento ha de tener versión en catalán balear y en castellano, sin faltas ortográficas y sin mezclar ambas lenguas.
```

---

## 5. Plantilla de Prompt para Delegar la Integración Completa al Subagente `fp-implementor`

```text
Implementa el ciclo formativo <Nivel: Grado Básico / Grado Medio> <Nombre en Castellano> (<Nombre en Catalán>) con slug '<slug>' y tipoNivel '<TIPO_NIVEL>'.
Sigue estrictamente la skill en .agents/skills/agregar-fp/SKILL.md y la guía técnica en documentation/procesamiento_actividades_mapa_intermodular.md.
Los archivos fuente se encuentran en: <ruta_carpeta>.

Fuentes oficiales de contraste:
- TodoFP: https://www.todofp.es/inicio.html
- FP Illes Balears: https://www.caib.es/sites/fp/ca/inici/

REQUISITOS BILINGÜES Y TÉCNICOS ESTRICTOS:
1. Extrae los nombres, descripciones y criterios oficiales en castellano del BOE/TodoFP para los campos _es.
2. Extrae o traduce al catalán balear oficial de FP CAIB para los campos _ca. Nunca mezcles ambos idiomas.
3. Asegura el mapeo reactivo isCa en curriculum.facade.ts y la condición de idioma en targetCourseDescription en project.controller.ts.
4. Genera el dataset del mapa intermodular en backend/src/data/mapa-intermodular/mapa_<slug>.json (y _2.json si tiene 2º curso) para ingesta en MongoDB.
5. CERO CONEXIONES VACÍAS: Cada conexión debe tener al menos una actividad formativa (activities.length >= 1). No crees conexiones con activities: [].
6. CANTIDAD EQUILIBRADA DE ACTIVIDADES: Entre 6 y 15 conexiones por RA (300 a 600 conexiones totales por curso). Deduplica las actividades por título.
7. Si hay 1.er y 2.º curso, separa los módulos adecuadamente en el generador y genera pestañas independientes en el mapa intermodular.
8. Recuerda simular el click() en el DOM para el nuevo tab en mapa-intermodular-view.component.spec.ts para mantener el 100% de cobertura en plantillas.
9. Silencia stderr en los tests espiando console.error en pruebas de error, y registra mockMapaFacade en app.spec.ts.

Al finalizar, ejecuta la suite de tests de frontend y backend, y documenta la tarea en tareas/.
```

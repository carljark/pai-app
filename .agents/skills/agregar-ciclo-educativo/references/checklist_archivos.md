# Checklist Integral para la Incorporación de un Ciclo Educativo (FP y ESO, Bilingüe ES/CA)

Las secciones 1 a 3 son la **ruta FP**; la sección 4, la **ruta ESO**. Cada nuevo ciclo formativo se incorpora **solo en el backend**: catálogo de niveles, datos curriculares y migraciones. El **mapa intermodular es opcional** (por defecto no se hace; las secciones marcadas «solo con mapa» se aplican únicamente si se pide). El frontend lo toma todo del catálogo (`GET /api/niveles`) y no se modifica. Utiliza este documento como referencia exacta de qué modificar y cómo, asegurando la plena paridad entre **Castellano** y **Catalán**.

---

## 1. Backend

### 1.1. Catálogo de niveles `niveles.ts`
- **Archivo:** `backend/src/data/niveles.ts` (fuente única de niveles; ver `documentation/niveles_educativos_y_catalogo.md`).
- **Modificación:** Añadir la entrada del ciclo con `id`, `etapa`, nombres oficiales ES/CA (TodoFP/BOE y CAIB/BOIB), `palabrasClave`, `unidad: 'RA'`, sus `cursos` con los `modulos` de cada uno en orden oficial y, solo con mapa, sus `mapas` (pestaña, curso y selección inicial). Con eso:
  - `Project.tipoNivel` y `RA.tipoNivel` aceptan el nuevo valor (se validan contra `NIVEL_IDS`);
  - con mapa, `MapaModule.tab` y `GET /api/mapa-intermodular?tab=` aceptan sus pestañas (`MAPA_TABS`);
  - `describeTargetCourse` usa el nombre oficial en el prompt (o `nombrePrompt_es/ca`);
  - el generador, el historial, «Mis proyectos», inicio, Taller, exportación y el mapa muestran el ciclo, sus cursos y sus módulos.
- **Test:** `backend/src/tests/niveles-catalogo.test.ts` comprueba que los `modulos` cubren exactamente los RA del ciclo y que todas las pestañas y niveles de las migraciones están en el catálogo; añade el dataset del ciclo a su lista.

### 1.2. Controlador `project.controller.ts` (Prompt IA Bilingüe)
- **Archivo:** `backend/src/controllers/project.controller.ts`
- **Sin cambios para el nombre del ciclo:** `describeTargetCourse` toma la denominación oficial ES/CA del catálogo (paso 1.1) según el idioma del proyecto. Solo hay que tocar el controlador si el ciclo necesita reglas de prompt propias, que irán en un helper aparte.

### 1.3. Archivo de Datos de RAs (Bilingüe Obligatorio)
- **Archivo:** `backend/src/data/ras_<etapa>_<slug>.data.ts` (`<etapa>` = `cfgm` o `cfgs`)
- **Estructura:** Array exportado `<ETAPA>_<SLUG>_RAS_DATA: any[]` con objetos conteniendo campos separados para ambos idiomas:
  ```typescript
  {
    id: 'RA1',
    module: '<Nombre en Catalán>',
    module_es: '<Denominación oficial BOE en Castellano>',
    module_ca: '<Nombre oficial en Catalán>',
    moduleCode: '0845',
    tipoNivel: 'CFGM_<SLUG>',
    description: '<Descripción en Catalán>',
    description_es: '<Descripción oficial BOE en Castellano>',
    description_ca: '<Descripción oficial en Catalán>',
    criterios_es: [
      'a) Se ha caracterizado...',
      'b) Se han seleccionado...'
    ],
    criterios_ca: [
      'a) S\'han caracteritzat...',
      'b) S\'han seleccionat...'
    ]
  }
  ```

### 1.4. Migración de Base de Datos
- **Archivo:** `backend/src/migrations/0X_ingest_cfgm_<slug>_ras.ts` (verificar el último número secuencial para no colisionar, e.g. `08_...`)
- **Patrón:**
  ```typescript
  import { RA } from '../models/RA';
  import { CFGM_<SLUG>_RAS_DATA } from '../data/ras_cfgm_<slug>.data';

  export const up = async () => {
    console.log('🔄 Sincronizando RAs de CFGM <Nombre>...');
    await RA.deleteMany({ tipoNivel: 'CFGM_<SLUG>' });
    const docs = CFGM_<SLUG>_RAS_DATA.map((ra: any) => ({
      id: ra.id,
      module: ra.module,
      module_es: ra.module_es,
      module_ca: ra.module_ca,
      moduleCode: ra.moduleCode,
      tipoNivel: ra.tipoNivel,
      description: ra.description_ca || ra.description,
      description_ca: ra.description_ca,
      description_es: ra.description_es,
      criterios_es: ra.criterios_es,
      criterios_ca: ra.criterios_ca
    }));
    await RA.insertMany(docs);
    console.log(`✅ Insertados ${docs.length} RAs para CFGM_<SLUG>.`);
  };
  ```

---

## 2. Frontend (sin cambios) y mapa intermodular (solo con mapa)

El frontend no lleva listas de niveles, claves de traducción por nivel ni RA de respaldo: no se toca. Solo se añade el ciclo al catálogo de prueba `frontend/src/app/testing/niveles.mock.ts` si algún spec lo necesita.

### 2.5. (Solo con mapa) Dataset del Mapa Intermodular (`mapa_cfgm_<slug>.json` y migración MongoDB)
- Debe generarse como JSON en `backend/src/data/mapa-intermodular/mapa_cfgm_<slug>.json` combinando los archivos `*_ES_*.md` y `*_CA_*.md`.
- Ingestarse en MongoDB mediante la migración correspondiente en la colección `mapamodules`.
- **REGLAS CRÍTICAS DE CONEXIONES Y ACTIVIDADES:**
  - **Cero conexiones vacías (`activities: []`):** Toda conexión DEBE incluir al menos una actividad formativa (`activities.length >= 1`). Nunca crear conexiones huérfanas sin actividades.
  - **Rango equilibrado de conexiones:** Entre 6 y 15 conexiones por RA (300 a 600 conexiones totales por curso).
  - **Deduplicación estricta:** Las actividades deben ser únicas dentro de cada RA (sin títulos repetidos).
- Cada elemento debe tener propiedades simétricas:
  - Módulos: `name_es`, `name_ca`.
  - RAs: `text_es`, `text_ca`, `criteria_es`, `criteria_ca`.
  - Conexiones: `title_es`, `title_ca`, `targetModuleName_es`, `targetModuleName_ca`, `targetRaText_es`, `targetRaText_ca`, `justification_es`, `justification_ca`.
  - Actividades: `title_es`/`title_ca`, `motivatingFactor_es`/`motivatingFactor_ca`, `description_es`/`description_ca`, `evidence_es`/`evidence_ca`, `diversitySupport_es`/`diversitySupport_ca`.

### 2.6. (Solo con mapa) Vista del Mapa Intermodular
- Sin cambios en la vista: el selector de ciclo, los botones de curso, el título y los textos («Retos CFGS», «Mòduls CFGM») salen de `mapas` y `etapa` del catálogo.

---

## 3. Blindaje de Tests, Cobertura y Limpieza de Consola

1. **(Solo con mapa) Simular la elección en el DOM:** En `mapa-intermodular-view.component.spec.ts`, elegir el ciclo en el desplegable y el curso con sus botones:
   ```typescript
   select.value = 'CFGM_<SLUG>';
   select.dispatchEvent(new Event('change'));
   fixture.detectChanges();
   (el.querySelectorAll('.mapa-tabs__curso')[1] as HTMLButtonElement).click();
   fixture.detectChanges();
   expect(component.facade.activeTab()).toBe('CFGM_<SLUG>_2');
   ```
2. **(Solo con mapa) Validación Bilingüe:** Verificar que al conmutar `layout.language.set('catalan')` y `layout.language.set('castellano')`, el DOM renderiza los textos en catalán y castellano respectivamente.
3. **Supresión Limpia de Errores en Tests:**
   - En pruebas que fuercen errores (`catch` / `throwError`), interceptar siempre `console.error` con `vi.spyOn(console, 'error')` para no ensuciar la salida `stderr` de Vitest.
   - En `app.spec.ts` (solo con mapa): Proporcionar `mockMapaFacade` para evitar peticiones HTTP accidentales durante las pruebas del componente raíz `App`.

4. **Siempre:** test de datos de backend con paridad ES/CA (mismos RA y criterios, textos distintos entre idiomas) y numeración consecutiva; el ciclo en `niveles-catalogo.test.ts`.

---

## 4. Ruta ESO

Referencia: ESO ordinaria (`ESO_ORDINARIA`, Decreto 42/2025), tareas 197, 200 y 202, y `documentation/niveles_educativos_y_catalogo.md`. **Caso A** = ampliar o actualizar `ESO_ORDINARIA`; **caso B** = otra ESO (`ESO_<SUFIJO>`).

### 4.1. Datos curriculares
- **Archivos:** `backend/src/data/curriculo-eso/<materia>.json` (caso A) o `backend/src/data/curriculo-eso-<sufijo>/<materia>.json` (caso B), uno por materia.
- **Formato:** `code`, `name_es/ca`, `cursos` (`{ "1º": "comun" | "opcion" | "optativa" }`) y `competencias[]` con `ce_id`, `ce_num`, `description_es/ca`, `descriptores` y `criterios[]` (`id`, `cursos`, `text_es/ca`, `aclaraciones_es/ca`).
- **Modelo:** `backend/src/models/CE.ts` (`subjectCode`, `subject_es/ca`, `subjectTipos`, `ce_num`, `descriptores`, `criteriosPorCurso`). No hace falta tocarlo salvo que el decreto aporte un dato nuevo.

### 4.2. Catálogo `niveles.ts`
- Caso A: sin cambios, salvo cursos, edades o decreto.
- Caso B: entrada con `etapa: 'ESO'`, `unidad: 'CE'`, `terminologia: 'situacion_aprendizaje'`, `cursos` con `edad` y **sin** `modulos`, `nombrePrompt_es/ca` y `palabrasClave`. Si es otra comunidad, ampliar el tipo `comunidad`.

### 4.3. Migración
- **Archivo:** `backend/src/migrations/NN_<reingest|ingest>_ces_eso_<sufijo>.ts`, con el siguiente número de dos dígitos.
- **Patrón:** el de `23_ingest_ces_eso_ordinaria.ts` (`ceDocsFromMateria`, `CE.deleteMany({ tipoNivel })` + `insertMany`). La 23 ya está aplicada en producción: un cambio de datos de `ESO_ORDINARIA` necesita una migración nueva.

### 4.4. Código (solo caso B)
Generalizar las comparaciones con `ESO_ORDINARIA` para que salgan del catálogo (tabla del paso E4 de `SKILL.md`):
- Backend: `services/eso-curriculum.service.ts`, `controllers/curriculum.controller.ts`, `controllers/project.controller.ts`, `services/criterios.service.ts`, `services/translation.service.ts` y, con mapa, `controllers/afinidades.controller.ts`.
- Frontend: `app.facade.ts` y `features/curriculum/services/curriculum.facade.ts`, con el nivel en `testing/niveles.mock.ts`.

### 4.5. (Solo con mapa) Mapa de afinidades
- `backend/src/data/afinidades-eso/*.json`, migración nueva sobre la colección `AfinidadEso` y pestañas `formato: 'afinidades'` en `mapas` del catálogo. El frontend (`AfinidadesEsoFacade`, `AfinidadesEsoViewComponent`, `AfinidadCardComponent`) no cambia.

### 4.6. Tests
- `backend/src/tests/eso.test.ts` (o uno nuevo en el caso B): paridad, tipos de materia, migración idempotente sin tocar el PDC, `GET /api/ces` por curso e idioma y prompt con edad y terminología LOMLOE.
- `niveles-catalogo.test.ts` y, con mapa, `afinidades-datos.test.ts` y `afinidades.test.ts`.
- Caso B: specs del frontend que comprueben que el nivel nuevo carga sus CE.

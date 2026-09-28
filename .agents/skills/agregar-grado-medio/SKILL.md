---
name: agregar-grado-medio
description: >-
  Procedimiento y guía técnica para incorporar nuevos ciclos formativos de Grado Medio (CFGM) a la plataforma Plappin con mínima información de entrada (nombre del ciclo y carpeta de archivos curriculares). Gestiona la integración end-to-end en backend, frontend, mapa intermodular, migraciones, traducciones y suite de tests con cobertura >= 90%.
---

# Skill: Incorporación de Ciclos Formativos de Grado Medio (CFGM)

Esta skill permite integrar cualquier nuevo ciclo de Grado Medio en Plappin de forma sistemática, bilingüe y sin fricción, aprovechando el estándar validado en **CFGM Estética y Belleza** y **CFGM Peluquería y Cosmética Capilar**.

---

## 1. Información Mínima Requerida y Fuentes Bilingües

Para iniciar la integración, el asistente solo necesita:

1. **Denominaciones oficiales del ciclo:**
   - **En castellano:** Denominación oficial estatal del BOE (ej. *"Peluquería y Cosmética Capilar"*, *"Cocina y Gastronomía"*).
   - **En catalán:** Denominación autonómica oficial de FP Illes Balears / CAIB (ej. *"Perruqueria i Cosmètica Capil·lar"*, *"Cuina i Gastronomia"*).
2. **Identificador / Slug:** Una palabra clave corta en minúsculas (ej. `cocina`, `automocion`, `peluqueria`), que determina `tipoNivel = 'CFGM_<SLUG_MAYUSCULAS>'` (ej. `CFGM_PELUQUERIA`).
3. **Carpeta de archivos curriculares:** Carpeta del ciclo formativo (ej. `add_mid_grades/Grado medio <nombre>/`). Debe contener:
   - Archivos de RAs y Criterios oficiales del BOE en castellano (`lista_RA_CE_..._ES_...md` o `RA_CE_..._1er_curso_ES.md`).
   - Archivos o traducciones normativas en catalán de los módulos y criterios.
   - Carpeta del Mapa Intermodular con los archivos pareados: `mapa_intermodular_*_ES_*.md` y `mapa_intermodular_*_CA_*.md`.

> [!IMPORTANT]
> **Regla de Oro Bilingüe:** NUNCA introduzcas texto en catalán en los campos `_es` (como `module_es`, `description_es` o `criterios_es`) ni texto en castellano en los campos `_ca`. Ambos idiomas deben convivir de forma completa, rigurosa y simétrica.

---

## 2. Flujo de Ejecución Paso a Paso

### Paso 1: Andamiaje Inicial (Scaffold)
Ejecutar el script asistente para generar los archivos base y calcular automáticamente el siguiente número secuencial de migración:

```bash
python3 .agents/skills/agregar-grado-medio/scripts/scaffold_cfgm.py \
  --slug <slug> \
  --name-es "<Nombre en Castellano>" \
  --name-ca "<Nombre en Catalán>"
```

Archivos generados:
- `backend/src/data/ras_cfgm_<slug>.data.ts`
- `backend/src/migrations/0X_ingest_cfgm_<slug>_ras.ts`
- `frontend/src/app/features/curriculum/data/ras_cfgm_<slug>.data.ts`
- `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm-<slug>.seed.ts`

---

### Paso 2: Extracción e Ingesta de RAs y Criterios (Bilingüe Estricto)
1. Extraer los RAs y criterios oficiales desde los documentos normativos:
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
     tipoNivel: "CFGM_<SLUG>",
     description: "<Descripción en Catalán>",
     description_es: "<Descripción oficial BOE en Castellano>",
     description_ca: "<Descripción oficial en Catalán>",
     criterios_es: [ "a) Se ha...", "b) Se han..." ],
     criterios_ca: [ "a) S'ha...", "b) S'han..." ]
   }
   ```

---

### Paso 3: Configuración en Backend y Prompt IA Bilingüe
1. **`backend/src/models/Project.ts`**: Añadir `'CFGM_<SLUG>'` al enum de `tipoNivel`.
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
   - Definir `const CFGM_<SLUG>_MODULE_ORDER = ['cod1', 'cod2', ...];` (códigos de 1.er curso).
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
3. **`generator-view.component.ts`**: Añadir el tab de nivel en la vista del formulario de generación.

---

### Paso 5: Semilla y Vista del Mapa Intermodular (Bilingüe Completo)
1. **Construcción de la semilla (`mapa-intermodular-cfgm-<slug>.seed.ts`):**
   - Procesar los pares de archivos `mapa_intermodular_*_ES_*.md` y `mapa_intermodular_*_CA_*.md` de 1.er curso.
   - Cada módulo debe incluir `name_es` y `name_ca`.
   - Cada RA debe incluir `text_es`, `text_ca`, `criteria_es` y `criteria_ca`.
   - Cada conexión debe incluir:
     - `title_es` y `title_ca`
     - `targetModuleName_es` y `targetModuleName_ca`
     - `targetRaText_es` y `targetRaText_ca`
     - `justification_es` y `justification_ca`
     - `relatedCriteria`: array con `moduleName_es`/`moduleName_ca` y `criteria_es`/`criteria_ca`
     - `activities`: array de actividades con `title_es`/`title_ca`, `motivatingFactor_es`/`motivatingFactor_ca`, `description_es`/`description_ca`, `evidence_es`/`evidence_ca`, `diversitySupport_es`/`diversitySupport_ca`.
2. **`mapa-intermodular.facade.ts`**: Añadir `'CFGM_<SLUG>'` a `activeTab` y vincular la carga de la semilla en `setTab()`.
3. **`mapa-intermodular-view.component.html`**:
   - Añadir botón tab con interpolación condicional: `{{ isCa() ? 'CFGM <Nombre CA>' : 'CFGM <Nombre ES>' }}`.
   - Ajustar títulos dinámicos en cabecera y etiquetas de actividades (`facade.activeTab() !== 'FPB'`).
4. **`mapa-intermodular-view.component.ts`**: Asignar `'CFGM_<SLUG>'` en `createProjectFromConnection()`.

---

### Paso 6: Ajuste de Vistas de Historial, Home y Perfil
Verificar que se emplee la clave `trans.t().courseLevelCFGM<CapitalizedSlug>` o `t().courseLevelCFGM<CapitalizedSlug>` en:
- `history-view.component.ts`
- `home-dashboard.component.ts`
- `personal-view.component.ts`
- `projects.facade.ts`

---

### Paso 7: Blindaje de Tests y Cobertura (100% en Plantillas)
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
2. En los demás spec (`generator-view`, `curriculum.facade`, `history-view`, `personal-view`), añadir assertions para `CFGM_<SLUG>` tanto en ES como en CA.

---

### Paso 8: Verificación y Documentación
1. Ejecutar el script de verificación integral:
   ```bash
   ./.agents/skills/agregar-grado-medio/scripts/verify_cfgm_integration.sh CFGM_<SLUG>
   ```
2. Comprobar que ambas suites pasan con el 100% de éxito:
   - Frontend: `npm test` con umbral de funciones en HTML >= 80% (o 100%).
   - Backend: `npm test`.
3. Documentar la tarea en `tareas/` siguiendo la regla global de `GEMINI.md` con el siguiente número secuencial (ej. `12X_incorporacion_cfgm_<slug>.md`).

---

## 3. Plantilla de Prompt para Delegar a Subagente

```text
Implementa el nuevo ciclo formativo CFGM <Nombre en Castellano> (<Nombre en Catalán>) con slug '<slug>' y tipoNivel 'CFGM_<SLUG>'.
Sigue estrictamente la skill en .agents/skills/agregar-grado-medio/SKILL.md y la checklist en .agents/skills/agregar-grado-medio/references/checklist_archivos.md.
Los archivos fuente se encuentran en: <ruta_carpeta>.

REQUISITOS BILINGÜES ESTRICTOS:
1. Extrae los nombres, descripciones y criterios oficiales en castellano del BOE para los campos _es.
2. Extrae o traduce al catalán balear de FP para los campos _ca. Nunca mezcles ambos idiomas.
3. Asegura el mapeo reactivo isCa en curriculum.facade.ts y la condición de idioma en targetCourseDescription en project.controller.ts.
4. Genera la semilla del mapa intermodular con conexiones y actividades completas en ambos idiomas (title_es/title_ca, etc.).
5. Recuerda simular el click() en el DOM para el nuevo tab en mapa-intermodular-view.component.spec.ts para mantener el 100% de cobertura en plantillas.

Al finalizar, ejecuta la suite de tests de frontend y backend, y documenta la tarea en tareas/.
```

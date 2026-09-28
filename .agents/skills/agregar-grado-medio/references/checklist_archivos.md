# Checklist Integral para la Incorporación de un CFGM (Bilingüe ES/CA)

Cada nuevo ciclo formativo de grado medio requiere actualizar **11 puntos clave** divididos entre Backend y Frontend. Utiliza este documento como referencia exacta de qué modificar y cómo, asegurando la plena paridad entre **Castellano** y **Catalán**.

---

## 1. Backend

### 1.1. Modelo `Project.ts`
- **Archivo:** `backend/src/models/Project.ts`
- **Modificación:** Añadir el nuevo identificador al enum de `tipoNivel`:
  ```typescript
  tipoNivel: { 
    type: String, 
    enum: ['FP_BASICA', 'DIVERSIFICACION_CURRICULAR', 'CFGM_ESTETICA', 'CFGM_PELUQUERIA', 'CFGM_<SLUG>'], 
    default: 'FP_BASICA' 
  }
  ```

### 1.2. Controlador `project.controller.ts` (Prompt IA Bilingüe)
- **Archivo:** `backend/src/controllers/project.controller.ts`
- **Modificación:** Respetar la variable `language` para que la IA reciba la denominación oficial exacta en el idioma seleccionado:
  ```typescript
  const targetCourseDescription = tipoNivel === 'CFGM_ESTETICA'
    ? (language === 'catalan' ? `${effectiveCourse} de CFGM Estètica i Bellesa` : `${effectiveCourse} de CFGM Estética y Belleza`)
    : (tipoNivel === 'CFGM_PELUQUERIA'
      ? (language === 'catalan' ? `${effectiveCourse} de CFGM Perruqueria i Cosmètica Capil·lar` : `${effectiveCourse} de CFGM Peluquería y Cosmética Capilar`)
      : (tipoNivel === 'CFGM_<SLUG>'
        ? (language === 'catalan' ? `${effectiveCourse} de CFGM <Nombre en Catalán>` : `${effectiveCourse} de CFGM <Nombre en Castellano>`)
        : (tipoNivel === 'DIVERSIFICACION_CURRICULAR'
          ? `${effectiveCourse} de ESO (Diversificación Curricular / PDC)`
          : `${effectiveCourse} de FP Básica (Formación Profesional Básica)`)));
  ```

### 1.3. Archivo de Datos de RAs (Bilingüe Obligatorio)
- **Archivo:** `backend/src/data/ras_cfgm_<slug>.data.ts`
- **Estructura:** Array exportado `CFGM_<SLUG>_RAS_DATA: any[]` con objetos conteniendo campos separados para ambos idiomas:
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

## 2. Frontend

### 2.1. Archivo de Datos Espejo (Frontend)
- **Archivo:** `frontend/src/app/features/curriculum/data/ras_cfgm_<slug>.data.ts`
- **Contenido:** Mismo contenido que en backend, importando la interfaz `CfgmRaData`:
  ```typescript
  import { CfgmRaData } from './ras_cfgm_estetica.data';
  export const CFGM_<SLUG>_RAS_DATA: CfgmRaData[] = [ ... ];
  ```

### 2.2. Facade Curricular (`curriculum.facade.ts`)
- **Archivo:** `frontend/src/app/features/curriculum/services/curriculum.facade.ts`
- **Modificaciones:**
  1. Importar `CFGM_<SLUG>_RAS_DATA`.
  2. Definir `const CFGM_<SLUG>_MODULE_ORDER = ['cód1', 'cód2', ...];`.
  3. Extender el tipo de unión: `'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR' | 'CFGM_ESTETICA' | 'CFGM_PELUQUERIA' | 'CFGM_<SLUG>'`.
  4. En `getStoredTipoNivel()`: añadir el caso.
  5. En `loadRas()`: añadir el fallback estático con mapeo `isCa`:
     ```typescript
     if (this.tipoNivel() === 'CFGM_<SLUG>' && list.length === 0) {
       list = CFGM_<SLUG>_RAS_DATA.map(r => ({
         id: r.id,
         module: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
         subject: isCa ? `${r.moduleCode}. ${r.module_ca}` : `${r.moduleCode}. ${r.module_es}`,
         description: isCa ? r.description_ca : r.description_es,
         tipoNivel: 'CFGM_<SLUG>',
         moduleCode: r.moduleCode,
         criterios: isCa ? r.criterios_ca : r.criterios_es
       } as any));
     }
     ```
  6. **Mapeo Reactivo Obligatorio:** En `groupedItems`, mapear reactivamente los campos para que la lista de la API respete el idioma activo:
     ```typescript
     list = list.map(r => ({
       ...r,
       module: isCa ? ((r as any).module_ca || r.module) : ((r as any).module_es || r.module),
       subject: isCa ? ((r as any).module_ca || r.subject || r.module) : ((r as any).module_es || r.subject || r.module),
       description: isCa ? ((r as any).description_ca || r.description) : ((r as any).description_es || r.description),
       criterios: isCa ? ((r as any).criterios_ca || (r as any).criterios) : ((r as any).criterios_es || (r as any).criterios)
     } as any));
     ```
  7. En la ordenación por curso: vincular `CFGM_<SLUG>_MODULE_ORDER`.

### 2.3. Traducciones (`translations.es.ts` y `translations.ca.ts`)
- **Archivos:** `frontend/src/app/services/translations.es.ts` y `translations.ca.ts`
- **Modificación:** Añadir clave con los nombres oficiales:
  - ES: `courseLevelCFGM<CapitalizedSlug>: 'CFGM <Nombre en Castellano>',`
  - CA: `courseLevelCFGM<CapitalizedSlug>: 'CFGM <Nombre en Catalán>',`

### 2.4. Vista del Generador (`generator-view.component.ts`)
- Añadir el botón tab en la plantilla inline de selección de nivel:
  ```html
  <div class="tabs-item" [class.active]="curriculum.tipoNivel() === 'CFGM_<SLUG>'" (click)="curriculum.setTipoNivel('CFGM_<SLUG>')">
    {{ trans.t().courseLevelCFGM<CapitalizedSlug> }}
  </div>
  ```

### 2.5. Dataset del Mapa Intermodular (`mapa_cfgm_<slug>.json` y migración MongoDB)
- Debe generarse como JSON en `backend/src/data/mapa-intermodular/mapa_cfgm_<slug>.json` combinando los archivos `*_ES_*.md` y `*_CA_*.md`.
- Ingestarse en MongoDB mediante la migración correspondiente en la colección `mapa_modules`.
- Cada elemento debe tener propiedades simétricas:
  - Módulos: `name_es`, `name_ca`.
  - RAs: `text_es`, `text_ca`, `criteria_es`, `criteria_ca`.
  - Conexiones: `title_es`, `title_ca`, `targetModuleName_es`, `targetModuleName_ca`, `targetRaText_es`, `targetRaText_ca`, `justification_es`, `justification_ca`.
  - Actividades: `title_es`/`title_ca`, `motivatingFactor_es`/`motivatingFactor_ca`, `description_es`/`description_ca`, `evidence_es`/`evidence_ca`, `diversitySupport_es`/`diversitySupport_ca`.

### 2.6. Vista del Mapa Intermodular (`mapa-intermodular-view.component.html`)
- Botón tab:
  ```html
  <button class="mapa-tab-btn" [class.active]="facade.activeTab() === 'CFGM_<SLUG>'" (click)="setTab('CFGM_<SLUG>')" ...>
    {{ isCa() ? 'CFGM <Nombre CA>' : 'CFGM <Nombre ES>' }}
  </button>
  ```
- Título dinámico:
  ```html
  {{ isCa() 
    ? (facade.activeTab() === 'CFGM_<SLUG>' ? 'Mapa intermodular del CFGM <Nombre CA>' : ...) 
    : (facade.activeTab() === 'CFGM_<SLUG>' ? 'Mapa intermodular del CFGM <Nombre ES>' : ...) }}
  ```

---

## 3. Blindaje de Tests y Cobertura (100% en Plantillas)

1. **Simular clic en DOM:** En `mapa-intermodular-view.component.spec.ts`, simular el clic en el botón del nuevo ciclo para cubrir la función compilada del template:
   ```typescript
   const tabBtns = fixture.nativeElement.querySelectorAll('.mapa-tab-btn') as NodeListOf<HTMLButtonElement>;
   tabBtns[nuevoIndice].click();
   fixture.detectChanges();
   expect(component.facade.activeTab()).toBe('CFGM_<SLUG>');
   ```
2. **Validación Bilingüe:** Verificar que al conmutar `layout.language.set('catalan')` y `layout.language.set('castellano')`, el DOM renderiza los textos en catalán y castellano respectivamente.

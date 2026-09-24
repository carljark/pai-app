# 112. Incorporación de la Pestaña de FP Grado Medio en el Histórico de Proyectos

## Propósito
Añadir una pestaña específica para los proyectos de **FP Grado Medio** (`CFGM Estética y Belleza`) en la vista de Histórico de Proyectos / Archivo ([`history-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.ts)), aislando los proyectos de Grado Medio de los de FP Básica y ESO (PDC). Además, se sincroniza esta categorización en los estados globales (`ProjectsFacade`, `AppFacade`), en el espacio personal (`PersonalViewComponent`) y en el panel principal (`HomeDashboardComponent`).

---

## Arquitectura y Flujo Técnico

### 1. Estado Reactivo de Pestañas (`ProjectsFacade` y `AppFacade`)
- Se extendió el tipo del signal `historyTab`:
  ```typescript
  historyTab = signal<'FPB' | 'CFGM' | 'ESO'>('FPB');
  ```
- Al generar un proyecto nuevo (`generateProject`), el sistema conmuta automáticamente `historyTab` a la pestaña correspondiente:
  - `CFGM_ESTETICA` -> `'CFGM'`
  - `DIVERSIFICACION_CURRICULAR` -> `'ESO'`
  - `FP_BASICA` -> `'FPB'`

### 2. Vista de Histórico / Archivo (`HistoryViewComponent`)
- **Pestañas de Navegación**:
  ```html
  <div class="history-tabs">
    <button class="history-tab" [class.active]="activeTab() === 'FPB'" (click)="activeTab.set('FPB')">
      {{ trans.t().courseLevelFP }}
    </button>
    <button class="history-tab" [class.active]="activeTab() === 'CFGM'" (click)="activeTab.set('CFGM')">
      {{ trans.t().courseLevelCFGM }}
    </button>
    <button class="history-tab" [class.active]="activeTab() === 'ESO'" (click)="activeTab.set('ESO')">
      {{ trans.t().courseLevelPDC }}
    </button>
  </div>
  ```
- **Filtrado Reactivo (`filteredProjects`)**:
  - `activeTab() === 'FPB'`: Muestra proyectos con `tipoNivel === 'FP_BASICA'` (o legados sin `tipoNivel` previo a la introducción de nuevos niveles).
  - `activeTab() === 'CFGM'`: Filtra proyectos con `tipoNivel === 'CFGM_ESTETICA'` o `tipoNivel` que empiece por `'CFGM'`.
  - `activeTab() === 'ESO'`: Filtra proyectos con `tipoNivel === 'DIVERSIFICACION_CURRICULAR'` o `'ESO'`.

### 3. Área Personal (`PersonalViewComponent`)
- Se añadió la píldora de filtro `CFGM` al selector de niveles: `levelFilter = signal<'ALL' | 'FPB' | 'CFGM' | 'ESO'>('ALL')`.
- Se adaptó la etiqueta de nivel educativo en las tarjetas para mostrar `courseLevelCFGM` cuando `tipoNivel === 'CFGM_ESTETICA'`.

### 4. Panel Principal (`HomeDashboardComponent`)
- Se adaptó la etiqueta de nivel en las tarjetas de actividad reciente para reflejar adecuadamente `courseLevelCFGM`.

---

## Archivos Modificados

1. [`frontend/src/app/features/projects/services/projects.facade.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/projects/services/projects.facade.ts):
   - Tipo de `historyTab` ampliado a `'FPB' | 'CFGM' | 'ESO'`.
   - Manejo de `CFGM_ESTETICA` en `generateProject`.
2. [`frontend/src/app/app.facade.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.facade.ts):
   - Sincronización de `historyTab` con el nivel `CFGM_ESTETICA` al iniciar la generación.
3. [`frontend/src/app/features/history/components/history-view/history-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.ts):
   - Inclusión del botón de pestaña `CFGM` (`{{ trans.t().courseLevelCFGM }}`).
   - Discriminación y filtrado estricto por nivel educativo en `filteredProjects`.
4. [`frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.spec.ts):
   - Pruebas unitarias para conmutación y filtrado de la nueva pestaña `CFGM`.
5. [`frontend/src/app/features/projects/services/projects.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/projects/services/projects.facade.spec.ts):
   - Test para generación con `CFGM_ESTETICA` y selección automática de `historyTab = 'CFGM'`.
6. [`frontend/src/app/app.facade.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/app.facade.spec.ts):
   - Test para cambio a `historyTab = 'CFGM'` en `AppFacade`.
7. [`frontend/src/app/features/personal/components/personal-view/personal-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/personal/components/personal-view/personal-view.component.ts) y [`.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/personal/components/personal-view/personal-view.component.spec.ts):
   - Soporte de filtro y badge de `CFGM`.
8. [`frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts) y [`.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.spec.ts):
   - Soporte de badge para `CFGM`.

---

## Verificación y Pruebas

- **Backend Tests (`npm run test`)**: ✅ **120/120 tests pasados (100%)**.
- **Frontend Tests (`npm test`)**: ✅ **381/381 tests pasados (100%)** con un **95.19%** de cobertura de ramas (*branch coverage*).
- **Compilación de producción (`npm run build`)**: ✅ Exit code 0.

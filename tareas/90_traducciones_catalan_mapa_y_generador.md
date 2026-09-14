# Tarea 90: Completar Traducciones al Catalán (Mapa Intermodular y Nuevo Proyecto) y Preselección de Metodología

## Propósito
El objetivo de esta tarea ha sido doble:
1. **Auditoría y finalización de la localización al catalán:** Resolver inconsistencias y textos pendientes en castellano en las vistas de "Nuevo Proyecto" y "Mapa Intermodular", abarcando tanto el backend (mapeo bilingüe de áreas curriculares de ESO como "Ámbito Sociolingüístico" y módulos de FPB como "Proyecto inter modular de aprendizaje colaborativo") como el frontend (título dinámico de tooltip en conexiones, nombres de módulos relacionados, etiquetas de modales de generación/cola/borrado y pestañas curriculares).
2. **Preselección por defecto de Metodología:** Asegurar que en "Nuevo Proyecto" el `<select>` de "Tipo de Proyecto (Metodología)" aparezca seleccionado con la primera opción (`ABP (Aprendizaje Basado en Problemas / Proyectos)`) en lugar de presentarse en blanco.

## Arquitectura y Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND UI                           │
│  - GeneratorView: Tab ESO -> {{ trans.t().courseLevelPDC }} │
│  - Select Metodología -> 'ABP (Aprendizaje Basado en...)'   │
│  - MapaIntermodularView: Tooltip conexiones bilingüe        │
│  - RecentActivityModal & Modales globales bilingües         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     TranslationService        │   │       CurriculumFacade        │
│  - Modularización en diccs    │   │  - Inyección reactiva Layout  │
│  - translations.ca.ts         │   │  - Fallback bilingüe FP Bàsica│
│  - translations.es.ts         │   └──────────────┬────────────────┘
└───────────────────────────────┘                  │
                                                   │ GET /api/ras?lang=ca
                                                   │ GET /api/ces?lang=ca
                                                   ▼
                                    ┌───────────────────────────────┐
                                    │      CurriculumController     │
                                    │  - Mapeo esToCa (Áreas)       │
                                    │  - Mapeo esToCaModules        │
                                    │  - Funciones puras mapRa/Ce   │
                                    └───────────────────────────────┘
```

1. **Flujo de selección en Nuevo Proyecto:**
   - `ProjectsFacade` inicializa la señal `methodology` con el valor exacto `'ABP (Aprendizaje Basado en Problemas / Proyectos)'`, coincidiendo estrictamente con el atributo `value` del primer `<option>`. El selector HTML sincroniza su estado de forma inmediata al renderizarse.
   - La pestaña de nivel para diversificación curricular utiliza la clave reactiva `{{ trans.t().courseLevelPDC }}` garantizando paridad bilingüe (`ESO (PDC)`).
2. **Flujo de traducción curricular (Backend):**
   - Al solicitar `/api/ces?lang=catalan`, `getCes` procesa los registros de la colección de MongoDB utilizando `esToCa` para normalizar tanto el área (`Ámbito Sociolingüístico` -> `Àmbit Sociolingüístic`, `Ámbito Científico y Tecnológico` -> `Àmbit Científic i Tecnològic`) como la asignatura.
   - Al solicitar `/api/ras?lang=catalan`, `getRas` traduce el módulo de integración práctica de FPB (`Proyecto inter modular de aprendizaje colaborativo` -> `Projecte inter modular d'aprenentatge col·laboratiu`).
3. **Flujo de modales y actividades en Frontend:**
   - `AppFacade` emplea claves dinámicas de `TranslationService` para alertas críticas (`modalAttention`, `modalSelectAtLeastOne`, `modalProjectQueued`, `modalProjectQueuedDesc`, `modalProjectGenerated`, etc.).
   - `RecentActivityModalComponent` y `MapaIntermodularViewComponent` eliminan los literales fijos (`title="Connexions"` -> `[title]="isCa() ? 'Connexions' : 'Conexiones'"`).

## Archivos Modificados / Creados

- **Backend:**
  - `backend/src/controllers/curriculum.controller.ts`: Incorporación de `esToCaModules`, extensión de `esToCa` con `"Ámbito Sociolingüístico"` y refactorización a funciones puras `mapRa` y `mapCe` (< 100 líneas).
  - `backend/src/tests/curriculum.test.ts`: Nuevos tests unitarios verificando la traducción al catalán de módulos y áreas curriculares.
- **Frontend:**
  - `frontend/src/app/features/projects/services/projects.facade.ts`: Corrección del valor inicial del signal `methodology`.
  - `frontend/src/app/features/projects/services/projects.facade.spec.ts`: Test unitario comprobando la preselección correcta de metodología.
  - `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`: Pestaña reactiva `{{ trans.t().courseLevelPDC }}`.
  - `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html`: Tooltip bilingüe para el conteo de conexiones y fallback seguro de nombres de módulos relacionados.
  - `frontend/src/app/features/curriculum/services/curriculum.facade.ts`: Inyección reactiva opcional de `LayoutService` y fallback lingüístico dinámico en `selectedItemsDetails`.
  - `frontend/src/app/features/curriculum/services/curriculum.facade.spec.ts`: Test para el fallback bilingüe en catalán.
  - `frontend/src/app/services/translations.ca.ts`: Diccionario modularizado de traducciones en catalán (creado para cumplir límite estricto de <200 líneas).
  - `frontend/src/app/services/translations.es.ts`: Diccionario modularizado de traducciones en castellano.
  - `frontend/src/app/services/translation.service.ts`: Refactorizado a un servicio ultraligero (15 líneas) que conmuta entre ambos diccionarios mediante signals computados.
  - `frontend/src/app/app.facade.ts`: Internacionalización completa de los títulos y descripciones de modales informativos y de confirmación.
  - `frontend/src/app/app.facade.spec.ts`: Actualización de mocks para inyectar `TRANSLATIONS_ES` en el servicio de traducción.
  - `frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts`: Internacionalización de cabecera, prefijos de autor y estados.

## Detalles Técnicos
- **Cumplimiento estricto de límites:**
  - Todos los ficheros nuevos y modificados se mantienen estrictamente por debajo de las 200 líneas (ej. `curriculum.controller.ts` con 94 líneas, `translation.service.ts` con 15 líneas, `translations.ca.ts` con 156 líneas).
  - Ningún método supera las 25 líneas.
- **Signals y Reactividad pura (Angular 18):**
  - No se añadieron hooks de ciclo de vida imperativos (`ngOnInit`).
  - La sincronización entre el estado de idioma y la UI se gestiona mediante `computed()` reactivos.
- **Cobertura y Verificación:**
  - Backend: 102/102 tests superados con >90% de cobertura en todas las métricas (98.13% Statements, 90.57% Branches, 100% Functions, 98.63% Lines).
  - Frontend: 330/330 tests superados con >90% de cobertura en todas las métricas (99.08% Statements, 95.52% Branches, 97.81% Functions, 99.59% Lines).
  - Hook `./.git/hooks/pre-push` verificado con salida exitosa (código 0).

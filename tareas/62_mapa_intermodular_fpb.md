# Tarea 62: Implementación del Mapa Intermodular FPB

## Propósito
Implementar un módulo visual interactivo denominado **"Mapa Intermodular"** en la aplicación Plappin, siguiendo las especificaciones pedagógicas de `Plantillas coincidencias FPB/` y `Propmpt MAPA INTERMODULAR.docx`.

El objetivo es permitir al equipo docente de FP Básica (Peluquería y Estética) explorar de forma visual, ágil y estructurada las interconexiones curriculares a partir de los 9 documentos oficiales de relación de criterios y actividades:
1. Conectar Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE) técnicos con los ámbitos transversales y el resto de módulos del ciclo (3005, 3065, 3042, 3009, 3011, 3062, 3159, 3064, 3063).
2. Estructurar las **115 coincidencias intermodulares** (puntos de cruce curricular) y sus justificaciones pedagógicas bilingües.
3. Incorporar las **805 propuestas de actividades y proyectos interdisciplinares** (7 actividades desarrolladas por cada una de las 115 coincidencias), adaptadas al perfil del alumnado de FPB (~15 años, con instrucciones paso a paso, medidas de atención a la diversidad, evidencias y factores motivadores).
4. Facilitar el salto directo a la creación de proyectos mediante un botón de exportación/generación conectado con el generador base.

---

## Arquitectura y Componentes Creados

```mermaid
graph TD
    Sidebar[Sidebar Navigation Item 'Mapa Intermodular'] -->|switchView('mapa')| AppHTML[app.html conditional view]
    AppHTML --> MapaComp[MapaIntermodularViewComponent]
    MapaComp --> MapaFacade[MapaIntermodularFacade]
    MapaFacade --> MapaSeed[Seed Data: 9 Módulos FPB, 115 Conexiones y 805 Actividades]
    MapaFacade --> LayoutService[LayoutService: language & navigation]
    MapaComp -->|createProjectFromConnection| LayoutService
```

### 1.- **Modelos de Datos (`models/mapa-intermodular.model.ts`):**
  - `FPBModule`: Código, nombre (ES/CA), tipo (específico/transversal), color, icono y lista de RAs (`learningOutcomes`).
  - `LearningOutcome`: Identificador, código (`RA1`..`RA4`), texto oficial (ES/CA), criterios de evaluación oficiales (`criteria_es` / `criteria_ca`) y conexiones intermodulares (`connections`).
  - `IntermodularConnection`: Título de coincidencia, módulo destino, texto del RA destino, criterios propios implicados (`sourceCriteria`), lista de módulos y criterios relacionados (`relatedCriteria: RelatedCriteriaItem[]`), justificación curricular y 7 actividades prácticas.
  - `IntermodularActivity`: Título, contexto/idea motivadora (`motivatingFactor`), desarrollo real pautado (`description`), producto/evidencia (`evidence`) y medidas de atención a la diversidad FPB (`diversitySupport`).
  - `motivatingFactor_es` / `motivatingFactor_ca`: Idea motivadora, contexto profesional o toque actual.
  - `description_es` / `description_ca`: **Desarrollo completo y detallado** de la actividad extraído de los documentos de trabajo.
  - `evidence_es` / `evidence_ca`: Producto final, entregable evaluable o evidencia de aprendizaje.
  - `diversitySupport_es` / `diversitySupport_ca`: Medidas de atención a la diversidad FPB (DUA, lectura fácil, apoyos visuales y roles cooperativos).

### 2. Capa de Datos Estática (`data/mapa-intermodular.seed.ts`)
- Ingesta estructurada y completa de los **11 módulos oficiales** de la carpeta `Plantillas coincidencias FPB`:
  1. `3060` Preparación del entorno profesional (10 coincidencias, 70 actividades)
  2. `3061` Cuidados estéticos básicos de uñas (14 coincidencias, 98 actividades)
  3. `3005` Atención al cliente (14 coincidencias, 98 actividades)
  4. `3065` Cambios de color del cabello (15 coincidencias, 105 actividades)
  5. `3042` Ciencias aplicadas II (12 coincidencias, 84 actividades)
  6. `3009` Ciencias aplicadas I (11 coincidencias, 77 actividades)
  7. `3011` Comunicación y sociedad I (10 coincidencias, 70 actividades)
  8. `3062` Depilación mecánica y decoloración del vello superfluo (12 coincidencias, 84 actividades)
  9. `3159` Itinerario personal para la empleabilidad (12 coincidencias, 84 actividades)
  10. `3064` Lavado y cambios de forma del cabello (15 coincidencias, 105 actividades)
  11. `3063` Maquillaje (14 coincidencias, 98 actividades)
- **Total:** 11 módulos, 139 coincidencias curriculares y 973 actividades desarrolladas de forma exhaustiva con su contenido original.

### 3. Fachada de Estado Reactiva (`services/mapa-intermodular.facade.ts`)
- Estado gestionado exclusivamente con **Angular 18 Signals** (`signal`, `computed`).
- Filtros reactivos por búsqueda de texto y tipo de módulo (`all`, `especifico`, `transversal`), así como por tipo de relación competencial.
- Estadísticas computadas en tiempo real (9 módulos, 115 conexiones, 805 actividades).
- Generación de resúmenes textuales para portapapeles y exportación bilingüe.

### 4. Vista de Usuario (`components/mapa-intermodular-view/mapa-intermodular-view.component.ts`)
- Componente standalone con plantilla y estilos encapsulados.
- Header informativo con contadores estadísticos en tiempo real.
- Selector de módulos con filtrado rápido e indicador de RAs.
- Panel principal con detalle del RA seleccionado, badges temáticos, tarjetas de interconexión con justificación didáctica y desglose completo de las 7 actividades prácticas.
- Botones de acción: Copiar resumen pedagógico al portapapeles y saltar al Generador de Proyectos.

---

## Archivos Modificados / Creados

1. `frontend/src/app/features/mapa-intermodular/models/mapa-intermodular.model.ts` (Creado)
2. `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` (Generado con los 9 módulos, 115 coincidencias y 805 actividades)
3. `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` (Creado)
4. `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts` (Creado)
5. `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts` (Creado)
6. `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.spec.ts` (Creado)
7. `frontend/src/app/layout/components/sidebar/sidebar.component.ts` (Modificado: añadido botón de navegación con icono)
8. `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts` (Modificado: mock de traducción)
9. `frontend/src/app/services/layout.service.ts` (Modificado: añadido tipo `'mapa'`)
10. `frontend/src/app/services/translation.service.ts` (Modificado: etiquetas bilingües de navegación)
11. `frontend/src/app/app.html` & `app.ts` & `app.spec.ts` (Modificado: enrutamiento de vista)

---

## Cobertura y Verificación
- **Frontend Vitest:** 26 archivos de test, **268 tests pasados (100%)**.
  - Statements: 99.04%
  - Branches: 95.79%
  - Functions: 97.37%
  - Lines: 99.58%
- **Backend Vitest:** 11 archivos de test, **61 tests pasados (100%)**.
  - Branches: 95.55%
  - Functions: 97.64%
  - Lines: 99.44%
  - `mapa-intermodular-view.component.ts`: 100% Funciones, >98% Líneas y Sentencias.
- **Backend Vitest:** 11 archivos de test, **61 tests pasados (100%)**.
- **Build de producción:** Ejecución exitosa de `npm run build`.

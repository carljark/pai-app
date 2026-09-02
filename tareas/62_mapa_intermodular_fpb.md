# Tarea 62: Implementación del Mapa Intermodular FPB

## Propósito
Implementar un módulo visual interactivo denominado **"Mapa Intermodular"** en la aplicación Plappin, siguiendo las especificaciones pedagógicas de `Plantillas coincidencias FPB/` y `Propmpt MAPA INTERMODULAR.docx`.

El objetivo es permitir al equipo docente de FP Básica (Peluquería y Estética) explorar de forma visual, ágil y estructurada las interconexiones curriculares entre los 13 módulos del ciclo formativo:
1. Conectar Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE) técnicos con los ámbitos transversales (Ciencias Aplicadas I y II, Comunicación y Sociedad I y II, Itinerario Personal para la Empleabilidad I y II, y Proyecto Intermodular).
2. Justificar pedagógicamente cada cruce formativo.
3. Proponer actividades interdisciplinares contextualizadas y adaptadas al perfil del alumnado de FPB (~15 años, riesgo de abandono escolar, necesidad de aprendizajes prácticos y significativos).
4. Facilitar el salto directo a la creación de proyectos mediante un botón de exportación/generación conectado con el generador base.

---

## Arquitectura y Componentes Creados

```mermaid
graph TD
    Sidebar[Sidebar Navigation Item 'Mapa Intermodular'] -->|switchView('mapa')| AppHTML[app.html conditional view]
    AppHTML --> MapaComp[MapaIntermodularViewComponent]
    MapaComp --> MapaFacade[MapaIntermodularFacade]
    MapaFacade --> MapaSeed[Seed Data: 13 Módulos FPB, RAs, Conexiones y Actividades]
    MapaFacade --> LayoutService[LayoutService: language & navigation]
    MapaComp -->|createProjectFromConnection| LayoutService
```

### 1. Modelos de Datos (`models/mapa-intermodular.model.ts`)
- `FPBModule`: Estructura del módulo (código, nombre en castellano/valenciano, tipo `especifico`/`transversal`, horas, curso, color distintivo, RAs).
- `LearningOutcome`: RA con código, descripción bilingüe, criterios asociados y lista de conexiones intermodulares.
- `IntermodularConnection`: Conexión entre el RA del módulo de origen y otro módulo diana, con tipo de relación (`ciencias`, `comunicacion`, `empleabilidad`, `tecnica`, `sostenibilidad`, `digital`, `cliente`), justificación pedagógica bilingüe y actividades sugeridas.
- `IntermodularActivity`: Propuesta didáctica con título, descripción, competencias clave y productos entregables.

### 2. Capa de Datos Estática (`data/mapa-intermodular.seed.ts`)
- Ingesta estructurada y completa de los 13 módulos oficiales de FPB Peluquería y Estética:
  - Módulos específicos: 3060 (Lavado y cambios de forma), 3061 (Cambios de color), 3062 (Cuidado de uñas), 3063 (Maquillaje), 3064 (Depilación), 3065 (Atención al cliente), 3066 (Preparación del entorno).
  - Módulos transversales: 3009 (Ciencias Aplicadas I), 3010 (Ciencias Aplicadas II), 3011 (Comunicación y Sociedad I), 3012 (Comunicación y Sociedad II), 3013 (Itinerario Personal para la Empleabilidad I), 3014 (Itinerario Personal para la Empleabilidad II / Proyecto).

### 3. Fachada de Estado Reactiva (`services/mapa-intermodular.facade.ts`)
- Estado gestionado exclusivamente con **Angular 18 Signals** (`signal`, `computed`).
- Filtros reactivos por búsqueda de texto y tipo de módulo (`all`, `especifico`, `transversal`).
- Estadísticas computadas en tiempo real (módulos totales, RAs totales, conexiones totales, actividades disponibles).
- Generación de resúmenes textuales para portapapeles.

### 4. Vista de Usuario (`components/mapa-intermodular-view/mapa-intermodular-view.component.ts`)
- Componente standalone con plantilla y estilos encapsulados.
- Header informativo con contadores estadísticos.
- Selector lateral de módulos con acordeón para explorar sus RAs.
- Panel principal con detalle del RA seleccionado, badges temáticos por tipo de competencia/módulo, tarjetas de interconexión con justificación didáctica y desglose de actividades paso a paso.
- Botones de acción: Copiar resumen pedagógico al portapapeles y saltar al Generador de Proyectos.

---

## Archivos Modificados / Creados

1. `frontend/src/app/features/mapa-intermodular/models/mapa-intermodular.model.ts` (Creado)
2. `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` (Creado)
3. `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` (Creado)
4. `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts` (Creado)
5. `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts` (Creado)
6. `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.spec.ts` (Creado)
7. `frontend/src/app/layout/components/sidebar/sidebar.component.ts` (Modificado: añadido botón de navegación con icono de nodos interconectados)
8. `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts` (Modificado: añadido mock de traducción `sidebarMapa`)
9. `frontend/src/app/services/layout.service.ts` (Modificado: añadido tipo `'mapa'` a `currentView`)
10. `frontend/src/app/services/translation.service.ts` (Modificado: añadidas etiquetas de navegación bilingües)
11. `frontend/src/app/app.html` & `app.ts` & `app.spec.ts` (Modificado: enrutamiento de vista `@if (layout.currentView() === 'mapa')`)

---

## Cobertura y Verificación
- **Frontend Vitest:** 26 archivos de test, **263 tests pasados (100%)**.
  - Statements: 98.93%
  - Branches: 95.55%
  - Functions: 97.64%
  - Lines: 99.44%
  - `mapa-intermodular-view.component.ts`: 100% Funciones, >98% Líneas y Sentencias.
- **Backend Vitest:** 11 archivos de test, **61 tests pasados (100%)**.
- **Build de producción:** Ejecución exitosa de `npm run build`.

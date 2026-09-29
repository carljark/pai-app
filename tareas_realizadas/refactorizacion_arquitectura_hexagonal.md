# Refactorización a Arquitectura Hexagonal - Mapa Intermodular

## Fecha
2025-01-23

## Resumen
Refactorización del módulo `mapa-intermodular` siguiendo el patrón de Arquitectura Hexagonal (Ports and Adapters), separando claramente los componentes de la interfaz de usuario (UI) de la lógica de negocio (facade) mediante aliases de ruta TypeScript.

## Cambios Realizados

### 1. Configuración de Aliases de Ruta (`tsconfig.json`)
**Archivo:** `frontend/tsconfig.json`

- Agregado `"baseUrl": "."` para habilitar el uso de paths
- Agregado `"ignoreDeprecations": "6.0"` para silenciar la advertencia de deprecación de `baseUrl`
- Configurado el alias de ruta:
  ```json
  "paths": {
    "@mapa-intermodular/*": ["src/app/features/mapa-intermodular/*"]
  }
  ```
- Esto permite referenciar módulos internos del feature `mapa-intermodular` usando `@mapa-intermodular/` en lugar de rutas relativas profundas.

### 2. Componentes UI Extracción
**Directorio:** `frontend/src/app/features/mapa-intermodular/components/ui/`

Se extrajeron los siguientes componentes UI como componentes standalone, separándolos de la lógica de presentación:

#### Componentes Creados (7/7)

| Componente | Archivo | Líneas | Descripción |
|-----------|---------|--------|-------------|
| **MapaTabsComponent** | `tabs/tabs.component.ts` | 49 | Pestañas de navegación entre niveles (FPB, CFGM Estètica, CFGM Perruqueria 1r/2n) |
| **MapaHeaderComponent** | `header/header.component.ts` | 157 | Encabezado del mapa con estadísticas y búsqueda |
| **ModuloListComponent** | `modulo-list/modulo-list.component.ts` | 97 | Lista de módulos con resultados de aprendizaje y RAs |
| **RaDetailComponent** | `ra-detail/ra-detail.component.ts` | 127 | Detalle de RA con selector de criterios |
| **ConnectionsListComponent** | `connections-list/connections-list.component.ts` | 168 | Lista de conexiones intermodulares coincidentes |
| **ActivitiesGridComponent** | `activities-grid/activities-grid.component.ts` | 61 | Cuadrícula de actividades propuestas |
| **CriterionSelectorComponent** | `criterion-selector/criterion-selector.component.ts` | 73 | Selector de criterios de evaluación |

#### Características de los componentes UI:
- **Standalone**: Todos los componentes son standalone (`standalone: true`)
- **Sin dependencia directa del facade**: Los componentes no inyectan directamente el `MapaIntermodularFacade`; reciben datos vía `@Input()` y emiten eventos vía `@Output()`
- **Solo dependencia del layout**: Usan `LayoutService` exclusivamente para el idioma
- **Límite de 200 líneas**: Todos los componentes están por debajo de este límite (promedio: 92 líneas)

### 3. Actualización de Imports
**Archivo afectado:** `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts`

- Actualizado el import para usar el alias de ruta:
  ```typescript
  // Antes
  import { MapaIntermodularFacade } from '../../services/mapa-intermodular.facade';
  
  // Después
  import { MapaIntermodularFacade } from '@mapa-intermodular/services/mapa-intermodular.facade';
  ```

- Imports de UI Components actualizados a paths relativos (ya que están dentro del feature):
  ```typescript
  import { MapaTabsComponent } from '../ui/tabs/tabs.component';
  import { MapaHeaderComponent } from '../ui/header/header.component';
  import { ModuloListComponent } from '../ui/modulo-list/modulo-list.component';
  import { RaDetailComponent } from '../ui/ra-detail/ra-detail.component';
  import { ConnectionsListComponent } from '../ui/connections-list/connections-list.component';
  ```

### 4. Naming de Proyectos Mejorado
**Archivo:** `frontend/src/app/features/projects/services/projects.facade.ts`

Modificado el método `getInvolvedModules()` para resolver nombres de proyectos basados en los módulos/ asignaturas seleccionadas:

- **Para CFGM_PELUQUERIA**: Itera sobre el orden de módulos por curso (1º/2º) y busca los códigos en los RAs seleccionados, devolviendo nombres descriptivos
- **Para CFGM_ESTETICA**: Devuelve los nombres de los módulos seleccionados via `subject`
- **Para FP_BASICA y DIVERSIFICACION_CURRICULAR**: Devuelve las unidades de aprendizaje (subject) seleccionadas

## Arquitectura Hexagonal

La refactorización sigue los principios de Arquitectura Hexagonal:

```
┌────────────────────────────────────────────────────────────────┐
│                    MapaIntermodularFeature                      │
├────────────────────────────────────────────────────────────────┤
│  PORT (Facade)      │  COMPONENTS (UI)   │  MODELS (Core)       │
│  - MapaIntermodular │  - TabsComponent  │  - LearningOutcome   │
│    Facade            │  - HeaderComponent │  - Connection       │
│  - State management  │  - ModuloListComponent│  - Activity      │
│  - Business logic    │  - RaDetailComponent │                    │
│                       │  - ConnectionsListComponent│             │
│                       │  - ActivitiesGridComponent│              │
│                       │  - CriterionSelectorComponent│            │
│                       │                   │                   │
│  ADAPTER (View)       │  UI Components    │  Data Models       │
│  - mapa-intermodular- │  Pure presentation│  No logic         │
│    view.component.ts  │  - @Input/@Output │                   │
└────────────────────────────────────────────────────────────────┘
```

**Principios aplicados:**
- **Separación de concerns**: UI (componentes) separada de lógica de negocio (facade)
- **Dependencia unidireccional**: Los componentes UI no conocen el facade directamente; reciben datos via inputs
- **Testabilidad**: Cada componente puede testearse de forma aislada con inputs simulados
- **Reusabilidad**: Los componentes UI son reutilizables fuera del contexto del mapa

## Archivos Modificados
1. `frontend/tsconfig.json` - Alias de ruta agregado
2. `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts` - Imports actualizados
3. `frontend/src/app/features/projects/services/projects.facade.ts` - Naming de proyectos mejorado

## Archivos Creados (7 componentes UI)
1. `frontend/src/app/features/mapa-intermodular/components/ui/tabs/tabs.component.ts`
2. `frontend/src/app/features/mapa-intermodular/components/ui/header/header.component.ts`
3. `frontend/src/app/features/mapa-intermodular/components/ui/modulo-list/modulo-list.component.ts`
4. `frontend/src/app/features/mapa-intermodular/components/ui/ra-detail/ra-detail.component.ts`
5. `frontend/src/app/features/mapa-intermodular/components/ui/connections-list/connections-list.component.ts`
6. `frontend/src/app/features/mapa-intermodular/components/ui/activities-grid/activities-grid.component.ts`
7. `frontend/src/app/features/mapa-intermodular/components/ui/criterion-selector/criterion-selector.component.ts`

## Verificación
- Build exitoso: `npm run build` → exit code 0
- TypeScript: La configuración `baseUrl` + `paths` funciona correctamente
- Todos los componentes UI compilan sin errores
# 18. Refactorización a Vertical Slices (Feature-Sliced Design) y Signals

**Propósito:** 
El componente principal `app.ts` estaba acumulando demasiada lógica (monolito) y se estaba mezclando la capa de infraestructura/datos con la vista. Para garantizar la escalabilidad, profesionalismo y facilidad de mantenimiento, hemos iniciado una refactorización arquitectónica basándonos en **Vertical Slices** (DDD). 
Además, se ha sustituido por completo el uso del ciclo de vida tradicional (`ngOnInit`) de Angular por la reactividad pura y sincrónica mediante **Signals** (`effect`, `computed`, `untracked`), que es el estándar moderno de Angular 18.

**Arquitectura/Flujo:**
- Hemos creado una nueva carpeta estructural base para aislar las funcionalidades de la aplicación: `frontend/src/app/features/`.
- Cada *Feature* se dividirá estrictamente en:
  - `components/`: Componentes UI mudos (*dumb components*) o inteligentes limitados a esa característica.
  - `services/`: Fachadas (*Facades*) que orquestan el estado (con Signals) y las llamadas a la API de esa feature, ocultando la complejidad a los componentes UI.
  - `mappers/`: Clases puras o funciones encargadas de mapear la información cruda (ej. `RawNotificationEvent` en formato JSON-Wire) a entidades de negocio ricas y estrictamente tipadas (`AppNotification`).
  - `models/`: Interfaces y Tipos de TypeScript exclusivos de la feature.

**Archivos Modificados y Creados:**
- Se ha creado la estructura del dominio **Notifications**:
  - `features/notifications/models/notification.model.ts`: Define las entidades de evento raw y evento parseado.
  - `features/notifications/mappers/notification.mapper.ts`: Orquesta la conversión segura de los strings genéricos enviados por el backend (EventSource) a objetos usables, inyectándoles ID y Date.
  - `features/notifications/services/notifications.facade.ts`: Mantiene el estado centralizado de notificaciones (Signal) y encapsula el motor de escucha SSE asíncrono aislando esta lógica de `app.ts`.
  - `features/notifications/components/notifications-badge/notifications-badge.component.ts`: Píldora amarilla animada que ahora es 100% reutilizable e independiente (standalone).

- `frontend/src/app/app.ts`: 
  - Eliminado por completo `OnInit` y la importación de ciclos de vida.
  - Limpiado el método de instanciación del SSE manual que ensuciaba la lógica; ahora `app.ts` simplemente se suscribe reactivamente a `notificationsFacade.latestNotification()` mediante un `effect()` ligero que, si no hay notificaciones previas o arroja error, fuerza la recarga silenciosa del historial.
  - Reemplazo del componente en la plantilla `app.html` por `<app-notifications-badge>`.

**Detalles Técnicos:**
El uso combinado de `computed()` sobre el Signal base permite recalcular instintivamente cuántas tareas asíncronas siguen activas sin necesidad de suscribirse a nada. El `untracked()` dentro de los Effects evita que las lecturas a `currentUser` provoquen ciclos infinitos al escribir señales derivadas o refrescar historiales.

Se ha comprobado que todos los constructores y sintaxis TypeScript compilan limpiamente en el build.
- Se ha extraído también el dominio **Admin**:
  - `features/admin/models/admin.model.ts`: Tipado de AdminUser, CenterSettings y ActivityLog.
  - `features/admin/services/admin.facade.ts`: Fachada para orquestar llamadas de administración y Signals.
  - `features/admin/components/admin-dashboard`: Componente de interfaz movido a su correcta ubicación de feature slice y refactorizado a Signals puros.
- Se ha extraído también el dominio **Curriculum**:
  - `features/curriculum/services/curriculum.facade.ts`: Lógica de carga de Resultados de Aprendizaje y Criterios de Evaluación, selección de items, y agrupación de la interfaz.
  - `features/curriculum/components/curriculum-selector`: Un nuevo componente reutilizable que renderiza tanto los Acordeones de selección a la izquierda como el "Carrito Flotante" (Floating Action Box) a la derecha, limpiando cientos de líneas de HTML del `app.html` original.
- Se ha extraído el dominio final **Proyectos**:
  - `features/projects/services/projects.facade.ts`: Ahora encapsula todo el estado complejo del taller (`currentProjectId`, `isGenerating`, `projectFiles`, historiales) y las llamadas directas al backend (generación, reescritura con IA, subida/borrado de archivos, exportación a Word/PDF).
  - El monolítico `app.ts` ha quedado reducido a un controlador de vistas y orquestador ligero que simplemente inyecta las fachadas (`AuthFacade`, `NotificationsFacade`, `AdminFacade`, `CurriculumFacade`, `ProjectsFacade`), eliminando la deuda técnica y garantizando escalabilidad y fácil mantenimiento siguiendo los principios del *Feature-Sliced Design*.

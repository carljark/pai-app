# Diseño Técnico: Buzón de Sugerencias y Errores, Carpeta de Aprendizaje (CA) para FPB y Área Personal de Proyectos

## 1. Propósito
Este desarrollo responde a una triple necesidad operativa y pedagógica trasladada por el equipo docente:
1. **Buzón de Sugerencias o Reporte de Errores**: Proporcionar un canal ágil y estructurado para que el profesorado pueda comunicar incidencias o sugerir mejoras desde la aplicación, permitiendo a los administradores revisar, actualizar el estado (pendiente, en revisión, resuelto, descartado) e incorporar notas de respuesta visibles para el docente.
2. **Propuesta de Actividad para Carpeta de Aprendizaje (CA) en FP Básica**: Garantizar por prescripción pedagógica que, al generar proyectos dirigidos a Formación Profesional Básica, el motor de inteligencia artificial obligatoriamente proponga y detalle una actividad clave o evidencia formativa para que el alumnado la preserve en su Carpeta de Aprendizaje (CA), con criterios e instrumentos de autoevaluación/coevaluación.
3. **Área Personal con Proyectos Propios**: Ofrecer a cada docente un espacio propio, privado y ordenado con métricas en tiempo real (total de proyectos, borradores, publicados, en cola/generando), filtros multidimensionales (nivel FPB/ESO y estado), buscador rápido y acciones directas (abrir editor, reintentar errores, eliminar), complementando el repositorio global del centro ("Historial").

---

## 2. Arquitectura y Flujo

```
               ┌────────────────────────────────────────────────────────┐
               │                        Docente                         │
               └───────────┬────────────────────────────────┬───────────┘
                           │                                │
           [Envío sugerencia / error]             [Navegación / Gestión]
                           │                                │
                           ▼                                ▼
              ┌─────────────────────────┐      ┌─────────────────────────┐
              │  FeedbackViewComponent  │      │  PersonalViewComponent  │
              └────────────┬────────────┘      └────────────┬────────────┘
                           │                                │
                           ▼                                ▼
              ┌─────────────────────────┐      ┌─────────────────────────┐
              │     FeedbackService     │      │     ProjectsFacade      │
              └────────────┬────────────┘      └────────────┬────────────┘
                           │                                │
                HTTP POST /api/feedback           GET /api/projects?mine=true
                           │                                │
                           ▼                                ▼
              ┌─────────────────────────┐      ┌─────────────────────────┐
              │   FeedbackController    │      │    ProjectController    │
              └────────────┬────────────┘      └────────────┬────────────┘
                           │                                │
              ┌────────────┴────────────┐                   │
              │                         │                   │
              ▼                         ▼                   ▼
    ┌──────────────────┐      ┌──────────────────┐ ┌──────────────────┐
    │  Mongoose Model  │      │   ActivityLog    │ │    BasePrompt    │
    │    (Feedback)    │      │  (Audit Trails)  │ │ (CA Injection FPB│
    └──────────────────┘      └──────────────────┘ └──────────────────┘
              ▲
              │ HTTP PATCH /api/feedback/:id/status
              │
    ┌─────────────────────────┐
    │  AdminDashboardComp.    │ (Gestión de tickets, estados y notas administrativas)
    └─────────────────────────┘
```

1. **Flujo de Feedback / Buzón**:
   - El docente accede a la vista `feedback` desde la barra lateral.
   - Selecciona el tipo (`sugerencia` o `error`), redacta asunto y descripción, y envía el formulario.
   - El backend registra la sugerencia con asociación al usuario (`userId`, `userName`, `userEmail`) y crea una entrada en `ActivityLog`.
   - El administrador, desde el panel de control (`AdminDashboardComponent`), visualiza el contador de pendientes, revisa la lista, modifica el estado (`pendiente`, `en_revision`, `resuelto`, `descartado`) y añade observaciones (`adminNotes`).
   - El docente ve sus envíos reflejados en tiempo real con las respuestas del administrador y su estado actual.

2. **Flujo de Carpeta de Aprendizaje (CA) para FPB**:
   - En el momento en que se solicita la generación de un proyecto (`ProjectController.generateProjectAi`), el backend evalúa `req.body.tipoNivel`.
   - Si `tipoNivel === 'FP_BASICA'`, inyecta una directriz curricular estricta e imperativa tanto en las instrucciones en castellano como en valenciano/catalán.
   - El prompt compele a la IA a incluir un apartado explícito denominado "Actividad para la Carpeta de Aprendizaje (CA)" con la descripción de la tarea, formato de entrega, rúbrica o criterios de autoevaluación, y justificación pedagógica en el contexto de FPB.

3. **Flujo de Área Personal**:
   - Desde el sidebar lateral se incorpora el enlace directo a `personal` ("Área Personal").
   - El componente `PersonalViewComponent` consume `ProjectsFacade.myProjects()`, una señal calculada (`computed`) que filtra los proyectos pertenecientes al usuario conectado o solicita proyectos con el parámetro `?mine=true`.
   - Presenta un cuadro de mando con 4 métricas calculadas automáticamente (Total, Borradores, Publicados, En Cola/Generando), filtros de nivel (Todos, FPB, ESO) y de estado (Todos, Borrador, Publicado, Error), y un campo de búsqueda en vivo.
   - Permite saltar al generador con un clic mediante `LayoutService.switchView('generator')` o interactuar directamente con los proyectos (abrir en taller, reintentar fallos o borrar).

---

## 3. Archivos Modificados y Creados

### Backend
- `backend/src/models/Feedback.ts` *(nuevo)*: Esquema Mongoose para el modelo de feedback (`userId`, `userName`, `userEmail`, `type`, `title`, `description`, `status`, `adminNotes`).
- `backend/src/controllers/feedback.controller.ts` *(nuevo)*: Controlador con operaciones `listFeedbacks`, `createFeedback`, `updateFeedbackStatus` y `deleteFeedback` con logs de actividad auditados.
- `backend/src/routes/feedback.routes.ts` *(nuevo)*: Rutas protegidas bajo `/api/feedback` mediante middleware de autenticación JWT y autorización de administrador.
- `backend/src/controllers/project.controller.ts`: 
  - Soporte para consulta de proyectos propios (`?mine=true` o visibilidad compartida del centro).
  - Inyección de instrucciones curriculares para la Carpeta de Aprendizaje (CA) en FP Básica en prompts en castellano y catalán.
- `backend/src/controllers/auth.controller.ts`: Incorporación del `email` en el payload del JWT firmado para su uso en logs y feedback.
- `backend/src/server.ts`: Registro del endpoint `/api/feedback`.
- `backend/src/tests/feedback.test.ts` *(nuevo)*: Suite integral de pruebas unitarias y de integración para feedback y buzón.
- `backend/src/tests/projects.test.ts`: Pruebas añadidas para filtrado `mine=true` y verificación de autorización de autor.
- `backend/src/tests/testUtils.ts`: Actualización de utilidades de test con inclusión de email en tokens de prueba.

### Frontend
- `frontend/src/app/services/translations.es.ts`: Claves de internacionalización en castellano para el buzón de sugerencias, área personal y etiquetas del historial.
- `frontend/src/app/services/translations.ca.ts`: Claves de internacionalización en catalán/valenciano correspondientes.
- `frontend/src/app/services/layout.service.ts`: Integración de los tipos de vista `'personal'` y `'feedback'`.
- `frontend/src/app/services/layout.service.spec.ts`: Pruebas de navegación para las nuevas vistas.
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`: Inclusión de botones de navegación directa para "Área Personal" y "Buzón de Sugerencias".
- `frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts`: Pruebas unitarias actualizadas para verificar clicks de navegación.
- `frontend/src/app/features/feedback/models/feedback.model.ts` *(nuevo)*: Interfaces TypeScript para la entidad de Feedback.
- `frontend/src/app/features/feedback/services/feedback.service.ts` *(nuevo)*: Servicio reactivo con Signals para operaciones CRUD de sugerencias e incidencias.
- `frontend/src/app/features/feedback/services/feedback.service.spec.ts` *(nuevo)*: Tests del servicio con simulación de llamadas HTTP.
- `frontend/src/app/features/feedback/components/feedback-view/feedback-view.component.ts` *(nuevo)*: Componente interactivo para docentes con envío de tickets y visualización de respuestas.
- `frontend/src/app/features/feedback/components/feedback-view/feedback-view.component.spec.ts` *(nuevo)*: Cobertura exhaustiva al 100% en declaraciones, ramas, funciones y líneas.
- `frontend/src/app/features/personal/components/personal-view/personal-view.component.ts` *(nuevo)*: Vista del Área Personal del docente con dashboard de métricas, filtros y acciones.
- `frontend/src/app/features/personal/components/personal-view/personal-view.component.spec.ts` *(nuevo)*: Tests del área personal que validan filtrado, métricas reactivas y clicks del DOM.
- `frontend/src/app/features/history/components/history-view/history-view.component.ts`: Indicador del autor del proyecto, insignia "Mío" y conmutador "Todos los proyectos" / "Solo mis proyectos".
- `frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`: Cobertura del historial con pruebas de filtrado por autor y proyectos propios.
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts`: Sección de administración del buzón con cambio de estados, guardado de notas y borrado.
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts`: Tests añadidos para gestión del buzón y visualización condicional.
- `frontend/src/app/features/projects/services/projects.facade.ts`: Signal computada `myProjects` para desacoplar los proyectos propios del historial global.
- `frontend/src/app/features/projects/services/projects.facade.spec.ts`: Tests para la señal computada `myProjects`.
- `frontend/src/app/app.ts`: Registro de componentes `PersonalViewComponent` y `FeedbackViewComponent`.
- `frontend/src/app/app.html`: Montaje condicional en la plantilla principal de la aplicación.
- `frontend/src/app/app.spec.ts`: Pruebas de integración para las nuevas vistas en el contenedor raíz.

---

## 4. Detalles Técnicos y Decisiones de Diseño

### 4.1 Reactividad y Arquitectura con Signals en Angular
- Se ha seguido rigurosamente el patrón de arquitectura por capas y Vertical Slices establecido en el proyecto.
- Los componentes `PersonalViewComponent` y `FeedbackViewComponent` implementan estado reactivo basado en Angular Signals (`signal` y `computed`), evitando suscripciones manuales en plantillas y maximizando el rendimiento del motor de detección de cambios (OnPush-friendly).
- En el Área Personal, las métricas (`totalCount`, `draftsCount`, `publishedCount`, `inQueueCount`) y el listado de proyectos (`filteredMyProjects`) se computan reactivamente a partir de los datos en caché de `ProjectsFacade.myProjects()`, combinando filtros de nivel (`ALL`, `FPB`, `ESO`), estado (`borrador`, `publicado`, `error`) y cadena de texto en minúsculas sin acentos.

### 4.2 Restricciones de Acceso y Visibilidad Multiusuario
- En `ProjectController.listProjects`:
  - Los administradores (`req.user.role === 'admin'`) tienen visibilidad total sobre todos los proyectos del sistema.
  - Para los profesores (`teacher`):
    - Si se especifica el query param `mine=true`, la consulta filtra estrictamente por `{ userId: req.user._id }`.
    - Si no se especifica `mine=true`, la consulta retorna tanto los proyectos creados por el propio usuario como los proyectos con estado `publicado` de otros compañeros del mismo centro, fomentando la reutilización de materiales compartidos en el instituto.

### 4.3 Directiva Curricular Estricta para FP Básica (Carpeta de Aprendizaje - CA)
- En la generación del prompt del sistema (función `generateProjectAi`), se detecta `tipoNivel === 'FP_BASICA'`.
- Se añade el siguiente requerimiento técnico explícito tanto en español como en catalán:
  ```text
  PROPUESTA OBLIGATORIA PARA CARPETA DE APRENDIZAJE (CA):
  Debes incluir obligatoriamente dentro del desarrollo del proyecto al menos UNA actividad clave
  o evidencia formativa relevante que el alumnado de Formación Profesional Básica deba guardar
  en su Carpeta de Aprendizaje (CA). Describe con claridad la tarea, los instrumentos/criterios
  de autoevaluación o coevaluación y su valor para evidenciar el logro de las competencias.
  ```
- Este requerimiento garantiza que el modelo lingüístico estructure siempre un apartado específico dedicado a la evidencia para la CA del alumno.

### 4.4 Cobertura de Código y Calidad del Software
- Se realizaron ejecuciones rigurosas del hook `./.git/hooks/pre-push` y de los suites unitarios de Vitest con verificación mediante `check-coverage.js`.
- **Frontend**: 31 archivos de prueba, 365 tests pasando al 100%. Cobertura global:
  - Declaraciones (Stmts): 99.11% (umbral >= 90%)
  - Ramas (Branch): 95.64% (umbral >= 90%)
  - Funciones (Funcs): 97.60% (umbral >= 90%)
  - Líneas (Lines): 99.65% (umbral >= 90%)
- **Backend**: 15 archivos de prueba, 115 tests pasando al 100%. Cobertura global > 90% en todas las métricas.

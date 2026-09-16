# Tarea 101: Corrección de Curso Seleccionado en la Generación de Proyectos (3º vs 4º ESO / FPB)

## Propósito
Resolver la discrepancia por la cual, al seleccionar 3º de ESO en Diversificación Curricular (PDC) —siendo este el valor por defecto—, el proyecto generado por la inteligencia artificial aparecía dirigido a 4º de ESO en lugar de a 3º de ESO. 

Asimismo, asegurar la coherencia completa del curso seleccionado en todo el ciclo de vida:
1. En el formulario de generación (`GeneratorViewComponent`).
2. En la construcción del prompt del sistema y de usuario del backend (`ProjectController`).
3. En el filtrado de criterios de evaluación oficiales de las Competencias Específicas (CE) y Resultados de Aprendizaje (RA).
4. En la persistencia del modelo del proyecto (`Project.courseLevel`).
5. En la visualización de los proyectos en la interfaz (Taller, Historial, Área Personal y Dashboard Home).

---

## Arquitectura y Flujo

```
   [Usuario selecciona 3º ESO PDC]
                  │
                  ▼
         [CurriculumFacade] 
        curso = signal('3º')
                  │
                  ▼
         [ProjectsFacade]
    generateProject({ courseLevel: '3º', tipoNivel: 'DIVERSIFICACION_CURRICULAR', ... })
                  │  POST /api/projects/generate
                  ▼
      [backend: ProjectController]
   1. effectiveCourse = courseLevel || defaultCourse ('3º')
   2. targetCourseDescription = "3º de ESO (Diversificación Curricular / PDC)"
   3. filterCriteriaByCourse(rawList, effectiveCourse):
        - Mantiene criterios de 3º ESO (ej: "3º ESO - 1.1", "1.1 (3º ESO)")
        - Excluye criterios específicos de 4º ESO (ej: "4º ESO - 1.1")
        - Formatea objetos a texto legible (evita '[object Object]')
   4. baseInstruction: REGLA CRÍTICA INQUEBRANTABLE SOBRE EL CURSO
   5. userPrompt: INSTRUCCIÓN OBLIGATORIA DE CURSO Y NIVEL ("EXCLUSIVAMENTE 3º...")
   6. new Project({ ..., courseLevel: '3º' }).save()
                  │
                  ▼
           [Queue Worker]
        Ejecución IA con Prompt Estricto
                  │
                  ▼
   [Interfaces UI: Taller / Historial / Personal / Home]
   Muestran explícitamente "3º ESO (PDC)" o el curso correspondiente
```

---

## Causa Raíz Identificada

El error se debía a la conjunción de tres factores críticos en el pipeline de generación:

1. **Inyección indiscriminada de Criterios de Evaluación Oficiales de ambos cursos**:
   - En la base de datos de CEs bilingües (`ces_eso_bilingual.json`), cada Competencia Específica contiene criterios tanto de 3º de ESO como de 4º de ESO (e.g. `3º ESO - 1.1` hasta `1.3`, y `4º ESO - 1.1` hasta `1.3`).
   - El enriquecimiento previo de RAs/CEs no filtraba los criterios por curso y los mapeaba con `${c}` directamente sobre objetos `{ criterio_id, description }`, lo que generaba cadenas `[object Object]` o listas donde los criterios de 4º ESO sobreescribían el foco cognitivo de la IA.
2. **Sesgo en ejemplos de referencia (INTEF)**:
   - Los ejemplos didácticos de repositorios oficiales inyectados en el contexto global (`intef_examples.json`) pertenecen predominantemente a 4º de ESO (ej. proyectos de Lengua, ODS, etc.). Al no existir una prohibición expresa de cambio de curso en el prompt, el modelo tendía a mimetizar el curso 4º de los ejemplos.
3. **Falta de persistencia de `courseLevel` en el modelo `Project`**:
   - El esquema de base de datos (`ProjectSchema`) no almacenaba el curso seleccionado (`courseLevel`), dificultando tanto la trazabilidad como la presentación del curso concreto en los badges de la aplicación.
4. **Sincronización del DOM en el `<select>` del generador**:
   - En Angular, `<select [value]="curriculum.curso()">` con bloques condicionales `@if/@else` se beneficia de la directiva `[selected]` explícita en cada elemento `<option>` para garantizar que el DOM nativo permanezca estrictamente sincronizado tras cambios de pestaña o re-renderizados.

---

## Archivos Modificados

### Backend
- [`backend/src/models/Project.ts`](file:///Users/csgj/dev/pai-app/backend/src/models/Project.ts):
  - Añadido campo `courseLevel: String` al esquema `ProjectSchema`.
- [`backend/src/controllers/project.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/project.controller.ts):
  - Creadas y exportadas las funciones auxiliares `formatCriterion` y `filterCriteriaByCourse`.
  - En `generateProject`:
    - Cálculo de `effectiveCourse` y `targetCourseDescription` detallada (ej: `3º de ESO (Diversificación Curricular / PDC)`).
    - Inclusión de la **Regla Crítica Inquebrantable sobre el Curso y Nivel Educativo** en `baseInstruction`.
    - Filtrado estricto de criterios de evaluación en `enrichedRas` con `filterCriteriaByCourse`, asegurando que no se mezclen criterios de 4º en proyectos de 3º (ni viceversa).
    - Formateo de criterios con `formatCriterion` para evitar cadenas `[object Object]` cuando los criterios son objetos.
    - Instrucción obligatoria en `userPrompt` exigiendo que en el apartado "Identidad del Proyecto" figure exactamente el curso solicitado y prohibiendo cualquier cambio.
    - Persistencia de `courseLevel: effectiveCourse` al instanciar `new Project(...)`.
- [`backend/src/tests/projects.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/projects.test.ts):
  - Añadido bloque `describe('Course Level & Criteria Filtering')`:
    - Tests unitarios para `formatCriterion`.
    - Tests unitarios para `filterCriteriaByCourse`.
    - Tests de integración de `POST /api/projects/generate` verificando que un proyecto de 3º incluye solo criterios de 3º, excluye los de 4º, y contiene las directivas estrictas de curso en el prompt.
    - Tests de integración verificando el comportamiento recíproco para proyectos de 4º.

### Frontend
- [`frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/generator/components/generator-view/generator-view.component.ts):
  - Añadido `[selected]="curriculum.curso() === '...'"` en las opciones de 1º, 2º, 3º y 4º del selector `#generator-course-select`.
- [`frontend/src/app/features/taller/components/taller-view/taller-view.component.html`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/taller/components/taller-view/taller-view.component.html):
  - Visualización de `project.courseLevel` junto al nivel educativo en el listado de proyectos anteriores.
- [`frontend/src/app/features/personal/components/personal-view/personal-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/personal/components/personal-view/personal-view.component.ts):
  - Inclusión del curso en el badge de nivel (`{{ project.courseLevel ? project.courseLevel + ' ' : '' }}`).
- [`frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts):
  - Inclusión de `courseLevel` en las tarjetas de proyectos recientes del dashboard principal.
- [`frontend/src/app/features/history/components/history-view/history-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.ts):
  - Renderizado de etiqueta visual destacando el curso concreto (`project.courseLevel`) en cada fila del historial.

---

## Detalles Técnicos y Decisiones de Diseño

1. **Algoritmo de Filtrado por Curso (`filterCriteriaByCourse`)**:
   - Detecta si el criterio de evaluación posee marcas explícitas de curso curricular usando expresiones regulares flexibles: `/(?:[1-4])[º|ª|o|\.]?\s*(?:de\s*)?(?:ESO|FP)|\([1-4][º|o]?\s*(?:ESO|FP)\)/i`.
   - Si el criterio menciona explícitamente un curso (e.g. `3º ESO - 1.1` o `1.2 (4º ESO)`), se comprueba que coincida con el dígito del curso objetivo (`targetDigit`). Si no coincide, se excluye.
   - Si el criterio es transversal o no especifica curso particular (como los criterios de Competencia Ciudadana o genéricos), se conserva para ambos niveles.
2. **Formateo de Criterios (`formatCriterion`)**:
   - Soporta de forma polimórfica tanto cadenas directas como objetos de catálogo `{ criterio_id: string, description: string }`. Extrae limpiamente el código y la descripción, evitando el fallo de serialización a `[object Object]`.
3. **Aislamiento en Prompts contra Sesgo de Ejemplos**:
   - Los LLMs son propensos al aprendizaje en contexto (*in-context learning*) y pueden copiar detalles de los ejemplos provistos si no se especifican restricciones negativas. Se incorporó en `baseInstruction` la directiva explícita de que los ejemplos de INTEF de otros cursos (como 4º) son solo de inspiración metodológica y no deben modificar el curso solicitado.
4. **Verificación de Cobertura y Estabilidad**:
   - Cobertura Backend tras la implementación: **90.53% de ramas**, 98.46% de sentencias (120 tests unitarios/integración pasando).
   - Cobertura Frontend: **95.57% de ramas**, 99.11% de sentencias (370 tests pasando).
   - Verificación estricta mediante ejecución del script `./.git/hooks/pre-push`.

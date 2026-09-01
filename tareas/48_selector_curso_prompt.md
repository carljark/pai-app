# Tarea 48: Selector de Curso e Inyección en Identidad del Proyecto

## Propósito
El usuario ha solicitado añadir un "Selector de curso" en la vista del Generador de Proyectos. Las opciones de este selector deben cambiar dependiendo del nivel educativo seleccionado:
- **FP Básica:** 1º y 2º
- **ESO (Diversificación):** 3º y 4º

Además, este dato debe llegar al backend para ser inyectado como una regla fuerte en el prompt de la Inteligencia Artificial (Gemini), forzando a que el documento generado contenga un apartado de "Identidad del Proyecto" donde conste el curso elegido.

## Arquitectura/Flujo
1. **Frontend (Estado):**
   - En `CurriculumFacade` se ha añadido la Signal `curso` con valor por defecto `'1º'`.
   - Se ha adaptado el método `setTipoNivel` para que, cuando el usuario cambie de etapa educativa, el curso por defecto se actualice en consonancia ('1º' para FPB, '3º' para ESO).

2. **Frontend (UI):**
   - En `generator-view.component.ts` se ha insertado un nuevo bloque de pestañas a la derecha del selector de nivel.
   - Mediante un bloque `@if` condicional, se muestran unos botones (1º y 2º) u otros (3º y 4º) que actualizan reactivamente el estado de `curso`.
   - Se han añadido las traducciones correspondientes (`generatorCourseLabel`).

3. **Frontend a Backend (Comunicación):**
   - En `ProjectsFacade.generateProject()`, se ha pasado de un `courseLevel` estático (previamente "1º Curso") al valor extraído directamente del facade reactivo (`this.curriculumFacade.curso()`).

4. **Backend (Prompt Engineering):**
   - En el `project.controller.ts`, el `req.body` ahora desestructura `courseLevel`.
   - Se ha modificado el `userPrompt` que se envía a la IA de Gemini. Se ha inyectado el nombre del curso y se ha añadido la cláusula:
     > *INSTRUCCIÓN OBLIGATORIA: En el documento generado, incluye obligatoriamente un apartado o epígrafe inicial titulado "Identidad del Proyecto" donde indiques explícitamente el curso al que va dirigido...*

5. **Testing Automatizado:**
   - Se han actualizado los `mocks` de `mockCurriculumFacade` en `projects.facade.spec.ts`, `generator-view.component.spec.ts` y `app.spec.ts` para que expongan `curso` y `setCurso`.
   - Se han arreglado las aserciones de payload que esperaban un string de curso distinto. Cobertura global conservada sobre el 95%.

## Archivos Modificados
- `frontend/src/app/services/translation.service.ts`: Diccionarios de curso (ES/CA).
- `frontend/src/app/features/curriculum/services/curriculum.facade.ts`: Estado Signal del curso.
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`: UI del selector.
- `frontend/src/app/features/projects/services/projects.facade.ts`: Inyección de curso en payload.
- `backend/src/controllers/project.controller.ts`: Modificación del prompt de generación (AI).
- Modificaciones en archivos `.spec.ts` de Test.

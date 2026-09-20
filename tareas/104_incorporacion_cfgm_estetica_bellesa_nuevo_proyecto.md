# Tarea 104: Incorporación de CFGM Estètica i Bellesa a Nuevo proyecto

## Propósito
Añadir la opción de titulación "CFGM Estètica i Bellesa" en la sección de "Nuevo proyecto" de la plataforma, manteniendo un flujo de creación equivalente al de FP Básica, pero utilizando datos curriculares (módulos, RA y criterios de evaluación) específicos para los módulos de 1r curso de este Ciclo Formativo de Grado Medio, en idioma catalán.

## Arquitectura y Flujo
- **Backend:** Se creó una migración que ingiere los resultados de aprendizaje (RA) del documento `.md` proporcionado, guardándolos en la base de datos con `tipoNivel = 'CFGM_ESTETICA'` y añadiendo el `moduleCode`. Se actualizó el modelo `RA.ts` y `Project.ts` para admitir el nuevo nivel, así como la lógica del controlador `project.controller.ts` para generar el `aiPrompt` correctamente (indicando "1º de CFGM Estètica i Bellesa") y filtrar las coincidencias. También se modificó el controlador `curriculum.controller.ts` para que sirva los nuevos campos en la respuesta, de manera que el frontend pueda aplicar los filtros correctos.
- **Frontend:** En `curriculum.facade.ts`, se añadió `CFGM_ESTETICA` a las tipologías admitidas y se ajustó la lógica para que sirva los módulos de este nivel cuando está seleccionado. En `generator-view.component.ts`, se agregó un tab extra (que se muestra solo cuando está seleccionado CFGM), junto al filtrado específico de la opción de curso (que restringe la selección a 1r curso). En el área del portafolio (Personal/History), se ajustaron los filtros `matchLevel` para que muestre los proyectos generados de CFGM junto con los de FPB bajo la pestaña actual de FPB (o como parte del mismo bloque, según se hace hasta ahora). Se actualizaron los ficheros de traducciones (`ca` y `es`).

## Archivos Modificados
- `backend/src/models/RA.ts` (modificado)
- `backend/src/models/Project.ts` (modificado)
- `backend/src/controllers/project.controller.ts` (modificado)
- `backend/src/controllers/curriculum.controller.ts` (modificado)
- `backend/src/tests/projects.test.ts` (modificado)
- `backend/src/migrations/04_ingest_cfgm_estetica_ras.ts` (nuevo)
- `backend/ras_cfgm_estetica.json` (nuevo)
- `frontend/src/app/features/curriculum/services/curriculum.facade.ts` (modificado)
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts` (modificado)
- `frontend/src/app/features/projects/services/projects.facade.ts` (modificado)
- `frontend/src/app/features/history/components/history-view/history-view.component.ts` (modificado)
- `frontend/src/app/features/personal/components/personal-view/personal-view.component.ts` (modificado)
- `frontend/src/app/services/translations.ca.ts` (modificado)
- `frontend/src/app/services/translations.es.ts` (modificado)
- `tareas/104_incorporacion_cfgm_estetica_bellesa_nuevo_proyecto.md` (nuevo)

## Detalles Técnicos
- El proceso de parsing del fichero `.md` original a `.json` requirió un script local temporal. Las enumeraciones de los módulos extraídos se limitaron exclusivamente a los 9 módulos de primer curso.
- Para el prompt del backend, el `targetCourseDescription` se actualizó explícitamente para indicar que corresponde a alumnado de "CFGM Estètica i Bellesa".
- El modelo `Project` y `RA` fueron flexibilizados para incluir el enum o tipo correspondiente.
- Se ha respetado que NO haya regresión en la lógica de 'FP Básica'.
- Cobertura de tests añadida en `projects.test.ts` para testear el endpoint con `tipoNivel = 'CFGM_ESTETICA'`.

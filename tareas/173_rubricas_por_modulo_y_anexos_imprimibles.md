# Tarea 173: Rúbricas por módulo y anexos imprimibles en la generación

## Propósito
1. Además de la rúbrica de todo el proyecto, generar una rúbrica independiente para cada módulo implicado, de modo que cada docente pueda evaluar su módulo por separado.
2. Incluir anexos imprimibles con el material que necesitan las actividades.

## Arquitectura y flujo
Ambos cambios son reglas nuevas en el prompt de sistema (`baseInstruction`) de `generateProject` (`backend/src/controllers/project.controller.ts`). Se guardan en `aiInstruction` y las usa la cola de generación sin más cambios.

- **REGLA CRÍTICA INQUEBRANTABLE SOBRE LAS RÚBRICAS** (tras la regla de evaluación):
  - una rúbrica global del proyecto;
  - una rúbrica por cada módulo profesional (o materia/ámbito en ESO), bajo el encabezado "Rúbrica del módulo <código y nombre oficial>", solo con los RA/CE de ese módulo y su numeración oficial;
  - formato de la Guía Maestra (`knowledge_base.md`): cuatro niveles, traducidos al idioma de salida, y hechos observables.
- **REGLA CRÍTICA INQUEBRANTABLE SOBRE LOS ANEXOS IMPRIMIBLES**:
  - apartado final "Anexos" con fichas, plantillas, guiones, listas de cotejo y cuestionarios de auto y coevaluación;
  - anexos numerados, vinculados a su actividad y referenciados desde ella ("Material: Anexo 3");
  - contenido completo, no solo descrito, en Markdown imprimible con espacios para rellenar.

## Archivos modificados
1. `backend/src/controllers/project.controller.ts`: las dos reglas nuevas.
2. `backend/src/tests/projects.test.ts`: test que comprueba que `aiInstruction` incluye ambas reglas.

## Decisiones técnicas
- Se añaden como reglas de sistema, igual que las de evaluación y detalle de actividades, para que tengan la misma prioridad.
- **Impacto**: el documento generado será más largo, con más tokens de salida y más tiempo de generación. Si aparecen truncados o timeouts, revisar los límites descritos en `documentation/configuracion_esfuerzo_razonamiento_ia.md`.
- Solo afecta a proyectos nuevos o reintentados; los existentes no se regeneran.

## Verificación
- Pendiente (usuario): `cd backend && npm run test:cov` y generar un proyecto de varios módulos para revisar las rúbricas y los anexos.

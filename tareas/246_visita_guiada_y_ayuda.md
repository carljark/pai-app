# Tarea 246: Visita guiada, bienvenida y menú de Ayuda para docentes

> **Plan:** [246 — Visita guiada y menú de Ayuda para docentes](../planes/246_plan_visita_guiada_y_ayuda.md)

## Propósito
Que un docente sin perfil técnico aprenda a usar Plappin sin ayuda externa:
- una bienvenida, también para los usuarios existentes, donde elige el idioma (castellano o catalán) y puede empezar una visita guiada;
- un botón «Ayuda» en la barra lateral con cuatro visitas cortas, preguntas frecuentes y contacto;
- un proyecto de ejemplo bilingüe y de solo lectura sobre el que se hace la visita del taller.

## Arquitectura y flujo
Detalle completo en `documentation/visita_guiada.md`.

**Backend**
- Progreso por usuario en `User.onboarding` (`welcomeDismissed`, `completedTours`), con `GET` y `PATCH /api/users/me/onboarding`. Solo admite los ids de visita de `data/tours.ts`.
- Proyecto de ejemplo:
  - es un `Project` con `isExample: true`, creado por la migración `50_proyecto_ejemplo` (upsert, se puede reejecutar) a partir de `data/proyecto-ejemplo/` (JSON con los metadatos y Markdown ES/CA);
  - es de solo lectura salvo para administradores (`canEditProject`);
  - queda fuera de los listados gracias al filtro `NOT_EXAMPLE`;
  - cualquiera lo puede exportar a Word y copiar;
  - se sirve en `GET /api/projects/example`.

**Frontend** (`features/help/`)
- `OnboardingFacade`: guarda en signals la bienvenida, el panel y las visitas completadas. Se carga cuando hay un usuario aprobado.
- `TourService`: maneja driver.js. Cambia de pantalla, espera al render con `afterNextRender` y a que lleguen las anclas, omite los pasos sin elemento, guarda la visita completada y registra la telemetría `TOUR_STARTED`, `TOUR_COMPLETED` y `TOUR_ABANDONED`.
- `ExampleProjectService`: abre el ejemplo en el taller por medio de `ProjectsFacade.exampleProject`.
- Componentes: `WelcomeModal` (con selector de idioma), `HelpPanel` y `HelpButton` («?»).
- Visitas declarativas en `tours/tours.ts`, con sus textos en `i18n/help.{es,ca}.ts` y un tipo común `HelpTexts`.
- Anclas `data-tour` en la barra lateral, el generador, el selector curricular, el taller, el aviso de edición y el mapa.

## Archivos modificados
1. `backend/src/models/User.ts`: subdocumento `onboarding`.
2. `backend/src/models/Project.ts`: campo `isExample` y filtro `NOT_EXAMPLE`.
3. `backend/src/data/tours.ts` (nuevo): ids de visita válidos.
4. `backend/src/controllers/onboarding.controller.ts` (nuevo) y `backend/src/routes/user.routes.ts`: endpoints del progreso.
5. `backend/src/services/project-access.service.ts`: el ejemplo solo lo editan los administradores.
6. `backend/src/controllers/project.controller.ts` y `backend/src/routes/project.routes.ts`:
   - `getExampleProject`;
   - exclusión del ejemplo en `listProjects` y en `buildApprovedProjectsContext`.
7. `backend/src/controllers/notification.controller.ts` y `backend/src/services/project-transfer.service.ts`: excluyen el ejemplo.
8. `backend/src/controllers/docx.controller.ts`: el ejemplo se puede exportar aunque no seas el autor.
9. `backend/src/data/proyecto-ejemplo/` (nuevo): JSON de metadatos y contenido en castellano y catalán balear.
10. `backend/src/migrations/50_proyecto_ejemplo.ts` (nueva).
11. `backend/src/tests/onboarding.test.ts` y `backend/src/tests/project-example.test.ts` (nuevos).
12. `frontend/package.json`, `package-lock.json` y `angular.json`: `driver.js` 1.10.2 (versión exacta) y su CSS.
13. `frontend/src/app/features/help/**` (nuevo): modelo, visitas, textos ES/CA, servicios, componentes y sus specs, incluido `tours.integrity.spec.ts`.
14. `frontend/src/app/testing/text-imports.d.ts` (nuevo): tipos para importar plantillas como texto en los tests.
15. `frontend/src/app/app.{ts,html}`: monta la bienvenida y el panel de Ayuda.
16. `frontend/src/app/layout/components/sidebar/*`: botón «Ayuda» y anclas del menú.
17. Generador, selector curricular, taller y mapa (vista, pestañas y selector de vista): anclas `data-tour` y botón «?».
18. `frontend/src/app/features/taller/components/edit-lock-banner/*`: aviso del proyecto de ejemplo con el botón «Hacer una copia».
19. `frontend/src/app/features/projects/` (modelo, mapper, servicio, fachada y `project-access.ts`):
    - campo `isExample`;
    - proyecto sin autor;
    - `getExampleProject` y `exampleProject`;
    - solo lectura del ejemplo.
20. `frontend/src/styles/_tour.scss` (nuevo), `main.scss` y `_layout.scss` (`.app-header-heading`): estilos de los globos y del título con «?».
21. Specs ampliados: barra lateral, aviso de edición, mapa (`TourService` simulado), `project-access`, mapper y `projects.facade`.
22. `documentation/visita_guiada.md` (nuevo).

## Decisiones técnicas
- **driver.js en lugar de una implementación propia.** Ya resuelve el resaltado, la colocación, el teclado y el desplazamiento; es MIT, pesa unos 5 KB y no depende de zone.js.
  - Primero se fijó la 1.8.0 por prudencia (la 1.10.x tenía días). A petición del usuario se actualizó a la **1.10.2**, la última, tras comprobar que la publica el mismo autor que las anteriores (`kamranahmedse`), que no tiene dependencias ni scripts de instalación y que su API (`onDestroyStarted`, `isLastStep`, `getActiveIndex`, textos y progreso) no cambia.
  - Se instaló desde `registry.npmjs.org`, porque el `.npmrc` global apunta a un registro interno que no responde desde esta máquina.
- **Motor inyectable (`TOUR_DRIVER`)** para simularlo en los tests.
- **Progreso en el backend** y no en localStorage: los docentes cambian de ordenador, y «bienvenida para todos» exige saber quién la cerró.
- **«Más tarde» en `sessionStorage`**: así no se guarda nada en el servidor.
- **Proyecto de ejemplo como documento real.** Reutiliza el taller, la exportación, la copia y la solo lectura que ya había, y solo exige filtrarlo de los listados.
- **Textos de ayuda en archivos propios con un tipo común** (`HelpTexts`). Así el compilador garantiza la paridad ES/CA y no crecen `translations.*.ts`.
- **Test de integridad sin `@types/node`**: importa las plantillas con el cargador `text` de esbuild (`with { loader: 'text' }`).
- **Pasos omitidos en lugar de error** si su elemento no está en pantalla (el mapa de la ESO o un panel plegado).
- **El taller no recibe lógica nueva** (ya supera las 200 líneas): solo atributos y el componente `app-help-button`.

## Verificación
- Backend:
  - `npm run typecheck`: sin errores;
  - `npm test`: 41 archivos, 484 tests en verde, con umbrales de cobertura cumplidos.
- Frontend:
  - `npx eslint` de los archivos tocados: limpio;
  - `npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores;
  - `npm test` (lint, tests, cobertura global y por archivo, y comprobación zoneless): 112 archivos, 1096 tests en verde, «All coverage thresholds met» y «Zoneless check passed».
- `npx ng build`: el build de producción se completa.
- Paridad ES/CA del proyecto de ejemplo: la comprueba un test (mismos encabezados y filas de tabla) y el agente `traductor-es-ca` (32 encabezados, 32 filas de tabla y 5 casillas en cada idioma).
- **Despliegue en producción** (22-10-2026) con `./scripts/deploy-prod.sh` del commit `f1a597b`:
  - copia de seguridad previa `pai_db_20261022_211143.archive.gz`;
  - «Migración 50_proyecto_ejemplo completada»;
  - la API y el frontend responden 200.
- **Revisión visual** (segunda iteración, con Docker en local): un script temporal de `playwright-core` con el Chrome del sistema recorrió la bienvenida (ES/CA), el panel de Ayuda y las cuatro visitas completas, a 1366×820 y a 390×844, y se revisaron las capturas. Sin errores de página. Lo que se encontró y se corrigió:
  - el globo del primer paso del taller tapaba el aviso, porque se colocaba antes de terminar el desplazamiento suave → `smoothScroll: false`;
  - el paso del currículo del generador resaltaba una lista más alta que la pantalla → ahora señala el primer módulo;
  - el mapa solo mostraba 2 de los 5 pasos: la visita empezaba al aparecer las pestañas, antes de que llegaran los pasos → ahora espera a todas las anclas (máximo 2 s);
  - los pasos del mapa apuntaban a hosts con `display: contents` (sin caja) → las anclas pasan a la cabecera de cada paso;
  - el «?» del mapa bajaba a otra línea y después partía en dos el selector de vista → ahora va junto al título «Mapa intermodular» y el hueco de las pestañas no se encoge;
  - la etiqueta «✓ Hecha» del panel se partía → `white-space: nowrap`.
- **Segundo despliegue** (22-10-2026) del commit `0105c0f`:
  - copia de seguridad previa `pai_db_20261022_213954.archive.gz`;
  - migraciones al día;
  - la API y el frontend responden.
- **Texto del paso 4 de la visita del taller**: invitaba a pedir cambios al asistente justo cuando, en el proyecto de ejemplo (solo lectura), el asistente está desactivado. Ahora dice «En tus proyectos (o en tu copia de este) podrás pedir cambios al asistente…», en castellano y en catalán.
- Tras los cambios: `npm test` del frontend (112 archivos, 1096 tests, umbrales de cobertura y zoneless) en verde, y `npx ng build` correcto.

## Desviaciones respecto al plan
- **Contenido del ejemplo:** el plan preveía generarlo con la propia app. Se redactó a mano, con el mismo formato que produce el generador y los RA y criterios oficiales del archivo de datos: un proyecto más corto y revisable, sin depender de Docker ni de las claves de IA. La traducción la hizo el agente `traductor-es-ca`.
- **Contenido en Markdown:** el texto va en dos archivos Markdown (ES y CA) junto al JSON de metadatos, en lugar de dentro del JSON.
- **Textos de la ayuda:** van en `features/help/i18n/` en lugar de `translations.*.ts`.
- **Borrado del ejemplo:** `deleteProject` no se tocó, porque ya impedía borrar a quien no es el autor (el ejemplo no tiene autor). Solo un administrador puede borrarlo.
- **Botón «?» del mapa:** en el mapa de FP va junto al título «Mapa intermodular». En el de afinidades de la ESO, que no tiene esa cabecera, va en la fila de pestañas.
